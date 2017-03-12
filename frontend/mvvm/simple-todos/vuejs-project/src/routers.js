// require.ensure 是 Webpack 的特殊语法，用来设置 code-split point
const Home = resolve => {
  require.ensure(['./views/index.vue'], () => {
    resolve(require('./views/index.vue'))
  })
}

const Foo = { template: '<div>bar</div>' }
const User = resolve => {
  require.ensure(['./components/User.vue'], () => {
    resolve(require('./components/User.vue'))
  })
}

const routers = [{
  path: '/',
  name: 'home',
  component: Home
}, {
  path: '/user/:id',
  component: User
}, {
  path: '/about_us',
  name: 'about_us',
  component (resolve) {
    require.ensure(['./views/about_us.vue'], () => {
      resolve(require('./views/about_us.vue'))
    })
  }
}, {
  path: '/login',
  name: 'login',
  component (resolve) {
    require.ensure(['./views/login.vue'], () => {
      resolve(require('./views/login.vue'))
    })
  }
}, {
  path: '/foo',
  component: Foo
}, {
  path: '*',
  component: Home
}]

export default routers
