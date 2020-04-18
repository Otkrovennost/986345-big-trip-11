import {renderElement, RenderPosition, replace} from "../utils/render.js";
import Sorting from "../components/sorting.js";
import DaysList from "../components/days-list.js";
import Day from "../components/day.js";
import DayItem from "../components/day-item.js";
import EditItem from "../components/edit-item.js";
import NoTasksComponent from "../components/no-tasks.js";
import {sortOptions} from "../mock/sort.js";

const renderTripEvents = (cards) => {
  const datesList = [
    ...new Set(cards.map((elem) => new Date(elem.start).toDateString()))
  ];

  const tripDaysList = document.querySelector(`.trip-days`);

  datesList.forEach((date, dateIndex) => {

    renderElement(tripDaysList, new Day(date, dateIndex + 1), RenderPosition.BEFOREEND);
    const dayCurrent = tripDaysList.querySelector(`.trip-days__item:last-of-type`);

    cards
      .filter((card) => new Date(card.start).toDateString() === date)
      .forEach((card) => {
        const onEscKeyDown = (evt) => {
          const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

          if (isEscKey) {
            replaceEditToTask();
            document.removeEventListener(`keydown`, onEscKeyDown);
          }
        };

        const eventsList = dayCurrent.querySelector(`.trip-events__list`);

        const replaceTaskToEdit = () => {
          replace(editEventItem, newEvent);
        };

        const replaceEditToTask = () => {
          replace(newEvent, editEventItem);
        };

        const newEvent = new DayItem(card);
        newEvent.setClickHandler(() => {
          replaceTaskToEdit();
          document.addEventListener(`keydown`, onEscKeyDown);
        });

        const editEventItem = new EditItem(card);
        editEventItem.setSubmitHandler(replaceEditToTask);
        editEventItem.setCloseHandler(replaceEditToTask);

        renderElement(eventsList, newEvent, RenderPosition.BEFOREEND);
      });
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._daysList = new DaysList();
    this._sortComponent = new Sorting(sortOptions);
  }

  render(cards) {
    const container = this._container;

    if (cards.length === 0) {
      renderElement(container, this._noTasksComponent, RenderPosition.BEFOREEND);
    } else {
      renderElement(container, this._sortComponent, RenderPosition.AFTERBEGIN);
      renderElement(container, this._daysList, RenderPosition.BEFOREEND);
      renderTripEvents(cards);
    }
  }
}
