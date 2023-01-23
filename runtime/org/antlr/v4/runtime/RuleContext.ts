/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../lib/java/java";
import { Parser } from "./Parser";
import { Recognizer } from "./Recognizer";
import { ATN } from "./atn/ATN";
import { Interval } from "./misc/Interval";
import { ParseTree } from "./tree/ParseTree";
import { ParseTreeVisitor } from "./tree/ParseTreeVisitor";
import { RuleNode } from "./tree/RuleNode";
import { Trees } from "./tree/Trees";

import { JavaObject } from "../../../../../lib/java/lang/Object";
import { S } from "../../../../../lib/templates";
import { ATNSimulator } from "./atn";
import { Token } from "./Token";

/**
 * A rule context is a record of a single rule invocation.
 *
 *  We form a stack of these context objects using the parent
 *  pointer. A parent pointer of null indicates that the current
 *  context is the bottom of the stack. The ParserRuleContext subclass
 *  as a children list so that we can turn this data structure into a
 *  tree.
 *
 *  The root node always has a null pointer and invokingState of -1.
 *
 *  Upon entry to parsing, the first invoked rule function creates a
 *  context object (a subclass specialized for that rule such as
 *  SContext) and makes it the root of a parse tree, recorded by field
 *  Parser._ctx.
 *
 *  public final SContext s() throws RecognitionException {
 *      SContext _localctx = new SContext(_ctx, getState()); <-- create new node
 *      enterRule(_localctx, 0, RULE_s);                     <-- push it
 *      ...
 *      exitRule();                                          <-- pop back to _localctx
 *      return _localctx;
 *  }
 *
 *  A subsequent rule invocation of r from the start rule s pushes a
 *  new context object for r whose parent points at s and use invoking
 *  state is the state with r emanating as edge label.
 *
 *  The invokingState fields from a context object to the root
 *  together form a stack of rule indication states where the root
 *  (bottom of the stack) has a -1 sentinel value. If we invoke start
 *  symbol s then call r1, which calls r2, the  would look like
 *  this:
 *
 *     SContext[-1]   <- root node (bottom of the stack)
 *     R1Context[p]   <- p in rule s called r1
 *     R2Context[q]   <- q in rule r1 called r2
 *
 *  So the top of the stack, _ctx, represents a call to the current
 *  rule and it holds the return address from another rule that invoke
 *  to this rule. To invoke a rule, we must always have a current context.
 *
 *  The parent contexts are useful for computing lookahead sets and
 *  getting error information.
 *
 *  These objects are used during parsing and prediction.
 *  For the special case of parsers, we use the subclass
 *  ParserRuleContext.
 *
 *  @see ParserRuleContext
 */
export class RuleContext extends JavaObject implements Omit<RuleNode, "getParent"> {
    /** What context invoked this rule? */
    public parent: RuleContext | null = null;

    /**
     * What state invoked the rule associated with this context?
     *  The "return address" is the followState of invokingState
     *  If parent is null, this should be -1 this context object represents
     *  the start rule.
     */
    public invokingState = -1;

    public constructor(parent?: RuleContext | null, invokingState?: number) {
        super();
        if (parent !== undefined) {
            this.parent = parent;
            this.invokingState = invokingState ?? -1;
        }

    }

    public depth = (): number => {
        let n = 0;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let p: RuleContext | null = this;
        while (p !== null) {
            p = p.parent;
            n++;
        }

        return n;
    };

    /**
     * A context is empty if there is no invoking state; meaning nobody called
     *  current context.
     *
     * @returns tbd
     */
    public isEmpty = (): boolean => {
        return this.invokingState === -1;
    };

    // satisfy the ParseTree / SyntaxTree interface

    public getSourceInterval = (): Interval => {
        return Interval.INVALID;
    };

    public getRuleContext(): RuleContext | null {
        return this;
    }

    public getParent = (): this | null => { return this.parent as this; };

    public getPayload = (): RuleContext => { return this; };

    /**
     * Return the combined text of all child nodes. This method only considers
     *  tokens which have been added to the parse tree.
     *  <p>
     *  Since tokens on hidden channels (e.g. whitespace or comments) are not
     *  added to the parse trees, they will not appear in the output of this
     *  method.
     *
     * @returns tbd
     */
    public getText = (): java.lang.String => {
        if (this.getChildCount() === 0) {
            return S``;
        }

        const builder = new java.lang.StringBuilder();
        for (let i = 0; i < this.getChildCount(); i++) {
            builder.append(this.getChild(i)!.getText());
        }

        return builder.toString();
    };

    public getRuleIndex = (): number => { return -1; };

    /**
     * For rule associated with this parse tree internal node, return
     *  the outer alternative number used to match the input. Default
     *  implementation does not compute nor store this alt num. Create
     *  a subclass of ParserRuleContext with backing field and set
     *  option contextSuperClass.
     *  to set it.
     *
     *  @returns tbd
     */
    public getAltNumber = (): number => { return ATN.INVALID_ALT_NUMBER; };

    /**
     * Set the outer alternative number for this context node. Default
     *  implementation does nothing to avoid backing field overhead for
     *  trees that don't need it.  Create
     *  a subclass of ParserRuleContext with backing field and set
     *  option contextSuperClass.
     *
     * @param altNumber tbd
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setAltNumber = (altNumber: number): void => { /**/ };

    public setParent = (parent: RuleContext | null): void => {
        this.parent = parent;
    };

    public getChild(_i: number): ParseTree | null {
        return null;
    }

    public getChildCount = (): number => {
        return 0;
    };

    public accept = <T>(visitor: ParseTreeVisitor<T>): T => {
        return visitor.visitChildren(this);
    };

    /**
     * Print out a whole tree, not just a node, in LISP format
     *  (root child1 .. childN). Print just a node if this is a leaf.
     *  We have to know the recognizer so we can get rule names.
     *
     * @param recogOrRuleNames tbd
     *
     * @returns tbd
     */
    public toStringTree(recogOrRuleNames?: Parser | java.util.List<java.lang.String>): java.lang.String {
        if (!recogOrRuleNames) {
            return Trees.toStringTree(this);
        }

        // Not clear why we need a separate check here, even though we end up with the same call and parameters.
        if (recogOrRuleNames instanceof Parser) {
            return Trees.toStringTree(this, recogOrRuleNames);
        }

        return Trees.toStringTree(this, recogOrRuleNames);
    }

    public toString(ruleNames?: java.util.List<java.lang.String>): java.lang.String;
    // recog null unless ParserRuleContext, in which case we use subclass toString(...)
    public toString<S extends Token, T extends ATNSimulator>(recog: Recognizer<S, T>,
        stop?: RuleContext): java.lang.String;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public toString(ruleNames: java.util.List<java.lang.String>, stop: RuleContext): java.lang.String;
    public toString<S extends Token, T extends ATNSimulator>(
        recogOrRuleNames?: Recognizer<S, T> | java.util.List<java.lang.String>, stop?: RuleContext): java.lang.String {
        let ruleNamesList;
        if (recogOrRuleNames instanceof Recognizer) {
            const ruleNames = recogOrRuleNames.getRuleNames();
            ruleNamesList = java.util.Arrays.asList(ruleNames);
        } else {
            ruleNamesList = recogOrRuleNames ?? null;
        }

        const buf = new java.lang.StringBuilder();
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let p: RuleContext | null = this;
        buf.append("[");
        while (p !== null && p !== stop) {
            if (ruleNamesList === null) {
                if (!p.isEmpty()) {
                    buf.append(p.invokingState);
                }
            } else {
                const ruleIndex: number = p.getRuleIndex();
                const ruleName = ruleIndex >= 0 && ruleIndex < ruleNamesList.size()
                    ? ruleNamesList.get(ruleIndex)
                    : java.lang.Integer.toString(ruleIndex);
                buf.append(ruleName);
            }

            if (p.parent !== null && (ruleNamesList !== null || !p.parent.isEmpty())) {
                buf.append(" ");
            }

            p = p.parent;
        }

        buf.append("]");

        return buf.toString();
    }
}
