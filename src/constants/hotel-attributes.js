export const AMENITIES = {
  HOTEL: {
    1: "business_services",
    2: "casino",
    4: "digital_key",
    8: "fitness_center"
  },
  ROOM: {
    1: "wifi",
    2: "accessible",
    4: "tv",
    8: "flight_info"
  }
}

export const RATES = [
  {
    name: "standard_rate",
    value: 0,
    index: 0
  },{
    name: "government",
    value: 1,
    index: 1
  },{
    name: "offer",
    value: 2,
    index: 2
  },{
    name: "aaa",
    value: 4,
    index: 3
  }
]
export const DEFAULT_RATE = RATES[0];
export const OFFER_RATE = RATES[2];

export const MAX_AGE = 18;
export const AGE_ZERO_PLACEHOLDER = "<1";
export const AGE_NONE_PLACEHOLDER = "--";
export const AGE_NONE = -1;

export const DEFAULT_ROOM_CNT = 1;
export const DEFAULT_ADULTS_PER_ROOM = 1;
export const DEFAULT_CHILDREN_PER_ROOM = 0;

export const RANDOM_ROOM = {
  category: -1,
  name: "---"
}

export const POINTS_RATIO = 1;