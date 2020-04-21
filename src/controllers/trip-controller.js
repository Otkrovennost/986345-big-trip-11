import {getDuration} from "../utils/common.js";
import {renderElement, RenderPosition, replace} from "../utils/render.js";
import Sorting, {SortType} from "../components/sorting.js";
import DaysList from "../components/days-list.js";
import Day from "../components/day.js";
import Event from "../components/event.js";
import EventEdit from "../components/event-edit.js";
import NoTasksComponent from "../components/no-tasks.js";
import {sortOptions} from "../mock/sort.js";

const renderCards = (cards, container, isDefaultSorting = true) => {
  const dates = isDefaultSorting
    ? [...new Set(cards.map((elem) => new Date(elem.start).toDateString()))]
    : [true];

  dates.forEach((date, dateIndex) => {
    const day = isDefaultSorting
      ? new Day(date, dateIndex + 1)
      : new Day();

    const dayElement = day.getElement();

    cards.filter((_card) => {
      return isDefaultSorting ? new Date(_card.start).toDateString() === date : _card;
    }).forEach((_card) => {
      const newEvent = new Event(_card);
      const editEvent = new EventEdit(_card);
      const onEscKeyDown = (evt) => {
        const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
        if (isEscKey) {
          replaceEditToTask();
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      };

      const eventsList = dayElement.querySelector(`.trip-events__list`);
      const replaceTaskToEdit = () => {
        replace(editEvent, newEvent);
      };

      const replaceEditToTask = () => {
        replace(newEvent, editEvent);
      };

      newEvent.setClickHandler(() => {
        replaceTaskToEdit();
        document.addEventListener(`keydown`, onEscKeyDown);
      });

      editEvent.setSubmitHandler(replaceEditToTask);
      editEvent.setCloseHandler(replaceEditToTask);

      renderElement(eventsList, newEvent, RenderPosition.BEFOREEND);
    });

    renderElement(container.getElement(), day, RenderPosition.BEFOREEND);
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new Sorting(sortOptions);
    this._daysContainer = new DaysList();
  }

  render(cards) {
    const container = this._container;

    if (cards.length === 0) {
      renderElement(container, this._noTasksComponent, RenderPosition.BEFOREEND);
    } else {
      renderElement(container, this._sortComponent, RenderPosition.AFTERBEGIN);
      renderElement(container, this._daysContainer, RenderPosition.BEFOREEND);
      renderCards(cards, this._daysContainer);

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        let sortedTasks = [];
        let isDefaultSorting = false;

        switch (sortType) {
          case SortType.EVENT:
            sortedTasks = cards.slice();
            isDefaultSorting = true;
            break;
          case SortType.PRICE:
            sortedTasks = cards.slice().sort((a, b) => b.price - a.price);
            break;
          case SortType.TIME:
            sortedTasks = cards.slice().sort((a, b) => getDuration(b.end - b.start) - getDuration(a.end - a.start));
            break;
        }

        this._daysContainer.getElement().innerHTML = ``;
        renderCards(sortedTasks, this._daysContainer, isDefaultSorting);
      });
    }
  }
}
