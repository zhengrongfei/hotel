import axios from 'axios';
import storage from './storage';

export function findPsw(mail,password) {
    return axios({
        method:'post',
        url:'http://localhost:8888/forgetPsw',
        data:{
            mail:mail,
            newpassword:password
        }
    }).then(function(response){
        console.log(response.data)
        if(response.data.code==="200"){
            alert(response.data.message)
            //todo:存储token
            window.location.href="http://localhost:3000/sign-in"
        }
        else{
            alert(response.data.message)
        }
      }).catch(function(error){
        console.log(error)
        alert("network error");
      })
}
