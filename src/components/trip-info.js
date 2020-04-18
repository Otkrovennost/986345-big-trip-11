import AbstractComponent from "./abstract-component.js";

const createTripInfoTemplate = () => {
  return (
    `<section class="trip-main__trip-info  trip-info">
    </section>`
  );
};

export default class TripInfo extends AbstractComponent {

  getTemplate() {
    return createTripInfoTemplate();
  }
}
