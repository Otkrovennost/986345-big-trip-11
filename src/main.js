import {renderElement, RenderPosition} from "./utils/render.js";
import {datesList, cardsList} from "./mock/card.js";
import {menuNames} from "./mock/menu.js";
import SiteMenu from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import TripController from "./controllers/trip-controller.js";
import TripInfo from "./components/trip-info.js";
import TripRoute from "./components/trip-route.js";
import TripCost from "./components/trip-cost.js";
import PointsModel from "./models/points.js";

const citiesList = [
  ...new Set(cardsList.map((elem) => elem.city))
];
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfoBlock = document.querySelector(`.trip-main`);

renderElement(tripControls, new SiteMenu(menuNames), RenderPosition.AFTERBEGIN);

const pointsModel = new PointsModel();
pointsModel.setPoints(cardsList);

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

const tripController = new TripController(tripEvents, pointsModel);
tripController.render(cardsList);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  tripController.createPoint();
});

renderElement(tripInfoBlock, new TripInfo(), RenderPosition.AFTERBEGIN);

const tripInfoRoute = tripInfoBlock.querySelector(`.trip-main__trip-info`);

renderElement(tripInfoRoute, new TripRoute(citiesList, datesList), RenderPosition.BEFOREEND);
renderElement(tripInfoRoute, new TripCost(cardsList), RenderPosition.BEFOREEND);

// const inputPrice = document.querySelector(`.event__input--price`);
