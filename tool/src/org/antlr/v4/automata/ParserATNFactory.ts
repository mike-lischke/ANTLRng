/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { TailEpsilonRemover } from "./TailEpsilonRemover.js";
import { ATNOptimizer } from "./ATNOptimizer.js";
import { IATNFactory } from "./ATNFactory.js";
import { LeftRecursiveRuleTransformer } from "../analysis/LeftRecursiveRuleTransformer.js";
import { CharSupport } from "../misc/CharSupport.js";
import { GrammarASTAdaptor } from "../parse/GrammarASTAdaptor.js";
import { ATN, ATNState, ATNType, AbstractPredicateTransition, ActionTransition, AtomTransition, BasicBlockStartState, BasicState, BlockEndState, BlockStartState, EpsilonTransition, LL1Analyzer, LoopEndState, NotSetTransition, PlusBlockStartState, PlusLoopbackState, PrecedencePredicateTransition, PredicateTransition, RuleStartState, RuleStopState, RuleTransition, SetTransition, StarBlockStartState, StarLoopEntryState, StarLoopbackState, Transition, WildcardTransition, IntervalSet, Triple } from "antlr4ng";
import { UseDefAnalyzer } from "../semantics/UseDefAnalyzer.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { LeftRecursiveRule } from "../tool/LeftRecursiveRule.js";
import { LexerGrammar } from "../tool/LexerGrammar.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { AltAST } from "../tool/ast/AltAST.js";
import { BlockAST } from "../tool/ast/BlockAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { GrammarASTWithOptions } from "../tool/ast/GrammarASTWithOptions.js";
import { PredAST } from "../tool/ast/PredAST.js";
import { QuantifierAST } from "../tool/ast/QuantifierAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";
import { ATNBuilder } from "../../../../../../src/tree-walkers/ATNBuilder.js";

/**
 * ATN construction routines triggered by ATNBuilder.g.
 *
 *  No side-effects. It builds an {@link ATN} object and returns it.
 */
export class ParserATNFactory implements IATNFactory {

    public readonly g: Grammar;

    public readonly atn: ATN;

    public currentRule: Rule;

    public currentOuterAlt: number;

    protected readonly preventEpsilonClosureBlocks =
        new Array<Triple<Rule, ATNState, ATNState>>();

    protected readonly preventEpsilonOptionalBlocks =
        new Array<Triple<Rule, ATNState, ATNState>>();

    public constructor(g: Grammar) {
        if (g === null) {
            throw new NullPointerException("g");
        }

        this.g = g;

        const atnType = g instanceof LexerGrammar ? ATNType.LEXER : ATNType.PARSER;
        const maxTokenType = g.getMaxTokenType();
        this.atn = new ATN(atnType, maxTokenType);
    }

    /**
     * {@code (BLOCK (ALT .))} or {@code (BLOCK (ALT 'a') (ALT .))}.
     */
    public static blockHasWildcardAlt(block: GrammarAST): boolean {
        for (const alt of block.getChildren()) {
            if (!(alt instanceof AltAST)) {
                continue;
            }

            const altAST = alt;
            if (altAST.getChildCount() === 1 || (altAST.getChildCount() === 2 && altAST.getChild(0).getType() === ANTLRParser.ELEMENT_OPTIONS)) {
                const e = altAST.getChild(altAST.getChildCount() - 1);
                if (e.getType() === ANTLRParser.WILDCARD) {
                    return true;
                }
            }
        }

        return false;
    }

    public createATN(): ATN {
        this._createATN(this.g.rules.values());
        /* assert atn.maxTokenType == g.getMaxTokenType(); */
        this.addRuleFollowLinks();
        this.addEOFTransitionToStartRules();
        ATNOptimizer.optimize(this.g, this.atn);
        this.checkEpsilonClosure();

        optionalCheck:
        for (const pair of this.preventEpsilonOptionalBlocks) {
            let bypassCount = 0;
            for (let i = 0; i < pair.b.getNumberOfTransitions(); i++) {
                const startState = pair.b.transition(i).target;
                if (startState === pair.c) {
                    bypassCount++;
                    continue;
                }

                const analyzer = new LL1Analyzer(this.atn);
                if (analyzer.LOOK(startState, pair.c, null).contains(org.antlr.v4.runtime.Token.EPSILON)) {
                    this.g.tool.errMgr.grammarError(ErrorType.EPSILON_OPTIONAL, this.g.fileName, (pair.a.ast.getChild(0) as GrammarAST).getToken(), pair.a.name);
                    continue optionalCheck;
                }
            }

            if (bypassCount !== 1) {
                throw new UnsupportedOperationException("Expected optional block with exactly 1 bypass alternative.");
            }
        }

        return this.atn;
    }

    public setCurrentRuleName(name: string): void {
        this.currentRule = this.g.getRule(name);
    }

    public setCurrentOuterAlt(alt: number): void {
        this.currentOuterAlt = alt;
    }

    /* start->ruleblock->end */

    public rule(ruleAST: GrammarAST, name: string, blk: ATNFactory.Handle): ATNFactory.Handle {
        const r = this.g.getRule(name);
        const start = this.atn.ruleToStartState[r.index];
        this.epsilon(start, blk.left);
        const stop = this.atn.ruleToStopState[r.index];
        this.epsilon(blk.right, stop);
        const h = new IATNFactory.IStatePair(start, stop);
        //		ATNPrinter ser = new ATNPrinter(g, h.left);
        //		System.out.println(ruleAST.toStringTree()+":\n"+ser.asString());
        ruleAST.atnState = start;

        return h;
    }

    /** From label {@code A} build graph {@code o-A->o}. */

    public tokenRef(node: TerminalAST): ATNFactory.Handle {
        const left = this.newState(node);
        const right = this.newState(node);
        const ttype = this.g.getTokenType(node.getText());
        left.addTransition(new AtomTransition(right, ttype));
        node.atnState = left;

        return new IATNFactory.IStatePair(left, right);
    }

    /**
     * From set build single edge graph {@code o->o-set->o}.  To conform to
     *  what an alt block looks like, must have extra state on left.
     *  This also handles {@code ~A}, converted to {@code ~{A}} set.
     */

    public set(associatedAST: GrammarAST, terminals: GrammarAST[], invert: boolean): ATNFactory.Handle {
        const left = this.newState(associatedAST);
        const right = this.newState(associatedAST);
        const set = new IntervalSet();
        for (const t of terminals) {
            const ttype = this.g.getTokenType(t.getText());
            set.add(ttype);
        }
        if (invert) {
            left.addTransition(new NotSetTransition(right, set));
        }
        else {
            left.addTransition(new SetTransition(right, set));
        }
        associatedAST.atnState = left;

        return new IATNFactory.IStatePair(left, right);
    }

    /** Not valid for non-lexers. */

    public range(a: GrammarAST, b: GrammarAST): ATNFactory.Handle {
        this.g.tool.errMgr.grammarError(ErrorType.TOKEN_RANGE_IN_PARSER, this.g.fileName,
            a.getToken(),
            a.getToken().getText(),
            b.getToken().getText());

        // From a..b, yield ATN for just a.
        return this.tokenRef(a as TerminalAST);
    }

    /** For a non-lexer, just build a simple token reference atom. */

    public stringLiteral(stringLiteralAST: TerminalAST): ATNFactory.Handle {
        return this.tokenRef(stringLiteralAST);
    }

    /** {@code [Aa]} char sets not allowed in parser */

    public charSetLiteral(charSetAST: GrammarAST): ATNFactory.Handle {
        return null;
    }

    /**
     * For reference to rule {@code r}, build
     *
     * <pre>
     *  o-&gt;(r)  o
     * </pre>
     *
     * where {@code (r)} is the start of rule {@code r} and the trailing
     * {@code o} is not linked to from rule ref state directly (uses
     * {@link RuleTransition#followState}).
     */

    public ruleRef(node: GrammarAST): ATNFactory.Handle {
        const h = this._ruleRef(node);

        return h;
    }

    public _ruleRef(node: GrammarAST): ATNFactory.Handle {
        const r = this.g.getRule(node.getText());
        if (r === null) {
            this.g.tool.errMgr.grammarError(ErrorType.INTERNAL_ERROR, this.g.fileName, node.getToken(), "Rule " + node.getText() + " undefined");

            return null;
        }
        const start = this.atn.ruleToStartState[r.index];
        const left = this.newState(node);
        const right = this.newState(node);
        let precedence = 0;
        if ((node as GrammarASTWithOptions).getOptionString(LeftRecursiveRuleTransformer.PRECEDENCE_OPTION_NAME) !== null) {
            precedence = number.parseInt((node as GrammarASTWithOptions).getOptionString(LeftRecursiveRuleTransformer.PRECEDENCE_OPTION_NAME));
        }
        const call = new RuleTransition(start, r.index, precedence, right);
        left.addTransition(call);

        node.atnState = left;

        return new IATNFactory.IStatePair(left, right);
    }

    public addFollowLink(ruleIndex: number, right: ATNState): void {
        // add follow edge from end of invoked rule
        const stop = this.atn.ruleToStopState[ruleIndex];
        //        System.out.println("add follow link from "+ruleIndex+" to "+right);
        this.epsilon(stop, right);
    }

    /** From an empty alternative build {@code o-e->o}. */

    public epsilon(node: GrammarAST): ATNFactory.Handle;

    protected epsilon(a: ATNState, b: ATNState): void;

    protected epsilon(a: ATNState, b: ATNState, prepend: boolean): void;
    public epsilon(...args: unknown[]): ATNFactory.Handle | void {
        switch (args.length) {
            case 1: {
                const [node] = args as [GrammarAST];

                const left = this.newState(node);
                const right = this.newState(node);
                this.epsilon(left, right);
                node.atnState = left;

                return new IATNFactory.IStatePair(left, right);

                break;
            }

            case 2: {
                const [a, b] = args as [ATNState, ATNState];

                this.epsilon(a, b, false);

                break;
            }

            case 3: {
                const [a, b, prepend] = args as [ATNState, ATNState, boolean];

                if (a !== null) {
                    const index = prepend ? 0 : a.getNumberOfTransitions();
                    a.addTransition(index, new EpsilonTransition(b));
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * Build what amounts to an epsilon transition with a semantic
     *  predicate action.  The {@code pred} is a pointer into the AST of
     *  the {@link ANTLRParser#SEMPRED} token.
     */

    public sempred(pred: PredAST): ATNFactory.Handle {
        //System.out.println("sempred: "+ pred);
        const left = this.newState(pred);
        const right = this.newState(pred);

        let p: AbstractPredicateTransition;
        if (pred.getOptionString(LeftRecursiveRuleTransformer.PRECEDENCE_OPTION_NAME) !== null) {
            const precedence = number.parseInt(pred.getOptionString(LeftRecursiveRuleTransformer.PRECEDENCE_OPTION_NAME));
            p = new PrecedencePredicateTransition(right, precedence);
        }
        else {
            const isCtxDependent = UseDefAnalyzer.actionIsContextDependent(pred);
            p = new PredicateTransition(right, this.currentRule.index, this.g.sempreds.get(pred), isCtxDependent);
        }

        left.addTransition(p);
        pred.atnState = left;

        return new IATNFactory.IStatePair(left, right);
    }

    /**
     * Build what amounts to an epsilon transition with an action.
     *  The action goes into ATN though it is ignored during prediction
     *  if {@link ActionTransition#actionIndex actionIndex}{@code <0}.
     */

    public action(action: ActionAST): ATNFactory.Handle;

    public action(action: string): ATNFactory.Handle;
    public action(...args: unknown[]): ATNFactory.Handle {
        switch (args.length) {
            case 1: {
                const [action] = args as [ActionAST];

                //System.out.println("action: "+action);
                const left = this.newState(action);
                const right = this.newState(action);
                const a = new ActionTransition(right, this.currentRule.index);
                left.addTransition(a);
                action.atnState = left;

                return new IATNFactory.IStatePair(left, right);

                break;
            }

            case 1: {
                const [action] = args as [string];

                throw new UnsupportedOperationException("This element is not valid in parsers.");

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * From {@code A|B|..|Z} alternative block build
     *
     * <pre>
     *  o-&gt;o-A-&gt;o-&gt;o (last ATNState is BlockEndState pointed to by all alts)
     *  |          ^
     *  |-&gt;o-B-&gt;o--|
     *  |          |
     *  ...        |
     *  |          |
     *  |-&gt;o-Z-&gt;o--|
     * </pre>
     *
     * So start node points at every alternative with epsilon transition and
     * every alt right side points at a block end ATNState.
     * <p>
     * Special case: only one alternative: don't make a block with alt
     * begin/end.
     * <p>
     * Special case: if just a list of tokens/chars/sets, then collapse to a
     * single edged o-set-&gt;o graph.
     * <p>
     * TODO: Set alt number (1..n) in the states?
     */

    public block(blkAST: BlockAST, ebnfRoot: GrammarAST, alts: ATNFactory.Handle[]): ATNFactory.Handle {
        if (ebnfRoot === null) {
            if (alts.size() === 1) {
                const h = alts.get(0);
                blkAST.atnState = h.left;

                return h;
            }
            const start = this.newState(BasicBlockStartState.class, blkAST);
            if (alts.size() > 1) {
                this.atn.defineDecisionState(start);
            }

            return this.makeBlock(start, blkAST, alts);
        }
        switch (ebnfRoot.getType()) {
            case ANTLRParser.OPTIONAL: {
                const start = this.newState(BasicBlockStartState.class, blkAST);
                this.atn.defineDecisionState(start);
                const h = this.makeBlock(start, blkAST, alts);

                return this.optional(ebnfRoot, h);
            }

            case ANTLRParser.CLOSURE: {
                const star = this.newState(StarBlockStartState.class, ebnfRoot);
                if (alts.size() > 1) {
                    this.atn.defineDecisionState(star);
                }

                java.lang.reflect.Proxy.h = this.makeBlock(star, blkAST, alts);

                return star(ebnfRoot, java.lang.reflect.Proxy.h);
            }

            case ANTLRParser.POSITIVE_CLOSURE: {
                const plus = this.newState(PlusBlockStartState.class, ebnfRoot);
                if (alts.size() > 1) {
                    this.atn.defineDecisionState(plus);
                }

                java.lang.reflect.Proxy.h = this.makeBlock(plus, blkAST, alts);

                return plus(ebnfRoot, java.lang.reflect.Proxy.h);
            }

            default:

        }

        return null;
    }

    public alt(els: ATNFactory.Handle[]): ATNFactory.Handle {
        return this.elemList(els);
    }

    public elemList(els: ATNFactory.Handle[]): ATNFactory.Handle {
        const n = els.size();
        for (let i = 0; i < n - 1; i++) {	// hook up elements (visit all but last)
            const el = els.get(i);
            // if el is of form o-x->o for x in {rule, action, pred, token, ...}
            // and not last in alt
            let tr = null;
            if (el.left.getNumberOfTransitions() === 1) {
                tr = el.left.transition(0);
            }

            const isRuleTrans = tr instanceof RuleTransition;
            if (el.left.getStateType() === ATNState.BASIC &&
                el.right !== null &&
                el.right.getStateType() === ATNState.BASIC &&
                tr !== null && (isRuleTrans && (tr as RuleTransition).followState === el.right || tr.target === el.right)) {
                // we can avoid epsilon edge to next el
                let handle = null;
                if (i + 1 < els.size()) {
                    handle = els.get(i + 1);
                }
                if (handle !== null) {
                    if (isRuleTrans) {
                        (tr as RuleTransition).followState = handle.left;
                    } else {
                        tr.target = handle.left;
                    }
                }
                this.atn.removeState(el.right); // we skipped over this state
            }
            else { // need epsilon if previous block's right end node is complicated
                this.epsilon(el.right, els.get(i + 1).left);
            }
        }
        const first = els.get(0);
        const last = els.get(n - 1);
        let left = null;
        if (first !== null) {
            left = first.left;
        }
        let right = null;
        if (last !== null) {
            right = last.right;
        }

        return new IATNFactory.IStatePair(left, right);
    }

    /**
     * From {@code (A)?} build either:
     *
     * <pre>
     *  o--A-&gt;o
     *  |     ^
     *  o----&gt;|
     * </pre>
     *
     * or, if {@code A} is a block, just add an empty alt to the end of the
     * block
     */

    public optional(optAST: GrammarAST, blk: ATNFactory.Handle): ATNFactory.Handle {
        const blkStart = blk.left as BlockStartState;
        const blkEnd = blk.right;
        this.preventEpsilonOptionalBlocks.add(new Triple<Rule, ATNState, ATNState>(this.currentRule, blkStart, blkEnd));

        const greedy = (optAST as QuantifierAST).isGreedy();
        blkStart.nonGreedy = !greedy;
        this.epsilon(blkStart, blk.right, !greedy);

        optAST.atnState = blk.left;

        return blk;
    }

    /**
     * From {@code (blk)+} build
     *
     * <pre>
     *   |---------|
     *   v         |
     *  [o-blk-o]-&gt;o-&gt;o
     * </pre>
     *
     * We add a decision for loop back node to the existing one at {@code blk}
     * start.
     */

    public plus(plusAST: GrammarAST, blk: ATNFactory.Handle): ATNFactory.Handle {
        const blkStart = blk.left as PlusBlockStartState;
        const blkEnd = blk.right as BlockEndState;
        this.preventEpsilonClosureBlocks.add(new Triple<Rule, ATNState, ATNState>(this.currentRule, blkStart, blkEnd));

        const loop = this.newState(PlusLoopbackState.class, plusAST);
        loop.nonGreedy = !(plusAST as QuantifierAST).isGreedy();
        this.atn.defineDecisionState(loop);
        const end = this.newState(LoopEndState.class, plusAST);
        blkStart.loopBackState = loop;
        end.loopBackState = loop;

        plusAST.atnState = loop;
        this.epsilon(blkEnd, loop);		// blk can see loop back

        const blkAST = plusAST.getChild(0) as BlockAST;
        if ((plusAST as QuantifierAST).isGreedy()) {
            if (this.expectNonGreedy(blkAST)) {
                this.g.tool.errMgr.grammarError(ErrorType.EXPECTED_NON_GREEDY_WILDCARD_BLOCK, this.g.fileName, plusAST.getToken(), plusAST.getToken().getText());
            }

            this.epsilon(loop, blkStart);	// loop back to start
            this.epsilon(loop, end);			// or exit
        }
        else {
            // if not greedy, priority to exit branch; make it first
            this.epsilon(loop, end);			// exit
            this.epsilon(loop, blkStart);	// loop back to start
        }

        return new IATNFactory.IStatePair(blkStart, end);
    }

    /**
     * From {@code (blk)*} build {@code ( blk+ )?} with *two* decisions, one for
     * entry and one for choosing alts of {@code blk}.
     *
     * <pre>
     *   |-------------|
     *   v             |
     *   o--[o-blk-o]-&gt;o  o
     *   |                ^
     *   -----------------|
     * </pre>
     *
     * Note that the optional bypass must jump outside the loop as
     * {@code (A|B)*} is not the same thing as {@code (A|B|)+}.
     */

    public star(starAST: GrammarAST, elem: ATNFactory.Handle): ATNFactory.Handle {
        const blkStart = elem.left as StarBlockStartState;
        const blkEnd = elem.right as BlockEndState;
        this.preventEpsilonClosureBlocks.add(new Triple<Rule, ATNState, ATNState>(this.currentRule, blkStart, blkEnd));

        const entry = this.newState(StarLoopEntryState.class, starAST);
        entry.nonGreedy = !(starAST as QuantifierAST).isGreedy();
        this.atn.defineDecisionState(entry);
        const end = this.newState(LoopEndState.class, starAST);
        const loop = this.newState(StarLoopbackState.class, starAST);
        entry.loopBackState = loop;
        end.loopBackState = loop;

        const blkAST = starAST.getChild(0) as BlockAST;
        if ((starAST as QuantifierAST).isGreedy()) {
            if (this.expectNonGreedy(blkAST)) {
                this.g.tool.errMgr.grammarError(ErrorType.EXPECTED_NON_GREEDY_WILDCARD_BLOCK, this.g.fileName, starAST.getToken(), starAST.getToken().getText());
            }

            this.epsilon(entry, blkStart);	// loop enter edge (alt 1)
            this.epsilon(entry, end);		// bypass loop edge (alt 2)
        }
        else {
            // if not greedy, priority to exit branch; make it first
            this.epsilon(entry, end);		// bypass loop edge (alt 1)
            this.epsilon(entry, blkStart);	// loop enter edge (alt 2)
        }
        this.epsilon(blkEnd, loop);		// block end hits loop back
        this.epsilon(loop, entry);		// loop back to entry/exit decision

        starAST.atnState = entry;	// decision is to enter/exit; blk is its own decision

        return new IATNFactory.IStatePair(entry, end);
    }

    /** Build an atom with all possible values in its label. */

    public wildcard(node: GrammarAST): ATNFactory.Handle {
        const left = this.newState(node);
        const right = this.newState(node);
        left.addTransition(new WildcardTransition(right));
        node.atnState = left;

        return new IATNFactory.IStatePair(left, right);
    }

    public addRuleFollowLinks(): void {
        for (const p of this.atn.states) {
            if (p !== null &&
                p.getStateType() === ATNState.BASIC && p.getNumberOfTransitions() === 1 &&
                p.transition(0) instanceof RuleTransition) {
                const rt = p.transition(0) as RuleTransition;
                this.addFollowLink(rt.ruleIndex, rt.followState);
            }
        }
    }

    /**
     * Add an EOF transition to any rule end ATNState that points to nothing
     *  (i.e., for all those rules not invoked by another rule).  These
     *  are start symbols then.
     *
     *  Return the number of grammar entry points; i.e., how many rules are
     *  not invoked by another rule (they can only be invoked from outside).
     *  These are the start rules.
     */
    public addEOFTransitionToStartRules(): number {
        let n = 0;
        const eofTarget = this.newState(null); // one unique EOF target for all rules
        for (const r of this.g.rules.values()) {
            const stop = this.atn.ruleToStopState[r.index];
            if (stop.getNumberOfTransitions() > 0) {
                continue;
            }

            n++;
            const t = new AtomTransition(eofTarget, Token.EOF);
            stop.addTransition(t);
        }

        return n;
    }

    public label(t: ATNFactory.Handle): ATNFactory.Handle {
        return t;
    }

    public listLabel(t: ATNFactory.Handle): ATNFactory.Handle {
        return t;
    }

    public newState(): ATNState;

    public newState(node: GrammarAST): ATNState;

    public newState<T extends ATNState>(nodeType: Class<T>, node: GrammarAST): T;
    public newState<T extends ATNState>(...args: unknown[]): ATNState | T {
        switch (args.length) {
            case 0: {
                return this.newState(null);

                break;
            }

            case 1: {
                const [node] = args as [GrammarAST];

                const n = new BasicState();
                n.setRuleIndex(this.currentRule.index);
                this.atn.addState(n);

                return n;

                break;
            }

            case 2: {
                const [nodeType, node] = args as [Class<T>, GrammarAST];

                let cause: Exception;
                try {
                    const ctor = nodeType.getConstructor();
                    const s = ctor.newInstance();
                    if (this.currentRule === null) {
                        s.setRuleIndex(-1);
                    }

                    else {
                        s.setRuleIndex(this.currentRule.index);
                    }

                    this.atn.addState(s);

                    return s;
                } catch (ex) {
                    if (ex instanceof InstantiationException) {
                        cause = ex;
                    } else if (ex instanceof IllegalAccessException) {
                        cause = ex;
                    } else if (ex instanceof IllegalArgumentException) {
                        cause = ex;
                    } else if (ex instanceof InvocationTargetException) {
                        cause = ex;
                    } else if (ex instanceof NoSuchMethodException) {
                        cause = ex;
                    } else if (ex instanceof SecurityException) {
                        cause = ex;
                    } else {
                        throw ex;
                    }
                }

                const message = string.format("Could not create %s of type %s.", ATNState.class.getName(), nodeType.getName());
                throw new UnsupportedOperationException(message, cause);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public expectNonGreedy(blkAST: BlockAST): boolean {
        if (ParserATNFactory.blockHasWildcardAlt(blkAST)) {
            return true;
        }

        return false;
    }

    public lexerAltCommands(alt: ATNFactory.Handle, cmds: ATNFactory.Handle): ATNFactory.Handle {
        throw new UnsupportedOperationException("This element is not allowed in parsers.");
    }

    public lexerCallCommand(ID: GrammarAST, arg: GrammarAST): ATNFactory.Handle {
        throw new UnsupportedOperationException("This element is not allowed in parsers.");
    }

    public lexerCommand(ID: GrammarAST): ATNFactory.Handle {
        throw new UnsupportedOperationException("This element is not allowed in parsers.");
    }

    protected checkEpsilonClosure(): void {
        for (const pair of this.preventEpsilonClosureBlocks) {
            const analyzer = new LL1Analyzer(this.atn);
            const blkStart = pair.b;
            const blkStop = pair.c;
            const lookahead = analyzer.LOOK(blkStart, blkStop, null);
            if (lookahead.contains(org.antlr.v4.runtime.Token.EPSILON)) {
                const errorType = pair.a instanceof LeftRecursiveRule ? ErrorType.EPSILON_LR_FOLLOW : ErrorType.EPSILON_CLOSURE;
                this.g.tool.errMgr.grammarError(errorType, this.g.fileName, (pair.a.ast.getChild(0) as GrammarAST).getToken(), pair.a.name);
            }
            if (lookahead.contains(org.antlr.v4.runtime.Token.EOF)) {
                this.g.tool.errMgr.grammarError(ErrorType.EOF_CLOSURE, this.g.fileName, (pair.a.ast.getChild(0) as GrammarAST).getToken(), pair.a.name);
            }
        }
    }

    protected _createATN(rules: Collection<Rule>): void {
        this.createRuleStartAndStopATNStates();

        const adaptor = new GrammarASTAdaptor();
        for (const r of rules) {
            // find rule's block
            const blk = r.ast.getFirstChildWithType(ANTLRParser.BLOCK) as GrammarAST;
            const nodes = new CommonTreeNodeStream(adaptor, blk);
            const b = new ATNBuilder(nodes, this);
            try {
                this.setCurrentRuleName(r.name);
                const h = b.ruleBlock(null);
                this.rule(r.ast, r.name, h);
            } catch (re) {
                if (re instanceof RecognitionException) {
                    java.util.logging.ErrorManager.fatalInternalError("bad grammar AST structure", re);
                } else {
                    throw re;
                }
            }
        }
    }

    protected getTokenType(atom: GrammarAST): number {
        let ttype: number;
        if (this.g.isLexer()) {
            ttype = CharSupport.getCharValueFromGrammarCharLiteral(atom.getText());
        }
        else {
            ttype = this.g.getTokenType(atom.getText());
        }

        return ttype;
    }

    protected makeBlock(start: BlockStartState, blkAST: BlockAST, alts: ATNFactory.Handle[]): ATNFactory.Handle {
        const end = this.newState(BlockEndState.class, blkAST);
        start.endState = end;
        for (const alt of alts) {
            // hook alts up to decision block
            this.epsilon(start, alt.left);
            this.epsilon(alt.right, end);
            // no back link in ATN so must walk entire alt to see if we can
            // strip out the epsilon to 'end' state
            const opt = new TailEpsilonRemover(this.atn);
            opt.visit(alt.left);
        }
        const h = new IATNFactory.IStatePair(start, end);
        //		FASerializer ser = new FASerializer(g, h.left);
        //		System.out.println(blkAST.toStringTree()+":\n"+ser);
        blkAST.atnState = start;

        return h;
    }

    /**
     * Define all the rule begin/end ATNStates to solve forward reference
     *  issues.
     */
    protected createRuleStartAndStopATNStates(): void {
        this.atn.ruleToStartState = new Array<RuleStartState>(this.g.rules.size());
        this.atn.ruleToStopState = new Array<RuleStopState>(this.g.rules.size());
        for (const r of this.g.rules.values()) {
            const start = this.newState(RuleStartState.class, r.ast);
            const stop = this.newState(RuleStopState.class, r.ast);
            start.stopState = stop;
            start.isLeftRecursiveRule = r instanceof LeftRecursiveRule;
            start.setRuleIndex(r.index);
            stop.setRuleIndex(r.index);
            this.atn.ruleToStartState[r.index] = start;
            this.atn.ruleToStopState[r.index] = stop;
        }
    }
}
