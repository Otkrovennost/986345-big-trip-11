export const routeTypes = [
  [
    `Taxi to`,
    `Bus to`,
    `Train to`,
    `Ship to`,
    `Transport to`,
    `Drive to`,
    `Flight to`
  ],
  [
    `Check-in in`,
    `Sightseeing in`,
    `Restaurant in`
  ]
];

export const actionByTypeToPlaceholder = {
  'Taxi': `to`,
  'Bus': `to`,
  'Train': `to`,
  'Ship': `to`,
  'Transport': `to`,
  'Drive': `to`,
  'Flight': `to`,
  'Check-in': `in`,
  'Sightseeing': `in`,
  'Restaurant': `in`
};

export const sortOptions = [
  {
    name: `event`,
    isChecked: true
  },
  {
    name: `time`,
    isChecked: false
  },
  {
    name: `price`,
    isChecked: false
  }
];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const DuringData = {
  DELETE_BTN: `Deleting...`,
  SAVE_BTN: `Saving...`,
};
