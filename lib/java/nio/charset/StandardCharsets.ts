/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Charset } from "./Charset";

/* eslint-disable @typescript-eslint/naming-convention */

export class StandardCharsets {
    /** ISO Latin Alphabet No. */
    public static readonly ISO_8859_1 = Charset.forName("ISO-8859-1");

    /** Seven-bit ASCII, a.k.a. */
    public static readonly US_ASCII = Charset.forName("US-ASCII");

    /** Sixteen-bit UCS Transformation Format, byte order identified by an optional byte-order mark */
    public static readonly UTF_16 = Charset.forName("UTF-16");

    /** Sixteen-bit UCS Transformation Format, big-endian byte order */
    //public static readonly UTF_16BE = Charset.forName("UTF-16BE");

    /** Sixteen-bit UCS Transformation Format, little-endian byte order */
    public static readonly UTF_16LE = Charset.forName("UTF-16LE");

    /** Eight-bit UCS Transformation Format */
    public static readonly UTF_8 = Charset.forName("UTF-8");

}
