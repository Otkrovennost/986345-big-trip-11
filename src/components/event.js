import moment from "moment";
import {getDurationTime, getUpperCaseFirstLetter} from '../utils/common.js';
import {actionByTypeToPlaceholder} from '../utils/data.js';
import AbstractComponent from './abstract-component.js';

const SHOWED_OFFERS = 3;
const getOffers = (arr) => {
  return arr.slice(0, SHOWED_OFFERS).map((offers) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offers.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offers.price}</span>
      </li>`
    );
  }).join(``);
};

const createEventTemplate = (point) => {

  const {type, price, city, start, end, offers} = point;
  const offersList = getOffers(offers);
  const startDate = moment(start).format(`YYYY-MM-DDThh:mm:ss`);
  const endDate = moment(end).format(`YYYY-MM-DDThh:mm:ss`);
  const startTime = moment(start).format(`HH:mm`);
  const endTime = moment(end).format(`HH:mm`);
  const durationTime = getDurationTime(end - start);


  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${getUpperCaseFirstLetter(type)} ${actionByTypeToPlaceholder[getUpperCaseFirstLetter(type)]} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
          <time class="event__start-time" datetime="${startDate}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDate}">${endTime}</time>
          </p>
          <p class="event__duration">${durationTime}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${offersList}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractComponent {
  constructor(point) {
    super();

    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return createEventTemplate(this._point);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
