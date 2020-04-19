import {getDuration} from "../utils/common.js";
import {renderElement, RenderPosition, replace} from "../utils/render.js";
import Sorting, {SortType} from "../components/sorting.js";
import DaysList from "../components/days-list.js";
import Day from "../components/day.js";
import DayItem from "../components/day-item.js";
import EditItem from "../components/edit-item.js";
import NoTasksComponent from "../components/no-tasks.js";
import {sortOptions} from "../mock/sort.js";

const renderTripEvent = (array, container) => {
  array.forEach((elem) => {
    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replaceEditToTask();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const eventsList = container.querySelector(`.trip-events__list`);

    const replaceTaskToEdit = () => {
      replace(editEventItem, newEvent);
    };

    const replaceEditToTask = () => {
      replace(newEvent, editEventItem);
    };

    const newEvent = new DayItem(elem);
    newEvent.setClickHandler(() => {
      replaceTaskToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    const editEventItem = new EditItem(elem);
    editEventItem.setSubmitHandler(replaceEditToTask);
    editEventItem.setCloseHandler(replaceEditToTask);

    renderElement(eventsList, newEvent, RenderPosition.BEFOREEND);
  });
};

const renderTripEventsList = (array, isSorting) => {
  let filteredCards = null;
  const datesList = [
    ...new Set(array.map((elem) => new Date(elem.start).toDateString()))
  ];
  const tripDaysList = document.querySelector(`.trip-days`);

  if (!isSorting) {
    datesList.forEach((date, dateIndex) => {
      renderElement(tripDaysList, new Day(date, dateIndex + 1), RenderPosition.BEFOREEND);
      const dayCurrent = tripDaysList.querySelector(`.trip-days__item:last-of-type`);
      filteredCards = array.filter((elem) => new Date(elem.start).toDateString() === date);
      renderTripEvent(filteredCards, dayCurrent);
    });
  } else {
    renderElement(tripDaysList, new Day(), RenderPosition.BEFOREEND);
    const dayCurrent = tripDaysList.querySelector(`.trip-days__item:last-of-type`);
    filteredCards = array;
    renderTripEvent(filteredCards, dayCurrent);
  }
};

const getSortedTasks = (tasks, sortType) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.PRICE:
      sortedTasks = showingTasks.sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      sortedTasks = showingTasks.sort((a, b) => getDuration(b.end - b.start) - getDuration(a.end - a.start));
      break;
  }
  return sortedTasks;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new Sorting(sortOptions);
  }

  render(cards) {
    const container = this._container;

    if (cards.length === 0) {
      renderElement(container, this._noTasksComponent, RenderPosition.BEFOREEND);
    } else {
      renderElement(container, this._sortComponent, RenderPosition.AFTERBEGIN);
      renderElement(container, new DaysList(), RenderPosition.BEFOREEND);
      renderTripEventsList(cards, false);

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        container.innerHTML = ``;
        renderElement(container, this._sortComponent, RenderPosition.AFTERBEGIN);
        renderElement(container, new DaysList(), RenderPosition.BEFOREEND);

        if (sortType === SortType.DEFAULT) {
          renderTripEventsList(cards, false);
        } else {
          renderTripEventsList(getSortedTasks(cards, sortType), true);
        }
      });
    }
  }
}
