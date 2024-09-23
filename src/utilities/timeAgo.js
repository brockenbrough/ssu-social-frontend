const timeAgo = (date) => {
  const now = new Date();
  const commentDate = new Date(date);
  const diffInSeconds = Math.max(0, (now - commentDate) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 60 * 60;
  const secondsInDay = 60 * 60 * 24;
  const secondsInMonth = 60 * 60 * 24 * 30;
  const secondsInYear = 60 * 60 * 24 * 365;

  if (diffInSeconds < secondsInMinute) {
    return "Just now";
  } else if (diffInSeconds < secondsInHour) {
    return `${Math.floor(diffInSeconds / secondsInMinute)} minute${
      Math.floor(diffInSeconds / secondsInMinute) !== 1 ? "s" : ""
    } ago`;
  } else if (diffInSeconds < secondsInDay) {
    return `${Math.floor(diffInSeconds / secondsInHour)} hour${
      Math.floor(diffInSeconds / secondsInHour) !== 1 ? "s" : ""
    } ago`;
  } else if (diffInSeconds < secondsInMonth) {
    return `${Math.floor(diffInSeconds / secondsInDay)} day${
      Math.floor(diffInSeconds / secondsInDay) !== 1 ? "s" : ""
    } ago`;
  } else if (diffInSeconds < secondsInYear) {
    return `${Math.floor(diffInSeconds / secondsInMonth)} month${
      Math.floor(diffInSeconds / secondsInMonth) !== 1 ? "s" : ""
    } ago`;
  } else {
    return `${Math.floor(diffInSeconds / secondsInYear)} year${
      Math.floor(diffInSeconds / secondsInYear) !== 1 ? "s" : ""
    } ago`;
  }
};

module.exports = timeAgo;
