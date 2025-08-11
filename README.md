# 🔮 타로 리딩 시스템

Vue.js와 Supabase를 사용한 현대적인 타로 리딩 웹 애플리케이션입니다.

## 📋 목차

- [기능](#기능)
- [기술 스택](#기술-스택)
- [설치 및 설정](#설치-및-설정)
- [사용법](#사용법)
- [데이터베이스 구조](#데이터베이스-구조)
- [배포](#배포)
- [기여하기](#기여하기)

## ✨ 기능

- **3장 스프레드**: 과거-현재-미래 리딩
- **목적별 해석**: 연애, 직장, 건강 등 8가지 목적
- **카드 필터링**: 메이저/마이너 아르카나, 수트별 필터
- **실시간 검색**: 카드 이름 및 키워드 검색
- **사용자 히스토리**: 리딩 기록 저장 및 조회
- **반응형 디자인**: 모바일 및 데스크톱 지원

## 🛠 기술 스택

- **Frontend**: Vue.js 3, HTML5, CSS3, JavaScript ES6+
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **배포**: GitHub Pages
- **스타일링**: CSS Grid, Flexbox, CSS Variables

## 🚀 설치 및 설정

### 방법 1: GitHub 웹 인터페이스 사용 (권장)

#### 1. GitHub 레포지토리 생성

1. [GitHub.com](https://github.com)에 로그인
2. 우측 상단 **"+"** 버튼 클릭 → **"New repository"** 선택
3. 레포지토리 설정:
   - **Repository name**: `tarot-reading-system`
   - **Description**: `타로 리딩 시스템 - Vue.js + Supabase`
   - **Visibility**: Public (GitHub Pages 사용을 위해)
   - **Initialize with**: 체크하지 않음
4. **"Create repository"** 클릭

#### 2. 파일 업로드

1. 생성된 레포지토리 페이지에서 **"uploading an existing file"** 클릭
2. `test` 폴더의 모든 파일을 드래그 앤 드롭으로 업로드
3. **"Commit changes"** 클릭

#### 3. GitHub Pages 활성화

1. 레포지토리 페이지에서 **"Settings"** 탭 클릭
2. 좌측 메뉴에서 **"Pages"** 클릭
3. **"Source"** 섹션에서:
   - **Deploy from a branch** 선택
   - **Branch**: `main` 선택
   - **Folder**: `/ (root)` 선택
4. **"Save"** 클릭

### 방법 2: 명령어 사용

#### 1. 저장소 클론

```bash
git clone https://github.com/[YOUR_USERNAME]/tarot-reading-system.git
cd tarot-reading-system
```

#### 2. 파일 추가 및 커밋

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

### 3. Supabase 프로젝트 생성

1. [Supabase.com](https://supabase.com)에 접속
2. 새 프로젝트 생성:
   - **Name**: `tarot-reading-system`
   - **Database Password**: 안전한 비밀번호 설정
   - **Region**: 가까운 지역 선택

### 4. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 **SQL Editor** 클릭
2. `sql/00_setup_database.sql` 파일의 내용을 복사하여 붙여넣기
3. **Run** 클릭하여 스키마 생성

### 5. Supabase 연결 정보 설정

1. Supabase 대시보드에서 **Settings** → **API** 클릭
2. 다음 정보를 복사:
   - **Project URL**
   - **anon public key**

3. GitHub에서 `js/services/supabase.js` 파일 편집:
   - 파일 클릭 → 연필 아이콘 클릭
   - 다음 값들을 실제 값으로 변경:
   ```javascript
   const SUPABASE_URL = 'YOUR_ACTUAL_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_ACTUAL_ANON_KEY';
   ```
   - **"Commit changes"** 클릭

### 6. 배포 확인

- `https://[YOUR_USERNAME].github.io/tarot-reading-system` 접속
- 설정이 완료되면 타로 시스템이 정상 작동

## 📖 사용법

### 기본 사용 흐름

1. **목적 선택**: 리딩 목적 선택 (연애, 직장, 건강 등)
2. **카드 선택**: 3장의 카드 선택
3. **스프레드 확인**: 과거-현재-미래 배치 확인
4. **리딩 시작**: 상세한 해석 결과 확인
5. **히스토리 저장**: 리딩 기록 자동 저장

### 카드 필터링

- **전체**: 모든 카드 표시
- **메이저 아르카나**: 22장의 메이저 카드
- **마이너 아르카나**: 56장의 마이너 카드
- **수트별**: 완드, 컵, 검, 펜타클

### 검색 기능

카드 이름이나 키워드로 검색 가능:
- "The Fool", "Lovers", "Death" 등
- "사랑", "변화", "성공" 등 키워드

## 🗄 데이터베이스 구조

### 주요 테이블

- **tarot_cards**: 카드 기본 정보
- **tarot_purposes**: 리딩 목적 정의
- **tarot_purpose_readings**: 목적별 카드 해석
- **tarot_purpose_combinations**: 3장 조합 해석
- **user_readings**: 사용자 리딩 기록

### 데이터 크기

- **메이저 아르카나**: 22장
- **마이너 아르카나**: 56장 (완드, 컵, 검, 펜타클 각 14장)
- **목적별 해석**: 78장 × 8목적 = 624개
- **조합 해석**: 그룹 기반으로 압축 (약 195,000개)

## 🌐 배포

### GitHub Pages 배포

1. **GitHub 저장소 설정**:
   - 웹 인터페이스: 파일 업로드 후 자동 배포
   - 명령어: `git push origin main`

2. **GitHub Pages 활성화**:
   - 저장소 Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, folder: / (root)

3. **배포 확인**:
   - `https://[YOUR_USERNAME].github.io/tarot-reading-system` 접속

### 환경 변수 설정

GitHub Pages에서는 환경 변수를 직접 설정할 수 없으므로, `supabase.js` 파일에서 직접 설정해야 합니다.

## 🔧 개발

### 프로젝트 구조

```
tarot-reading-system/
├── index.html              # 메인 HTML 파일
├── css/
│   ├── style.css          # 기본 스타일
│   └── tarot.css          # 타로 전용 스타일
├── js/
│   ├── services/
│   │   ├── supabase.js    # Supabase 연결
│   │   └── tarotService.js # 타로 서비스
│   ├── utils/
│   │   └── cardUtils.js   # 카드 유틸리티
│   └── components/
│       ├── PurposeSelector.js
│       ├── TarotDeck.js
│       ├── CardSpread.js
│       ├── ReadingResult.js
│       └── UserHistory.js
├── sql/
│   └── 00_setup_database.sql # 데이터베이스 스키마
└── README.md
```

### 개발 서버 실행

```bash
# Python 서버
python -m http.server 8000

# 또는 Node.js 서버
npx http-server -p 8000
```

### 코드 스타일

- **JavaScript**: ES6+ 모듈 시스템 사용
- **CSS**: BEM 방법론 적용
- **Vue.js**: Composition API 사용

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🆘 문제 해결

### 일반적인 문제

1. **Supabase 연결 실패**:
   - URL과 API 키가 올바른지 확인
   - 데이터베이스 스키마가 생성되었는지 확인

2. **카드가 표시되지 않음**:
   - 브라우저 콘솔에서 오류 확인
   - 네트워크 연결 상태 확인

3. **스타일이 적용되지 않음**:
   - CSS 파일 경로 확인
   - 브라우저 캐시 삭제

### 지원

문제가 발생하면 GitHub Issues에 등록해주세요.

## 📞 연락처

- **프로젝트 링크**: [https://github.com/[YOUR_USERNAME]/tarot-reading-system](https://github.com/[YOUR_USERNAME]/tarot-reading-system)

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
