import { useTranslation } from "react-i18next";
import { Element } from "react-scroll";

import { DURATION, LAYERS, LENGTHS } from "../../constants/css";
import Button, { BUTTON } from "../../components/interfaces/Button";
import {
  CheckboxIcon, CheckboxInsetIcon,
  RadioIcon, RadioInsetIcon,
  DiceIcon,
  HotelIcon, RoomIcon, StackIcon,
  DownChevronIcon, UpChevronIcon
} from "../../components/icons";
import Field, { FIELD } from "../../components/interfaces/Field";
import Submit, { SUBMIT } from "../../components/interfaces/Submit";
import classes from "./RoomSelection.module.css";
import classNames from "classnames";
import Checkbox from "../../components/interfaces/Checkbox";
import Room from "../../components/interfaces/Room";
import Menu from "../../components/interfaces/Menu";
import React, { Fragment, useContext, useState } from "react";
import Entry, { ENTRY } from "../../components/interfaces/Entry";
import ScrollBox from "../../components/interfaces/ScrollBox";
import searchContext from "../../contexts/search-context";
import { ROOM_PLACEHOLDER } from "../../constants/hotel-attributes";
import { scrollToElement } from "../../components/functions";
import { ID, NAME } from "../../constants/identifiers";
import Expander from "../../components/interfaces/Expander";
import Dropdown from "../../components/interfaces/Dropdown";

let defaultTowers = [{
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
let defaultRooms = [{
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
let defaultCategories = [{
  id: 1,
  name: "single_bed",
  maxCapacity: 2,
  maxChildren: 1,
  description: "Our well-lit and spacious 36sqm room with two single beds and atrium garden view soothes you after a day’s weariness. Provide soft bathrobes.",
  gallerySize: 0,
  prices: [1499, 1469, 1449, 1399],
  rates: 15,
  amenities: 15,
  prefix: "CN¥",
  currency: "CNY"
}, {
  id: 2,
  name: "deluxe_twin",
  maxCapacity: 4,
  maxChildren: 2,
  description: "Our well-lit and spacious 36sqm room with two single beds and atrium garden view soothes you after a day’s weariness. Provide soft bathrobes.",
  price: 3299,
  gallerySize: 0,
  availableRates: 2,
  amenities: 15,
  prefix: "CN¥",
  currency: "CNY"
}, {
  id: 3,
  name: "executive",
  maxCapacity: 6,
  maxChildren: 6,
  description: "Our well-lit and spacious 36sqm room with two single beds and atrium garden view soothes you after a day’s weariness. Provide soft bathrobes.",
  price: 5439,
  gallerySize: 0,
  availableRates: 0,
  amenities: 15,
  prefix: "CN¥",
  currency: "CNY"
}]

const MENU = { NONE: 0, FLOOR: 1, ROOM: 2 }

const RoomSelection = React.forwardRef(({
                                          name,
                                          randomRoom,
                                          userTower = defaultTowers[0],
                                          userFloor = defaultTowers[0].lowestFloor,
                                          userRoom = defaultRooms[0],
                                          categoryCode = defaultCategories[0].id,
                                          updateRandomRoom,
                                          updateTower,
                                          updateFloor,
                                          updateRoom,
                                          updateCategory,
                                          submitHandler,
                                          towers = defaultTowers,
                                          rooms = defaultRooms,
                                          categories = defaultCategories,
                                          className
                                        }, ref) => {
  //// context
  const { query } = useContext(searchContext);

  //// translation
  const { t } = useTranslation();

  //// states
  const [towerExpand, setTowerExpand] = useState(false);
  const [menuExpand, setMenuExpand] = useState(MENU.NONE);

  //// helper functions
  const formatTower = (name) => `${t("tower")} ${name}`
  const formatFloor = (name) => `${t("floor")} ${name}`
  const formatRoom = (name) => `${t("room")} ${name}`
  function menuHandler(type) {
    return () => setMenuExpand(menuExpand === type
      ? MENU.NONE
      : type
    )
  }

  //// handlers
  function roomHandler(room) {
    scrollToElement(
      NAME.ROOMS + room.category.toString(),
      ID.ROOM_LIST);
    updateRoom(room);
  }

  return (
    <Element className={classNames(classes.room_selection, className)}
             name={name}>
      <aside className={classes.room_visual}>
        <Menu expand={towerExpand}
              finalWidth="100%"
              style={{ position: "absolute" }}
              activator={
                <div className={classes.tower_selector}>
                  <Button icon={<HotelIcon />}
                          iconDescription={formatTower(userTower.name)}
                          onMouseUp={() => setTowerExpand(!towerExpand)}
                          content={BUTTON.CONTENT.ADJACENT} />
                  <Button icon={<DownChevronIcon />}
                          underlay={<UpChevronIcon />}
                          active={towerExpand}
                          onMouseUp={() => setTowerExpand(!towerExpand)}
                          type={BUTTON.TYPES.MENU} />
                </div>}>
          {towers.map((tower, index) =>
            <Button type={BUTTON.TYPES.OPTION}
                    content={BUTTON.CONTENT.TEXT}
                    iconDescription={formatTower(tower.name)}
                    active={tower.id === userTower.id}
                    key={index}
                    id={tower}
                    onMouseDown={updateTower} />
          )}
        </Menu>
        <div className={classes.floor_plan}>
          {rooms.map((room, index) =>
            <Room room={room}
                  active={room.id === userRoom?.id}
                  onMouseUp={roomHandler}
                  key={index} />
          )}
        </div>
        <div className={classes.floor_selector}>
          <Field type={FIELD.TYPES.NUMBER} align={FIELD.ALIGN.CENTER}
                 min={userTower.lowestFloor} max={userTower.highestFloor}
                 defaultValue={userFloor}
                 onLeave={(e) => updateFloor(+e.target.value)}
                 caption={t("floor")} />
          <Button icon={<UpChevronIcon />}
                  type={userFloor === userTower.highestFloor
                    ? BUTTON.TYPES.DISABLED
                    : BUTTON.TYPES.CLICK
                  }
                  onMouseUp={() => updateFloor(userFloor + 1)} />
          <Button icon={<DownChevronIcon />}
                  type={userFloor === userTower.lowestFloor
                    ? BUTTON.TYPES.DISABLED
                    : BUTTON.TYPES.CLICK
                  }
                  onMouseUp={() => updateFloor(userFloor - 1)} />
        </div>
      </aside>
      <form className={classes.room_list}>
        <fieldset className={classes.list_bar}>
          <Button type={BUTTON.TYPES.MENU}
                  icon={<StackIcon />}
                  active={menuExpand === MENU.FLOOR}
                  onMouseUp={menuHandler(MENU.FLOOR)}
                  iconDescription={formatFloor(userFloor)} />
          <Button type={BUTTON.TYPES.MENU}
                  icon={<RoomIcon />}
                  active={menuExpand === MENU.ROOM}
                  onMouseUp={menuHandler(MENU.ROOM)}
                  iconDescription={formatRoom(userRoom.name)} />
        </fieldset>
        <fieldset className={classes.list_body} style={{ zIndex: LAYERS.BASIC }}
                  ref={ref}>
          <ScrollBox className={classes.list_body} layer={LAYERS.BASIC + 1}
                     id={ID.ROOM_LIST}>
            {categories.map((category, index) => (
              <Entry type={ENTRY.ROOM}
                     key={index}
                     name={NAME.ROOMS + category.id.toString()}
                     active={category.id === categoryCode}
                     enable={!query.rate.value || (query.rate.value & category.rates)}
                     onMouseUp={updateCategory}
                     entry={category} />
            ))}
          </ScrollBox>
          <Dropdown expand={menuExpand === MENU.ROOM}>
            {rooms.map((room, index) => (
              <Button type={BUTTON.TYPES.OPTION}
                      content={BUTTON.CONTENT.TEXT}
                      iconDescription={formatRoom(room.name)}
                      id={room}
                      key={index}
                      active={userRoom.id === room.id}
                      onMouseUp={updateRoom} />
            ))}
          </Dropdown>
          <Dropdown expand={menuExpand === MENU.FLOOR}>
            {Array(
              userTower.highestFloor - userTower.lowestFloor
            ).fill().map((_, index) => {
              const floor = userTower.lowestFloor + index;
              return <Button type={BUTTON.TYPES.OPTION}
                             content={BUTTON.CONTENT.TEXT}
                             iconDescription={formatFloor(floor)}
                             id={floor}
                             key={index}
                             active={userFloor === floor}
                             onMouseUp={updateFloor} />
            })}
          </Dropdown>
        </fieldset>
        <fieldset className={classes.list_bar}>
          <Checkbox state={randomRoom}
                    handler={updateRandomRoom}>
            <DiceIcon />
            <span style={{ marginLeft: LENGTHS.GAP_ICON }}>
              {t("any_room")}
            </span>
          </Checkbox>
          <Submit description={t("proceed_to_payment")}
                  state={categoryCode
                    ? SUBMIT.STATES.IDLE
                    : SUBMIT.STATES.DISABLED}
                  onMouseUp={submitHandler} id={name} />
        </fieldset>
      </form>
    </Element>
  );
});

export default RoomSelection;