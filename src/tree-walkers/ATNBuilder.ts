/*
* Copyright (c) The ANTLR Project. All rights reserved.
* Use of this file is governed by the BSD 3-clause license that
* can be found in the LICENSE.txt file in the project root.
*/

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { RecognitionException, type ParserRuleContext } from "antlr4ng";

import { ANTLRv4Lexer } from "../generated/ANTLRv4Lexer.js";
import { AlternativeContext, BlockContext, LabeledAltContext, RuleBlockContext, RuleSpecContext, type ElementContext, type LexerAltContext, type LexerCommandContext, type LexerCommandsContext } from "../generated/ANTLRv4Parser.js";

import { IATNFactory, type IStatePair } from "../../tool/src/org/antlr/v4/automata/ATNFactory.js";
import type { GrammarAST } from "../../tool/src/org/antlr/v4/tool/ast/GrammarAST.js";

export class ATNBuilder {
    public static element_return = class element_return extends TreeRuleReturnScope {
        public p: IStatePair;
    };

    public static subrule_return = class subrule_return extends TreeRuleReturnScope {
        public p: IStatePair;
    };

    public static blockSet_return = class blockSet_return extends TreeRuleReturnScope {
        public p: IStatePair;
    };

    public static setElement_return = class setElement_return extends TreeRuleReturnScope {
    };

    public static atom_return = class atom_return extends TreeRuleReturnScope {
        public p: IStatePair;
    };

    public static terminal_return = class terminal_return extends TreeRuleReturnScope {
        public p: IStatePair;
    };

    public constructor(protected factory: IATNFactory, private root: RuleSpecContext) {
    }

    public ruleBlock(ebnfRoot: GrammarAST, ruleBlock: RuleBlockContext): IStatePair | undefined { // Four outer blocks.
        let p: IStatePair | undefined;

        const alts = new Array<IStatePair>();
        let alt = 1;
        this.factory.setCurrentOuterAlt(alt);

        for (const labledAlt of ruleBlock.ruleAltList().labeledAlt()) {
            alts.push(this.alternative(labledAlt.alternative()));
            this.factory.setCurrentOuterAlt(++alt);
        }

        return this.factory.block(BLOCK1 as BlockAST, ebnfRoot, alts);
    }

    public block(ebnfRoot: GrammarAST, block: BlockContext): IStatePair { // For inner blocks.
        const p = null;

        const BLOCK2 = null;
        const a = null;

        const alts = new Array<IStatePair>();
        for (const alt of block.altList().alternative()) {
            alts.push(this.alternative(alt));
        }

        return this.factory.block(BLOCK2 as BlockAST, ebnfRoot, alts);
    }

    public alternative(context: AlternativeContext | LexerAltContext): IStatePair {
        let p = null;

        let EPSILON4 = null;
        let a = null;
        let e = null;
        let lexerCommands3 = null;

        const els = new Array<IStatePair>();

        if (context instanceof AlternativeContext) {
            // Parser alternative.
        } else {
            // Lexer alternative.
            a = this.alternative(context.alt);
            p = this.factory.lexerAltCommands(a, lexerCommands3);
        }

        try {
            // org/antlr/v4/parse/ATNBuilder.g:105:5: ( ^( LEXER_ALT_ACTION a= alternative lexerCommands ) | ^( ALT ( elementOptions )? EPSILON ) | ^( ALT ( elementOptions )? (e= element )+ ) )
            let alt10 = 3;
            alt10 = this.dfa10.predict(input);
            switch (alt10) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:105:7: ^( LEXER_ALT_ACTION a= alternative lexerCommands )
                    {
                        this.match(input, ATNBuilder.LEXER_ALT_ACTION, ATNBuilder.FOLLOW_LEXER_ALT_ACTION_in_alternative263);
                        this.match(input, Token.DOWN, null);
                        pushFollow(ATNBuilder.FOLLOW_alternative_in_alternative267);
                        a = this.alternative();
                        this.#fsp--;

                        pushFollow(ATNBuilder.FOLLOW_lexerCommands_in_alternative269);
                        lexerCommands3 = this.lexerCommands();
                        this.#fsp--;

                        this.match(input, Token.UP, null);

                        p = this.factory.lexerAltCommands(a, lexerCommands3);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:107:7: ^( ALT ( elementOptions )? EPSILON )
                    {
                        this.match(input, ATNBuilder.ALT, ATNBuilder.FOLLOW_ALT_in_alternative289);
                        this.match(input, Token.DOWN, null);
                        // org/antlr/v4/parse/ATNBuilder.g:107:13: ( elementOptions )?
                        let alt7 = 2;
                        const LA7_0 = this.inputStream.LA(1);
                        if ((LA7_0 === ATNBuilder.ELEMENT_OPTIONS)) {
                            alt7 = 1;
                        }
                        switch (alt7) {
                            case 1: {
                                // org/antlr/v4/parse/ATNBuilder.g:107:13: elementOptions
                                {
                                    pushFollow(ATNBuilder.FOLLOW_elementOptions_in_alternative291);
                                    this.elementOptions();
                                    this.#fsp--;

                                }
                                break;
                            }

                            default:

                        }

                        EPSILON4 = this.match(input, ATNBuilder.EPSILON, ATNBuilder.FOLLOW_EPSILON_in_alternative294) as GrammarAST;
                        this.match(input, Token.UP, null);

                        p = this.factory.epsilon(EPSILON4);
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:108:9: ^( ALT ( elementOptions )? (e= element )+ )
                    {
                        this.match(input, ATNBuilder.ALT, ATNBuilder.FOLLOW_ALT_in_alternative314);
                        this.match(input, Token.DOWN, null);
                        // org/antlr/v4/parse/ATNBuilder.g:108:15: ( elementOptions )?
                        let alt8 = 2;
                        const LA8_0 = this.inputStream.LA(1);
                        if ((LA8_0 === ATNBuilder.ELEMENT_OPTIONS)) {
                            alt8 = 1;
                        }
                        switch (alt8) {
                            case 1: {
                                // org/antlr/v4/parse/ATNBuilder.g:108:15: elementOptions
                                {
                                    pushFollow(ATNBuilder.FOLLOW_elementOptions_in_alternative316);
                                    this.elementOptions();
                                    this.#fsp--;

                                }
                                break;
                            }

                            default:

                        }

                        // org/antlr/v4/parse/ATNBuilder.g:108:31: (e= element )+
                        let cnt9 = 0;
                        loop9:
                        while (true) {
                            let alt9 = 2;
                            const LA9_0 = this.inputStream.LA(1);
                            if ((LA9_0 === ATNBuilder.ACTION || LA9_0 === ATNBuilder.ASSIGN || LA9_0 === ATNBuilder.DOT || LA9_0 === ATNBuilder.LEXER_CHAR_SET || LA9_0 === ATNBuilder.NOT || LA9_0 === ATNBuilder.PLUS_ASSIGN || LA9_0 === ATNBuilder.RANGE || LA9_0 === ATNBuilder.RULE_REF || LA9_0 === ATNBuilder.SEMPRED || LA9_0 === ATNBuilder.STRING_LITERAL || LA9_0 === ATNBuilder.TOKEN_REF || (LA9_0 >= ATNBuilder.BLOCK && LA9_0 <= ATNBuilder.CLOSURE) || (LA9_0 >= ATNBuilder.OPTIONAL && LA9_0 <= ATNBuilder.POSITIVE_CLOSURE) || (LA9_0 >= ATNBuilder.SET && LA9_0 <= ATNBuilder.WILDCARD))) {
                                alt9 = 1;
                            }

                            switch (alt9) {
                                case 1: {
                                    // org/antlr/v4/parse/ATNBuilder.g:108:32: e= element
                                    {
                                        pushFollow(ATNBuilder.FOLLOW_element_in_alternative322);
                                        e = this.element();
                                        this.#fsp--;

                                        els.add((e !== null ? (e).p : null));
                                    }
                                    break;
                                }

                                default: {
                                    if (cnt9 >= 1) {
                                        break loop9;
                                    }

                                    const eee = new EarlyExitException(9, input);
                                    throw eee;
                                }

                            }
                            cnt9++;
                        }

                        this.match(input, Token.UP, null);

                        p = this.factory.alt(els);
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return p;
    }

    public lexerCommands(context: LexerCommandsContext): IStatePair {
        const cmds = new Array<IStatePair>();
        for (const lexerCommand of context.lexerCommand()) {
            const cmd = this.lexerCommand(lexerCommand);
            if (cmd !== null) {
                cmds.push(cmd);
            }
        }

        return this.factory.alt(cmds);

    }

    public lexerCommand(context: LexerCommandContext): IStatePair {
        if (context.lexerCommandExpr() !== null) {
            const lexerCommandExpr = context.lexerCommandExpr()!;

            return this.factory.lexerCallCommand(context.lexerCommandName(), lexerCommandExpr.start);
        } else {
            return this.factory.lexerCommand(context.lexerCommandName());
        }
    }

    public element(context: ElementContext): IStatePair {
        if (context.labeledElement() !== null) {
            return this.labeledElement(context.labeledElement());
        }

        if (context.atom() !== null) {
            return this.atom(context.atom());
        }

        if (context.subrule() !== null) {
            return this.subrule(context.subrule());
        }

        if (context.ACTION() !== null) {
            return this.factory.action(context.ACTION());
        }

        if (context.SEMPRED() !== null) {
            return this.factory.sempred(context.SEMPRED());
        }

        if (context.NOT() !== null) {
            return this.factory.notSet(this.blockSet(context.NOT().start));
        }

        let ACTION11 = null;
        let SEMPRED12 = null;
        let ACTION13 = null;
        let SEMPRED14 = null;
        let b = null;
        let labeledElement8 = null;
        let atom9 = null;
        let subrule10 = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:132:2: ( labeledElement | atom | subrule | ACTION | SEMPRED | ^( ACTION . ) | ^( SEMPRED . ) | ^( NOT b= blockSet[true] ) | LEXER_CHAR_SET )
            let alt13 = 9;
            switch (input.LA(1)) {
                case ASSIGN:
                case PLUS_ASSIGN: {
                    {
                        alt13 = 1;
                    }
                    break;
                }

                case DOT:
                case RANGE:
                case RULE_REF:
                case STRING_LITERAL:
                case TOKEN_REF:
                case SET:
                case WILDCARD: {
                    {
                        alt13 = 2;
                    }
                    break;
                }

                case BLOCK:
                case CLOSURE:
                case javax.security.auth.login.AppConfigurationEntry.LoginModuleControlFlag.OPTIONAL:
                case POSITIVE_CLOSURE: {
                    {
                        alt13 = 3;
                    }
                    break;
                }

                case ACTION: {
                    {
                        const LA13_4 = this.inputStream.LA(2);
                        if ((LA13_4 === DOWN)) {
                            alt13 = 6;
                        }
                        else {
                            if (((LA13_4 >= UP && LA13_4 <= ATNBuilder.ACTION) || LA13_4 === ATNBuilder.ASSIGN || LA13_4 === ATNBuilder.DOT || LA13_4 === ATNBuilder.LEXER_CHAR_SET || LA13_4 === ATNBuilder.NOT || LA13_4 === ATNBuilder.PLUS_ASSIGN || LA13_4 === ATNBuilder.RANGE || LA13_4 === ATNBuilder.RULE_REF || LA13_4 === ATNBuilder.SEMPRED || LA13_4 === ATNBuilder.STRING_LITERAL || LA13_4 === ATNBuilder.TOKEN_REF || (LA13_4 >= ATNBuilder.BLOCK && LA13_4 <= ATNBuilder.CLOSURE) || (LA13_4 >= ATNBuilder.OPTIONAL && LA13_4 <= ATNBuilder.POSITIVE_CLOSURE) || (LA13_4 >= ATNBuilder.SET && LA13_4 <= ATNBuilder.WILDCARD))) {
                                alt13 = 4;
                            }

                            else {
                                const nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    const nvae =
                                        new NoViableAltException("", 13, 4, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }

                    }
                    break;
                }

                case SEMPRED: {
                    {
                        const LA13_5 = this.inputStream.LA(2);
                        if ((LA13_5 === DOWN)) {
                            alt13 = 7;
                        }
                        else {
                            if (((LA13_5 >= UP && LA13_5 <= ATNBuilder.ACTION) || LA13_5 === ATNBuilder.ASSIGN || LA13_5 === ATNBuilder.DOT || LA13_5 === ATNBuilder.LEXER_CHAR_SET || LA13_5 === ATNBuilder.NOT || LA13_5 === ATNBuilder.PLUS_ASSIGN || LA13_5 === ATNBuilder.RANGE || LA13_5 === ATNBuilder.RULE_REF || LA13_5 === ATNBuilder.SEMPRED || LA13_5 === ATNBuilder.STRING_LITERAL || LA13_5 === ATNBuilder.TOKEN_REF || (LA13_5 >= ATNBuilder.BLOCK && LA13_5 <= ATNBuilder.CLOSURE) || (LA13_5 >= ATNBuilder.OPTIONAL && LA13_5 <= ATNBuilder.POSITIVE_CLOSURE) || (LA13_5 >= ATNBuilder.SET && LA13_5 <= ATNBuilder.WILDCARD))) {
                                alt13 = 5;
                            }

                            else {
                                const nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    const nvae =
                                        new NoViableAltException("", 13, 5, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }

                    }
                    break;
                }

                case NOT: {
                    {
                        alt13 = 8;
                    }
                    break;
                }

                case LEXER_CHAR_SET: {
                    {
                        alt13 = 9;
                    }
                    break;
                }

                default: {
                    const nvae =
                        new NoViableAltException("", 13, 0, input);
                    throw nvae;
                }

            }
            switch (alt13) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:132:4: labeledElement
                    {
                        pushFollow(ATNBuilder.FOLLOW_labeledElement_in_element454);
                        labeledElement8 = this.labeledElement();
                        this.#fsp--;

                        retval.p = labeledElement8;
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:133:4: atom
                    {
                        pushFollow(ATNBuilder.FOLLOW_atom_in_element464);
                        atom9 = this.atom();
                        this.#fsp--;

                        retval.p = (atom9 !== null ? (atom9).p : null);
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:134:4: subrule
                    {
                        pushFollow(ATNBuilder.FOLLOW_subrule_in_element476);
                        subrule10 = this.subrule();
                        this.#fsp--;

                        retval.p = (subrule10 !== null ? (subrule10).p : null);
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:135:6: ACTION
                    {
                        ACTION11 = this.match(input, ATNBuilder.ACTION, ATNBuilder.FOLLOW_ACTION_in_element490) as GrammarAST;
                        retval.p = this.factory.action(ACTION11 as ActionAST);
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/ATNBuilder.g:136:6: SEMPRED
                    {
                        SEMPRED12 = this.match(input, ATNBuilder.SEMPRED, ATNBuilder.FOLLOW_SEMPRED_in_element504) as GrammarAST;
                        retval.p = this.factory.sempred(SEMPRED12 as PredAST);
                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/ATNBuilder.g:137:6: ^( ACTION . )
                    {
                        ACTION13 = this.match(input, ATNBuilder.ACTION, ATNBuilder.FOLLOW_ACTION_in_element519) as GrammarAST;
                        this.match(input, Token.DOWN, null);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                        retval.p = this.factory.action(ACTION13 as ActionAST);
                    }
                    break;
                }

                case 7: {
                    // org/antlr/v4/parse/ATNBuilder.g:138:6: ^( SEMPRED . )
                    {
                        SEMPRED14 = this.match(input, ATNBuilder.SEMPRED, ATNBuilder.FOLLOW_SEMPRED_in_element536) as GrammarAST;
                        this.match(input, Token.DOWN, null);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                        retval.p = this.factory.sempred(SEMPRED14 as PredAST);
                    }
                    break;
                }

                case 8: {
                    // org/antlr/v4/parse/ATNBuilder.g:139:7: ^( NOT b= blockSet[true] )
                    {
                        this.match(input, ATNBuilder.NOT, ATNBuilder.FOLLOW_NOT_in_element553);
                        this.match(input, Token.DOWN, null);
                        pushFollow(ATNBuilder.FOLLOW_blockSet_in_element557);
                        b = this.blockSet(true);
                        this.#fsp--;

                        this.match(input, Token.UP, null);

                        retval.p = (b !== null ? (b).p : null);
                    }
                    break;
                }

                case 9: {
                    // org/antlr/v4/parse/ATNBuilder.g:140:7: LEXER_CHAR_SET
                    {
                        this.match(input, ATNBuilder.LEXER_CHAR_SET, ATNBuilder.FOLLOW_LEXER_CHAR_SET_in_element570);
                        retval.p = this.factory.charSetLiteral((retval.start as GrammarAST));
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return retval;
    }

    public astOperand(): IStatePair {
        let p = null;

        let atom15 = null;
        let blockSet16 = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:144:2: ( atom | ^( NOT blockSet[true] ) )
            let alt14 = 2;
            const LA14_0 = this.inputStream.LA(1);
            if ((LA14_0 === ATNBuilder.DOT || LA14_0 === ATNBuilder.RANGE || LA14_0 === ATNBuilder.RULE_REF || LA14_0 === ATNBuilder.STRING_LITERAL || LA14_0 === ATNBuilder.TOKEN_REF || (LA14_0 >= ATNBuilder.SET && LA14_0 <= ATNBuilder.WILDCARD))) {
                alt14 = 1;
            }
            else {
                if ((LA14_0 === ATNBuilder.NOT)) {
                    alt14 = 2;
                }

                else {
                    const nvae =
                        new NoViableAltException("", 14, 0, input);
                    throw nvae;
                }
            }

            switch (alt14) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:144:4: atom
                    {
                        pushFollow(ATNBuilder.FOLLOW_atom_in_astOperand590);
                        atom15 = this.atom();
                        this.#fsp--;

                        p = (atom15 !== null ? (atom15).p : null);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:145:4: ^( NOT blockSet[true] )
                    {
                        this.match(input, ATNBuilder.NOT, ATNBuilder.FOLLOW_NOT_in_astOperand603);
                        this.match(input, Token.DOWN, null);
                        pushFollow(ATNBuilder.FOLLOW_blockSet_in_astOperand605);
                        blockSet16 = this.blockSet(true);
                        this.#fsp--;

                        this.match(input, Token.UP, null);

                        p = (blockSet16 !== null ? (blockSet16).p : null);
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return p;
    }

    public labeledElement(): IStatePair {
        let p = null;

        let element17 = null;
        let element18 = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:149:2: ( ^( ASSIGN ID element ) | ^( PLUS_ASSIGN ID element ) )
            let alt15 = 2;
            const LA15_0 = this.inputStream.LA(1);
            if ((LA15_0 === ATNBuilder.ASSIGN)) {
                alt15 = 1;
            }
            else {
                if ((LA15_0 === ATNBuilder.PLUS_ASSIGN)) {
                    alt15 = 2;
                }

                else {
                    const nvae =
                        new NoViableAltException("", 15, 0, input);
                    throw nvae;
                }
            }

            switch (alt15) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:149:4: ^( ASSIGN ID element )
                    {
                        this.match(input, ATNBuilder.ASSIGN, ATNBuilder.FOLLOW_ASSIGN_in_labeledElement626);
                        this.match(input, Token.DOWN, null);
                        this.match(input, ATNBuilder.ID, ATNBuilder.FOLLOW_ID_in_labeledElement628);
                        pushFollow(ATNBuilder.FOLLOW_element_in_labeledElement630);
                        element17 = this.element();
                        this.#fsp--;

                        this.match(input, Token.UP, null);

                        p = this.factory.label((element17 !== null ? (element17).p : null));
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:150:4: ^( PLUS_ASSIGN ID element )
                    {
                        this.match(input, ATNBuilder.PLUS_ASSIGN, ATNBuilder.FOLLOW_PLUS_ASSIGN_in_labeledElement643);
                        this.match(input, Token.DOWN, null);
                        this.match(input, ATNBuilder.ID, ATNBuilder.FOLLOW_ID_in_labeledElement645);
                        pushFollow(ATNBuilder.FOLLOW_element_in_labeledElement647);
                        element18 = this.element();
                        this.#fsp--;

                        this.match(input, Token.UP, null);

                        p = this.factory.listLabel((element18 !== null ? (element18).p : null));
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return p;
    }

    public subrule(): ATNBuilder.subrule_return {
        const retval = new ATNBuilder.subrule_return();
        retval.start = input.LT(1);

        let block19 = null;
        let block20 = null;
        let block21 = null;
        let block22 = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:154:2: ( ^( OPTIONAL block[$start] ) | ^( CLOSURE block[$start] ) | ^( POSITIVE_CLOSURE block[$start] ) | block[null] )
            let alt16 = 4;
            switch (input.LA(1)) {
                case javax.security.auth.login.AppConfigurationEntry.LoginModuleControlFlag.OPTIONAL: {
                    {
                        alt16 = 1;
                    }
                    break;
                }

                case CLOSURE: {
                    {
                        alt16 = 2;
                    }
                    break;
                }

                case POSITIVE_CLOSURE: {
                    {
                        alt16 = 3;
                    }
                    break;
                }

                case BLOCK: {
                    {
                        alt16 = 4;
                    }
                    break;
                }

                default: {
                    const nvae =
                        new NoViableAltException("", 16, 0, input);
                    throw nvae;
                }

            }
            switch (alt16) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:154:4: ^( OPTIONAL block[$start] )
                    {
                        this.match(input, ATNBuilder.OPTIONAL, ATNBuilder.FOLLOW_OPTIONAL_in_subrule668);
                        this.match(input, Token.DOWN, null);
                        pushFollow(ATNBuilder.FOLLOW_block_in_subrule670);
                        block19 = this.block((retval.start as GrammarAST));
                        this.#fsp--;

                        this.match(input, Token.UP, null);

                        retval.p = block19;
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:155:4: ^( CLOSURE block[$start] )
                    {
                        this.match(input, ATNBuilder.CLOSURE, ATNBuilder.FOLLOW_CLOSURE_in_subrule682);
                        this.match(input, Token.DOWN, null);
                        pushFollow(ATNBuilder.FOLLOW_block_in_subrule684);
                        block20 = this.block((retval.start as GrammarAST));
                        this.#fsp--;

                        this.match(input, Token.UP, null);

                        retval.p = block20;
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:156:4: ^( POSITIVE_CLOSURE block[$start] )
                    {
                        this.match(input, ATNBuilder.POSITIVE_CLOSURE, ATNBuilder.FOLLOW_POSITIVE_CLOSURE_in_subrule696);
                        this.match(input, Token.DOWN, null);
                        pushFollow(ATNBuilder.FOLLOW_block_in_subrule698);
                        block21 = this.block((retval.start as GrammarAST));
                        this.#fsp--;

                        this.match(input, Token.UP, null);

                        retval.p = block21;
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:157:5: block[null]
                    {
                        pushFollow(ATNBuilder.FOLLOW_block_in_subrule708);
                        block22 = this.block(null);
                        this.#fsp--;

                        retval.p = block22;
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return retval;
    }

    public blockSet(invert: boolean): ATNBuilder.blockSet_return {
        const retval = new ATNBuilder.blockSet_return();
        retval.start = input.LT(1);

        let setElement23 = null;

        const alts = new Array<GrammarAST>();
        try {
            // org/antlr/v4/parse/ATNBuilder.g:162:2: ( ^( SET ( setElement )+ ) )
            // org/antlr/v4/parse/ATNBuilder.g:162:4: ^( SET ( setElement )+ )
            {
                this.match(input, ATNBuilder.SET, ATNBuilder.FOLLOW_SET_in_blockSet742);
                this.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/ATNBuilder.g:162:10: ( setElement )+
                let cnt17 = 0;
                loop17:
                while (true) {
                    let alt17 = 2;
                    const LA17_0 = this.inputStream.LA(1);
                    if ((LA17_0 === ATNBuilder.LEXER_CHAR_SET || LA17_0 === ATNBuilder.RANGE || LA17_0 === ATNBuilder.STRING_LITERAL || LA17_0 === ATNBuilder.TOKEN_REF)) {
                        alt17 = 1;
                    }

                    switch (alt17) {
                        case 1: {
                            // org/antlr/v4/parse/ATNBuilder.g:162:11: setElement
                            {
                                pushFollow(ATNBuilder.FOLLOW_setElement_in_blockSet745);
                                setElement23 = this.setElement();
                                this.#fsp--;

                                alts.add((setElement23 !== null ? (setElement23.start as GrammarAST) : null));
                            }
                            break;
                        }

                        default: {
                            if (cnt17 >= 1) {
                                break loop17;
                            }

                            const eee = new EarlyExitException(17, input);
                            throw eee;
                        }

                    }
                    cnt17++;
                }

                this.match(input, Token.UP, null);

                retval.p = this.factory.set((retval.start as GrammarAST), alts, invert);
            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return retval;
    }

    public setElement(): ATNBuilder.setElement_return {
        const retval = new ATNBuilder.setElement_return();
        retval.start = input.LT(1);

        let a = null;
        let b = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:167:2: ( ^( STRING_LITERAL . ) | ^( TOKEN_REF . ) | STRING_LITERAL | TOKEN_REF | ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) | LEXER_CHAR_SET )
            let alt18 = 6;
            switch (input.LA(1)) {
                case STRING_LITERAL: {
                    {
                        const LA18_1 = this.inputStream.LA(2);
                        if ((LA18_1 === DOWN)) {
                            alt18 = 1;
                        }
                        else {
                            if ((LA18_1 === UP || LA18_1 === ATNBuilder.LEXER_CHAR_SET || LA18_1 === ATNBuilder.RANGE || LA18_1 === ATNBuilder.STRING_LITERAL || LA18_1 === ATNBuilder.TOKEN_REF)) {
                                alt18 = 3;
                            }

                            else {
                                const nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    const nvae =
                                        new NoViableAltException("", 18, 1, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }

                    }
                    break;
                }

                case TOKEN_REF: {
                    {
                        const LA18_2 = this.inputStream.LA(2);
                        if ((LA18_2 === DOWN)) {
                            alt18 = 2;
                        }
                        else {
                            if ((LA18_2 === UP || LA18_2 === ATNBuilder.LEXER_CHAR_SET || LA18_2 === ATNBuilder.RANGE || LA18_2 === ATNBuilder.STRING_LITERAL || LA18_2 === ATNBuilder.TOKEN_REF)) {
                                alt18 = 4;
                            }

                            else {
                                const nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    const nvae =
                                        new NoViableAltException("", 18, 2, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }

                    }
                    break;
                }

                case RANGE: {
                    {
                        alt18 = 5;
                    }
                    break;
                }

                case LEXER_CHAR_SET: {
                    {
                        alt18 = 6;
                    }
                    break;
                }

                default: {
                    const nvae =
                        new NoViableAltException("", 18, 0, input);
                    throw nvae;
                }

            }
            switch (alt18) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:167:4: ^( STRING_LITERAL . )
                    {
                        this.match(input, ATNBuilder.STRING_LITERAL, ATNBuilder.FOLLOW_STRING_LITERAL_in_setElement766);
                        this.match(input, Token.DOWN, null);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:168:4: ^( TOKEN_REF . )
                    {
                        this.match(input, ATNBuilder.TOKEN_REF, ATNBuilder.FOLLOW_TOKEN_REF_in_setElement775);
                        this.match(input, Token.DOWN, null);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:169:4: STRING_LITERAL
                    {
                        this.match(input, ATNBuilder.STRING_LITERAL, ATNBuilder.FOLLOW_STRING_LITERAL_in_setElement783);
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:170:4: TOKEN_REF
                    {
                        this.match(input, ATNBuilder.TOKEN_REF, ATNBuilder.FOLLOW_TOKEN_REF_in_setElement788);
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/ATNBuilder.g:171:4: ^( RANGE a= STRING_LITERAL b= STRING_LITERAL )
                    {
                        this.match(input, ATNBuilder.RANGE, ATNBuilder.FOLLOW_RANGE_in_setElement794);
                        this.match(input, Token.DOWN, null);
                        a = this.match(input, ATNBuilder.STRING_LITERAL, ATNBuilder.FOLLOW_STRING_LITERAL_in_setElement798) as GrammarAST;
                        b = this.match(input, ATNBuilder.STRING_LITERAL, ATNBuilder.FOLLOW_STRING_LITERAL_in_setElement802) as GrammarAST;
                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/ATNBuilder.g:172:9: LEXER_CHAR_SET
                    {
                        this.match(input, ATNBuilder.LEXER_CHAR_SET, ATNBuilder.FOLLOW_LEXER_CHAR_SET_in_setElement813);
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return retval;
    }

    public atom(): ATNBuilder.atom_return {
        const retval = new ATNBuilder.atom_return();
        retval.start = input.LT(1);

        let range24 = null;
        let terminal25 = null;
        let ruleref26 = null;
        let blockSet27 = null;
        let terminal28 = null;
        let ruleref29 = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:176:2: ( range | ^( DOT ID terminal ) | ^( DOT ID ruleref ) | ^( WILDCARD . ) | WILDCARD | blockSet[false] | terminal | ruleref )
            let alt19 = 8;
            switch (input.LA(1)) {
                case RANGE: {
                    {
                        alt19 = 1;
                    }
                    break;
                }

                case DOT: {
                    {
                        const LA19_2 = this.inputStream.LA(2);
                        if ((LA19_2 === DOWN)) {
                            const LA19_7 = this.inputStream.LA(3);
                            if ((LA19_7 === ATNBuilder.ID)) {
                                const LA19_10 = this.inputStream.LA(4);
                                if ((LA19_10 === ATNBuilder.STRING_LITERAL || LA19_10 === ATNBuilder.TOKEN_REF)) {
                                    alt19 = 2;
                                }
                                else {
                                    if ((LA19_10 === ATNBuilder.RULE_REF)) {
                                        alt19 = 3;
                                    }

                                    else {
                                        const nvaeMark = input.mark();
                                        try {
                                            for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                                input.consume();
                                            }
                                            const nvae =
                                                new NoViableAltException("", 19, 10, input);
                                            throw nvae;
                                        } finally {
                                            input.rewind(nvaeMark);
                                        }
                                    }
                                }

                            }

                            else {
                                const nvaeMark = input.mark();
                                try {
                                    for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                        input.consume();
                                    }
                                    const nvae =
                                        new NoViableAltException("", 19, 7, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }

                        }

                        else {
                            const nvaeMark = input.mark();
                            try {
                                input.consume();
                                const nvae =
                                    new NoViableAltException("", 19, 2, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }

                    }
                    break;
                }

                case WILDCARD: {
                    {
                        const LA19_3 = this.inputStream.LA(2);
                        if ((LA19_3 === DOWN)) {
                            alt19 = 4;
                        }
                        else {
                            if ((LA19_3 === ATNBuilder.EOF || (LA19_3 >= UP && LA19_3 <= ATNBuilder.ACTION) || LA19_3 === ATNBuilder.ASSIGN || LA19_3 === ATNBuilder.DOT || LA19_3 === ATNBuilder.LEXER_CHAR_SET || LA19_3 === ATNBuilder.NOT || LA19_3 === ATNBuilder.PLUS_ASSIGN || LA19_3 === ATNBuilder.RANGE || LA19_3 === ATNBuilder.RULE_REF || LA19_3 === ATNBuilder.SEMPRED || LA19_3 === ATNBuilder.STRING_LITERAL || LA19_3 === ATNBuilder.TOKEN_REF || (LA19_3 >= ATNBuilder.BLOCK && LA19_3 <= ATNBuilder.CLOSURE) || (LA19_3 >= ATNBuilder.OPTIONAL && LA19_3 <= ATNBuilder.POSITIVE_CLOSURE) || (LA19_3 >= ATNBuilder.SET && LA19_3 <= ATNBuilder.WILDCARD))) {
                                alt19 = 5;
                            }

                            else {
                                const nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    const nvae =
                                        new NoViableAltException("", 19, 3, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }

                    }
                    break;
                }

                case SET: {
                    {
                        alt19 = 6;
                    }
                    break;
                }

                case STRING_LITERAL:
                case TOKEN_REF: {
                    {
                        alt19 = 7;
                    }
                    break;
                }

                case RULE_REF: {
                    {
                        alt19 = 8;
                    }
                    break;
                }

                default: {
                    const nvae =
                        new NoViableAltException("", 19, 0, input);
                    throw nvae;
                }

            }
            switch (alt19) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:176:4: range
                    {
                        pushFollow(ATNBuilder.FOLLOW_range_in_atom828);
                        range24 = this.range();
                        this.#fsp--;

                        retval.p = range24;
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:177:4: ^( DOT ID terminal )
                    {
                        this.match(input, ATNBuilder.DOT, ATNBuilder.FOLLOW_DOT_in_atom840);
                        this.match(input, Token.DOWN, null);
                        this.match(input, ATNBuilder.ID, ATNBuilder.FOLLOW_ID_in_atom842);
                        pushFollow(ATNBuilder.FOLLOW_terminal_in_atom844);
                        terminal25 = this.terminal();
                        this.#fsp--;

                        this.match(input, Token.UP, null);

                        retval.p = (terminal25 !== null ? (terminal25).p : null);
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:178:4: ^( DOT ID ruleref )
                    {
                        this.match(input, ATNBuilder.DOT, ATNBuilder.FOLLOW_DOT_in_atom854);
                        this.match(input, Token.DOWN, null);
                        this.match(input, ATNBuilder.ID, ATNBuilder.FOLLOW_ID_in_atom856);
                        pushFollow(ATNBuilder.FOLLOW_ruleref_in_atom858);
                        ruleref26 = this.ruleref();
                        this.#fsp--;

                        this.match(input, Token.UP, null);

                        retval.p = ruleref26;
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:179:7: ^( WILDCARD . )
                    {
                        this.match(input, ATNBuilder.WILDCARD, ATNBuilder.FOLLOW_WILDCARD_in_atom871);
                        this.match(input, Token.DOWN, null);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                        retval.p = this.factory.wildcard((retval.start as GrammarAST));
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/ATNBuilder.g:180:7: WILDCARD
                    {
                        this.match(input, ATNBuilder.WILDCARD, ATNBuilder.FOLLOW_WILDCARD_in_atom886);
                        retval.p = this.factory.wildcard((retval.start as GrammarAST));
                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/ATNBuilder.g:181:7: blockSet[false]
                    {
                        pushFollow(ATNBuilder.FOLLOW_blockSet_in_atom899);
                        blockSet27 = this.blockSet(false);
                        this.#fsp--;

                        retval.p = (blockSet27 !== null ? (blockSet27).p : null);
                    }
                    break;
                }

                case 7: {
                    // org/antlr/v4/parse/ATNBuilder.g:182:9: terminal
                    {
                        pushFollow(ATNBuilder.FOLLOW_terminal_in_atom914);
                        terminal28 = this.terminal();
                        this.#fsp--;

                        retval.p = (terminal28 !== null ? (terminal28).p : null);
                    }
                    break;
                }

                case 8: {
                    // org/antlr/v4/parse/ATNBuilder.g:183:9: ruleref
                    {
                        pushFollow(ATNBuilder.FOLLOW_ruleref_in_atom929);
                        ruleref29 = this.ruleref();
                        this.#fsp--;

                        retval.p = ruleref29;
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return retval;
    }

    public ruleref(): IStatePair {
        let p = null;

        let RULE_REF30 = null;
        let RULE_REF31 = null;
        let RULE_REF32 = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:187:5: ( ^( RULE_REF ( ARG_ACTION )? ^( ELEMENT_OPTIONS ( . )* ) ) | ^( RULE_REF ( ARG_ACTION )? ) | RULE_REF )
            let alt23 = 3;
            const LA23_0 = this.inputStream.LA(1);
            if ((LA23_0 === ATNBuilder.RULE_REF)) {
                const LA23_1 = this.inputStream.LA(2);
                if ((LA23_1 === DOWN)) {
                    switch (input.LA(3)) {
                        case ARG_ACTION: {
                            {
                                const LA23_4 = this.inputStream.LA(4);
                                if ((LA23_4 === ATNBuilder.ELEMENT_OPTIONS)) {
                                    alt23 = 1;
                                }
                                else {
                                    if ((LA23_4 === UP)) {
                                        alt23 = 2;
                                    }

                                    else {
                                        const nvaeMark = input.mark();
                                        try {
                                            for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                                input.consume();
                                            }
                                            const nvae =
                                                new NoViableAltException("", 23, 4, input);
                                            throw nvae;
                                        } finally {
                                            input.rewind(nvaeMark);
                                        }
                                    }
                                }

                            }
                            break;
                        }

                        case ELEMENT_OPTIONS: {
                            {
                                alt23 = 1;
                            }
                            break;
                        }

                        case UP: {
                            {
                                alt23 = 2;
                            }
                            break;
                        }

                        default: {
                            const nvaeMark = input.mark();
                            try {
                                for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                    input.consume();
                                }
                                const nvae =
                                    new NoViableAltException("", 23, 2, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }

                    }
                }
                else {
                    if ((LA23_1 === ATNBuilder.EOF || (LA23_1 >= UP && LA23_1 <= ATNBuilder.ACTION) || LA23_1 === ATNBuilder.ASSIGN || LA23_1 === ATNBuilder.DOT || LA23_1 === ATNBuilder.LEXER_CHAR_SET || LA23_1 === ATNBuilder.NOT || LA23_1 === ATNBuilder.PLUS_ASSIGN || LA23_1 === ATNBuilder.RANGE || LA23_1 === ATNBuilder.RULE_REF || LA23_1 === ATNBuilder.SEMPRED || LA23_1 === ATNBuilder.STRING_LITERAL || LA23_1 === ATNBuilder.TOKEN_REF || (LA23_1 >= ATNBuilder.BLOCK && LA23_1 <= ATNBuilder.CLOSURE) || (LA23_1 >= ATNBuilder.OPTIONAL && LA23_1 <= ATNBuilder.POSITIVE_CLOSURE) || (LA23_1 >= ATNBuilder.SET && LA23_1 <= ATNBuilder.WILDCARD))) {
                        alt23 = 3;
                    }

                    else {
                        const nvaeMark = input.mark();
                        try {
                            input.consume();
                            const nvae =
                                new NoViableAltException("", 23, 1, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }
                }

            }

            else {
                const nvae =
                    new NoViableAltException("", 23, 0, input);
                throw nvae;
            }

            switch (alt23) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:187:7: ^( RULE_REF ( ARG_ACTION )? ^( ELEMENT_OPTIONS ( . )* ) )
                    {
                        RULE_REF30 = this.match(input, ATNBuilder.RULE_REF, ATNBuilder.FOLLOW_RULE_REF_in_ruleref957) as GrammarAST;
                        this.match(input, Token.DOWN, null);
                        // org/antlr/v4/parse/ATNBuilder.g:187:18: ( ARG_ACTION )?
                        let alt20 = 2;
                        const LA20_0 = this.inputStream.LA(1);
                        if ((LA20_0 === ATNBuilder.ARG_ACTION)) {
                            alt20 = 1;
                        }
                        switch (alt20) {
                            case 1: {
                                // org/antlr/v4/parse/ATNBuilder.g:187:18: ARG_ACTION
                                {
                                    this.match(input, ATNBuilder.ARG_ACTION, ATNBuilder.FOLLOW_ARG_ACTION_in_ruleref959);
                                }
                                break;
                            }

                            default:

                        }

                        this.match(input, ATNBuilder.ELEMENT_OPTIONS, ATNBuilder.FOLLOW_ELEMENT_OPTIONS_in_ruleref963);
                        if (input.LA(1) === Token.DOWN) {
                            this.match(input, Token.DOWN, null);
                            // org/antlr/v4/parse/ATNBuilder.g:187:48: ( . )*
                            loop21:
                            while (true) {
                                let alt21 = 2;
                                const LA21_0 = this.inputStream.LA(1);
                                if (((LA21_0 >= ATNBuilder.ACTION && LA21_0 <= ATNBuilder.WILDCARD))) {
                                    alt21 = 1;
                                }
                                else {
                                    if ((LA21_0 === UP)) {
                                        alt21 = 2;
                                    }
                                }

                                switch (alt21) {
                                    case 1: {
                                        // org/antlr/v4/parse/ATNBuilder.g:187:48: .
                                        {
                                            matchAny(input);
                                        }
                                        break;
                                    }

                                    default: {
                                        break loop21;
                                    }

                                }
                            }

                            this.match(input, Token.UP, null);
                        }

                        this.match(input, Token.UP, null);

                        p = this.factory.ruleRef(RULE_REF30);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:188:7: ^( RULE_REF ( ARG_ACTION )? )
                    {
                        RULE_REF31 = this.match(input, ATNBuilder.RULE_REF, ATNBuilder.FOLLOW_RULE_REF_in_ruleref980) as GrammarAST;
                        if (input.LA(1) === Token.DOWN) {
                            this.match(input, Token.DOWN, null);
                            // org/antlr/v4/parse/ATNBuilder.g:188:18: ( ARG_ACTION )?
                            let alt22 = 2;
                            const LA22_0 = this.inputStream.LA(1);
                            if ((LA22_0 === ATNBuilder.ARG_ACTION)) {
                                alt22 = 1;
                            }
                            switch (alt22) {
                                case 1: {
                                    // org/antlr/v4/parse/ATNBuilder.g:188:18: ARG_ACTION
                                    {
                                        this.match(input, ATNBuilder.ARG_ACTION, ATNBuilder.FOLLOW_ARG_ACTION_in_ruleref982);
                                    }
                                    break;
                                }

                                default:

                            }

                            this.match(input, Token.UP, null);
                        }

                        p = this.factory.ruleRef(RULE_REF31);
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:189:7: RULE_REF
                    {
                        RULE_REF32 = this.match(input, ATNBuilder.RULE_REF, ATNBuilder.FOLLOW_RULE_REF_in_ruleref1001) as GrammarAST;
                        p = this.factory.ruleRef(RULE_REF32);
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return p;
    }

    public range(): IStatePair {
        let p = null;

        let a = null;
        let b = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:193:5: ( ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) )
            // org/antlr/v4/parse/ATNBuilder.g:193:7: ^( RANGE a= STRING_LITERAL b= STRING_LITERAL )
            {
                this.match(input, ATNBuilder.RANGE, ATNBuilder.FOLLOW_RANGE_in_range1035);
                this.match(input, Token.DOWN, null);
                a = this.match(input, ATNBuilder.STRING_LITERAL, ATNBuilder.FOLLOW_STRING_LITERAL_in_range1039) as GrammarAST;
                b = this.match(input, ATNBuilder.STRING_LITERAL, ATNBuilder.FOLLOW_STRING_LITERAL_in_range1043) as GrammarAST;
                this.match(input, Token.UP, null);

                p = this.factory.range(a, b);
            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return p;
    }

    public terminal(): ATNBuilder.terminal_return {
        const retval = new ATNBuilder.terminal_return();
        retval.start = input.LT(1);

        try {
            // org/antlr/v4/parse/ATNBuilder.g:197:5: ( ^( STRING_LITERAL . ) | STRING_LITERAL | ^( TOKEN_REF ARG_ACTION . ) | ^( TOKEN_REF . ) | TOKEN_REF )
            let alt24 = 5;
            const LA24_0 = this.inputStream.LA(1);
            if ((LA24_0 === ATNBuilder.STRING_LITERAL)) {
                const LA24_1 = this.inputStream.LA(2);
                if ((LA24_1 === DOWN)) {
                    alt24 = 1;
                }
                else {
                    if ((LA24_1 === ATNBuilder.EOF || (LA24_1 >= UP && LA24_1 <= ATNBuilder.ACTION) || LA24_1 === ATNBuilder.ASSIGN || LA24_1 === ATNBuilder.DOT || LA24_1 === ATNBuilder.LEXER_CHAR_SET || LA24_1 === ATNBuilder.NOT || LA24_1 === ATNBuilder.PLUS_ASSIGN || LA24_1 === ATNBuilder.RANGE || LA24_1 === ATNBuilder.RULE_REF || LA24_1 === ATNBuilder.SEMPRED || LA24_1 === ATNBuilder.STRING_LITERAL || LA24_1 === ATNBuilder.TOKEN_REF || (LA24_1 >= ATNBuilder.BLOCK && LA24_1 <= ATNBuilder.CLOSURE) || (LA24_1 >= ATNBuilder.OPTIONAL && LA24_1 <= ATNBuilder.POSITIVE_CLOSURE) || (LA24_1 >= ATNBuilder.SET && LA24_1 <= ATNBuilder.WILDCARD))) {
                        alt24 = 2;
                    }

                    else {
                        const nvaeMark = input.mark();
                        try {
                            input.consume();
                            const nvae =
                                new NoViableAltException("", 24, 1, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }
                }

            }
            else {
                if ((LA24_0 === ATNBuilder.TOKEN_REF)) {
                    const LA24_2 = this.inputStream.LA(2);
                    if ((LA24_2 === DOWN)) {
                        const LA24_5 = this.inputStream.LA(3);
                        if ((LA24_5 === ATNBuilder.ARG_ACTION)) {
                            const LA24_7 = this.inputStream.LA(4);
                            if (((LA24_7 >= ATNBuilder.ACTION && LA24_7 <= ATNBuilder.WILDCARD))) {
                                alt24 = 3;
                            }
                            else {
                                if (((LA24_7 >= DOWN && LA24_7 <= UP))) {
                                    alt24 = 4;
                                }

                                else {
                                    const nvaeMark = input.mark();
                                    try {
                                        for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                            input.consume();
                                        }
                                        const nvae =
                                            new NoViableAltException("", 24, 7, input);
                                        throw nvae;
                                    } finally {
                                        input.rewind(nvaeMark);
                                    }
                                }
                            }

                        }
                        else {
                            if (((LA24_5 >= ATNBuilder.ACTION && LA24_5 <= ATNBuilder.ACTION_STRING_LITERAL) || (LA24_5 >= ATNBuilder.ARG_OR_CHARSET && LA24_5 <= ATNBuilder.WILDCARD))) {
                                alt24 = 4;
                            }

                            else {
                                const nvaeMark = input.mark();
                                try {
                                    for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                        input.consume();
                                    }
                                    const nvae =
                                        new NoViableAltException("", 24, 5, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }

                    }
                    else {
                        if ((LA24_2 === ATNBuilder.EOF || (LA24_2 >= UP && LA24_2 <= ATNBuilder.ACTION) || LA24_2 === ATNBuilder.ASSIGN || LA24_2 === ATNBuilder.DOT || LA24_2 === ATNBuilder.LEXER_CHAR_SET || LA24_2 === ATNBuilder.NOT || LA24_2 === ATNBuilder.PLUS_ASSIGN || LA24_2 === ATNBuilder.RANGE || LA24_2 === ATNBuilder.RULE_REF || LA24_2 === ATNBuilder.SEMPRED || LA24_2 === ATNBuilder.STRING_LITERAL || LA24_2 === ATNBuilder.TOKEN_REF || (LA24_2 >= ATNBuilder.BLOCK && LA24_2 <= ATNBuilder.CLOSURE) || (LA24_2 >= ATNBuilder.OPTIONAL && LA24_2 <= ATNBuilder.POSITIVE_CLOSURE) || (LA24_2 >= ATNBuilder.SET && LA24_2 <= ATNBuilder.WILDCARD))) {
                            alt24 = 5;
                        }

                        else {
                            const nvaeMark = input.mark();
                            try {
                                input.consume();
                                const nvae =
                                    new NoViableAltException("", 24, 2, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }
                    }

                }

                else {
                    const nvae =
                        new NoViableAltException("", 24, 0, input);
                    throw nvae;
                }
            }

            switch (alt24) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:197:8: ^( STRING_LITERAL . )
                    {
                        this.match(input, ATNBuilder.STRING_LITERAL, ATNBuilder.FOLLOW_STRING_LITERAL_in_terminal1069);
                        this.match(input, Token.DOWN, null);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                        retval.p = this.factory.stringLiteral((retval.start as GrammarAST) as TerminalAST);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:198:7: STRING_LITERAL
                    {
                        this.match(input, ATNBuilder.STRING_LITERAL, ATNBuilder.FOLLOW_STRING_LITERAL_in_terminal1084);
                        retval.p = this.factory.stringLiteral((retval.start as GrammarAST) as TerminalAST);
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:199:7: ^( TOKEN_REF ARG_ACTION . )
                    {
                        this.match(input, ATNBuilder.TOKEN_REF, ATNBuilder.FOLLOW_TOKEN_REF_in_terminal1098);
                        this.match(input, Token.DOWN, null);
                        this.match(input, ATNBuilder.ARG_ACTION, ATNBuilder.FOLLOW_ARG_ACTION_in_terminal1100);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                        retval.p = this.factory.tokenRef((retval.start as GrammarAST) as TerminalAST);
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:200:7: ^( TOKEN_REF . )
                    {
                        this.match(input, ATNBuilder.TOKEN_REF, ATNBuilder.FOLLOW_TOKEN_REF_in_terminal1114);
                        this.match(input, Token.DOWN, null);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                        retval.p = this.factory.tokenRef((retval.start as GrammarAST) as TerminalAST);
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/ATNBuilder.g:201:7: TOKEN_REF
                    {
                        this.match(input, ATNBuilder.TOKEN_REF, ATNBuilder.FOLLOW_TOKEN_REF_in_terminal1130);
                        retval.p = this.factory.tokenRef((retval.start as GrammarAST) as TerminalAST);
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }

        return retval;
    }

    public elementOptions(): void {
        try {
            // org/antlr/v4/parse/ATNBuilder.g:205:2: ( ^( ELEMENT_OPTIONS ( elementOption )* ) )
            // org/antlr/v4/parse/ATNBuilder.g:205:4: ^( ELEMENT_OPTIONS ( elementOption )* )
            {
                this.match(input, ATNBuilder.ELEMENT_OPTIONS, ATNBuilder.FOLLOW_ELEMENT_OPTIONS_in_elementOptions1151);
                if (input.LA(1) === Token.DOWN) {
                    this.match(input, Token.DOWN, null);
                    // org/antlr/v4/parse/ATNBuilder.g:205:22: ( elementOption )*
                    loop25:
                    while (true) {
                        let alt25 = 2;
                        const LA25_0 = this.inputStream.LA(1);
                        if ((LA25_0 === ATNBuilder.ASSIGN || LA25_0 === ATNBuilder.ID)) {
                            alt25 = 1;
                        }

                        switch (alt25) {
                            case 1: {
                                // org/antlr/v4/parse/ATNBuilder.g:205:22: elementOption
                                {
                                    pushFollow(ATNBuilder.FOLLOW_elementOption_in_elementOptions1153);
                                    this.elementOption();
                                    this.#fsp--;

                                }
                                break;
                            }

                            default: {
                                break loop25;
                            }

                        }
                    }

                    this.match(input, Token.UP, null);
                }

            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
    }

    public elementOption(): void {
        try {
            // org/antlr/v4/parse/ATNBuilder.g:209:2: ( ID | ^( ASSIGN ID ID ) | ^( ASSIGN ID STRING_LITERAL ) | ^( ASSIGN ID ACTION ) | ^( ASSIGN ID INT ) )
            let alt26 = 5;
            const LA26_0 = this.inputStream.LA(1);
            if ((LA26_0 === ATNBuilder.ID)) {
                alt26 = 1;
            }
            else {
                if ((LA26_0 === ATNBuilder.ASSIGN)) {
                    const LA26_2 = this.inputStream.LA(2);
                    if ((LA26_2 === DOWN)) {
                        const LA26_3 = this.inputStream.LA(3);
                        if ((LA26_3 === ATNBuilder.ID)) {
                            switch (input.LA(4)) {
                                case ID: {
                                    {
                                        alt26 = 2;
                                    }
                                    break;
                                }

                                case STRING_LITERAL: {
                                    {
                                        alt26 = 3;
                                    }
                                    break;
                                }

                                case ACTION: {
                                    {
                                        alt26 = 4;
                                    }
                                    break;
                                }

                                case INT: {
                                    {
                                        alt26 = 5;
                                    }
                                    break;
                                }

                                default: {
                                    const nvaeMark = input.mark();
                                    try {
                                        for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                            input.consume();
                                        }
                                        const nvae =
                                            new NoViableAltException("", 26, 4, input);
                                        throw nvae;
                                    } finally {
                                        input.rewind(nvaeMark);
                                    }
                                }

                            }
                        }

                        else {
                            const nvaeMark = input.mark();
                            try {
                                for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                    input.consume();
                                }
                                const nvae =
                                    new NoViableAltException("", 26, 3, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }

                    }

                    else {
                        const nvaeMark = input.mark();
                        try {
                            input.consume();
                            const nvae =
                                new NoViableAltException("", 26, 2, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }

                }

                else {
                    const nvae =
                        new NoViableAltException("", 26, 0, input);
                    throw nvae;
                }
            }

            switch (alt26) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:209:4: ID
                    {
                        this.match(input, ATNBuilder.ID, ATNBuilder.FOLLOW_ID_in_elementOption1166);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:210:4: ^( ASSIGN ID ID )
                    {
                        this.match(input, ATNBuilder.ASSIGN, ATNBuilder.FOLLOW_ASSIGN_in_elementOption1172);
                        this.match(input, Token.DOWN, null);
                        this.match(input, ATNBuilder.ID, ATNBuilder.FOLLOW_ID_in_elementOption1174);
                        this.match(input, ATNBuilder.ID, ATNBuilder.FOLLOW_ID_in_elementOption1176);
                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:211:4: ^( ASSIGN ID STRING_LITERAL )
                    {
                        this.match(input, ATNBuilder.ASSIGN, ATNBuilder.FOLLOW_ASSIGN_in_elementOption1183);
                        this.match(input, Token.DOWN, null);
                        this.match(input, ATNBuilder.ID, ATNBuilder.FOLLOW_ID_in_elementOption1185);
                        this.match(input, ATNBuilder.STRING_LITERAL, ATNBuilder.FOLLOW_STRING_LITERAL_in_elementOption1187);
                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:212:4: ^( ASSIGN ID ACTION )
                    {
                        this.match(input, ATNBuilder.ASSIGN, ATNBuilder.FOLLOW_ASSIGN_in_elementOption1194);
                        this.match(input, Token.DOWN, null);
                        this.match(input, ATNBuilder.ID, ATNBuilder.FOLLOW_ID_in_elementOption1196);
                        this.match(input, ATNBuilder.ACTION, ATNBuilder.FOLLOW_ACTION_in_elementOption1198);
                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/ATNBuilder.g:213:4: ^( ASSIGN ID INT )
                    {
                        this.match(input, ATNBuilder.ASSIGN, ATNBuilder.FOLLOW_ASSIGN_in_elementOption1205);
                        this.match(input, Token.DOWN, null);
                        this.match(input, ATNBuilder.ID, ATNBuilder.FOLLOW_ID_in_elementOption1207);
                        this.match(input, ATNBuilder.INT, ATNBuilder.FOLLOW_INT_in_elementOption1209);
                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
    }

}
