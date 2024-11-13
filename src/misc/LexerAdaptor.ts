/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStream, Lexer, Token } from "antlr4ng";

import { ANTLRv4Lexer } from "../generated/ANTLRv4Lexer.js";

export abstract class LexerAdaptor extends Lexer {
    /**
     *  Generic type for OPTIONS, TOKENS and CHANNELS
     */
    static #PREQUEL_CONSTRUCT = -10;
    static #OPTIONS_CONSTRUCT = -11;

    #currentRuleType: number = Token.INVALID_TYPE;
    // eslint-disable-next-line no-unused-private-class-members
    #insideOptionsBlock = false;

    public constructor(input: CharStream) {
        super(input);

        /**
         * Track whether we are inside of a rule and whether it is lexical parser. _currentRuleType==Token.INVALID_TYPE
         * means that we are outside of a rule. At the first sign of a rule name reference and _currentRuleType
         * ==invalid, we can assume that we are starting a parser rule. Similarly, seeing a token reference when not
         * already in rule means starting a token rule. The terminating ';' of a rule, flips this back to invalid type.
         *
         * This is not perfect logic but works. For example, "grammar T;" means that we start and stop a lexical rule
         * for the "T;". Dangerous but works.
         *
         * The whole point of this state information is to distinguish between [..arg actions..] and [char sets].
         * Char sets can only occur in lexical rules and arg actions cannot occur.
         */
        this.#currentRuleType = Token.INVALID_TYPE;
        this.#insideOptionsBlock = false;
    }

    public override reset(): void {
        this.#currentRuleType = Token.INVALID_TYPE;
        this.#insideOptionsBlock = false;
        super.reset();
    }

    public override emit(): Token {
        if ((this.type === ANTLRv4Lexer.OPTIONS || this.type === ANTLRv4Lexer.TOKENS
            || this.type === ANTLRv4Lexer.CHANNELS)
            && this.#currentRuleType === Token.INVALID_TYPE) {
            // enter prequel construct ending with an RBRACE
            this.#currentRuleType = LexerAdaptor.#PREQUEL_CONSTRUCT;
        } else if (this.type === ANTLRv4Lexer.OPTIONS && this.#currentRuleType === ANTLRv4Lexer.TOKEN_REF) {
            this.#currentRuleType = LexerAdaptor.#OPTIONS_CONSTRUCT;
        } else if (this.type === ANTLRv4Lexer.RBRACE
            && this.#currentRuleType === LexerAdaptor.#PREQUEL_CONSTRUCT) {
            // exit prequel construct
            this.#currentRuleType = Token.INVALID_TYPE;
        } else if (this.type === ANTLRv4Lexer.RBRACE
            && this.#currentRuleType === LexerAdaptor.#OPTIONS_CONSTRUCT) {
            // exit options
            this.#currentRuleType = ANTLRv4Lexer.TOKEN_REF;
        } else if (this.type === ANTLRv4Lexer.AT && this.#currentRuleType === Token.INVALID_TYPE) { // enter action
            this.#currentRuleType = ANTLRv4Lexer.AT;
        } else if (this.type === ANTLRv4Lexer.SEMI
            && this.#currentRuleType === LexerAdaptor.#OPTIONS_CONSTRUCT) {
            // ';' in options { .... }. Don't change anything.
        } else if (this.type === ANTLRv4Lexer.END_ACTION && this.#currentRuleType === ANTLRv4Lexer.AT) { // exit action
            this.#currentRuleType = Token.INVALID_TYPE;
        } else if (this.type === ANTLRv4Lexer.ID) {
            const firstChar = this.inputStream.getTextFromRange(this.tokenStartCharIndex, this.tokenStartCharIndex);
            const c = firstChar.charAt(0);
            if (c === c.toUpperCase()) {
                this.type = ANTLRv4Lexer.TOKEN_REF;
            } else {
                this.type = ANTLRv4Lexer.RULE_REF;
            }

            if (this.#currentRuleType === Token.INVALID_TYPE) { // if outside of rule def
                this.#currentRuleType = this.type; // set to inside lexer or parser rule
            }
        } else if (this.type === ANTLRv4Lexer.SEMI) { // exit rule def
            this.#currentRuleType = Token.INVALID_TYPE;
        }

        return super.emit();
    }

    protected handleBeginArgument(): void {
        if (this.#currentRuleType === ANTLRv4Lexer.TOKEN_REF) {
            this.pushMode(ANTLRv4Lexer.LexerCharSet);
            this.more();
        } else {
            this.pushMode(ANTLRv4Lexer.Argument);
        }
    }

    protected handleEndArgument(): void {
        this.popMode();
        if (this.modeStack.length > 0) {
            this.type = ANTLRv4Lexer.ARGUMENT_CONTENT;
        }
    }

    protected handleEndAction(): void {
        const oldMode = this.mode;
        const newMode = this.popMode();
        const isActionWithinAction = this.modeStack.length > 0
            && newMode === ANTLRv4Lexer.TargetLanguageAction
            && oldMode === newMode;

        if (isActionWithinAction) {
            this.type = ANTLRv4Lexer.ACTION_CONTENT;
        }
    }
}
