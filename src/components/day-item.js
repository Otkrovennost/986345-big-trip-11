import {formatDate, formatTime, getDuration, createElement} from "../utils.js";

const getServices = (arr) => {
  return arr.map((service) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${service.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${service.price}</span>
      </li>`
    );
  }).join(``);
};

const createDayItemTemplate = (cardData) => {

  const {type, price, city, start, end, services} = cardData;
  const startDate = formatDate(new Date(start), true);
  const endDate = formatDate(new Date(end), true);
  const startTime = formatTime(new Date(start).getHours(), new Date(start).getMinutes());
  const endTime = formatTime(new Date(end).getHours(), new Date(end).getMinutes());
  const difTime = new Date(end - start);
  const durationTime = getDuration(difTime);
  const servicesList = getServices(services);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} to ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
          <time class="event__start-time" datetime="${startDate}T${startTime}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDate}T${endTime}">${endTime}</time>
          </p>
          <p class="event__duration">${durationTime}M</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${servicesList}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class DayItem {
  constructor(cardData) {
    this._cardData = cardData;
    this._element = null;
  }

  getTemplate() {
    return createDayItemTemplate(this._cardData);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
