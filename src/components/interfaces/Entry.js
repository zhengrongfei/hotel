import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Element } from "react-scroll";
import classNames from "classnames";

import classes from "./Entry.module.css";
import {
  GalleryIcon,
  LinkIcon,
  ListIcon,
  LocationIcon,
  RadioIcon,
  RadioInsetIcon,
  StarFilledIcon,
  StarIcon
} from "../icons";

import image from "../../pages/HotelsPage/hotel.png"
import Button, { BUTTON } from "./Button";
import Expander from "./Expander";
import Amenity from "./Amenity";
import { AMENITIES } from "../../constants/hotel-attributes";
import { LAYERS } from "../../constants/css";
import searchContext from "../../contexts/search-context";

export const ENTRY = {
  HOTEL: {
    amenities: AMENITIES.HOTEL,
  },
  ROOM: {
    amenities: AMENITIES.ROOM,
  }
}

const defaultHotel = {
  name: "UrCove Shenzhen Futian CBD",
  id: 1234,
  prices: [599, 569, 549, 399],
  rates: 7,
  accessible: true,
  points: false,
  amenities: 15,
  gallerySize: 0,
  longitude: 121.011490,
  latitude: 24.956030,
  link: null,
  favorite: true,
  description: "Located in the CBD of Shenzhen Futian District, surrounded by financial headquarters, close to Futian High-speed Railway Station and Metro Line 2/ 3/11.",
  location: "East Building of Media Finance Center, junction of Pengcheng 1st Road and Fuzhong 3rd Road, Futian District\nShenzhen, 518000\nChina",
  prefix: "CN¥",
  currency: "CNY"
}

const MENU = { NONE: 0, AMENITIES: 1, LOCATION: 2 };

function EntryOption({
                       id,
                       type,
                       icon,
                       underlay,
                       active,
                       handler,
                       setHover
                     }) {
  return (
    <Button type={type}
            active={active}
            icon={icon}
            id={id}
            underlay={underlay}
            onMouseDown={(_, e) => e.stopPropagation()}
            onMouseUp={(id, e) => {
              e.stopPropagation();
              handler && handler(id);
            }}
            onEnter={() => setHover(false)}
            onLeave={() => setHover(true)} />
  )
}

function Entry({
                 entry = defaultHotel,
                 type = ENTRY.HOTEL,
                 name,
                 hide = false,
                 enable = true,
                 active = false,
                 layer = LAYERS.MENU_AND_BUTTON,
                 updateFavourite,
                 onMouseUp,
               }) {
  //// context
  const { query } = useContext(searchContext);

  //// translation
  const { t } = useTranslation();

  //// states
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const [menuExpand, setMenuExpand] = useState(MENU.NONE);

  //// helper functions
  function menuHandler(type) {
    return () => setMenuExpand(menuExpand === type
      ? MENU.NONE
      : type
    )
  }

  return (
    <Element className={classNames(classes.selection, hover && classes.hover, press && classes.active)}
             style={{ zIndex: layer }}
      // name
             name={name}
      // css conditional styling
             active={active.toString()}
             hide={hide.toString()}
             varient={enable ? BUTTON.TYPES.SELECTION : BUTTON.TYPES.DISABLED}
      // callback functions
             onMouseEnter={() => setHover(true)}
             onMouseLeave={() => {
               setHover(false);
               setPress(false);
             }}
             onMouseDown={() => setPress(true)}
             onMouseUp={(...args) => {
               setPress(false);
               onMouseUp && onMouseUp(entry, ...args);
             }}>
      <div className={classes.underlay}
           style={{ zIndex: layer + 1 }}>
        <span className={classes.svg}><RadioInsetIcon /></span>
      </div>
      <div className={classes.icon} style={{ zIndex: layer + 2 }}>
        <span className={classes.svg}><RadioIcon /></span>
      </div>
      <article style={{ width: "100%" }}>
        <header className={classes.header}>{
          type === ENTRY.HOTEL
            ? entry.name
            : t(entry.name)
        }</header>
        <section className={classes.details}>
            <span className={classes.info}>
              {type === ENTRY.HOTEL && t("from")}
              <div className={classes.icon}>
                <u className={classes.price}>
                  {entry.prefix + entry.prices[query.rate.index]}
                </u>
              </div>
              {`${t("average_per_night")} (${entry.currency})`}
              <div className={classNames(classes.description, classes.text)}>
                {entry.description}
              </div>
            </span>
          <span>
              <img className={classes.image} src={image} alt={"image"} />
              <div className={classes.options}>
                <EntryOption type={BUTTON.TYPES.MENU}
                             setHover={setHover} icon={<ListIcon />}
                             active={menuExpand === MENU.AMENITIES}
                             handler={menuHandler(MENU.AMENITIES)} />
                {type === ENTRY.HOTEL &&
                  <EntryOption type={BUTTON.TYPES.MENU}
                               setHover={setHover} icon={<LocationIcon />}
                               active={menuExpand === MENU.LOCATION}
                               handler={menuHandler(MENU.LOCATION)} />}
                {(0 < entry.gallerySize) &&
                  <EntryOption setHover={setHover} icon={<GalleryIcon />} />
                }
                {type === ENTRY.HOTEL &&
                  <EntryOption type={BUTTON.TYPES.SELECTION}
                               setHover={setHover} icon={<StarIcon />}
                               id={entry}
                               underlay={<StarFilledIcon />}
                               handler={updateFavourite}
                               active={entry.favorite} />}
                {entry.link && <Link to={entry.link}>
                  <EntryOption setHover={setHover} icon={<LinkIcon />} />
                </Link>}
              </div>
            </span>
        </section>
        <Expander render={menuExpand === MENU.AMENITIES}>
          <div className={classNames(classes.list)}>
            {Object.entries(type.amenities).map(([value, title]) =>
              <Amenity key={value}
                       available={value & entry.amenities}
                       title={t(title)} />
            )}
          </div>
        </Expander>
        {type === ENTRY.HOTEL && <Expander render={menuExpand === MENU.LOCATION}>
          <div className={classNames(classes.list, classes.text)}>{entry.location}</div>
        </Expander>}
      </article>
    </Element>
  );
}

export default Entry;