/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../lib/java/java";
import { Parser } from "./Parser";
import { RecognitionException } from "./RecognitionException";
import { RuleContext } from "./RuleContext";
import { Token } from "./Token";
import { Interval } from "./misc/Interval";
import { ErrorNode } from "./tree/ErrorNode";
import { ErrorNodeImpl } from "./tree/ErrorNodeImpl";
import { ParseTree } from "./tree/ParseTree";
import { ParseTreeListener } from "./tree/ParseTreeListener";
import { isTerminalNode, TerminalNode } from "./tree/TerminalNode";
import { TerminalNodeImpl } from "./tree/TerminalNodeImpl";

import { S } from "../../../../../lib/templates";
import { ParserATNSimulator } from "./atn";

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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly EMPTY: ParserRuleContext = new ParserRuleContext();

    /**
     * If we are debugging or building a parse tree for a visitor,
     *  we need to track all of the tokens and rule invocations associated
     *  with this rule's context. This is empty for parsing w/o tree constr.
     *  operation because we don't the need to track the details about
     *  how we parse this rule.
     */
    public children: java.util.List<ParseTree> | null = null;

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

    public start: Token | null = null;
    public stop: Token | null = null;

    /**
     * The exception that forced this rule to return. If the rule successfully
     * completed, this is {@code null}.
     */
    public exception: RecognitionException<Token, ParserATNSimulator> | null = null;

    public constructor(parent?: ParserRuleContext, invokingStateNumber?: number) {
        super(parent ?? null, invokingStateNumber);

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
     * @param ctx tbd
     */
    public copyFrom = (ctx: ParserRuleContext): void => {
        this.parent = ctx.parent;
        this.invokingState = ctx.invokingState;

        this.start = ctx.start;
        this.stop = ctx.stop;

        // copy any error nodes to alt label node
        if (ctx.children !== null) {
            this.children = new java.util.ArrayList<ParseTree>();
            // reset parent pointer for any error nodes
            for (const child of ctx.children) {
                if (child instanceof ErrorNodeImpl) {
                    this.addChild(child as ErrorNode);
                }
            }
        }
    };

    // Double dispatch methods for listeners

    public enterRule = (_listener: ParseTreeListener | null): void => { /**/ };
    public exitRule = (_listener: ParseTreeListener | null): void => { /**/ };

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
     * @param t tbd
     *
     * @returns tbd
     */
    public addAnyChild = <T extends ParseTree>(t: T): T => {
        if (!this.children) {
            this.children = new java.util.ArrayList<ParseTree>();
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
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public addChild(matchedToken: Token): TerminalNode;
    public addChild(ruleInvocationOrTOrMatchedToken: RuleContext | TerminalNode | Token): RuleContext | TerminalNode {
        if (ruleInvocationOrTOrMatchedToken instanceof RuleContext) {
            const ruleInvocation = ruleInvocationOrTOrMatchedToken;

            return this.addAnyChild(ruleInvocation);
        } else if (isTerminalNode(ruleInvocationOrTOrMatchedToken)) {
            ruleInvocationOrTOrMatchedToken.setParent(this);

            return this.addAnyChild(ruleInvocationOrTOrMatchedToken);
        } else {
            const t = new TerminalNodeImpl(ruleInvocationOrTOrMatchedToken);
            this.addAnyChild(t);
            t.setParent(this);

            return t;
        }

    }

    /**
     * Add an error node child and force its parent to be this node.
     *
     * @param errorNodeOrBadToken tbd
     *
     * @returns tbd
     */
    public addErrorNode(errorNodeOrBadToken: ErrorNode | Token): ErrorNode {
        if (errorNodeOrBadToken instanceof ErrorNodeImpl) {
            const errorNode = errorNodeOrBadToken as ErrorNode;
            errorNode.setParent(this);

            return this.addAnyChild(errorNode);
        } else {
            const badToken = errorNodeOrBadToken as Token;
            const t = new ErrorNodeImpl(badToken);
            this.addAnyChild(t);
            t.setParent(this);

            return t;
        }

    }

    /**
     * Used by enterOuterAlt to toss out a RuleContext previously added as
     *  we entered a rule. If we have # label, we will need to remove
     *  generic ruleContext object.
     */
    public removeLastChild = (): void => {
        this.children?.remove(this.children.size() - 1);
    };

    public getParent = (): this | null => {
        return super.getParent() as this;
    };

    public getChild(i: number): ParseTree | null;
    public getChild<T extends ParseTree>(ctxType: java.lang.Class<T>, i: number): T | null;
    public getChild<T extends ParseTree>(iOrCtxType: number | java.lang.Class<T>,
        i?: number): ParseTree | T | null {
        if (typeof iOrCtxType === "number") {
            const i = iOrCtxType;

            return this.children !== null && i >= 0 && i < this.children.size() ? this.children.get(i) : null;
        } else if (i !== undefined) {
            if (this.children === null || i < 0 || i >= this.children.size()) {
                return null;
            }

            let j = -1; // what element have we found with ctxType?
            for (const o of this.children) {
                if (iOrCtxType.isInstance(o)) {
                    j++;
                    if (j === i) {
                        return iOrCtxType.cast(o);
                    }
                }
            }
        }

        return null;
    }

    public getToken = (ttype: number, i: number): TerminalNode | null => {
        if (this.children === null || i < 0 || i >= this.children.size()) {
            return null;
        }

        let j = -1; // what token with ttype have we found?
        for (const o of this.children) {
            if (isTerminalNode(o)) {
                const symbol: Token = o.getSymbol();
                if (symbol.getType() === ttype) {
                    j++;
                    if (j === i) {
                        return o;
                    }
                }
            }
        }

        return null;
    };

    public getTokens = (ttype: number): java.util.List<TerminalNode> => {
        if (this.children === null) {
            return java.util.Collections.emptyList();
        }

        let tokens: java.util.List<TerminalNode> | null = null;
        for (const o of this.children) {
            if (isTerminalNode(o)) {
                const symbol = o.getSymbol();
                if (symbol.getType() === ttype) {
                    if (tokens === null) {
                        tokens = new java.util.ArrayList<TerminalNode>();
                    }
                    tokens.add(o);
                }
            }
        }

        if (tokens === null) {
            return java.util.Collections.emptyList();
        }

        return tokens;
    };

    public getRuleContext<T extends ParserRuleContext>(ctxType: java.lang.Class<T>, i: number): T | null {
        return this.getChild(ctxType, i);
    }

    public getRuleContexts = <T extends ParserRuleContext>(ctxType: java.lang.Class<T>): java.util.List<T> | null => {
        if (this.children === null) {
            return java.util.Collections.emptyList();
        }

        let contexts: java.util.List<T> | null = null;
        for (const o of this.children) {
            if (ctxType.isInstance(o)) {
                if (contexts === null) {
                    contexts = new java.util.ArrayList<T>();
                }

                contexts.add(ctxType.cast(o));
            }
        }

        if (contexts === null) {
            return java.util.Collections.emptyList();
        }

        return contexts;
    };

    public getChildCount = (): number => { return this.children !== null ? this.children.size() : 0; };

    public getSourceInterval = (): Interval => {
        if (this.start === null) {
            return Interval.INVALID;
        }

        if (this.stop === null || this.stop.getTokenIndex() < this.start.getTokenIndex()) {
            return Interval.of(this.start.getTokenIndex(), this.start.getTokenIndex() - 1); // empty
        }

        return Interval.of(this.start.getTokenIndex(), this.stop.getTokenIndex());
    };

    /**
     * Get the initial token in this context.
     * Note that the range from start to stop is inclusive, so for rules that do not consume anything
     * (for example, zero length or error productions) this token may exceed stop.
     *
     * @returns tbd
     */
    public getStart = (): Token | null => {
        return this.start;
    };

    /**
     * Get the final token in this context.
     * Note that the range from start to stop is inclusive, so for rules that do not consume anything
     * (for example, zero length or error productions) this token may precede start.
     *
     * @returns tbd
     */
    public getStop = (): Token | null => {
        return this.stop;
    };

    /**
     * Used for rule context info debugging during parse-time, not so much for ATN debugging
     *
     * @param recognizer tbd
     *
     * @returns tbd
     */
    public toInfoString = (recognizer: Parser): java.lang.String => {
        const rules = recognizer.getRuleInvocationStack(this);
        java.util.Collections.reverse(rules);

        const text = `ParserRuleContext` + rules + `{` +
            `start=` + this.start +
            `, stop=` + this.stop +
            "}";

        return S`${text}`;
    };
}
