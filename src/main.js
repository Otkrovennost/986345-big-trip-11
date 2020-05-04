import {renderElement, RenderPosition} from './utils/render.js';
import {menuNames} from './mock/menu.js';
import SiteMenu from './components/site-menu.js';
import FilterController from './controllers/filter.js';
import TripController from './controllers/trip-controller.js';
// import TripInfo from './components/trip-info.js';
// import TripRoute from './components/trip-route.js';
// import TripCost from './components/trip-cost.js';
import PointsModel from './models/points.js';
import API from './api.js';

const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic ag78gfdsdgth78956ggh`;
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
// const tripInfoBlock = document.querySelector(`.trip-main`);
const siteMenu = new SiteMenu(menuNames);
const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const filterController = new FilterController(tripControls, pointsModel, api);
const tripController = new TripController(tripEvents, pointsModel, api);

renderElement(tripControls, siteMenu, RenderPosition.AFTERBEGIN);
filterController.render();

Promise.all([
  api.getPoints(),
  api.getDestinations(),
  api.getOffers()
]).then((res) => {
  pointsModel.setPoints(res[0]);
  tripController.render();
});

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  tripController.createPoint();
});

// renderElement(tripInfoBlock, new TripInfo(), RenderPosition.AFTERBEGIN);

// const tripInfoRoute = tripInfoBlock.querySelector(`.trip-main__trip-info`);

// renderElement(tripInfoRoute, new TripRoute(citiesList, datesList), RenderPosition.BEFOREEND);
// renderElement(tripInfoRoute, new TripCost(cardsList), RenderPosition.BEFOREEND);
