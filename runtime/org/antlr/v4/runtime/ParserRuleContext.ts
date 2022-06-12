/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */

import { java } from "../../../../../../lib/java/java";
import { Parser } from "./Parser";
import { RecognitionException } from "./RecognitionException";
import { RuleContext } from "./RuleContext";
import { Token } from "./Token";
import { Interval } from "./misc/Interval";
import { ErrorNode } from "./tree/ErrorNode";
import { ErrorNodeImpl } from "./tree/ErrorNodeImpl";
import { ParseTree } from "./tree/ParseTree";
import { ParseTreeListener } from "./tree/ParseTreeListener";
import { TerminalNode } from "./tree/TerminalNode";
import { TerminalNodeImpl } from "./tree/TerminalNodeImpl";

/**
 * A rule invocation record for parsing.
 *
 *  Contains all of the information about the current rule not stored in the
 *  RuleContext. It handles parse tree children list, Any ATN state
 *  tracing, and the default values available for rule invocations:
 *  start, stop, rule index, current alt number.
 *
 *  Subclasses made for each rule and grammar track the parameters,
 *  return values, locals, and labels specific to that rule. These
 *  are the objects that are returned from rules.
 *
 *  Note text is not an actual field of a rule return value; it is computed
 *  from start and stop using the input stream's toString() method.  I
 *  could add a ctor to this so that we can pass in and store the input
 *  stream, but I'm not sure we want to do that.  It would seem to be undefined
 *  to get the .text property anyway if the rule matches tokens from multiple
 *  input streams.
 *
 *  I do not use getters for fields of objects that are used simply to
 *  group values such as this aggregate.  The getters/setters are there to
 *  satisfy the superclass interface.
 */
export class ParserRuleContext extends RuleContext {
    public static readonly EMPTY = new ParserRuleContext();

    /**
     * If we are debugging or building a parse tree for a visitor,
     *  we need to track all of the tokens and rule invocations associated
     *  with this rule's context. This is empty for parsing w/o tree constr.
     *  operation because we don't the need to track the details about
     *  how we parse this rule.
     */
    public children?: java.util.List<ParseTree>;

    /**
     * For debugging/tracing purposes, we want to track all of the nodes in
     *  the ATN traversed by the parser for a particular rule.
     *  This list indicates the sequence of ATN nodes used to match
     *  the elements of the children list. This list does not include
     *  ATN nodes and other rules used to match rule invocations. It
     *  traces the rule invocation node itself but nothing inside that
     *  other rule's ATN submachine.
     *
     *  There is NOT a one-to-one correspondence between the children and
     *  states list. There are typically many nodes in the ATN traversed
     *  for each element in the children list. For example, for a rule
     *  invocation there is the invoking state and the following state.
     *
     *  The parser setState() method updates field s and adds it to this list
     *  if we are debugging/tracing.
     *
     *  This does not trace states visited during prediction.
     */
    //	public List<Integer> states;

    public start?: Token;
    public stop?: Token;

    /**
     * The exception that forced this rule to return. If the rule successfully
     * completed, this is {@code null}.
     */
    public exception?: RecognitionException;

    public constructor();

    public constructor(parent: ParserRuleContext, invokingStateNumber: number);
    public constructor(parent?: ParserRuleContext, invokingStateNumber?: number) {
        super(parent, invokingStateNumber);
    }

    /**
     * COPY a ctx (I'm deliberately not using copy constructor) to avoid
     *  confusion with creating node with parent. Does not copy children
     *  (except error leaves).
     *
     *  This is used in the generated parser code to flip a generic XContext
     *  node for rule X to a YContext for alt label Y. In that sense, it is
     *  not really a generic copy function.
     *
     *  If we do an error sync() at start of a rule, we might add error nodes
     *  to the generic XContext so this function must copy those nodes to
     *  the YContext as well else they are lost!
     *
     * @param ctx The source context.
     */
    public copyFrom = (ctx: ParserRuleContext): void => {
        this.parent = ctx.parent;
        this.invokingState = ctx.invokingState;

        this.start = ctx.start;
        this.stop = ctx.stop;

        // copy any error nodes to alt label node
        if (ctx.children !== undefined) {
            this.children = new java.util.ArrayList();
            // reset parent pointer for any error nodes
            for (const child of ctx.children) {
                if (child instanceof ErrorNode) {
                    this.addChild(child);
                }
            }
        }
    };

    // Double dispatch methods for listeners

    public enterRule = (_listener: ParseTreeListener): void => { };
    public exitRule = (_listener: ParseTreeListener): void => { };

    /**
     * Add a parse tree node to this as a child.  Works for
     *  internal and leaf nodes. Does not set parent link;
     *  other add methods must do that. Other addChild methods
     *  call this.
     *
     *  We cannot set the parent pointer of the incoming node
     *  because the existing interfaces do not have a setParent()
     *  method and I don't want to break backward compatibility for this.
     *
     * since 4.7
     *
     * @param t The new child.
     *
     * @returns The tree passed in.
     */
    public addAnyChild = <T extends ParseTree>(t: T): T => {
        if (this.children === undefined) {
            this.children = new java.util.ArrayList();
        }

        this.children.add(t);

        return t;
    };

    public addChild(ruleInvocation: RuleContext): RuleContext;

    /** Add a token leaf node child and force its parent to be this node. */
    public addChild(t: TerminalNode): TerminalNode;

    /**
     * Add a child to this node based upon matchedToken. It
     *  creates a TerminalNodeImpl rather than using
     *  {@link Parser#createTerminalNode(ParserRuleContext, Token)}. I'm leaving this
     *  in for compatibility but the parser doesn't use this anymore.
     */
    public addChild(matchedToken: Token): TerminalNode;

    public addChild(ruleInvocationOrTOrMatchedToken: RuleContext | TerminalNode | Token): RuleContext | TerminalNode {
        if (ruleInvocationOrTOrMatchedToken instanceof RuleContext) {
            const ruleInvocation = ruleInvocationOrTOrMatchedToken;

            return this.addAnyChild(ruleInvocation);
        } else if (ruleInvocationOrTOrMatchedToken instanceof TerminalNode) {
            const t = ruleInvocationOrTOrMatchedToken;
            t.setParent(this);

            return this.addAnyChild(t);
        } else {
            const matchedToken = ruleInvocationOrTOrMatchedToken;
            const t: TerminalNodeImpl = new TerminalNodeImpl(matchedToken);
            this.addAnyChild(t);
            t.setParent(this);

            return t;
        }

    }

    /**
     * Add an error node child and force its parent to be this node.
     *
     * @since 4.7
     */
    public addErrorNode(errorNode: ErrorNode): ErrorNode;

    /**
     * Add a child to this node based upon badToken.  It
     *  creates a ErrorNodeImpl rather than using
     *  {@link Parser#createErrorNode(ParserRuleContext, Token)}. I'm leaving this
     *  in for compatibility but the parser doesn't use this anymore.
     */
    public addErrorNode(badToken: Token): ErrorNode;

    /**
     * Add an error node child and force its parent to be this node.
     *
     * since 4.7
     *
     * @param errorNodeOrBadToken The error node or token.
     *
     * @returns The given error node or an error node constructed from the given token.
     */
    public addErrorNode(errorNodeOrBadToken: ErrorNode | Token): ErrorNode {
        if (errorNodeOrBadToken instanceof ErrorNode) {
            const errorNode = errorNodeOrBadToken;
            errorNode.setParent(this);

            return this.addAnyChild(errorNode);
        } else {
            const badToken = errorNodeOrBadToken;
            const t: ErrorNodeImpl = new ErrorNodeImpl(badToken);
            this.addAnyChild(t);
            t.setParent(this);

            return t;
        }

    }

    //	public void trace(int s) {
    //		if ( states==null ) states = new ArrayList<Integer>();
    //		states.add(s);
    //	}

    /**
     * Used by enterOuterAlt to toss out a RuleContext previously added as
     *  we entered a rule. If we have # label, we will need to remove
     *  generic ruleContext object.
     */
    public removeLastChild = (): void => {
        if (this.children !== undefined) {
            this.children.remove(this.children.size() - 1);
        }
    };

    public getChild(i: number): ParseTree;
    public getChild<T extends ParseTree>(ctxType: java.lang.Class<T>, i: number): T | undefined;
    public getChild<T extends ParseTree>(iOrCtxType: number | java.lang.Class<T>,
        i?: number): ParseTree | T | undefined {
        if (typeof iOrCtxType === "number" && i === undefined) {
            const i = iOrCtxType;

            return this.children !== undefined && i >= 0 && i < this.children.size() ? this.children.get(i) : undefined;
        } else {
            const ctxType = iOrCtxType as java.lang.Class<T>;
            if (this.children === undefined || i < 0 || i >= this.children.size()) {
                return undefined;
            }

            let j = -1; // what element have we found with ctxType?
            for (const o of this.children) {
                if (ctxType.isInstance(o)) {
                    j++;
                    if (j === i) {
                        return ctxType.cast(o);
                    }
                }
            }

            return undefined;
        }
    }

    public getToken = (ttype: number, i: number): TerminalNode => {
        if (this.children === undefined || i < 0 || i >= this.children.size()) {
            return undefined;
        }

        let j = -1; // what token with ttype have we found?
        for (const o of this.children) {
            if (o instanceof TerminalNode) {
                const tnode: TerminalNode = o;
                const symbol: Token = tnode.getSymbol();
                if (symbol.getType() === ttype) {
                    j++;
                    if (j === i) {
                        return tnode;
                    }
                }
            }
        }

        return undefined;
    };

    public getTokens = (ttype: number): java.util.List<TerminalNode> => {
        if (this.children === undefined) {
            return java.util.Collections.emptyList();
        }

        let tokens: java.util.List<TerminalNode>;
        for (const o of this.children) {
            if (o instanceof TerminalNode) {
                const tnode: TerminalNode = o;
                const symbol: Token = tnode.getSymbol();
                if (symbol.getType() === ttype) {
                    if (tokens === undefined) {
                        tokens = new java.util.ArrayList<TerminalNode>();
                    }
                    tokens.add(tnode);
                }
            }
        }

        if (tokens === undefined) {
            return java.util.Collections.emptyList();
        }

        return tokens;
    };

    public getRuleContext(): this;
    public getRuleContext<T extends this>(ctxType: java.lang.Class<T>, i: number): T;
    public getRuleContext<T extends this>(ctxType?: java.lang.Class<T>, i?: number): T {
        if (ctxType === undefined) {
            return this as T;
        }

        return this.getChild(ctxType, i);
    }

    public getRuleContexts = <T extends ParserRuleContext>(ctxType: java.lang.Class<T>): java.util.List<T> => {
        if (this.children === undefined) {
            return java.util.Collections.emptyList();
        }

        let contexts: java.util.List<T>;
        for (const o of this.children) {
            if (ctxType.isInstance(o)) {
                if (contexts === undefined) {
                    contexts = new java.util.ArrayList<T>();
                }

                contexts.add(ctxType.cast(o));
            }
        }

        if (contexts === undefined) {
            return java.util.Collections.emptyList();
        }

        return contexts;
    };

    public getChildCount = (): number => { return this.children !== undefined ? this.children.size() : 0; };

    public getSourceInterval = (): Interval => {
        if (this.start === undefined) {
            return Interval.INVALID;
        }
        if (this.stop === undefined || this.stop.getTokenIndex() < this.start.getTokenIndex()) {
            return Interval.of(this.start.getTokenIndex(), this.start.getTokenIndex() - 1); // empty
        }

        return Interval.of(this.start.getTokenIndex(), this.stop.getTokenIndex());
    };

    /**
     * Get the initial token in this context.
     * Note that the range from start to stop is inclusive, so for rules that do not consume anything
     * (for example, zero length or error productions) this token may exceed stop.
     *
     * @returns The start token.
     */
    public getStart = (): Token | undefined => {
        return this.start;
    };

    /**
     * Get the final token in this context.
     * Note that the range from start to stop is inclusive, so for rules that do not consume anything
     * (for example, zero length or error productions) this token may precede start.
     *
     * @returns The end token.
     */
    public getStop = (): Token | undefined => {
        return this.stop;
    };

    /**
     * Used for rule context info debugging during parse-time, not so much for ATN debugging
     *
     * @param recognizer tbd
     *
     * @returns The constructed string.
     */
    public toInfoString = (recognizer: Parser): string => {
        const rules: java.util.List<string> = recognizer.getRuleInvocationStack(this);
        java.util.Collections.reverse(rules);

        return "ParserRuleContext" + rules + "{" +
            "start=" + this.start +
            ", stop=" + this.stop +
            "}";
    };
}

