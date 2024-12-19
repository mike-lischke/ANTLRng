/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
 * Format a map like Java does it.
 *
 * @param map The map to convert.
 *
 * @returns The string representation of the map.
 */
export const convertMapToString = (map: Map<unknown, unknown>): string => {
    const entries: string[] = [];
    map.forEach((value, key) => {
        entries.push(`${key}=${value}`);
    });

    return `{${entries.join(", ")}}`;
};

/**
 * Format an array like Java does it.
 *
 * @param a The array to convert.
 * @param separator The separator to use between elements.
 *
 * @returns The string representation of the array.
 */
export const convertArrayToString = <T>(a: T[], separator = ", "): string => {
    return "[" + a.join(separator) + "]";
};
