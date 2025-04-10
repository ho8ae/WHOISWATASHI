const chatService = require('./chat.service');

// 내 채팅 목록 조회
async function getMyChats(req, res, next) {
  try {
    const userId = req.user.id;
    const chats = await chatService.getMyChats(userId);
    
    res.json({
      success: true,
      data: chats
    });
  } catch (error) {
    next(error);
  }
}

// 관리자: 모든 채팅 목록 조회
async function getAllChats(req, res, next) {
  try {
    const { status } = req.query;
    const chats = await chatService.getAllChats(status);
    
    res.json({
      success: true,
      data: chats
    });
  } catch (error) {
    next(error);
  }
}

// 채팅 상세 조회
async function getChatById(req, res, next) {
  try {
    const chatId = req.params.id;
    
    // 유저 ID가 존재하는지 확인
    const userId = req.user?.id;
    
    // chatId가 없는 경우 체크
    if (!chatId) {
      return res.status(400).json({ message: '채팅 ID가 필요합니다.' });
    }
    
    // userId와 함께 명시적으로 chatId 전달
    const chat = await chatService.getChatById(chatId, userId);
    
    if (!chat) {
      return res.status(404).json({ message: '채팅을 찾을 수 없습니다.' });
    }
    
    res.json({
      success: true,
      data: chat
    });

    return res.json({ data: chat });
  } catch (error) {
    console.error('Error getting chat:', error);
    return res.status(500).json({ message: '채팅 조회 중 오류가 발생했습니다.' });
  }
}

// 채팅 메시지 목록 조회
async function getChatMessages(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    const messages = await chatService.getChatMessages(id, userId, isAdmin);
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
}

// 새 채팅 생성
async function createChat(req, res, next) {
  try {
    const { subject, initialMessage } = req.body;
    const userId = req.user.id;
    
    if (!subject || !initialMessage) {
      return res.status(400).json({
        success: false,
        message: '제목과 메시지는 필수 항목입니다.'
      });
    }

    const chat = await chatService.createChat(userId, subject, initialMessage);
    
    res.status(201).json({
      success: true,
      data: chat,
      message: '채팅이 생성되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

// 메시지 전송
async function sendMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: '메시지 내용은 필수 항목입니다.'
      });
    }

    const message = await chatService.sendMessage(id, userId, content);
    
    res.status(201).json({
      success: true,
      data: message,
      message: '메시지가 전송되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

// 채팅 상태 변경
async function updateChatStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!status || !['pending', 'in_progress', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '유효한 상태값이 아닙니다.'
      });
    }

    const chat = await chatService.updateChatStatus(id, status, userId, isAdmin);
    
    res.json({
      success: true,
      data: chat,
      message: '채팅 상태가 변경되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

// 관리자 배정
async function assignAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const { adminId } = req.body;
    
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: '관리자 ID는 필수 항목입니다.'
      });
    }

    const chat = await chatService.assignAdmin(id, adminId);
    
    res.json({
      success: true,
      data: chat,
      message: '관리자가 배정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 오래된 채팅 정리 (관리자용)
 */
async function cleanupOldChats(req, res, next) {
  try {
    const { cleanupDays } = req.body;
    
    // 기본값은 30일
    const daysToCleanup = cleanupDays ? parseInt(cleanupDays) : 30;
    
    if (daysToCleanup < 1) {
      return res.status(400).json({
        success: false,
        message: '정리할 일수는 최소 1일 이상이어야 합니다.'
      });
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToCleanup);
    
    const result = await prisma.chat.deleteMany({
      where: {
        status: 'closed',
        updatedAt: { lt: cutoffDate }
      }
    });
    
    res.json({
      success: true,
      data: {
        cleanedCount: result.count,
        daysToCleanup
      },
      message: `${result.count}개의 오래된 채팅이 정리되었습니다.`
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 읽지 않은 메시지 수 조회
 */
async function getUnreadCount(req, res, next) {
  try {
    const userId = req.user.id;
    
    // 사용자에게 온 읽지 않은 메시지 수 조회
    const unreadCount = await prisma.chatMessage.count({
      where: {
        chat: {
          OR: [
            { userId },
            { adminId: userId }
          ]
        },
        senderId: { not: userId },
        isRead: false
      }
    });
    
    res.json({
      success: true,
      data: {
        unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMyChats,
  getAllChats,
  getChatById,
  getChatMessages,
  createChat,
  sendMessage,
  updateChatStatus,
  assignAdmin,
  cleanupOldChats,
  getUnreadCount
};