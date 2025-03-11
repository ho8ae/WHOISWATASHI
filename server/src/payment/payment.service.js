const axios = require("axios");
const orderService = require("../order/order.service");

/**
 * PortOne 결제 검증 및 처리
 */
async function verifyPortOnePayment(paymentData) {
  const { impUid, orderId, amount } = paymentData;

  try {
    console.log("결제 검증 시작:", { impUid, orderId, amount });
    console.log("API 키:", process.env.PORTONE_API_KEY ? "설정됨" : "설정되지 않음");
    console.log("API 시크릿:", process.env.PORTONE_API_SECRET ? "설정됨" : "설정되지 않음");

    // PortOne 액세스 토큰 얻기
    console.log("토큰 발급 시도...");
    const tokenResponse = await axios.post(
      "https://api.iamport.kr/users/getToken",
      {
        imp_key: process.env.PORTONE_API_KEY,
        imp_secret: process.env.PORTONE_API_SECRET,
      },
    );

    console.log("토큰 발급 응답:", tokenResponse.data);
    const { access_token } = tokenResponse.data.response;
    console.log("액세스 토큰 확보:", access_token.substring(0, 10) + "...");

    // 결제 정보 조회
    const paymentUrl = `https://api.iamport.kr/payments/${impUid}`;
    console.log("결제 정보 조회 URL:", paymentUrl);
    
    const paymentResponse = await axios.get(
      paymentUrl,
      {
        headers: { Authorization: access_token },
      },
    );

    console.log("결제 정보 조회 성공!");
    const paymentInfo = paymentResponse.data.response;
    console.log("결제 정보:", JSON.stringify(paymentInfo, null, 2));

    // 결제 검증 (금액, 상태 등)
    if (paymentInfo.status !== "paid") {
      throw new Error("결제가 완료되지 않았습니다.");
    }

    if (paymentInfo.amount !== Number(amount)) {
      throw new Error("결제 금액이 일치하지 않습니다.");
    }

    // 결제 정보 저장
    const payment = await orderService.createPayment({
      orderId,
      amount,
      provider: "portone",
      paymentKey: impUid,
      paymentData: paymentInfo,
      status: "completed",
    });

    return payment;
  } catch (error) {
    console.error("결제 검증 실패:", error.message);
    
    if (error.response) {
      console.error("HTTP 상태 코드:", error.response.status);
      console.error("응답 데이터:", JSON.stringify(error.response.data, null, 2));
      console.error("응답 헤더:", JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.error("요청은 전송되었으나 응답을 받지 못함:", error.request);
    } else {
      console.error("요청 설정 중 오류 발생:", error.message);
    }
    
    // 오류 발생 위치 추적
    console.error("스택 트레이스:", error.stack);
    
    // 결제 실패 처리
    await orderService.createPayment({
      orderId,
      amount,
      provider: "portone",
      paymentKey: impUid,
      paymentData: error.response?.data || error.message,
      status: "failed",
      errorMessage: error.message,
    });

    throw error;
  }
}

module.exports = {
  verifyPortOnePayment
};