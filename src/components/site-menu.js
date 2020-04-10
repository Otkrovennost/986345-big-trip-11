export const createMenuTemplate = (names) => {
  return (`
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
    ${names.map((name) => {
      return (`
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${name}</a>
    `);
    }).join(``)}
    </nav>
  `);
};
