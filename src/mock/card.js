import {getRandomArrayItem, getRandomIntegerNumber} from "../utils.js";

const CADRS_AMOUNT = 20;

export const routeTypes = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
];

export const cities = [
  `London`,
  `Edinburg`,
  `Cardiff`,
  `Belfast`,
  `Glasgow`,
];

const services = [
  {
    type: `luggage`,
    title: `Add luggage`,
    price: 30
  },
  {
    type: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  },
  {
    type: `meal`,
    title: `Add meal`,
    price: 15
  },
  {
    type: `seats`,
    title: `Choose seats`,
    price: 5
  }
];

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const getRandomPhotos = () => {
  const photos = [];

  for (let i = 0; i < getRandomIntegerNumber(1, 5); i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return photos;
};

const getRandomDescription = () => {
  return descriptions
    .filter(() => Math.random() > 0.5)
    .slice(0, getRandomIntegerNumber(1, 3))
    .join(` `)
    .trim();
};

const getRandomServices = () => {
  const currentServices = [];

  for (let i = 0; i < getRandomIntegerNumber(0, 4); i++) {
    currentServices.push(services[i]);
  }

  return currentServices;
};

const getRandomDate = () => {
  return (
    Date.now() +
    1 +
    Math.floor(Math.random() * 7) * 24 * getRandomIntegerNumber(0, 60) * 60 * 1000
  );
};

const generateCard = () => {
  const startDate = getRandomDate();
  const endDate = getRandomDate();

  return {
    type: getRandomArrayItem(routeTypes),
    city: getRandomArrayItem(cities),
    photos: getRandomPhotos(),
    description: getRandomDescription(),
    services: getRandomServices(),
    start: Math.min(startDate, endDate),
    end: Math.max(startDate, endDate),
    price: getRandomIntegerNumber(10, 100)
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(() => generateCard())
    .sort(
        (current, next) => current.start - next.start
    );
};

export const cardsList = generateCards(CADRS_AMOUNT);

export const datesList = [
  ...new Set(cardsList.map((elem) => new Date(elem.start).toDateString()))
];