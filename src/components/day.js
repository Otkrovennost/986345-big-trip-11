import AbstractComponent from "./abstract-component.js";

const createCardTemplate = (date, index) => {

  let dayInfo = ``;

  if (date && index) {
    const currentDate = new Date(date);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    dayInfo = `<span class="day__counter">${index}</span>
    <time class="day__date" datetime="${currentYear}-${currentMonth + 1}-${currentDay}">${date.slice(4, 7).toUpperCase()}&nbsp;${currentDay}</time>`;
  }

  return (
    `<li class="trip-days__item  day">
       <div class="day__info">${dayInfo}</div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(date, index) {
    super();

    this._date = date;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createCardTemplate(this._date, this._index);
  }
}
