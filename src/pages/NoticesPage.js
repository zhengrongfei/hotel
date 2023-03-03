import { m } from "framer-motion"
import Field from "../components/interfaces/Field";
import { MailIcon, SendIcon, CancelIcon } from "../components/icons";
import Button from "../components/interfaces/Button";
import axios from "axios";
import NoticeItem from "./NoticeItem";
import React, { Component } from "react";
import { getRole } from "../api/getRole";
import storage from "../api/storage";
import NavBar from "../components/layouts/NavBar";

export default class NoticesPage extends Component {


  constructor() {
    super();
    this.state = {
      file: "No Photo Slected",
      imagePreviewUrl: "",
      img: "",
      title: "",
      content: "",
      notice: [],
      deleteData: "",
      role: ""
    }
  }


//选中图片，预览头像
  onImgFileFn = (e) => {
//获取图片文件，图片类型，图片大小
    const file = e.target.files[0]
    console.log(file)
    console.log(file.name)
    this.setState({ file: file.name })
    const url = URL.createObjectURL(file);
    this.setState({ img: url })
  }

  handleSubmit = () => {
    const { title, content } = this.state;
    //发送axios请求,添加通知数据
    axios({
      method: "get",
      url: "http://hn216.api.yesapi.cn/",
      params: {
        s: "App.Table.Create",
        model_name: "yesapi_jeewms_t_s_notice",
        data: { "notice_title": title, "notice_content": content },
        app_key: "ECF1C0604182C0A640E235CD874345D9",
        sign: "A593ABCA1DF94DFE2443565A57D803B1"
      }
    }).then((response) => {
      console.log(response.data)
      if (response.data.ret == 200) {
        alert("send successfully！")
        this.getNotice()
      } else {
        alert(response.data.msg)
      }
    }).catch(function (error) {
      console.log(error)
      alert("error");
    })
    ;
  }
  deleteNotice = () => {
    const { role, JWT } = storage.getAuth()
    console.log("JWT")
    console.log(JWT)
    console.log(role)
//发送axios请求,查询通知数据
    const deleteData = this.state.deleteData
    axios({
      method: "get",
      url: "http://hn216.api.yesapi.cn/",
      params: {
        s: "App.Table.FreeDelete",
        return_data: "0",
        model_name: "yesapi_jeewms_t_s_notice",
        where: [["notice_title", "EQ", deleteData]],
        app_key: "ECF1C0604182C0A640E235CD874345D9",
        sign: "A593ABCA1DF94DFE2443565A57D803B1",
      }
    }).then((response) => {
        this.getNotice()
      }
    ).catch(function (error) {
      console.log(error)
      alert("network error");
    })
    ;
  }


  getNotice = () => {
    //发送axios请求,查询通知数据
    axios({
      method: "get",
      url: "http://hn216.api.yesapi.cn/",
      params: {
        s: "App.Table.FreeQuery",
        return_data: "0",
        model_name: "yesapi_jeewms_t_s_notice",
        app_key: "ECF1C0604182C0A640E235CD874345D9",
        sign: "A593ABCA1DF94DFE2443565A57D803B1",
      }
    }).then((response) => {

        this.setState({
          notice: response.data.data.list
        })
      }
    ).catch(function (error) {
      console.log(error)
      alert("error");
    })
    ;
  }

  componentWillMount() {
    this.getNotice()
    getRole().then(res => {
      const role = res
      this.setState({ role: role })
    });

  }

  componentWillUpdate() {
  }

  render() {
    //验证登录状态，判断role

    const contentstyle = {
      margin: "auto",
      width: "80%"
    }
    const noticestyle = {
      borderBottom: "2px solid #D3D3D3"
    }

    return (
      <section>
        <NavBar />
        <h2>{this.state.role}</h2>
        <h1>Notices</h1>
        <div style={contentstyle}>
          {this.state.notice.map((item, i) =>

            <div key={i}>
              <NoticeItem
                id={i + 1}
                title={item.notice_title}
                content={item.notice_content}
              />
            </div>
          )}


          {this.state.role === "administrator" &&
            (<div style={{ background: "#D3D3D3" }}>
              *NoticeTitle:
              <div>
                <textarea style={{ width: "80%" }} onChange={(Event) => this.setState({ title: Event.target.value })} />
              </div>
              *Content:
              <div>
                <textarea style={{ width: "80%", height: "100px" }}
                          onChange={(Event) => this.setState({ content: Event.target.value })} />
              </div>
              <Button icon={<SendIcon />}
                      iconDescription="Submit"
                      width="100%"
                      alignment="center"
                      onMouseUp={this.handleSubmit}
              />
              *Notice to delte(Title):
              <textarea style={{ width: "80%" }}
                        onChange={(Event) => this.setState({ deleteData: Event.target.value })} />
              <Button icon={<CancelIcon />}
                      iconDescription="Delete"
                      width="100%"
                      alignment="center"
                      onMouseUp={this.deleteNotice}
              />
            </div>)}
        </div>
      </section>
    );
  }
}
