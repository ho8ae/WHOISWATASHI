// src/utils/socket.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 사용자 소켓 매핑 (사용자 ID -> 소켓 ID)
const userSockets = new Map();
// 관리자 소켓 저장 (관리자 ID -> 소켓 ID)
const adminSockets = new Map();
// 활성 채팅방 관리 (채팅방 ID -> {userId, adminId, lastMessage})
const activeChats = new Map();

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // 소켓 연결 인증 미들웨어
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // JWT 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 사용자 조회
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true }
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      // 소켓 객체에 사용자 정보 저장
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      return next(new Error('Authentication error'));
    }
  });

  // 소켓 연결 이벤트 처리
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // 사용자 정보 가져오기
    const user = socket.user;
    
    // 사용자 소켓 저장
    if (user.role === 'admin') {
      adminSockets.set(user.id, socket.id);
      console.log(`Admin connected: ${user.name} (${user.id})`);
      
      // 관리자에게 활성 채팅방 목록 전송
      socket.emit('active_chats', Array.from(activeChats.values()));
    } else {
      userSockets.set(user.id, socket.id);
      console.log(`User connected: ${user.name} (${user.id})`);
    }
    
    // 1. 알림 기능 관련 이벤트 처리
    socket.on('read_notification', async (notificationId) => {
      try {
        // 알림 읽음 처리
        await prisma.notification.update({
          where: { id: parseInt(notificationId) },
          data: { isRead: true }
        });
        
        // 읽지 않은 알림 갯수 조회
        const unreadCount = await prisma.notification.count({
          where: {
            userId: user.id,
            isRead: false
          }
        });
        
        // 알림 읽음 상태 및 개수 업데이트
        socket.emit('unread_count', { count: unreadCount });
      } catch (error) {
        console.error('알림 읽음 처리 오류:', error);
        socket.emit('error', { message: '알림 업데이트 중 오류가 발생했습니다.' });
      }
    });
    
    // 2. 채팅 기능 관련 이벤트 처리
    // 채팅방 생성/참여
    socket.on('join_chat', async (chatId) => {
      try {
        socket.join(`chat_${chatId}`);
        console.log(`User ${user.id} joined chat ${chatId}`);
        
        // 채팅 기록 조회
        const messages = await prisma.chatMessage.findMany({
          where: { chatId: parseInt(chatId) },
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { id: true, name: true, role: true }
            }
          }
        });
        
        // 채팅 기록 전송
        socket.emit('chat_history', messages);
        
        // 읽지 않은 메시지 읽음 처리
        await prisma.chatMessage.updateMany({
          where: {
            chatId: parseInt(chatId),
            senderId: { not: user.id },
            isRead: false
          },
          data: { isRead: true }
        });
      } catch (error) {
        console.error('채팅방 참여 오류:', error);
        socket.emit('error', { message: '채팅방 참여 중 오류가 발생했습니다.' });
      }
    });
    
    // 메시지 전송
    socket.on('send_message', async (data) => {
      try {
        const { chatId, message } = data;
        
        // 메시지 저장
        const newMessage = await prisma.chatMessage.create({
          data: {
            chatId: parseInt(chatId),
            senderId: user.id,
            message,
          },
          include: {
            sender: {
              select: { id: true, name: true, role: true }
            }
          }
        });
        
        // 채팅방에 메시지 브로드캐스트
        io.to(`chat_${chatId}`).emit('new_message', newMessage);
        
        // 채팅방 정보 업데이트
        const chat = await prisma.chat.findUnique({
          where: { id: parseInt(chatId) },
          include: {
            user: {
              select: { id: true, name: true }
            },
            admin: {
              select: { id: true, name: true }
            }
          }
        });
        
        if (chat) {
          // 활성 채팅방 업데이트
          activeChats.set(chatId.toString(), {
            id: chat.id,
            userId: chat.userId,
            adminId: chat.adminId,
            userName: chat.user.name,
            adminName: chat.admin?.name,
            lastMessage: message,
            updatedAt: new Date().toISOString(),
            status: chat.status
          });
          
          // 상대방이 오프라인이면 알림 생성
          const recipientId = user.role === 'admin' ? chat.userId : chat.adminId;
          const recipientSocketId = user.role === 'admin' 
            ? userSockets.get(chat.userId) 
            : (chat.adminId ? adminSockets.get(chat.adminId) : null);
            
          if (recipientId && !recipientSocketId) {
            // 상대방이 오프라인 상태면 알림 생성
            await prisma.notification.create({
              data: {
                userId: recipientId,
                type: 'chat',
                title: '새 메시지 알림',
                message: `${user.name}님의 메시지: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
                targetId: chat.id,
                targetType: 'chat',
                actionUrl: `/chat/${chat.id}`
              }
            });
          }
        }
      } catch (error) {
        console.error('메시지 전송 오류:', error);
        socket.emit('error', { message: '메시지 전송 중 오류가 발생했습니다.' });
      }
    });
    
    // 새 채팅 시작 (사용자)
    socket.on('start_chat', async (data) => {
      try {
        const { subject } = data;
        
        // 이미 해결되지 않은 채팅이 있는지 확인
        const existingChat = await prisma.chat.findFirst({
          where: {
            userId: user.id,
            status: { not: 'closed' }
          }
        });
        
        let chat;
        if (existingChat) {
          chat = existingChat;
        } else {
          // 새 채팅방 생성
          chat = await prisma.chat.create({
            data: {
              userId: user.id,
              subject: subject || '고객 문의',
              status: 'pending'
            }
          });
          
          // 시스템 메시지 추가
          await prisma.chatMessage.create({
            data: {
              chatId: chat.id,
              senderId: user.id,
              message: '채팅이 시작되었습니다.',
              isSystem: true
            }
          });
        }
        
        // 채팅방 참여
        socket.join(`chat_${chat.id}`);
        
        // 채팅방 정보 전송
        socket.emit('chat_created', {
          id: chat.id,
          subject: chat.subject,
          status: chat.status,
          createdAt: chat.createdAt
        });
        
        // 활성 채팅방에 추가
        activeChats.set(chat.id.toString(), {
          id: chat.id,
          userId: user.id,
          userName: user.name,
          subject: chat.subject,
          status: chat.status,
          createdAt: chat.createdAt
        });
        
        // 모든 관리자에게 새 채팅 알림
        if (chat.status === 'pending') {
          for (const [adminId, socketId] of adminSockets.entries()) {
            io.to(socketId).emit('new_chat', {
              id: chat.id,
              userId: user.id,
              userName: user.name,
              subject: chat.subject,
              status: chat.status,
              createdAt: chat.createdAt
            });
          }
        }
      } catch (error) {
        console.error('채팅 시작 오류:', error);
        socket.emit('error', { message: '채팅 시작 중 오류가 발생했습니다.' });
      }
    });
    
    // 관리자: 채팅 참여
    socket.on('admin_join_chat', async (chatId) => {
      try {
        // 관리자 권한 확인
        if (user.role !== 'admin') {
          return socket.emit('error', { message: '권한이 없습니다.' });
        }
        
        // 채팅방 찾기
        const chat = await prisma.chat.findUnique({
          where: { id: parseInt(chatId) }
        });
        
        if (!chat) {
          return socket.emit('error', { message: '채팅방을 찾을 수 없습니다.' });
        }
        
        // 채팅방 참여 및 상태 업데이트
        await prisma.chat.update({
          where: { id: parseInt(chatId) },
          data: {
            adminId: user.id,
            status: 'in_progress'
          }
        });
        
        socket.join(`chat_${chatId}`);
        
        // 시스템 메시지 추가
        const systemMessage = await prisma.chatMessage.create({
          data: {
            chatId: parseInt(chatId),
            senderId: user.id,
            message: `${user.name} 관리자가 채팅에 참여했습니다.`,
            isSystem: true
          },
          include: {
            sender: {
              select: { id: true, name: true, role: true }
            }
          }
        });
        
        // 사용자에게 관리자 참여 알림
        const userSocketId = userSockets.get(chat.userId);
        if (userSocketId) {
          io.to(userSocketId).emit('admin_joined', {
            chatId,
            adminId: user.id,
            adminName: user.name
          });
        }
        
        // 채팅방에 시스템 메시지 브로드캐스트
        io.to(`chat_${chatId}`).emit('new_message', systemMessage);
        
        // 활성 채팅방 정보 업데이트
        const chatInfo = activeChats.get(chatId.toString()) || {};
        activeChats.set(chatId.toString(), {
          ...chatInfo,
          adminId: user.id,
          adminName: user.name,
          status: 'in_progress'
        });
      } catch (error) {
        console.error('관리자 채팅 참여 오류:', error);
        socket.emit('error', { message: '채팅 참여 중 오류가 발생했습니다.' });
      }
    });
    
    // 채팅 종료
    socket.on('close_chat', async (chatId) => {
      try {
        // 채팅방 조회
        const chat = await prisma.chat.findUnique({
          where: { id: parseInt(chatId) }
        });
        
        if (!chat) {
          return socket.emit('error', { message: '채팅방을 찾을 수 없습니다.' });
        }
        
        // 권한 확인
        if (user.role !== 'admin' && chat.userId !== user.id) {
          return socket.emit('error', { message: '권한이 없습니다.' });
        }
        
        // 채팅방 상태 업데이트
        await prisma.chat.update({
          where: { id: parseInt(chatId) },
          data: { status: 'closed' }
        });
        
        // 시스템 메시지 추가
        const systemMessage = await prisma.chatMessage.create({
          data: {
            chatId: parseInt(chatId),
            senderId: user.id,
            message: '채팅이 종료되었습니다.',
            isSystem: true
          },
          include: {
            sender: {
              select: { id: true, name: true, role: true }
            }
          }
        });
        
        // 채팅방에 종료 메시지 브로드캐스트
        io.to(`chat_${chatId}`).emit('new_message', systemMessage);
        io.to(`chat_${chatId}`).emit('chat_closed', { chatId });
        
        // 활성 채팅방에서 제거
        activeChats.delete(chatId.toString());
      } catch (error) {
        console.error('채팅 종료 오류:', error);
        socket.emit('error', { message: '채팅 종료 중 오류가 발생했습니다.' });
      }
    });
    
    // 연결 해제 이벤트
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      if (user) {
        if (user.role === 'admin') {
          adminSockets.delete(user.id);
        } else {
          userSockets.delete(user.id);
        }
      }
    });
  });
  
  return io;
}

module.exports = { setupSocket, userSockets, adminSockets, activeChats };