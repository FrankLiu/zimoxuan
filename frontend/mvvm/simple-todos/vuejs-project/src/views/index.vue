<template>
  <div id="home">
    <img src="../assets/logo.png">
    <hello></hello>
    <!-- <data-table></data-table> -->
  </div>
</template>


<script>
import Hello from '../components/Hello'
import DataTable from '../components/DataTable'

export default {
  name: 'home',
  components: {
    Hello,
    DataTable
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
