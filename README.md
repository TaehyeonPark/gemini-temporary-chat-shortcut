# Gemini Temporary Chat Shortcut

A Chrome extension that adds **⌥ Option+Shift+N** (macOS) / **Alt+Shift+N** (Windows/Linux) shortcut to instantly open a temporary chat on `gemini.google.com`.

## Features

- ⌨️ **Option+Shift+N** to instantly open Gemini temporary chat
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
2. Press **⌥ Option+Shift+N** (macOS) or **Alt+Shift+N** (Windows/Linux)
3. Temporary chat opens!

## Why not `Cmd+Shift+N`?

`Cmd+Shift+N` is Chrome's built-in shortcut for opening an incognito window. Chrome intercepts this shortcut at the browser level before the page receives the keyboard event, making it impossible for any extension to override it via content scripts.

## Privacy

This extension does not collect, store, or transmit any user data. See [Privacy Policy](docs/PRIVACY_POLICY.md).

## License

MIT

---

# Gemini 임시 채팅 단축키

`gemini.google.com`에서 **⌥ Option+Shift+N** (macOS) / **Alt+Shift+N** (Windows/Linux) 단축키로 임시 채팅을 바로 열 수 있는 Chrome 확장 프로그램입니다.

## 기능

- ⌨️ **Option+Shift+N** 단축키로 Gemini 임시 채팅 즉시 열기
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
2. **⌥ Option+Shift+N** (macOS) 또는 **Alt+Shift+N** (Windows/Linux) 입력
3. 임시 채팅이 열립니다!

## 왜 `Cmd+Shift+N`이 아닌가요?

`Cmd+Shift+N`은 Chrome의 시크릿 창 열기 단축키로, 브라우저가 페이지보다 먼저 가로채기 때문에 확장 프로그램에서 재정의할 수 없습니다.

## 개인정보 처리

이 확장 프로그램은 사용자 데이터를 수집, 저장, 전송하지 않습니다. [개인정보 처리방침](docs/PRIVACY_POLICY.md)을 참고하세요.

## 라이선스

MIT
