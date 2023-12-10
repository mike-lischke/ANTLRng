/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java } from "jree";

type Throwable = java.lang.Throwable;

export const assertEquals = <T>(expected: T | null, actual: T | null): void => {
    if (expected !== actual) {
        throw new Error(`Expected ${expected} but got ${actual}`);
    }
};

export const assertThrows = <T extends Throwable>(expected: new (message: string) => T, func: () => void): T => {
    try {
        func();
    } catch (e) {
        if (e instanceof expected) {
            return e;
        }
    }

    throw new Error(`Expected ${expected.name} but no exception was thrown.`);
};

export const assertTrue = (value: boolean): void => {
    if (!value) {
        throw new Error(`Expected true but got false`);
    }
};
