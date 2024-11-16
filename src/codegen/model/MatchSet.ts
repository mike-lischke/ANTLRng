/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SetTransition } from "antlr4ng";

import { ModelElement } from "../../misc/ModelElement.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { CaptureNextTokenType } from "./CaptureNextTokenType.js";
import { TokenTypeDecl } from "./decl/TokenTypeDecl.js";
import { MatchToken } from "./MatchToken.js";
import { TestSetInline } from "./TestSetInline.js";

export class MatchSet extends MatchToken {
    @ModelElement
    public expr: TestSetInline;

    @ModelElement
    public capture: CaptureNextTokenType;

    public constructor(factory: OutputModelFactory, ast: GrammarAST) {
        super(factory, ast);
        const st = ast.atnState!.transitions[0] as SetTransition;
        const wordSize = factory.getGenerator()!.getTarget().getInlineTestSetWordSize();
        this.expr = new TestSetInline(factory, undefined, st.set, wordSize);
        const d = new TokenTypeDecl(factory, this.expr.varName);
        factory.getCurrentRuleFunction()?.addLocalDecl(d);
        this.capture = new CaptureNextTokenType(factory, this.expr.varName);
    }
}
