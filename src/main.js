import {renderElement, RenderPosition} from "./utils.js";
import TripInfo from "./components/trip-info.js";
import TripRoute from "./components/trip-route.js";
import TripCost from "./components/trip-cost.js";
import SiteMenu from "./components/site-menu.js";
import Filter from "./components/filter.js";
import Sorting from "./components/sorting.js";
import DaysList from "./components/days-list.js";
import Day from "./components/day.js";
import DayItem from "./components/day-item.js";
import EditItem from "./components/edit-item.js";
import NoTasksComponent from "./components/no-tasks.js";
import {cardsList, datesList} from "./mock/card.js";
import {menuNames} from "./mock/menu.js";
import {sortOptions} from "./mock/sort.js";
import {filters} from "./mock/filters.js";

const citiesList = [
  ...new Set(cardsList.map((elem) => elem.city))
];
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfoBlock = document.querySelector(`.trip-main`);

renderElement(tripControls, new SiteMenu(menuNames).getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripControls, new Filter(filters).getElement(), RenderPosition.BEFOREEND);

if (cardsList.length === 0) {
  renderElement(tripEvents, new NoTasksComponent().getElement(), RenderPosition.AFTERBEGIN);
} else {
  renderElement(tripEvents, new Sorting(sortOptions).getElement(), RenderPosition.BEFOREEND);
  renderElement(tripEvents, new DaysList().getElement(), RenderPosition.BEFOREEND);

  const tripDaysList = document.querySelector(`.trip-days`);

  datesList.forEach((date, dateIndex) => {
    const day = new Day(date, dateIndex + 1).getElement();

    cardsList
      .filter((card) => new Date(card.start).toDateString() === date)
      .forEach((card) => {
        const newEvent = new DayItem(card).getElement();
        const eventList = day.querySelector(`.trip-events__list`);

        renderElement(eventList, newEvent, RenderPosition.BEFOREEND);

        const editButton = newEvent.querySelector(`.event__rollup-btn`);
        const editEventItem = new EditItem(card).getElement();
        const closeForm = editEventItem.querySelector(`.event__reset-btn`);

        const replaceTaskToEdit = () => {
          eventList.replaceChild(editEventItem, newEvent);
        };

        const onEscKeyDown = (evt) => {
          const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

          if (isEscKey) {
            replaceEditToTask();
            document.removeEventListener(`keydown`, onEscKeyDown);
          }
        };

        const replaceEditToTask = () => {
          eventList.replaceChild(newEvent, editEventItem);
        };

        editButton.addEventListener(`click`, () => {
          replaceTaskToEdit();
          document.addEventListener(`keydown`, onEscKeyDown);
        });

        closeForm.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          replaceEditToTask();
          document.removeEventListener(`keydown`, onEscKeyDown);
        });
      });

    renderElement(tripDaysList, day, RenderPosition.BEFOREEND);
  });

  renderElement(tripInfoBlock, new TripInfo().getElement(), RenderPosition.AFTERBEGIN);

  const tripInfoRoute = tripInfoBlock.querySelector(`.trip-main__trip-info`);

  renderElement(tripInfoRoute, new TripRoute(citiesList, datesList).getElement(), RenderPosition.BEFOREEND);
  renderElement(tripInfoRoute, new TripCost(cardsList).getElement(), RenderPosition.BEFOREEND);
}

