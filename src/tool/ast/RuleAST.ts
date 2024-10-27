/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { ANTLRv4Parser } from "../../generated/ANTLRv4Parser.js";

import { isTokenName } from "../../support/helpers.js";

import type { ActionAST } from "./ActionAST.js";
import type { GrammarAST } from "./GrammarAST.js";
import type { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";

export class RuleAST extends GrammarASTWithOptions {
    public override readonly astType: string = "RuleAST";

    public constructor(nodeOrTokenOrType: RuleAST | Token | number) {
        if (typeof nodeOrTokenOrType === "number") {
            super(nodeOrTokenOrType);
        } else {
            super(nodeOrTokenOrType);
        }
    }

    public isLexerRule(): boolean {
        const name = this.getRuleName();

        return name !== null && isTokenName(name);
    }

    public getRuleName(): string | null {
        const nameNode = this.getChild(0) as GrammarAST | null;

        return nameNode?.getText() ?? null;
    }

    public override dupNode(): RuleAST {
        return new RuleAST(this);
    }

    public getLexerAction(): ActionAST | null {
        const blk = this.getFirstChildWithType(ANTLRv4Parser.LPAREN);
        if (blk?.getChildCount() === 1) {
            const onlyAlt = blk.getChild(0);
            const lastChild = onlyAlt?.getChild(onlyAlt.getChildCount() - 1);
            if (lastChild?.getType() === ANTLRv4Parser.RBRACE) {
                return lastChild as ActionAST;
            }
        }

        return null;
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
