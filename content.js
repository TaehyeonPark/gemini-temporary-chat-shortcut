/**
 * Gemini Temporary Chat Shortcut
 *
 * Option+Shift+N (macOS) / Alt+Shift+N (Windows/Linux) keyboard shortcut
 * to open a temporary chat on gemini.google.com.
 *
 * This content script runs ONLY on gemini.google.com.
 */

(() => {
    'use strict';

    // ── Selectors ──────────────────────────────────────────────────────────
    // Gemini's DOM has changed multiple times; try selectors in priority order
    // and fall back to older variants so the extension keeps working across
    // UI revisions.
    const TEMP_CHAT_BUTTON_SELECTORS = [
        // Current (2026-05): <temp-chat-button> custom element wraps the button
        'temp-chat-button button',
        // Icon-based fallbacks in case the wrapper element is renamed
        'button:has(mat-icon[fonticon="gemini_chat_temp"])',
        'button:has(mat-icon[data-mat-icon-name="gemini_chat_temp"])',
        // Legacy data-test-id (pre-2026 UI)
        'button[data-test-id="temp-chat-button"]',
    ];

    const SELECTORS = {
        NAV_HAMBURGER: 'button[data-test-id="side-nav-menu-button"]',
        SIDE_NAV_CONTAINER: '.sidenav-with-history-container',
    };

    const COLLAPSED_CLASS = 'collapsed';
    const ELEMENT_POLL_INTERVAL_MS = 150;
    const ELEMENT_POLL_TIMEOUT_MS = 3000;

    // ── Utility: find first visible match from a list of selectors ─────────
    function findVisible(selectors) {
        for (const selector of selectors) {
            let el;
            try {
                el = document.querySelector(selector);
            } catch {
                // :has() may not be supported on older browsers — skip silently
                continue;
            }
            if (el && el.offsetParent !== null) return el;
        }
        return null;
    }

    // ── Utility: poll for an element until it appears ──────────────────────
    function waitForElement(selectorOrList, timeoutMs = ELEMENT_POLL_TIMEOUT_MS) {
        const selectors = Array.isArray(selectorOrList) ? selectorOrList : [selectorOrList];
        return new Promise((resolve, reject) => {
            const existing = findVisible(selectors);
            if (existing) return resolve(existing);

            let elapsed = 0;
            const interval = setInterval(() => {
                const el = findVisible(selectors);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                    return;
                }
                elapsed += ELEMENT_POLL_INTERVAL_MS;
                if (elapsed >= timeoutMs) {
                    clearInterval(interval);
                    reject(new Error(`Element not found: ${selectors.join(', ')}`));
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
            await new Promise((r) => setTimeout(r, 300));
            return true;
        }
        return false;
    }

    // ── Click the temporary chat button ────────────────────────────────────
    async function activateTemporaryChat() {
        let button = findVisible(TEMP_CHAT_BUTTON_SELECTORS);

        if (!button) {
            // In the legacy UI the button lived inside the collapsible
            // sidebar; the current UI shows it in the chat header, but
            // keep this fallback in case Gemini reverts.
            await ensureSidebarExpanded();

            try {
                button = await waitForElement(TEMP_CHAT_BUTTON_SELECTORS);
            } catch (err) {
                console.warn('[Gemini Shortcut] Could not find temporary chat button.');
                return;
            }
        }

        button.click();
    }

    // ── Keyboard listener (capture phase) ──────────────────────────────────
    // Uses e.code (physical key) instead of e.key (character) to avoid
    // macOS dead key issue: Option+N in English mode produces ˜ (tilde accent),
    // making e.key === 'Dead' instead of 'N'.
    document.addEventListener(
        'keydown',
        (e) => {
            if (e.altKey && e.shiftKey && e.code === 'KeyN') {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                activateTemporaryChat();
            }
        },
        { capture: true }
    );
})();
