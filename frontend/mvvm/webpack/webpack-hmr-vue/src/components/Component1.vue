<template>
<div id="component1">
	{{msg}}
</div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'Component1',
  data () {
    return {
      msg: 'Welcome to Vue.js App'
    }
  }
}
</script>
