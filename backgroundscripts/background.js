import NepaliDate from "nepali-date-converter";

NepaliDate.language = 'np';

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

/**
 * Setup alarm to check if another day has arrived
 */
const setupDateCheckAlarm = () => {
  chrome.alarms.create('check-for-update', { periodInMinutes: 60 });
}

/**
 * Set the date in the extension icon
 */
const setCurrentDate = () => {
  const Today = new NepaliDate();
  chrome.browserAction.setIcon({ path: `assets/icons/${Today.getDate()}.jpg` });
  chrome.browserAction.setBadgeText({ text: MONTHS[Today.getMonth()] });
  chrome.browserAction.setTitle({ title: Today.format("mmmm d, yyyy dddd") });
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
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "bs_to_ad",
      title: "Convert BS to AD",
      contexts: ["browser_action"],
    });
    chrome.contextMenus.create({
      id: "ad_to_bs",
      title: "Convert AD to BS",
      contexts: ["browser_action"],
    });
  });
};

/**
 * Redirect to full calendar on click
 */
chrome.browserAction.onClicked.addListener(() => {
  const CALENDAR_URL = "https://www.hamropatro.com/";
  chrome.tabs.create({ url: CALENDAR_URL }, () => {
    setCurrentDate();
  });
});

/**
 * Set the date and alarm on browser startup
 */
chrome.runtime.onStartup.addListener(() => {
  setCurrentDate();
  setupDateCheckAlarm();
  setupContextMenu();
});

/**
 * Set the listener for conversion functions
 */
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "bs_to_ad") {
    try {
      const bsDate = prompt(
        "Enter Nepali date (BS) you want to convert to AD:\n(YYYY-MM-DD)",
        "2052-02-04"
      );
      if (bsDate === null) {
        return;
      }
      const nepaliDate = new NepaliDate(bsDate);
      const englishDate = new Date(nepaliDate.toJsDate());
      alert(
        `Conversion from BS to AD:\n\n${nepaliDate.format(
          "MMMM D, YYYY ddd"
        )} (${nepaliDate.format(
          "YYYY MM DD"
        )})\n${englishDate.toDateString()} (${convertToLocaleDateString(
          englishDate
        )})`
      );
    } catch (e) {
      alert(
        "Incorrect date format!\nPlease enter date in YYYY-MM-DD format for conversion."
      );
    }
  } else if (info.menuItemId === "ad_to_bs") {
    try {
      const adDate = prompt(
        "Enter English date (AD) you want to convert to BS:\n(YYYY-MM-DD)",
        "1993-05-14"
      );
      if (adDate === null) {
        return;
      }
      const englishDate = new Date(adDate);
      const nepaliDate = new NepaliDate(englishDate);
      alert(
        `Conversion from AD to BS:\n\n${englishDate.toDateString()} (${convertToLocaleDateString(
          englishDate
        )})\n${nepaliDate.format("MMMM D, YYYY ddd")} (${nepaliDate.format(
          "YYYY-MM-DD"
        )})`
      );
    } catch (e) {
      alert(
        "Incorrect date format!\nPlease enter date in YYYY-MM-DD format for conversion."
      );
    }
  }
});

/**
 * Run after fresh installation
 */
chrome.runtime.onInstalled.addListener(() => {
  setCurrentDate();
  setupContextMenu();
  setupDateCheckAlarm();
});

/**
 * Update the date when the alarm is triggered
 */
chrome.alarms.onAlarm.addListener(() => {
  setCurrentDate();
});
