# 프로젝트 이름

간단한 설명을 입력하세요.

## 기술 스택

- **Backend**: Node.js (Express 등)
- **Database**: PostgreSQL

## 설치 및 실행 방법

### 데이터베이스 실행
```
brew services start postgresql
```


### 1. 프로젝트 클론
```sh
git clone https://github.com/your-repo.git
cd your-repo
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 다음과 같이 설정합니다.

```
DATABASE_URL=postgres://username:password@localhost:5432/database_name

```

### 3. 패키지 설치
```sh
npm install
```

### 4. 데이터베이스 설정
```sh
a # 또는 직접 SQL 실행
```

### 5. 서버 실행
```sh
npm start
```

## API 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|--------|
| GET    | /api/items | 모든 아이템 조회 |
| POST   | /api/items | 아이템 생성 |

