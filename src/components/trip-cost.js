import AbstractComponent from './abstract-component.js';

const createTripCostTemplate = (cards) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cards.map((card) => card.price).reduce((sum, current) => sum + current, 0)}</span>
    </p>`
  );
};

export default class TripCost extends AbstractComponent {
  constructor(cards) {
    super();

    this._cards = cards;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._cards);
  }
}
