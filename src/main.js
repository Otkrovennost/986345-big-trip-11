import {createElement, render, renderElement} from "./utils.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripRouteTemplate} from "./components/trip-route.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortTemplate} from "./components/sorting.js";
import {createTasksListTemplate} from "./components/task-list.js";
import {createTaskTemplate} from "./components/task.js";
import {createEditCardTemplate} from "./components/edit-card.js";
import {createCardItemTemplate} from "./components/card-item.js";
import {cardsList, datesList} from "./mock/card.js";
import {menuNames} from "./mock/menu.js";
import {sortOptions} from "./mock/sort.js";
import {filters} from "./mock/filters.js";

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripControls, createMenuTemplate(menuNames), `afterbegin`);
render(tripControls, createFilterTemplate(filters));
render(tripEvents, createSortTemplate(sortOptions));
render(tripEvents, createTasksListTemplate());

const tripDaysList = document.querySelector(`.trip-days`);

datesList.forEach((date, dateIndex) => {
  const day = createElement(createTaskTemplate(date, dateIndex + 1));

  cardsList
    .filter((card) => new Date(card.start).toDateString() === date)
    .forEach((card) => {
      render(day.querySelector(`.trip-events__list`), createCardItemTemplate(card));
    });

  renderElement(tripDaysList, day, `beforeend`);
});

const firstEvent = document.querySelector(`.trip-events__item`);

render(firstEvent, createEditCardTemplate(cardsList[0]), `afterend`);

const citiesList = [
  ...new Set(cardsList.map((elem) => elem.city))
];

const tripInfoBlock = document.querySelector(`.trip-main`);

render(tripInfoBlock, createTripInfoTemplate(), `afterbegin`);

const tripInfoRoute = tripInfoBlock.querySelector(`.trip-main__trip-info`);

render(tripInfoRoute, createTripRouteTemplate(citiesList, datesList), `afterbegin`);
render(tripInfoRoute, createTripCostTemplate(cardsList));
