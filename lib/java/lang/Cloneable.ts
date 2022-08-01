/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Cloneable<T> {
    clone(): T;
}
