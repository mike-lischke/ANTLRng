/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { endianness } from "os";

export class ByteOrder {
    public static readonly BIG_ENDIAN = new ByteOrder(true);
    public static readonly LITTLE_ENDIAN = new ByteOrder(false);

    private bigEndian: boolean;

    private constructor(flag: boolean) {
        this.bigEndian = flag;
    }

    public static get byteOrder(): ByteOrder {
        return new ByteOrder(endianness() === "BE");
    }

    public toString(): string {
        if (this.bigEndian) {
            return "BIG_ENDIAN";
        }

        return "LITTLE_ENDIAN";
    }
}
