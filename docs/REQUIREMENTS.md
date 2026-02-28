# Gemini 임시 채팅 단축키 — Chrome Extension

## 문제 정의

### 배경

| 항목 | ChatGPT | Gemini |
|------|---------|--------|
| 임시 채팅 단축키 | `Cmd + Shift + N` | ❌ 없음 |
| URL로 임시 채팅 진입 | `chatgpt.com/?temporary-chat=true` | ❌ 없음 |
| UI 진입 방법 | 단축키 / URL / UI 버튼 | 사이드바 아이콘 클릭만 가능 |

### 핵심 문제

1. **키보드 단축키 부재** — Gemini 웹에서 임시 채팅을 여는 키보드 단축키가 제공되지 않음
2. **URL 기반 진입 불가** — 임시 채팅 모드를 URL 파라미터나 경로로 직접 접근할 수 없음
3. **UI 클릭 의존** — 임시 채팅을 시작하려면 반드시 사이드바의 점선 원형 아이콘을 마우스로 클릭해야 함

> 결과적으로, 키보드 중심의 워크플로우에서 **Gemini 임시 채팅 진입에 불필요한 마찰**이 발생한다.

---

## 해결 방안

**Chrome 확장 프로그램**을 만들어 `gemini.google.com`에서 키보드 단축키로 임시 채팅 버튼을 프로그래밍적으로 클릭한다.

### 동작 원리 (예상)

```
사용자가 단축키 입력
  → Content Script가 이벤트 감지
  → DOM에서 임시 채팅 버튼을 찾아 클릭
  → Gemini가 임시 채팅 모드로 전환
```

---

## 요구사항

### 기능 요구사항 (Functional)

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F1 | `gemini.google.com`에서 **키보드 단축키**(기본: `Cmd+Shift+N`)로 임시 채팅을 열 수 있어야 한다 | **필수** |
| F2 | 단축키 입력 시 사이드바의 임시 채팅 버튼을 자동 클릭하여 Gemini 네이티브 동작을 트리거해야 한다 | **필수** |
| F3 | 이미 임시 채팅 모드에 있을 때 단축키를 누르면 **새 임시 채팅**을 시작해야 한다 (기존 임시 채팅 초기화) | 권장 |
| F4 | 사이드바가 닫혀 있어도 동작해야 한다 | 권장 |
| F5 | 단축키 충돌 시 사용자가 **커스텀 단축키**를 설정할 수 있어야 한다 | 선택 |

### 비기능 요구사항 (Non-Functional)

| ID | 요구사항 |
|----|---------|
| NF1 | 확장 프로그램은 `gemini.google.com` 도메인에서만 동작해야 한다 |
| NF2 | 최소 권한 원칙: `activeTab` + host 권한(`gemini.google.com`)만 요청 |
| NF3 | Chrome Manifest V3 기반으로 작성 |
| NF4 | Gemini UI 변경에 대비하여 버튼 선택자를 유지보수하기 쉽게 구성 |
| NF5 | 성능 영향 최소화: 단축키 리스너만 등록하고 불필요한 DOM 관찰 없음 |

---

## 기술적 고려사항

### 임시 채팅 버튼 식별

Gemini 웹 UI의 임시 채팅 버튼은 사이드바에 위치한 점선 원형 아이콘이다. 정확한 선택자는 다음 후보들을 탐색하여 결정해야 한다:

- `button[aria-label*="Temporary"]` / `button[aria-label*="임시"]` (언어 설정에 따라 다름)
- `button[data-test-id*="temporary"]`
- 사이드바 내 특정 아이콘 SVG를 포함하는 버튼

> [!IMPORTANT]
> Gemini UI는 SPA(Single Page Application)이므로 DOM이 동적으로 로드된다. 버튼이 아직 렌더링되지 않았을 수 있으므로 **MutationObserver** 또는 재시도 로직이 필요할 수 있다.

### 확장 프로그램 구조 (Manifest V3)

```
gemini-temporary-chat-shortcut/
├── manifest.json          # 확장 프로그램 설정
├── content.js             # 단축키 감지 + DOM 조작
├── icons/                 # 확장 프로그램 아이콘
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### 단축키 처리 방식: `Cmd+Shift+N` 충돌 해결

`Cmd+Shift+N`은 Chrome의 **시크릿 창 열기** 단축키이므로, 확장 프로그램에서 이를 사용하려면 특별한 처리가 필요하다.

| 방식 | `Cmd+Shift+N` 재정의 | 비고 |
|------|:-------------------:|------|
| **Chrome Commands API** | ❌ 불가 | Chrome 핵심 단축키는 항상 우선. 공식 문서에서 명시적으로 제한 |
| **Content Script `keydown` + `preventDefault()`** | ✅ 가능 | 해당 페이지에서만 브라우저 기본 동작을 가로챌 수 있음 |

**채택: Content Script `keydown` 리스너 (캡처 단계)**

```javascript
// gemini.google.com에서만 실행되는 content script
document.addEventListener('keydown', (e) => {
  if (e.metaKey && e.shiftKey && e.key === 'N') {
    e.preventDefault();       // 시크릿 창 열기 방지
    e.stopPropagation();      // 이벤트 전파 차단
    // → 임시 채팅 버튼 클릭 로직
  }
}, { capture: true });        // 캡처 단계에서 가장 먼저 처리
```

> [!NOTE]
> - Content Script는 `gemini.google.com`에서만 주입되므로, **다른 모든 사이트에서는 `Cmd+Shift+N`이 기존대로 시크릿 창을 연다.**
> - `Cmd+Shift+N`은 Chrome 레벨 단축키이므로 `preventDefault()`로 가로챌 수 있다. OS 레벨 단축키(예: `Cmd+Q`)와는 다르다.

---

## 제약 및 리스크

| 리스크 | 영향 | 완화 방안 |
|--------|------|----------|
| Gemini UI 업데이트로 버튼 선택자 변경 | 확장 프로그램 동작 실패 | 다중 선택자 전략 + 빠른 업데이트 |
| 사이드바가 완전히 숨겨진 상태에서 버튼 미존재 | 클릭 불가 | 사이드바 열기 → 클릭 → 사이드바 닫기 시퀀스 |
| CSP(Content Security Policy) 제한 | 스크립트 주입 제한 가능 | Manifest V3 content_scripts 방식 사용 |
| Chrome 업데이트로 `preventDefault()` 동작 변경 | 시크릿 창이 열리고 임시 채팅 미동작 | 정기적 호환성 테스트 |
