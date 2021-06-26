const BADGE_URL = 'nepali-calendar/widget/calendar-badge';

const setIframeUrl = (url) => {
  const iFrame = document.getElementById('cb_nciframe');
  const iFrameHolder = document.getElementsByClassName('iframe-holder')[0];
  iFrame.src = `https://www.ashesh.com.np/${url}.php`;
  iFrameHolder.style.height = url === BADGE_URL ? '250px' : '400px';
};

const openLink = (url) => {
  chrome.tabs.create({ url });
};

const init = () => {
  setTimeout(() => {
    /** Set timeout kept so that extension popup is shown to the user before fetching the iframe url */
    setIframeUrl(BADGE_URL);
  }, 10);
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(el => el.addEventListener('click', event => {
    setIframeUrl(event.target.getAttribute("data-link"));
  }));
  document.getElementById('powered-by').addEventListener('click', (evt) => {
    evt.preventDefault();
    openLink('https://www.ashesh.com.np/nepali-calendar/');
  });
};

window.addEventListener('DOMContentLoaded', init, false);
