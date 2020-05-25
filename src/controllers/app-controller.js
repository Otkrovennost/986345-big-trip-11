import API from '../api.js';
import FilterController from './filter-controller.js';
import InfoController from "./info-controller.js";
import PointsModel from '../models/points.js';
import {renderElement, RenderPosition} from '../utils/render.js';
import SiteMenu, {MenuItem} from '../components/site-menu.js';
import StatisticsController from './statistics-controller.js';
import TripController from './trip-controller.js';

const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic SSfcyfgffrtdfrfxdrreh`;
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfoBlock = document.querySelector(`.trip-main`);
const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);

export default class AppController {
  constructor() {
    this._api = new API(END_POINT, AUTHORIZATION);
    this._siteMenu = new SiteMenu();
    this._pointsModel = new PointsModel();
    this._tripController = new TripController(tripEvents, this._pointsModel, this._api);
    this._filterController = new FilterController(tripControls, this._pointsModel);
    this._infoController = new InfoController(tripInfoBlock, this._pointsModel);
    this._statisticsController = new StatisticsController(tripEvents, this._pointsModel);

    this._infoController.render();
    this._statisticsController.render();
    this._statisticsController.hide();
    this._tripController.isLoading();

    this._setSiteNavigation();
    this._setCreateEvent();
    renderElement(tripControls, this._siteMenu, RenderPosition.BEFOREEND);
  }

  render() {
    this._api.getData()
    .then((points) => {
      this._pointsModel.setPoints(points);
      this._tripController.isLoaded();
      this._filterController.render();
      this._tripController.render();
    });
  }

  _setCreateEvent() {
    addNewEventButton.addEventListener(`click`, () => {
      this._filterController.rerender();
      this._tripController.rerender();
      this._tripController.createPoint();
      addNewEventButton.disabled = true;
    });
  }

  _setSiteNavigation() {
    this._siteMenu.setOnChange((item) => {
      switch (item) {
        case MenuItem.TABLE:
          this._siteMenu.setActiveItem(MenuItem.TABLE);
          this._tripController.show();
          this._statisticsController.hide();
          break;
        case MenuItem.STATS:
          this._siteMenu.setActiveItem(MenuItem.STATS);
          this._tripController.hide();
          this._statisticsController.show();
          break;
      }
    });
  }
}
