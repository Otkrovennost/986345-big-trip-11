import AbstractComponent from './abstract-component.js';

const ACTIVE_CLASS = `trip-tabs__btn--active`;

export const MenuItem = {
  TABLE: `control-table`,
  STATS: `control-stats`
};

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <h2 class="visually-hidden">Switch trip view</h2>
      <a id="control-table" class="trip-tabs__btn" href="#">Table</a>
      <a id="control-stats" class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(selectedItem) {
    this.getElement().querySelectorAll(`.trip-tabs__btn`)
      .forEach((it) => {
        if (it.id === selectedItem) {
          it.classList.add(ACTIVE_CLASS);
        } else {
          it.classList.remove(ACTIVE_CLASS);
        }
      });
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      evt.preventDefault();

      const menuItem = evt.target.id;

      handler(menuItem);
    });
  }
}
