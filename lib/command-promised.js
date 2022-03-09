'use strict';
const { CommandPromisedError } = require('./errors');

module.exports = function $makePromisedCommandHandler(config = { respondToKey: 'respondTo' }) {

    const respondToKey = config.respondToKey || 'respondTo';

    return function $promisedCommand(type, event = {}, options = {}) {

        return new Promise((resolve, reject) => {

            /**
             * If our event has a `respondTo` key
             * that is not a function then we store it
             * here.
             */
            let _respondToUnknown = undefined;

            /**
             * Hold the optional timeout id so we
             * can clear it.
             */
            let _timeoutId = undefined;

            /**
             * The default `respondTo` handler will
             * just set the value to the original one.
             */
            let _originalRespondTo = res => {
                if (_respondToUnknown) res[respondToKey] = _respondToUnknown;
            };

            if (typeof event[respondToKey] === 'string') _respondToUnknown = event[respondToKey];
            else if (typeof event[respondToKey] === 'function') _originalRespondTo = event[respondToKey];

            //BUG: This can cause a RangeError: Maximum call stack size exceeded
            //     if we call a promised command from inside a command
            event[respondToKey] = (response, error) => {

                this.$clearTimeout(_timeoutId);

                if (error) return reject(error);
                if (typeof _originalRespondTo === 'function') _originalRespondTo(response);
                resolve(response);
            };

            try {
                this.once(`${type}.error`, error => event[respondToKey](null, error));

                if (options.timeout) {
                    _timeoutId = this.$setTimeout(_ => {
                        reject(new CommandPromisedError('Command Timeout', 408));
                    }, options.timeout);
                }

                this.emit(type, event);
            } catch (error) {
                event[respondToKey](null, error);
            }
        });
    }
};
