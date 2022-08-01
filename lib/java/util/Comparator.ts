/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

export abstract class Comparator<T> {
    public compare?: (o1: T, o2: T) => number;
    public equals?: (obj: unknown) => boolean;
}
