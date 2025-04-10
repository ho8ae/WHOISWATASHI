const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 사용자의 채팅 목록 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 채팅 목록
 */
async function getMyChats(userId) {
  return await prisma.chat.findMany({
    where: { 
      userId,
      // 30일 이상 지난 closed 상태의 채팅은 제외
      OR: [
        { status: { not: 'closed' } },
        { 
          AND: [
            { status: 'closed' },
            { updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
          ]
        }
      ]
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      admin: {
        select: {
          id: true,
          name: true
        }
      },
      user: {
        select: {
          id: true,
          name: true
        }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      }
    }
  });
}

/**
 * 관리자용 모든 채팅 목록 조회
 * @param {string} status - 채팅 상태 필터 (optional)
 * @returns {Promise<Array>} 채팅 목록
 */
async function getAllChats(status) {
  const where = {};
  
  if (status) {
    where.status = status;
  }
  
  // 기본적으로 30일 이상 지난 closed 상태의 채팅은 제외
  if (!status || status !== 'closed') {
    where.OR = [
      { status: { not: 'closed' } },
      { 
        AND: [
          { status: 'closed' },
          { updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
        ]
      }
    ];
  } else if (status === 'closed') {
    // closed 상태를 명시적으로 요청한 경우 최근 30일 내의 closed 채팅만 반환
    where.updatedAt = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
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
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      }
    }
  });
}

/**
 * 채팅 상세 정보 조회
 * @param {number} id - 채팅 ID
 * @param {number} userId - 사용자 ID
 * @param {boolean} isAdmin - 관리자 여부
 * @returns {Promise<Object>} 채팅 정보
 */
async function getChatById(chatId, userId) {
  const where = { id: Number(chatId) }; // id를 명시적으로 추가
  
  // 사용자 권한에 따라 where 조건 추가
  if (userId && !isAdmin(userId)) {
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

/**
 * 채팅 메시지 목록 조회
 * @param {number} id - 채팅 ID
 * @param {number} userId - 사용자 ID
 * @param {boolean} isAdmin - 관리자 여부
 * @returns {Promise<Array>} 메시지 목록
 */
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

/**
 * 새 채팅 생성
 * @param {number} userId - 사용자 ID
 * @param {string} subject - 채팅 제목
 * @param {string} initialMessage - 첫 메시지
 * @returns {Promise<Object>} 생성된 채팅 정보
 */
async function createChat(userId, subject, initialMessage) {
  // 트랜잭션으로 채팅방 생성 및 첫 메시지 생성
  return await prisma.$transaction(async (tx) => {
    // 이미 진행 중인 채팅이 있는지 확인
    const existingChat = await tx.chat.findFirst({
      where: {
        userId,
        status: { in: ['pending', 'in_progress'] }
      }
    });

    if (existingChat) {
      throw new Error('이미 진행 중인 채팅이 있습니다.');
    }

    // 새 채팅방 생성
    const chat = await tx.chat.create({
      data: {
        userId,
        subject,
        status: 'pending'
      }
    });

    // 첫 메시지 저장
    await tx.chatMessage.create({
      data: {
        chatId: chat.id,
        senderId: userId,
        message: initialMessage,
        isRead: false
      }
    });

    // 생성된 채팅방 정보 반환
    return await tx.chat.findUnique({
      where: { id: chat.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  });
}

/**
 * 메시지 전송
 * @param {number} chatId - 채팅 ID
 * @param {number} senderId - 발신자 ID
 * @param {string} message - 메시지 내용
 * @returns {Promise<Object>} 생성된 메시지 정보
 */
async function sendMessage(chatId, senderId, message) {
  // 채팅 존재 여부 확인
  const chat = await prisma.chat.findUnique({
    where: { id: parseInt(chatId) }
  });

  if (!chat) {
    throw new Error('채팅을 찾을 수 없습니다.');
  }

  // 채팅이 닫혀있는지 확인
  if (chat.status === 'closed') {
    throw new Error('종료된 채팅입니다.');
  }

  // 메시지 저장
  const newMessage = await prisma.chatMessage.create({
    data: {
      chatId: parseInt(chatId),
      senderId,
      message,
      isRead: false
    },
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

  // 채팅 상태 및 수정 시간 업데이트
  await prisma.chat.update({
    where: { id: parseInt(chatId) },
    data: {
      status: chat.status === 'pending' ? 'in_progress' : chat.status,
      updatedAt: new Date()
    }
  });

  return newMessage;
}

/**
 * 채팅 상태 변경
 * @param {number} chatId - 채팅 ID
 * @param {string} status - 변경할 상태
 * @param {number} userId - 사용자 ID
 * @param {boolean} isAdmin - 관리자 여부
 * @returns {Promise<Object>} 업데이트된 채팅 정보
 */
async function updateChatStatus(chatId, status, userId, isAdmin) {
  const chat = await prisma.chat.findUnique({
    where: { id: parseInt(chatId) }
  });

  if (!chat) {
    throw new Error('채팅을 찾을 수 없습니다.');
  }

  // 권한 확인 (관리자 또는 자신의 채팅)
  if (!isAdmin && chat.userId !== userId) {
    throw new Error('권한이 없습니다.');
  }

  // 고객은 채팅을 닫을 수만 있음
  if (!isAdmin && status !== 'closed') {
    throw new Error('권한이 없습니다.');
  }

  // 상태 변경
  const updatedChat = await prisma.chat.update({
    where: { id: parseInt(chatId) },
    data: { status },
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

  // 상태 변경 시스템 메시지 추가
  let statusMessage = '';
  switch (status) {
    case 'in_progress':
      statusMessage = '상담이 시작되었습니다.';
      break;
    case 'closed':
      statusMessage = '상담이 종료되었습니다.';
      break;
    default:
      statusMessage = `상담 상태가 ${status}로 변경되었습니다.`;
  }

  await prisma.chatMessage.create({
    data: {
      chatId: parseInt(chatId),
      senderId: userId,
      message: statusMessage,
      isSystem: true,
      isRead: true
    }
  });

  return updatedChat;
}

/**
 * 관리자 배정
 * @param {number} chatId - 채팅 ID
 * @param {number} adminId - 관리자 ID
 * @returns {Promise<Object>} 업데이트된 채팅 정보
 */
async function assignAdmin(chatId, adminId) {
  const chat = await prisma.chat.findUnique({
    where: { id: parseInt(chatId) }
  });

  if (!chat) {
    throw new Error('채팅을 찾을 수 없습니다.');
  }

  // 관리자 유효성 확인
  const admin = await prisma.user.findFirst({
    where: {
      id: adminId,
      role: 'admin'
    }
  });

  if (!admin) {
    throw new Error('유효하지 않은 관리자입니다.');
  }

  // 관리자 배정 및 상태 업데이트
  const updatedChat = await prisma.chat.update({
    where: { id: parseInt(chatId) },
    data: {
      adminId,
      status: 'in_progress'
    },
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

  // 관리자 배정 시스템 메시지 추가
  await prisma.chatMessage.create({
    data: {
      chatId: parseInt(chatId),
      senderId: adminId,
      message: `${admin.name} 관리자가 배정되었습니다.`,
      isSystem: true,
      isRead: true
    }
  });

  return updatedChat;
}

/**
 * 오래된 채팅 자동 정리
 * @returns {Promise<number>} 삭제된 채팅 수
 */
async function cleanupOldChats() {
  // 30일 이상 지난 closed 상태의 채팅 삭제
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const result = await prisma.chat.deleteMany({
    where: {
      status: 'closed',
      updatedAt: { lt: thirtyDaysAgo }
    }
  });
  
  return result.count;
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
  cleanupOldChats
};