import {getDuration} from "../utils/common.js";
import {renderElement, RenderPosition} from "../utils/render.js";
import Sorting, {SortType} from "../components/sorting.js";
import DaysList from "../components/days-list.js";
import Day from "../components/day.js";
import NoTasksComponent from "../components/no-tasks.js";
import {sortOptions} from "../mock/sort.js";
import PointController from "./point-controller.js";

const renderCards = (cards, container, onDataChange, onViewChange, isDefaultSorting = true) => {
  const pointControllers = [];

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
    }).map((_card) => {
      const pointController = new PointController(dayElement, onDataChange, onViewChange);
      pointController.render(_card);
      pointControllers.push(pointController);

      return pointController;
    });

    renderElement(container.getElement(), day, RenderPosition.BEFOREEND);
  });

  return pointControllers;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._cards = [];
    this._pointsControllers = [];
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new Sorting(sortOptions);
    this._daysContainer = new DaysList();
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(cards) {
    this._cards = cards;

    const container = this._container;

    if (this._cards.length === 0) {
      renderElement(container, this._noTasksComponent, RenderPosition.BEFOREEND);
    } else {
      renderElement(container, this._sortComponent, RenderPosition.AFTERBEGIN);
      renderElement(container, this._daysContainer, RenderPosition.BEFOREEND);
      this._pointsControllers = renderCards(this._cards, this._daysContainer, this._onDataChange, this._onViewChange);

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        let sortedTasks = [];
        let isDefaultSorting = false;

        switch (sortType) {
          case SortType.EVENT:
            sortedTasks = this._cards.slice();
            isDefaultSorting = true;
            break;
          case SortType.PRICE:
            sortedTasks = this._cards.slice().sort((a, b) => b.price - a.price);
            break;
          case SortType.TIME:
            sortedTasks = this._cards.slice().sort((a, b) => getDuration(b.end - b.start) - getDuration(a.end - a.start));
            break;
        }

        this._daysContainer.getElement().innerHTML = ``;
        this._pointsControllers = renderCards(sortedTasks, this._daysContainer, this._onDataChange, this._onViewChange, isDefaultSorting);
      });
    }
  }

  _onDataChange(cardComponent, oldCardData, newCardData) {
    const index = this._cards.findIndex((it) => it === oldCardData);

    if (index === -1) {
      return;
    }
    this._cards = [].concat(this._cards.slice(0, index), newCardData, this._cards.slice(index + 1));

    cardComponent.render(this._cards[index]);
  }

  _onViewChange() {
    this._pointsControllers.forEach((it) => it.setDefaultView());
  }
}
