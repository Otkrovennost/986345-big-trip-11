import AbstractComponent from "./abstract-component.js";

const createFilterTemplate = (names) => {
  return (
    `<form class="trip-filters" action="#" method="get">
    ${names.map((name) => {
      return (`
        <div class="trip-filters__filter">
          <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" checked>
          <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
        </div>
      `);
    }).join(``)
    }
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
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
}
