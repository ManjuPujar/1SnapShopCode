'use strict';

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'recommendationProducts', {
        enumerable: true,
        value: apiProduct.recommendations
    });
};