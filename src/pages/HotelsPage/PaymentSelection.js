import { forwardRef, useContext } from "react";
import { Element } from "react-scroll";
import { AnimatePresence, motion } from "framer-motion";
import classNames from "classnames";

import classes from "./PaymentSelection.module.css";
import Menu from "../../components/interfaces/Menu";
import Button, { BUTTON } from "../../components/interfaces/Button";
import {
  DiceIcon,
  DownChevronIcon,
  HotelIcon,
  RoomIcon,
  SignInIcon,
  StackIcon,
  UpChevronIcon
} from "../../components/icons";
import Room from "../../components/interfaces/Room";
import Field, { FIELD } from "../../components/interfaces/Field";
import { DURATION, EASE, LAYERS, LENGTHS } from "../../constants/css";
import ScrollBox from "../../components/interfaces/ScrollBox";
import { ID, NAME } from "../../constants/identifiers";
import Dropdown from "../../components/interfaces/Dropdown";
import Checkbox from "../../components/interfaces/Checkbox";
import Submit, { SUBMIT } from "../../components/interfaces/Submit";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/urls";
import { useTranslation } from "react-i18next";
import image from "./hotel.png";
import searchContext from "../../contexts/search-context";
import { POINTS_RATIO } from "../../constants/hotel-attributes";
import useFormat from "../../hooks/useFormat";

const defaultHotel = {
  name: "Park Hyatt Shenzhen",
  id: 1235,
  prices: [1799, 1649, 1799, 1799],
  rates: 1,
  accessible: true,
  points: false,
  amenities: 15,
  gallerySize: 0,
  longitude: 123.013450,
  latitude: 25.225050,
  link: null,
  favorite: false,
  description: "A sophisticated 5- star hotel in the heart of the Futian business district",
  location: "East Building of Media Finance Center, junction of Pengcheng 1st Road and Fuzhong 3rd Road, Futian District\nShenzhen, 518000\nChina",
  prefix: "CN¥",
  currency: "CNY"
};

const WEEKDAY_FORMAT = "ccc";
const DATE_FORMAT = "dd MMM";
const Entry = ({
                 caption,
                 content,
               }) => {
  return (
    <motion.section className={classes.entry}
                    initial={{ height: 0 }}
                    animate={{ height: "fit-content" }}
                    exit={{ height: 0 }}
                    transition={{
                      duration: DURATION.NORMAL,
                      ease: EASE.NORMAL
                    }}>
      <div className={classes.caption}>{caption}</div>
      {content}
    </motion.section>
  );
}

const PaymentSelection = forwardRef(({
                                       name,
                                       submitState,
                                       userPoints,
                                       userHotel = defaultHotel,
                                       userCategory,
                                       submitHandler,
                                       setSubmitState,
                                       className,
                                     }, ref) => {
  //// context
  const { query } = useContext(searchContext);
  //// hooks
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { format } = useFormat();
  //// states

  //// helper functions
  const formatDate = (date) => {
    return `${format(date, WEEKDAY_FORMAT)}\, ${format(date, DATE_FORMAT)}`
  }

  //// handlers

  //// effects

  return (
    <Element className={classNames(classes.payment_selection, className)}
             name={name}>
      <aside className={classes.summary}>
        <img className={classes.image} src={image} alt={"image"} />
        <div className={classes.details}>
          <header className={classes.header}>{t("summary")}</header>
          <Entry caption={t("night_stay", { count: query.date.span })}
                 content={<>
                   {formatDate(query.date.start)}
                   <u> - </u>
                   {formatDate(query.date.end)}
                 </>} />
          <Entry caption={userHotel.name}
                 content={t(userCategory.name)} />
          <AnimatePresence initial={false}>{query.accessible &&
            <Entry caption={t("requests")}
                   content={t("accessible")} />}
          </AnimatePresence>
          <Entry caption={
            `${query.rooms}
             ${t("rooms", { count: query.rooms })}, 
             ${t("guests", { count: query.adults })}`}
                 content={t(query.rate.name)} />
          <AnimatePresence initial={false}>{query.usePoints &&
            <Entry caption={t("use_points")}
                   content={<>
                     {userHotel.prices[query.rate.index] * POINTS_RATIO * query.date.span}
                     <u>{` / ${userPoints}`}</u>
                   </>} />}
          </AnimatePresence>
          <section className={classes.price}>
            {userHotel.prefix + userHotel.prices[query.rate.index] * query.date.span}
          </section>
        </div>
      </aside>
      <form className={classes.info_list}>
        <fieldset className={classes.list_bar}>
          <Button icon={<SignInIcon />}
                  onMouseUp={() => navigate(ROUTES.SIGN_IN)}
                  iconDescription={t("sign_in")} />
          {t("for_faster_checkout")}
        </fieldset>
        <fieldset className={classes.list_body} style={{ zIndex: LAYERS.BASIC }}
                  ref={ref}>
          <ScrollBox className={classes.list_body} layer={LAYERS.BASIC + 1}>
          </ScrollBox>
        </fieldset>
        <fieldset className={classes.list_bar}>
          <Submit description={t("checkout")}
                  state={submitState}
                  onMouseUp={submitHandler} id={name} />
        </fieldset>
      </form>
    </Element>
  );
});

export default PaymentSelection;