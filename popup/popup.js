const BADGE_URL = "nepali-calendar/widget/calendar-badge";

const setIframeUrl = (url) => {
  const iFrame = document.getElementById("iframe");
  const iFrameHolder = document.getElementsByClassName("iframe-holder")[0];
  iFrame.src = `https://www.ashesh.com.np/${url}.php`;
  iFrameHolder.style.height = url === BADGE_URL ? "250px" : "400px";
};

const openLink = (url) => {
  chrome.tabs.create({ url });
};

const init = () => {
  setTimeout(() => {
    /** Set timeout kept so that extension popup is shown to the user before fetching the iframe url */
    setIframeUrl(BADGE_URL);
  }, 10);
  const buttons = document.querySelectorAll(".tab-menu-link");
  buttons.forEach((el) =>
    el.addEventListener("click", (event) => {
      console.log(event);
      setIframeUrl(event.target.getAttribute("data-link"));
      buttons.forEach((item) => {
        item.classList.remove("is-active");
      });
      event.target.classList.add("is-active");
    })
  );
  document.getElementById("powered-by").addEventListener("click", (evt) => {
    evt.preventDefault();
    openLink("https://www.ashesh.com.np/nepali-calendar/");
  });
  setIframeListener();
};

window.addEventListener("DOMContentLoaded", init, false);
