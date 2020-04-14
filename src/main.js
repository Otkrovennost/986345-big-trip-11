import {renderElement, RenderPosition} from "./utils.js";
import TripInfo from "./components/trip-info.js";
import TripRoute from "./components/trip-route.js";
import TripCost from "./components/trip-cost.js";
import SiteMenu from "./components/site-menu.js";
import Filter from "./components/filter.js";
import Sorting from "./components/sorting.js";
import TasksList from "./components/days-list.js";
import DayCard from "./components/day.js";
import DayEvent from "./components/day-item.js";
import EditEvent from "./components/edit-item.js";
import {cardsList, datesList} from "./mock/card.js";
import {menuNames} from "./mock/menu.js";
import {sortOptions} from "./mock/sort.js";
import {filters} from "./mock/filters.js";

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);

renderElement(tripControls, new SiteMenu(menuNames).getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripControls, new Filter(filters).getElement(), RenderPosition.BEFOREEND);
renderElement(tripEvents, new Sorting(sortOptions).getElement(), RenderPosition.BEFOREEND);
renderElement(tripEvents, new TasksList().getElement(), RenderPosition.BEFOREEND);

const tripDaysList = document.querySelector(`.trip-days`);

datesList.forEach((date, dateIndex) => {
  const day = new DayCard(date, dateIndex + 1).getElement();

  cardsList
    .filter((card) => new Date(card.start).toDateString() === date)
    .forEach((card) => {
      const newEvent = new DayEvent(card).getElement();
      const eventList = day.querySelector(`.trip-events__list`);

      renderElement(eventList, newEvent, RenderPosition.BEFOREEND);

      const editButton = newEvent.querySelector(`.event__rollup-btn`);
      const editEventItem = new EditEvent(card).getElement();
      const closeButton = editEventItem.querySelector(`.event__reset-btn`);

      const onEditButtonClick = () => {
        eventList.replaceChild(editEventItem, newEvent);
      };

      const onCloseEditButtonClick = () => {
        eventList.replaceChild(newEvent, editEventItem);
      };

      editButton.addEventListener(`click`, onEditButtonClick);
      closeButton.addEventListener(`click`, onCloseEditButtonClick);
    });

  renderElement(tripDaysList, day, RenderPosition.BEFOREEND);
});

const citiesList = [
  ...new Set(cardsList.map((elem) => elem.city))
];

const tripInfoBlock = document.querySelector(`.trip-main`);

renderElement(tripInfoBlock, new TripInfo().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoRoute = tripInfoBlock.querySelector(`.trip-main__trip-info`);

renderElement(tripInfoBlock, new TripRoute(citiesList, datesList).getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripInfoRoute, new TripCost(cardsList).getElement(), RenderPosition.BEFOREEND);
