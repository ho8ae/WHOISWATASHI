const inquiryService = require('./inquiry.service');

/**
 * 관리자: 모든 문의글 조회
 */
async function getAllInquiries(req, res, next) {
  try {
    const inquiries = await inquiryService.getAllInquiries(req.query);
    res.json({
      success: true,
      ...inquiries
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 사용자 본인 문의글 조회
 */
async function getMyInquiries(req, res, next) {
  try {
    const userId = req.user.id;
    const inquiries = await inquiryService.getMyInquiries(userId, req.query);
    res.json({
      success: true,
      ...inquiries
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 문의글 작성
 */
async function createInquiry(req, res, next) {
  try {
    const inquiry = await inquiryService.createInquiry(req.body, req.user);
    res.status(201).json({
      success: true,
      data: inquiry,
      message: '문의글이 등록되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 문의글 상세 조회
 */
async function getInquiryById(req, res, next) {
  try {
    const { id } = req.params;
    const inquiry = await inquiryService.getInquiryById(id);
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: '문의글을 찾을 수 없습니다.'
      });
    }
    
    // 비공개 글인 경우 권한 확인
    if (inquiry.isPrivate) {
      const hasAccess = await inquiryService.checkPrivateAccess(id, req.user);
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: '비공개 글은 비밀번호가 필요합니다.',
          requirePassword: true
        });
      }
    }
    
    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 비공개 글 접근
 */
async function accessPrivateInquiry(req, res, next) {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    const hasAccess = await inquiryService.checkPrivateAccess(id, req.user, password);
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: '비밀번호가 일치하지 않습니다.'
      });
    }
    
    const inquiry = await inquiryService.getInquiryById(id);
    
    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 문의글 수정
 */
async function updateInquiry(req, res, next) {
  try {
    const { id } = req.params;
    const updatedInquiry = await inquiryService.updateInquiry(id, req.body, req.user);
    
    res.json({
      success: true,
      data: updatedInquiry,
      message: '문의글이 수정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 문의글 삭제
 */
async function deleteInquiry(req, res, next) {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    await inquiryService.deleteInquiry(id, req.user, password);
    
    res.json({
      success: true,
      message: '문의글이 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 관리자: 문의글 답변 작성
 */
async function answerInquiry(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const adminId = req.user.id;
    
    const answer = await inquiryService.answerInquiry(id, content, adminId);
    
    res.status(201).json({
      success: true,
      data: answer,
      message: '답변이 등록되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 관리자: 문의글 답변 수정
 */
async function updateAnswer(req, res, next) {
  try {
    const { answerId } = req.params;
    const { content } = req.body;
    const adminId = req.user.id;
    
    const updatedAnswer = await inquiryService.updateAnswer(answerId, content, adminId);
    
    res.json({
      success: true,
      data: updatedAnswer,
      message: '답변이 수정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 관리자: 문의글 상태 변경
 */
async function updateInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedInquiry = await inquiryService.updateInquiryStatus(id, status);
    
    res.json({
      success: true,
      data: updatedInquiry,
      message: '문의글 상태가 변경되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllInquiries,
  getMyInquiries,
  createInquiry,
  getInquiryById,
  accessPrivateInquiry,
  updateInquiry,
  deleteInquiry,
  answerInquiry,
  updateAnswer,
  updateInquiryStatus
};