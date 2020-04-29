import AbstractComponent from "./abstract-component.js";

const FILTER_ID_DASH = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_DASH.length);
};

const createFilterMarkup = (filter, isChecked) => {
  const {name} = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.checked)).join(`\n`);

  return `<form class="trip-filters" action="#" method="get">
    ${filtersMarkup}
    </form>`;
};

export default class Filter extends AbstractComponent {
  constructor(names) {
    super();

    this._names = names;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._names);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
