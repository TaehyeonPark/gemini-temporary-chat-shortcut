# Gemini Temporary Chat Shortcut

`gemini.google.com`에서 **Cmd+Shift+N** (macOS) / **Ctrl+Shift+N** (Windows/Linux) 단축키로 임시 채팅을 바로 열 수 있는 Chrome 확장 프로그램입니다.

> ChatGPT의 `Cmd+Shift+N` 임시 채팅 단축키를 Gemini에서도 동일하게 사용할 수 있습니다.

## 기능

- ⌨️ **Cmd+Shift+N** 단축키로 Gemini 임시 채팅 즉시 열기
- 🔒 `gemini.google.com`에서만 동작 — 다른 사이트에서는 기존 시크릿 창 단축키 유지
- 📱 사이드바가 닫혀 있어도 자동으로 열고 임시 채팅 활성화

## 설치

1. 이 저장소를 클론하거나 다운로드합니다
   ```bash
   git clone https://github.com/YOUR_USERNAME/gemini-temporary-chat-shortcut.git
   ```
2. Chrome에서 `chrome://extensions` 접속
3. 우측 상단 **개발자 모드(Developer mode)** 활성화
4. **압축해제된 확장 프로그램을 로드합니다(Load unpacked)** 클릭
5. `gemini-temporary-chat-shortcut` 폴더 선택

## 사용법

1. `gemini.google.com` 접속
2. **Cmd+Shift+N** (macOS) 또는 **Ctrl+Shift+N** (Windows/Linux) 입력
3. 임시 채팅이 열립니다!

## 작동 원리

Chrome Extensions API의 `chrome.commands`로는 `Cmd+Shift+N` (시크릿 창) 같은 브라우저 기본 단축키를 재정의할 수 없습니다. 이 확장 프로그램은 Content Script의 `keydown` 이벤트 리스너(캡처 단계)를 사용하여 `gemini.google.com` 페이지에서만 해당 단축키를 가로채고, Gemini의 임시 채팅 버튼을 프로그래밍적으로 클릭합니다.

## 라이선스

MIT
