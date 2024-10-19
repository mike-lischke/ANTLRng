/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// $ANTLR 3.5.3 org/antlr/v4/parse/ATNBuilder.g

/* eslint-disable max-len, @typescript-eslint/naming-convention */
// cspell: disable

import { RecognitionException } from "antlr4ng";

import type { IATNFactory, IStatePair } from "../automata/IATNFactory.js";
import type { ActionAST } from "../tool/ast/ActionAST.js";
import type { BlockAST } from "../tool/ast/BlockAST.js";
import type { GrammarAST } from "../tool/ast/GrammarAST.js";
import type { PredAST } from "../tool/ast/PredAST.js";
import type { TerminalAST } from "../tool/ast/TerminalAST.js";
import { EarlyExitException } from "../antlr3/EarlyExitException.js";
import { MismatchedSetException } from "../antlr3/MismatchedSetException.js";
import { NoViableAltException } from "../antlr3/NoViableAltException.js";
import { RecognizerSharedState } from "../antlr3/RecognizerSharedState.js";
import type { TreeNodeStream } from "../antlr3/tree/TreeNodeStream.js";
import { TreeParser } from "../antlr3/tree/TreeParser.js";
import { TreeRuleReturnScope } from "../antlr3/tree/TreeRuleReturnScope.js";
import { GrammarTreeVisitor } from "./GrammarTreeVisitor.js";

export class ATNBuilder extends TreeParser {
    public static readonly tokenNames = [
        "<invalid>", "<EOR>", "<DOWN>", "<UP>", "ACTION", "ACTION_CHAR_LITERAL",
        "ACTION_ESC", "ACTION_STRING_LITERAL", "ARG_ACTION", "ARG_OR_CHARSET",
        "ASSIGN", "AT", "CATCH", "CHANNELS", "COLON", "COLONCOLON", "COMMA", "COMMENT",
        "DOC_COMMENT", "DOLLAR", "DOT", "ERRCHAR", "ESC_SEQ", "FINALLY", "FRAGMENT",
        "GRAMMAR", "GT", "HEX_DIGIT", "ID", "IMPORT", "INT", "LEXER", "LEXER_CHAR_SET",
        "LOCALS", "LPAREN", "LT", "MODE", "NESTED_ACTION", "NLCHARS", "NOT", "NameChar",
        "NameStartChar", "OPTIONS", "OR", "PARSER", "PLUS", "PLUS_ASSIGN", "POUND",
        "QUESTION", "RANGE", "RARROW", "RBRACE", "RETURNS", "RPAREN", "RULE_REF",
        "SEMI", "SEMPRED", "SRC", "STAR", "STRING_LITERAL", "THROWS", "TOKENS_SPEC",
        "TOKEN_REF", "UNICODE_ESC", "UNICODE_EXTENDED_ESC", "UnicodeBOM", "WS",
        "WSCHARS", "WSNLCHARS", "ALT", "BLOCK", "CLOSURE", "COMBINED", "ELEMENT_OPTIONS",
        "EPSILON", "LEXER_ACTION_CALL", "LEXER_ALT_ACTION", "OPTIONAL", "POSITIVE_CLOSURE",
        "RULE", "RULEMODIFIERS", "RULES", "SET", "WILDCARD"
    ];
    public static readonly EOF = -1;
    public static readonly ACTION = 4;
    public static readonly ACTION_CHAR_LITERAL = 5;
    public static readonly ACTION_ESC = 6;
    public static readonly ACTION_STRING_LITERAL = 7;
    public static readonly ARG_ACTION = 8;
    public static readonly ARG_OR_CHARSET = 9;
    public static readonly ASSIGN = 10;
    public static readonly AT = 11;
    public static readonly CATCH = 12;
    public static readonly CHANNELS = 13;
    public static readonly COLON = 14;
    public static readonly COLONCOLON = 15;
    public static readonly COMMA = 16;
    public static readonly COMMENT = 17;
    public static readonly DOC_COMMENT = 18;
    public static readonly DOLLAR = 19;
    public static readonly DOT = 20;
    public static readonly ERRCHAR = 21;
    public static readonly ESC_SEQ = 22;
    public static readonly FINALLY = 23;
    public static readonly FRAGMENT = 24;
    public static readonly GRAMMAR = 25;
    public static readonly GT = 26;
    public static readonly HEX_DIGIT = 27;
    public static readonly ID = 28;
    public static readonly IMPORT = 29;
    public static readonly INT = 30;
    public static readonly LEXER = 31;
    public static readonly LEXER_CHAR_SET = 32;
    public static readonly LOCALS = 33;
    public static readonly LPAREN = 34;
    public static readonly LT = 35;
    public static readonly MODE = 36;
    public static readonly NESTED_ACTION = 37;
    public static readonly NLCHARS = 38;
    public static readonly NOT = 39;
    public static readonly NameChar = 40;
    public static readonly NameStartChar = 41;
    public static readonly OPTIONS = 42;
    public static readonly OR = 43;
    public static readonly PARSER = 44;
    public static readonly PLUS = 45;
    public static readonly PLUS_ASSIGN = 46;
    public static readonly POUND = 47;
    public static readonly QUESTION = 48;
    public static readonly RANGE = 49;
    public static readonly RARROW = 50;
    public static readonly RBRACE = 51;
    public static readonly RETURNS = 52;
    public static readonly RPAREN = 53;
    public static readonly RULE_REF = 54;
    public static readonly SEMI = 55;
    public static readonly SEMPRED = 56;
    public static readonly SRC = 57;
    public static readonly STAR = 58;
    public static readonly STRING_LITERAL = 59;
    public static readonly THROWS = 60;
    public static readonly TOKENS_SPEC = 61;
    public static readonly TOKEN_REF = 62;
    public static readonly UNICODE_ESC = 63;
    public static readonly UNICODE_EXTENDED_ESC = 64;
    public static readonly UnicodeBOM = 65;
    public static readonly WS = 66;
    public static readonly WSCHARS = 67;
    public static readonly WSNLCHARS = 68;
    public static readonly ALT = 69;
    public static readonly BLOCK = 70;
    public static readonly CLOSURE = 71;
    public static readonly COMBINED = 72;
    public static readonly ELEMENT_OPTIONS = 73;
    public static readonly EPSILON = 74;
    public static readonly LEXER_ACTION_CALL = 75;
    public static readonly LEXER_ALT_ACTION = 76;
    public static readonly OPTIONAL = 77;
    public static readonly POSITIVE_CLOSURE = 78;
    public static readonly RULE = 79;
    public static readonly RULEMODIFIERS = 80;
    public static readonly RULES = 81;
    public static readonly SET = 82;
    public static readonly WILDCARD = 83;
    // $ANTLR end "lexerCommand"

    public static lexerCommandExpr_return = class lexerCommandExpr_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerCommandExpr"

    public static element_return = class element_return extends TreeRuleReturnScope {
        public p: IStatePair;
    };

    // $ANTLR end "labeledElement"

    public static subrule_return = class subrule_return extends TreeRuleReturnScope {
        public p: IStatePair;
    };

    // $ANTLR end "subrule"

    public static blockSet_return = class blockSet_return extends TreeRuleReturnScope {
        public p: IStatePair;
    };

    // $ANTLR end "blockSet"

    public static setElement_return = class setElement_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "setElement"

    public static atom_return = class atom_return extends TreeRuleReturnScope {
        public p: IStatePair;
    };

    public static terminal_return = class terminal_return extends TreeRuleReturnScope {
        public p: IStatePair;
    };

    protected factory?: IATNFactory;

    public constructor(input: TreeNodeStream, stateOrFactory?: RecognizerSharedState | IATNFactory) {
        if (!stateOrFactory) {
            stateOrFactory = new RecognizerSharedState();
        }

        if (stateOrFactory instanceof RecognizerSharedState) {
            super(input, stateOrFactory);
        } else {
            super(input);
            this.factory = stateOrFactory;
        }
    }

    // delegates
    public getDelegates(): TreeParser[] {
        return [];
    }

    public override getTokenNames(): string[] {
        return ATNBuilder.tokenNames;
    }

    public override getGrammarFileName(): string {
        return "org/antlr/v4/parse/ATNBuilder.g";
    }

    // $ANTLR start "dummy"
    // org/antlr/v4/parse/ATNBuilder.g:80:1: dummy : block[null] ;
    public dummy(): void {
        try {
            // org/antlr/v4/parse/ATNBuilder.g:80:7: ( block[null] )
            // org/antlr/v4/parse/ATNBuilder.g:80:9: block[null]
            {
                this.pushFollow(null);
                this.block(null);
                this.state._fsp--;

            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

    }
    // $ANTLR end "dummy"

    // $ANTLR start "ruleBlock"
    // org/antlr/v4/parse/ATNBuilder.g:82:1: ruleBlock[GrammarAST ebnfRoot] returns [IStatePair p] : ^( BLOCK ( ^( OPTIONS ( . )* ) )? (a= alternative )+ ) ;
    public ruleBlock(ebnfRoot: GrammarAST | null): IStatePair | null {
        let p = null;

        let BLOCK1 = null;

        const alts = new Array<IStatePair>();
        let alt = 1;
        this.factory!.setCurrentOuterAlt(alt);

        try {
            // org/antlr/v4/parse/ATNBuilder.g:88:5: ( ^( BLOCK ( ^( OPTIONS ( . )* ) )? (a= alternative )+ ) )
            // org/antlr/v4/parse/ATNBuilder.g:88:7: ^( BLOCK ( ^( OPTIONS ( . )* ) )? (a= alternative )+ )
            {
                BLOCK1 = this.match(this.input!, ATNBuilder.BLOCK, null) as GrammarAST;
                this.match(this.input!, TreeParser.DOWN, null);
                // org/antlr/v4/parse/ATNBuilder.g:89:13: ( ^( OPTIONS ( . )* ) )?
                let alt2 = 2;
                const LA2_0 = this.input!.LA(1);
                if ((LA2_0 === ATNBuilder.OPTIONS)) {
                    alt2 = 1;
                }
                switch (alt2) {
                    case 1: {
                        // org/antlr/v4/parse/ATNBuilder.g:89:14: ^( OPTIONS ( . )* )
                        {
                            this.match(this.input!, ATNBuilder.OPTIONS, null);
                            if (this.input!.LA(1) === TreeParser.DOWN) {
                                this.match(this.input!, TreeParser.DOWN, null);
                                // org/antlr/v4/parse/ATNBuilder.g:89:24: ( . )*
                                loop1:
                                while (true) {
                                    let alt1 = 2;
                                    const LA1_0 = this.input!.LA(1);
                                    if (((LA1_0 >= ATNBuilder.ACTION && LA1_0 <= ATNBuilder.WILDCARD))) {
                                        alt1 = 1;
                                    } else {
                                        if ((LA1_0 === GrammarTreeVisitor.UP)) {
                                            alt1 = 2;
                                        }
                                    }

                                    switch (alt1) {
                                        case 1: {
                                            // org/antlr/v4/parse/ATNBuilder.g:89:24: .
                                            {
                                                this.matchAny(this.input!);
                                            }
                                            break;
                                        }

                                        default: {
                                            break loop1;
                                        }

                                    }
                                }

                                this.match(this.input!, TreeParser.UP, null);
                            }

                        }
                        break;
                    }

                    default:

                }

                // org/antlr/v4/parse/ATNBuilder.g:90:13: (a= alternative )+
                let cnt3 = 0;
                loop3:
                while (true) {
                    let alt3 = 2;
                    const LA3_0 = this.input!.LA(1);
                    if ((LA3_0 === ATNBuilder.ALT || LA3_0 === ATNBuilder.LEXER_ALT_ACTION)) {
                        alt3 = 1;
                    }

                    switch (alt3) {
                        case 1: {
                            // org/antlr/v4/parse/ATNBuilder.g:90:17: a= alternative
                            {
                                this.pushFollow(null);
                                const a = this.alternative();
                                this.state._fsp--;

                                alts.push(a!);
                                this.factory!.setCurrentOuterAlt(++alt);
                            }
                            break;
                        }

                        default: {
                            if (cnt3 >= 1) {
                                break loop3;
                            }

                            const eee = new EarlyExitException(3, this.input);
                            throw eee;
                        }

                    }
                    cnt3++;
                }

                this.match(this.input!, TreeParser.UP, null);

                p = this.factory!.block(BLOCK1 as BlockAST, ebnfRoot, alts);
            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return p;
    }
    // $ANTLR end "ruleBlock"

    // $ANTLR start "block"
    // org/antlr/v4/parse/ATNBuilder.g:97:1: block[GrammarAST ebnfRoot] returns [IStatePair p] : ^( BLOCK ( ^( OPTIONS ( . )* ) )? (a= alternative )+ ) ;
    public block(ebnfRoot: GrammarAST | null): IStatePair | null {
        let p = null;

        let BLOCK2 = null;

        const alts = new Array<IStatePair>();
        try {
            // org/antlr/v4/parse/ATNBuilder.g:99:5: ( ^( BLOCK ( ^( OPTIONS ( . )* ) )? (a= alternative )+ ) )
            // org/antlr/v4/parse/ATNBuilder.g:99:7: ^( BLOCK ( ^( OPTIONS ( . )* ) )? (a= alternative )+ )
            {
                BLOCK2 = this.match(this.input!, ATNBuilder.BLOCK, null) as GrammarAST;
                this.match(this.input!, TreeParser.DOWN, null);
                // org/antlr/v4/parse/ATNBuilder.g:99:15: ( ^( OPTIONS ( . )* ) )?
                let alt5 = 2;
                const LA5_0 = this.input!.LA(1);
                if ((LA5_0 === ATNBuilder.OPTIONS)) {
                    alt5 = 1;
                }
                switch (alt5) {
                    case 1: {
                        // org/antlr/v4/parse/ATNBuilder.g:99:16: ^( OPTIONS ( . )* )
                        {
                            this.match(this.input!, ATNBuilder.OPTIONS, null);
                            if (this.input!.LA(1) === TreeParser.DOWN) {
                                this.match(this.input!, TreeParser.DOWN, null);
                                // org/antlr/v4/parse/ATNBuilder.g:99:26: ( . )*
                                loop4:
                                while (true) {
                                    let alt4 = 2;
                                    const LA4_0 = this.input!.LA(1);
                                    if (((LA4_0 >= ATNBuilder.ACTION && LA4_0 <= ATNBuilder.WILDCARD))) {
                                        alt4 = 1;
                                    } else {
                                        if ((LA4_0 === GrammarTreeVisitor.UP)) {
                                            alt4 = 2;
                                        }
                                    }

                                    switch (alt4) {
                                        case 1: {
                                            // org/antlr/v4/parse/ATNBuilder.g:99:26: .
                                            {
                                                this.matchAny(this.input!);
                                            }
                                            break;
                                        }

                                        default: {
                                            break loop4;
                                        }

                                    }
                                }

                                this.match(this.input!, TreeParser.UP, null);
                            }

                        }
                        break;
                    }

                    default:

                }

                // org/antlr/v4/parse/ATNBuilder.g:99:32: (a= alternative )+
                let cnt6 = 0;
                loop6:
                while (true) {
                    let alt6 = 2;
                    const LA6_0 = this.input!.LA(1);
                    if ((LA6_0 === ATNBuilder.ALT || LA6_0 === ATNBuilder.LEXER_ALT_ACTION)) {
                        alt6 = 1;
                    }

                    switch (alt6) {
                        case 1: {
                            // org/antlr/v4/parse/ATNBuilder.g:99:33: a= alternative
                            {
                                this.pushFollow(null);
                                const a = this.alternative();
                                this.state._fsp--;

                                alts.push(a!);
                            }
                            break;
                        }

                        default: {
                            if (cnt6 >= 1) {
                                break loop6;
                            }

                            const eee = new EarlyExitException(6, this.input);
                            throw eee;
                        }

                    }
                    cnt6++;
                }

                this.match(this.input!, TreeParser.UP, null);

                p = this.factory!.block(BLOCK2 as BlockAST, ebnfRoot, alts);
            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return p;
    }
    // $ANTLR end "block"

    // $ANTLR start "alternative"
    // org/antlr/v4/parse/ATNBuilder.g:103:1: alternative returns [IStatePair p] : ( ^( LEXER_ALT_ACTION a= alternative lexerCommands ) | ^( ALT ( elementOptions )? EPSILON ) | ^( ALT ( elementOptions )? (e= element )+ ) );
    public alternative(): IStatePair | null {
        let p = null;

        let EPSILON4 = null;

        const els = new Array<IStatePair>();
        try {
            // org/antlr/v4/parse/ATNBuilder.g:105:5: ( ^( LEXER_ALT_ACTION a= alternative lexerCommands ) | ^( ALT ( elementOptions )? EPSILON ) | ^( ALT ( elementOptions )? (e= element )+ ) )
            let alt10 = 3;
            //alt10 = this.dfa10.predict(this.input!);
            alt10 = this.input!.LA(1); // This is wrong! Just to silence eslint and tsc for the moment.
            switch (alt10) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:105:7: ^( LEXER_ALT_ACTION a= alternative lexerCommands )
                    {
                        this.match(this.input!, ATNBuilder.LEXER_ALT_ACTION, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.pushFollow(null);
                        const a = this.alternative();
                        this.state._fsp--;

                        this.pushFollow(null);
                        const lexerCommands3 = this.lexerCommands();
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        p = this.factory!.lexerAltCommands(a!, lexerCommands3!);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:107:7: ^( ALT ( elementOptions )? EPSILON )
                    {
                        this.match(this.input!, ATNBuilder.ALT, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        // org/antlr/v4/parse/ATNBuilder.g:107:13: ( elementOptions )?
                        let alt7 = 2;
                        const LA7_0 = this.input!.LA(1);
                        if ((LA7_0 === ATNBuilder.ELEMENT_OPTIONS)) {
                            alt7 = 1;
                        }
                        switch (alt7) {
                            case 1: {
                                // org/antlr/v4/parse/ATNBuilder.g:107:13: elementOptions
                                {
                                    this.pushFollow(null);
                                    this.elementOptions();
                                    this.state._fsp--;

                                }
                                break;
                            }

                            default:

                        }

                        EPSILON4 = this.match(this.input!, ATNBuilder.EPSILON, null) as GrammarAST;
                        this.match(this.input!, TreeParser.UP, null);

                        p = this.factory!.epsilon(EPSILON4);
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:108:9: ^( ALT ( elementOptions )? (e= element )+ )
                    {
                        this.match(this.input!, ATNBuilder.ALT, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        // org/antlr/v4/parse/ATNBuilder.g:108:15: ( elementOptions )?
                        let alt8 = 2;
                        const LA8_0 = this.input!.LA(1);
                        if ((LA8_0 === ATNBuilder.ELEMENT_OPTIONS)) {
                            alt8 = 1;
                        }
                        switch (alt8) {
                            case 1: {
                                // org/antlr/v4/parse/ATNBuilder.g:108:15: elementOptions
                                {
                                    this.pushFollow(null);
                                    this.elementOptions();
                                    this.state._fsp--;

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
                            const LA9_0 = this.input!.LA(1);
                            if ((LA9_0 === ATNBuilder.ACTION || LA9_0 === ATNBuilder.ASSIGN || LA9_0 === ATNBuilder.DOT || LA9_0 === ATNBuilder.LEXER_CHAR_SET || LA9_0 === ATNBuilder.NOT || LA9_0 === ATNBuilder.PLUS_ASSIGN || LA9_0 === ATNBuilder.RANGE || LA9_0 === ATNBuilder.RULE_REF || LA9_0 === ATNBuilder.SEMPRED || LA9_0 === ATNBuilder.STRING_LITERAL || LA9_0 === ATNBuilder.TOKEN_REF || (LA9_0 >= ATNBuilder.BLOCK && LA9_0 <= ATNBuilder.CLOSURE) || (LA9_0 >= ATNBuilder.OPTIONAL && LA9_0 <= ATNBuilder.POSITIVE_CLOSURE) || (LA9_0 >= ATNBuilder.SET && LA9_0 <= ATNBuilder.WILDCARD))) {
                                alt9 = 1;
                            }

                            switch (alt9) {
                                case 1: {
                                    // org/antlr/v4/parse/ATNBuilder.g:108:32: e= element
                                    {
                                        this.pushFollow(null);
                                        const e = this.element();
                                        this.state._fsp--;

                                        els.push(e.p);
                                    }
                                    break;
                                }

                                default: {
                                    if (cnt9 >= 1) {
                                        break loop9;
                                    }

                                    const eee = new EarlyExitException(9, this.input);
                                    throw eee;
                                }

                            }
                            cnt9++;
                        }

                        this.match(this.input!, TreeParser.UP, null);

                        p = this.factory!.alt(els);
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return p;
    }
    // $ANTLR end "alternative"

    // $ANTLR start "lexerCommands"
    // org/antlr/v4/parse/ATNBuilder.g:111:1: lexerCommands returns [IStatePair p] : (c= lexerCommand )+ ;
    public lexerCommands(): IStatePair | null {
        let p = null;

        let c = null;

        const cmds = new Array<IStatePair>();
        try {
            // org/antlr/v4/parse/ATNBuilder.g:113:5: ( (c= lexerCommand )+ )
            // org/antlr/v4/parse/ATNBuilder.g:113:9: (c= lexerCommand )+
            {
                // org/antlr/v4/parse/ATNBuilder.g:113:9: (c= lexerCommand )+
                let cnt11 = 0;
                loop11:
                while (true) {
                    let alt11 = 2;
                    const LA11_0 = this.input!.LA(1);
                    if ((LA11_0 === ATNBuilder.ID || LA11_0 === ATNBuilder.LEXER_ACTION_CALL)) {
                        alt11 = 1;
                    }

                    switch (alt11) {
                        case 1: {
                            // org/antlr/v4/parse/ATNBuilder.g:113:10: c= lexerCommand
                            {
                                this.pushFollow(null);
                                c = this.lexerCommand();
                                this.state._fsp--;

                                if (c !== null) {
                                    cmds.push(c);
                                }

                            }
                            break;
                        }

                        default: {
                            if (cnt11 >= 1) {
                                break loop11;
                            }

                            const eee = new EarlyExitException(11, this.input);
                            throw eee;
                        }

                    }
                    cnt11++;
                }

                p = this.factory!.alt(cmds);

            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return p;
    }
    // $ANTLR end "lexerCommands"

    // $ANTLR start "lexerCommand"
    // org/antlr/v4/parse/ATNBuilder.g:119:1: lexerCommand returns [IStatePair cmd] : ( ^( LEXER_ACTION_CALL ID lexerCommandExpr ) | ID );
    public lexerCommand(): IStatePair | null {
        let cmd = null;

        let ID5 = null;
        let ID7 = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:120:2: ( ^( LEXER_ACTION_CALL ID lexerCommandExpr ) | ID )
            let alt12 = 2;
            const LA12_0 = this.input!.LA(1);
            if ((LA12_0 === ATNBuilder.LEXER_ACTION_CALL)) {
                alt12 = 1;
            } else {
                if ((LA12_0 === ATNBuilder.ID)) {
                    alt12 = 2;
                } else {
                    const nvae =
                        new NoViableAltException("", 12, 0, this.input);
                    throw nvae;
                }
            }

            switch (alt12) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:120:4: ^( LEXER_ACTION_CALL ID lexerCommandExpr )
                    {
                        this.match(this.input!, ATNBuilder.LEXER_ACTION_CALL, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        ID5 = this.match(this.input!, ATNBuilder.ID, null) as GrammarAST;
                        this.pushFollow(null);
                        const lexerCommandExpr6 = this.lexerCommandExpr();
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        cmd = this.factory!.lexerCallCommand(ID5, lexerCommandExpr6.start as GrammarAST);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:122:4: ID
                    {
                        ID7 = this.match(this.input!, ATNBuilder.ID, null) as GrammarAST;
                        cmd = this.factory!.lexerCommand(ID7);
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return cmd;
    }

    // $ANTLR start "lexerCommandExpr"
    // org/antlr/v4/parse/ATNBuilder.g:126:1: lexerCommandExpr : ( ID | INT );
    public lexerCommandExpr(): ATNBuilder.lexerCommandExpr_return {
        const retval = new ATNBuilder.lexerCommandExpr_return();
        retval.start = this.input!.LT(1);

        try {
            // org/antlr/v4/parse/ATNBuilder.g:127:2: ( ID | INT )
            // org/antlr/v4/parse/ATNBuilder.g:
            {
                if (this.input!.LA(1) === ATNBuilder.ID || this.input!.LA(1) === ATNBuilder.INT) {
                    this.input!.consume();
                    this.state.errorRecovery = false;
                } else {
                    const mse = new MismatchedSetException(null, this.input);
                    throw mse;
                }
            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return retval;
    }

    // $ANTLR start "element"
    // org/antlr/v4/parse/ATNBuilder.g:131:1: element returns [IStatePair p] : ( labeledElement | atom | subrule | ACTION | SEMPRED | ^( ACTION . ) | ^( SEMPRED . ) | ^( NOT b= blockSet[true] ) | LEXER_CHAR_SET );
    public element(): ATNBuilder.element_return {
        const retval = new ATNBuilder.element_return();
        retval.start = this.input!.LT(1);

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
            switch (this.input!.LA(1)) {
                case GrammarTreeVisitor.ASSIGN:
                case GrammarTreeVisitor.PLUS_ASSIGN: {
                    {
                        alt13 = 1;
                    }
                    break;
                }

                case GrammarTreeVisitor.DOT:
                case GrammarTreeVisitor.RANGE:
                case GrammarTreeVisitor.RULE_REF:
                case GrammarTreeVisitor.STRING_LITERAL:
                case GrammarTreeVisitor.TOKEN_REF:
                case GrammarTreeVisitor.SET:
                case GrammarTreeVisitor.WILDCARD: {
                    {
                        alt13 = 2;
                    }
                    break;
                }

                case GrammarTreeVisitor.BLOCK:
                case GrammarTreeVisitor.CLOSURE:
                case GrammarTreeVisitor.OPTIONAL:
                case GrammarTreeVisitor.POSITIVE_CLOSURE: {
                    {
                        alt13 = 3;
                    }
                    break;
                }

                case GrammarTreeVisitor.ACTION: {
                    {
                        const LA13_4 = this.input!.LA(2);
                        if ((LA13_4 === GrammarTreeVisitor.DOWN)) {
                            alt13 = 6;
                        } else {
                            if (((LA13_4 >= GrammarTreeVisitor.UP && LA13_4 <= ATNBuilder.ACTION) || LA13_4 === ATNBuilder.ASSIGN || LA13_4 === ATNBuilder.DOT || LA13_4 === ATNBuilder.LEXER_CHAR_SET || LA13_4 === ATNBuilder.NOT || LA13_4 === ATNBuilder.PLUS_ASSIGN || LA13_4 === ATNBuilder.RANGE || LA13_4 === ATNBuilder.RULE_REF || LA13_4 === ATNBuilder.SEMPRED || LA13_4 === ATNBuilder.STRING_LITERAL || LA13_4 === ATNBuilder.TOKEN_REF || (LA13_4 >= ATNBuilder.BLOCK && LA13_4 <= ATNBuilder.CLOSURE) || (LA13_4 >= ATNBuilder.OPTIONAL && LA13_4 <= ATNBuilder.POSITIVE_CLOSURE) || (LA13_4 >= ATNBuilder.SET && LA13_4 <= ATNBuilder.WILDCARD))) {
                                alt13 = 4;
                            } else {
                                const nvaeMark = this.input!.mark();
                                const lastIndex = this.input!.index;
                                try {
                                    this.input!.consume();
                                    const nvae =
                                        new NoViableAltException("", 13, 4, this.input);
                                    throw nvae;
                                } finally {
                                    this.input!.seek(lastIndex);
                                    this.input!.release(nvaeMark);
                                }
                            }
                        }

                    }
                    break;
                }

                case GrammarTreeVisitor.SEMPRED: {
                    {
                        const LA13_5 = this.input!.LA(2);
                        if ((LA13_5 === GrammarTreeVisitor.DOWN)) {
                            alt13 = 7;
                        } else {
                            if (((LA13_5 >= GrammarTreeVisitor.UP && LA13_5 <= ATNBuilder.ACTION) || LA13_5 === ATNBuilder.ASSIGN || LA13_5 === ATNBuilder.DOT || LA13_5 === ATNBuilder.LEXER_CHAR_SET || LA13_5 === ATNBuilder.NOT || LA13_5 === ATNBuilder.PLUS_ASSIGN || LA13_5 === ATNBuilder.RANGE || LA13_5 === ATNBuilder.RULE_REF || LA13_5 === ATNBuilder.SEMPRED || LA13_5 === ATNBuilder.STRING_LITERAL || LA13_5 === ATNBuilder.TOKEN_REF || (LA13_5 >= ATNBuilder.BLOCK && LA13_5 <= ATNBuilder.CLOSURE) || (LA13_5 >= ATNBuilder.OPTIONAL && LA13_5 <= ATNBuilder.POSITIVE_CLOSURE) || (LA13_5 >= ATNBuilder.SET && LA13_5 <= ATNBuilder.WILDCARD))) {
                                alt13 = 5;
                            } else {
                                const nvaeMark = this.input!.mark();
                                const lastIndex = this.input!.index;
                                try {
                                    this.input!.consume();
                                    const nvae =
                                        new NoViableAltException("", 13, 5, this.input);
                                    throw nvae;
                                } finally {
                                    this.input!.seek(lastIndex);
                                    this.input!.release(nvaeMark);
                                }
                            }
                        }

                    }
                    break;
                }

                case GrammarTreeVisitor.NOT: {
                    {
                        alt13 = 8;
                    }
                    break;
                }

                case GrammarTreeVisitor.LEXER_CHAR_SET: {
                    {
                        alt13 = 9;
                    }
                    break;
                }

                default: {
                    const nvae = new NoViableAltException("", 13, 0, this.input);
                    throw nvae;
                }

            }

            switch (alt13) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:132:4: labeledElement
                    {
                        this.pushFollow(null);
                        labeledElement8 = this.labeledElement();
                        this.state._fsp--;

                        retval.p = labeledElement8!;
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:133:4: atom
                    {
                        this.pushFollow(null);
                        atom9 = this.atom();
                        this.state._fsp--;

                        retval.p = atom9.p;
                    }

                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:134:4: subrule
                    {
                        this.pushFollow(null);
                        subrule10 = this.subrule();
                        this.state._fsp--;

                        retval.p = subrule10.p;
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:135:6: ACTION
                    {
                        ACTION11 = this.match(this.input!, ATNBuilder.ACTION, null) as GrammarAST;
                        retval.p = this.factory!.action(ACTION11 as ActionAST);
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/ATNBuilder.g:136:6: SEMPRED
                    {
                        SEMPRED12 = this.match(this.input!, ATNBuilder.SEMPRED, null) as GrammarAST;
                        retval.p = this.factory!.sempred(SEMPRED12 as PredAST);
                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/ATNBuilder.g:137:6: ^( ACTION . )
                    {
                        ACTION13 = this.match(this.input!, ATNBuilder.ACTION, null) as GrammarAST;
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.matchAny(this.input!);
                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = this.factory!.action(ACTION13 as ActionAST);
                    }
                    break;
                }

                case 7: {
                    // org/antlr/v4/parse/ATNBuilder.g:138:6: ^( SEMPRED . )
                    {
                        SEMPRED14 = this.match(this.input!, ATNBuilder.SEMPRED, null) as GrammarAST;
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.matchAny(this.input!);
                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = this.factory!.sempred(SEMPRED14 as PredAST);
                    }
                    break;
                }

                case 8: {
                    // org/antlr/v4/parse/ATNBuilder.g:139:7: ^( NOT b= blockSet[true] )
                    {
                        this.match(this.input!, ATNBuilder.NOT, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.pushFollow(null);
                        b = this.blockSet(true);
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = b.p;
                    }
                    break;
                }

                case 9: {
                    // org/antlr/v4/parse/ATNBuilder.g:140:7: LEXER_CHAR_SET
                    {
                        this.match(this.input!, ATNBuilder.LEXER_CHAR_SET, null);
                        retval.p = this.factory!.charSetLiteral((retval.start as GrammarAST))!;
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return retval;
    }
    // $ANTLR end "element"

    // $ANTLR start "astOperand"
    // org/antlr/v4/parse/ATNBuilder.g:143:1: astOperand returns [IStatePair p] : ( atom | ^( NOT blockSet[true] ) );
    public astOperand(): IStatePair | null {
        let p = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:144:2: ( atom | ^( NOT blockSet[true] ) )
            let alt14 = 2;
            const LA14_0 = this.input!.LA(1);
            if ((LA14_0 === ATNBuilder.DOT || LA14_0 === ATNBuilder.RANGE || LA14_0 === ATNBuilder.RULE_REF || LA14_0 === ATNBuilder.STRING_LITERAL || LA14_0 === ATNBuilder.TOKEN_REF || (LA14_0 >= ATNBuilder.SET && LA14_0 <= ATNBuilder.WILDCARD))) {
                alt14 = 1;
            } else {
                if ((LA14_0 === ATNBuilder.NOT)) {
                    alt14 = 2;
                } else {
                    const nvae =
                        new NoViableAltException("", 14, 0, this.input);
                    throw nvae;
                }
            }

            switch (alt14) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:144:4: atom
                    {
                        this.pushFollow(null);
                        const atom15 = this.atom();
                        this.state._fsp--;

                        p = atom15.p;
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:145:4: ^( NOT blockSet[true] )
                    {
                        this.match(this.input!, ATNBuilder.NOT, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.pushFollow(null);
                        const blockSet16 = this.blockSet(true);
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        p = blockSet16.p;
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return p;
    }
    // $ANTLR end "astOperand"

    // $ANTLR start "labeledElement"
    // org/antlr/v4/parse/ATNBuilder.g:148:1: labeledElement returns [IStatePair p] : ( ^( ASSIGN ID element ) | ^( PLUS_ASSIGN ID element ) );
    public labeledElement(): IStatePair | null {
        let p = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:149:2: ( ^( ASSIGN ID element ) | ^( PLUS_ASSIGN ID element ) )
            let alt15 = 2;
            const LA15_0 = this.input!.LA(1);
            if ((LA15_0 === ATNBuilder.ASSIGN)) {
                alt15 = 1;
            } else {
                if ((LA15_0 === ATNBuilder.PLUS_ASSIGN)) {
                    alt15 = 2;
                } else {
                    const nvae =
                        new NoViableAltException("", 15, 0, this.input);
                    throw nvae;
                }
            }

            switch (alt15) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:149:4: ^( ASSIGN ID element )
                    {
                        this.match(this.input!, ATNBuilder.ASSIGN, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.match(this.input!, ATNBuilder.ID, null);
                        this.pushFollow(null);
                        const element17 = this.element();
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        p = this.factory!.label(element17.p);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:150:4: ^( PLUS_ASSIGN ID element )
                    {
                        this.match(this.input!, ATNBuilder.PLUS_ASSIGN, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.match(this.input!, ATNBuilder.ID, null);
                        this.pushFollow(null);
                        const element18 = this.element();
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        p = this.factory!.listLabel(element18.p);
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return p;
    }

    // $ANTLR start "subrule"
    // org/antlr/v4/parse/ATNBuilder.g:153:1: subrule returns [IStatePair p] : ( ^( OPTIONAL block[$start] ) | ^( CLOSURE block[$start] ) | ^( POSITIVE_CLOSURE block[$start] ) | block[null] );
    public subrule(): ATNBuilder.subrule_return {
        const retval = new ATNBuilder.subrule_return();
        retval.start = this.input!.LT(1);

        try {
            // org/antlr/v4/parse/ATNBuilder.g:154:2: ( ^( OPTIONAL block[$start] ) | ^( CLOSURE block[$start] ) | ^( POSITIVE_CLOSURE block[$start] ) | block[null] )
            let alt16 = 4;
            switch (this.input!.LA(1)) {
                case GrammarTreeVisitor.OPTIONAL: {
                    {
                        alt16 = 1;
                    }
                    break;
                }

                case GrammarTreeVisitor.CLOSURE: {
                    {
                        alt16 = 2;
                    }
                    break;
                }

                case GrammarTreeVisitor.POSITIVE_CLOSURE: {
                    {
                        alt16 = 3;
                    }
                    break;
                }

                case GrammarTreeVisitor.BLOCK: {
                    {
                        alt16 = 4;
                    }
                    break;
                }

                default: {
                    const nvae = new NoViableAltException("", 16, 0, this.input);
                    throw nvae;
                }

            }
            switch (alt16) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:154:4: ^( OPTIONAL block[$start] )
                    {
                        this.match(this.input!, ATNBuilder.OPTIONAL, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.pushFollow(null);
                        const block19 = this.block((retval.start as GrammarAST));
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = block19!;
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:155:4: ^( CLOSURE block[$start] )
                    {
                        this.match(this.input!, ATNBuilder.CLOSURE, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.pushFollow(null);
                        const block20 = this.block((retval.start as GrammarAST));
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = block20!;
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:156:4: ^( POSITIVE_CLOSURE block[$start] )
                    {
                        this.match(this.input!, ATNBuilder.POSITIVE_CLOSURE, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.pushFollow(null);
                        const block21 = this.block((retval.start as GrammarAST));
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = block21!;
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:157:5: block[null]
                    {
                        this.pushFollow(null);
                        const block22 = this.block(null);
                        this.state._fsp--;

                        retval.p = block22!;
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return retval;
    }

    // $ANTLR start "blockSet"
    // org/antlr/v4/parse/ATNBuilder.g:160:1: blockSet[boolean invert] returns [IStatePair p] : ^( SET ( setElement )+ ) ;
    public blockSet(invert: boolean): ATNBuilder.blockSet_return {
        const retval = new ATNBuilder.blockSet_return();
        retval.start = this.input!.LT(1);

        const alts = new Array<GrammarAST>();
        try {
            // org/antlr/v4/parse/ATNBuilder.g:162:2: ( ^( SET ( setElement )+ ) )
            // org/antlr/v4/parse/ATNBuilder.g:162:4: ^( SET ( setElement )+ )
            {
                this.match(this.input!, ATNBuilder.SET, null);
                this.match(this.input!, TreeParser.DOWN, null);
                // org/antlr/v4/parse/ATNBuilder.g:162:10: ( setElement )+
                let cnt17 = 0;
                loop17:
                while (true) {
                    let alt17 = 2;
                    const LA17_0 = this.input!.LA(1);
                    if ((LA17_0 === ATNBuilder.LEXER_CHAR_SET || LA17_0 === ATNBuilder.RANGE || LA17_0 === ATNBuilder.STRING_LITERAL || LA17_0 === ATNBuilder.TOKEN_REF)) {
                        alt17 = 1;
                    }

                    switch (alt17) {
                        case 1: {
                            // org/antlr/v4/parse/ATNBuilder.g:162:11: setElement
                            {
                                this.pushFollow(null);
                                const setElement23 = this.setElement();
                                this.state._fsp--;

                                alts.push(setElement23.start as GrammarAST);
                            }
                            break;
                        }

                        default: {
                            if (cnt17 >= 1) {
                                break loop17;
                            }

                            const eee = new EarlyExitException(17, this.input);
                            throw eee;
                        }

                    }
                    cnt17++;
                }

                this.match(this.input!, TreeParser.UP, null);

                retval.p = this.factory!.set((retval.start as GrammarAST), alts, invert);
            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return retval;
    }

    // $ANTLR start "setElement"
    // org/antlr/v4/parse/ATNBuilder.g:166:1: setElement : ( ^( STRING_LITERAL . ) | ^( TOKEN_REF . ) | STRING_LITERAL | TOKEN_REF | ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) | LEXER_CHAR_SET );
    public setElement(): ATNBuilder.setElement_return {
        const retval = new ATNBuilder.setElement_return();
        retval.start = this.input!.LT(1);

        try {
            // org/antlr/v4/parse/ATNBuilder.g:167:2: ( ^( STRING_LITERAL . ) | ^( TOKEN_REF . ) | STRING_LITERAL | TOKEN_REF | ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) | LEXER_CHAR_SET )
            let alt18 = 6;
            switch (this.input!.LA(1)) {
                case GrammarTreeVisitor.STRING_LITERAL: {
                    {
                        const LA18_1 = this.input!.LA(2);
                        if ((LA18_1 === GrammarTreeVisitor.DOWN)) {
                            alt18 = 1;
                        } else {
                            if ((LA18_1 === GrammarTreeVisitor.UP || LA18_1 === ATNBuilder.LEXER_CHAR_SET
                                || LA18_1 === ATNBuilder.RANGE || LA18_1 === ATNBuilder.STRING_LITERAL
                                || LA18_1 === ATNBuilder.TOKEN_REF)) {
                                alt18 = 3;
                            } else {
                                const nvaeMark = this.input!.mark();
                                const lastIndex = this.input!.index;
                                try {
                                    this.input!.consume();
                                    const nvae =
                                        new NoViableAltException("", 18, 1, this.input);
                                    throw nvae;
                                } finally {
                                    this.input!.seek(lastIndex);
                                    this.input!.release(nvaeMark);
                                }
                            }
                        }

                    }
                    break;
                }

                case GrammarTreeVisitor.TOKEN_REF: {
                    {
                        const LA18_2 = this.input!.LA(2);
                        if ((LA18_2 === GrammarTreeVisitor.DOWN)) {
                            alt18 = 2;
                        } else {
                            if ((LA18_2 === GrammarTreeVisitor.UP || LA18_2 === ATNBuilder.LEXER_CHAR_SET
                                || LA18_2 === ATNBuilder.RANGE || LA18_2 === ATNBuilder.STRING_LITERAL
                                || LA18_2 === ATNBuilder.TOKEN_REF)) {
                                alt18 = 4;
                            } else {
                                const nvaeMark = this.input!.mark();
                                const lastIndex = this.input!.index;
                                try {
                                    this.input!.consume();
                                    const nvae =
                                        new NoViableAltException("", 18, 2, this.input);
                                    throw nvae;
                                } finally {
                                    this.input!.seek(lastIndex);
                                    this.input!.release(nvaeMark);
                                }
                            }
                        }

                    }
                    break;
                }

                case GrammarTreeVisitor.RANGE: {
                    {
                        alt18 = 5;
                    }
                    break;
                }

                case GrammarTreeVisitor.LEXER_CHAR_SET: {
                    {
                        alt18 = 6;
                    }
                    break;
                }

                default: {
                    const nvae =
                        new NoViableAltException("", 18, 0, this.input);
                    throw nvae;
                }

            }
            switch (alt18) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:167:4: ^( STRING_LITERAL . )
                    {
                        this.match(this.input!, ATNBuilder.STRING_LITERAL, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.matchAny(this.input!);
                        this.match(this.input!, TreeParser.UP, null);

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:168:4: ^( TOKEN_REF . )
                    {
                        this.match(this.input!, ATNBuilder.TOKEN_REF, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.matchAny(this.input!);
                        this.match(this.input!, TreeParser.UP, null);

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:169:4: STRING_LITERAL
                    {
                        this.match(this.input!, ATNBuilder.STRING_LITERAL, null);
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:170:4: TOKEN_REF
                    {
                        this.match(this.input!, ATNBuilder.TOKEN_REF, null);
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/ATNBuilder.g:171:4: ^( RANGE a= STRING_LITERAL b= STRING_LITERAL )
                    {
                        this.match(this.input!, ATNBuilder.RANGE, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.match(this.input!, ATNBuilder.STRING_LITERAL, null);
                        this.match(this.input!, ATNBuilder.STRING_LITERAL, null);
                        this.match(this.input!, TreeParser.UP, null);

                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/ATNBuilder.g:172:9: LEXER_CHAR_SET
                    {
                        this.match(this.input!, ATNBuilder.LEXER_CHAR_SET, null);
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return retval;
    }

    // $ANTLR start "atom"
    // org/antlr/v4/parse/ATNBuilder.g:175:1: atom returns [IStatePair p] : ( range | ^( DOT ID terminal ) | ^( DOT ID ruleref ) | ^( WILDCARD . ) | WILDCARD | blockSet[false] | terminal | ruleref );
    public atom(): ATNBuilder.atom_return {
        const retval = new ATNBuilder.atom_return();
        retval.start = this.input!.LT(1);

        try {
            // org/antlr/v4/parse/ATNBuilder.g:176:2: ( range | ^( DOT ID terminal ) | ^( DOT ID ruleref ) | ^( WILDCARD . ) | WILDCARD | blockSet[false] | terminal | ruleref )
            let alt19 = 8;
            switch (this.input!.LA(1)) {
                case GrammarTreeVisitor.RANGE: {
                    {
                        alt19 = 1;
                    }
                    break;
                }

                case GrammarTreeVisitor.DOT: {
                    {
                        const LA19_2 = this.input!.LA(2);
                        if ((LA19_2 === GrammarTreeVisitor.DOWN)) {
                            const LA19_7 = this.input!.LA(3);
                            if ((LA19_7 === ATNBuilder.ID)) {
                                const LA19_10 = this.input!.LA(4);
                                if ((LA19_10 === ATNBuilder.STRING_LITERAL || LA19_10 === ATNBuilder.TOKEN_REF)) {
                                    alt19 = 2;
                                } else {
                                    if ((LA19_10 === ATNBuilder.RULE_REF)) {
                                        alt19 = 3;
                                    } else {
                                        const nvaeMark = this.input!.mark();
                                        const lastIndex = this.input!.index;
                                        try {
                                            for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                                this.input!.consume();
                                            }
                                            const nvae = new NoViableAltException("", 19, 10, this.input);
                                            throw nvae;
                                        } finally {
                                            this.input!.seek(lastIndex);
                                            this.input!.release(nvaeMark);
                                        }
                                    }
                                }

                            } else {
                                const nvaeMark = this.input!.mark();
                                const lastIndex = this.input!.index;
                                try {
                                    for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                        this.input!.consume();
                                    }
                                    const nvae = new NoViableAltException("", 19, 7, this.input);
                                    throw nvae;
                                } finally {
                                    this.input!.seek(lastIndex);
                                    this.input!.release(nvaeMark);
                                }
                            }

                        } else {
                            const nvaeMark = this.input!.mark();
                            const lastIndex = this.input!.index;
                            try {
                                this.input!.consume();
                                const nvae = new NoViableAltException("", 19, 2, this.input);
                                throw nvae;
                            } finally {
                                this.input!.seek(lastIndex);
                                this.input!.release(nvaeMark);
                            }
                        }

                    }
                    break;
                }

                case GrammarTreeVisitor.WILDCARD: {
                    {
                        const LA19_3 = this.input!.LA(2);
                        if ((LA19_3 === GrammarTreeVisitor.DOWN)) {
                            alt19 = 4;
                        } else {
                            if ((LA19_3 === ATNBuilder.EOF || (LA19_3 >= GrammarTreeVisitor.UP && LA19_3 <= ATNBuilder.ACTION) || LA19_3 === ATNBuilder.ASSIGN || LA19_3 === ATNBuilder.DOT || LA19_3 === ATNBuilder.LEXER_CHAR_SET || LA19_3 === ATNBuilder.NOT || LA19_3 === ATNBuilder.PLUS_ASSIGN || LA19_3 === ATNBuilder.RANGE || LA19_3 === ATNBuilder.RULE_REF || LA19_3 === ATNBuilder.SEMPRED || LA19_3 === ATNBuilder.STRING_LITERAL || LA19_3 === ATNBuilder.TOKEN_REF || (LA19_3 >= ATNBuilder.BLOCK && LA19_3 <= ATNBuilder.CLOSURE) || (LA19_3 >= ATNBuilder.OPTIONAL && LA19_3 <= ATNBuilder.POSITIVE_CLOSURE) || (LA19_3 >= ATNBuilder.SET && LA19_3 <= ATNBuilder.WILDCARD))) {
                                alt19 = 5;
                            } else {
                                const nvaeMark = this.input!.mark();
                                const lastIndex = this.input!.index;
                                try {
                                    this.input!.consume();
                                    const nvae = new NoViableAltException("", 19, 3, this.input);
                                    throw nvae;
                                } finally {
                                    this.input!.seek(lastIndex);
                                    this.input!.release(nvaeMark);
                                }
                            }
                        }

                    }
                    break;
                }

                case GrammarTreeVisitor.SET: {
                    {
                        alt19 = 6;
                    }
                    break;
                }

                case GrammarTreeVisitor.STRING_LITERAL:
                case GrammarTreeVisitor.TOKEN_REF: {
                    {
                        alt19 = 7;
                    }
                    break;
                }

                case GrammarTreeVisitor.RULE_REF: {
                    {
                        alt19 = 8;
                    }
                    break;
                }

                default: {
                    const nvae = new NoViableAltException("", 19, 0, this.input);
                    throw nvae;
                }

            }
            switch (alt19) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:176:4: range
                    {
                        this.pushFollow(null);
                        const range24 = this.range();
                        this.state._fsp--;

                        retval.p = range24!;
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:177:4: ^( DOT ID terminal )
                    {
                        this.match(this.input!, ATNBuilder.DOT, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.match(this.input!, ATNBuilder.ID, null);
                        this.pushFollow(null);
                        const terminal25 = this.terminal();
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = terminal25.p;
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:178:4: ^( DOT ID ruleref )
                    {
                        this.match(this.input!, ATNBuilder.DOT, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.match(this.input!, ATNBuilder.ID, null);
                        this.pushFollow(null);
                        const ruleref26 = this.ruleref();
                        this.state._fsp--;

                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = ruleref26!;
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:179:7: ^( WILDCARD . )
                    {
                        this.match(this.input!, ATNBuilder.WILDCARD, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.matchAny(this.input!);
                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = this.factory!.wildcard((retval.start as GrammarAST));
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/ATNBuilder.g:180:7: WILDCARD
                    {
                        this.match(this.input!, ATNBuilder.WILDCARD, null);
                        retval.p = this.factory!.wildcard((retval.start as GrammarAST));
                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/ATNBuilder.g:181:7: blockSet[false]
                    {
                        this.pushFollow(null);
                        const blockSet27 = this.blockSet(false);
                        this.state._fsp--;

                        retval.p = blockSet27.p;
                    }
                    break;
                }

                case 7: {
                    // org/antlr/v4/parse/ATNBuilder.g:182:9: terminal
                    {
                        this.pushFollow(null);
                        const terminal28 = this.terminal();
                        this.state._fsp--;

                        retval.p = terminal28.p;
                    }
                    break;
                }

                case 8: {
                    // org/antlr/v4/parse/ATNBuilder.g:183:9: ruleref
                    {
                        this.pushFollow(null);
                        const ruleref29 = this.ruleref();
                        this.state._fsp--;

                        retval.p = ruleref29!;
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return retval;
    }
    // $ANTLR end "atom"

    // $ANTLR start "ruleref"
    // org/antlr/v4/parse/ATNBuilder.g:186:1: ruleref returns [IStatePair p] : ( ^( RULE_REF ( ARG_ACTION )? ^( ELEMENT_OPTIONS ( . )* ) ) | ^( RULE_REF ( ARG_ACTION )? ) | RULE_REF );
    public ruleref(): IStatePair | null {
        let p = null;

        let RULE_REF30 = null;
        let RULE_REF31 = null;
        let RULE_REF32 = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:187:5: ( ^( RULE_REF ( ARG_ACTION )? ^( ELEMENT_OPTIONS ( . )* ) ) | ^( RULE_REF ( ARG_ACTION )? ) | RULE_REF )
            let alt23 = 3;
            const LA23_0 = this.input!.LA(1);
            if ((LA23_0 === ATNBuilder.RULE_REF)) {
                const LA23_1 = this.input!.LA(2);
                if ((LA23_1 === GrammarTreeVisitor.DOWN)) {
                    switch (this.input!.LA(3)) {
                        case GrammarTreeVisitor.ARG_ACTION: {
                            {
                                const LA23_4 = this.input!.LA(4);
                                if ((LA23_4 === ATNBuilder.ELEMENT_OPTIONS)) {
                                    alt23 = 1;
                                } else {
                                    if ((LA23_4 === GrammarTreeVisitor.UP)) {
                                        alt23 = 2;
                                    } else {
                                        const nvaeMark = this.input!.mark();
                                        const lastIndex = this.input!.index;
                                        try {
                                            for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                                this.input!.consume();
                                            }
                                            const nvae = new NoViableAltException("", 23, 4, this.input);
                                            throw nvae;
                                        } finally {
                                            this.input!.seek(lastIndex);
                                            this.input!.release(nvaeMark);
                                        }
                                    }
                                }

                            }
                            break;
                        }

                        case GrammarTreeVisitor.ELEMENT_OPTIONS: {
                            {
                                alt23 = 1;
                            }
                            break;
                        }

                        case GrammarTreeVisitor.UP: {
                            {
                                alt23 = 2;
                            }
                            break;
                        }

                        default: {
                            const nvaeMark = this.input!.mark();
                            const lastIndex = this.input!.index;
                            try {
                                for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                    this.input!.consume();
                                }
                                const nvae =
                                    new NoViableAltException("", 23, 2, this.input);
                                throw nvae;
                            } finally {
                                this.input!.seek(lastIndex);
                                this.input!.release(nvaeMark);
                            }
                        }

                    }
                } else {
                    if ((LA23_1 === ATNBuilder.EOF || (LA23_1 >= GrammarTreeVisitor.UP && LA23_1 <= ATNBuilder.ACTION) || LA23_1 === ATNBuilder.ASSIGN || LA23_1 === ATNBuilder.DOT || LA23_1 === ATNBuilder.LEXER_CHAR_SET || LA23_1 === ATNBuilder.NOT || LA23_1 === ATNBuilder.PLUS_ASSIGN || LA23_1 === ATNBuilder.RANGE || LA23_1 === ATNBuilder.RULE_REF || LA23_1 === ATNBuilder.SEMPRED || LA23_1 === ATNBuilder.STRING_LITERAL || LA23_1 === ATNBuilder.TOKEN_REF || (LA23_1 >= ATNBuilder.BLOCK && LA23_1 <= ATNBuilder.CLOSURE) || (LA23_1 >= ATNBuilder.OPTIONAL && LA23_1 <= ATNBuilder.POSITIVE_CLOSURE) || (LA23_1 >= ATNBuilder.SET && LA23_1 <= ATNBuilder.WILDCARD))) {
                        alt23 = 3;
                    } else {
                        const nvaeMark = this.input!.mark();
                        const lastIndex = this.input!.index;
                        try {
                            this.input!.consume();
                            const nvae =
                                new NoViableAltException("", 23, 1, this.input);
                            throw nvae;
                        } finally {
                            this.input!.seek(lastIndex);
                            this.input!.release(nvaeMark);
                        }
                    }
                }

            } else {
                const nvae =
                    new NoViableAltException("", 23, 0, this.input);
                throw nvae;
            }

            switch (alt23) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:187:7: ^( RULE_REF ( ARG_ACTION )? ^( ELEMENT_OPTIONS ( . )* ) )
                    {
                        RULE_REF30 = this.match(this.input!, ATNBuilder.RULE_REF, null) as GrammarAST;
                        this.match(this.input!, TreeParser.DOWN, null);
                        // org/antlr/v4/parse/ATNBuilder.g:187:18: ( ARG_ACTION )?
                        let alt20 = 2;
                        const LA20_0 = this.input!.LA(1);
                        if ((LA20_0 === ATNBuilder.ARG_ACTION)) {
                            alt20 = 1;
                        }
                        switch (alt20) {
                            case 1: {
                                // org/antlr/v4/parse/ATNBuilder.g:187:18: ARG_ACTION
                                {
                                    this.match(this.input!, ATNBuilder.ARG_ACTION, null);
                                }
                                break;
                            }

                            default:

                        }

                        this.match(this.input!, ATNBuilder.ELEMENT_OPTIONS, null);
                        if (this.input!.LA(1) === TreeParser.DOWN) {
                            this.match(this.input!, TreeParser.DOWN, null);
                            // org/antlr/v4/parse/ATNBuilder.g:187:48: ( . )*
                            loop21:
                            while (true) {
                                let alt21 = 2;
                                const LA21_0 = this.input!.LA(1);
                                if (((LA21_0 >= ATNBuilder.ACTION && LA21_0 <= ATNBuilder.WILDCARD))) {
                                    alt21 = 1;
                                } else {
                                    if ((LA21_0 === GrammarTreeVisitor.UP)) {
                                        alt21 = 2;
                                    }
                                }

                                switch (alt21) {
                                    case 1: {
                                        // org/antlr/v4/parse/ATNBuilder.g:187:48: .
                                        {
                                            this.matchAny(this.input!);
                                        }
                                        break;
                                    }

                                    default: {
                                        break loop21;
                                    }

                                }
                            }

                            this.match(this.input!, TreeParser.UP, null);
                        }

                        this.match(this.input!, TreeParser.UP, null);

                        p = this.factory!.ruleRef(RULE_REF30);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:188:7: ^( RULE_REF ( ARG_ACTION )? )
                    {
                        RULE_REF31 = this.match(this.input!, ATNBuilder.RULE_REF, null) as GrammarAST;
                        if (this.input!.LA(1) === TreeParser.DOWN) {
                            this.match(this.input!, TreeParser.DOWN, null);
                            // org/antlr/v4/parse/ATNBuilder.g:188:18: ( ARG_ACTION )?
                            let alt22 = 2;
                            const LA22_0 = this.input!.LA(1);
                            if ((LA22_0 === ATNBuilder.ARG_ACTION)) {
                                alt22 = 1;
                            }
                            switch (alt22) {
                                case 1: {
                                    // org/antlr/v4/parse/ATNBuilder.g:188:18: ARG_ACTION
                                    {
                                        this.match(this.input!, ATNBuilder.ARG_ACTION, null);
                                    }
                                    break;
                                }

                                default:

                            }

                            this.match(this.input!, TreeParser.UP, null);
                        }

                        p = this.factory!.ruleRef(RULE_REF31);
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:189:7: RULE_REF
                    {
                        RULE_REF32 = this.match(this.input!, ATNBuilder.RULE_REF, null) as GrammarAST;
                        p = this.factory!.ruleRef(RULE_REF32);
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return p;
    }
    // $ANTLR end "ruleref"

    // $ANTLR start "range"
    // org/antlr/v4/parse/ATNBuilder.g:192:1: range returns [IStatePair p] : ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) ;
    public range(): IStatePair | null {
        let p = null;

        let a = null;
        let b = null;

        try {
            // org/antlr/v4/parse/ATNBuilder.g:193:5: ( ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) )
            // org/antlr/v4/parse/ATNBuilder.g:193:7: ^( RANGE a= STRING_LITERAL b= STRING_LITERAL )
            {
                this.match(this.input!, ATNBuilder.RANGE, null);
                this.match(this.input!, TreeParser.DOWN, null);
                a = this.match(this.input!, ATNBuilder.STRING_LITERAL, null) as GrammarAST;
                b = this.match(this.input!, ATNBuilder.STRING_LITERAL, null) as GrammarAST;
                this.match(this.input!, TreeParser.UP, null);

                p = this.factory!.range(a, b);
            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return p;
    }

    // $ANTLR start "terminal"
    // org/antlr/v4/parse/ATNBuilder.g:196:1: terminal returns [IStatePair p] : ( ^( STRING_LITERAL . ) | STRING_LITERAL | ^( TOKEN_REF ARG_ACTION . ) | ^( TOKEN_REF . ) | TOKEN_REF );
    public terminal(): ATNBuilder.terminal_return {
        const retval = new ATNBuilder.terminal_return();
        retval.start = this.input!.LT(1);

        try {
            // org/antlr/v4/parse/ATNBuilder.g:197:5: ( ^( STRING_LITERAL . ) | STRING_LITERAL | ^( TOKEN_REF ARG_ACTION . ) | ^( TOKEN_REF . ) | TOKEN_REF )
            let alt24 = 5;
            const LA24_0 = this.input!.LA(1);
            if ((LA24_0 === ATNBuilder.STRING_LITERAL)) {
                const LA24_1 = this.input!.LA(2);
                if ((LA24_1 === GrammarTreeVisitor.DOWN)) {
                    alt24 = 1;
                } else {
                    if ((LA24_1 === ATNBuilder.EOF || (LA24_1 >= GrammarTreeVisitor.UP && LA24_1 <= ATNBuilder.ACTION) || LA24_1 === ATNBuilder.ASSIGN || LA24_1 === ATNBuilder.DOT || LA24_1 === ATNBuilder.LEXER_CHAR_SET || LA24_1 === ATNBuilder.NOT || LA24_1 === ATNBuilder.PLUS_ASSIGN || LA24_1 === ATNBuilder.RANGE || LA24_1 === ATNBuilder.RULE_REF || LA24_1 === ATNBuilder.SEMPRED || LA24_1 === ATNBuilder.STRING_LITERAL || LA24_1 === ATNBuilder.TOKEN_REF || (LA24_1 >= ATNBuilder.BLOCK && LA24_1 <= ATNBuilder.CLOSURE) || (LA24_1 >= ATNBuilder.OPTIONAL && LA24_1 <= ATNBuilder.POSITIVE_CLOSURE) || (LA24_1 >= ATNBuilder.SET && LA24_1 <= ATNBuilder.WILDCARD))) {
                        alt24 = 2;
                    } else {
                        const nvaeMark = this.input!.mark();
                        const lastIndex = this.input!.index;
                        try {
                            this.input!.consume();
                            const nvae = new NoViableAltException("", 24, 1, this.input);
                            throw nvae;
                        } finally {
                            this.input!.seek(lastIndex);
                            this.input!.release(nvaeMark);
                        }
                    }
                }

            } else {
                if ((LA24_0 === ATNBuilder.TOKEN_REF)) {
                    const LA24_2 = this.input!.LA(2);
                    if ((LA24_2 === GrammarTreeVisitor.DOWN)) {
                        const LA24_5 = this.input!.LA(3);
                        if ((LA24_5 === ATNBuilder.ARG_ACTION)) {
                            const LA24_7 = this.input!.LA(4);
                            if (((LA24_7 >= ATNBuilder.ACTION && LA24_7 <= ATNBuilder.WILDCARD))) {
                                alt24 = 3;
                            } else {
                                if (((LA24_7 >= GrammarTreeVisitor.DOWN && LA24_7 <= GrammarTreeVisitor.UP))) {
                                    alt24 = 4;
                                } else {
                                    const nvaeMark = this.input!.mark();
                                    const lastIndex = this.input!.index;
                                    try {
                                        for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                            this.input!.consume();
                                        }
                                        const nvae = new NoViableAltException("", 24, 7, this.input);
                                        throw nvae;
                                    } finally {
                                        this.input!.seek(lastIndex);
                                        this.input!.release(nvaeMark);
                                    }
                                }
                            }

                        } else {
                            if (((LA24_5 >= ATNBuilder.ACTION && LA24_5 <= ATNBuilder.ACTION_STRING_LITERAL) || (LA24_5 >= ATNBuilder.ARG_OR_CHARSET && LA24_5 <= ATNBuilder.WILDCARD))) {
                                alt24 = 4;
                            } else {
                                const nvaeMark = this.input!.mark();
                                const lastIndex = this.input!.index;
                                try {
                                    for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                        this.input!.consume();
                                    }
                                    const nvae = new NoViableAltException("", 24, 5, this.input);
                                    throw nvae;
                                } finally {
                                    this.input!.seek(lastIndex);
                                    this.input!.release(nvaeMark);
                                }
                            }
                        }

                    } else {
                        if ((LA24_2 === ATNBuilder.EOF || (LA24_2 >= GrammarTreeVisitor.UP && LA24_2 <= ATNBuilder.ACTION) || LA24_2 === ATNBuilder.ASSIGN || LA24_2 === ATNBuilder.DOT || LA24_2 === ATNBuilder.LEXER_CHAR_SET || LA24_2 === ATNBuilder.NOT || LA24_2 === ATNBuilder.PLUS_ASSIGN || LA24_2 === ATNBuilder.RANGE || LA24_2 === ATNBuilder.RULE_REF || LA24_2 === ATNBuilder.SEMPRED || LA24_2 === ATNBuilder.STRING_LITERAL || LA24_2 === ATNBuilder.TOKEN_REF || (LA24_2 >= ATNBuilder.BLOCK && LA24_2 <= ATNBuilder.CLOSURE) || (LA24_2 >= ATNBuilder.OPTIONAL && LA24_2 <= ATNBuilder.POSITIVE_CLOSURE) || (LA24_2 >= ATNBuilder.SET && LA24_2 <= ATNBuilder.WILDCARD))) {
                            alt24 = 5;
                        } else {
                            const nvaeMark = this.input!.mark();
                            const lastIndex = this.input!.index;
                            try {
                                this.input!.consume();
                                const nvae = new NoViableAltException("", 24, 2, this.input);
                                throw nvae;
                            } finally {
                                this.input!.seek(lastIndex);
                                this.input!.release(nvaeMark);
                            }
                        }
                    }

                } else {
                    const nvae =
                        new NoViableAltException("", 24, 0, this.input);
                    throw nvae;
                }
            }

            switch (alt24) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:197:8: ^( STRING_LITERAL . )
                    {
                        this.match(this.input!, ATNBuilder.STRING_LITERAL, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.matchAny(this.input!);
                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = this.factory!.stringLiteral((retval.start as GrammarAST) as TerminalAST)!;
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:198:7: STRING_LITERAL
                    {
                        this.match(this.input!, ATNBuilder.STRING_LITERAL, null);
                        retval.p = this.factory!.stringLiteral((retval.start as GrammarAST) as TerminalAST)!;
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:199:7: ^( TOKEN_REF ARG_ACTION . )
                    {
                        this.match(this.input!, ATNBuilder.TOKEN_REF, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.match(this.input!, ATNBuilder.ARG_ACTION, null);
                        this.matchAny(this.input!);
                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = this.factory!.tokenRef((retval.start as GrammarAST) as TerminalAST)!;
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:200:7: ^( TOKEN_REF . )
                    {
                        this.match(this.input!, ATNBuilder.TOKEN_REF, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.matchAny(this.input!);
                        this.match(this.input!, TreeParser.UP, null);

                        retval.p = this.factory!.tokenRef((retval.start as GrammarAST) as TerminalAST)!;
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/ATNBuilder.g:201:7: TOKEN_REF
                    {
                        this.match(this.input!, ATNBuilder.TOKEN_REF, null);
                        retval.p = this.factory!.tokenRef((retval.start as GrammarAST) as TerminalAST)!;
                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

        return retval;
    }
    // $ANTLR end "terminal"

    // $ANTLR start "elementOptions"
    // org/antlr/v4/parse/ATNBuilder.g:204:1: elementOptions : ^( ELEMENT_OPTIONS ( elementOption )* ) ;
    public elementOptions(): void {
        try {
            // org/antlr/v4/parse/ATNBuilder.g:205:2: ( ^( ELEMENT_OPTIONS ( elementOption )* ) )
            // org/antlr/v4/parse/ATNBuilder.g:205:4: ^( ELEMENT_OPTIONS ( elementOption )* )
            {
                this.match(this.input!, ATNBuilder.ELEMENT_OPTIONS, null);
                if (this.input!.LA(1) === TreeParser.DOWN) {
                    this.match(this.input!, TreeParser.DOWN, null);
                    // org/antlr/v4/parse/ATNBuilder.g:205:22: ( elementOption )*
                    loop25:
                    while (true) {
                        let alt25 = 2;
                        const LA25_0 = this.input!.LA(1);
                        if ((LA25_0 === ATNBuilder.ASSIGN || LA25_0 === ATNBuilder.ID)) {
                            alt25 = 1;
                        }

                        switch (alt25) {
                            case 1: {
                                // org/antlr/v4/parse/ATNBuilder.g:205:22: elementOption
                                {
                                    this.pushFollow(null);
                                    this.elementOption();
                                    this.state._fsp--;

                                }
                                break;
                            }

                            default: {
                                break loop25;
                            }

                        }
                    }

                    this.match(this.input!, TreeParser.UP, null);
                }

            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }

    }
    // $ANTLR end "elementOptions"

    // $ANTLR start "elementOption"
    // org/antlr/v4/parse/ATNBuilder.g:208:1: elementOption : ( ID | ^( ASSIGN ID ID ) | ^( ASSIGN ID STRING_LITERAL ) | ^( ASSIGN ID ACTION ) | ^( ASSIGN ID INT ) );
    public elementOption(): void {
        try {
            // org/antlr/v4/parse/ATNBuilder.g:209:2: ( ID | ^( ASSIGN ID ID ) | ^( ASSIGN ID STRING_LITERAL ) | ^( ASSIGN ID ACTION ) | ^( ASSIGN ID INT ) )
            let alt26 = 5;
            const LA26_0 = this.input!.LA(1);
            if ((LA26_0 === ATNBuilder.ID)) {
                alt26 = 1;
            } else {
                if ((LA26_0 === ATNBuilder.ASSIGN)) {
                    const LA26_2 = this.input!.LA(2);
                    if ((LA26_2 === GrammarTreeVisitor.DOWN)) {
                        const LA26_3 = this.input!.LA(3);
                        if ((LA26_3 === ATNBuilder.ID)) {
                            switch (this.input!.LA(4)) {
                                case GrammarTreeVisitor.ID: {
                                    {
                                        alt26 = 2;
                                    }
                                    break;
                                }

                                case GrammarTreeVisitor.STRING_LITERAL: {
                                    {
                                        alt26 = 3;
                                    }
                                    break;
                                }

                                case GrammarTreeVisitor.ACTION: {
                                    {
                                        alt26 = 4;
                                    }
                                    break;
                                }

                                case GrammarTreeVisitor.INT: {
                                    {
                                        alt26 = 5;
                                    }
                                    break;
                                }

                                default: {
                                    const nvaeMark = this.input!.mark();
                                    const lastIndex = this.input!.index;
                                    try {
                                        for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                            this.input!.consume();
                                        }
                                        const nvae = new NoViableAltException("", 26, 4, this.input);
                                        throw nvae;
                                    } finally {
                                        this.input!.seek(lastIndex);
                                        this.input!.release(nvaeMark);
                                    }
                                }

                            }
                        } else {
                            const nvaeMark = this.input!.mark();
                            const lastIndex = this.input!.index;
                            try {
                                for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                    this.input!.consume();
                                }
                                const nvae = new NoViableAltException("", 26, 3, this.input);
                                throw nvae;
                            } finally {
                                this.input!.seek(lastIndex);
                                this.input!.release(nvaeMark);
                            }
                        }

                    } else {
                        const nvaeMark = this.input!.mark();
                        const lastIndex = this.input!.index;
                        try {
                            this.input!.consume();
                            const nvae = new NoViableAltException("", 26, 2, this.input);
                            throw nvae;
                        } finally {
                            this.input!.seek(lastIndex);
                            this.input!.release(nvaeMark);
                        }
                    }

                } else {
                    const nvae =
                        new NoViableAltException("", 26, 0, this.input);
                    throw nvae;
                }
            }

            switch (alt26) {
                case 1: {
                    // org/antlr/v4/parse/ATNBuilder.g:209:4: ID
                    {
                        this.match(this.input!, ATNBuilder.ID, null);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/ATNBuilder.g:210:4: ^( ASSIGN ID ID )
                    {
                        this.match(this.input!, ATNBuilder.ASSIGN, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.match(this.input!, ATNBuilder.ID, null);
                        this.match(this.input!, ATNBuilder.ID, null);
                        this.match(this.input!, TreeParser.UP, null);

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/ATNBuilder.g:211:4: ^( ASSIGN ID STRING_LITERAL )
                    {
                        this.match(this.input!, ATNBuilder.ASSIGN, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.match(this.input!, ATNBuilder.ID, null);
                        this.match(this.input!, ATNBuilder.STRING_LITERAL, null);
                        this.match(this.input!, TreeParser.UP, null);

                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/ATNBuilder.g:212:4: ^( ASSIGN ID ACTION )
                    {
                        this.match(this.input!, ATNBuilder.ASSIGN, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.match(this.input!, ATNBuilder.ID, null);
                        this.match(this.input!, ATNBuilder.ACTION, null);
                        this.match(this.input!, TreeParser.UP, null);

                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/ATNBuilder.g:213:4: ^( ASSIGN ID INT )
                    {
                        this.match(this.input!, ATNBuilder.ASSIGN, null);
                        this.match(this.input!, TreeParser.DOWN, null);
                        this.match(this.input!, ATNBuilder.ID, null);
                        this.match(this.input!, ATNBuilder.INT, null);
                        this.match(this.input!, TreeParser.UP, null);

                    }
                    break;
                }

                default:

            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                this.reportError(re);
                this.recover(this.input!, re);
            } else {
                throw re;
            }
        }
    }
}

export namespace ATNBuilder {
    export type lexerCommandExpr_return = InstanceType<typeof ATNBuilder.lexerCommandExpr_return>;
    export type element_return = InstanceType<typeof ATNBuilder.element_return>;
    export type subrule_return = InstanceType<typeof ATNBuilder.subrule_return>;
    export type blockSet_return = InstanceType<typeof ATNBuilder.blockSet_return>;
    export type setElement_return = InstanceType<typeof ATNBuilder.setElement_return>;
    export type atom_return = InstanceType<typeof ATNBuilder.atom_return>;
    export type terminal_return = InstanceType<typeof ATNBuilder.terminal_return>;
}
