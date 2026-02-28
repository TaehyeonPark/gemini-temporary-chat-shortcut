# Gemini Temporary Chat Shortcut — Requirements

## Problem

### Background

| Feature | ChatGPT | Gemini |
|---------|---------|--------|
| Temporary chat shortcut | `Cmd + Shift + N` | ❌ None |
| URL-based temporary chat | `chatgpt.com/?temporary-chat=true` | ❌ None |
| Entry method | Shortcut / URL / UI button | Sidebar icon click only |

### Core Issues

1. **No keyboard shortcut** — Gemini web does not provide a keyboard shortcut to open temporary chat
2. **No URL-based entry** — Temporary chat mode cannot be accessed via URL parameters or paths
3. **Mouse-click required** — Starting a temporary chat requires clicking the dashed circle icon in the sidebar

## Solution

A **Chrome extension** that programmatically clicks the temporary chat button on `gemini.google.com` when the user presses a keyboard shortcut.

### How It Works

```
User presses Option+Shift+N
  → Content script captures keydown event (capture phase)
  → Finds the temporary chat button in the DOM
  → Clicks the button
  → Gemini switches to temporary chat mode
```

### Why Option+Shift+N?

We wanted to use `Cmd+Shift+N` (same as ChatGPT), but Chrome intercepts this shortcut at the **browser level** for opening incognito windows. The keydown event never reaches the content script.

| Approach | Can override `Cmd+Shift+N`? |
|----------|:---:|
| Chrome Commands API | ❌ — Explicitly restricted in official docs |
| Content Script `keydown` + `preventDefault()` | ❌ — Event never reaches the page |

Therefore, we chose **`Option+Shift+N`** (`Alt+Shift+N`) which has no conflicts.

### IME Compatibility

On macOS, `Option+N` in English input mode is a dead key that produces `˜` (tilde accent). This causes `e.key` to be `'Dead'` instead of `'N'`. We use `e.code === 'KeyN'` (physical key) instead of `e.key` to detect the shortcut regardless of input method.

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| F1 | Open temporary chat with **⌥ Option+Shift+N** on `gemini.google.com` | **Must** |
| F2 | Auto-click sidebar temporary chat button to trigger Gemini native behavior | **Must** |
| F3 | Work even when sidebar is collapsed | **Must** |

### Non-Functional Requirements

| ID | Requirement |
|----|------------|
| NF1 | Extension must only operate on `gemini.google.com` domain |
| NF2 | Minimum permissions: host matching only |
| NF3 | Chrome Manifest V3 |
| NF4 | Button selectors should be easy to maintain against UI changes |

## Technical Details

### DOM Selectors

| Element | Selector |
|---------|----------|
| Temporary chat button | `button[data-test-id="temp-chat-button"]` |
| Hamburger menu button | `button[data-test-id="side-nav-menu-button"]` |
| Sidebar container | `.sidenav-with-history-container` |
| Sidebar collapsed state | `.collapsed` class presence |

> Gemini is a SPA, so DOM elements load dynamically. The extension uses polling with timeout to wait for elements.

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gemini UI update changes selectors | Extension stops working | Multi-selector strategy + quick updates |
| Sidebar fully hidden, button not in DOM | Click fails | Auto-expand sidebar → click sequence |
| CSP restrictions | Script injection blocked | Manifest V3 content_scripts approach |

---

# Gemini 임시 채팅 단축키 — 요구사항

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

## 해결 방안

**Chrome 확장 프로그램**을 만들어 `gemini.google.com`에서 **⌥ Option+Shift+N**으로 임시 채팅 버튼을 프로그래밍적으로 클릭한다.

### 동작 원리

```
사용자가 Option+Shift+N 입력
  → Content Script가 keydown 이벤트 감지 (캡처 단계)
  → DOM에서 임시 채팅 버튼을 찾아 클릭
  → Gemini가 임시 채팅 모드로 전환
```

### 단축키 선택 근거

`Cmd+Shift+N`(ChatGPT와 동일)을 사용하고 싶었으나, Chrome이 시크릿 창 열기 단축키로 **브라우저 레벨에서 가로채기** 때문에 content script에 keydown 이벤트가 도달하지 않는다.

| 방식 | `Cmd+Shift+N` 재정의 |
|------|:-------------------:|
| Chrome Commands API | ❌ — 공식 문서에서 명시적 제한 |
| Content Script `keydown` + `preventDefault()` | ❌ — 이벤트 자체가 페이지에 전달되지 않음 |

따라서 충돌 없는 **`Option+Shift+N`** (`Alt+Shift+N`)을 채택.

### IME 호환성

macOS 영문 모드에서 `Option+N`은 dead key(˜ tilde accent)로 처리되어 `e.key`가 `'Dead'`가 된다. `e.code === 'KeyN'` (물리 키)을 사용하여 입력 모드에 무관하게 단축키를 감지한다.

## 요구사항

### 기능 요구사항

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F1 | `gemini.google.com`에서 **⌥ Option+Shift+N**으로 임시 채팅을 열 수 있어야 한다 | **필수** |
| F2 | 단축키 입력 시 사이드바의 임시 채팅 버튼을 자동 클릭하여 Gemini 네이티브 동작을 트리거해야 한다 | **필수** |
| F3 | 사이드바가 닫혀 있어도 동작해야 한다 | **필수** |

### 비기능 요구사항

| ID | 요구사항 |
|----|---------|
| NF1 | 확장 프로그램은 `gemini.google.com` 도메인에서만 동작해야 한다 |
| NF2 | 최소 권한 원칙: host 매칭만 사용 |
| NF3 | Chrome Manifest V3 기반 |
| NF4 | Gemini UI 변경에 대비하여 버튼 선택자를 유지보수하기 쉽게 구성 |

## 기술적 고려사항

### DOM 선택자

| 요소 | 선택자 |
|------|--------|
| 임시 채팅 버튼 | `button[data-test-id="temp-chat-button"]` |
| 햄버거 메뉴 버튼 | `button[data-test-id="side-nav-menu-button"]` |
| 사이드바 컨테이너 | `.sidenav-with-history-container` |
| 사이드바 닫힘 상태 | `.collapsed` 클래스 존재 여부 |

> Gemini UI는 SPA이므로 DOM이 동적으로 로드된다. 확장 프로그램은 폴링 + 타임아웃으로 요소를 기다린다.

## 제약 및 리스크

| 리스크 | 영향 | 완화 방안 |
|--------|------|----------|
| Gemini UI 업데이트로 버튼 선택자 변경 | 확장 프로그램 동작 실패 | 다중 선택자 전략 + 빠른 업데이트 |
| 사이드바가 완전히 숨겨진 상태에서 버튼 미존재 | 클릭 불가 | 사이드바 열기 → 클릭 시퀀스 |
| CSP 제한 | 스크립트 주입 제한 가능 | Manifest V3 content_scripts 방식 사용 |
