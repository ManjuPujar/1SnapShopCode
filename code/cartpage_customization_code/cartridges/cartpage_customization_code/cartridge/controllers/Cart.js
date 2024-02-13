'use strict';

var server = require('server');

module.superModule;

/**
 * Cart-Show : Appending controller to undo removed product from cart
 * @name Base/Cart-Show
 * @function
 * @memberof Cart
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.append('AddProduct', function(req, res, next){
    var viewData = res.getViewData();
    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');
    var undoremovedproductlineitem = renderTemplateHelper.getRenderedHtml(
        viewData.cart, 'cart/allProductLineItems.isml');
    res.setViewData({
        undoremovedproductlineitem: undoremovedproductlineitem
    });
    next();
});

module.exports = server.exports();