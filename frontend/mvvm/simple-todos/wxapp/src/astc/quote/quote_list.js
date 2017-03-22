import 'weui';
import $ from 'jquery';
import weui from 'weui.js';
import uuid from 'node-uuid';
import template from 'art-template/dist/template-debug';
import API from '../../lib/api/api';
import dataManager from '../../lib/dataManager/dataManager';
import * as util from '../../lib/util/util';
import tpl from 'raw!./quote_list.html';

export default {
    url: '/quote_list',
    render: function () {
        const todos = dataManager.getData(dataManager.TODOS, []);
        return template.compile(tpl)({
            todos: todos,
            DEBUG: DEBUG
        });
    },
    bind: function () {

    }
};
