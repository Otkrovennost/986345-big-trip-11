import AbstractComponent from './abstract-component.js';

const TRIP_LENGTH = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3
};

const getTotalCost = (points) => {
  return points.reduce((acc, curr) => acc + curr.price, 0);
};

const getCitiesRoute = (points) => {
  let pointsLength = 0;
  switch (points.length) {
    case TRIP_LENGTH.ZERO:
      pointsLength = ``;
      break;
    case TRIP_LENGTH.ONE:
      pointsLength = points[0].city;
      break;
    case TRIP_LENGTH.TWO:
      pointsLength = points[0].city + `\u00A0\u2013\u00A0` + points[points.length - 1].city;
      break;
    case TRIP_LENGTH.THREE:
      pointsLength = points[0].city + `\u00A0\u2013\u00A0` + points[1].city + `\u00A0\u2013\u00A0` + points[points.length - 1].city;
      break;
    default:
      pointsLength = points[0].city + `\u00A0\u2013\u00A0...\u00A0\u2013\u00A0` + points[points.length - 1].city;
      break;
  }
  return pointsLength;
};

const getTripInterval = (points) => {
  if (points.length === 0) {
    return ``;
  } else if (points.length === 1) {
    return new Date(points[0].start).toDateString().substr(4, 6);
  } else {
    return new Date(points[0].start).toDateString().substr(4, 6) + ` - ` + (new Date(points[points.length - 1].end)).toDateString().substr(4, 6);
  }
};

const createTripInfoTemplate = (points) => {
  const citiesRoute = getCitiesRoute(points);
  const tripInterval = getTripInterval(points);
  const totalCost = getTotalCost(points);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${citiesRoute}</h1>
        <p class="trip-info__dates">${tripInterval}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
};

export default class Info extends AbstractComponent {
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;
  }

  getTemplate() {
    return createTripInfoTemplate(this._pointsModel.getPoints());
  }
}
