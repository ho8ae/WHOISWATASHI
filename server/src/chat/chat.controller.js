const chatService = require('./chat.service');

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

async function getChatById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    const chat = await chatService.getChatById(id, userId, isAdmin);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: '채팅을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    next(error);
  }
}

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

module.exports = {
  getMyChats,
  getAllChats,
  getChatById,
  getChatMessages
};