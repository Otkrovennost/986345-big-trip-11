import moment from "moment";
import {DuringData, DefaultData, Keys} from '../const.js';
import Event from '../components/event.js';
import EventEdit from '../components/event-edit.js';
import PointModel from '../models/point.js';
import {renderElement, RenderPosition, remove, replace} from '../utils/render.js';
import Store from '../models/store.js';

const newAddIventButton = document.querySelector(`.trip-main__event-add-btn`);

const SHAKE_ANIMATION_TIMEOUT = 600;
const ERROR_BORDER = `2px solid red`;
export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  CREATING: `creating`
};

export const EmptyPoint = {
  id: String(Date.now() + Math.random()),
  type: `flight`,
  city: ``,
  photos: [],
  description: ``,
  offers: [],
  start: new Date(),
  end: new Date(),
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
    'is_favorite': formData.get(`event-favorite`) ? true : false,
    'offers': selectedOffers.map((offer) => ({
      'title': offer.querySelector(`.event__offer-title`).textContent,
      'price': Number(offer.querySelector(`.event__offer-price`).textContent)
    })),
    'type': formData.get(`event-current-type`)
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

    this._eventComponent.setClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData);
      this._eventEditComponent.disableForm();
      this._eventEditComponent.setData({
        saveButtonText: DuringData.SAVE_BTN,
      });

      this._onDataChange(this, _point, data);
      this._eventEditComponent.activeForm();
      this._activeAddNewIventButton();
    });

    this._eventEditComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();

      this._eventEditComponent.setData({
        deleteButtonText: DuringData.DELETE_BTN,
      });
      this._eventEditComponent.disableForm();
      if (this._mode === Mode.CREATING) {
        this._onDataChange(this, EmptyPoint, null);
        this._activeAddNewIventButton();
      }

      this._onDataChange(this, _point, null);
      this._eventEditComponent.activeForm();
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      const newPoint = PointModel.clone(_point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, _point, newPoint);
    });

    this._eventEditComponent.setClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToTask();
        } else {
          renderElement(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.CREATING:
        if (oldEventComponent && oldEventEditComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderElement(this._container, this._eventEditComponent, RenderPosition.BEFOREBEGIN);
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

  shake() {
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventEditComponent.getElement().style.border = ERROR_BORDER;

    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;

      this._eventEditComponent.setData({
        saveButtonText: DefaultData.SAVE_BTN,
        deleteButtonText: DefaultData.DELETE_BTN,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    this._eventEditComponent.reset();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === Keys.ESCAPE || evt.key === Keys.ESC;

    if (isEscKey) {
      if (this._mode === Mode.CREATING) {
        this._onDataChange(this, EmptyPoint, null);
        this._activeAddNewIventButton();
      }
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _activeAddNewIventButton() {
    newAddIventButton.disabled = false;
  }
}
