/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

export const convertMapToString = (map: Map<unknown, unknown>): string => {
    const entries: string[] = [];
    map.forEach((value, key) => {
        entries.push(`${key}=${value}`);
    });

    return `{${entries.join(", ")}}`;
};
