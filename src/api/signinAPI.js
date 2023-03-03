import axios from "axios";
import storage from "./storage";

//登录接口
// export function Login(mail, password) {
//   return axios({
//     method: "post",
//     url: "https://localhost:3000/signin",
//     data: {
//       mail: mail,
//       password: password
//     }
//   }).then(function (response) {
//     console.log(response.data)
//     if (response.data.code === "1") {
//       alert("signin successfully！")
//       storageUtils.saveUser(response.data.JWT, response.data.role)
//       window.location.href = "https://localhost:3000/user"
//     } else {
//       alert(response.data.msg)
//     }
//   }).catch(function (error) {
//     console.log(error)
//     alert("network error");
//   })
// }


//判断登录状态接口
export function isLogin() {
  //没有jwt的情况
  if (storage.getAuth() == "") {
    return false
  }
  //有token的情况
  else {
    //发送axios请求判断jwt有没有过期
    /*axios({
        method:'get',
        url:'/isTokenOk',
        params:{
            jwt:storageUtils.getUser()
        }
    }).then(function(response){
        if(response.data.code==1){
            return true
        }
        else{
            return false
        }
    }).catch(function(error){
        console.log(error)
        alert("network error!")
        return false
    })
    */
    return true
  }
}

//登出接口
export function logout() {
  storage.deleteAuth()
  alert("Log out successfully!")
}


  