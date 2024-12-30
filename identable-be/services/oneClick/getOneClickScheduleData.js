const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { POST_GENERATE_TYPE, POST_STATUS } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const getOneClickScheduleData = async (entry) => {
  let {
    body: {
      dailyPost,
      isWeekendInclude,
      duration,
      isStartImmediately,
      startDate,
    },
    user: { _id, userTimezone },
  } = entry;

  let weekData = [];
  if (duration == "this week") {
    weekData = await getThisWeekdays(
      userTimezone,
      dailyPost,
      isWeekendInclude,
      isStartImmediately,
      startDate
    );
  } else if (duration == "15 days") {
    weekData = await getGeneratedDays(
      userTimezone,
      dailyPost,
      isWeekendInclude,
      15,
      isStartImmediately,
      startDate
    );
  } else if (duration == "30 days") {
    weekData = await getGeneratedDays(
      userTimezone,
      dailyPost,
      isWeekendInclude,
      30,
      isStartImmediately,
      startDate
    );
  } else if (duration == "60 days") {
    weekData = await getGeneratedDays(
      userTimezone,
      dailyPost,
      isWeekendInclude,
      60,
      isStartImmediately,
      startDate
    );
  }

  if (weekData?.length <= 0) {
    throw new Error("Time slot not available");
  }

  const timesArray = [
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
  ];
  const Morning = ["7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM"];
  const Lunchtime = ["12:00 PM", "12:30 PM", "1:00 PM"];
  const Evening = ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"];
  const AfterWork = ["8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM"];

  let timeCounter = 0;

  let startDate1 = weekData[0].date;
  let endDate = weekData[weekData?.length - 1].date;
  const startDateTimeStamp = moment(startDate1).startOf("day").valueOf();
  const endDateTimeStamp = moment(endDate).endOf("day").valueOf();

  let condition = {
    userId: _id,
    isDeleted: false,
    scheduleDateTime: {
      $gte: startDateTimeStamp,
      $lte: endDateTimeStamp,
    },
  };

  let aggregate = [
    {
      $match: condition,
    },
    {
      $project: {
        scheduleDateTime: 1,
        timeSlot: 1,
        scheduleDateTimeString: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $add: [new Date(0), "$scheduleDateTime"] },
          },
        },
      },
    },
  ];

  let postData = await dbService.aggregateData("PostModel", aggregate);

  let newWeekData = [];

  for (let i = 0; i < weekData?.length; i++) {
    const weekObj = weekData[i];

    if (timeCounter >= timesArray?.length) {
      timeCounter = 0;
    }

    for (let j = timeCounter; j < timesArray?.length; j++) {
      const timeSlot = timesArray[j];

      let filterArray = postData?.filter(
        (obj) =>
          obj?.scheduleDateTimeString == weekObj?.date &&
          obj?.timeSlot == timeSlot
      );

      let timePeriod = "";
      if (Morning.includes(timeSlot)) {
        timePeriod = "Morning";
      } else if (Lunchtime.includes(timeSlot)) {
        timePeriod = "Lunchtime";
      } else if (Evening.includes(timeSlot)) {
        timePeriod = "Experiment Evening";
      } else if (AfterWork.includes(timeSlot)) {
        timePeriod = "After-work";
      }
      if (filterArray?.length == 0) {
        newWeekData.push({
          ...weekObj,
          timeSlot: timeSlot,
          timePeriod: timePeriod,
        });
        timeCounter = j + 5;
        break;
      }
    }
  }

  return newWeekData;
};

export const getTimestampInUserTimezone = async (userTimezone, date, time) => {
  const dateTimeString = `${date} ${time}`;
  const userTimestamp = moment.tz(dateTimeString, userTimezone).valueOf();
  return userTimestamp;
};

export const getThisWeekdays = async (
  userTimezone,
  dailyPost,
  includeWeekend = false,
  isStartImmediately,
  startDate
) => {
  let now = moment().tz(userTimezone);
  if (!isStartImmediately) {
    now = moment(startDate).tz(userTimezone);
  }

  let isStartDateCurrent = false;
  const endDateTimeStamp = moment().endOf("day").valueOf();
  if (startDate <= endDateTimeStamp) {
    isStartDateCurrent = true;
  }

  let daysToAdd = includeWeekend ? 7 - now.isoWeekday() : 5 - now.isoWeekday();
  if (daysToAdd <= 0) {
    if (includeWeekend) {
      daysToAdd = 7;
    } else {
      if (now.isoWeekday() == 6) {
        now.add(1, "days");
      }
      daysToAdd = 5;
    }
  }
  const weekdays = [];
  let weekCounter = 0;
  while (weekCounter < daysToAdd) {
    if (isStartDateCurrent) {
      now.add(1, "days");
    }

    // Skip weekends if not included
    if (includeWeekend || (now.isoWeekday() >= 1 && now.isoWeekday() <= 5)) {
      for (let i = 0; i < dailyPost; i++) {
        weekdays.push({
          day: now.format("dddd"),
          date: now.format("YYYY-MM-DD"),
        });
      }
      weekCounter += 1;
    }
    if (!isStartDateCurrent) {
      now.add(1, "days");
    }
  }

  return weekdays;
};

export const getGeneratedDays = async (
  userTimezone,
  dailyPost,
  includeWeekend = false,
  days,
  isStartImmediately,
  startDate
) => {
  let now = moment().tz(userTimezone);
  if (!isStartImmediately) {
    now = moment(startDate).tz(userTimezone);
  }

  let isStartDateCurrent = false;
  const endDateTimeStamp = moment().endOf("day").valueOf();
  if (startDate <= endDateTimeStamp) {
    isStartDateCurrent = true;
  }

  let daysToAdd = days;
  const weekdays = [];
  let weekCounter = 0;
  while (weekCounter < daysToAdd) {
    if (isStartDateCurrent) {
      now.add(1, "days");
    }
    // Skip weekends if not included
    if (includeWeekend || (now.isoWeekday() >= 1 && now.isoWeekday() <= 5)) {
      for (let i = 0; i < dailyPost; i++) {
        weekdays.push({
          day: now.format("dddd"),
          date: now.format("YYYY-MM-DD"),
        });
      }
      weekCounter += 1;
    }
    if (!isStartDateCurrent) {
      now.add(1, "days");
    }
  }

  return weekdays;
};
