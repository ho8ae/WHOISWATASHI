const userService = require('./user.service');

/**
 * 사용자 프로필 조회
 */
async function getUserProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const profile = await userService.getUserProfile(userId);

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 사용자 프로필 수정
 */
async function updateUserProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const updatedProfile = await userService.updateUserProfile(userId, req.body);

    res.json({
      success: true,
      data: updatedProfile,
      message: '프로필이 성공적으로 업데이트되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile
};