/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { RuntimeException } from "./RuntimeException";

export class NoSuchElementException extends RuntimeException {
    public constructor(message?: string) {
        super(message ?? "No element available");
    }
}
