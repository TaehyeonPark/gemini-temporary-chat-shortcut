/**
 * Gemini Temporary Chat Shortcut
 *
 * Adds Cmd+Shift+N (macOS) / Ctrl+Shift+N (Windows/Linux) keyboard shortcut
 * to open a temporary chat on gemini.google.com.
 *
 * This content script overrides Chrome's default incognito window shortcut
 * ONLY on the Gemini page.
 */

(() => {
  'use strict';

  // ── Selectors (based on Gemini's data-test-id attributes) ──────────────
  const SELECTORS = {
    TEMP_CHAT_BUTTON: 'button[data-test-id="temp-chat-button"]',
    NAV_HAMBURGER: 'button[data-test-id="side-nav-menu-button"]',
    SIDE_NAV_CONTAINER: '.sidenav-with-history-container',
  };

  const COLLAPSED_CLASS = 'collapsed';
  const ELEMENT_POLL_INTERVAL_MS = 150;
  const ELEMENT_POLL_TIMEOUT_MS = 3000;

  // ── Utility: poll for an element until it appears ──────────────────────
  function waitForElement(selector, timeoutMs = ELEMENT_POLL_TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      // Check immediately first
      const existing = document.querySelector(selector);
      if (existing && existing.offsetParent !== null) {
        return resolve(existing);
      }

      let elapsed = 0;
      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el && el.offsetParent !== null) {
          clearInterval(interval);
          resolve(el);
          return;
        }
        elapsed += ELEMENT_POLL_INTERVAL_MS;
        if (elapsed >= timeoutMs) {
          clearInterval(interval);
          reject(new Error(`[Gemini Shortcut] Element not found: ${selector}`));
        }
      }, ELEMENT_POLL_INTERVAL_MS);
    });
  }

  // ── Expand sidebar if collapsed ────────────────────────────────────────
  function isSidebarCollapsed() {
    const nav = document.querySelector(SELECTORS.SIDE_NAV_CONTAINER);
    return nav && nav.classList.contains(COLLAPSED_CLASS);
  }

  async function ensureSidebarExpanded() {
    if (!isSidebarCollapsed()) return false;

    const hamburger = document.querySelector(SELECTORS.NAV_HAMBURGER);
    if (hamburger) {
      hamburger.click();
      // Wait a bit for the sidebar animation
      await new Promise((r) => setTimeout(r, 300));
      return true; // sidebar was expanded by us
    }
    return false;
  }

  // ── Click the temporary chat button ────────────────────────────────────
  async function activateTemporaryChat() {
    // Try to find the button directly first
    let button = document.querySelector(SELECTORS.TEMP_CHAT_BUTTON);

    if (!button || button.offsetParent === null) {
      // Button not visible — sidebar is probably collapsed
      const wasCollapsed = await ensureSidebarExpanded();

      try {
        button = await waitForElement(SELECTORS.TEMP_CHAT_BUTTON);
      } catch {
        console.warn('[Gemini Shortcut] Could not find temporary chat button.');
        return;
      }
    }

    button.click();
    console.log('[Gemini Shortcut] Temporary chat activated.');
  }

  // ── Keyboard shortcut listener (capture phase) ─────────────────────────
  document.addEventListener(
    'keydown',
    (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        activateTemporaryChat();
      }
    },
    { capture: true }
  );

  console.log('[Gemini Shortcut] Content script loaded — Cmd/Ctrl+Shift+N ready.');
})();
