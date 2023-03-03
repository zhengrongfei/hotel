import { forwardRef, useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import classes from "./NavBar.module.css";
import Menu from "../interfaces/Menu";
import Button, { BUTTON } from "../interfaces/Button";
import {
  AvatarIcon, GlobeIcon, HotelIcon, ListIcon, LockIcon,
  MessageIcon, NewsIcon, OfferIcon, ReviewIcon, SettingsIcon,
  SignInIcon, SignUpIcon
} from "../icons";
import { ALIGNMENT, EASE, DURATION, LAYERS, LENGTHS } from "../../constants/css";
import LanguageContext from "../../contexts/language-context";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/urls";
import useLogout from "../../hooks/useLogout";

import {getRole} from "../../api/getRole";
import {getUserName} from "../../api/getUserName";

const MENU = { NONE: 0, LANGUAGE: 1, USER: 2 };

const NavBar = forwardRef(({ hide }, ref) => {
  //// contexts
  const { changeLanguage, currentLanguageCode } = useContext(LanguageContext);
  const { auth } = useAuth();

  //// hooks
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useLogout();

  //// references
  const navRef = useRef(null);
  const usedRef = ref || navRef;

  //// states
  const [menuExpand, setMenuExpand] = useState(MENU.NONE);
  let username = getUserName().then(res => {
    username = res
  });
  let linkpage = getRole().then(res => {
    if (res === "administrator") {
      linkpage = "http://localhost:8080/?sendId=2"
    } else {
      if (username === "David")
        linkpage = "http://localhost:8080/?sendId=3"
      else if (username === "李强")
        linkpage = "http://localhost:8080/?sendId=4"
      else
        linkpage = ""
    }
  });

  //// helper functions
  function menuHandler(type) {
    return () => setMenuExpand(menuExpand === type
      ? MENU.NONE
      : type
    )
  }

  return (
    <motion.nav className={classes.nav}
                initial={false}
                animate={{
                  marginBottom: hide ? -LENGTHS.UNIT_LENGTH : 0,
                  translateY: hide ? -LENGTHS.UNIT_LENGTH : 0,
                }}
                transition={{
                  duration: DURATION.NORMAL,
                  ease: EASE.NORMAL,
                  delay: hide ? 0.2 : 0,
                }}
                style={{ zIndex: LAYERS.NAVBAR }}
                ref={usedRef}>
      <div className={classes.link_wrapper}
           style={{ zIndex: LAYERS.NAVBAR }}>
        <Link to="/" className={classes.home_link}><Button
          className={classes.home_button}
          iconDescription={t("website_title")}
        /></Link>
        <Link to="/hotels" className={classes.page_link}><Button
          alignment={ALIGNMENT.CENTER}
          width="100%"
          icon={<HotelIcon />}
          iconDescription={t("hotels")}
        /></Link>
        <Link to="/offers" className={classes.page_link}><Button
          alignment={ALIGNMENT.CENTER}
          width="100%"
          icon={<OfferIcon />}
          iconDescription={t("offers")}
        /></Link>
        <Link to="/reviews" className={classes.page_link}><Button
          alignment={ALIGNMENT.CENTER}
          width="100%"
          icon={<ReviewIcon />}
          iconDescription={t("reviews")}
        /></Link>
        <Link to="/notices" className={classes.page_link}><Button
          alignment={ALIGNMENT.CENTER}
          width="100%"
          icon={<NewsIcon />}
          iconDescription={t("notices")}
        /></Link>
        <Menu expand={!hide && menuExpand === MENU.LANGUAGE}
              layer={LAYERS.NAVBAR}
              activator={
                <Button icon={<GlobeIcon />}
                        active={menuExpand === MENU.LANGUAGE}
                        type={BUTTON.TYPES.MENU}
                        onMouseUp={menuHandler(MENU.LANGUAGE)} />}>
          <Button iconDescription={t("chinese")} content={BUTTON.CONTENT.TEXT}
                  type={BUTTON.TYPES.OPTION}
                  active={currentLanguageCode === "zh"}
                  onMouseUp={() => changeLanguage("zh")} />
          <Button iconDescription={t("english")} content={BUTTON.CONTENT.TEXT}
                  type={BUTTON.TYPES.OPTION}
                  active={currentLanguageCode === "en"}
                  onMouseUp={() => changeLanguage("en")} />
        </Menu>
        <Button icon={<MessageIcon onClick={() => {
          if (linkpage !== "") {
            const w = window.open('about:blank');
            w.location.href = linkpage
          }
        }}/>} />
        <Menu expand={!hide && menuExpand === MENU.USER}
              layer={LAYERS.NAVBAR}
              activator={
                <Button icon={<AvatarIcon />}
                        active={menuExpand === MENU.USER}
                        type={BUTTON.TYPES.MENU}
                        onMouseUp={menuHandler(MENU.USER)} />}>
          {!auth.role && <>
            <Button icon={<SignInIcon />}
                    iconDescription={t("sign_in")}
                    onMouseUp={() => navigate(ROUTES.SIGN_IN)} />
            <Button icon={<SignUpIcon />}
                    iconDescription={t("sign_up")}
                    onMouseUp={() => navigate(ROUTES.SIGN_UP)} /></>}
          <Button icon={<SettingsIcon />}
                  iconDescription={t("settings")}
                  type={auth.role ? BUTTON.TYPES.CLICK : BUTTON.TYPES.DISABLED}
                  onMouseUp={() => navigate(ROUTES.USER)} />
          <Button icon={<ListIcon />}
                  iconDescription={t("orders")}
                  type={auth.role ? BUTTON.TYPES.CLICK : BUTTON.TYPES.DISABLED}
                  onMouseUp={() => navigate(ROUTES.ORDERS)} />
          <Button icon={<LockIcon />}
                  iconDescription={t("log_out")}
                  type={auth.role ? BUTTON.TYPES.CLICK : BUTTON.TYPES.DISABLED}
                  onMouseUp={() => logout()} />
        </Menu>
      </div>
    </motion.nav>
  );
});

export default NavBar;
