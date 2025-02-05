export const formatIsoDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const formatTimeAgo = (timestamp: number): string => {
  const now = new Date();
  const date = new Date(timestamp * 1000);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 60 * 60;
  const secondsInDay = 60 * 60 * 24;
  const secondsInWeek = 60 * 60 * 24 * 7;

  if (diffInSeconds < secondsInMinute) {
    // Less than a minute ago
    return `a few seconds ago`;
  } else if (diffInSeconds < secondsInHour) {
    // Less than an hour ago
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < secondsInDay) {
    // Less than a day ago
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < secondsInDay * 2) {
    // Yesterday
    return 'Yesterday';
  } else if (diffInSeconds < secondsInWeek) {
    // Less than a week ago
    const days = Math.floor(diffInSeconds / secondsInDay);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    // More than a week ago, return full date/time in DD/MM/YYYY hh:mm:ss AM/PM format
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }
};