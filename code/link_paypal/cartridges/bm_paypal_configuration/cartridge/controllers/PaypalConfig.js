/* global dw request response empty */
const Site = require('dw/system/Site');
const Transaction = require('dw/system/Transaction');
const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
const ISML = require('dw/template/ISML');
const URLUtils = require('dw/web/URLUtils');
const APPLICATION_CONTENT_TYPE_JSON = 'application/json';

/**
 * Gets client id from cache if it exists or creates it, saves to cache and returns from cache
 *
 * @returns {string} with client id
 */
function getClientId() {
    const serviceName = 'int_paypal.http.rest';
    const restService = LocalServiceRegistry.createService(serviceName, {});

    // Returns client ID
    return restService.configuration.credential.user;
}

/**
 * Gets active paypal credit messaging Site Pref metadata
 *
 * @returns {Object} with cart, product, category enabled flag
 * */
function getBannerConfigPages() {
    return ['PP_Show_On_Cart', 'PP_Show_On_PDP', 'PP_Show_On_Category'].reduce(function (customPreferenceValues, name) {
        var value = Site.current.getCustomPreferenceValue(name);
        if (value) {
            customPreferenceValues[name.split('_')[3].toLocaleLowerCase()] = value;
        }

        return customPreferenceValues;
    }, {});
}

/**
 * Check if Paypal button is enabled
 * @param {string} targetPage button location value
 * @return {boolean} disabled or enabled
 */
function isPaypalButtonEnabled(targetPage) {
    var paypalButtonLocation = Site.current.getCustomPreferenceValue('PP_API_Button_Location').getValue();
    var displayPages = paypalButtonLocation.toLowerCase();
    if (displayPages === 'billing' || !targetPage) {
        return false;
    }
    return displayPages.indexOf(targetPage) !== -1;
}

/**
 * Renders configurationBoard template with required configurations and parameters
 * */
function start() {
    var paypalSDK = 'https://www.paypal.com/sdk/js?client-id=' + getClientId() + '&components=buttons,messages';

    ISML.renderTemplate('configurationBoard', {
        paypalSDK: paypalSDK,
        cartButtonEnabled: isPaypalButtonEnabled('cart'),
        minicartButtonEnabled: isPaypalButtonEnabled('minicart'),
        pdpButtonEnabled: isPaypalButtonEnabled('pdp'),
        savedSBLocation: request.httpParameterMap.savedButtonStyle.stringValue,
        savedBSLocation: request.httpParameterMap.savedBannerStyles.stringValue,
        savedSmartStyles: Site.current.getCustomPreferenceValue('PP_API_Smart_Button_Styles'),
        savedBanneConfigs: Site.current.getCustomPreferenceValue('PP_API_Credit_Banner_Styles'),
        bannerConfigs: getBannerConfigPages()
    });
}

/**
 * Save smart Button configuration to Custom Preference value: PP_API_Smart_Button_Styles
 *
 * sucess response: (status code 200) with redirect url
 * error response: (status code 500) with error message
 * */
function saveSmartButton() {
    var params = request.httpParameterMap;
    var data;
    var smartButtonStyle;

    try {
        data = JSON.parse(Site.current.getCustomPreferenceValue('PP_API_Smart_Button_Styles'));
        smartButtonStyle = {
            height: params.heightFormControlRange.intValue,
            color: params.color.value,
            shape: params.shape.value,
            layout: params.layout.value,
            label: params.label.value,
            tagline: params.tagline.booleanValue
        };
        data[params.location.value] = smartButtonStyle;

        Transaction.wrap(function () {
            Site.current.setCustomPreferenceValue('PP_API_Smart_Button_Styles', JSON.stringify(data));
        });
        response.setContentType(APPLICATION_CONTENT_TYPE_JSON);
        response.setStatus(200);
        response.writer.print(JSON.stringify({
            redirectUrl: URLUtils.https('PaypalConfig-Start', 'savedButtonStyle', params.location.value).toString()
        }));
    } catch (error) {
        response.setContentType(APPLICATION_CONTENT_TYPE_JSON);
        response.setStatus(500);
        response.writer.print(error.message);
    }
}

/**
 * Save banner configuration to Custom Preference value: PP_API_Credit_Banner_Styles
 *
 * sucess response: (status code 200) with redirect url
 * error response: (status code 500) with error message
 * */
function saveCreditBanner() {
    var params = request.httpParameterMap;
    var data;
    var bannerStyle;

    try {
        data = JSON.parse(Site.current.getCustomPreferenceValue('PP_API_Credit_Banner_Styles'));
        bannerStyle = {
            styleColor: params.styleColor.value,
            styleRatio: params.styleRatio.value,
            styleLayout: params.layout.value,
            styleTextColor: params.textColor.value,
            styleLogoPosition: params.logoPosition.value,
            styleLogoType: params.logoType.value
        };
        data[params.placement.value] = bannerStyle;

        Transaction.wrap(function () {
            Site.current.setCustomPreferenceValue('PP_API_Credit_Banner_Styles', JSON.stringify(data));
        });

        response.setContentType(APPLICATION_CONTENT_TYPE_JSON);
        response.setStatus(200);
        response.writer.print(JSON.stringify({
            redirectUrl: URLUtils.https('PaypalConfig-Start', 'savedBannerStyles', params.placement.value).toString()
        }));
    } catch (error) {
        response.setContentType(APPLICATION_CONTENT_TYPE_JSON);
        response.setStatus(500);
        response.writer.print(error.message);
    }
}

start.public = true;
saveSmartButton.public = true;
saveCreditBanner.public = true;

exports.Start = start;
exports.SaveSmartButton = saveSmartButton;
exports.SaveCreditBanner = saveCreditBanner;
