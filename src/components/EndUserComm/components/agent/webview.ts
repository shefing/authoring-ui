// Type declaration for WebView2 API
declare global {
  interface Window {
    chrome?: {
      webview?: {
        postMessage: (message: string) => void;
      };
    };
  }
}

/**
 * Closes the WebView2 window by sending a message to the host application
 */
export function closeWindow(): void {
  if (typeof window !== 'undefined' && window.chrome?.webview) {
    window.chrome.webview.postMessage('CloseWindow');
  }
}

