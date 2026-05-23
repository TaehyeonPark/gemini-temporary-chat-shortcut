/**
 * Background service worker for Gemini Temporary Chat Shortcut.
 *
 * Responsibilities:
 *  1. Forward the user-configurable `activate-temp-chat` command
 *     (chrome://extensions/shortcuts) to the content script running on
 *     the active gemini.google.com tab.
 *  2. Make the toolbar icon a one-click shortcut to the Chrome shortcut
 *     manager, with a tooltip that reflects the current binding so users
 *     don't have to open the page just to check what it is.
 */

const COMMAND_NAME = 'activate-temp-chat';
const SHORTCUTS_URL = 'chrome://extensions/shortcuts';

// Chrome's getAll() returns shortcuts like "Alt+Shift+G" — on macOS users
// expect to see modifier glyphs (⌥⇧G), so transform when running on Mac.
function formatShortcut(shortcut, isMac) {
    if (!shortcut) return '';
    if (!isMac) return shortcut;
    return shortcut
        .replace(/Command/g, '⌘')
        .replace(/MacCtrl/g, '⌃')
        .replace(/Ctrl/g, '⌃')
        .replace(/Alt/g, '⌥')
        .replace(/Shift/g, '⇧')
        .replace(/\+/g, '');
}

async function refreshActionTitle() {
    try {
        const [commands, platform] = await Promise.all([
            chrome.commands.getAll(),
            chrome.runtime.getPlatformInfo(),
        ]);
        const cmd = commands.find((c) => c.name === COMMAND_NAME);
        const pretty = formatShortcut(cmd?.shortcut, platform.os === 'mac');
        const title = pretty
            ? `Shortcut: ${pretty} (click to change)`
            : 'Shortcut: not set (click to assign)';
        await chrome.action.setTitle({ title });
    } catch {
        // setTitle/getAll can fail transiently during install; ignore.
    }
}

chrome.runtime.onInstalled.addListener(refreshActionTitle);
chrome.runtime.onStartup.addListener(refreshActionTitle);

chrome.action.onClicked.addListener(() => {
    // Refresh in the background so the next hover reflects any change the
    // user is about to make. Don't await — opening the tab is the priority.
    refreshActionTitle();
    chrome.tabs.create({ url: SHORTCUTS_URL });
});

chrome.commands.onCommand.addListener(async (command, tab) => {
    if (command !== COMMAND_NAME) return;
    if (!tab || typeof tab.id !== 'number') return;

    try {
        await chrome.tabs.sendMessage(tab.id, { type: 'activate-temp-chat' });
    } catch {
        // No content script in this tab — shortcut was pressed on a
        // non-Gemini tab. Silently ignore.
    }
});
