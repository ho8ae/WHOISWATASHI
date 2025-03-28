import useAuth from "../hooks/useAuth";

const MyPage = () => {
  const { user,isAuthenticated} = useAuth();

  return <div className="p-4 w-full">
    <div>
      <span className="font-bold text-lg">{user?.name}</span> 환엽합니다.
    </div>
    {isAuthenticated ? (
      <div>
        <p>이메일: {user?.email}</p>
        <p>역할: {user?.role}</p>
      </div>
    ) : (
      <div>로그인이 필요합니다.</div>
    )}
  </div>;
};

export default MyPage;
