# Gemini Temporary Chat Shortcut

A Chrome extension that adds **⌥ Option+Shift+G** (macOS) / **Alt+Shift+G** (Windows/Linux) shortcut to instantly open a temporary chat on `gemini.google.com`.

## Features

- ⌨️ **Option+Shift+G** to instantly open Gemini temporary chat (rebindable from `chrome://extensions/shortcuts`)
- 🔒 Works only on `gemini.google.com` — no interference with other sites
- 📱 Automatically expands sidebar if collapsed before activating temporary chat

## Installation

### Chrome Web Store

*(Coming soon)*

### Manual Install (Developer Mode)

1. Clone or download this repository
   ```bash
   git clone https://github.com/TaehyeonPark/gemini-temporary-chat-shortcut.git
   ```
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the `gemini-temporary-chat-shortcut` folder

## Usage

1. Navigate to `gemini.google.com`
2. Press **⌥ Option+Shift+G** (macOS) or **Alt+Shift+G** (Windows/Linux)
3. Temporary chat opens!

## Customizing the shortcut

The default binding can be changed at any time via Chrome's built-in shortcut manager. Two ways to get there:

- **Easiest:** click the extension's toolbar icon — it opens the shortcut manager directly. Hovering the icon also shows the current binding (e.g. `Shortcut: ⌥⇧G (click to change)`).
- **Manual:** open `chrome://extensions/shortcuts`, find **Gemini Temporary Chat Shortcut** → **Open Gemini temporary chat**, then click the pencil icon.

## Why not `Cmd+Shift+N` or `Alt+Shift+N`?

- `Cmd+Shift+N` opens an incognito window — Chrome intercepts it at the browser level, so no extension can override it.
- `Alt+Shift+N` was the previous default but now collides with Chrome's split-view tab shortcut.

## Privacy

This extension does not collect, store, or transmit any user data. See [Privacy Policy](docs/PRIVACY_POLICY.md).

## License

MIT

---

# Gemini 임시 채팅 단축키

`gemini.google.com`에서 **⌥ Option+Shift+G** (macOS) / **Alt+Shift+G** (Windows/Linux) 단축키로 임시 채팅을 바로 열 수 있는 Chrome 확장 프로그램입니다.

## 기능

- ⌨️ **Option+Shift+G** 단축키로 Gemini 임시 채팅 즉시 열기 (`chrome://extensions/shortcuts`에서 재설정 가능)
- 🔒 `gemini.google.com`에서만 동작
- 📱 사이드바가 닫혀 있어도 자동으로 열고 임시 채팅 활성화

## 설치

### Chrome Web Store

*(출시 예정)*

### 수동 설치 (개발자 모드)

1. 이 저장소를 클론하거나 다운로드합니다
   ```bash
   git clone https://github.com/TaehyeonPark/gemini-temporary-chat-shortcut.git
   ```
2. Chrome에서 `chrome://extensions` 접속
3. 우측 상단 **개발자 모드(Developer mode)** 활성화
4. **압축해제된 확장 프로그램을 로드합니다(Load unpacked)** 클릭
5. `gemini-temporary-chat-shortcut` 폴더 선택

## 사용법

1. `gemini.google.com` 접속
2. **⌥ Option+Shift+G** (macOS) 또는 **Alt+Shift+G** (Windows/Linux) 입력
3. 임시 채팅이 열립니다!

## 단축키 변경

기본 단축키는 Chrome 내장 단축키 관리자에서 언제든 변경할 수 있습니다. 두 가지 방법이 있습니다:

- **가장 쉬운 방법:** 툴바의 확장 아이콘을 클릭하면 단축키 관리자가 바로 열립니다. 아이콘에 마우스를 올리면 현재 바인딩도 표시됩니다 (예: `Shortcut: ⌥⇧G (click to change)`).
- **수동:** `chrome://extensions/shortcuts`를 열어 **Gemini Temporary Chat Shortcut** → **Open Gemini temporary chat**을 찾고 연필 아이콘을 누르세요.

## 왜 `Cmd+Shift+N`이나 `Alt+Shift+N`이 아닌가요?

- `Cmd+Shift+N`은 Chrome의 시크릿 창 열기 단축키로, 브라우저가 먼저 가로채기 때문에 확장 프로그램이 재정의할 수 없습니다.
- `Alt+Shift+N`은 기존 기본값이었으나 현재 Chrome의 탭 분할(split view) 단축키와 충돌합니다.

## 개인정보 처리

이 확장 프로그램은 사용자 데이터를 수집, 저장, 전송하지 않습니다. [개인정보 처리방침](docs/PRIVACY_POLICY.md)을 참고하세요.

## 라이선스

MIT
