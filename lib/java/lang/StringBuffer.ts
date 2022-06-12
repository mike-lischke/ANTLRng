/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { StringBuilder } from ".";

// StringBuffer is the same as StringBuilder, but thread-safe (in Java). Thread safety is not required here, though.
export class StringBuffer extends StringBuilder {}
