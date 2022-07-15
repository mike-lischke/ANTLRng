/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { IOException } from "./IOException";

export class UnsupportedEncodingException extends IOException {
    public constructor(name: string) {
        super(`The encoding ${name} is not supported.`);
    }
}
