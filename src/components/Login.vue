<template>
    <div class="login box">
        <img src="../../static/image/01.jpg" alt="">
        <div class="login">
            <div class="login-title">
                <img src="../../static/image/logo.jpg" alt="">
                <p>zfy给你最优质的学习体验!</p>
            </div>
            <div class="login_box">
                <div class="title">
                    <span @click="change_show">密码登录</span>
                    <span @click="change_show1">短信登录</span>
                </div>
                <div class="inp" v-show="show">
                    <input type="text" placeholder="用户名 / 手机号码 / 邮箱" class="user" v-model="username">
                    <input type="password" name="" class="pwd" placeholder="密码" v-model="password">
                    <div id="geetest1"></div>
                    <div class="rember">
                        <p>
                            <input type="checkbox" class="no" v-model="remember_me"/>
                            <span>记住密码</span>
                        </p>
                        <p>忘记密码</p>
                    </div>
                    <button class="login_btn btn btn-primary" @click="get_captcha">登录</button>
                    <p class="go_login">没有账号
                        <router-link to="/register">立即注册</router-link>
                    </p>
                </div>
                <div class="inp" v-show="show1">
                    <input type="text" placeholder="手机号码" class="user" v-model="phone" @blur="check_phone">
                    <input type="text" class="pwd" placeholder="短信验证码" v-model="code">
                    <button id="get_code" class="btn btn-primary" @click="get_code">{{ btntxt }}</button>
                    <button @click="phone_login">登录</button>
                    <span class="go_login">没有账号
                    <router-link to="/register">立即注册</router-link>
                </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import settings from "../settings";

export default {
    name: "Login",
    data() {
        return {
            username: "",
            password: "",
            phone:"",
            code:"",
            btntxt: "获取验证码",
            time: 60,
            remember_me: false,
            disabled: false,
            show: true,
            show1: false,
        }
    },
    methods: {
        // 获取验证码的方法
        get_captcha() {
            // 验证开始需要向网站主后台获取id，challenge，success（是否启用failback）
            this.$axios({
                url: this.$settings.HOST + "user/captcha/", // 加随机数防止缓存
                method: "get",
                params: {
                    username: this.username,
                },
            }).then(res => {
                let data = JSON.parse(res.data);
                console.log(data)
                // 使用initGeetest接口
                // 参数1：配置参数
                // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
                initGeetest({
                    gt: data.gt,
                    challenge: data.challenge,
                    product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                    offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                    new_captcha: data.new_captcha
                }, this.handlerPopup);
            }).catch(error => {
                // console.log(error);
                this.$message.error(error.message)
            });
        },

        // 请求验证码的回调函数  完成验证码的验证
        handlerPopup(captchaObj) {
            // 回调函数中  this的指向会被改变
            let self = this;
            // 在验证码被用户成功滑动后开始执行
            captchaObj.onSuccess(function () {
                let validate = captchaObj.getValidate();
                self.$axios({
                    url: self.$settings.HOST + "user/captcha/",
                    method: "post",
                    data: {
                        geetest_challenge: validate.geetest_challenge,
                        geetest_validate: validate.geetest_validate,
                        geetest_seccode: validate.geetest_seccode
                    },
                }).then(res => {
                    console.log(res);
                    // r如果滑块验证码验证合格则完成登录
                    self.user_login();
                }).catch(error => {
                    console.log(error);
                });
            });
            //  将验证码加到id为captcha的元素里
            captchaObj.appendTo("#geetest1");
        },

        // 用户登陆的方法
        user_login() {
            // 判断输入框的值是否合法
            this.$axios({
                url: this.$settings.HOST + "user/login/",
                method: "post",
                data: {
                    username: this.username,
                    password: this.password,
                }
            }).then(res => {
                // 登陆时来判断用户是否需要记住密码 remember_me的值为True代表需要记住密码，
                if (this.remember_me) {
                    // 代表用户要记住密码
                    localStorage.token = res.data.token;
                    localStorage.user = res.data.user;
                    localStorage.user_id = res.data.user_id;
                }
                if (res.data) {
                    // 将token信息保存
                    sessionStorage.token = res.data.token;
                    sessionStorage.user_id = res.data.user_id;
                    sessionStorage.user = res.data.user;
                    this.$message({
                        message: "恭喜你，登陆成功",
                        type: "success",
                        duration: 1000,
                    })
                }
                // 登陆成功后返回到首页
                this.$router.push("/")
            }).catch(error => {
                console.log(error);
            })
        },
        // 切换登陆模式
        change_show(){
            this.show = true;
            this.show1 = false;
        },
        change_show1(){
            this.show1 = true;
            this.show = false;
        },
        // 短信登陆
        phone_login(){
            this.$axios({
                url: this.$settings.HOST +"user/phone_login/",
                method: "get",
                params:{
                    phone: this.phone,
                    code: this.code,
                }
            }).then(res=>{
                // 保存用户登陆状态,将token信息保存
                sessionStorage.token = res.data.token;
                sessionStorage.user = res.data.user;
                sessionStorage.user_id = res.data.user_id;
                this.$message.success("登陆成功,即将跳转到首页~")
                // 跳转到首页
                this.$router.push("/")
            }).catch(error=>{
                console.log(error)
                this.$message.error(error.response.data)
            })
        },
        // 检查手机号是否被注册
        check_phone() {
            this.$axios({
                url: this.$settings.HOST + "user/phone1/",
                method: "get",
                params: {
                    phone: this.phone,
                }
            }).catch(error => {
                this.$message.error(error.response.data)
            })
        },
        // 根据手机号获取验证码
        get_code() {
            if (this.phone){
                this.$axios({
                    url: this.$settings.HOST + "user/send/",
                    method: "get",
                    params: {
                        phone: this.phone,
                    }
                }).then(res => {
                    this.time = 60;
                    this.timer();
                }).catch(error => {
                    console.log(error)
                })
            }
            else {
                this.$message.error("输入有误")
            }
        },
        //发送手机验证码倒计时
        timer() {
            if (this.time > 0) {
                this.disabled = true;
                this.time--;
                this.btntxt = this.time + "秒";
                setTimeout(this.timer, 1000);
            } else {
                this.time = 0;
                this.btntxt = "发送验证码";
                this.disabled = false;
            }
        },


    },
}
</script>

<style scoped>
.box {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.box img {
    width: 100%;
    min-height: 100%;
}

.box .login {
    position: absolute;
    width: 500px;
    height: 400px;
    top: 0;
    left: 0;
    margin: auto;
    right: 0;
    bottom: 0;
    top: -338px;
}

.login .login-title {
    width: 100%;
    text-align: center;
}

.login-title img {
    width: 190px;
    height: auto;
}

.login-title p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #fff;
    letter-spacing: .29px;
    padding-top: 10px;
    padding-bottom: 50px;
}

.login_box {
    width: 400px;
    height: auto;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
    border-radius: 4px;
    margin: 0 auto;
    padding-bottom: 40px;
}

.login_box .title {
    font-size: 20px;
    color: #9b9b9b;
    letter-spacing: .32px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-around;
    padding: 50px 60px 0 60px;
    margin-bottom: 20px;
    cursor: pointer;
}

.login_box .title span:nth-of-type(1) {
    color: #4a4a4a;
    border-bottom: 2px solid #84cc39;
}

.inp {
    width: 350px;
    margin: 0 auto;
}

.inp input {
    border: 0;
    outline: 0;
    width: 100%;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
}

.inp input.user {
    margin-bottom: 16px;
}

.inp .rember {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-top: 10px;
}

.inp .rember p:first-of-type {
    font-size: 12px;
    color: #4a4a4a;
    letter-spacing: .19px;
    margin-left: 22px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    /*position: relative;*/
}

.inp .rember p:nth-of-type(2) {
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .19px;
    cursor: pointer;
}

.inp .rember input {
    outline: 0;
    width: 30px;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
}

.inp .rember p span {
    display: inline-block;
    font-size: 12px;
    width: 100px;
    /*position: absolute;*/
    /*left: 20px;*/

}

#geetest {
    margin-top: 20px;
}

.login_btn {
    width: 100%;
    height: 45px;
    background: #84cc39;
    border-radius: 5px;
    font-size: 16px;
    color: #fff;
    letter-spacing: .26px;
    margin-top: 30px;
}

.inp .go_login {
    text-align: center;
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .26px;
    padding-top: 20px;
}

.inp .go_login span {
    color: #84cc39;
    cursor: pointer;
}
</style>
