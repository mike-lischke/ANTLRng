/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { BlankActionSplitterListener } from "./BlankActionSplitterListener.js";
import { Alternative } from "../tool/Alternative.js";
import { Grammar } from "../tool/Grammar.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";



/** Find token and rule refs plus refs to them in actions;
 *  side-effect: update Alternatives
 */
export class ActionSniffer extends BlankActionSplitterListener {
    public g: Grammar;
    public r: Rule;          // null if action outside of rule
    public alt: Alternative; // null if action outside of alt; could be in rule
    public node: ActionAST;
    public actionToken: Token; // token within action
    public errMgr: java.util.logging.ErrorManager;

    public constructor(g: Grammar, r: Rule, alt: Alternative, node: ActionAST, actionToken: Token) {
        this.g = g;
        this.r = r;
        this.alt = alt;
        this.node = node;
        this.actionToken = actionToken;
        this.errMgr = g.tool.errMgr;
    }

    public examineAction(): void {
        //System.out.println("examine "+actionToken);
        let in = new ANTLRStringStream(this.actionToken.getText());
		in.setLine(this.actionToken.getLine());
		in.setCharPositionInLine(this.actionToken.getCharPositionInLine());
        let splitter = new ActionSplitter(in, this);
        // forces eval, triggers listener methods
        this.node.chunks = splitter.getActionTokens();
    }

    public processNested(actionToken: Token): void {
        let in = new ANTLRStringStream(actionToken.getText());
		in.setLine(actionToken.getLine());
		in.setCharPositionInLine(actionToken.getCharPositionInLine());
        let splitter = new ActionSplitter(in, this);
        // forces eval, triggers listener methods
        splitter.getActionTokens();
    }


    @Override
    public override  attr(expr: string, x: Token): void { this.trackRef(x); }

    @Override
    public override  qualifiedAttr(expr: string, x: Token, y: Token): void { this.trackRef(x); }

    @Override
    public override  setAttr(expr: string, x: Token, rhs: Token): void {
        this.trackRef(x);
        this.processNested(rhs);
    }

    @Override
    public override  setNonLocalAttr(expr: string, x: Token, y: Token, rhs: Token): void {
        this.processNested(rhs);
    }

    public trackRef(x: Token): void {
        let xRefs = this.alt.tokenRefs.get(x.getText());
        if (xRefs !== null) {
            this.alt.tokenRefsInActions.map(x.getText(), this.node);
        }
        let rRefs = this.alt.ruleRefs.get(x.getText());
        if (rRefs !== null) {
            this.alt.ruleRefsInActions.map(x.getText(), this.node);
        }
    }
}
