const chatTimeFormat = (date) => {
  const now = new Date();
  const chatDate = new Date(date);

  const isToday =
    chatDate.getDate() === now.getDate() &&
    chatDate.getMonth() === now.getMonth() &&
    chatDate.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    chatDate.getDate() === yesterday.getDate() &&
    chatDate.getMonth() === yesterday.getMonth() &&
    chatDate.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    // Format time as "HH:MM AM/PM"
    const hours = chatDate.getHours();
    const minutes = chatDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    // Format date as "m/d/yyyy"
    const month = chatDate.getMonth() + 1;
    const day = chatDate.getDate();
    const year = chatDate.getFullYear();
    return `${month}/${day}/${year}`;
  }
};

module.exports = chatTimeFormat;
