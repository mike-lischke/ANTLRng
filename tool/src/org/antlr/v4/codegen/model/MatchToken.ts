/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuleElement } from "./RuleElement.js";
import { LabeledOp } from "./LabeledOp.js";
import { CodeGenerator } from "../CodeGenerator.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Target } from "../Target.js";
import { Decl } from "./decl/Decl.js";
import { Grammar } from "../../tool/Grammar.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { TerminalAST } from "../../tool/ast/TerminalAST.js";

export class MatchToken extends RuleElement implements LabeledOp {
    public readonly name: string;
    public readonly escapedName: string;
    public readonly ttype: number;
    public readonly labels = new Array<Decl>();

    public constructor(factory: OutputModelFactory, ast: TerminalAST);

    public constructor(factory: OutputModelFactory, ast: GrammarAST);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 2: {
                const [factory, ast] = args as [OutputModelFactory, TerminalAST];

                super(factory, ast);
                const g = factory.getGrammar();
                const gen = factory.getGenerator();
                this.ttype = g.getTokenType(ast.getText());
                const target = gen.getTarget();
                this.name = target.getTokenTypeAsTargetLabel(g, this.ttype);
                this.escapedName = target.escapeIfNeeded(this.name);

                break;
            }

            case 2: {
                const [factory, ast] = args as [OutputModelFactory, GrammarAST];

                super(factory, ast);
                this.ttype = 0;
                this.name = null;
                this.escapedName = null;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    @Override
    public getLabels(): Decl[] { return this.labels; }
}
