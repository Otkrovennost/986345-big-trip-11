import {renderElement, RenderPosition, replace} from "../utils/render.js";
import Statistics from "../components/statistics.js";

export default class StatisticsController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._statisticsComponent = null;
  }

  hide() {
    this._statisticsComponent.hide();
  }

  show() {
    this._statisticsComponent.show();
  }

  render() {
    const container = this._container;

    const oldComponent = this._statisticsComponent;

    this._statisticsComponent = new Statistics(this._pointsModel);

    if (oldComponent) {
      replace(this._statisticsComponent, oldComponent);
    } else {
      renderElement(container, this._statisticsComponent, RenderPosition.AFTEREND);
    }
  }
}
