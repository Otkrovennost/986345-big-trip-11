import moment from "moment";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import AbstractSmartComponent from './abstract-smart-component.js';
import {clearString, getUpperCaseFirstLetter} from '../utils/common.js';
import {EmptyPoint} from '../controllers/point-controller.js';
import {routeTypes, actionByTypeToPlaceholder} from '../const.js';
import Store from '../models/store.js';

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const getTypeTransport = (arr) => {
  return arr.map((typeTransport) => {
    return (
      `<div class="event__type-item">
         <input id="event-type-${typeTransport.toLowerCase().slice(0, -3)}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeTransport.toLowerCase().slice(0, -3)}">
         <label class="event__type-label  event__type-label--${typeTransport.toLowerCase().slice(0, -3)}" for="event-type-${typeTransport.toLowerCase().slice(0, -3)}-1">${typeTransport.slice(0, -3)}</label>
      </div>`
    );
  }).join(``);
};

const getTypeActivity = (arr) => {
  return arr.map((activity) => {
    return (
      `<div class="event__type-item">
        <input id="event-type-${activity.toLowerCase().slice(0, -3)}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${activity.toLowerCase().slice(0, -3)}">
        <label class="event__type-label  event__type-label--${activity.toLowerCase().slice(0, -3)}" for="event-type-${activity.toLowerCase().slice(0, -3)}-1">${activity.slice(0, -3)}</label>
      </div>`
    );
  }).join(``);
};

const getOffers = (array) => {
  return array.map((offer) => {
    return (`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-${offer.title}" type="checkbox" name="event-${offer.title}"  ${offer.isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-${offer.title}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    );
  }).join(``);
};

const getPhotosList = (array) => {
  return array.map((photo) => {
    return (`<img class="event__photo" src="${photo.src}" alt="${photo.description}">`);
  }).join(``);
};

const getCities = (array, element) => {
  return array.map((cityName) => {
    return (`<option value="${cityName}" ${cityName === element ? `selected` : ``}>${cityName}</option>`);
  }).join(``);
};

const createEditEventTemplate = (point, options) => {

  const {start, end, price, isFavorite, index} = point;
  const {type, city, description, photos, offers, externalData} = options;

  let creatingPoint = false;

  if (point === EmptyPoint) {
    creatingPoint = true;
  }

  const cities = Store.getDestinations().map((destination) => destination.name);

  const startDate = moment(start).format(`DD/MM/YY HH:mm`);
  const endDate = moment(end).format(`DD/MM/YY HH:mm`);
  const typeTransport = getTypeTransport(routeTypes[0]);
  const typeActivity = getTypeActivity(routeTypes[1]);
  const offersList = getOffers(offers);
  const photosList = getPhotosList(photos);
  const citiesList = getCities(cities, city);
  const isFavourite = isFavorite ? `checked` : ``;
  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  return (
    `<form class="trip-events__item event event--edit" action="#" method="post">
      <header class="event__header">
      <input class="visually-hidden" name="event-current-type" id="event-current-type-name" value="${type}">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
               ${typeTransport}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${typeActivity}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${getUpperCaseFirstLetter(type)} ${actionByTypeToPlaceholder[getUpperCaseFirstLetter(type)]}
          </label>
          <select class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${citiesList}
          </datalist>
          </select>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${index}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${index}"  type="text" name="event-price" maxlength="5" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${creatingPoint ? `Cancel` : deleteButtonText}</button>
        <input id="event-favorite-${index}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavourite}>
        <label class="event__favorite-btn ${creatingPoint ? `visually-hidden` : ``}" for="event-favorite-${index}">
          <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>
        ${creatingPoint ? `` : `
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>

      ${offers.length > 0 || description.length > 0 ?
      `<section class="event__details">
        ${offers.length > 0 ?
      `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${offersList}
          </div>
        </section>` : ``}

        ${description.length > 0 ?
      `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
          ${photos.length > 0 ?
      `<div class="event__photos-container">
            <div class="event__photos-tape">
            ${photosList}
            </div>
          </div>` : ``}
        </section>` : ``}
      </section>` : ``}
    </form>`
  );
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(point) {
    super();

    this._point = point;
    this._type = point.type;
    this._city = point.city;
    this._price = point.price;
    this._description = point.description;
    this._offers = [...point.offers];
    this._photos = [...point.photos];
    this._externalData = DefaultData;

    this._element = null;
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;

    this._favoritesClickHandler = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._clickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._point, {
      type: this._type,
      city: this._city,
      description: this._description,
      offers: this._offers,
      photos: this._photos,
      externalData: this._externalData
    });
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesButtonClickHandler(this._favoritesClickHandler);
    this.setClickHandler(this._clickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  reset() {
    const point = this._point;

    this._type = point.type;
    this._city = point.city;

    this.rerender();
  }

  disableForm() {
    const form = this.getElement();
    const elements = Array.from(form.elements);
    elements.forEach((elem) => {
      elem.readOnly = true;
    });
  }

  activeForm() {
    const form = this.getElement();
    const elements = Array.from(form.elements);
    elements.forEach((elem) => {
      elem.readOnly = false;
    });
  }

  removeElement() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    super.removeElement();
  }

  setClickHandler(handler) {
    const element = this.getElement().querySelector(`.event__rollup-btn`);
    if (element) {
      element.addEventListener(`click`, handler);
      this._clickHandler = handler;
    }
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, handler);
    this._favoritesClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._type = evt.target.value;
      this._offers = Store.getOffers().find((offer) => offer.type === this._type).offers;

      this.rerender();
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      this._city = evt.target.value;
      this._photos = Store.getDestinations().find((destination) => destination.name === this._city).pictures;
      this._description = Store.getDestinations().find((destination) => destination.name === this._city).description;

      this.rerender();
    });

    element.querySelector(`.event__input--price`).addEventListener(`input`, (evt) => {
      evt.target.value = clearString(evt.target.value);
    });

    element.querySelector(`#event-start-time-1`).addEventListener(`change`, (evt) => {
      const endDateInput = element.querySelector(`#event-end-time-1`);
      endDateInput.value = evt.target.value;
    });
  }

  _applyFlatpickr() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    const element = this.getElement();

    const options = {
      allowInput: true,
      dateFormat: `d/m/y H:i`,
      minDate: this._point.start,
      enableTime: true
    };

    this._flatpickrStartDate = flatpickr(element.querySelector(`#event-start-time-1`), Object.assign({}, options, {defaultDate: this._point.start}));

    this._flatpickrEndDate = flatpickr(element.querySelector(`#event-end-time-1`), Object.assign({}, options, {defaultDate: this._point.end}));

    const flatpickrEndDate = this._flatpickrEndDate;

    this._flatpickrStartDate.config.onChange.push((selectedDates) => {
      flatpickrEndDate.set(`minDate`, selectedDates[0]);
    });
  }
}
