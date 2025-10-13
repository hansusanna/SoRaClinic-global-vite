# SoRa_React - 사용 가이드

SoRa_React는 Vite로 구축된 현대적인 React 기반 뷰티/스킨 웹사이트 애플리케이션입니다. 
포괄적인 UI 컴포넌트 라이브러리와 홈, 이벤트, 소개, 치료, 관리자 기능을 포함한 여러 페이지를 제공합니다.

SoRa_React
- 개발주소 https://sora-react.vercel.app/
- 깃허브 https://github.com/hansusanna/SoRaClinic-global-vite

## 필수 요구사항
- Node.js (버전 18 이상 권장)
- npm 또는 yarn 패키지 매니저

## 설치 및 설정
1. 의존성 설치 / npm install
2. 개발 서버 시작 / npm run dev
3. 프로덕션 빌드 / npm run build

## 프로젝트 구조.
SoRa_React/
├── index.html                    # HTML 진입점
├── package.json                  # 프로젝트 설정 및 의존성
├── README.md                     # 프로젝트 문서
├── vite.config.ts               # Vite 빌드 설정
│
├── src/                          # 소스 코드 메인 디렉토리
│   ├── main.tsx                 # React 앱 진입점
│   ├── App.tsx                  # 메인 App 컴포넌트
│   ├── index.css                # 메인 스타일시트
│   ├── ProjectStructureDiagram.tsx  # 프로젝트 구조도
│   ├── Attributions.md          # 라이선스 및 출처 정보
│   │
│   ├── components/              # 컴포넌트 디렉토리
│   │   ├── pages/               # 페이지 컴포넌트들
│   │   │   ├── HomePage.tsx        # 홈페이지
│   │   │   ├── EventPage.tsx       # 이벤트 페이지
│   │   │   ├── AboutPage.tsx       # 소개 페이지
│   │   │   ├── TreatmentsPage.tsx  # 트리트먼트 페이지
│   │   │   ├── AdminPage.tsx       # 관리자 페이지
│   │   │   └── AdminLoginPage.tsx  # 관리자 로그인
│   │   │
│   │   ├── ui/                  # shadcn/ui 컴포넌트 라이브러리
│   │   │   ├── button.tsx          # 버튼 컴포넌트
│   │   │   ├── card.tsx            # 카드 컴포넌트
│   │   │   ├── dialog.tsx          # 다이얼로그 컴포넌트
│   │   │   ├── form.tsx            # 폼 컴포넌트
│   │   │   ├── input.tsx           # 입력 컴포넌트
│   │   │   ├── sonner.tsx          # 토스트 알림
│   │   │   └── ... (총 50+ UI 컴포넌트)
│   │   │
│   │   ├── BeautyCarousel.tsx   # 뷰티 캐러셀
│   │   ├── BookingModal.tsx     # 예약 모달
│   │   ├── Navigation.tsx       # 네비게이션 바
│   │   ├── Footer.tsx           # 푸터
│   │   ├── ContactSection.tsx   # 연락처 섹션
│   │   ├── ContactInfo.tsx      # 연락처 정보
│   │   ├── ContactMap.tsx       # 지도 컴포넌트
│   │   ├── LanguageSelector.tsx # 언어 선택기
│   │   ├── SocialMedia.tsx      # 소셜 미디어 링크
│   │   ├── PageLayout.tsx       # 페이지 레이아웃
│   │   │
│   │   ├── constants/           # 상수 데이터
│   │   │   ├── contactData.ts      # 연락처 데이터
│   │   │   └── slidesData.ts       # 슬라이드 데이터
│   │   │
│   │   └── figma/               # Figma 관련 컴포넌트
│   │       └── ImageWithFallback.tsx  # 이미지 폴백 처리
│   │
│   ├── styles/                  # 스타일 디렉토리
│   │   └── globals.css             # 전역 스타일 (Tailwind V4)
│   │
│   ├── utils/                   # 유틸리티 함수
│   │   └── supabase/               # Supabase 관련 유틸
│   │       └── info.tsx            # Supabase 정보
│   │
│   ├── supabase/                # Supabase 백엔드
│   │   └── functions/              # Edge Functions
│   │       └── server/             # 서버 함수들
│   │           ├── index.tsx       # 메인 서버 함수
│   │           └── kv_store.tsx    # 키-값 저장소
│   │
│   └── guidelines/              # 가이드라인 문서
│       └── Guidelines.md           # 개발 가이드라인
│
└── node_modules/                # 의존성 패키지들
    ├── react/                      # React 18.3.1
    ├── @radix-ui/                  # Radix UI 컴포넌트
    ├── lucide-react/               # 아이콘 라이브러리
    ├── recharts/                   # 차트 라이브러리
    └── sonner/                     # 토스트 알림

## App 컴포넌트 계층 구조
App.tsx (메인 컨테이너)
├── Navigation.tsx (상단 네비게이션)
│   ├── LanguageSelector.tsx (언어 선택)
│   └── Mobile Menu (Sheet 컴포넌트)
│
├── 페이지 라우팅 (동적 렌더링)
│   ├── HomePage.tsx
│   │   ├── BeautyCarousel.tsx (메인 캐러셀)
│   │   └── ContactSection.tsx
│   │       ├── ContactInfo.tsx
│   │       ├── ContactMap.tsx
│   │       └── SocialMedia.tsx
│   │
│   ├── EventPage.tsx (이벤트 페이지)
│   ├── AboutPage.tsx (소개 페이지)
│   ├── TreatmentsPage.tsx (트리트먼트 페이지)
│   └── AdminPage.tsx (관리자 대시보드)
│       └── AdminLoginPage.tsx (로그인)
│
├── BookingModal.tsx (예약 모달)
│   └── 예약 폼 (shadcn/ui 컴포넌트들)
│
├── Footer.tsx (푸터)
│   └── 연락처 정보
│
└── Toaster (알림 시스템)
    └── sonner 컴포넌트
    
## UI 컴포넌트 라이브러리 구조
components/ui/
├── 기본 컴포넌트
│   ├── button.tsx          # 버튼 (기본, 변형, 크기)
│   ├── input.tsx           # 입력 필드
│   ├── label.tsx           # 라벨
│   └── textarea.tsx        # 텍스트 영역
│
├── 레이아웃 컴포넌트
│   ├── card.tsx            # 카드 컨테이너
│   ├── sheet.tsx           # 사이드 시트
│   ├── dialog.tsx          # 모달 다이얼로그
│   └── separator.tsx       # 구분선
│
├── 인터랙티브 컴포넌트
│   ├── accordion.tsx       # 아코디언
│   ├── tabs.tsx            # 탭
│   ├── dropdown-menu.tsx   # 드롭다운 메뉴
│   └── navigation-menu.tsx # 네비게이션 메뉴
│
├── 데이터 컴포넌트
│   ├── table.tsx           # 테이블
│   ├── chart.tsx           # 차트
│   └── progress.tsx        # 진행률 바
│
└── 유틸리티 컴포넌트
    ├── sonner.tsx          # 토스트 알림
    ├── use-mobile.ts       # 모바일 감지 훅
    └── utils.ts            # 유틸리티 함수

## 반응형 레이아웃 구조
Desktop (md:)
├── Navigation: 가로 메뉴 + 로고 + BOOK 버튼 + DASHBOARD
├── Pages: 전체 화면 레이아웃
└── Footer: 3열 그리드

Mobile (< md:)
├── Navigation: 햄버거 메뉴 (Sheet) + 로고
├── Pages: 모바일 최적화 레이아웃
└── Footer: 1열 스택 레이아웃

**주요 기능**
- 네비게이션 : 홈, 이벤트, 소개, 치료
- 관리자 대시보드 : 미리보기 모드 사용 가능
- 예약 시스템 : 모달 기반 예약 시스템
- 반응형 디자인 : 모바일 우선 접근법
- 현대적인 UI: Radix UI 컴포넌트와 Tailwind CSS로 구축
- Supabase 통합: 백엔드 서비스 및 데이터베이스

**사용 가능한 페이지**
1. 홈 페이지 (`/`) - 연락처 섹션이 있는 메인 랜딩 페이지
2. 이벤트 페이지 (`/event`) - 이벤트 정보 및 업데이트
3. 소개 페이지 (`/about`) - 회사 정보
4. 치료 페이지 (`/treatments`) - 서비스 제공 내용
5. 관리자 대시보드 - 관리 인터페이스 (미리보기 모드 사용 가능)

**개발 명령어**
- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션용 빌드
- 기본적으로 서버는 포트 3000에서 실행됩니다

**기술 스택**
- 프론트엔드: React 18, TypeScript
- 빌드 도구: Vite
- UI 컴포넌트: Radix UI, Tailwind CSS
- 스타일링: CSS 모듈, Tailwind CSS
- 백엔드: Supabase 통합
- 폼: React Hook Form
- 아이콘: Lucide React

**시작하기**
1. 프로젝트를 클론하거나 다운로드
2. `npm install` 실행하여 의존성 설치
3. `npm run dev` 실행하여 개발 시작
4. 네비게이션 메뉴를 통해 다양한 페이지 탐색
5. 예약 모달 기능 테스트

이 프로젝트는 현대적인 UI 컴포넌트와 반응형 디자인을 갖춘 완전한 뷰티/스킨 웹사이트로 설계되었습니다. 
특정 요구사항에 따라 콘텐츠, 스타일링 및 기능을 사용자 정의할 수 있습니다.

## 참고 자료

**영어 버전**: [SoRa_React - Usage Guide](https://www.notion.so/25cf2a39fd558064b203db11ddbc33b5?pvs=21)
**피그마 연결**
https://www.figma.com/design/Q5P1p8HpmV6UzHUCtDllrP/Sora_react?node-id=1-2&t=D9hMsLyVIYAEWNeT-1
[Data Flow](https://www.notion.so/272f2a39fd5581f59d23cf6b258a4b4f?pvs=21)
[Data Base](https://www.notion.so/272f2a39fd558174ab4de220fdf3ee7c?pvs=21)
[api 연결](https://www.notion.so/272f2a39fd55812cbae2e5927771e2dd?pvs=21)
