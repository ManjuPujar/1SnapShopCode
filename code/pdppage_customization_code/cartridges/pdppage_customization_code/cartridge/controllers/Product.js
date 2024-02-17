'use strict';

/**
 * @namespace Product
 */

var server = require('server');

var base = module.superModule;
server.extend(base);

var cache = require('*/cartridge/scripts/middleware/cache');
var ProductMgr = require('dw/catalog/ProductMgr');

/**
  * Product-Show : The mentioned middleware step is used to show Similar Products on PDP
  * @name Base/Product-Show
  * @function
  * @memberof Product
  * @param {middleware} - cache.applyPromotionSensitiveCache
  * @param {middleware} - consentTracking.consent
  * @param {querystringparameter} - pid - Product ID
  * @param {category} - non-sensitive
  * @param {renders} - isml
  * @param {serverfunction} - get
  */
server.append('Show', cache.applyPromotionSensitiveCache, function (req, res, next) {
    var pdpCustomizationHelper = require('*/cartridge/scripts/pdpCustomizationHelper');
    var productID = req.querystring.pid;
    var primaryCategoryOfProduct = pdpCustomizationHelper.getPrimaryCategoryOfProduct(productID);
    var onlineProductsInCategory = primaryCategoryOfProduct.getOnlineProducts();
    var isSimilarProducts = true;
    res.setViewData({
        onlineProductsInCategory: onlineProductsInCategory,
        isSimilarProducts: isSimilarProducts
    });
    next();
});

module.exports = server.exports();
