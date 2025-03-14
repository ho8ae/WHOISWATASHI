const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMyChats(userId) {
  return await prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
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
}

async function getAllChats(status) {
  const where = {};
  
  if (status) {
    where.status = status;
  }
  
  return await prisma.chat.findMany({
    where,
    orderBy: [
      { status: 'asc' },
      { updatedAt: 'desc' }
    ],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
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
}

async function getChatById(id, userId, isAdmin) {
  const where = { id: parseInt(id) };
  
  // 관리자가 아닌 경우 자신의 채팅만 조회 가능
  if (!isAdmin) {
    where.userId = userId;
  }
  
  return await prisma.chat.findFirst({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      admin: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
}

async function getChatMessages(id, userId, isAdmin) {
  // 권한 확인
  const chat = await prisma.chat.findUnique({
    where: { id: parseInt(id) }
  });
  
  if (!chat) {
    throw new Error('채팅을 찾을 수 없습니다.');
  }
  
  if (!isAdmin && chat.userId !== userId) {
    throw new Error('권한이 없습니다.');
  }
  
  // 메시지 조회
  const messages = await prisma.chatMessage.findMany({
    where: { chatId: parseInt(id) },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          role: true
        }
      }
    }
  });
  
  // 읽지 않은 메시지 읽음 처리
  await prisma.chatMessage.updateMany({
    where: {
      chatId: parseInt(id),
      senderId: { not: userId },
      isRead: false
    },
    data: { isRead: true }
  });
  
  return messages;
}

module.exports = {
  getMyChats,
  getAllChats,
  getChatById,
  getChatMessages
};