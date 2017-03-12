<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <mt-cell title="我" value="基本资料" is-link></mt-cell>
    <mt-cell title="我的人脉" value="好友 圈子" to="/foo" is-link></mt-cell>
    <mt-cell title="我的消息" value="私信 系统消息" to="/foo" is-link></mt-cell>
    <mt-cell title="我的发布" value="供应 求购发布" to="/foo" is-link></mt-cell>
    <div class="split-row"></div>
    <mt-cell title="关于我们" value="系统简介" to="/about_us" is-link></mt-cell>
  </div>
</template>

<script>
import {Cell} from 'mint-ui'

export default {
  name: 'user',
  data () {
    return {}
  },
  components: {
    Cell
  }
}
</script>
