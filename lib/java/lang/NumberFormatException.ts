/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IllegalArgumentException } from "./IllegalArgumentException";

/**
 * @deprecated Don't use this exception. It is never thrown when converting strings to numbers.
 */
export class NumberFormatException extends IllegalArgumentException {
}
