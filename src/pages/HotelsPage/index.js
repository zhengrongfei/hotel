import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Element, scroller } from "react-scroll";

import NavBar from "../../components/layouts/NavBar";
import SearchBar, { SEARCHBAR } from "../../components/layouts/SearchBar";
import classes from "./index.module.css";
import { debounce, delay, scrollToElement } from "../../components/functions";
import { LISTENER } from "../../constants/css";
import { DELAY } from "../../constants/delays";
import RoomSelection from "./RoomSelection";
import MapSelection from "./MapSelection";
import PaymentSelection from "./PaymentSelection";
import SearchContext from "../../contexts/search-context";
import { RANDOM_ROOM } from "../../constants/hotel-attributes";
import { ID, NAME } from "../../constants/identifiers";
import { use } from "i18next";
import { SUBMIT } from "../../components/interfaces/Submit";

let countriesDefault = [
  { name: "China", code: "CN" },
  { name: "United States", code: "US" }
]
let regionsDefault = [
  { name: "Guang Dong", code: "GD" },
  { name: "Fu Jian", code: "FJ" }
] // CN
let citiesDefault = [
  { name: "Shen Zhen", code: "SZ" },
  { name: "Guang Zhou", code: "GZ" }
] // GD
let hotelsDefault = [{
  name: "UrCove Shenzhen Futian CBD",
  id: 1234,
  prices: [599, 569, 549, 399],
  rates: 7,
  accessible: true,
  points: false,
  amenities: 15,
  gallerySize: 0,
  longitude: 21.011490,
  latitude: 24.956030,
  link: null,
  favorite: false,
  description: "Located in the CBD of Shenzhen Futian District, surrounded by financial headquarters, close to Futian High-speed Railway Station and Metro Line 2/ 3/11.",
  location: "East Building of Media Finance Center, junction of Pengcheng 1st Road and Fuzhong 3rd Road, Futian District\nShenzhen, 518000\nChina",
  prefix: "CN¥",
  currency: "CNY"
}, {
  name: "Park Hyatt Shenzhen",
  id: 1235,
  prices: [1799, 1649, 1799, 1799],
  rates: 1,
  accessible: true,
  points: false,
  amenities: 15,
  gallerySize: 0,
  longitude: 23.013450,
  latitude: 25.225050,
  link: null,
  favorite: true,
  description: "A sophisticated 5- star hotel in the heart of the Futian business district",
  location: "East Building of Media Finance Center, junction of Pengcheng 1st Road and Fuzhong 3rd Road, Futian District\nShenzhen, 518000\nChina",
  prefix: "CN¥",
  currency: "CNY"
}] // SZ
let towersDefault = [{
  id: 1,
  name: "2D",
  lowestFloor: 6,
  highestFloor: 12
}, {
  id: 2,
  name: "1A",
  lowestFloor: 10,
  highestFloor: 30
}]
let roomsDefault = [{
  id: 1,
  name: "1309",
  category: 3,
  coordinates: [[30, 0], [0, 30], [0, 0], [0, 0]]
}, {
  id: 2,
  name: "1310",
  category: 2,
  coordinates: [[30, 0], [60, 0], [0, 60], [0, 30]]
}, {
  id: 3,
  name: "1311",
  category: 1,
  coordinates: [[60, 0], [90, 0], [0, 90], [0, 60]]
}]
let categoriesDefault = [{
  id: 1,
  name: "single_bed",
  maxCapacity: 2,
  maxChildren: 1,
  description: "Our well-lit and spacious 36sqm room with two single beds and atrium garden view soothes you after a day’s weariness. Provide soft bathrobes.",
  prices: [1499, 1469, 1449, 1399],
  rates: 7,
  gallerySize: 0,
  amenities: 15,
  prefix: "CN¥",
  currency: "CNY"
}, {
  id: 2,
  name: "deluxe_twin",
  maxCapacity: 4,
  maxChildren: 2,
  description: "Our well-lit and spacious 36sqm room with two single beds and atrium garden view soothes you after a day’s weariness. Provide soft bathrobes.",
  prices: [3299, 3269, 3299, 3299],
  rates: 1,
  gallerySize: 0,
  amenities: 15,
  prefix: "CN¥",
  currency: "CNY"
}, {
  id: 3,
  name: "executive",
  maxCapacity: 6,
  maxChildren: 6,
  description: "Our well-lit and spacious 36sqm room with two single beds and atrium garden view soothes you after a day’s weariness. Provide soft bathrobes.",
  prices: [5439, 5439, 5439, 5439],
  rates: 0,
  gallerySize: 0,
  amenities: 15,
  prefix: "CN¥",
  currency: "CNY"
}]

function HotelsPage() {
  //// context
  const { query } = useContext(SearchContext);

  //// references
  const searchBarRef = useRef(null);

  //// states
  const [hideNav, setHideNav] = useState(false);
  const [searchType, setSearchType] = useState(SEARCHBAR.TYPES.UPDATE);
  const [submitState, setSubmitState] = useState(SUBMIT.STATES.IDLE);
  // subpages
  const [renderRoom, setRenderRoom] = useState(false);
  const [renderPayment, setRenderPayment] = useState(false);
  // data
  const [countries, setCountries] = useState(countriesDefault); // TODO: []
  const [regions, setRegions] = useState(regionsDefault);
  const [cities, setCities] = useState(citiesDefault);
  const [hotels, setHotels] = useState(hotelsDefault);
  const [towers, setTowers] = useState(towersDefault);
  const [rooms, setRooms] = useState(roomsDefault);
  const [categories, setCategories] = useState(categoriesDefault);
  // map
  const [sortCode, setSortCode] = useState(0);
  const [countryCode, setCountryCode] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [userHotel, setUserHotel] = useState(null);
  const [userLocation, setUserLocation] = useState({ longitude: 0, latitude: 0 });
  // room
  const [randomRoom, setRandomRoom] = useState(true);
  const [userTower, setUserTower] = useState(towers[0]); // TODO: null
  const [userFloor, setUserFloor] = useState(towers[0].lowestFloor); // TODO: null
  const [userRoom, setUserRoom] = useState(RANDOM_ROOM);
  const [categoryCode, setCategoryCode] = useState(null);
  // payment
  const [userPoints, setUserPoints] = useState(0);

  //// helper functions
  function scrollToHandler(idx) {
    return delay(150).then(() => scrollToElement(
      NAME.SUBPAGES[idx], ID.SUBPAGE_VIEWPORT,
      true, 750
    ))
  }

  //// handlers
  function countryHandler(code) {
    if (code === countryCode) setCountryCode("");
    else setCountryCode(code);
  }
  function regionHandler(code) {
    if (code === regionCode) setRegionCode("");
    else setRegionCode(code);
  }
  function cityHandler(code) {
    setCityCode(code);
  }
  function hotelHandler(hotel) {
    if (!userHotel || hotel.id !== userHotel.id) {
      console.log(hotel);
      setUserHotel(hotel);
    } else setUserHotel(null);
  }
  function favouriteHandler(hotel) {
    hotel.favorite = !hotel.favorite;
    setHotels(prevState => [
      ...prevState
    ])
  }
  function sortHandler(code) {
    setSortCode(code);
  }
  function towerHandler(tower) {
    setUserTower(tower);
    if (tower.id !== userTower.id) setUserFloor(tower.lowestFloor);
  }
  function floorHandler(floor) {
    setUserFloor(floor);
  }
  function roomHandler(room) {
    setUserRoom(room);
    setRandomRoom(false);
    setCategoryCode(room.category);
  }
  function categoryHandler(category) {
    setUserRoom(RANDOM_ROOM);
    setRandomRoom(true);
    setCategoryCode(category.id);
  }
  function randomRoomHandler() {
    if (!randomRoom) setUserRoom(RANDOM_ROOM);
    setRandomRoom(!randomRoom);
  }
  function submitHandler(name) {
    switch (name) {
      case NAME.SUBPAGES[0]:
        if (renderRoom) scrollToElement(
          NAME.SUBPAGES[1], ID.SUBPAGE_VIEWPORT,
          true, 750
        );
        else setRenderRoom(true);
        break;
      case NAME.SUBPAGES[1]:
        if (renderPayment) scrollToElement(
          NAME.SUBPAGES[2], ID.SUBPAGE_VIEWPORT,
          true, 750);
        else setRenderPayment(true);
        break;
      default:
        setSubmitState(SUBMIT.STATES.SUCCESS);
    }
  }
  const scrollHandler = debounce((e) => {
    setHideNav(0 !== e.target.scrollTop);
    if (renderPayment) setSearchType(SEARCHBAR.TYPES.PAYMENT);
  }, DELAY.UPDATE_DELAY)
  const scrollToRooms = useCallback(() =>
    scrollToHandler(1), []);
  const scrollToPayment = useCallback(() =>
    scrollToHandler(2), []);

  //// effects
  useEffect(() => {
    console.log(query)
    // get user initial state
    navigator.geolocation.getCurrentPosition(location =>
      setUserLocation({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude
      })
    );
  }, [])
  useEffect(() => {
    // attach viewport scroll listener
    const subpageViewport = document.getElementById(ID.SUBPAGE_VIEWPORT);
    subpageViewport.addEventListener(LISTENER.SCROLL, scrollHandler);
    return () => {
      // cleanup
      subpageViewport.removeEventListener(LISTENER.SCROLL, scrollHandler);
    }
  }, [renderPayment])

  return (
    <div className={classes.container}>
      <NavBar hide={hideNav} />
      <SearchBar ref={searchBarRef}
                 type={searchType} />
      <Element className={classes.viewport}
               id={ID.SUBPAGE_VIEWPORT}>
        <MapSelection className={classes.subpage}
          // states
                      sortCode={sortCode}
                      countryCode={countryCode}
                      regionCode={regionCode}
                      cityCode={cityCode}
                      hotelId={userHotel?.id}
          // handlers
                      updateCountry={countryHandler}
                      updateRegion={regionHandler}
                      updateCity={cityHandler}
                      updateHotel={hotelHandler}
                      updateFavourite={favouriteHandler}
                      updateSort={sortHandler}
                      submitHandler={submitHandler}
          // data
                      countries={countries}
                      regions={regions}
                      cities={cities}
                      hotels={hotels}
                      name={NAME.SUBPAGES[0]} />
        {renderRoom &&
          <RoomSelection className={classes.subpage}
                         ref={scrollToRooms}
            // states
                         randomRoom={randomRoom}
                         userTower={userTower}
                         userFloor={userFloor}
                         userRoom={userRoom}
                         categoryCode={categoryCode}
            // handlers
                         updateRandomRoom={randomRoomHandler}
                         updateTower={towerHandler}
                         updateFloor={floorHandler}
                         updateRoom={roomHandler}
                         updateCategory={categoryHandler}
                         submitHandler={submitHandler}
            // data
                         towers={towers}
                         floors={{
                           min: userTower.lowestFloor,
                           max: userTower.highestFloor
                         }}
                         rooms={rooms}
                         categories={categories}
                         name={NAME.SUBPAGES[1]} />}
        {renderPayment &&
          <PaymentSelection className={classes.subpage}
                            ref={scrollToPayment}
            // states
                            submitState={submitState}
                            userPoints={userPoints}
                            userHotel={userHotel}
                            userCategory={categories.find(category => category.id === categoryCode)}
            // handlers
                            setSubmitState={setSubmitState}
                            submitHandler={submitHandler}
                            name={NAME.SUBPAGES[2]} />}
      </Element>
    </div>
  );
}

export default HotelsPage;