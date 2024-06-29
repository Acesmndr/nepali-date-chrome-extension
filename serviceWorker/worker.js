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
 * Get timezone offset with nepal time
 * @returns offset in ms
 */
const getOffset = () => {
  return (-5 * 60 + 45 - new Date().getTimezoneOffset()) * 60 * 1000;
};

/**
 * Get today's nepali date
 * @returns Nepali date with offset set
 * Offset is negative for Germany and positive for Australia
 */
const getToday = () => {
  return new NepaliDate(new Date().getTime() - getOffset());
};

/**
 * Get start of day considering the timezone offset
 */
const getStartOfDayInNepal = () => {
  let localDate = new Date();
  localDate.setDate(localDate.getDate() + 1);
  localDate.setHours(0, 0, 0, 0);
  return localDate.getTime() + getOffset() + 1;
};

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
    when: getStartOfDayInNepal(),
  });
};

/**
 * Set the date in the extension icon
 */
const setCurrentDate = (withoutMenuSetup) => {
  const Today = getToday();
  chrome.action.setIcon({ path: `icons/${Today.getDate()}.jpg` });
  chrome.action.setBadgeText({ text: MONTHS[Today.getMonth()] });
  chrome.action.setTitle({ title: Today.format("MMMM D, YYYY ddd") });
  !withoutMenuSetup && updateContextMenu();
  if (isFirefox) {
    chrome.action.setBadgeBackgroundColor({ color: "white" });
  }
};

/**
 * Setup context menu
 */
const setupContextMenu = async () => {
  if (isFirefox) {
    return;
  }
  await chrome.contextMenus.removeAll();
  const Today = getToday();
  chrome.contextMenus.create({
    id: "nepaliDate",
    title: Today.format("MMMM D, YYYY ddd"),
    contexts: ["action"],
  });
  chrome.contextMenus.create({
    id: "englishDate",
    title: new Date().toLocaleDateString("en-UK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    contexts: ["action"],
  });
  chrome.contextMenus.create({
    id: "hamropatro",
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
  chrome.contextMenus.create({
    id: "donate",
    title: "Buy developer a coffee ☕️",
    contexts: ["action"],
  });
};

const updateContextMenu = () => {
  if (isFirefox) {
    return;
  }
  const Today = getToday();
  chrome.contextMenus.update("nepaliDate", {
    title: Today.format("MMMM D, YYYY ddd"),
  });
  chrome.contextMenus.update("englishDate", {
    title: new Date().toLocaleDateString("en-UK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  });
};

/**
 * Setup offscreen document to copy to clipboard
 */
let creating; // A global promise to avoid concurrency issues
async function createOffscreenDocument(path) {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [offscreenUrl],
  });

  if (existingContexts.length > 0) {
    return;
  }

  // create offscreen document
  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: offscreenUrl,
      reasons: [chrome.offscreen.Reason.CLIPBOARD],
      justification: "To copy to clipboard",
    });
    await creating;
    creating = null;
  }
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
  chrome.offscreen.hasDocument(async (documentExists) => {
    if (!documentExists) {
      await createOffscreenDocument("assets/offscreen.html");
    }
    chrome.runtime.sendMessage({
      type: "copy",
      target: "offscreen",
      data: text,
    });
  });
}

/**
 * Set the date and alarm on browser startup
 */
chrome.runtime.onStartup.addListener(() => {
  setupContextMenu();
  setCurrentDate(true);
  setupPeriodicCheckAlarm();
  setupNextDayAlarm();
});

/**
 * Set the listener for conversion functions
 */
chrome.contextMenus.onClicked.addListener((info) => {
  if (isFirefox) {
    return; // Currently disabled for firefox
  }
  const Today = getToday();
  switch (info.menuItemId) {
    case "refresh":
      setCurrentDate();
      break;
    case "hamropatro":
      const CALENDAR_URL = "https://www.hamropatro.com/";
      chrome.tabs.create({ url: CALENDAR_URL });
      break;
    case "converter":
      const CONVERTER_URL = "https://www.nepcal.com/date_conv.php";
      chrome.tabs.create({ url: CONVERTER_URL });
      break;
    case "nepaliDate":
      copyToClipboard(Today.format("YYYY/MM/DD"));
      break;
    case "englishDate":
      copyToClipboard(new Date().toLocaleDateString("en-GB"));
      break;
    case "donate":
      const DONATION_URL = "https://buymeacoffee.com/acesmndr";
      chrome.tabs.create({ url: DONATION_URL });
      break;
    default:
  }
});

/**
 * Run after fresh installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case "install":
      chrome.tabs.create({
        url: "https://sites.google.com/view/nepali-date-extension/home",
      });
      break;
    case "update":
      chrome.tabs.create({
        url: "https://sites.google.com/view/nepali-date-extension/home",
      });
      break;
    case "chrome_update":
    default:
  }
  setupContextMenu();
  setCurrentDate(true);
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
