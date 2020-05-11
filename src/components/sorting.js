import AbstractComponent from './abstract-component.js';

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

const createSortTemplate = (options) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day"></span>
    ${options.map(({name, isChecked}) => {
      return (`
        <div class="trip-sort__item  trip-sort__item--${name}">
          <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${isChecked ? `checked` : ``}>
          <label class="trip-sort__btn" for="sort-${name}" data-sort-type="${name}">${name}</label>
        </div>
      `);
    }).join(``)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sorting extends AbstractComponent {
  constructor(options) {
    super();

    this._options = options;
    this._element = null;
    this._currentSortType = SortType.EVENT;
  }

  getTemplate() {
    return createSortTemplate(this._options);
  }

  getSortType() {
    return this._currentSortType;
  }

  // setSortType(sortType) {
  //   this._currentSortType = sortType;
  // }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {

      if (evt.target.tagName.toLowerCase() !== `label`) {
        return;
      }

      const sortType = evt.target.getAttribute(`data-sort-type`);

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
      this._checkedSortItem(evt.target.previousElementSibling);
    });
  }

  _checkedSortItem(sortItem) {
    const sortItems = this._element.querySelectorAll(`.trip-sort__input`);

    for (const sortElement of sortItems) {
      if (sortElement.hasAttribute(`checked`)) {
        sortElement.removeAttribute(`checked`);
        break;
      }
    }

    sortItem.setAttribute(`checked`, `checked`);
  }
}
