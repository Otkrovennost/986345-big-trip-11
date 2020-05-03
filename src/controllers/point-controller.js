import moment from "moment";
import {renderElement, RenderPosition, remove, replace} from '../utils/render.js';
import {getRandomDate} from '../mock/card.js';
import Event from '../components/event.js';
import EventEdit from '../components/event-edit.js';
import PointModel from '../models/point.js';
import Store from '../models/store.js';

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  CREATING: `creating`
};

export const EmptyPoint = {
  id: String(Math.floor(getRandomDate() + Math.random())),
  type: `bus`,
  city: ``,
  photos: [],
  description: ``,
  offers: [],
  start: Math.min(getRandomDate(), getRandomDate()),
  end: Math.max(getRandomDate(), getRandomDate()),
  price: 0,
  isFavorite: false
};

const parseFormData = (formData) => {
  const selectedOffers = [
    ...document.querySelectorAll(`.event__offer-checkbox:checked + label[for^="event"]`)
  ];

  const destination = Store.getDestinations().find((city) => city.name === formData.get(`event-destination`));

  return new PointModel({
    'base_price': Number(formData.get(`event-price`)),
    'date_from': new Date(
        moment(formData.get(`event-start-time`), `DD/MM/YYYY HH:mm`).valueOf()
    ).toISOString(),
    'date_to': new Date(
        moment(formData.get(`event-end-time`), `DD/MM/YYYY HH:mm`).valueOf()
    ).toISOString(),
    'destination': {
      'description': destination.description,
      'name': destination.name,
      'pictures': destination.pictures
    },
    'id': `0`,
    'is_favorite': formData.get(`event-favorite`) ? true : false,
    'offers': selectedOffers.map((offer) => ({
      'title': offer.querySelector(`.event__offer-title`).textContent,
      'price': Number(offer.querySelector(`.event__offer-price`).textContent)
    })),
    'type': formData.get(`event-type`)
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(_point, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._mode = mode;

    this._eventComponent = new Event(_point);
    this._eventEditComponent = new EventEdit(_point);

    const eventsList = this._container.querySelector(`.trip-events__list`);

    this._eventComponent.setClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData);
      this._onDataChange(this, _point, data);
      this._replaceEditToTask();
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, _point, null));

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      const newPoint = PointModel.clone(_point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, _point, newPoint);
      this._mode = Mode.EDIT;
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
        } else {
          renderElement(eventsList, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.CREATING:
        if (oldEventComponent && oldEventEditComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderElement(eventsList, this._eventEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.CREATING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
