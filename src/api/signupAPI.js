import axios from 'axios';

export function randomcaptcha(){
//随机生成六位数验证码
var captcha="";
for(var i=0;i<6;i++){
  captcha+=Math.floor(Math.random()*10)
}
return captcha
}

export function sendEmail( captcha,mail){
    console.log("a")
    //调用api发送验证码
     axios({
      method: 'get',
      url: 'http://hn216.api.yesapi.cn/',
      params:{
        s:'App.Email.Send',
        return_data:0,
        address:mail,
        title:'Hyatt Hotel Captcha',
        content:captcha,
        app_key:'ECF1C0604182C0A640E235CD874345D9',
        sign:'28C9613F0221DEC02EE41CF3DCC099D3'
      }
    }).then(function(response){
      console.log(response.data)
      if(response.data.ret==200){
        alert("send successfully！")
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

/**
     * 密码强度判断
     */
 export function checkPassWord(value) {
    // 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别
    // 3： 表示第四个级别 4：表示第五个级别
    var num= 1;
    if(value.length==0){
        return 0;
    }
    if (value.length > 0 && value.length<8) {//最初级别
        return num;
    }
    if (/\d/.test(value)) {//如果用户输入的密码 包含了数字
        num++;
    }
    if (/[a-z]/.test(value)) {//如果用户输入的密码 包含了小写的a到z
        num++;
    }
    if (/[A-Z]/.test(value)) {//如果用户输入的密码 包含了大写的A到Z
        num++;
    }
    return num;
}

export function signupAPI(firstname,lastname,mail,country,birthday,password){
  axios({
    method: 'post',
    url: 'http://localhost:8888/signup',
    data:{
    firstname:firstname,
    lastname:lastname,
    mail:mail,
    country:country,
    birthday:birthday,
    password:password
    }
  }).then(function(response){
      console.log(response.data)
      if(response.data.code==="0"){
        alert("sign up successfully!")
      }
      else if(response.data.code==="1"){
        alert("sign up fail")
      }
    }).catch(function(error){
      console.log(error)
      alert("error");
  })
  ;
}

