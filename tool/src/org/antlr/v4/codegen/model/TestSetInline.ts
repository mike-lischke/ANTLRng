/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TokenInfo } from "./TokenInfo.js";
import { SrcOp } from "./SrcOp.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Target } from "../Target.js";
import { IntervalSet } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export class TestSetInline extends SrcOp {

    public static readonly Bitset = class Bitset {
        public readonly shift: number;
        private readonly tokens = [];
        private calculated: bigint;

        public constructor(shift: number) {
            this.shift = shift;
        }

        public addToken(type: number, name: string): void {
            this.tokens.add(new TokenInfo(type, name));
            this.calculated |= 1n << (type - this.shift);
        }

        public getTokens(): TokenInfo[] {
            return this.tokens;
        }

        public getCalculated(): bigint {
            return this.calculated;
        }
    };

    public readonly bitsetWordSize: number;
    public readonly varName: string;
    public readonly bitsets: TestSetInline.Bitset[];

    public constructor(factory: OutputModelFactory, ast: GrammarAST, set: IntervalSet, wordSize: number) {
        super(factory, ast);
        this.bitsetWordSize = wordSize;
        const withZeroOffset = TestSetInline.createBitsets(factory, set, wordSize, true);
        const withoutZeroOffset = TestSetInline.createBitsets(factory, set, wordSize, false);
        this.bitsets = withZeroOffset.length <= withoutZeroOffset.length ? withZeroOffset : withoutZeroOffset;
        this.varName = "_la";
    }

    private static createBitsets(factory: OutputModelFactory,
        set: IntervalSet,
        wordSize: number,
        useZeroOffset: boolean): TestSetInline.Bitset[] {
        const bitsetList = [];
        const target = factory.getGenerator().getTarget();
        let current = null;
        for (const ttype of set.toArray()) {
            if (current === null || ttype > (current.shift + wordSize - 1)) {
                let shift: number;
                if (useZeroOffset && ttype >= 0 && ttype < wordSize - 1) {
                    shift = 0;
                }
                else {
                    shift = ttype;
                }
                current = new TestSetInline.Bitset(shift);
                bitsetList.add(current);
            }

            current.addToken(ttype, target.getTokenTypeAsTargetLabel(factory.getGrammar(), ttype));
        }

        return bitsetList.toArray(new Array<TestSetInline.Bitset>(0));
    }
}

export namespace TestSetInline {
    export type Bitset = InstanceType<typeof TestSetInline.Bitset>;
}
