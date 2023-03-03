import storageUtils from "../Login/storageUtils";
import axios from "axios";


export async function getUserName() {
    ////验证登录状态从内存里拿jwt
    const {role, JWT} = storageUtils.getUser()
    let username="";
    //如果有，那么发送给后端
    if (JWT != undefined) {
        await axios({
            method: 'get',
            url: 'http://localhost:8888/getUserName',
            params: {
                JWT: JWT,
            }
        }).then((response) => {
                if (response.data.code === "1") {

                    username=response.data.username;
                }
            }
        ).catch(function (error) {
            console.log(error)
            alert("error");
        })
        ;
    }
    return username
}