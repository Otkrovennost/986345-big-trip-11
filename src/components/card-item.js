import {formatDate, formatTime} from "../utils.js";

export const createCardItemTemplate = (cardData) => {

  const {type, price, city, start, end} = cardData;
  const startDate = formatDate(new Date(start), true);
  const endDate = formatDate(new Date(end), true);
  const startTime = formatTime(new Date(start).getHours(), new Date(start).getMinutes());
  const endTime = formatTime(new Date(end).getHours(), new Date(end).getMinutes());
  const difTime = new Date(end - start);

  const duration = () => {
    return difTime.getHours() * 60 + difTime.getMinutes();
  };

  return (`
    <li class="trip-events__item">
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
          <p class="event__duration">${duration()}M</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Order Uber</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">20</span>
          </li>
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
  </li>
  `);
};
