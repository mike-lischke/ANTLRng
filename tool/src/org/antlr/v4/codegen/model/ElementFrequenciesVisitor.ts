/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { FrequencySet } from "../../misc/FrequencySet.js";
import { MutableInt } from "../../misc/MutableInt.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";
import { AltAST } from "../../tool/ast/AltAST.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { TerminalAST } from "../../tool/ast/TerminalAST.js";

export  class ElementFrequenciesVisitor extends GrammarTreeVisitor {
	/**
	 * This special value means "no set", and is used by {@link #minFrequencies}
	 * to ensure that {@link #combineMin} doesn't merge an empty set (all zeros)
	 * with the results of the first alternative.
	 */
    private static readonly  SENTINEL = new  FrequencySet<string>();

    protected readonly  frequencies:  Deque<FrequencySet<string>>;
    private readonly  minFrequencies:  Deque<FrequencySet<string>>;

    public  constructor(input: TreeNodeStream) {
        super(input);
        this.frequencies = new  ArrayDeque<FrequencySet<string>>();
        this.frequencies.push(new  FrequencySet<string>());
        this.minFrequencies = new  ArrayDeque<FrequencySet<string>>();
        this.minFrequencies.push(ElementFrequenciesVisitor.SENTINEL);
    }

	/*
	 * Common
	 */

	/**
	 * Generate a frequency set as the union of two input sets. If an
	 * element is contained in both sets, the value for the output will be
	 * the maximum of the two input values.
	 *
	 * @param a The first set.
	 * @param b The second set.
	 * @returns The union of the two sets, with the maximum value chosen
	 * whenever both sets contain the same key.
	 */
    protected static  combineMax(a: FrequencySet<string>, b: FrequencySet<string>):  FrequencySet<string> {
        const  result = ElementFrequenciesVisitor.combineAndClip(a, b, 1);
        for (const entry of a.entrySet()) {
            result.get(entry.getKey()).v = entry.getValue().v;
        }

        for (const entry of b.entrySet()) {
            const  slot = result.get(entry.getKey());
            slot.v = Math.max(slot.v, entry.getValue().v);
        }

        return result;
    }

	/**
	 * Generate a frequency set as the union of two input sets. If an
	 * element is contained in both sets, the value for the output will be
	 * the minimum of the two input values.
	 *
	 * @param a The first set.
	 * @param b The second set. If this set is {@link #SENTINEL}, it is treated
	 * as though no second set were provided.
	 * @returns The union of the two sets, with the minimum value chosen
	 * whenever both sets contain the same key.
	 */
    protected static  combineMin(a: FrequencySet<string>, b: FrequencySet<string>):  FrequencySet<string> {
        if (b === ElementFrequenciesVisitor.SENTINEL) {
            return a;
        }

		/* assert a != SENTINEL; */
        const  result = ElementFrequenciesVisitor.combineAndClip(a, b, number.MAX_VALUE);
        for (const entry of result.entrySet()) {
            entry.getValue().v = Math.min(a.count(entry.getKey()), b.count(entry.getKey()));
        }

        return result;
    }

	/**
	 * Generate a frequency set as the union of two input sets, with the
	 * values clipped to a specified maximum value. If an element is
	 * contained in both sets, the value for the output, prior to clipping,
	 * will be the sum of the two input values.
	 *
	 * @param a The first set.
	 * @param b The second set.
	 * @param clip The maximum value to allow for any output.
	 * @returns The sum of the two sets, with the individual elements clipped
	 * to the maximum value given by {@code clip}.
	 */
    protected static  combineAndClip(a: FrequencySet<string>, b: FrequencySet<string>, clip: number):  FrequencySet<string> {
        const  result = new  FrequencySet<string>();
        for (const entry of a.entrySet()) {
            for (let  i = 0; i < entry.getValue().v; i++) {
                result.add(entry.getKey());
            }
        }

        for (const entry of b.entrySet()) {
            for (let  i = 0; i < entry.getValue().v; i++) {
                result.add(entry.getKey());
            }
        }

        for (const entry of result.entrySet()) {
            entry.getValue().v = Math.min(entry.getValue().v, clip);
        }

        return result;
    }

	/** During code gen, we can assume tree is in good shape */
    @Override
    public  getErrorManager():  java.util.logging.ErrorManager { return super.getErrorManager(); }

    @Override
    public  tokenRef(ref: TerminalAST):  void {
        this.frequencies.peek().add(ref.getText());
        this.minFrequencies.peek().add(ref.getText());
    }

    @Override
    public  ruleRef(ref: GrammarAST, arg: ActionAST):  void {
        this.frequencies.peek().add(ref.getText());
        this.minFrequencies.peek().add(ref.getText());
    }

    @Override
    public  stringRef(ref: TerminalAST):  void {
        const  tokenName = ref.g.getTokenName(ref.getText());

        if (tokenName !== null && !tokenName.startsWith("T__")) {
            this.frequencies.peek().add(tokenName);
            this.minFrequencies.peek().add(tokenName);
        }
    }

    protected  getMinFrequencies(): FrequencySet<string> {
		/* assert minFrequencies.size() == 1; */
		/* assert minFrequencies.peek() != SENTINEL; */
		/* assert SENTINEL.isEmpty(); */

        return this.minFrequencies.peek();
    }

	/*
	 * Parser rules
	 */

    @Override
    protected  enterAlternative(tree: AltAST):  void {
        this.frequencies.push(new  FrequencySet<string>());
        this.minFrequencies.push(new  FrequencySet<string>());
    }

    @Override
    protected  exitAlternative(tree: AltAST):  void {
        this.frequencies.push(ElementFrequenciesVisitor.combineMax(this.frequencies.pop(), this.frequencies.pop()));
        this.minFrequencies.push(ElementFrequenciesVisitor.combineMin(this.minFrequencies.pop(), this.minFrequencies.pop()));
    }

    @Override
    protected  enterElement(tree: GrammarAST):  void {
        this.frequencies.push(new  FrequencySet<string>());
        this.minFrequencies.push(new  FrequencySet<string>());
    }

    @Override
    protected  exitElement(tree: GrammarAST):  void {
        this.frequencies.push(ElementFrequenciesVisitor.combineAndClip(this.frequencies.pop(), this.frequencies.pop(), 2));
        this.minFrequencies.push(ElementFrequenciesVisitor.combineAndClip(this.minFrequencies.pop(), this.minFrequencies.pop(), 2));
    }

    @Override
    protected  enterBlockSet(tree: GrammarAST):  void {
        this.frequencies.push(new  FrequencySet<string>());
        this.minFrequencies.push(new  FrequencySet<string>());
    }

    @Override
    protected  exitBlockSet(tree: GrammarAST):  void {
        for (const entry of this.frequencies.peek().entrySet()) {
			// This visitor counts a block set as a sequence of elements, not a
			// sequence of alternatives of elements. Reset the count back to 1
			// for all items when leaving the set to ensure duplicate entries in
			// the set are treated as a maximum of one item.
            entry.getValue().v = 1;
        }

        if (this.minFrequencies.peek().size() > 1) {
			// Everything is optional
            this.minFrequencies.peek().clear();
        }

        this.frequencies.push(ElementFrequenciesVisitor.combineAndClip(this.frequencies.pop(), this.frequencies.pop(), 2));
        this.minFrequencies.push(ElementFrequenciesVisitor.combineAndClip(this.minFrequencies.pop(), this.minFrequencies.pop(), 2));
    }

    @Override
    protected  exitSubrule(tree: GrammarAST):  void {
        if (tree.getType() === CLOSURE || tree.getType() === POSITIVE_CLOSURE) {
            for (const entry of this.frequencies.peek().entrySet()) {
                entry.getValue().v = 2;
            }
        }

        if (tree.getType() === CLOSURE || tree.getType() === javax.security.auth.login.AppConfigurationEntry.LoginModuleControlFlag.OPTIONAL) {
			// Everything inside a closure is optional, so the minimum
			// number of occurrences for all elements is 0.
            this.minFrequencies.peek().clear();
        }
    }

	/*
	 * Lexer rules
	 */

    @Override
    protected  enterLexerAlternative(tree: GrammarAST):  void {
        this.frequencies.push(new  FrequencySet<string>());
        this.minFrequencies.push(new  FrequencySet<string>());
    }

    @Override
    protected  exitLexerAlternative(tree: GrammarAST):  void {
        this.frequencies.push(ElementFrequenciesVisitor.combineMax(this.frequencies.pop(), this.frequencies.pop()));
        this.minFrequencies.push(ElementFrequenciesVisitor.combineMin(this.minFrequencies.pop(), this.minFrequencies.pop()));
    }

    @Override
    protected  enterLexerElement(tree: GrammarAST):  void {
        this.frequencies.push(new  FrequencySet<string>());
        this.minFrequencies.push(new  FrequencySet<string>());
    }

    @Override
    protected  exitLexerElement(tree: GrammarAST):  void {
        this.frequencies.push(ElementFrequenciesVisitor.combineAndClip(this.frequencies.pop(), this.frequencies.pop(), 2));
        this.minFrequencies.push(ElementFrequenciesVisitor.combineAndClip(this.minFrequencies.pop(), this.minFrequencies.pop(), 2));
    }

    @Override
    protected  exitLexerSubrule(tree: GrammarAST):  void {
        if (tree.getType() === CLOSURE || tree.getType() === POSITIVE_CLOSURE) {
            for (const entry of this.frequencies.peek().entrySet()) {
                entry.getValue().v = 2;
            }
        }

        if (tree.getType() === CLOSURE) {
			// Everything inside a closure is optional, so the minimum
			// number of occurrences for all elements is 0.
            this.minFrequencies.peek().clear();
        }
    }
}
