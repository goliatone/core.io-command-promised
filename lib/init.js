'use strict';

const extend = require('gextend');
const defaults = require('./defaults');
const promisedCommand = require('./command-promised');

/**
 * This module enables us to trigger commands and
 * await a response.
 * 
 * @example ```js
 * let response = await context.promisedCommand(eventType, event);
 * ```
 * 
 * @param {Application} context Application core context
 * @param {Object} config Configuration object
 */
module.exports = function(context, config) {

    config = extend({}, defaults, config);

    const logger = context.getLogger(config.moduleid);

    logger.info('Extending core.io with "promisedCommand"');

    context.provide(config.exportName, promisedCommand);
};