import 'weui';
import $ from 'jquery';
import weui from 'weui.js';
import attachFastClick from 'fastclick';
import Router from './lib/router/router';
import API from './lib/api/api';
import dataManager from './lib/dataManager/dataManager';
import * as util from './lib/util/util';
import todo from './todo/todo';
import detail from './detail/detail';
import quote_list from './astc/quote/quote_list'
attachFastClick.attach(document.body);

var loading = weui.loading('加载中...');
API.read().then((data) => {
    loading.hide();

    for (let key in data) {
        dataManager.setData(key, data[key]);
    }

    const router = new Router();
    router
      .push(todo).push(detail)
      .push(quote_list)
      .setDefault('/').init();
});
