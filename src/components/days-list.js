import {createElement} from "../utils.js";

const createTasksListTemplate = () => {
  return (`<ul class="trip-days"></ul>`);
};

export default class TasksList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTasksListTemplate();
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
