import NepaliDate from "nepali-date";

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
 * Add the number of days to the date value and handle month change
 * @param {number} days
 */
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Set alarm to trigger at midnight if the machine is awake
 */
const setNewDayAlarm = () => {
  const today = new Date(new Date().toLocaleDateString());
  const tomorrow = today.addDays(1);
  chrome.alarms.create({ when: tomorrow.getTime() });
};

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
          const englishDate = new Date(nepaliDate.getEnglishDate());
          alert(
            `Conversion from BS to AD:\n\n${nepaliDate.format(
              "mmmm d, yyyy dddd"
            )} (${nepaliDate.format(
              "yyyy-mm-dd"
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
            )})\n${nepaliDate.format("mmmm d, yyyy dddd")} (${nepaliDate.format(
              "yyyy-mm-dd"
            )})`
          );
        } catch (e) {
          alert(
            "Incorrect date format!\nPlease enter date in YYYY-MM-DD format for conversion."
          );
        }
      }
    });
  });
};

/**
 * Redirect to full calendar on click
 */
chrome.browserAction.onClicked.addListener(() => {
  const CALENDAR_URL = "https://www.hamropatro.com/";
  chrome.tabs.create({ url: CALENDAR_URL });
});

/**
 * Set the date and alarm on browser startup
 */
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.clearAll(() => {
    setCurrentDate();
    setNewDayAlarm();
    setupContextMenu();
  });
});

/**
 * Run after fresh installation
 */
chrome.runtime.onInstalled.addListener(() => {
  setCurrentDate();
  setNewDayAlarm();
  setupContextMenu();
});

/**
 * Update the date when the alarm is triggered
 */
chrome.alarms.onAlarm.addListener(() => {
  setCurrentDate();
  setNewDayAlarm();
});
