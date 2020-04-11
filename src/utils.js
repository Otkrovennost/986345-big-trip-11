export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstChild;
};

export const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

export const renderElement = (container, template, place) => {
  switch (place) {
    case `afterbegin`:
      container.prepend(template);
      break;
    case `beforeend`:
      container.append(template);
      break;
  }
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

export const getDuration = (time) => {
  return time.getHours() * 60 + time.getMinutes();
};
