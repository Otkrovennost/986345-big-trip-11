import {renderElement, RenderPosition} from '../utils/render.js';
import Sorting, {SortType} from '../components/sorting.js';
import DaysList from '../components/days-list.js';
import Day from '../components/day.js';
import NoTasksComponent from '../components/no-tasks.js';
import {sortOptions} from '../mock/sort.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from './point-controller.js';

const renderPoints = (points, container, onDataChange, onViewChange, isDefaultSorting = true) => {
  const pointControllers = [];

  const dates = isDefaultSorting
    ? [...new Set(points.map((elem) => new Date(elem.start).toDateString()))]
    : [true];

  dates.forEach((date, dateIndex) => {
    const day = isDefaultSorting
      ? new Day(date, dateIndex + 1)
      : new Day();

    const dayElement = day.getElement();

    points.filter((_point) => {
      return isDefaultSorting ? new Date(_point.start).toDateString() === date : _point;
    }).map((_point) => {
      const pointController = new PointController(dayElement, onDataChange, onViewChange);
      pointController.render(_point, PointControllerMode.DEFAULT);
      pointControllers.push(pointController);

      return pointController;
    });

    renderElement(container.getElement(), day, RenderPosition.BEFOREEND);
  });

  return pointControllers;
};

export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._pointsControllers = [];
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new Sorting(sortOptions);
    this._daysContainer = new DaysList();
    this._creatingPoint = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const points = this._pointsModel.getPoints();

    const container = this._container;

    if (points.length === 0) {
      renderElement(container, this._noTasksComponent, RenderPosition.BEFOREEND);
    } else {
      renderElement(container, this._sortComponent, RenderPosition.AFTERBEGIN);
      renderElement(container, this._daysContainer, RenderPosition.BEFOREEND);

      this._pointsControllers = renderPoints(points, this._daysContainer, this._onDataChange, this._onViewChange);
      this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    }
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    this._creatingPoint = new PointController(this._container, this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.CREATING);
    this._onViewChange();
  }

  _removePoints() {
    this._daysContainer.getElement().innerHTML = ``;
    this._pointsControllers.forEach((pointController) => pointController.destroy());
    this._pointsControllers = [];
  }

  _updatePoints() {
    this._removePoints();
    this._pointsControllers = renderPoints(this._pointsModel.getPoints(), this._daysContainer, this._onDataChange, this._onViewChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _onDataChange(pointController, oldData, newData) {

    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        this._api.deletePoint(oldData.id)
        .then(() => {
          pointController.destroy();
          this._updatePoints();
        });
      } else {
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            // pointsController.render(pointModel, PointControllerMode.DEFAULT);
            this._pointsControllers = [].concat(pointController, this._pointsControllers);
            this._updatePoints();
          });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        });
    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);

          if (isSuccess) {
            // pointsController.render(pointModel, PointControllerMode.DEFAULT);
            this._updatePoints();
          }
        });
    }
  }

  _onSortTypeChange(sortType) {
    let sortedPoints = [];
    let isDefaultSorting = false;
    const points = this._pointsModel.getPoints();

    switch (sortType) {
      case SortType.EVENT:
        sortedPoints = points.slice();
        isDefaultSorting = true;
        break;
      case SortType.PRICE:
        sortedPoints = points.slice().sort((a, b) => b.price - a.price);
        break;
      case SortType.TIME:
        sortedPoints = points.slice().sort((a, b) => (b.end - b.start) - (a.end - a.start));
        break;
    }

    this._removePoints();
    this._pointsControllers = renderPoints(sortedPoints, this._daysContainer, this._onDataChange, this._onViewChange, isDefaultSorting);
  }

  _onViewChange() {
    this._pointsControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
