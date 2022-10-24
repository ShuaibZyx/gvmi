<template>
  <div class="login_container">
    <div class="login_bg" />
    <!--github小猫咪-->
    <a
      href="https://github.com/ShuaibZyx/gvmi"
      class="github-corner"
      target="_blank"
      title="Follow me on GitHub"
      aria-label="Follow me on GitHub"
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 250 250"
        style="
          fill: black;
          color: #fff;
          position: absolute;
          top: 0;
          border: 0;
          right: 0;
        "
        aria-hidden="true"
      >
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px"
          class="octo-arm"
        />
        <path
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor"
          class="octo-body"
        />
      </svg>
    </a>

    <!-- 图形验证码 -->
    <Vcode
      :show="isShowValid"
      @success="success"
      @close="close"
      :successText="validSuccessText"
    />

    <!-- 登录注册表单盒子 -->
    <div class="login_box" ref="loginBoxRef">
      <div class="cabbage">
        <img src="../assets/imgs/cabbage.jpg" width="100%" />
      </div>
      <div class="form">
        <div class="title">
          <span>{{ signName }}</span>
        </div>
        <el-tabs v-model="signName">
          <!-- 登录 -->
          <el-tab-pane label="登录" name="Login">
            <el-form
              status-icon
              :model="loginForm"
              :rules="loginFormRules"
              ref="loginFormRef"
              :hide-required-asterisk="true"
            >
              <el-form-item prop="account">
                <el-input
                  v-model="loginForm.account"
                  autocomplete="off"
                  prefix-icon="el-icon-user"
                  size="medium"
                  clearable
                  @focus.once="showClearBox"
                  placeholder="请输入您的电话号码"
                  :maxlength="11"
                  @keyup.enter.native="loginByPassword"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  prefix-icon="el-icon-lock"
                  autocomplete="off"
                  clearable
                  validate-event
                  size="medium"
                  placeholder="请输入您的密码"
                  :maxlength="15"
                  :show-password="true"
                  @focus.once="showClearBox"
                  @keyup.enter.native="loginByPassword"
                />
              </el-form-item>
              <el-form-item>
                <div class="login-btn">
                  <el-button
                    type="primary"
                    size="medium"
                    round
                    plain
                    icon="el-icon-check"
                    style="width: 95%"
                    @click="loginByPassword"
                    >登录</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 注册 -->
          <el-tab-pane label="注册" name="Regist">
            <el-form
              status-icon
              :model="registerForm"
              :rules="registerFormRules"
              ref="registFormRef"
              :hide-required-asterisk="true"
            >
              <el-form-item prop="account">
                <el-input
                  v-model="registerForm.account"
                  autocomplete="off"
                  prefix-icon="el-icon-user"
                  size="medium"
                  clearable
                  :maxlength="11"
                  @focus.once="showClearBox"
                  @keyup.enter.native="isShowValid = true"
                  placeholder="请输入您的电话号码"
                />
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  prefix-icon="el-icon-lock"
                  autocomplete="off"
                  clearable
                  validate-event
                  size="medium"
                  placeholder="请输入您的密码"
                  :maxlength="15"
                  :show-password="true"
                  @keyup.enter.native="isShowValid = true"
                  @focus.once="showClearBox"
                />
              </el-form-item>

              <el-form-item>
                <div class="login-btn">
                  <el-button
                    type="primary"
                    size="medium"
                    round
                    icon="el-icon-check"
                    style="width: 95%"
                    plain
                    @click="isShowValid = true"
                    >注册</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="btns" v-if="signName === 'Login'">
        <el-link @click="signName = 'Regist'">还未注册?</el-link>
        <span>/</span>
        <el-link style="margin-right: 10%">忘记密码?</el-link>
        <el-checkbox v-model="autoLogin">7天免登录</el-checkbox>
      </div>
      <div class="context">
        <div class="logoImg">
          <img src="../assets/imgs/giveme.png" width="100%" />
        </div>
        <div class="right">
          <span>本网站仅供学习交流使用</span>
          <span>如有疑问请联系: 2631667689(QQ)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vcode from "vue-puzzle-vcode";
import CryptoJS from "../assets/js/crypto";
import { Base64 } from "js-base64";
export default {
  name: "Login",
  components: {
    Vcode,
  },
  data() {
    return {
      //登录表单
      loginForm: {
        account: "",
        password: "",
      },
      //登陆验证规则
      loginFormRules: {
        // 验证用户名是否合法
        account: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
            message: "手机号码格式不符合",
            trigger: "blur",
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 9,
            max: 15,
            message: "长度在 9 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      //注册所用form表单
      registerForm: {
        account: "",
        password: "",
      },
      //注册时所用的验证规则
      registerFormRules: {
        account: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
            message: "手机号码格式不符合",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 9,
            max: 15,
            message: "长度在 9 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      //标签名
      signName: "Login",
      //7天免登录
      autoLogin: true,
      // 图形验证码模态框是否出现
      isShowValid: false,
      //滑块验证成功时显示的文字
      validSuccessText: "你太棒了",
    };
  },
  methods: {
    //登录所用方法
    loginByPassword() {
      //首先进行数据预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        //验证不通过直接返回
        if (!valid) return;
        //登录权限有效时间
        var expiresIn = this.autoLogin ? 7 * 24 * 60 * 60 : 4 * 60 * 60;
        //对密码进行加密
        const password = Base64.encode(
          CryptoJS.encrypt(this.loginForm.password)
        );
        //发起登录请求
        const { data: loginRes } = await this.$http.post("user/login", {
          account: this.loginForm.account,
          password,
          expiresIn,
        });
        //将返回的token存入session以及cookie
        const token = loginRes.data;
        if (this.autoLogin) this.$cookies.set("token", token, "7d");
        window.sessionStorage.setItem("token", JSON.stringify(token));
        if (loginRes.code === 200) {
          //获取登录的用户的Id
          const { data: userIdRes } = await this.$http.get("user/userId");
          //将id存入session并跳转路由
          window.sessionStorage.setItem("userId", userIdRes.data);
          this.$router.push("home");
          //提示用户登录状态
          this.$message({
            message: "登录成功",
            center: true,
            type: "success",
            duration: 500,
          });
          return;
        }
        this.$message({
          message: loginRes.msg,
          center: true,
          type: "warning",
        });
      });
    },

    //注册功能
    regist() {
      //首先进行数据预验证
      this.$refs.registFormRef.validate(async (valid) => {
        //验证不通过直接返回
        if (!valid) return;
        //对用户密码进行加密
        const password = Base64.encode(
          CryptoJS.encrypt(this.registerForm.password)
        );
        //发起请求
        const { data: registRes } = await this.$http.post("user/regist", {
          account: this.registerForm.account,
          password,
        });
        //注册成功
        if (registRes.code === 200) {
          //注册成功后为用户填入登陆表单数据
          this.loginForm = this.registerForm;
          this.signName = "Regist";
        }
        this.$message({
          message: `${
            registRes.code === 200 ? "注册成功 请登录" : `${registRes.msg}`
          }`,
          type: `${registRes.code === 200 ? "success" : "error"}`,
          center: true,
        });
      });
    },

    // 用户验证码通过了验证
    success(time) {
      this.validSuccessText = `只用了${parseInt(time)}秒 你太快了`;
      this.regist();
      // 通过验证后，需要手动隐藏模态框
      this.isShowValid = false;
    },

    // 用户点击遮罩层，应该关闭模态框
    close() {
      this.isShowValid = false;
    },

    //点击登陆页面的box时将透明度复原
    showClearBox() {
      this.$refs.loginBoxRef.style.opacity = 0.95;
    },
  },
  mounted() {},
};
</script>
