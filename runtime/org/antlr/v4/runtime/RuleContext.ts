/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../lib/java/java";
import { Parser } from "./Parser";
import { ParserRuleContext } from "./ParserRuleContext";
import { Recognizer } from "./Recognizer";
import { ATN } from "./atn/ATN";
import { Interval } from "./misc/Interval";
import { ParseTree } from "./tree/ParseTree";
import { ParseTreeVisitor } from "./tree/ParseTreeVisitor";
import { RuleNode } from "./tree/RuleNode";
import { Trees } from "./tree/Trees";

import { JavaObject } from "../../../../../lib/java/lang/Object";
import { S } from "../../../../../lib/templates";

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
export class RuleContext extends JavaObject extends RuleNode {
    /** What context invoked this rule? */
    public parent: RuleContext | null;

    /**
     * What state invoked the rule associated with this context?
     *  The "return address" is the followState of invokingState
     *  If parent is null, this should be -1 this context object represents
     *  the start rule.
     */
    public invokingState = -1;

    public constructor();

    public constructor(parent: RuleContext | null, invokingState: number);
    public constructor(parent?: RuleContext | null, invokingState?: number) {
        if (parent === undefined) {
            super();
        } else {
            super();
            this.parent = parent;
            //if ( parent!=null ) System.out.println("invoke "+stateNumber+" from "+parent);
            this.invokingState = invokingState;
        }

    }

    public depth = (): number => {
        let n = 0;
        let p: RuleContext = this;
        while (p !== null) {
            p = p.parent;
            n++;
        }

        return n;
    };

    /**
     * A context is empty if there is no invoking state; meaning nobody called
     *  current context.
     */
    public isEmpty = (): boolean => {
        return this.invokingState === -1;
    };

    // satisfy the ParseTree / SyntaxTree interface

    public getSourceInterval = (): Interval | null => {
        return Interval.INVALID;
    };

    public getRuleContext = (): RuleContext | null => { return this; };

    public getParent = (): RuleContext | null => { return this.parent; };

    public getPayload = (): RuleContext | null => { return this; };

    /**
     * Return the combined text of all child nodes. This method only considers
     *  tokens which have been added to the parse tree.
     *  <p>
     *  Since tokens on hidden channels (e.g. whitespace or comments) are not
     *  added to the parse trees, they will not appear in the output of this
     *  method.
     */
    public getText = (): java.lang.String | null => {
        if (this.getChildCount() === 0) {
            return S``;
        }

        const builder: java.lang.StringBuilder = new java.lang.StringBuilder();
        for (let i = 0; i < this.getChildCount(); i++) {
            builder.append(this.getChild(i).getText());
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
     *  @since 4.5.3
     */
    public getAltNumber = (): number => { return ATN.INVALID_ALT_NUMBER; };

    /**
     * Set the outer alternative number for this context node. Default
     *  implementation does nothing to avoid backing field overhead for
     *  trees that don't need it.  Create
     *  a subclass of ParserRuleContext with backing field and set
     *  option contextSuperClass.
     *
     * @param altNumber
     *  @since 4.5.3
     */
    public setAltNumber = (altNumber: number): void => { };

    /***/
    public setParent = (parent: RuleContext | null): void => {
        this.parent = parent;
    };

    public getChild = (i: number): ParseTree | null => {
        return null;
    };

    public getChildCount = (): number => {
        return 0;
    };

    public accept = <T>(visitor: ParseTreeVisitor<T> | null): T | null => { return visitor.visitChildren(this); };

    public toStringTree(): java.lang.String | null;

    /**
     * Print out a whole tree, not just a node, in LISP format
     *  (root child1 .. childN). Print just a node if this is a leaf.
     *  We have to know the recognizer so we can get rule names.
     */
    public toStringTree(recog: Parser | null): java.lang.String | null;

    /**
     * Print out a whole tree, not just a node, in LISP format
     *  (root child1 .. childN). Print just a node if this is a leaf.
     */
    public toStringTree(ruleNames: java.util.List<java.lang.String> | null): java.lang.String | null;

    /**
     * Print out a whole tree, not just a node, in LISP format
     *  (root child1 .. childN). Print just a node if this is a leaf.
     *  We have to know the recognizer so we can get rule names.
     *
     * @param recogOrRuleNames
     */
    public toStringTree(recogOrRuleNames?: Parser | java.util.List<java.lang.String> | null): java.lang.String | null {
        if (recogOrRuleNames === undefined) {
            return this.toStringTree(null as java.util.List<java.lang.String>);
        } else if (recogOrRuleNames instanceof Parser) {
            const recog = recogOrRuleNames;

            return Trees.toStringTree(this, recog);
        } else {
            const ruleNames = recogOrRuleNames as java.util.List<java.lang.String>;

            return Trees.toStringTree(this, ruleNames);
        }

    }

    public toString(): java.lang.String | null;

    public readonly toString(recog: Recognizer<unknown, unknown> | null): java.lang.String | null;

    public readonly toString(ruleNames: java.util.List<java.lang.String> | null): java.lang.String | null;

    // recog null unless ParserRuleContext, in which case we use subclass toString(...)
    public toString(recog: Recognizer<unknown, unknown> | null, stop: RuleContext | null): java.lang.String | null;

    public toString(ruleNames: java.util.List<java.lang.String> | null, stop: RuleContext | null): java.lang.String | null;

    public toString(recogOrRuleNames?: Recognizer<unknown, unknown> | java.util.List<java.lang.String> | null, stop?: RuleContext | null): java.lang.String | null {
        if (recogOrRuleNames === undefined) {
            return this.toString(null as java.util.List<java.lang.String>, null as RuleContext);
        } else if (recogOrRuleNames instanceof Recognizer && stop === undefined) {
            const recog = recogOrRuleNames;

            return this.toString(recog, ParserRuleContext.EMPTY);
        } else if (recogOrRuleNames instanceof java.util.List && stop === undefined) {
            const ruleNames = recogOrRuleNames as java.util.List<java.lang.String>;

            return this.toString(ruleNames, null);
        } else if (recogOrRuleNames instanceof Recognizer && stop instanceof RuleContext) {
            const recog = recogOrRuleNames;
            const ruleNames: java.lang.String[] = recog !== null ? recog.getRuleNames() : null;
            const ruleNamesList: java.util.List<java.lang.String> = ruleNames !== null ? java.util.Arrays.asList(ruleNames) : null;

            return this.toString(ruleNamesList, stop);
        } else {
            const ruleNames = recogOrRuleNames as java.util.List<java.lang.String>;
            const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
            let p: RuleContext = this;
            buf.append(S`[`);
            while (p !== null && p !== stop) {
                if (ruleNames === null) {
                    if (!p.isEmpty()) {
                        buf.append(p.invokingState);
                    }
                } else {
                    const ruleIndex: number = p.getRuleIndex();
                    const ruleName: java.lang.String = ruleIndex >= 0 && ruleIndex < ruleNames.size() ? ruleNames.get(ruleIndex) : java.lang.Integer.toString(ruleIndex);
                    buf.append(ruleName);
                }

                if (p.parent !== null && (ruleNames !== null || !p.parent.isEmpty())) {
                    buf.append(S` `);
                }

                p = p.parent;
            }

            buf.append(S`]`);

            return buf.toString();
        }

    }

}
