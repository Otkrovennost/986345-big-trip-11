import API from './api.js';
import FilterController from './controllers/filter-controller.js';
import InfoController from "./controllers/info-controller.js";
import PointsModel from './models/points.js';
import {renderElement, RenderPosition} from './utils/render.js';
import SiteMenu, {MenuItem} from './components/site-menu.js';
import StatisticsController from "./controllers/statistics-controller.js";
import TripController from './controllers/trip-controller.js';

const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic gffrzfgfcdcd2tvfddfreh`;
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfoBlock = document.querySelector(`.trip-main`);
const api = new API(END_POINT, AUTHORIZATION);
const siteMenu = new SiteMenu();
const pointsModel = new PointsModel();
const tripController = new TripController(tripEvents, pointsModel, api);
const filterController = new FilterController(tripControls, pointsModel);
const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);

renderElement(tripControls, siteMenu, RenderPosition.BEFOREEND);

filterController.render();

const infoController = new InfoController(tripInfoBlock, pointsModel);
infoController.render();

const statisticsController = new StatisticsController(tripEvents, pointsModel);
statisticsController.render();
statisticsController.hide();

tripController.isLoading();

api.getData().then((res) => {
  pointsModel.setPoints(res);
  tripController.isLoaded();
  tripController.render();
});

addNewEventButton.addEventListener(`click`, () => {
  addNewEventButton.disabled = true;
  tripController.rerender();
  filterController.rerender();
  tripController.createPoint();
});

siteMenu.setOnChange((item) => {
  switch (item) {
    case MenuItem.TABLE:
      siteMenu.setActiveItem(MenuItem.TABLE);
      tripController.show();
      filterController.show();
      statisticsController.hide();
      break;
    case MenuItem.STATS:
      siteMenu.setActiveItem(MenuItem.STATS);
      tripController.hide();
      filterController.hide();
      statisticsController.show();
      break;
  }
});
