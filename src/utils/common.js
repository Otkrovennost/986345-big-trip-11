export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

export const formatDate = (date, isLong) => {
  const dateYear = date.getFullYear();
  const dateMonth = (`0` + date.getMonth()).slice(-2);
  const dateDay = (`0` + date.getDate()).slice(-2);

  return isLong ? `${dateYear}-${dateMonth}-${dateDay}` : `${dateDay}/${dateMonth}/${dateYear.toString().slice(-2)}`;
};

export const formatTime = (hours, minutes) => {
  return `${hours}:${(`0` + minutes).slice(-2)}`;
};

const millisecondsToHours = (timeInMs) => Math.floor((timeInMs / (1000 * 60 * 60)) % 24);

const millisecondsToMinutes = (timeInMs) => Math.floor((timeInMs / (1000 * 60)) % 60);

export const millisecondsToHm = (timeInMs) => {
  const hours = millisecondsToHours(timeInMs);
  const minutes = millisecondsToMinutes(timeInMs);

  return `${hours}H ${minutes}M`;
};

export const getDuration = (dif) => {
  const difInHours = Number(millisecondsToHours(dif));
  const difInMinutes = Number(millisecondsToMinutes(dif));

  return difInHours * 60 + difInMinutes;
};
