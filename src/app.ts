declare function require(string): string;
///<reference path="../definitions/firebase.d.ts" />

require('../style/main.less');

import ProductViewController = require('./components/product/productViewController');
import ListsController = require('./components/lists/listsController');

var productViewController = new ListsController();
