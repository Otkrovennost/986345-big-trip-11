export default class Store {
  constructor() {
    this._destinations = null;
    this._offers = null;
  }

  static setDestinations(destinations) {
    Store._destinations = destinations;
  }

  static getDestinations() {
    return Store._destinations;
  }

  static setOffers(offers) {
    Store._offers = offers;
  }

  static getOffers() {
    return Store._offers;
  }
}
