/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class TokenInfo {
    public readonly type: number;
    public readonly name: string;

    public constructor(type: number, name: string) {
        this.type = type;
        this.name = name;
    }

    public toString(): string {
        return "TokenInfo{" +
            "type=" + this.type +
            ", name='" + this.name + "'" +
            "}";
    }
}
