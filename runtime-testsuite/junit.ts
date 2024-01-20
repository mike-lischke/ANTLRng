/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License-MIT.txt in the project root for license information.
 */

type Throwable = Error;

export const assertEquals = <T>(expected: T | null, actual: T | null): void => {
    expect(actual).toEqual(expected);
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
    expect(value).toBe(true);
};

export const assertNull = <T>(value: T | null): void => {
    expect(value).toBeNull();
};

export const assertNotNull = <T>(value: T | null): void => {
    expect(value).not.toBeNull();
};

export const assertArrayEquals = <T>(expected: T[], actual: T[]): void => {
    expect(actual).toEqual(expected);
};
