import { createContext, useState } from "react";
import {
  AGE_NONE,
  DEFAULT_ADULTS_PER_ROOM,
  DEFAULT_CHILDREN_PER_ROOM,
  DEFAULT_RATE,
  DEFAULT_ROOM_CNT
} from "../constants/hotel-attributes";
import { add, set } from "date-fns";

const SearchContext = createContext({
  query: {
    text: "",
    date: { start: null, end: null, span: 0 },
    rate: DEFAULT_RATE,
    age: AGE_NONE,
    rooms: DEFAULT_ROOM_CNT,
    adults: DEFAULT_ADULTS_PER_ROOM,
    children: DEFAULT_CHILDREN_PER_ROOM,
    offerCode: "",
    usePoints: false,
    accessible: false
  },
  setQuery: () => {
  },
});

export function SearchContextProvider({ children }) {
  const date = set(new Date(), { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 });
  const [userQuery, setUserQuery] = useState({
    text: "",
    date: {
      start: date,
      end: add(date, { days: 1 }),
      span: 1
    },
    rate: DEFAULT_RATE,
    age: AGE_NONE,
    rooms: DEFAULT_ROOM_CNT,
    adults: DEFAULT_ADULTS_PER_ROOM,
    children: DEFAULT_CHILDREN_PER_ROOM,
    offerCode: "",
    usePoints: false,
    accessible: false
  })

  const context = {
    query: userQuery,
    setQuery: setUserQuery
  };

  return (
    <SearchContext.Provider value={context}>
      {children}
    </SearchContext.Provider>
  );
}

export default SearchContext;