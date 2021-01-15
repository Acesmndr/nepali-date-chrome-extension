import NepaliDate from 'nepali-date';

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
  });
});

chrome.runtime.onInstalled.addListener(() => {
  setCurrentDate();
  setNewDayAlarm();
});

/**
 * Update the date when the alarm is triggered
 */
chrome.alarms.onAlarm.addListener(() => {
  setCurrentDate();
  setNewDayAlarm();
});
