'use strict';
var miniCartbase = require('baseLayer/components/miniCart')
var cart = require('../cart/cart');

module.exports = function(){
    cart();
    miniCartbase;
}