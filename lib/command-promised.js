'use strict';

function $promisedCommand(type, event) {
    return new Promise((resolve, reject) => {

        let _rp = _ => {};

        if (event.respondTo) _rp = event.respondTo;

        event.respondTo = (response, error) => {
            if (error) return reject(error);
            resolve(response);
            _rp(response);
        };

        try {
            this.once(`${type}.error`, error => event.respondTo(null, error));

            this.emit(type, event);
        } catch (error) {
            event.respondTo(null, error);
        }
    });
}

module.exports = $promisedCommand;