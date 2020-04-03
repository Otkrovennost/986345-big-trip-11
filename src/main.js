import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripRouteTemplate} from "./components/trip-route.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortTemplate} from "./components/sorting.js";
import {createTasksListTemplate} from "./components/task-list.js";
import {createTaskTemplate} from "./components/task.js";
import {createEditCardTemplate} from "./components/create-or-edit-card.js";
import {createCardItemTemplate} from "./components/card-item.js";

const TASK_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripInfoBlock = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripInfoBlock, createTripInfoTemplate(), `afterbegin`);

const tripInfoRoute = tripInfoBlock.querySelector(`.trip-main__trip-info`);

render(tripInfoRoute, createTripRouteTemplate(), `afterbegin`);
render(tripInfoRoute, createTripCostTemplate());
render(tripControls, createMenuTemplate(), `afterbegin`);
render(tripControls, createFilterTemplate());
render(tripEvents, createSortTemplate());
render(tripEvents, createTasksListTemplate());

const tripDaysList = document.querySelector(`.trip-days`);

render(tripDaysList, createTaskTemplate());

const eventsList = document.querySelector(`.trip-events__list`);

for (let i = 0; i < TASK_COUNT; i++) {
  render(eventsList, createCardItemTemplate());
}

const firstEvent = eventsList.querySelector(`li`);

render(firstEvent, createEditCardTemplate(), `beforebegin`);
