/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export const final = <T extends new (...args: any[]) => object>(target: T): T => {
    return class Final extends target {
        public constructor(...args: any[]) {
            if (new.target !== Final) {
                throw new Error("Cannot inherit from final class");
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            super(...args);
        }
    };
};

export const frozen = (target: Function): void => {
    Object.freeze(target);
    Object.freeze(target.prototype);
};
