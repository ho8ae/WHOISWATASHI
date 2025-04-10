// src/utils/socket.js
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 사용자 소켓 매핑 (사용자 ID -> 소켓 ID)
const userSockets = new Map();
// 관리자 소켓 저장 (관리자 ID -> 소켓 ID)
const adminSockets = new Map();
// 활성 채팅방 관리 (채팅방 ID -> {userId, adminId, lastMessage})
const activeChats = new Map();

/**
 * 대기 중인 채팅방 로드 (관리자용)
 */
async function loadPendingChats(socket) {
  try {
    const pendingChats = await prisma.chat.findMany({
      where: {
        status: 'pending'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // 활성 채팅방 맵에 추가 및 관리자에게 전송
    pendingChats.forEach(chat => {
      const lastMessage = chat.messages[0]?.message || '';
      
      activeChats.set(chat.id.toString(), {
        id: chat.id,
        userId: chat.userId,
        userName: chat.user.name,
        subject: chat.subject,
        status: chat.status,
        lastMessage,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      });
    });

    // 대기 중인 채팅 목록 전송
    socket.emit('pending_chats', pendingChats.map(chat => ({
      id: chat.id,
      userId: chat.userId,
      userName: chat.user.name,
      subject: chat.subject,
      status: chat.status,
      lastMessage: chat.messages[0]?.message || '',
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    })));
  } catch (error) {
    console.error('대기 중인 채팅 로드 오류:', error);
  }
}

/**
 * 사용자의 활성화된 채팅방 로드
 */
async function loadUserActiveChats(socket, userId) {
  try {
    const userChats = await prisma.chat.findMany({
      where: {
        userId,
        status: { not: 'closed' }
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (userChats.length > 0) {
      // 사용자에게 활성 채팅방 정보 전송
      socket.emit('user_active_chats', userChats.map(chat => ({
        id: chat.id,
        subject: chat.subject,
        status: chat.status,
        adminId: chat.adminId,
        adminName: chat.admin?.name,
        lastMessage: chat.messages[0]?.message || '',
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      })));

      // 각 채팅방에 사용자 조인
      userChats.forEach(chat => {
        socket.join(`chat_${chat.id}`);
      });
    }
  } catch (error) {
    console.error('사용자 활성 채팅 로드 오류:', error);
  }
}

function setupSocket(server) {
  console.log('Socket.io 서버 설정 중...');
  
  // CORS 설정 추가
  const io = new Server(server, {
    cors: {
      origin: "*", // 클라이언트 URL
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"]
    },
    // 추가 설정
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  console.log('Socket.io 서버 설정 완료');
  console.log('CORS 설정:', process.env.CLIENT_URL || "http://localhost:3000");

  // 소켓 연결 인증 미들웨어
  io.use(async (socket, next) => {
    try {
      console.log('Socket auth attempt:', socket.id);
      const token = socket.handshake.auth.token;
      
      if (!token) {
        console.log('Socket auth failed: No token');
        return next(new Error("Authentication error: No token provided"));
      }

      // JWT 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded.userId);

      // 사용자 조회
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true },
      });

      if (!user) {
        console.log('Socket auth failed: User not found');
        return next(new Error("User not found"));
      }

      // 소켓 객체에 사용자 정보 저장
      socket.user = user;
      console.log(`Socket authenticated: ${socket.id} (${user.name}, ${user.role})`);
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      return next(new Error("Authentication error: " + error.message));
    }
  });

  // 소켓 연결 이벤트 처리
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}, name: ${socket.user?.name}, role: ${socket.user?.role}`);

    // 사용자 정보 가져오기
    const user = socket.user;

    // 사용자 소켓 저장
    if (user.role === "admin") {
      adminSockets.set(user.id, socket.id);
      console.log(`Admin connected: ${user.name} (${user.id})`);

      // 관리자에게 활성 채팅방 목록 전송
      socket.emit("active_chats", Array.from(activeChats.values()));
      
      // 관리자 연결 시 대기 중인 채팅방 목록 로드
      loadPendingChats(socket);
    } else {
      userSockets.set(user.id, socket.id);
      console.log(`User connected: ${user.name} (${user.id})`);
      
      // 사용자 연결 시 활성화된 채팅방 정보 로드
      loadUserActiveChats(socket, user.id);
    }

    // 채팅방 참여
    socket.on("join_chat", async (chatId) => {
      try {
        chatId = parseInt(chatId); // 문자열로 전송된 경우를 대비해 숫자로 변환
        
        if (isNaN(chatId)) {
          throw new Error('Invalid chat ID');
        }
        
        socket.join(`chat_${chatId}`);
        console.log(`User ${user.id} joined chat ${chatId}`);

        // 채팅 기록 조회
        const messages = await prisma.chatMessage.findMany({
          where: { chatId },
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: { id: true, name: true, role: true },
            },
          },
        });

        // 채팅 기록 전송
        console.log(`Sending chat history (${messages.length} messages) to ${socket.id}`);
        socket.emit("chat_history", messages);

        // 읽지 않은 메시지 읽음 처리
        if (messages.length > 0) {
          await prisma.chatMessage.updateMany({
            where: {
              chatId,
              senderId: { not: user.id },
              isRead: false,
            },
            data: { isRead: true },
          });
        }
      } catch (error) {
        console.error("채팅방 참여 오류:", error);
        socket.emit("error", {
          message: "채팅방 참여 중 오류가 발생했습니다: " + error.message,
        });
      }
    });

    // 메시지 전송
    socket.on("send_message", async (data) => {
      try {
        const { chatId, message } = data;
        
        // 유효성 검사
        if (!chatId || !message) {
          throw new Error('Missing required fields: chatId or message');
        }
        
        const parsedChatId = parseInt(chatId);
        if (isNaN(parsedChatId)) {
          throw new Error('Invalid chat ID format');
        }

        console.log(`User ${user.id} sending message to chat ${parsedChatId}: ${message.substring(0, 30)}...`);

        // 메시지 저장
        const newMessage = await prisma.chatMessage.create({
          data: {
            chatId: parsedChatId,
            senderId: user.id,
            message,
            isRead: false
          },
          include: {
            sender: {
              select: { id: true, name: true, role: true },
            },
          },
        });
        
        console.log(`Message saved with ID ${newMessage.id}`);

        // 채팅방에 메시지 브로드캐스트
        io.to(`chat_${parsedChatId}`).emit("new_message", newMessage);
        console.log(`Broadcasted message to chat_${parsedChatId}`);

        // 채팅방 정보 업데이트
        const chat = await prisma.chat.findUnique({
          where: { id: parsedChatId },
          include: {
            user: {
              select: { id: true, name: true },
            },
            admin: {
              select: { id: true, name: true },
            },
          },
        });

        if (chat) {
          // 채팅 상태 업데이트 (pending 상태의 경우 메시지 전송 시 in_progress로 변경)
          if (chat.status === 'pending' && user.role === 'admin') {
            await prisma.chat.update({
              where: { id: parsedChatId },
              data: { 
                status: 'in_progress',
                adminId: user.id 
              }
            });
            console.log(`Updated chat ${parsedChatId} status to in_progress`);
          }

          // 현재 시간으로 업데이트
          await prisma.chat.update({
            where: { id: parsedChatId },
            data: { updatedAt: new Date() }
          });

          // 활성 채팅방 업데이트
          activeChats.set(chatId.toString(), {
            id: chat.id,
            userId: chat.userId,
            adminId: chat.adminId || (user.role === 'admin' ? user.id : null),
            userName: chat.user.name,
            adminName: chat.admin?.name || (user.role === 'admin' ? user.name : null),
            subject: chat.subject,
            lastMessage: message,
            updatedAt: new Date().toISOString(),
            status: chat.status === 'pending' && user.role === 'admin' ? 'in_progress' : chat.status,
          });

          // 상대방이 오프라인이면 알림 생성
          const recipientId = user.role === "admin" ? chat.userId : chat.adminId;
          const recipientSocketId = user.role === "admin"
            ? userSockets.get(chat.userId)
            : chat.adminId ? adminSockets.get(chat.adminId) : null;

          if (recipientId && !recipientSocketId) {
            // 상대방이 오프라인 상태면 알림 생성
            console.log(`Recipient ${recipientId} is offline, creating notification`);
            await prisma.notification.create({
              data: {
                userId: recipientId,
                type: "chat",
                title: "새 메시지 알림",
                message: `${user.name}님의 메시지: ${message.substring(0, 50)}${
                  message.length > 50 ? "..." : ""
                }`,
                targetId: chat.id,
                targetType: "chat",
                actionUrl: `/chat/${chat.id}`,
              },
            });
          }
        }
      } catch (error) {
        console.error("메시지 전송 오류:", error);
        socket.emit("error", {
          message: "메시지 전송 중 오류가 발생했습니다: " + error.message,
        });
      }
    });


    //여기까지

    // 새 채팅 시작 (사용자)
    socket.on("start_chat", async (data) => {
      try {
        const { subject, initialMessage } = data;

        if (!subject) {
          return socket.emit("error", { message: "채팅 제목은 필수입니다." });
        }

        // 이미 해결되지 않은 채팅이 있는지 확인
        const existingChat = await prisma.chat.findFirst({
          where: {
            userId: user.id,
            status: { not: "closed" },
          },
        });

        let chat;
        if (existingChat) {
          chat = existingChat;
          socket.emit("error", { message: "이미 진행 중인 채팅이 있습니다." });
        } else {
          // 새 채팅방 생성
          chat = await prisma.chat.create({
            data: {
              userId: user.id,
              subject: subject,
              status: "pending",
            },
          });

          // 시스템 메시지 추가
          await prisma.chatMessage.create({
            data: {
              chatId: chat.id,
              senderId: user.id,
              message: "채팅이 시작되었습니다.",
              isSystem: true,
            },
          });

          // 초기 메시지가 있는 경우 추가
          if (initialMessage) {
            await prisma.chatMessage.create({
              data: {
                chatId: chat.id,
                senderId: user.id,
                message: initialMessage,
              },
            });
          }

          // 채팅방 참여
          socket.join(`chat_${chat.id}`);

          // 채팅방 정보 전송
          socket.emit("chat_created", {
            id: chat.id,
            subject: chat.subject,
            status: chat.status,
            createdAt: chat.createdAt,
          });

          // 활성 채팅방에 추가
          activeChats.set(chat.id.toString(), {
            id: chat.id,
            userId: user.id,
            userName: user.name,
            subject: chat.subject,
            status: chat.status,
            lastMessage: initialMessage || "채팅이 시작되었습니다.",
            createdAt: chat.createdAt,
            updatedAt: chat.createdAt,
          });

          // 모든 관리자에게 새 채팅 알림
          for (const [adminId, socketId] of adminSockets.entries()) {
            io.to(socketId).emit("new_chat", {
              id: chat.id,
              userId: user.id,
              userName: user.name,
              subject: chat.subject,
              status: chat.status,
              lastMessage: initialMessage || "채팅이 시작되었습니다.",
              createdAt: chat.createdAt,
            });
          }
        }
      } catch (error) {
        console.error("채팅 시작 오류:", error);
        socket.emit("error", { message: "채팅 시작 중 오류가 발생했습니다." });
      }
    });

    // 관리자: 채팅 참여
    socket.on("admin_join_chat", async (chatId) => {
      try {
        // 관리자 권한 확인
        if (user.role !== "admin") {
          return socket.emit("error", { message: "권한이 없습니다." });
        }

        // 채팅방 찾기
        const chat = await prisma.chat.findUnique({
          where: { id: parseInt(chatId) },
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        });

        if (!chat) {
          return socket.emit("error", {
            message: "채팅방을 찾을 수 없습니다.",
          });
        }

        // 채팅방 참여 및 상태 업데이트
        await prisma.chat.update({
          where: { id: parseInt(chatId) },
          data: {
            adminId: user.id,
            status: "in_progress",
          },
        });

        socket.join(`chat_${chatId}`);


        // 너무 많은 메세지로 추가 일단 보류
        // // 시스템 메시지 추가
        // const systemMessage = await prisma.chatMessage.create({
        //   data: {
        //     chatId: parseInt(chatId),
        //     senderId: user.id,
        //     message: `${user.name} 관리자가 채팅에 참여했습니다.`,
        //     isSystem: true,
        //   },
        //   include: {
        //     sender: {
        //       select: { id: true, name: true, role: true },
        //     },
        //   },
        // });

        // 사용자에게 관리자 참여 알림
        const userSocketId = userSockets.get(chat.userId);
        if (userSocketId) {
          io.to(userSocketId).emit("admin_joined", {
            chatId,
            adminId: user.id,
            adminName: user.name,
          });
        }

        // 채팅방에 시스템 메시지 브로드캐스트
        io.to(`chat_${chatId}`).emit("new_message", systemMessage);

        // 활성 채팅방 정보 업데이트
        const chatInfo = activeChats.get(chatId.toString()) || {};
        activeChats.set(chatId.toString(), {
          ...chatInfo,
          adminId: user.id,
          adminName: user.name,
          status: "in_progress",
        });
        
        // 다른 관리자들에게 이 채팅방이 처리 중임을 알림
        for (const [adminId, socketId] of adminSockets.entries()) {
          if (adminId !== user.id) {
            io.to(socketId).emit("chat_assigned", {
              chatId,
              adminId: user.id,
              adminName: user.name,
            });
          }
        }
      } catch (error) {
        console.error("관리자 채팅 참여 오류:", error);
        socket.emit("error", { message: "채팅 참여 중 오류가 발생했습니다." });
      }
    });

    // 채팅 종료
    socket.on("close_chat", async (chatId) => {
      try {
        // 채팅방 조회
        const chat = await prisma.chat.findUnique({
          where: { id: parseInt(chatId) },
        });

        if (!chat) {
          return socket.emit("error", {
            message: "채팅방을 찾을 수 없습니다.",
          });
        }

        // 권한 확인
        if (user.role !== "admin" && chat.userId !== user.id) {
          return socket.emit("error", { message: "권한이 없습니다." });
        }

        // 채팅방 상태 업데이트
        await prisma.chat.update({
          where: { id: parseInt(chatId) },
          data: { status: "closed" },
        });

        // 시스템 메시지 추가
        const systemMessage = await prisma.chatMessage.create({
          data: {
            chatId: parseInt(chatId),
            senderId: user.id,
            message: "채팅이 종료되었습니다.",
            isSystem: true,
          },
          include: {
            sender: {
              select: { id: true, name: true, role: true },
            },
          },
        });

        // 채팅방에 종료 메시지 브로드캐스트
        io.to(`chat_${chatId}`).emit("new_message", systemMessage);
        io.to(`chat_${chatId}`).emit("chat_closed", { chatId });

        // 활성 채팅방에서 제거
        activeChats.delete(chatId.toString());
      } catch (error) {
        console.error("채팅 종료 오류:", error);
        socket.emit("error", { message: "채팅 종료 중 오류가 발생했습니다." });
      }
    });

    // 사용자 타이핑 중 이벤트
    socket.on("typing", (data) => {
      const { chatId, isTyping } = data;
      
      // 같은 채팅방의 다른 참여자들에게 타이핑 상태 전송
      socket.to(`chat_${chatId}`).emit("user_typing", {
        chatId,
        userId: user.id,
        userName: user.name,
        isTyping
      });
    });

    // 연결 해제 이벤트
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      if (user) {
        if (user.role === "admin") {
          adminSockets.delete(user.id);
        } else {
          userSockets.delete(user.id);
        }
      }
    });
  });

  return io;
}

/**
 * 오래된 종료된 채팅방 정리 (30일 이상 지난 채팅)
 */
async function cleanupOldChats() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = await prisma.chat.deleteMany({
      where: {
        status: 'closed',
        updatedAt: { lt: thirtyDaysAgo }
      }
    });
    
    console.log(`${result.count}개의 오래된 채팅방이 정리되었습니다.`);
    return result.count;
  } catch (error) {
    console.error('채팅방 정리 오류:', error);
    return 0;
  }
}

module.exports = { 
  setupSocket, 
  userSockets, 
  adminSockets, 
  activeChats,
  cleanupOldChats
};