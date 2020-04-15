import {createElement} from "../utils.js";

const createTripCostTemplate = (cards) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cards.map((card) => card.price).reduce((sum, current) => sum + current, 0)}</span>
    </p>`
  );
};

export default class TripCost {
  constructor(cards) {
    this._cards = cards;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._cards);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
