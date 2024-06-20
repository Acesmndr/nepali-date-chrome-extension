import NepaliDate from "nepali-date-converter";

NepaliDate.language = "np";

/*
  Month names in Nepali
  Space added infront of two character names for covering up the browser action text
*/
const MONTHS = [
  "बैशाख",
  " जेठ",
  "अषाढ",
  "श्रावण",
  " भाद्र",
  "आश्विन",
  "कार्तिक",
  "मङ्सिर",
  " पौष",
  " माघ",
  "फाल्गुन",
  " चैत्र",
];

/** Check if it's firefox browser */
const isFirefox = (() => {
  try {
    return !!browser;
  } catch (e) {
    return false;
  }
})();

/**
 * Setup periodic alarm to check if another day has arrived
 */
const setupPeriodicCheckAlarm = () => {
  chrome.alarms.create("check-for-update", { periodInMinutes: 120 });
};

/**
 * Setup alarm to update date exactly when next day arrives
 */
const setupNextDayAlarm = () => {
  const dateToUpdate = new NepaliDate(new Date().getTime());
  dateToUpdate.setDate(dateToUpdate.getDate() + 1);
  chrome.alarms.create("next-day-alarm", {
    when: new Date(dateToUpdate.toJsDate()).getTime(),
  });
};

/**
 * Set the date in the extension icon
 */
const setCurrentDate = (withoutMenuSetup) => {
  const Today = new NepaliDate(new Date().getTime());
  chrome.action.setIcon({ path: `icons/${Today.getDate()}.jpg` });
  chrome.action.setBadgeText({ text: MONTHS[Today.getMonth()] });
  chrome.action.setTitle({ title: Today.format("MMMM D, YYYY ddd") });
  !withoutMenuSetup && setupContextMenu();
  if (isFirefox) {
    chrome.action.setBadgeBackgroundColor({ color: "white" });
  }
};

/**
 * Convert to date string in YYYY-MM-DD format
 * @param {Date} date
 */
const convertToLocaleDateString = (date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
    .toISOString()
    .split("T")[0];
};

/**
 * Setup context menu with conversion functions
 * to convert date from AD to BS and viceversa
 */
const setupContextMenu = () => {
  if (isFirefox) {
    return;
  }
  chrome.contextMenus.removeAll(() => {
    const Today = new NepaliDate(new Date().getTime());
    chrome.contextMenus.create({
      id: "today_nepali_date",
      title: Today.format("MMMM D, YYYY ddd"),
      contexts: ["action"],
    });
    chrome.contextMenus.create({
      id: "today_english_date",
      title: new Date().toLocaleDateString("en-UK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      contexts: ["action"],
    });
    chrome.contextMenus.create({
      id: "hamro_patro",
      title: "हाम्रो पात्रो 🗓️",
      contexts: ["action"],
    });
    chrome.contextMenus.create({
      id: "converter",
      title: "मिति कनवर्टर ⚙️",
      contexts: ["action"],
    });
    chrome.contextMenus.create({
      id: "refresh",
      title: "रिफ्रेस ♼",
      contexts: ["action"],
    });
  });
};

/**
 * Set the date and alarm on browser startup
 */
chrome.runtime.onStartup.addListener(() => {
  setCurrentDate();
  setupPeriodicCheckAlarm();
  setupContextMenu();
  setupNextDayAlarm();
});

/**
 * Set the listener for conversion functions
 */
chrome.contextMenus.onClicked.addListener((info) => {
  if (isFirefox) {
    return; // Currently disabled for firefox
  }
  switch (info.menuItemId) {
    case "refresh":
      setCurrentDate();
      break;
    case "hamro_patro":
      const CALENDAR_URL = "https://www.hamropatro.com/";
      chrome.tabs.create({ url: CALENDAR_URL });
      break;
    case "converter":
      const CONVERTER_URL = "https://www.nepcal.com/date_conv.php";
      chrome.tabs.create({ url: CONVERTER_URL });
      break;
    default:
  }
});

/**
 * Run after fresh installation
 */
chrome.runtime.onInstalled.addListener(() => {
  // chrome.tabs.create({ url: "https://facebook.com" });
  setCurrentDate();
  setupContextMenu();
  setupPeriodicCheckAlarm();
  setupNextDayAlarm();
});

/**
 * Handle case when machine has been put to sleep instead of shutting down
 */
chrome.idle.setDetectionInterval(2 * 60 * 60);
chrome.idle.onStateChanged.addListener((state) => {
  if (state === "active") {
    setCurrentDate();
    setupNextDayAlarm();
  }
});

/**
 * Update the date when the alarm is triggered
 */
chrome.alarms.onAlarm.addListener(() => {
  setCurrentDate();
  setupNextDayAlarm();
});
