import {FilterType} from './data.js';

export const getPastPoints = (points) => {
  return points.filter((point) => point.end < Date.now());
};

export const getFuturePoints = (points) => {
  return points.filter((point) => point.start > Date.now());
};

export const getPointsByFilter = (points, filterType) => {

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points.sort((a, b) => a.start - b.start);
    case FilterType.PAST:
      return getPastPoints(points);
    case FilterType.FUTURE:
      return getFuturePoints(points);
  }

  return points;
};
