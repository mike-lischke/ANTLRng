/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuleFunction } from "./RuleFunction.js";
import { RuleElement } from "./RuleElement.js";
import { ModelElement } from "./ModelElement.js";
import { Action } from "./Action.js";
import { ActionTranslator } from "../ActionTranslator.js";
import { CodeGenerator } from "../CodeGenerator.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { ActionChunk } from "./chunk/ActionChunk.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

/** */
export class SemPred extends Action {
    /**
     * The user-specified terminal option {@code fail}, if it was used and the
     * value is a string literal. For example:
     *
     * <p>
     * {@code {pred}?<fail='message'>}</p>
     */
    public msg: string;
    /**
     * The predicate string with <code>{</code> and <code>}?</code> stripped from the ends.
     */
    public predicate: string;

    /**
     * The translated chunks of the user-specified terminal option {@code fail},
     * if it was used and the value is an action. For example:
     *
     * <p>
     * {@code {pred}?<fail={"Java literal"}>}</p>
     */
    @ModelElement
    public failChunks: ActionChunk[];

    public constructor(factory: OutputModelFactory, ast: ActionAST) {
        super(factory, ast);

        /* assert ast.atnState != null
            && ast.atnState.getNumberOfTransitions() == 1
            && ast.atnState.transition(0) instanceof AbstractPredicateTransition; */

        const failNode = ast.getOptionAST("fail");
        const gen = factory.getGenerator();
        this.predicate = ast.getText();
        if (this.predicate.startsWith("{") && this.predicate.endsWith("}?")) {
            this.predicate = this.predicate.substring(1, this.predicate.length() - 2);
        }
        this.predicate = gen.getTarget().getTargetStringLiteralFromString(this.predicate);

        if (failNode === null) {
            return;
        }

        if (failNode instanceof ActionAST) {
            const failActionNode = failNode;
            const rf = factory.getCurrentRuleFunction();
            this.failChunks = ActionTranslator.translateAction(factory, rf,
                failActionNode.token,
                failActionNode);
        }
        else {
            this.msg = gen.getTarget().getTargetStringLiteralFromANTLRStringLiteral(gen,
                failNode.getText(),
                true,
                true);
        }
    }
}
