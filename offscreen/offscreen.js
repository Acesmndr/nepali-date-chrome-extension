chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "copy" && request.target === "offscreen") {
    handleClipboardWrite(request.data);
    return true;
  }
});

async function handleClipboardWrite(data) {
  try {
    const textEl = document.querySelector('#text');
    textEl.value = data;
    textEl.select();
    document.execCommand('copy');
  } finally {
    window.close();
  }
}
