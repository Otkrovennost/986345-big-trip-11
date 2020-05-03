import AbstractComponent from './abstract-component.js';

const createNoTasksTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};


export default class NoTasks extends AbstractComponent {

  getTemplate() {
    return createNoTasksTemplate();
  }
}
