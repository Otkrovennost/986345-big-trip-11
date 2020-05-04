import AbstractComponent from './abstract-component.js';

const createTasksListTemplate = () => {
  return (`<ul class="trip-days"></ul>`);
};

export default class DaysList extends AbstractComponent {

  getTemplate() {
    return createTasksListTemplate();
  }
}
