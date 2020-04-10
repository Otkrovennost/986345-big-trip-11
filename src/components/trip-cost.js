export const createTripCostTemplate = (cards) => {
  return (`
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cards.map((card) => card.price).reduce((sum, current) => sum + current, 0)}</span>
    </p>
  `);
};
