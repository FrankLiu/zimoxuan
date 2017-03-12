<template>
	<div class="page">
		<mt-header title="账户登录">
		  <router-link to="/quote_list" slot="left">
			<mt-button icon="back">返回</mt-button>
		  </router-link>
		  <mt-button icon="more" slot="right">注册</mt-button>
		</mt-header>
		<div class="page__bd astc-register">
		  <div class="weui-cells weui-cells_form" id="sign">
			<mt-cell>
				<mt-field placeholder="请输入您的手机号码" type="tel"></mt-field>
				<img slot="icon" src="../assets/astc/login_user.png" width="24" height="24">
			</mt-cell>
			  <div class="weui-cell">
				<div class="weui-cell__hd">
				  <img src="/images/astc/login_password.png" class="astc_icon"/>
				</div>
				<div class="weui-cell__bd weui-search-bar__box astc-no-padding">
				  <mt-field label="密码" placeholder="请输入密码" type="password"></mt-field>
				  <a href="#" class="weui-icon-clear astc_inputClear"></a>
				</div>
			  </div>
		  </div>

		  <div class="weui-cell"></div>

		  <div class="weui_btn_area page__bd_spacing">
			  <a class="weui-btn astc_btn_primary" href="javascript:" id="loginNowBtn">立即登录</a>
		  </div>
		  <div class="weui-cell astc-register-tips">
			<div class="weui-cell__hd">
			  <div class="weui-cells__tips">还没账号?<a href="/select_identity" class="emphasis">快速注册</a></div>
			</div>
			<div class="weui-cell__bd">&nbsp;&nbsp;</div>
			<div class="weui-cell__ft">
			  <a href="/forget_password" class="weui-cells__tips">忘记密码?</a>
			</div>
		  </div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import { Field } from 'mint-ui'

Vue.component(Field.name, Field)

export default {
  name: 'login',
  data () {
    return {}
  },
  components: {
    Field
  }
}

</script>