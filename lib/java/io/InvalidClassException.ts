/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { ObjectStreamException } from "./ObjectStreamException";

export class InvalidClassException extends ObjectStreamException {
    public constructor(className: string, reason: string) {
        super(`Invalid class "${className}: ${reason}"`);
    }
}
