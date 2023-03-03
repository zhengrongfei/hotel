import React, { Component} from 'react'
import Button from "../components/interfaces/Button";
import {MailIcon,CancelIcon,PersonalInfoIcon, SendIcon, KeyIcon} from "../components/icons";
import Field,{FIELD} from "../components/interfaces/Field";
import { Link,  Navigate} from "react-router-dom";
import storage from '../api/storage';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
import classes from "../components/interfaces/Submit.module.css"
import { Fragment } from "react";
import { checkPassWord} from "../api/signupAPI";
import { findPsw } from '../api/forgetPSW';
import Submit from '../components/interfaces/Submit';


export default class ForgotPage extends Component {
    //点击后给邮箱发送验证码邮件
    state={
        mail:"",
        password:"",
        captcha:"",
        rightCaptcha:"",
        error:false,
        errorMessage:[],
        strongness:0
    }


    //发送验证码
  sendEmail=()=>{
    //随机生成六位数验证码
    this.setState({errorMessage:[]})
    if(this.state.mail===""){
      this.setState({error:true,errorMessage:["mail can not be empty"]})
      return
    }
    var captcha="";
    for(var i=0;i<6;i++){
      captcha+=Math.floor(Math.random()*10)
    }
    this.setState({rightCaptcha:captcha})
    //调用api发送验证码
     axios({
      method: 'get',
      url: 'http://hn216.api.yesapi.cn/',
      params:{
        s:'App.Email.Send',
        return_data:0,
        address:this.state.mail,
        title:'Hyatt Hotel Captcha',
        content:captcha,
        app_key:'ECF1C0604182C0A640E235CD874345D9',
        sign:'28C9613F0221DEC02EE41CF3DCC099D3'
      }
    }).then(function(response){
      console.log(response.data)
      if(response.data.ret==200){
        if(response.data.data.err_code==0){
        alert("send successfully！")
       }
      }
      else{
          alert(response.data.msg)
      }
    }).catch(function(error){
      console.log(error)
      alert("error");
    })
    ;
  }

  handelSubmit=()=>{
      this.setState({errorMessage:[]})
      const {mail,password,captcha,rightCaptcha,strongness}=this.state
      //空值检测
      if(mail==""){
          this.setState({error:true,errorMessage:["mail can't be empty"]})
          return
      }
      if(strongness<3){
        this.setState({error:true,errorMessage:["password too weak!"]})
        return
      }
      if(captcha==""){
          this.setState({error:true,errorMessage:["captcha can't be empty"]})
          return
      }
      //判断验证码是否正确
      if(captcha!=rightCaptcha){
          this.setState({error:true,errorMessage:["captcha incorrect!"]})
          return
        
      }
      else{
          //todo:验证码正确 发送axios请求 改动该用户的密码 
          findPsw(mail,password)
      }
  }
  test=()=>{
      console.log(this)
  }
  changePsw=(e)=>{
    this.setState({password:e.target.value})
    const psw=e.target.value
    const strongness=checkPassWord(psw)
    console.log("strong:",strongness)
    this.setState({strongness:strongness})
  }

  render() {
    const mystyle={
        textalign:'center',
        width: '300px',
        height: '350px',
        margin: 'auto',
        position:' absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0'
      }
      const psstyle={
        float:'left',
        width: '25%',
        height: '5px',
        border: '1px',
        background: '#14B12F'
      }
      const pstyle={
        float:'left',
        width: '25%',
        height: '5px',
        border: '1px',
        background: 'white'
      }
    return (
        
        <div style={mystyle}>
            <Link to={'/sign-in'}>
            <Button icon={<CancelIcon />}
            onMouseUp={this.props.cancelCallback}/>
            </Link>
            <header >
                Find Back Password
            </header>
          <motion.form 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       transition={{
                         duration: 0.4,
                         ease: "linear"
                       }}>
            
              <Field icon={<MailIcon />}
                          name="mail"
                          placeholder="Mail"
                          onChange={(Event)=>this.setState({mail:Event.target.value})}
               />
              <Button 
                     icon={<SendIcon/>}
                     iconDescription="send captacha to email"
                     onMouseUp={this.sendEmail}
              />
              <Field icon={<PersonalInfoIcon />}
                          placeholder="Captcha"
                          onChange={(Event)=>this.setState({captcha:Event.target.value})}
                           />
          <Field icon={<KeyIcon/>}
                      name="password"
                      placeholder="Password"
                      type={FIELD.TYPES.PASSWORD}
                      onChange={this.changePsw}
                       />
              <div id="tips">
                      {this.state.strongness>=1 && <span style={psstyle}></span> }
                      {this.state.strongness>=2 && <span style={psstyle}></span> }
                      {this.state.strongness>=3 && <span style={psstyle}></span> }
                      {this.state.strongness>=4 && <span style={psstyle}></span> }
              </div>


              
           
            <Submit erorr={false}
            errorMessage={[]}
            onMouseUp={this.handelSubmit}
            width="100%" 
            />
          </motion.form>
          <motion.p className={classes.error}
                initial={false}
                animate={{ height: this.state.error ? "auto" : 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.8, 0, 0.5, 1]
                }}>
              {this.state.errorMessage.map(message => (
                <Fragment key={message}>
                  {message}
                   <br />
                </Fragment>
              ))}
          </motion.p>
        </div>
      )
  }
}
