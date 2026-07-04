# 스트릿테이블 (StreetTable) 프로젝트 컨텍스트

## 프로젝트 개요
- **앱 이름**: 스트릿테이블 (StreetTable)
- **핵심 목표**: "지금·내 근처·핫한" 푸드트럭/야시장/축제를 발견하고, 상세 확인 후 길찾기·전화 등 실제 행동으로 이어지게 하는 앱
- **배포 주소**: https://streetable.vercel.app
- **GitHub**: https://github.com/Sosiododud-dotcom/streetable
- **Supabase 프로젝트 URL**: https://lqehsddggftrzvudjahy.supabase.co

## 기술 스택
- **프론트엔드**: React + Vite
- **지도**: 카카오맵 API
- **백엔드/DB**: Supabase (PostgreSQL)
- **배포**: Vercel
- **로그인**: 카카오 소셜 로그인 (미구현)
- **패키지**: react-router-dom, @supabase/supabase-js

## 카테고리
- 푸드트럭 (foodtruck)
- 야시장 (nightmarket)
- 지역축제 (festival)
- 5일장 (fiveday)

## 현재 파일 구조
```
streetable/
├── src/
│   ├── components/
│   │   └── KakaoMap.jsx       # 카카오맵 컴포넌트
│   ├── lib/
│   │   └── supabase.js        # Supabase 클라이언트
│   ├── pages/
│   │   └── StoreDetail.jsx    # 가게 상세 페이지
│   ├── App.jsx                # 메인 앱 + 홈 화면
│   └── App.css
├── index.html
├── .env                       # 환경변수 (gitignore 처리됨)
└── package.json
```

## Supabase DB 테이블 구조

### stores (가게)
- id (UUID, PK)
- name (TEXT) - 가게명
- category (TEXT) - foodtruck/nightmarket/festival/fiveday
- sub_category (TEXT) - 세부 유형
- description (TEXT) - 가게 소개
- phone (TEXT) - 전화번호
- lat (DOUBLE) - 위도
- lng (DOUBLE) - 경도
- address (TEXT) - 주소
- is_open (BOOLEAN) - 영업중 여부
- open_until (TIMESTAMPTZ) - 자동 OFF 시각
- tags (TEXT[]) - 태그 배열
- owner_id (UUID) - 사장님 유저 ID
- created_at (TIMESTAMPTZ)

### store_hours (영업시간)
- id, store_id, day_type, open_time, close_time, date_from, date_to

### menus (메뉴)
- id, store_id, name, price, is_recommended, today_special, image_url

### reviews (리뷰)
- id, store_id, user_id, rating(1-5), content, images(TEXT[]), created_at

### users (유저)
- id, kakao_id, nickname, profile_image, role(user/owner/admin), level, created_at

### events (행사/일정)
- id, name, type, location, lat, lng, recurrence, date_from, date_to, description

## 현재 구현된 기능
- [x] 홈 화면 (지도 + 목록 + 카테고리 필터)
- [x] 카카오맵 연동 (핀 클릭시 상세 이동)
- [x] 가게 상세 페이지 (홈/메뉴/리뷰/위치 탭)
- [x] 하단 탭바 (홈/커뮤니티/지도/알림/프로필)
- [x] Supabase 연동
- [x] Vercel 배포

## 미구현 기능 (MVP 범위)
- [ ] 카카오 소셜 로그인
- [ ] 리뷰 작성 (로그인 필요)
- [ ] 가게 등록/수정 (관리자)
- [ ] 5일장/야시장 캘린더
- [ ] 장날 알림 (푸시)
- [ ] 찜/북마크
- [ ] 커뮤니티 글쓰기
- [ ] 사장님 대시보드
- [ ] 오늘의 특메 피드

## 디자인 방향

### 컨셉
- 벤치마킹: 캐치테이블 (디자인/기능), 티맵 (상세 페이지 구조)
- 모바일 퍼스트 (max-width: 430px)
- 컬러: 메인 #1a73e8 (파란색), 영업중 #0a8a0a (초록), 영업종료 #999

### 상세 페이지 구조 (티맵 벤치마킹 + 변형)
- 탭: 홈 | 메뉴 | 리뷰 | 위치
- 티맵의 "주차" 탭 → 스트릿테이블은 "위치" 탭으로 교체
- 액션 버튼: 핀하기 / 리뷰쓰기 / 전화걸기 / 길찾기
- 리뷰: 별점 분포 시각화 (최고예요/좋아요/괜찮아요 등)

### 스트릿테이블만의 차별화 요소
1. "지금 영업중" 실시간 배지 (🟢 N분 전 위치 갱신됨)
2. 사장님 "오늘 영업 시작" 버튼 → 24시간 자동 OFF
3. 5일장/야시장 캘린더 (한국에 없는 기능)
4. 장날 D-1 알림
5. "오늘의 특메" 피드
6. "트럭 못 봤어요" 제보 기능
7. 메뉴판 QR 자동 생성

### 홈 화면 핵심 요소
- 상단: 검색바 + 카테고리 필터 (전체/야시장/유튜브촬영맛집/가성비맛집 등)
- 지도: 카카오맵 + 번호 마커
- 목록: 카드형 (이름/카테고리/별점/거리/영업상태/태그)
- 하단 탭바: 홈/커뮤니티/지도(가운데 강조)/알림/프로필

### 커뮤니티 기능
- UP VOTE / 미팅 / 라이브샷 탭
- 게시글: 제목/내용/사진/참석 버튼
- 위치 기반 "내 근처" 필터

## 영업 상태 로직
```
기본: 등록된 요일/시간 기준 자동 표시
사장님 수동 ON → 24시간 후 자동 OFF
5일장/축제 → 날짜 범위 등록
3일 미갱신 → "정보가 오래됐을 수 있어요" 경고
```

## 수익 모델 (예정)
- MVP: 무료 (유저/데이터 모으기)
- v2: 사장님 프리미엄 노출 (월 2~5만원)
- v3: 이벤트/축제 주최측 배너 광고

## 타겟 지역
- MVP: 하남시 미사강변도시, 강동구
- 확장: 수도권 → 전국

## 개발자 정보
- 이름: 신애영 (azzang)
- GitHub: Sosiododud-dotcom
- 배경: 프리랜서 웹/랜딩페이지 디자인 경력
- Instagram: @hanam.editor, @짠하남
- 로컬 큐레이터 활동 (경기 동부권)
- 개발 경험: 초보 (중학교 수준)

## 중요 주의사항
- RLS 현재 비활성화 상태 → 로그인 구현 후 활성화 필요
- .env 파일 gitignore 처리됨
- Vercel 환경변수에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_KAKAO_MAP_KEY 등록됨
- 카카오맵 JS SDK 도메인: localhost:5173, streetable.vercel.app 등록됨
