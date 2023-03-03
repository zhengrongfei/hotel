import { useContext, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../../api/axios";

import classes from "./index.module.css"
import useAuth from "../../hooks/useAuth";
import UserContext from "../../contexts/user-context";

import {
  MailIcon, KeyIcon, SignInIcon, SignUpIcon, ForgotIcon
} from "../../components/icons";
import Field, { FIELD } from "../../components/interfaces/Field";
import storage from "../../api/storage";
import Button, { BUTTON } from "../../components/interfaces/Button";
import NavBar from "../../components/layouts/NavBar";
import SearchBar from "../../components/layouts/SearchBar";
import { BREACKPOINTS, ROUTES } from "../../constants/urls";
import { debounce } from "../../components/functions";
import { DELAY } from "../../constants/delays";
import Checkbox from "../../components/interfaces/Checkbox";
import { DURATION, EASE } from "../../constants/css";

function SignInPage({}) {
  //// hooks
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { auth, setAuth, persist, setPersist } = useAuth();
  const { setUser } = useContext(UserContext);

  //// states
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [mailErr, setMailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [submitErr, setSubmitErr] = useState("");

  //// handlers
  const submitHandler = async (_, e) => {
    e.preventDefault();
    setSubmitErr("");
    try {
      const response = await axios.post(BREACKPOINTS.SIGN_IN,
        JSON.stringify({ mail, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      console.log(JSON.stringify(response));
      if (response.data.code === 0) {
        setAuth({
          role: response.data.role,
          label: response.data.label,
          accessToken: response.data.accessToken
        });
        persist && storage.saveAuth(response.data.JWT, response.data.role)
        // clear user input
        setMail("");
        setPassword("");
        // go back and don't come back to the login screen
        // navigate(-1, { replace: true });
      } else
        setSubmitErr(response.data.msg);
    } catch (error) {
      console.log(error)
      if (!error?.response)
        setSubmitErr(t("no_server_response"));
      // else if (err.response?.status === 400)
      //   setSubmitErr("Missing Username or Password");
      // else if (err.response?.status === 401)
      //   setSubmitErr("Unauthorized");
      else
        setSubmitErr(t("sign_in_failed"));
    }
  }
  const mailValidator = debounce((e) => {
    if (e.target.value) {
      setMail(e.target.value);
      setMailErr("");
    } else
      setMailErr(t("email_is_required"));
  }, DELAY.INPUT_DELAY);
  const passwordValidator = debounce((e) => {
    if (e.target.value) {
      setPassword(e.target.value);
      setPasswordErr("");
    } else
      setPasswordErr(t("password_is_required"));
  }, DELAY.INPUT_DELAY);

  return (
    (storage.getAuth() || auth.role)
      ? <Navigate to={-1} replace={true} />
      : <>
        <NavBar />
        <SearchBar />
        <form className={classes.container}>
          <fieldset>
            <header className={classes.title}>{t("welcome")}</header>
            <Field icon={<MailIcon />}
                   defaultFocus={true}
                   name="mail"
                   placeholder={t("login_email")}
                   state={mailErr ? FIELD.STATES.ERROR : FIELD.STATES.IDLE}
                   attribute={mailErr}
                   onChange={mailValidator} />
            <Field icon={<KeyIcon />}
                   name="password"
                   divider={FIELD.DIVIDER.TOP}
                   placeholder={t("password")}
                   type={FIELD.TYPES.PASSWORD}
                   state={passwordErr ? FIELD.STATES.ERROR : FIELD.STATES.IDLE}
                   attribute={passwordErr}
                   onChange={passwordValidator} />
            <Checkbox state={persist} setState={setPersist}>
              {t("trust_this_device")}
            </Checkbox>
            <Button icon={<SignInIcon />}
                    iconDescription={t("sign_in")}
                    submit={true}
                    type={(passwordErr || mailErr || !(password && mail))
                      ? BUTTON.TYPES.DISABLED
                      : BUTTON.TYPES.CLICK}
                    onClick={submitHandler} />
            <AnimatePresence initial={false}>
              {submitErr &&
                <motion.div className={classes.error}
                            initial={{ height: 0 }}
                            animate={{ height: "fit-content" }}
                            exit={{ height: 0 }}
                            transition={{
                              duration: DURATION.FAST,
                              ease: EASE.EASE_OUT
                            }}>
                  {submitErr}
                </motion.div>}
            </AnimatePresence>
          </fieldset>
          <fieldset>
            <Button icon={<SignUpIcon />}
                    iconDescription={t("sign_up")}
                    onClick={() => navigate(ROUTES.SIGN_UP)} />
            <Button icon={<ForgotIcon />}
                    iconDescription={t("forgot")}
                    onClick={() => navigate(ROUTES.FORGOT)} />
          </fieldset>
        </form>
      </>
  );
}

export default SignInPage;
