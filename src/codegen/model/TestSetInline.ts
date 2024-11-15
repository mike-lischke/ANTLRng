/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "antlr4ng";

import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { SrcOp } from "./SrcOp.js";
import { TokenInfo } from "./TokenInfo.js";

export class Bitset {
    public readonly shift: number;
    private readonly tokens: TokenInfo[] = [];
    private calculated = 0n;

    public constructor(shift: number) {
        this.shift = shift;
    }

    public addToken(type: number, name: string): void {
        this.tokens.push(new TokenInfo(type, name));
        this.calculated |= 1n << BigInt(type - this.shift);
    }

    public getTokens(): TokenInfo[] {
        return this.tokens;
    }

    public getCalculated(): bigint {
        return this.calculated;
    }
};

export class TestSetInline extends SrcOp {

    public readonly bitsetWordSize: number;
    public readonly varName: string;
    public readonly bitsets: Bitset[];

    public constructor(factory: OutputModelFactory, ast: GrammarAST | undefined, set: IntervalSet, wordSize: number) {
        super(factory, ast);
        this.bitsetWordSize = wordSize;
        const withZeroOffset = TestSetInline.createBitsets(factory, set, wordSize, true);
        const withoutZeroOffset = TestSetInline.createBitsets(factory, set, wordSize, false);
        this.bitsets = withZeroOffset.length <= withoutZeroOffset.length ? withZeroOffset : withoutZeroOffset;
        this.varName = "_la";
    }

    private static createBitsets(factory: OutputModelFactory, set: IntervalSet, wordSize: number,
        useZeroOffset: boolean): Bitset[] {
        const bitsetList: Bitset[] = [];
        const target = factory.getGenerator()!.getTarget();
        let current: Bitset | undefined;
        for (const ttype of set.toArray()) {
            if (!current || ttype > (current.shift + wordSize - 1)) {
                let shift: number;
                if (useZeroOffset && ttype >= 0 && ttype < wordSize - 1) {
                    shift = 0;
                } else {
                    shift = ttype;
                }
                current = new Bitset(shift);
                bitsetList.push(current);
            }

            current.addToken(ttype, target.getTokenTypeAsTargetLabel(factory.getGrammar()!, ttype));
        }

        return bitsetList;
    }
}
