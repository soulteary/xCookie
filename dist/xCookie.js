;(function (root, factory) {
    if (typeof define === 'function') {
        define(['xCookie'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(this, function () {
    'use strict';
//WRAPPER

var xCookie;
xCookie = function () {
  var factory = function (window) {
    var _xCookie = window.xCookie;
    if (typeof window.document !== 'object') {
      throw new Error('xCookie.js requires a `window` with a `document` object');
    }
    var Cookies = function (key, value, options) {
      return arguments.length === 1 ? Cookies.get(key) : Cookies.set(key, value, options);
    };
    Cookies._document = window.document;
    Cookies._cacheKeyPrefix = 'xCookie.';
    Cookies._maxExpireDate = new Date('Fri, 31 Dec 2099 23:59:59 UTC');
    Cookies.defaults = {
      path: '/',
      secure: false
    };
    Cookies.get = function (key) {
      if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
        Cookies._renewCache();
      }
      return Cookies._cache[Cookies._cacheKeyPrefix + key];
    };
    Cookies.set = function (key, value, options) {
      options = Cookies._getExtendedOptions(options);
      options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);
      Cookies._document.cookie = Cookies._generateCookieString(key, value, options);
      return Cookies;
    };
    Cookies.expire = function (key, options) {
      return Cookies.set(key, undefined, options);
    };
    Cookies._getExtendedOptions = function (options) {
      return {
        path: options && options.path || Cookies.defaults.path,
        domain: options && options.domain || Cookies.defaults.domain,
        expires: options && options.expires || Cookies.defaults.expires,
        secure: options && options.secure !== undefined ? options.secure : Cookies.defaults.secure
      };
    };
    Cookies._isValidDate = function (date) {
      return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
    };
    Cookies._getExpiresDate = function (expires, now) {
      now = now || new Date();
      if (typeof expires === 'number') {
        expires = expires === Infinity ? Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
      } else if (typeof expires === 'string') {
        expires = new Date(expires);
      }
      if (expires && !Cookies._isValidDate(expires)) {
        throw new Error('`expires` parameter cannot be converted to a valid Date instance');
      }
      return expires;
    };
    Cookies._generateCookieString = function (key, value, options) {
      key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
      key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
      value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
      options = options || {};
      var cookieString = key + '=' + value;
      cookieString += options.path ? ';path=' + options.path : '';
      cookieString += options.domain ? ';domain=' + options.domain : '';
      cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
      cookieString += options.secure ? ';secure' : '';
      return cookieString;
    };
    Cookies._getCacheFromString = function (documentCookie) {
      var cookieCache = {};
      var cookiesArray = documentCookie ? documentCookie.split('; ') : [];
      for (var i = 0; i < cookiesArray.length; i++) {
        var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);
        if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
          cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
        }
      }
      return cookieCache;
    };
    Cookies._getKeyValuePairFromCookieString = function (cookieString) {
      var separatorIndex = cookieString.indexOf('=');
      separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;
      return {
        key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
        value: decodeURIComponent(cookieString.substr(separatorIndex + 1))
      };
    };
    Cookies._renewCache = function () {
      Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
      Cookies._cachedDocumentCookie = Cookies._document.cookie;
    };
    Cookies._areEnabled = function () {
      var testKey = 'cookies.js';
      var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
      Cookies.expire(testKey);
      return areEnabled;
    };
    Cookies.enabled = Cookies._areEnabled();
    Cookies.noConflict = function () {
      if (window.xCookie === Cookies) {
        window.xCookie = _xCookie;
      }
      return Cookies;
    };
    if (!window.xCookie) {
      window.xCookie = Cookies;
    }
    return Cookies;
  };
  var global = typeof window === 'undefined' ? this : window;
  return typeof global.document === 'object' ? factory(global) : factory;
}();


//WRAPPER
    return xCookie;
}));