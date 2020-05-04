export default class Point {
  constructor(data) {
    this.price = data[`base_price`];
    this.start = new Date(data[`date_from`]);
    this.end = new Date(data[`date_to`]);
    this.description = data[`destination`][`description`];
    this.city = data[`destination`][`name`];
    this.photos = data[`destination`][`pictures`];
    this.id = data[`id`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`];
    this.type = data[`type`];
  }

  toRAW() {
    return {
      'base_price': this.price,
      'date_from': this.start.toISOString(),
      'date_to': this.end.toISOString(),
      'destination': {
        'pictures': this.photos,
        'description': this.description,
        'name': this.city,
      },
      'id': this.id,
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'type': this.type
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
