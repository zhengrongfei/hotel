import storage from "./storage";
import axios from "axios";


export async function getRole() {
  ////验证登录状态从内存里拿jwt
  let { role, JWT } = storage.getAuth()
  //如果有，那么发送给后端
  if (JWT != undefined) {
    await axios({
      method: "get",
      url: "http://localhost:8888/isTokenOk",
      params: {
        JWT: JWT,
      }
    }).then((response) => {

        if (response.data.code === "0") {
          //登录失效，删除内存里的数据
          storage.deleteAuth()
          role = ""
        }
        if (response.data.code === "1") {
          //登录有效,返回role
        }
      }
    ).catch(function (error) {
      console.log(error)
      alert("error");
    })
    ;
  }
  return role
}