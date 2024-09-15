/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TestSetInline } from "./TestSetInline.js";
import { ModelElement } from "./ModelElement.js";
import { MatchToken } from "./MatchToken.js";
import { CaptureNextTokenType } from "./CaptureNextTokenType.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Decl } from "./decl/Decl.js";
import { TokenTypeDecl } from "./decl/TokenTypeDecl.js";
import { SetTransition } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export class MatchSet extends MatchToken {
    @ModelElement
    public expr: TestSetInline;
    @ModelElement
    public capture: CaptureNextTokenType;

    public constructor(factory: OutputModelFactory, ast: GrammarAST) {
        super(factory, ast);
        const st = ast.atnState.transition(0) as SetTransition;
        const wordSize = factory.getGenerator().getTarget().getInlineTestSetWordSize();
        this.expr = new TestSetInline(factory, null, st.set, wordSize);
        const d = new TokenTypeDecl(factory, this.expr.varName);
        factory.getCurrentRuleFunction().addLocalDecl(d);
        this.capture = new CaptureNextTokenType(factory, this.expr.varName);
    }
}
