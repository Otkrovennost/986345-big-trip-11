import {createElement} from "../utils.js";

const createCardTemplate = (date, index) => {

  const currentDate = new Date(date);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${currentYear}-${currentMonth + 1}-${currentDay}">${date.slice(4, 7).toUpperCase()}&nbsp;${currentDay}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class Day {
  constructor(date, index) {
    this._date = date;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createCardTemplate(this._date, this._index);
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
