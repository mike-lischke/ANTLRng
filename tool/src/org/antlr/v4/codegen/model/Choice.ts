/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TokenInfo } from "./TokenInfo.js";
import { ThrowNoViableAlt } from "./ThrowNoViableAlt.js";
import { TestSetInline } from "./TestSetInline.js";
import { SrcOp } from "./SrcOp.js";
import { RuleElement } from "./RuleElement.js";
import { ModelElement } from "./ModelElement.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { CaptureNextTokenType } from "./CaptureNextTokenType.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Target } from "../Target.js";
import { Decl } from "./decl/Decl.js";
import { TokenTypeDecl } from "./decl/TokenTypeDecl.js";
import { Utils } from "../../misc/Utils.js";
import { IntegerList, IntervalSet } from "antlr4ng";
import { Grammar } from "../../tool/Grammar.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

/**
 * The class hierarchy underneath SrcOp is pretty deep but makes sense that,
 *  for example LL1StarBlock is a kind of LL1Loop which is a kind of Choice.
 *  The problem is it's impossible to figure
 *  out how to construct one of these deeply nested objects because of the
 *  long super constructor call chain. Instead, I decided to in-line all of
 *  this and then look for opportunities to re-factor code into functions.
 *  It makes sense to use a class hierarchy to share data fields, but I don't
 *  think it makes sense to factor code using super constructors because
 *  it has too much work to do.
 */
export abstract class Choice extends RuleElement {
    public decision = -1;
    public label: Decl;

    public alts: CodeBlockForAlt[];

    public preamble = new Array<SrcOp>();

    public constructor(factory: OutputModelFactory,
        blkOrEbnfRootAST: GrammarAST,
        alts: CodeBlockForAlt[]) {
        super(factory, blkOrEbnfRootAST);
        this.alts = alts;
    }

    public addPreambleOp(op: SrcOp): void {
        this.preamble.add(op);
    }

    public getAltLookaheadAsStringLists(altLookSets: IntervalSet[]): TokenInfo[][] {
        const altLook = [];
        const target = $outer.factory.getGenerator().getTarget();
        const grammar = $outer.factory.getGrammar();
        for (const s of altLookSets) {
            const list = s.toIntegerList();
            const info = new Array<TokenInfo>(list.size());
            for (let i = 0; i < info.length; i++) {
                info[i] = new TokenInfo(list.get(i), target.getTokenTypeAsTargetLabel(grammar, list.get(i)));
            }
            altLook.add(info);
        }

        return altLook;
    }

    public addCodeForLookaheadTempVar(look: IntervalSet): TestSetInline {
        const testOps = $outer.factory.getLL1Test(look, $outer.ast);
        const expr = Utils.find(testOps, TestSetInline.class);
        if (expr !== null) {
            const d = new TokenTypeDecl($outer.factory, expr.varName);
            $outer.factory.getCurrentRuleFunction().addLocalDecl(d);
            const nextType = new CaptureNextTokenType($outer.factory, expr.varName);
            this.addPreambleOp(nextType);
        }

        return expr;
    }

    public getThrowNoViableAlt(factory: OutputModelFactory,
        blkAST: GrammarAST,
        expecting: IntervalSet): ThrowNoViableAlt {
        return new ThrowNoViableAlt(factory, blkAST, expecting);
    }
}
