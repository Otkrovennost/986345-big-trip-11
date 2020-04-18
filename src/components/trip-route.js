import AbstractComponent from "./abstract-component.js";

const createTripRouteTemplate = (cities, dates) => {

  const getCitiesRout = () => {
    if (cities.length <= 3) {
      return cities.map((city) => city).join(` &mdash; `);
    } else {
      return (cities[0] + ` &mdash;` + ` &hellip; ` + `&mdash; ` + cities[cities.length - 1]).toString();
    }
  };

  const getTripDates = () => {
    return (dates[0].slice(4, 10) + `&nbsp;&mdash;&nbsp;` + dates[dates.length - 1].slice(8, 10)).toString();
  };

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${getCitiesRout()}</h1>
      <p class="trip-info__dates">${getTripDates()}</p>
    </div>`
  );
};

export default class TripRoute extends AbstractComponent {
  constructor(cities, dates) {
    super();

    this._cities = cities;
    this._datest = dates;
    this._element = null;
  }

  getTemplate() {
    return createTripRouteTemplate(this._cities, this._datest);
  }
}
