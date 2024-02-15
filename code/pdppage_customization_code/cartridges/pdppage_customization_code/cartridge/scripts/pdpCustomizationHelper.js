'use scripts';

/**
 * To get PrimaryCategory of the specific product
 * @param {string} pid - product ID
 * @returns {Object} primary Category
 */
var getPrimaryCategoryOfProduct = function(pid) {
    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
    var ProductMgr = require('dw/catalog/ProductMgr');
    var apiProduct = ProductMgr.getProduct(pid);
    var category = apiProduct.getPrimaryCategory();
    var productType = productHelper.getProductType(apiProduct);
    if(!category && (productType === 'variant' || productType === 'variationGroup')){
        category = apiProduct.getMasterProduct().getPrimaryCategory();
    };
    return category;
}

module.exports = {
    getPrimaryCategoryOfProduct: getPrimaryCategoryOfProduct
}