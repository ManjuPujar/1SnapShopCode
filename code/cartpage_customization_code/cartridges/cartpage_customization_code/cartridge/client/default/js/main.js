'use strict';

window.jQuery = require('jquery');
window.$ = require('jquery');
var processInclude = require('baseLayer/util');

$(document).ready(function () {
    processInclude(require('baseLayer/components/menu'));
    processInclude(require('baseLayer/components/cookie'));
    processInclude(require('baseLayer/components/consentTracking'));
    processInclude(require('baseLayer/components/footer'));
    processInclude(require('./components/miniCart'));
    processInclude(require('baseLayer/components/collapsibleItem'));
    processInclude(require('baseLayer/components/search'));
    processInclude(require('baseLayer/components/clientSideValidation'));
    processInclude(require('baseLayer/components/countrySelector'));
    processInclude(require('baseLayer/components/toolTip'));
});

require('baseLayer/thirdParty/bootstrap');
require('baseLayer/components/spinner');
