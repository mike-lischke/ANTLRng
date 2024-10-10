// $ANTLR 3.5.3 ./SourceGenTriggers.g 2024-10-10 13:00:49

import { DFA, RecognitionException, Token, NoViableAltException } from "antlr4ng";

import type { BaseRecognizer } from "../antlr3/BaseRecognizer.js";
import { RecognizerSharedState } from "../antlr3/RecognizerSharedState.js";
import type { TreeNodeStream } from "../antlr3/tree/TreeNodeStream.js";
import { TreeParser } from "../antlr3/tree/TreeParser.js";
import { TreeRuleReturnScope } from "../antlr3/tree/TreeRuleReturnScope.js";

import { DefaultOutputModelFactory } from "../../tool/src/org/antlr/v4/codegen/DefaultOutputModelFactory.js";
import { CodeBlockForAlt } from "../../tool/src/org/antlr/v4/codegen/model/CodeBlockForAlt.js";
import { PlusBlock } from "../../tool/src/org/antlr/v4/codegen/model/PlusBlock.js";
import type { SrcOp } from "../../tool/src/org/antlr/v4/codegen/model/SrcOp.js";
import { StarBlock } from "../../tool/src/org/antlr/v4/codegen/model/StarBlock.js";
import type { OutputModelController } from "../../tool/src/org/antlr/v4/codegen/OutputModelController.js";
import type { ActionAST } from "../../tool/src/org/antlr/v4/tool/ast/ActionAST.js";
import type { AltAST } from "../../tool/src/org/antlr/v4/tool/ast/AltAST.js";
import type { BlockAST } from "../../tool/src/org/antlr/v4/tool/ast/BlockAST.js";
import type { GrammarAST } from "../../tool/src/org/antlr/v4/tool/ast/GrammarAST.js";


// cspell: disable




export class SourceGenTriggers extends TreeParser {
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
    // $ANTLR end "block"


    public static alternative_return = class alternative_return extends TreeRuleReturnScope {
        public altCodeBlock: CodeBlockForAlt;
        public ops: Array<SrcOp>;
    };

    // $ANTLR end "alternative"


    public static alt_return = class alt_return extends TreeRuleReturnScope {
        public altCodeBlock: CodeBlockForAlt;
        public ops: Array<SrcOp>;
    };



    public controller: OutputModelController;
    public hasLookaheadBlock: boolean;

    public DFA7 = (($outer) => {
        return class DFA7 extends DFA {

            public constructor(recognizer: BaseRecognizer) {
                this.recognizer = recognizer;
                this.decisionNumber = 7;
                this.eot = SourceGenTriggers.DFA7_eot;
                this.eof = SourceGenTriggers.DFA7_eof;
                this.min = SourceGenTriggers.DFA7_min;
                this.max = SourceGenTriggers.DFA7_max;
                this.accept = SourceGenTriggers.DFA7_accept;
                this.special = SourceGenTriggers.DFA7_special;
                this.transition = SourceGenTriggers.DFA7_transition;
            }

            public getDescription(): string {
                return "89:1: alt[boolean outerMost] returns [CodeBlockForAlt altCodeBlock, List<SrcOp> ops] : ( ^( ALT ( elementOptions )? ( element )+ ) | ^( ALT ( elementOptions )? EPSILON ) );";
            }
        };
    })(this);

    // $ANTLR end "elementOption"

    // Delegated rules


    protected dfa7 = new DFA7(this);

    // delegators


    public constructor(input: TreeNodeStream);
    public constructor(input: TreeNodeStream, state: RecognizerSharedState);
    public constructor(input: TreeNodeStream, controller: OutputModelController);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [input] = args as [TreeNodeStream];


                this(input, new RecognizerSharedState());


                break;
            }

            case 2: {
                const [input, state] = args as [TreeNodeStream, RecognizerSharedState];


                super(input, state);


                break;
            }

            case 2: {
                const [input, controller] = args as [TreeNodeStream, OutputModelController];


                this(input);
                this.controller = controller;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    // delegates
    public getDelegates(): TreeParser[] {
        return [];
    }


    public getTokenNames(): string[] { return SourceGenTriggers.tokenNames; }

    public getGrammarFileName(): string { return "./SourceGenTriggers.g"; }



    // $ANTLR start "dummy"
    // ./SourceGenTriggers.g:59:1: dummy : block[null, null] ;
    public readonly dummy(): void {
        try {
            // ./SourceGenTriggers.g:59:7: ( block[null, null] )
            // ./SourceGenTriggers.g:59:9: block[null, null]
            {
                pushFollow(SourceGenTriggers.FOLLOW_block_in_dummy61);
                this.block(null, null);
                java.security.Signature.state._fsp--;

            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "dummy"



    // $ANTLR start "block"
    // ./SourceGenTriggers.g:61:1: block[GrammarAST label, GrammarAST ebnfRoot] returns [List<? extends SrcOp> omos] : ^(blk= BLOCK ( ^( OPTIONS ( . )+ ) )? ( alternative )+ ) ;
    public readonly block(label: GrammarAST, ebnfRoot: GrammarAST): Array<SrcOp> {
        let omos = null;


        let blk = null;
        let alternative1 = null;

        try {
            // ./SourceGenTriggers.g:62:5: ( ^(blk= BLOCK ( ^( OPTIONS ( . )+ ) )? ( alternative )+ ) )
            // ./SourceGenTriggers.g:62:7: ^(blk= BLOCK ( ^( OPTIONS ( . )+ ) )? ( alternative )+ )
            {
                blk = this.match(input, SourceGenTriggers.BLOCK, SourceGenTriggers.FOLLOW_BLOCK_in_block84) as GrammarAST;
                this.match(input, Token.DOWN, null);
                // ./SourceGenTriggers.g:62:20: ( ^( OPTIONS ( . )+ ) )?
                let alt2 = 2;
                let LA2_0 = input.LA(1);
                if ((LA2_0 === SourceGenTriggers.OPTIONS)) {
                    alt2 = 1;
                }
                switch (alt2) {
                    case 1: {
                        // ./SourceGenTriggers.g:62:21: ^( OPTIONS ( . )+ )
                        {
                            this.match(input, SourceGenTriggers.OPTIONS, SourceGenTriggers.FOLLOW_OPTIONS_in_block88);
                            this.match(input, Token.DOWN, null);
                            // ./SourceGenTriggers.g:62:31: ( . )+
                            let cnt1 = 0;
                            loop1:
                            while (true) {
                                let alt1 = 2;
                                let LA1_0 = input.LA(1);
                                if (((LA1_0 >= SourceGenTriggers.ACTION && LA1_0 <= SourceGenTriggers.WILDCARD))) {
                                    alt1 = 1;
                                }
                                else {
                                    if ((LA1_0 === UP)) {
                                        alt1 = 2;
                                    }
                                }


                                switch (alt1) {
                                    case 1: {
                                        // ./SourceGenTriggers.g:62:31: .
                                        {
                                            matchAny(input);
                                        }
                                        break;
                                    }


                                    default: {
                                        if (cnt1 >= 1) {
                                            break loop1;
                                        }

                                        let eee = new EarlyExitException(1, input);
                                        throw eee;
                                    }

                                }
                                cnt1++;
                            }

                            this.match(input, Token.UP, null);

                        }
                        break;
                    }


                    default:


                }

                let alts = new Array<CodeBlockForAlt>();
                // ./SourceGenTriggers.g:64:7: ( alternative )+
                let cnt3 = 0;
                loop3:
                while (true) {
                    let alt3 = 2;
                    let LA3_0 = input.LA(1);
                    if ((LA3_0 === SourceGenTriggers.ALT)) {
                        alt3 = 1;
                    }

                    switch (alt3) {
                        case 1: {
                            // ./SourceGenTriggers.g:64:9: alternative
                            {
                                pushFollow(SourceGenTriggers.FOLLOW_alternative_in_block109);
                                alternative1 = this.alternative();
                                java.security.Signature.state._fsp--;

                                alts.add((alternative1 !== null ? (alternative1 as SourceGenTriggers.alternative_return).altCodeBlock : null));
                            }
                            break;
                        }


                        default: {
                            if (cnt3 >= 1) {
                                break loop3;
                            }

                            let eee = new EarlyExitException(3, input);
                            throw eee;
                        }

                    }
                    cnt3++;
                }

                this.match(input, Token.UP, null);


                if (alts.size() === 1 && ebnfRoot === null) {
                    return alts;
                }

                if (ebnfRoot === null) {
                    omos = DefaultOutputModelFactory.list(this.controller.getChoiceBlock(blk as BlockAST, alts, label));
                }
                else {
                    let choice = this.controller.getEBNFBlock(ebnfRoot, alts);
                    this.hasLookaheadBlock |= choice instanceof PlusBlock || choice instanceof StarBlock;
                    omos = DefaultOutputModelFactory.list(choice);
                }

            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return omos;
    }


    // $ANTLR start "alternative"
    // ./SourceGenTriggers.g:79:1: alternative returns [CodeBlockForAlt altCodeBlock, List<SrcOp> ops] : a= alt[outerMost] ;
    public readonly alternative(): SourceGenTriggers.alternative_return {
        let retval = new SourceGenTriggers.alternative_return();
        retval.start = input.LT(1);

        let a = null;


        let outerMost = inContext("RULE BLOCK");

        try {
            // ./SourceGenTriggers.g:86:5: (a= alt[outerMost] )
            // ./SourceGenTriggers.g:86:7: a= alt[outerMost]
            {
                pushFollow(SourceGenTriggers.FOLLOW_alt_in_alternative161);
                a = this.alt(outerMost);
                java.security.Signature.state._fsp--;

                retval.altCodeBlock = (a !== null ? (a as SourceGenTriggers.alt_return).altCodeBlock : null); retval.ops = (a !== null ? (a as SourceGenTriggers.alt_return).ops : null);
            }


            this.controller.finishAlternative(retval.altCodeBlock, retval.ops, outerMost);

        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return retval;
    }


    // $ANTLR start "alt"
    // ./SourceGenTriggers.g:89:1: alt[boolean outerMost] returns [CodeBlockForAlt altCodeBlock, List<SrcOp> ops] : ( ^( ALT ( elementOptions )? ( element )+ ) | ^( ALT ( elementOptions )? EPSILON ) );
    public readonly alt(outerMost: boolean): SourceGenTriggers.alt_return {
        let retval = new SourceGenTriggers.alt_return();
        retval.start = input.LT(1);

        let element2 = null;


        // set alt if outer ALT only (the only ones with alt field set to Alternative object)
        let altAST = retval.start as AltAST;
        if (outerMost) {
            this.controller.setCurrentOuterMostAlt(altAST.alt);
        }


        try {
            // ./SourceGenTriggers.g:95:2: ( ^( ALT ( elementOptions )? ( element )+ ) | ^( ALT ( elementOptions )? EPSILON ) )
            let alt7 = 2;
            alt7 = this.dfa7.predict(input);
            switch (alt7) {
                case 1: {
                    // ./SourceGenTriggers.g:95:4: ^( ALT ( elementOptions )? ( element )+ )
                    {

                        let elems = new Array<SrcOp>();
                        // TODO: shouldn't we pass ((GrammarAST)retval.start) to controller.alternative()?
                        retval.altCodeBlock = this.controller.alternative(this.controller.getCurrentOuterMostAlt(), outerMost);
                        retval.altCodeBlock.ops = retval.ops = elems;
                        this.controller.setCurrentBlock(retval.altCodeBlock);

                        this.match(input, SourceGenTriggers.ALT, SourceGenTriggers.FOLLOW_ALT_in_alt191);
                        this.match(input, Token.DOWN, null);
                        // ./SourceGenTriggers.g:102:10: ( elementOptions )?
                        let alt4 = 2;
                        let LA4_0 = input.LA(1);
                        if ((LA4_0 === SourceGenTriggers.ELEMENT_OPTIONS)) {
                            alt4 = 1;
                        }
                        switch (alt4) {
                            case 1: {
                                // ./SourceGenTriggers.g:102:10: elementOptions
                                {
                                    pushFollow(SourceGenTriggers.FOLLOW_elementOptions_in_alt193);
                                    this.elementOptions();
                                    java.security.Signature.state._fsp--;

                                }
                                break;
                            }


                            default:


                        }

                        // ./SourceGenTriggers.g:102:26: ( element )+
                        let cnt5 = 0;
                        loop5:
                        while (true) {
                            let alt5 = 2;
                            let LA5_0 = input.LA(1);
                            if ((LA5_0 === SourceGenTriggers.ACTION || LA5_0 === SourceGenTriggers.ASSIGN || LA5_0 === SourceGenTriggers.DOT || LA5_0 === SourceGenTriggers.NOT || LA5_0 === SourceGenTriggers.PLUS_ASSIGN || LA5_0 === SourceGenTriggers.RANGE || LA5_0 === SourceGenTriggers.RULE_REF || LA5_0 === SourceGenTriggers.SEMPRED || LA5_0 === SourceGenTriggers.STRING_LITERAL || LA5_0 === SourceGenTriggers.TOKEN_REF || (LA5_0 >= SourceGenTriggers.BLOCK && LA5_0 <= SourceGenTriggers.CLOSURE) || (LA5_0 >= SourceGenTriggers.OPTIONAL && LA5_0 <= SourceGenTriggers.POSITIVE_CLOSURE) || (LA5_0 >= SourceGenTriggers.SET && LA5_0 <= SourceGenTriggers.WILDCARD))) {
                                alt5 = 1;
                            }

                            switch (alt5) {
                                case 1: {
                                    // ./SourceGenTriggers.g:102:28: element
                                    {
                                        pushFollow(SourceGenTriggers.FOLLOW_element_in_alt198);
                                        element2 = this.element();
                                        java.security.Signature.state._fsp--;

                                        if (element2 !== null) {
                                            elems.addAll(element2);
                                        }

                                    }
                                    break;
                                }


                                default: {
                                    if (cnt5 >= 1) {
                                        break loop5;
                                    }

                                    let eee = new EarlyExitException(5, input);
                                    throw eee;
                                }

                            }
                            cnt5++;
                        }

                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 2: {
                    // ./SourceGenTriggers.g:104:4: ^( ALT ( elementOptions )? EPSILON )
                    {
                        this.match(input, SourceGenTriggers.ALT, SourceGenTriggers.FOLLOW_ALT_in_alt212);
                        this.match(input, Token.DOWN, null);
                        // ./SourceGenTriggers.g:104:10: ( elementOptions )?
                        let alt6 = 2;
                        let LA6_0 = input.LA(1);
                        if ((LA6_0 === SourceGenTriggers.ELEMENT_OPTIONS)) {
                            alt6 = 1;
                        }
                        switch (alt6) {
                            case 1: {
                                // ./SourceGenTriggers.g:104:10: elementOptions
                                {
                                    pushFollow(SourceGenTriggers.FOLLOW_elementOptions_in_alt214);
                                    this.elementOptions();
                                    java.security.Signature.state._fsp--;

                                }
                                break;
                            }


                            default:


                        }

                        this.match(input, SourceGenTriggers.EPSILON, SourceGenTriggers.FOLLOW_EPSILON_in_alt217);
                        this.match(input, Token.UP, null);

                        retval.altCodeBlock = this.controller.epsilon(this.controller.getCurrentOuterMostAlt(), outerMost);
                    }
                    break;
                }


                default:


            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return retval;
    }
    // $ANTLR end "alt"



    // $ANTLR start "element"
    // ./SourceGenTriggers.g:108:1: element returns [List<? extends SrcOp> omos] : ( labeledElement | atom[null,false] | subrule | ACTION | SEMPRED | ^( ACTION elementOptions ) | ^( SEMPRED elementOptions ) );
    public readonly element(): Array<SrcOp> {
        let omos = null;


        let ACTION6 = null;
        let SEMPRED7 = null;
        let ACTION8 = null;
        let SEMPRED9 = null;
        let labeledElement3 = null;
        let atom4 = null;
        let subrule5 = null;

        try {
            // ./SourceGenTriggers.g:109:2: ( labeledElement | atom[null,false] | subrule | ACTION | SEMPRED | ^( ACTION elementOptions ) | ^( SEMPRED elementOptions ) )
            let alt8 = 7;
            switch (input.LA(1)) {
                case SourceGenTriggers.ASSIGN:
                case SourceGenTriggers.PLUS_ASSIGN: {
                    {
                        alt8 = 1;
                    }
                    break;
                }

                case SourceGenTriggers.DOT:
                case SourceGenTriggers.NOT:
                case SourceGenTriggers.RANGE:
                case SourceGenTriggers.RULE_REF:
                case SourceGenTriggers.STRING_LITERAL:
                case SourceGenTriggers.TOKEN_REF:
                case SourceGenTriggers.SET:
                case SourceGenTriggers.WILDCARD: {
                    {
                        alt8 = 2;
                    }
                    break;
                }

                case SourceGenTriggers.BLOCK:
                case SourceGenTriggers.CLOSURE:
                case SourceGenTriggers.OPTIONAL:
                case SourceGenTriggers.POSITIVE_CLOSURE: {
                    {
                        alt8 = 3;
                    }
                    break;
                }

                case SourceGenTriggers.ACTION: {
                    {
                        let LA8_4 = input.LA(2);
                        if ((LA8_4 === SourceGenTriggers.DOWN)) {
                            alt8 = 6;
                        }
                        else {
                            if (((LA8_4 >= UP && LA8_4 <= SourceGenTriggers.ACTION) || LA8_4 === SourceGenTriggers.ASSIGN || LA8_4 === SourceGenTriggers.DOT || LA8_4 === SourceGenTriggers.NOT || LA8_4 === SourceGenTriggers.PLUS_ASSIGN || LA8_4 === SourceGenTriggers.RANGE || LA8_4 === SourceGenTriggers.RULE_REF || LA8_4 === SourceGenTriggers.SEMPRED || LA8_4 === SourceGenTriggers.STRING_LITERAL || LA8_4 === SourceGenTriggers.TOKEN_REF || (LA8_4 >= SourceGenTriggers.BLOCK && LA8_4 <= SourceGenTriggers.CLOSURE) || (LA8_4 >= SourceGenTriggers.OPTIONAL && LA8_4 <= SourceGenTriggers.POSITIVE_CLOSURE) || (LA8_4 >= SourceGenTriggers.SET && LA8_4 <= SourceGenTriggers.WILDCARD))) {
                                alt8 = 4;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 8, 4, input);
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
                        let LA8_5 = input.LA(2);
                        if ((LA8_5 === DOWN)) {
                            alt8 = 7;
                        }
                        else {
                            if (((LA8_5 >= UP && LA8_5 <= SourceGenTriggers.ACTION) || LA8_5 === SourceGenTriggers.ASSIGN || LA8_5 === SourceGenTriggers.DOT || LA8_5 === SourceGenTriggers.NOT || LA8_5 === SourceGenTriggers.PLUS_ASSIGN || LA8_5 === SourceGenTriggers.RANGE || LA8_5 === SourceGenTriggers.RULE_REF || LA8_5 === SourceGenTriggers.SEMPRED || LA8_5 === SourceGenTriggers.STRING_LITERAL || LA8_5 === SourceGenTriggers.TOKEN_REF || (LA8_5 >= SourceGenTriggers.BLOCK && LA8_5 <= SourceGenTriggers.CLOSURE) || (LA8_5 >= SourceGenTriggers.OPTIONAL && LA8_5 <= SourceGenTriggers.POSITIVE_CLOSURE) || (LA8_5 >= SourceGenTriggers.SET && LA8_5 <= SourceGenTriggers.WILDCARD))) {
                                alt8 = 5;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 8, 5, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }


                    }
                    break;
                }

                default: {
                    let nvae =
                        new NoViableAltException("", 8, 0, input);
                    throw nvae;
                }

            }
            switch (alt8) {
                case 1: {
                    // ./SourceGenTriggers.g:109:4: labeledElement
                    {
                        pushFollow(SourceGenTriggers.FOLLOW_labeledElement_in_element246);
                        labeledElement3 = this.labeledElement();
                        java.security.Signature.state._fsp--;

                        omos = labeledElement3;
                    }
                    break;
                }

                case 2: {
                    // ./SourceGenTriggers.g:110:4: atom[null,false]
                    {
                        pushFollow(SourceGenTriggers.FOLLOW_atom_in_element257);
                        atom4 = this.atom(null, false);
                        java.security.Signature.state._fsp--;

                        omos = atom4;
                    }
                    break;
                }

                case 3: {
                    // ./SourceGenTriggers.g:111:4: subrule
                    {
                        pushFollow(SourceGenTriggers.FOLLOW_subrule_in_element267);
                        subrule5 = this.subrule();
                        java.security.Signature.state._fsp--;

                        omos = subrule5;
                    }
                    break;
                }

                case 4: {
                    // ./SourceGenTriggers.g:112:6: ACTION
                    {
                        ACTION6 = this.match(input, SourceGenTriggers.ACTION, SourceGenTriggers.FOLLOW_ACTION_in_element282) as GrammarAST;
                        omos = this.controller.action(ACTION6 as ActionAST);
                    }
                    break;
                }

                case 5: {
                    // ./SourceGenTriggers.g:113:6: SEMPRED
                    {
                        SEMPRED7 = this.match(input, SourceGenTriggers.SEMPRED, SourceGenTriggers.FOLLOW_SEMPRED_in_element297) as GrammarAST;
                        omos = this.controller.sempred(SEMPRED7 as ActionAST);
                    }
                    break;
                }

                case 6: {
                    // ./SourceGenTriggers.g:114:4: ^( ACTION elementOptions )
                    {
                        ACTION8 = this.match(input, SourceGenTriggers.ACTION, SourceGenTriggers.FOLLOW_ACTION_in_element311) as GrammarAST;
                        this.match(input, Token.DOWN, null);
                        pushFollow(SourceGenTriggers.FOLLOW_elementOptions_in_element313);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        this.match(input, Token.UP, null);

                        omos = this.controller.action(ACTION8 as ActionAST);
                    }
                    break;
                }

                case 7: {
                    // ./SourceGenTriggers.g:115:6: ^( SEMPRED elementOptions )
                    {
                        SEMPRED9 = this.match(input, SourceGenTriggers.SEMPRED, SourceGenTriggers.FOLLOW_SEMPRED_in_element325) as GrammarAST;
                        this.match(input, Token.DOWN, null);
                        pushFollow(SourceGenTriggers.FOLLOW_elementOptions_in_element327);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        this.match(input, Token.UP, null);

                        omos = this.controller.sempred(SEMPRED9 as ActionAST);
                    }
                    break;
                }


                default:


            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return omos;
    }
    // $ANTLR end "element"



    // $ANTLR start "labeledElement"
    // ./SourceGenTriggers.g:118:1: labeledElement returns [List<? extends SrcOp> omos] : ( ^( ASSIGN ID atom[$ID,false] ) | ^( PLUS_ASSIGN ID atom[$ID,false] ) | ^( ASSIGN ID block[$ID,null] ) | ^( PLUS_ASSIGN ID block[$ID,null] ) );
    public readonly labeledElement(): Array<SrcOp> {
        let omos = null;


        let ID10 = null;
        let ID12 = null;
        let ID14 = null;
        let ID16 = null;
        let atom11 = null;
        let atom13 = null;
        let block15 = null;
        let block17 = null;

        try {
            // ./SourceGenTriggers.g:119:2: ( ^( ASSIGN ID atom[$ID,false] ) | ^( PLUS_ASSIGN ID atom[$ID,false] ) | ^( ASSIGN ID block[$ID,null] ) | ^( PLUS_ASSIGN ID block[$ID,null] ) )
            let alt9 = 4;
            let LA9_0 = input.LA(1);
            if ((LA9_0 === SourceGenTriggers.ASSIGN)) {
                let LA9_1 = input.LA(2);
                if ((LA9_1 === DOWN)) {
                    let LA9_3 = input.LA(3);
                    if ((LA9_3 === SourceGenTriggers.ID)) {
                        let LA9_5 = input.LA(4);
                        if ((LA9_5 === SourceGenTriggers.DOT || LA9_5 === SourceGenTriggers.NOT || LA9_5 === SourceGenTriggers.RANGE || LA9_5 === SourceGenTriggers.RULE_REF || LA9_5 === SourceGenTriggers.STRING_LITERAL || LA9_5 === SourceGenTriggers.TOKEN_REF || (LA9_5 >= SourceGenTriggers.SET && LA9_5 <= SourceGenTriggers.WILDCARD))) {
                            alt9 = 1;
                        }
                        else {
                            if ((LA9_5 === SourceGenTriggers.BLOCK)) {
                                alt9 = 3;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                        input.consume();
                                    }
                                    let nvae =
                                        new NoViableAltException("", 9, 5, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }


                    }

                    else {
                        let nvaeMark = input.mark();
                        try {
                            for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                input.consume();
                            }
                            let nvae =
                                new NoViableAltException("", 9, 3, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }

                }

                else {
                    let nvaeMark = input.mark();
                    try {
                        input.consume();
                        let nvae =
                            new NoViableAltException("", 9, 1, input);
                        throw nvae;
                    } finally {
                        input.rewind(nvaeMark);
                    }
                }

            }
            else {
                if ((LA9_0 === SourceGenTriggers.PLUS_ASSIGN)) {
                    let LA9_2 = input.LA(2);
                    if ((LA9_2 === DOWN)) {
                        let LA9_4 = input.LA(3);
                        if ((LA9_4 === SourceGenTriggers.ID)) {
                            let LA9_6 = input.LA(4);
                            if ((LA9_6 === SourceGenTriggers.DOT || LA9_6 === SourceGenTriggers.NOT || LA9_6 === SourceGenTriggers.RANGE || LA9_6 === SourceGenTriggers.RULE_REF || LA9_6 === SourceGenTriggers.STRING_LITERAL || LA9_6 === SourceGenTriggers.TOKEN_REF || (LA9_6 >= SourceGenTriggers.SET && LA9_6 <= SourceGenTriggers.WILDCARD))) {
                                alt9 = 2;
                            }
                            else {
                                if ((LA9_6 === SourceGenTriggers.BLOCK)) {
                                    alt9 = 4;
                                }

                                else {
                                    let nvaeMark = input.mark();
                                    try {
                                        for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                            input.consume();
                                        }
                                        let nvae =
                                            new NoViableAltException("", 9, 6, input);
                                        throw nvae;
                                    } finally {
                                        input.rewind(nvaeMark);
                                    }
                                }
                            }


                        }

                        else {
                            let nvaeMark = input.mark();
                            try {
                                for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                    input.consume();
                                }
                                let nvae =
                                    new NoViableAltException("", 9, 4, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }

                    }

                    else {
                        let nvaeMark = input.mark();
                        try {
                            input.consume();
                            let nvae =
                                new NoViableAltException("", 9, 2, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }

                }

                else {
                    let nvae =
                        new NoViableAltException("", 9, 0, input);
                    throw nvae;
                }
            }


            switch (alt9) {
                case 1: {
                    // ./SourceGenTriggers.g:119:4: ^( ASSIGN ID atom[$ID,false] )
                    {
                        this.match(input, SourceGenTriggers.ASSIGN, SourceGenTriggers.FOLLOW_ASSIGN_in_labeledElement347);
                        this.match(input, Token.DOWN, null);
                        ID10 = this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_labeledElement349) as GrammarAST;
                        pushFollow(SourceGenTriggers.FOLLOW_atom_in_labeledElement351);
                        atom11 = this.atom(ID10, false);
                        java.security.Signature.state._fsp--;

                        this.match(input, Token.UP, null);

                        omos = atom11;
                    }
                    break;
                }

                case 2: {
                    // ./SourceGenTriggers.g:120:4: ^( PLUS_ASSIGN ID atom[$ID,false] )
                    {
                        this.match(input, SourceGenTriggers.PLUS_ASSIGN, SourceGenTriggers.FOLLOW_PLUS_ASSIGN_in_labeledElement364);
                        this.match(input, Token.DOWN, null);
                        ID12 = this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_labeledElement366) as GrammarAST;
                        pushFollow(SourceGenTriggers.FOLLOW_atom_in_labeledElement368);
                        atom13 = this.atom(ID12, false);
                        java.security.Signature.state._fsp--;

                        this.match(input, Token.UP, null);

                        omos = atom13;
                    }
                    break;
                }

                case 3: {
                    // ./SourceGenTriggers.g:121:4: ^( ASSIGN ID block[$ID,null] )
                    {
                        this.match(input, SourceGenTriggers.ASSIGN, SourceGenTriggers.FOLLOW_ASSIGN_in_labeledElement379);
                        this.match(input, Token.DOWN, null);
                        ID14 = this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_labeledElement381) as GrammarAST;
                        pushFollow(SourceGenTriggers.FOLLOW_block_in_labeledElement383);
                        block15 = this.block(ID14, null);
                        java.security.Signature.state._fsp--;

                        this.match(input, Token.UP, null);

                        omos = block15;
                    }
                    break;
                }

                case 4: {
                    // ./SourceGenTriggers.g:122:4: ^( PLUS_ASSIGN ID block[$ID,null] )
                    {
                        this.match(input, SourceGenTriggers.PLUS_ASSIGN, SourceGenTriggers.FOLLOW_PLUS_ASSIGN_in_labeledElement396);
                        this.match(input, Token.DOWN, null);
                        ID16 = this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_labeledElement398) as GrammarAST;
                        pushFollow(SourceGenTriggers.FOLLOW_block_in_labeledElement400);
                        block17 = this.block(ID16, null);
                        java.security.Signature.state._fsp--;

                        this.match(input, Token.UP, null);

                        omos = block17;
                    }
                    break;
                }


                default:


            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return omos;
    }
    // $ANTLR end "labeledElement"



    // $ANTLR start "subrule"
    // ./SourceGenTriggers.g:125:1: subrule returns [List<? extends SrcOp> omos] : ( ^( OPTIONAL b= block[null,$OPTIONAL] ) | ( ^(op= CLOSURE b= block[null,null] ) | ^(op= POSITIVE_CLOSURE b= block[null,null] ) ) | block[null, null] );
    public readonly subrule(): Array<SrcOp> {
        let omos = null;


        let op = null;
        let OPTIONAL18 = null;
        let b = null;
        let block19 = null;

        try {
            // ./SourceGenTriggers.g:126:2: ( ^( OPTIONAL b= block[null,$OPTIONAL] ) | ( ^(op= CLOSURE b= block[null,null] ) | ^(op= POSITIVE_CLOSURE b= block[null,null] ) ) | block[null, null] )
            let alt11 = 3;
            switch (input.LA(1)) {
                case OPTIONAL: {
                    {
                        alt11 = 1;
                    }
                    break;
                }

                case CLOSURE:
                case POSITIVE_CLOSURE: {
                    {
                        alt11 = 2;
                    }
                    break;
                }

                case BLOCK: {
                    {
                        alt11 = 3;
                    }
                    break;
                }

                default: {
                    let nvae =
                        new NoViableAltException("", 11, 0, input);
                    throw nvae;
                }

            }
            switch (alt11) {
                case 1: {
                    // ./SourceGenTriggers.g:126:4: ^( OPTIONAL b= block[null,$OPTIONAL] )
                    {
                        OPTIONAL18 = this.match(input, SourceGenTriggers.OPTIONAL, SourceGenTriggers.FOLLOW_OPTIONAL_in_subrule421) as GrammarAST;
                        this.match(input, Token.DOWN, null);
                        pushFollow(SourceGenTriggers.FOLLOW_block_in_subrule425);
                        b = this.block(null, OPTIONAL18);
                        java.security.Signature.state._fsp--;

                        this.match(input, Token.UP, null);


                        omos = b;

                    }
                    break;
                }

                case 2: {
                    // ./SourceGenTriggers.g:130:4: ( ^(op= CLOSURE b= block[null,null] ) | ^(op= POSITIVE_CLOSURE b= block[null,null] ) )
                    {
                        // ./SourceGenTriggers.g:130:4: ( ^(op= CLOSURE b= block[null,null] ) | ^(op= POSITIVE_CLOSURE b= block[null,null] ) )
                        let alt10 = 2;
                        let LA10_0 = input.LA(1);
                        if ((LA10_0 === SourceGenTriggers.CLOSURE)) {
                            alt10 = 1;
                        }
                        else {
                            if ((LA10_0 === SourceGenTriggers.POSITIVE_CLOSURE)) {
                                alt10 = 2;
                            }

                            else {
                                let nvae =
                                    new NoViableAltException("", 10, 0, input);
                                throw nvae;
                            }
                        }


                        switch (alt10) {
                            case 1: {
                                // ./SourceGenTriggers.g:130:6: ^(op= CLOSURE b= block[null,null] )
                                {
                                    op = this.match(input, SourceGenTriggers.CLOSURE, SourceGenTriggers.FOLLOW_CLOSURE_in_subrule441) as GrammarAST;
                                    this.match(input, Token.DOWN, null);
                                    pushFollow(SourceGenTriggers.FOLLOW_block_in_subrule445);
                                    b = this.block(null, null);
                                    java.security.Signature.state._fsp--;

                                    this.match(input, Token.UP, null);

                                }
                                break;
                            }

                            case 2: {
                                // ./SourceGenTriggers.g:131:5: ^(op= POSITIVE_CLOSURE b= block[null,null] )
                                {
                                    op = this.match(input, SourceGenTriggers.POSITIVE_CLOSURE, SourceGenTriggers.FOLLOW_POSITIVE_CLOSURE_in_subrule456) as GrammarAST;
                                    this.match(input, Token.DOWN, null);
                                    pushFollow(SourceGenTriggers.FOLLOW_block_in_subrule460);
                                    b = this.block(null, null);
                                    java.security.Signature.state._fsp--;

                                    this.match(input, Token.UP, null);

                                }
                                break;
                            }


                            default:


                        }


                        let alts = new Array<CodeBlockForAlt>();
                        let blk = b.get(0);
                        let alt = new CodeBlockForAlt(this.controller.delegate);
                        alt.addOp(blk);
                        alts.add(alt);
                        let loop = this.controller.getEBNFBlock(op, alts); // "star it"
                        this.hasLookaheadBlock |= loop instanceof PlusBlock || loop instanceof StarBlock;
                        omos = DefaultOutputModelFactory.list(loop);

                    }
                    break;
                }

                case 3: {
                    // ./SourceGenTriggers.g:143:5: block[null, null]
                    {
                        pushFollow(SourceGenTriggers.FOLLOW_block_in_subrule476);
                        block19 = this.block(null, null);
                        java.security.Signature.state._fsp--;

                        omos = block19;
                    }
                    break;
                }


                default:


            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return omos;
    }
    // $ANTLR end "subrule"



    // $ANTLR start "blockSet"
    // ./SourceGenTriggers.g:146:1: blockSet[GrammarAST label, boolean invert] returns [List<SrcOp> omos] : ^( SET ( atom[label,invert] )+ ) ;
    public readonly blockSet(label: GrammarAST, invert: boolean): Array<SrcOp> {
        let omos = null;


        let SET20 = null;

        try {
            // ./SourceGenTriggers.g:147:5: ( ^( SET ( atom[label,invert] )+ ) )
            // ./SourceGenTriggers.g:147:7: ^( SET ( atom[label,invert] )+ )
            {
                SET20 = this.match(input, SourceGenTriggers.SET, SourceGenTriggers.FOLLOW_SET_in_blockSet506) as GrammarAST;
                this.match(input, Token.DOWN, null);
                // ./SourceGenTriggers.g:147:13: ( atom[label,invert] )+
                let cnt12 = 0;
                loop12:
                while (true) {
                    let alt12 = 2;
                    let LA12_0 = input.LA(1);
                    if ((LA12_0 === SourceGenTriggers.DOT || LA12_0 === SourceGenTriggers.NOT || LA12_0 === SourceGenTriggers.RANGE || LA12_0 === SourceGenTriggers.RULE_REF || LA12_0 === SourceGenTriggers.STRING_LITERAL || LA12_0 === SourceGenTriggers.TOKEN_REF || (LA12_0 >= SourceGenTriggers.SET && LA12_0 <= SourceGenTriggers.WILDCARD))) {
                        alt12 = 1;
                    }

                    switch (alt12) {
                        case 1: {
                            // ./SourceGenTriggers.g:147:13: atom[label,invert]
                            {
                                pushFollow(SourceGenTriggers.FOLLOW_atom_in_blockSet508);
                                this.atom(label, invert);
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt12 >= 1) {
                                break loop12;
                            }

                            let eee = new EarlyExitException(12, input);
                            throw eee;
                        }

                    }
                    cnt12++;
                }

                this.match(input, Token.UP, null);

                omos = this.controller.set(SET20, label, invert);
            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return omos;
    }
    // $ANTLR end "blockSet"



    // $ANTLR start "atom"
    // ./SourceGenTriggers.g:160:1: atom[GrammarAST label, boolean invert] returns [List<SrcOp> omos] : ( ^( NOT a= atom[$label, true] ) | range[label] | ^( DOT ID terminal[$label] ) | ^( DOT ID ruleref[$label] ) | ^( WILDCARD . ) | WILDCARD | terminal[label] | ruleref[label] | blockSet[$label, invert] );
    public readonly atom(label: GrammarAST, invert: boolean): Array<SrcOp> {
        let omos = null;


        let WILDCARD22 = null;
        let WILDCARD23 = null;
        let a = null;
        let range21 = null;
        let terminal24 = null;
        let ruleref25 = null;
        let blockSet26 = null;

        try {
            // ./SourceGenTriggers.g:161:2: ( ^( NOT a= atom[$label, true] ) | range[label] | ^( DOT ID terminal[$label] ) | ^( DOT ID ruleref[$label] ) | ^( WILDCARD . ) | WILDCARD | terminal[label] | ruleref[label] | blockSet[$label, invert] )
            let alt13 = 9;
            switch (input.LA(1)) {
                case NOT: {
                    {
                        alt13 = 1;
                    }
                    break;
                }

                case RANGE: {
                    {
                        alt13 = 2;
                    }
                    break;
                }

                case DOT: {
                    {
                        let LA13_3 = input.LA(2);
                        if ((LA13_3 === DOWN)) {
                            let LA13_8 = input.LA(3);
                            if ((LA13_8 === SourceGenTriggers.ID)) {
                                let LA13_11 = input.LA(4);
                                if ((LA13_11 === SourceGenTriggers.STRING_LITERAL || LA13_11 === SourceGenTriggers.TOKEN_REF)) {
                                    alt13 = 3;
                                }
                                else {
                                    if ((LA13_11 === SourceGenTriggers.RULE_REF)) {
                                        alt13 = 4;
                                    }

                                    else {
                                        let nvaeMark = input.mark();
                                        try {
                                            for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                                input.consume();
                                            }
                                            let nvae =
                                                new NoViableAltException("", 13, 11, input);
                                            throw nvae;
                                        } finally {
                                            input.rewind(nvaeMark);
                                        }
                                    }
                                }


                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                        input.consume();
                                    }
                                    let nvae =
                                        new NoViableAltException("", 13, 8, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }

                        }

                        else {
                            let nvaeMark = input.mark();
                            try {
                                input.consume();
                                let nvae =
                                    new NoViableAltException("", 13, 3, input);
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
                        let LA13_4 = input.LA(2);
                        if ((LA13_4 === DOWN)) {
                            alt13 = 5;
                        }
                        else {
                            if (((LA13_4 >= UP && LA13_4 <= SourceGenTriggers.ACTION) || LA13_4 === SourceGenTriggers.ASSIGN || LA13_4 === SourceGenTriggers.DOT || LA13_4 === SourceGenTriggers.NOT || LA13_4 === SourceGenTriggers.PLUS_ASSIGN || LA13_4 === SourceGenTriggers.RANGE || LA13_4 === SourceGenTriggers.RULE_REF || LA13_4 === SourceGenTriggers.SEMPRED || LA13_4 === SourceGenTriggers.STRING_LITERAL || LA13_4 === SourceGenTriggers.TOKEN_REF || (LA13_4 >= SourceGenTriggers.BLOCK && LA13_4 <= SourceGenTriggers.CLOSURE) || (LA13_4 >= SourceGenTriggers.OPTIONAL && LA13_4 <= SourceGenTriggers.POSITIVE_CLOSURE) || (LA13_4 >= SourceGenTriggers.SET && LA13_4 <= SourceGenTriggers.WILDCARD))) {
                                alt13 = 6;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
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

                case STRING_LITERAL:
                case TOKEN_REF: {
                    {
                        alt13 = 7;
                    }
                    break;
                }

                case RULE_REF: {
                    {
                        alt13 = 8;
                    }
                    break;
                }

                case SET: {
                    {
                        alt13 = 9;
                    }
                    break;
                }

                default: {
                    let nvae =
                        new NoViableAltException("", 13, 0, input);
                    throw nvae;
                }

            }
            switch (alt13) {
                case 1: {
                    // ./SourceGenTriggers.g:161:4: ^( NOT a= atom[$label, true] )
                    {
                        this.match(input, SourceGenTriggers.NOT, SourceGenTriggers.FOLLOW_NOT_in_atom538);
                        this.match(input, Token.DOWN, null);
                        pushFollow(SourceGenTriggers.FOLLOW_atom_in_atom542);
                        a = this.atom(label, true);
                        java.security.Signature.state._fsp--;

                        this.match(input, Token.UP, null);

                        omos = a;
                    }
                    break;
                }

                case 2: {
                    // ./SourceGenTriggers.g:162:4: range[label]
                    {
                        pushFollow(SourceGenTriggers.FOLLOW_range_in_atom552);
                        range21 = this.range(label);
                        java.security.Signature.state._fsp--;

                        omos = range21;
                    }
                    break;
                }

                case 3: {
                    // ./SourceGenTriggers.g:163:4: ^( DOT ID terminal[$label] )
                    {
                        this.match(input, SourceGenTriggers.DOT, SourceGenTriggers.FOLLOW_DOT_in_atom567);
                        this.match(input, Token.DOWN, null);
                        this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_atom569);
                        pushFollow(SourceGenTriggers.FOLLOW_terminal_in_atom571);
                        this.terminal(label);
                        java.security.Signature.state._fsp--;

                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 4: {
                    // ./SourceGenTriggers.g:164:4: ^( DOT ID ruleref[$label] )
                    {
                        this.match(input, SourceGenTriggers.DOT, SourceGenTriggers.FOLLOW_DOT_in_atom579);
                        this.match(input, Token.DOWN, null);
                        this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_atom581);
                        pushFollow(SourceGenTriggers.FOLLOW_ruleref_in_atom583);
                        this.ruleref(label);
                        java.security.Signature.state._fsp--;

                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 5: {
                    // ./SourceGenTriggers.g:165:7: ^( WILDCARD . )
                    {
                        WILDCARD22 = this.match(input, SourceGenTriggers.WILDCARD, SourceGenTriggers.FOLLOW_WILDCARD_in_atom594) as GrammarAST;
                        this.match(input, Token.DOWN, null);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                        omos = this.controller.wildcard(WILDCARD22, label);
                    }
                    break;
                }

                case 6: {
                    // ./SourceGenTriggers.g:166:7: WILDCARD
                    {
                        WILDCARD23 = this.match(input, SourceGenTriggers.WILDCARD, SourceGenTriggers.FOLLOW_WILDCARD_in_atom613) as GrammarAST;
                        omos = this.controller.wildcard(WILDCARD23, label);
                    }
                    break;
                }

                case 7: {
                    // ./SourceGenTriggers.g:167:9: terminal[label]
                    {
                        pushFollow(SourceGenTriggers.FOLLOW_terminal_in_atom632);
                        terminal24 = this.terminal(label);
                        java.security.Signature.state._fsp--;

                        omos = terminal24;
                    }
                    break;
                }

                case 8: {
                    // ./SourceGenTriggers.g:168:9: ruleref[label]
                    {
                        pushFollow(SourceGenTriggers.FOLLOW_ruleref_in_atom649);
                        ruleref25 = this.ruleref(label);
                        java.security.Signature.state._fsp--;

                        omos = ruleref25;
                    }
                    break;
                }

                case 9: {
                    // ./SourceGenTriggers.g:169:4: blockSet[$label, invert]
                    {
                        pushFollow(SourceGenTriggers.FOLLOW_blockSet_in_atom661);
                        blockSet26 = this.blockSet(label, invert);
                        java.security.Signature.state._fsp--;

                        omos = blockSet26;
                    }
                    break;
                }


                default:


            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return omos;
    }
    // $ANTLR end "atom"



    // $ANTLR start "ruleref"
    // ./SourceGenTriggers.g:172:1: ruleref[GrammarAST label] returns [List<SrcOp> omos] : ^( RULE_REF ( ARG_ACTION )? ( elementOptions )? ) ;
    public readonly ruleref(label: GrammarAST): Array<SrcOp> {
        let omos = null;


        let RULE_REF27 = null;
        let ARG_ACTION28 = null;

        try {
            // ./SourceGenTriggers.g:173:5: ( ^( RULE_REF ( ARG_ACTION )? ( elementOptions )? ) )
            // ./SourceGenTriggers.g:173:7: ^( RULE_REF ( ARG_ACTION )? ( elementOptions )? )
            {
                RULE_REF27 = this.match(input, SourceGenTriggers.RULE_REF, SourceGenTriggers.FOLLOW_RULE_REF_in_ruleref685) as GrammarAST;
                if (input.LA(1) === Token.DOWN) {
                    this.match(input, Token.DOWN, null);
                    // ./SourceGenTriggers.g:173:18: ( ARG_ACTION )?
                    let alt14 = 2;
                    let LA14_0 = input.LA(1);
                    if ((LA14_0 === SourceGenTriggers.ARG_ACTION)) {
                        alt14 = 1;
                    }
                    switch (alt14) {
                        case 1: {
                            // ./SourceGenTriggers.g:173:18: ARG_ACTION
                            {
                                ARG_ACTION28 = this.match(input, SourceGenTriggers.ARG_ACTION, SourceGenTriggers.FOLLOW_ARG_ACTION_in_ruleref687) as GrammarAST;
                            }
                            break;
                        }


                        default:


                    }

                    // ./SourceGenTriggers.g:173:30: ( elementOptions )?
                    let alt15 = 2;
                    let LA15_0 = input.LA(1);
                    if ((LA15_0 === SourceGenTriggers.ELEMENT_OPTIONS)) {
                        alt15 = 1;
                    }
                    switch (alt15) {
                        case 1: {
                            // ./SourceGenTriggers.g:173:30: elementOptions
                            {
                                pushFollow(SourceGenTriggers.FOLLOW_elementOptions_in_ruleref690);
                                this.elementOptions();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default:


                    }

                    this.match(input, Token.UP, null);
                }

                omos = this.controller.ruleRef(RULE_REF27, label, ARG_ACTION28);
            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return omos;
    }
    // $ANTLR end "ruleref"



    // $ANTLR start "range"
    // ./SourceGenTriggers.g:176:1: range[GrammarAST label] returns [List<SrcOp> omos] : ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) ;
    public readonly range(label: GrammarAST): Array<SrcOp> {
        let omos = null;


        let a = null;
        let b = null;

        try {
            // ./SourceGenTriggers.g:177:5: ( ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) )
            // ./SourceGenTriggers.g:177:7: ^( RANGE a= STRING_LITERAL b= STRING_LITERAL )
            {
                this.match(input, SourceGenTriggers.RANGE, SourceGenTriggers.FOLLOW_RANGE_in_range718);
                this.match(input, Token.DOWN, null);
                a = this.match(input, SourceGenTriggers.STRING_LITERAL, SourceGenTriggers.FOLLOW_STRING_LITERAL_in_range722) as GrammarAST;
                b = this.match(input, SourceGenTriggers.STRING_LITERAL, SourceGenTriggers.FOLLOW_STRING_LITERAL_in_range726) as GrammarAST;
                this.match(input, Token.UP, null);

            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return omos;
    }
    // $ANTLR end "range"



    // $ANTLR start "terminal"
    // ./SourceGenTriggers.g:180:1: terminal[GrammarAST label] returns [List<SrcOp> omos] : ( ^( STRING_LITERAL . ) | STRING_LITERAL | ^( TOKEN_REF ARG_ACTION . ) | ^( TOKEN_REF . ) | TOKEN_REF );
    public readonly terminal(label: GrammarAST): Array<SrcOp> {
        let omos = null;


        let STRING_LITERAL29 = null;
        let STRING_LITERAL30 = null;
        let TOKEN_REF31 = null;
        let ARG_ACTION32 = null;
        let TOKEN_REF33 = null;
        let TOKEN_REF34 = null;

        try {
            // ./SourceGenTriggers.g:181:5: ( ^( STRING_LITERAL . ) | STRING_LITERAL | ^( TOKEN_REF ARG_ACTION . ) | ^( TOKEN_REF . ) | TOKEN_REF )
            let alt16 = 5;
            let LA16_0 = input.LA(1);
            if ((LA16_0 === SourceGenTriggers.STRING_LITERAL)) {
                let LA16_1 = input.LA(2);
                if ((LA16_1 === DOWN)) {
                    alt16 = 1;
                }
                else {
                    if (((LA16_1 >= UP && LA16_1 <= SourceGenTriggers.ACTION) || LA16_1 === SourceGenTriggers.ASSIGN || LA16_1 === SourceGenTriggers.DOT || LA16_1 === SourceGenTriggers.NOT || LA16_1 === SourceGenTriggers.PLUS_ASSIGN || LA16_1 === SourceGenTriggers.RANGE || LA16_1 === SourceGenTriggers.RULE_REF || LA16_1 === SourceGenTriggers.SEMPRED || LA16_1 === SourceGenTriggers.STRING_LITERAL || LA16_1 === SourceGenTriggers.TOKEN_REF || (LA16_1 >= SourceGenTriggers.BLOCK && LA16_1 <= SourceGenTriggers.CLOSURE) || (LA16_1 >= SourceGenTriggers.OPTIONAL && LA16_1 <= SourceGenTriggers.POSITIVE_CLOSURE) || (LA16_1 >= SourceGenTriggers.SET && LA16_1 <= SourceGenTriggers.WILDCARD))) {
                        alt16 = 2;
                    }

                    else {
                        let nvaeMark = input.mark();
                        try {
                            input.consume();
                            let nvae =
                                new NoViableAltException("", 16, 1, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }
                }


            }
            else {
                if ((LA16_0 === SourceGenTriggers.TOKEN_REF)) {
                    let LA16_2 = input.LA(2);
                    if ((LA16_2 === DOWN)) {
                        let LA16_5 = input.LA(3);
                        if ((LA16_5 === SourceGenTriggers.ARG_ACTION)) {
                            let LA16_7 = input.LA(4);
                            if (((LA16_7 >= SourceGenTriggers.ACTION && LA16_7 <= SourceGenTriggers.WILDCARD))) {
                                alt16 = 3;
                            }
                            else {
                                if (((LA16_7 >= DOWN && LA16_7 <= UP))) {
                                    alt16 = 4;
                                }

                                else {
                                    let nvaeMark = input.mark();
                                    try {
                                        for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                            input.consume();
                                        }
                                        let nvae =
                                            new NoViableAltException("", 16, 7, input);
                                        throw nvae;
                                    } finally {
                                        input.rewind(nvaeMark);
                                    }
                                }
                            }


                        }
                        else {
                            if (((LA16_5 >= SourceGenTriggers.ACTION && LA16_5 <= SourceGenTriggers.ACTION_STRING_LITERAL) || (LA16_5 >= SourceGenTriggers.ARG_OR_CHARSET && LA16_5 <= SourceGenTriggers.WILDCARD))) {
                                alt16 = 4;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                        input.consume();
                                    }
                                    let nvae =
                                        new NoViableAltException("", 16, 5, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }


                    }
                    else {
                        if (((LA16_2 >= UP && LA16_2 <= SourceGenTriggers.ACTION) || LA16_2 === SourceGenTriggers.ASSIGN || LA16_2 === SourceGenTriggers.DOT || LA16_2 === SourceGenTriggers.NOT || LA16_2 === SourceGenTriggers.PLUS_ASSIGN || LA16_2 === SourceGenTriggers.RANGE || LA16_2 === SourceGenTriggers.RULE_REF || LA16_2 === SourceGenTriggers.SEMPRED || LA16_2 === SourceGenTriggers.STRING_LITERAL || LA16_2 === SourceGenTriggers.TOKEN_REF || (LA16_2 >= SourceGenTriggers.BLOCK && LA16_2 <= SourceGenTriggers.CLOSURE) || (LA16_2 >= SourceGenTriggers.OPTIONAL && LA16_2 <= SourceGenTriggers.POSITIVE_CLOSURE) || (LA16_2 >= SourceGenTriggers.SET && LA16_2 <= SourceGenTriggers.WILDCARD))) {
                            alt16 = 5;
                        }

                        else {
                            let nvaeMark = input.mark();
                            try {
                                input.consume();
                                let nvae =
                                    new NoViableAltException("", 16, 2, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }
                    }


                }

                else {
                    let nvae =
                        new NoViableAltException("", 16, 0, input);
                    throw nvae;
                }
            }


            switch (alt16) {
                case 1: {
                    // ./SourceGenTriggers.g:181:8: ^( STRING_LITERAL . )
                    {
                        STRING_LITERAL29 = this.match(input, SourceGenTriggers.STRING_LITERAL, SourceGenTriggers.FOLLOW_STRING_LITERAL_in_terminal751) as GrammarAST;
                        this.match(input, Token.DOWN, null);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                        omos = this.controller.stringRef(STRING_LITERAL29, label);
                    }
                    break;
                }

                case 2: {
                    // ./SourceGenTriggers.g:182:7: STRING_LITERAL
                    {
                        STRING_LITERAL30 = this.match(input, SourceGenTriggers.STRING_LITERAL, SourceGenTriggers.FOLLOW_STRING_LITERAL_in_terminal766) as GrammarAST;
                        omos = this.controller.stringRef(STRING_LITERAL30, label);
                    }
                    break;
                }

                case 3: {
                    // ./SourceGenTriggers.g:183:7: ^( TOKEN_REF ARG_ACTION . )
                    {
                        TOKEN_REF31 = this.match(input, SourceGenTriggers.TOKEN_REF, SourceGenTriggers.FOLLOW_TOKEN_REF_in_terminal780) as GrammarAST;
                        this.match(input, Token.DOWN, null);
                        ARG_ACTION32 = this.match(input, SourceGenTriggers.ARG_ACTION, SourceGenTriggers.FOLLOW_ARG_ACTION_in_terminal782) as GrammarAST;
                        matchAny(input);
                        this.match(input, Token.UP, null);

                        omos = this.controller.tokenRef(TOKEN_REF31, label, ARG_ACTION32);
                    }
                    break;
                }

                case 4: {
                    // ./SourceGenTriggers.g:184:7: ^( TOKEN_REF . )
                    {
                        TOKEN_REF33 = this.match(input, SourceGenTriggers.TOKEN_REF, SourceGenTriggers.FOLLOW_TOKEN_REF_in_terminal796) as GrammarAST;
                        this.match(input, Token.DOWN, null);
                        matchAny(input);
                        this.match(input, Token.UP, null);

                        omos = this.controller.tokenRef(TOKEN_REF33, label, null);
                    }
                    break;
                }

                case 5: {
                    // ./SourceGenTriggers.g:185:7: TOKEN_REF
                    {
                        TOKEN_REF34 = this.match(input, SourceGenTriggers.TOKEN_REF, SourceGenTriggers.FOLLOW_TOKEN_REF_in_terminal812) as GrammarAST;
                        omos = this.controller.tokenRef(TOKEN_REF34, label, null);
                    }
                    break;
                }


                default:


            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
        return omos;
    }
    // $ANTLR end "terminal"



    // $ANTLR start "elementOptions"
    // ./SourceGenTriggers.g:188:1: elementOptions : ^( ELEMENT_OPTIONS ( elementOption )+ ) ;
    public readonly elementOptions(): void {
        try {
            // ./SourceGenTriggers.g:189:5: ( ^( ELEMENT_OPTIONS ( elementOption )+ ) )
            // ./SourceGenTriggers.g:189:7: ^( ELEMENT_OPTIONS ( elementOption )+ )
            {
                this.match(input, SourceGenTriggers.ELEMENT_OPTIONS, SourceGenTriggers.FOLLOW_ELEMENT_OPTIONS_in_elementOptions836);
                this.match(input, Token.DOWN, null);
                // ./SourceGenTriggers.g:189:25: ( elementOption )+
                let cnt17 = 0;
                loop17:
                while (true) {
                    let alt17 = 2;
                    let LA17_0 = input.LA(1);
                    if ((LA17_0 === SourceGenTriggers.ASSIGN || LA17_0 === SourceGenTriggers.ID)) {
                        alt17 = 1;
                    }

                    switch (alt17) {
                        case 1: {
                            // ./SourceGenTriggers.g:189:25: elementOption
                            {
                                pushFollow(SourceGenTriggers.FOLLOW_elementOption_in_elementOptions838);
                                this.elementOption();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt17 >= 1) {
                                break loop17;
                            }

                            let eee = new EarlyExitException(17, input);
                            throw eee;
                        }

                    }
                    cnt17++;
                }

                this.match(input, Token.UP, null);

            }

        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "elementOptions"



    // $ANTLR start "elementOption"
    // ./SourceGenTriggers.g:192:1: elementOption : ( ID | ^( ASSIGN ID ID ) | ^( ASSIGN ID STRING_LITERAL ) | ^( ASSIGN ID ACTION ) | ^( ASSIGN ID INT ) );
    public readonly elementOption(): void {
        try {
            // ./SourceGenTriggers.g:193:5: ( ID | ^( ASSIGN ID ID ) | ^( ASSIGN ID STRING_LITERAL ) | ^( ASSIGN ID ACTION ) | ^( ASSIGN ID INT ) )
            let alt18 = 5;
            let LA18_0 = input.LA(1);
            if ((LA18_0 === SourceGenTriggers.ID)) {
                alt18 = 1;
            }
            else {
                if ((LA18_0 === SourceGenTriggers.ASSIGN)) {
                    let LA18_2 = input.LA(2);
                    if ((LA18_2 === DOWN)) {
                        let LA18_3 = input.LA(3);
                        if ((LA18_3 === SourceGenTriggers.ID)) {
                            switch (input.LA(4)) {
                                case ID: {
                                    {
                                        alt18 = 2;
                                    }
                                    break;
                                }

                                case STRING_LITERAL: {
                                    {
                                        alt18 = 3;
                                    }
                                    break;
                                }

                                case ACTION: {
                                    {
                                        alt18 = 4;
                                    }
                                    break;
                                }

                                case INT: {
                                    {
                                        alt18 = 5;
                                    }
                                    break;
                                }

                                default: {
                                    let nvaeMark = input.mark();
                                    try {
                                        for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                            input.consume();
                                        }
                                        let nvae =
                                            new NoViableAltException("", 18, 4, input);
                                        throw nvae;
                                    } finally {
                                        input.rewind(nvaeMark);
                                    }
                                }

                            }
                        }

                        else {
                            let nvaeMark = input.mark();
                            try {
                                for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                    input.consume();
                                }
                                let nvae =
                                    new NoViableAltException("", 18, 3, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }

                    }

                    else {
                        let nvaeMark = input.mark();
                        try {
                            input.consume();
                            let nvae =
                                new NoViableAltException("", 18, 2, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }

                }

                else {
                    let nvae =
                        new NoViableAltException("", 18, 0, input);
                    throw nvae;
                }
            }


            switch (alt18) {
                case 1: {
                    // ./SourceGenTriggers.g:193:7: ID
                    {
                        this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_elementOption857);
                    }
                    break;
                }

                case 2: {
                    // ./SourceGenTriggers.g:194:9: ^( ASSIGN ID ID )
                    {
                        this.match(input, SourceGenTriggers.ASSIGN, SourceGenTriggers.FOLLOW_ASSIGN_in_elementOption868);
                        this.match(input, Token.DOWN, null);
                        this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_elementOption870);
                        this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_elementOption872);
                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 3: {
                    // ./SourceGenTriggers.g:195:9: ^( ASSIGN ID STRING_LITERAL )
                    {
                        this.match(input, SourceGenTriggers.ASSIGN, SourceGenTriggers.FOLLOW_ASSIGN_in_elementOption884);
                        this.match(input, Token.DOWN, null);
                        this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_elementOption886);
                        this.match(input, SourceGenTriggers.STRING_LITERAL, SourceGenTriggers.FOLLOW_STRING_LITERAL_in_elementOption888);
                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 4: {
                    // ./SourceGenTriggers.g:196:9: ^( ASSIGN ID ACTION )
                    {
                        this.match(input, SourceGenTriggers.ASSIGN, SourceGenTriggers.FOLLOW_ASSIGN_in_elementOption900);
                        this.match(input, Token.DOWN, null);
                        this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_elementOption902);
                        this.match(input, SourceGenTriggers.ACTION, SourceGenTriggers.FOLLOW_ACTION_in_elementOption904);
                        this.match(input, Token.UP, null);

                    }
                    break;
                }

                case 5: {
                    // ./SourceGenTriggers.g:197:9: ^( ASSIGN ID INT )
                    {
                        this.match(input, SourceGenTriggers.ASSIGN, SourceGenTriggers.FOLLOW_ASSIGN_in_elementOption916);
                        this.match(input, Token.DOWN, null);
                        this.match(input, SourceGenTriggers.ID, SourceGenTriggers.FOLLOW_ID_in_elementOption918);
                        this.match(input, SourceGenTriggers.INT, SourceGenTriggers.FOLLOW_INT_in_elementOption920);
                        this.match(input, Token.UP, null);

                    }
                    break;
                }


                default:


            }
        } catch (re) {
            if (re instanceof RecognitionException) {
                java.util.logging.Handler.reportError(re);
                recover(input, re);
            } else {
                throw re;
            }
        }
        finally {
            // do for sure before leaving
        }
    };;

    static {
        let numStates = SourceGenTriggers.DFA7_transitionS.length;
        SourceGenTriggers.DFA7_transition = new Int16Array(numStates)[];
        for (let i = 0; i < numStates; i++) {
            SourceGenTriggers.DFA7_transition[i] = DFA.unpackEncodedString(SourceGenTriggers.DFA7_transitionS[i]);
        }
    }
}
