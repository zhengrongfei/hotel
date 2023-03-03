import { useTranslation } from "react-i18next";
import { Element, scroller } from "react-scroll";
import BingMapsReact from "bingmaps-react";

import classes from "./MapSelection.module.css";
import { LAYERS } from "../../constants/css";
import Button, { BUTTON } from "../../components/interfaces/Button";
import {
  DownChevronIcon, EarthIcon,
  SortIcon,
  StarFilledIcon, StarIcon,
  UpChevronIcon
} from "../../components/icons";
import Submit, { SUBMIT } from "../../components/interfaces/Submit";
import classNames from "classnames";
import Menu from "../../components/interfaces/Menu";
import { Fragment, useState } from "react";
import Dropdown from "../../components/interfaces/Dropdown";
import Entry from "../../components/interfaces/Entry";
import Expander from "../../components/interfaces/Expander";
import ScrollBox from "../../components/interfaces/ScrollBox";
import { ID, NAME } from "../../constants/identifiers";
import { scrollToElement } from "../../components/functions";

const SORT_OPTIONS = [
  "nearest_first",      // 0
  "lowest_price_first", // 1
  "highest_price_first" // 2
]
const BING_KEY = "AlSQyUmJ97y-FQXqJlSkgcqMNEhJvFYKqaUeQnCViQ4ZnciTcmiHslkquvFgUjMg";
const InfoBox = ({}) => {
  return (
    <div style={{ height: 10, width: 10, background: "cyan" }}>
      Hi
    </div>
  );
}

function MapSelection({
                        name,
                        className,
                        countries,
                        regions,
                        cities,
                        hotels,
                        sortCode,
                        countryCode,
                        regionCode,
                        cityCode,
                        hotelId,
                        updateSort,
                        updateCountry,
                        updateRegion,
                        updateCity,
                        updateHotel,
                        updateFavourite,
                        submitHandler
                      }) {
  const { t } = useTranslation();

  //// states
  const [sortExpand, setSortExpand] = useState(false);
  const [geoExpand, setGeoExpand] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);

  //// maps
  const viewport = { north: -90, west: 90, south: 90, east: -90 }
  const rect = { center: {}, width: 0, height: 0 }
  const center = { longitude: 0, latitude: 0 }
  const boxes = hotels.map((hotel) => {
    center.longitude += hotel.longitude;
    center.latitude += hotel.latitude;
    viewport.north = Math.max(center.latitude, viewport.north);
    viewport.south = Math.min(center.latitude, viewport.south);
    viewport.east = Math.max(center.longitude, viewport.east);
    viewport.west = Math.min(center.longitude, viewport.west);
    return {
      center: {
        longitude: hotel.longitude,
        latitude: hotel.latitude
      },
      options: {
        title: hotel.name,
        description: hotel.location,
      }
    }
  })
  center.longitude /= hotels.length;
  center.latitude /= hotels.length;
  rect.width = (viewport.east - viewport.west) * 1.2;
  rect.height = (viewport.north - viewport.south) * 1.2;
  rect.center = center;

  //// handlers
  function cityHandler(code) {
    if (code !== cityCode) {
      setGeoExpand(false);
      updateCity(code);
    }
  }
  function hotelHandler(hotel) {
    scrollToElement(
      NAME.HOTELS + hotel.id.toString(),
      ID.HOTEL_LIST);
    updateHotel(hotel);
  }

  return (
    <Element className={classNames(classes.hotel_selection, className)}
             name={name}>
      <BingMapsReact bingMapsKey={BING_KEY}
                     viewOptions={{ center: center, bounds: rect }}
                     mapOptions={{
                       showMapTypeSelector: false,
                       navigationBarMode: "square"
                     }}
                     pushPinsWithInfoboxes={boxes}
        // pushPins={pins}
      />
      <form className={classes.hotel_list}>
        <fieldset className={classes.list_bar} style={{ zIndex: LAYERS.MENU_AND_BUTTON }}>
          <Menu activator={<Button type={BUTTON.TYPES.MENU}
                                   icon={<SortIcon />}
                                   active={sortExpand}
                                   onMouseUp={() => setSortExpand(!sortExpand)} />}
                expand={sortExpand}>
            {SORT_OPTIONS.map((option, index) => (
              <Button type={BUTTON.TYPES.OPTION}
                      content={BUTTON.CONTENT.TEXT}
                      iconDescription={t(option)}
                      active={index === sortCode}
                      key={option}
                      id={index}
                      onMouseUp={updateSort} />
            ))}
          </Menu>
          <Button type={BUTTON.TYPES.MENU}
                  icon={<EarthIcon />}
                  active={geoExpand}
                  onMouseUp={() => setGeoExpand(!geoExpand)} />
          <Button type={BUTTON.TYPES.SELECTION}
                  icon={<StarIcon />}
                  underlay={<StarFilledIcon />}
                  active={showFavourites}
                  onMouseUp={() => setShowFavourites(!showFavourites)} />
        </fieldset>
        <fieldset className={classes.list_body} style={{ zIndex: LAYERS.BASIC }}>
          <ScrollBox className={classes.list_body} layer={LAYERS.BASIC + 1}
                     id={ID.HOTEL_LIST}>
            {hotels.map((hotel, index) => (
              <Entry key={index}
                     entry={hotel}
                     name={NAME.HOTELS + hotel.id.toString()}
                     hide={showFavourites && !hotel.favorite}
                     onMouseUp={updateHotel}
                     updateFavourite={updateFavourite}
                     active={hotel.id === hotelId} />
            ))}
          </ScrollBox>
          <Dropdown expand={geoExpand}>
            {countries.map((country, index) => (
              <Fragment key={index}>
                <Button type={BUTTON.TYPES.MENU}
                        iconDescription={country.name}
                        icon={<DownChevronIcon />}
                        underlay={<UpChevronIcon />}
                        id={country.code}
                        active={country.code === countryCode}
                        onMouseUp={updateCountry} />
                <Expander render={country.code === countryCode}>
                  {regions.map((region, index) => (
                    <Fragment key={index}>
                      <Button type={BUTTON.TYPES.MENU}
                              iconDescription={region.name}
                              icon={<DownChevronIcon />}
                              underlay={<UpChevronIcon />}
                              indent={1}
                              id={region.code}
                              active={region.code === regionCode}
                              onMouseUp={updateRegion} />
                      <Expander render={region.code === regionCode}>
                        {cities.map((city, index) => (
                          <Button type={BUTTON.TYPES.OPTION}
                                  iconDescription={city.name}
                                  indent={2}
                                  id={city.code}
                                  key={index}
                                  active={city.code === cityCode}
                                  onMouseUp={cityHandler} />
                        ))}
                      </Expander>
                    </Fragment>
                  ))}
                </Expander>
              </Fragment>
            ))}
          </Dropdown>
        </fieldset>
        <fieldset className={classes.list_bar}
                  style={{ zIndex: LAYERS.MENU_AND_BUTTON }}>
          <Submit description={t("confirm_selection")}
                  state={hotelId
                    ? SUBMIT.STATES.IDLE
                    : SUBMIT.STATES.DISABLED}
                  onMouseUp={submitHandler} id={name} />
        </fieldset>
      </form>
    </Element>
  );
}

export default MapSelection;