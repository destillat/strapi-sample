'use strict';
/**
 * Override the function generateVerbParameters from the
 * Documentation.js service for the documentation plugin
 *
 * @description: Override generateVerbParameters to avoid issue
 * https://github.com/strapi/strapi/issues/7219 when generating
 * the OpenAPI document
 */

const _ = require('lodash');
const pathToRegexp = require('path-to-regexp');
const parametersOptions = require('strapi-plugin-documentation/services/utils/parametersOptions.json');

module.exports = {
 /**
   * Generate the verb parameters object
   * Refer to https://swagger.io/specification/#pathItemObject
   * @param {Sting} verb
   * @param {String} controllerMethod
   * @param {String} endPoint
   */
  generateVerbParameters: function(verb, controllerMethod, endPoint) {
    const params = pathToRegexp
      .parse(endPoint)
      .filter(token => _.isObject(token))
      .reduce((acc, current) => {
        const param = {
          name: current.name,
          in: 'path',
          description: '',
          deprecated: false,
          required: true,
          schema: { type: 'string' },
        };

        return acc.concat(param);
      }, []);

    if (verb === 'get' && controllerMethod === 'find') {
      // parametersOptions corresponds to this section
      // of the documentation https://strapi.io/documentation/guides/filters.html
      return [...params, ...parametersOptions.slice(0, 3)];
    }

    return params;
    }
}
