/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { endianness } from "os";
import { MurmurHash } from "../../MurmurHash";

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

    public hashCode(): number {
        let hash = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.bigEndian ? 1 : 0);
        hash = MurmurHash.finish(hash, 1);

        return hash;
    }
}
