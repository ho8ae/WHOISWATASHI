const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

/**
 * 관리자: 모든 문의글 조회
 */
async function getAllInquiries(filter = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = filter;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // 필터 조건 구성
  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  // 정렬 조건
  const orderBy = {};
  orderBy[sortBy] = order.toLowerCase();

  // 문의글 조회
  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy,
    skip,
    take: parseInt(limit),
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      answers: {
        select: {
          id: true,
          createdAt: true,
        },
      },
    },
  });

  // 총 문의글 수
  const total = await prisma.inquiry.count({ where });

  return {
    inquiries,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
}

/**
 * 사용자 본인 문의글 조회
 */
async function getMyInquiries(userId, paging = {}) {
  const { page = 1, limit = 10 } = paging;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const inquiries = await prisma.inquiry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take: parseInt(limit),
    include: {
      answers: {
        select: {
          id: true,
          createdAt: true,
        },
      },
    },
  });

  const total = await prisma.inquiry.count({ where: { userId } });

  return {
    inquiries,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
}

/**
 * 문의글 작성
 */
async function createInquiry(data, user = null) {
  const { title, content, isPrivate, password, email, name } = data;

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const userData = user
    ? {
        userId: user.id,
        email: user.email,
        name: user.name,
      }
    : {
        email: email,
        name: name,
      };

  const inquiry = await prisma.inquiry.create({
    data: {
      ...userData,
      title,
      content,
      isPrivate: isPrivate || false,
      password: hashedPassword,
    },
  });

  return inquiry;
}

/**
 * 문의글 상세 조회
 */
async function getInquiryById(id) {
  return await prisma.inquiry.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      answers: {
        include: {
          admin: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

/**
 * 비공개 글 접근 권한 확인
 */
async function checkPrivateAccess(id, user = null, password = null) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: parseInt(id) },
  });

  if (!inquiry) {
    throw new Error("문의글을 찾을 수 없습니다.");
  }

  // 비공개 글이 아니면 항상 접근 가능
  if (!inquiry.isPrivate) {
    return true;
  }

  // 관리자는 항상 접근 가능
  if (user && user.role === "admin") {
    return true;
  }

  // 작성자 본인인 경우 접근 가능
  if (user && inquiry.userId === user.id) {
    return true;
  }

  // 비밀번호가 일치하는 경우 접근 가능
  if (password && inquiry.password) {
    const isPasswordValid = await bcrypt.compare(password, inquiry.password);
    if (isPasswordValid) {
      return true;
    }
  }

  return false;
}

/**
 * 문의글 수정
 */
async function updateInquiry(id, data, user = null) {
  const { title, content, isPrivate, password } = data;

  // 문의글 조회
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: parseInt(id) },
  });

  if (!inquiry) {
    throw new Error("문의글을 찾을 수 없습니다.");
  }

  // 본인 글인지 확인 (로그인한 경우)
  if (user && inquiry.userId !== user.id && user.role !== "admin") {
    throw new Error("본인이 작성한 글만 수정할 수 있습니다.");
  }

  // 비회원 글인 경우 비밀번호 확인
  if (!user && inquiry.password) {
    if (!password) {
      throw new Error("비밀번호를 입력해주세요.");
    }

    const isCorrectPassword = await bcrypt.compare(password, inquiry.password);
    if (!isCorrectPassword) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
  }

  // 문의글 수정
  return await prisma.inquiry.update({
    where: { id: parseInt(id) },
    data: {
      title,
      content,
      isPrivate: isPrivate !== undefined ? isPrivate : inquiry.isPrivate,
    },
  });
}

/**
 * 문의글 삭제
 */
async function deleteInquiry(id, user = null, password = null) {
  // 문의글 조회
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: parseInt(id) },
  });

  if (!inquiry) {
    throw new Error("문의글을 찾을 수 없습니다.");
  }

  // 삭제 권한 확인
  if (user && user.role !== "admin") {
    // 회원인 경우 본인 글인지 확인
    if (inquiry.userId !== user.id) {
      throw new Error("본인이 작성한 글만 삭제할 수 있습니다.");
    }
  }

  // 비회원인 경우 비밀번호 확인
  if (!user && inquiry.password) {
    if (!password) {
      throw new Error("비밀번호를 입력해주세요.");
    }

    const isCorrectPassword = await bcrypt.compare(password, inquiry.password);
    if (!isCorrectPassword) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
  }

  // 문의글 삭제
  await prisma.inquiry.delete({
    where: { id: parseInt(id) },
  });

  return true;
}

/**
 * 관리자: 문의글 답변 작성
 */
async function answerInquiry(inquiryId, content, adminId) {
  // 문의글 조회
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: parseInt(inquiryId) },
  });

  if (!inquiry) {
    throw new Error("문의글을 찾을 수 없습니다.");
  }

  // 답변 작성
  const answer = await prisma.inquiryAnswer.create({
    data: {
      inquiryId: parseInt(inquiryId),
      adminId,
      content,
    },
  });

  // 문의글 상태 업데이트
  await prisma.inquiry.update({
    where: { id: parseInt(inquiryId) },
    data: { status: "answered" },
  });

  // 답변 정보 반환 (관리자 정보 포함)
  return await prisma.inquiryAnswer.findUnique({
    where: { id: answer.id },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

/**
 * 관리자: 문의글 답변 수정
 */
async function updateAnswer(answerId, content, adminId) {
  // 답변 조회
  const answer = await prisma.inquiryAnswer.findUnique({
    where: { id: parseInt(answerId) },
  });

  if (!answer) {
    throw new Error("답변을 찾을 수 없습니다.");
  }

  // 본인이 작성한 답변인지 확인
  if (answer.adminId !== adminId) {
    throw new Error("본인이 작성한 답변만 수정할 수 있습니다.");
  }

  // 답변 수정
  return await prisma.inquiryAnswer.update({
    where: { id: parseInt(answerId) },
    data: { content },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

/**
 * 관리자: 문의글 상태 변경
 */
async function updateInquiryStatus(id, status) {
  // 상태값 검증
  const validStatuses = ["pending", "answered", "closed"];
  if (!validStatuses.includes(status)) {
    throw new Error("유효하지 않은 상태값입니다.");
  }

  // 문의글 조회
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: parseInt(id) },
  });

  if (!inquiry) {
    throw new Error("문의글을 찾을 수 없습니다.");
  }

  // 상태 업데이트
  return await prisma.inquiry.update({
    where: { id: parseInt(id) },
    data: { status },
  });
}

module.exports = {
  getAllInquiries,
  getMyInquiries,
  createInquiry,
  getInquiryById,
  checkPrivateAccess,
  updateInquiry,
  deleteInquiry,
  answerInquiry,
  updateAnswer,
  updateInquiryStatus,
};
