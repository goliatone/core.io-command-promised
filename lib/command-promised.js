'use strict';

module.exports = function $makePromisedCommandHandler(config = { respondToKey: 'respondTo' }) {

    const respondToKey = config.respondToKey || 'respondTo';

    return function $promisedCommand(type, event = {}) {

        return new Promise((resolve, reject) => {

            /**
             * If our event has a `respondTo` key
             * that is not a function then we store it
             * here.
             */
            let _respondToUnknown = undefined;

            /**
             * The default `respondTo` handler will
             * just set the value to the original one.
             */
            let _originalRespondTo = res => {
                if (_respondToUnknown) res[respondToKey] = _respondToUnknown;
            };

            if (typeof event[respondToKey] === 'string') _respondToUnknown = event[respondToKey];
            else if (typeof event[respondToKey] === 'function') _originalRespondTo = event[respondToKey];

            event[respondToKey] = (response, error) => {
                if (error) return reject(error);
                if (typeof _originalRespondTo === 'function') _originalRespondTo(response);
                resolve(response);
            };

            try {
                this.once(`${type}.error`, error => event[respondToKey](null, error));
                this.emit(type, event);
            } catch (error) {
                event[respondToKey](null, error);
            }
        });
    }
};
