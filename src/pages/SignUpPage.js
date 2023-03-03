import Field, { FIELD } from "../components/interfaces/Field";
import {
  FlagIcon,
  MailIcon,
  Signaccount,
  BirthdayIcon,
  KeyIcon,
  CalendarIcon,
  SignInIcon,
  LeftChevronIcon
} from "../components/icons";
import React, { Component } from "react";
import Button from "../components/interfaces/Button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Fragment } from "react";
import SubmitOld from "../components/interfaces/SubmitOld";
import { sendEmail, randomcaptcha, checkPassWord, signupAPI } from "../api/signupAPI";


export default class SignUpPage extends Component {

  state = {
    CalenderExpand: false,
    error: false,
    errorMessage: [],
    firstname: "",
    lastname: "",
    mail: "",
    rightcode: "",
    captcha: "",
    password: "",
    country: "",
    strongness: 0,
    date: ""
  }

  submitHandler = () => {

    this.setState({ errorMessage: [] })
    const { country, firstname, lastname, mail, captcha, strongness, date, password } = this.state
    if (firstname === "") {
      this.setState({ error: true, errorMessage: ["firstname can not be empty"] })
      return
    }
    if (lastname === "") {
      this.setState({ error: true, errorMessage: ["lastname can not be empty"] })
      return
    }

    if (country === "") {
      this.setState({ error: true, errorMessage: ["country can not be empty"] })
      return
    }
    if (date === "") {
      this.setState({ error: true, errorMessage: ["date can not be empty"] })
      return
    }
    if (strongness < 3) {
      this.setState({ error: true, errorMessage: ["password too weak!"] })
      return
    }
    //所有校验通过，发送注册的axios请求
    signupAPI(firstname, lastname, mail, country, date, password)
  }

  changePsw = (e) => {
    this.setState({ password: e.target.value })
    const psw = e.target.value
    const strongness = checkPassWord(psw)
    console.log("strong:", strongness)
    this.setState({ strongness: strongness })
  }

  sdemail = () => {
    this.setState({ errorMessage: [] })
    if (this.state.mail === "") {
      this.setState({ error: true, errorMessage: ["mail can not be empty"] })
      return
    }
    const randomca = randomcaptcha()
    this.setState({ rightcode: randomca })
    sendEmail(randomca, this.state.mail)
  }


  render() {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1);
    defaultDate.setHours(8, 0, 0);
    const mystyle = {
      textalign: "center",
      width: "300px",
      height: "350px",
      margin: "auto",
      position: " absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0"
    }
    const psstyle = {
      float: "left",
      width: "25%",
      height: "5px",
      border: "1px",
      background: "#14B12F"
    }
    const nav = {
      float: "left",
      display: "block",
      color: "#000000",
      padding: "14px 16px",
    }
    const { errorMessage } = this.state
    return (
      <div>
        <Link to={"/sign-in"} style={nav}>
          <Button icon={<LeftChevronIcon />}
                  iconDescription={"Sign In"} />
        </Link>
        <div style={mystyle}>
          <div>
            <span style={{ fontWeight: "bold", textAlign: "center", display: "block" }}>Nice to meet you</span>
          </div>
          <Field icon={<SignInIcon />}
                 name="firstname"
                 placeholder="First Name"
                 onChange={(event) => {
                   this.setState({ firstname: event.target.value })
                 }}
          />
          <Field icon={<SignInIcon />}
                 name="lastname"
                 placeholder="Last Name"
                 onChange={(event) => {
                   this.setState({ lastname: event.target.value })
                 }}
          />
          <Field icon={<MailIcon />}
                 name="mail"
                 placeholder="email"
                 onChange={(event) => {
                   this.setState({ mail: event.target.value })
                 }}
          />
          <Button
            icon={<MailIcon />}
            iconDescription="send captacha to email"
            onMouseUp={this.sdemail}
          />
          <Field icon={<MailIcon />}
                 placeholder="Captcha"
                 onChange={(Event) => this.setState({ captcha: Event.target.value })}
          />
          <Field icon={<FlagIcon />}
                 name="country"
                 placeholder="country"
                 onChange={(Event) => this.setState({ country: Event.target.value })}
          />

          <Field icon={<CalendarIcon />}
                 name="date"
                 type="date"
                 onChange={(Event) => this.setState({ date: Event.target.value })}
          />
          <Field icon={<KeyIcon />}
                 name="password"
                 placeholder="Password"
                 type={FIELD.TYPES.PASSWORD}
                 onChange={this.changePsw}
          />
          <div id="tips">
            {this.state.strongness >= 1 && <span style={psstyle}></span>}
            {this.state.strongness >= 2 && <span style={psstyle}></span>}
            {this.state.strongness >= 3 && <span style={psstyle}></span>}
            {this.state.strongness >= 4 && <span style={psstyle}></span>}
          </div>
          <SubmitOld description="Sign Up"
                     error={this.state.error}
                     errorMessage={this.state.errorMessage}
                     onMouseUp={this.submitHandler}
          />
        </div>
      </div>
    )
  }
}

