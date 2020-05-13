import Filter from '../components/filter.js';
import {FilterType} from '../const.js';
import {renderElement, replace, RenderPosition} from '../utils/render.js';

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  getFilterType() {
    return this._activeFilterType;
  }

  setFilterType(type) {
    this._activeFilterType = type;
  }

  show() {
    this._filterComponent.show();
  }

  hide() {
    this._filterComponent.hide();
  }

  rerender() {
    this.setFilterType(FilterType.EVERYTHING);
    this._onFilterChange(this.getFilterType());
    this._filterComponent.checkDefaultFilterForInput();
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new Filter(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      renderElement(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
