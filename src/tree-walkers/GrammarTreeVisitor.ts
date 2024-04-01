// $ANTLR 3.5.3 org/antlr/v4/parse/GrammarTreeVisitor.g

/*
 [The "BSD license"]
 Copyright (c) 2011 Terence Parr
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:

 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
    derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */




/** The definitive ANTLR v3 tree grammar to walk/visit ANTLR v4 grammars.
 *  Parses trees created by ANTLRParser.g.
 *
 *  Rather than have multiple tree grammars, one for each visit, I'm
 *  creating this generic visitor that knows about context. All of the
 *  boilerplate pattern recognition is done here. Then, subclasses can
 *  override the methods they care about. This prevents a lot of the same
 *  context tracking stuff like "set current alternative for current
 *  rule node" that is repeated in lots of tree filters.
 */
export class GrammarTreeVisitor extends TreeParser {
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
        "RULE", "RULEMODIFIERS", "RULES", "SET", "WILDCARD", "PRIVATE", "PROTECTED",
        "PUBLIC"
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
    public static readonly PRIVATE = 84;
    public static readonly PROTECTED = 85;
    public static readonly PUBLIC = 86;


    public static grammarSpec_return = class grammarSpec_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "grammarSpec"


    public static prequelConstructs_return = class prequelConstructs_return extends TreeRuleReturnScope {
        public firstOne = null;
    };

    // $ANTLR end "prequelConstructs"


    public static prequelConstruct_return = class prequelConstruct_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "prequelConstruct"


    public static optionsSpec_return = class optionsSpec_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "optionsSpec"


    public static option_return = class option_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "option"


    public static optionValue_return = class optionValue_return extends TreeRuleReturnScope {
        public v: string;
    };

    // $ANTLR end "optionValue"


    public static delegateGrammars_return = class delegateGrammars_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "delegateGrammars"


    public static delegateGrammar_return = class delegateGrammar_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "delegateGrammar"


    public static tokensSpec_return = class tokensSpec_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "tokensSpec"


    public static tokenSpec_return = class tokenSpec_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "tokenSpec"


    public static channelsSpec_return = class channelsSpec_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "channelsSpec"


    public static channelSpec_return = class channelSpec_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "channelSpec"


    public static action_return = class action_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "action"


    public static rules_return = class rules_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "rules"


    public static mode_return = class mode_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "mode"


    public static lexerRule_return = class lexerRule_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerRule"


    public static rule_return = class rule_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "rule"


    public static exceptionGroup_return = class exceptionGroup_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "exceptionGroup"


    public static exceptionHandler_return = class exceptionHandler_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "exceptionHandler"


    public static finallyClause_return = class finallyClause_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "finallyClause"


    public static locals_return = class locals_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "locals"


    public static ruleReturns_return = class ruleReturns_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "ruleReturns"


    public static throwsSpec_return = class throwsSpec_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "throwsSpec"


    public static ruleAction_return = class ruleAction_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "ruleAction"


    public static ruleModifier_return = class ruleModifier_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "ruleModifier"


    public static lexerRuleBlock_return = class lexerRuleBlock_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerRuleBlock"


    public static ruleBlock_return = class ruleBlock_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "ruleBlock"


    public static lexerOuterAlternative_return = class lexerOuterAlternative_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerOuterAlternative"


    public static outerAlternative_return = class outerAlternative_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "outerAlternative"


    public static lexerAlternative_return = class lexerAlternative_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerAlternative"


    public static lexerElements_return = class lexerElements_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerElements"


    public static lexerElement_return = class lexerElement_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerElement"


    public static lexerBlock_return = class lexerBlock_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerBlock"


    public static lexerAtom_return = class lexerAtom_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerAtom"


    public static actionElement_return = class actionElement_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "actionElement"


    public static alternative_return = class alternative_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "alternative"


    public static lexerCommand_return = class lexerCommand_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerCommand"


    public static lexerCommandExpr_return = class lexerCommandExpr_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerCommandExpr"


    public static element_return = class element_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "element"


    public static astOperand_return = class astOperand_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "astOperand"


    public static labeledElement_return = class labeledElement_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "labeledElement"


    public static subrule_return = class subrule_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "subrule"


    public static lexerSubrule_return = class lexerSubrule_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "lexerSubrule"


    public static blockSuffix_return = class blockSuffix_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "blockSuffix"


    public static ebnfSuffix_return = class ebnfSuffix_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "ebnfSuffix"


    public static atom_return = class atom_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "atom"


    public static blockSet_return = class blockSet_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "blockSet"


    public static setElement_return = class setElement_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "setElement"


    public static block_return = class block_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "block"


    public static ruleref_return = class ruleref_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "ruleref"


    public static range_return = class range_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "range"


    public static terminal_return = class terminal_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "terminal"


    public static elementOptions_return = class elementOptions_return extends TreeRuleReturnScope {
    };

    // $ANTLR end "elementOptions"


    public static elementOption_return = class elementOption_return extends TreeRuleReturnScope {
    };


    public static readonly FOLLOW_GRAMMAR_in_grammarSpec85 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_grammarSpec87 = new java.util.BitSet([0x2000040020002800n, 0x0000000000020000n]);
    public static readonly FOLLOW_prequelConstructs_in_grammarSpec106 = new java.util.BitSet([0x0000000000000000n, 0x0000000000020000n]);
    public static readonly FOLLOW_rules_in_grammarSpec123 = new java.util.BitSet([0x0000001000000008n]);
    public static readonly FOLLOW_mode_in_grammarSpec125 = new java.util.BitSet([0x0000001000000008n]);
    public static readonly FOLLOW_prequelConstruct_in_prequelConstructs167 = new java.util.BitSet([0x2000040020002802n]);
    public static readonly FOLLOW_optionsSpec_in_prequelConstruct194 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_delegateGrammars_in_prequelConstruct204 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_tokensSpec_in_prequelConstruct214 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_channelsSpec_in_prequelConstruct224 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_action_in_prequelConstruct234 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_OPTIONS_in_optionsSpec259 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_option_in_optionsSpec261 = new java.util.BitSet([0x0000000000000408n]);
    public static readonly FOLLOW_ASSIGN_in_option295 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_option297 = new java.util.BitSet([0x0800000050000000n]);
    public static readonly FOLLOW_optionValue_in_option301 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_IMPORT_in_delegateGrammars389 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_delegateGrammar_in_delegateGrammars391 = new java.util.BitSet([0x0000000010000408n]);
    public static readonly FOLLOW_ASSIGN_in_delegateGrammar420 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_delegateGrammar424 = new java.util.BitSet([0x0000000010000000n]);
    public static readonly FOLLOW_ID_in_delegateGrammar428 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ID_in_delegateGrammar443 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_TOKENS_SPEC_in_tokensSpec477 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_tokenSpec_in_tokensSpec479 = new java.util.BitSet([0x0000000010000008n]);
    public static readonly FOLLOW_ID_in_tokenSpec502 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_CHANNELS_in_channelsSpec532 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_channelSpec_in_channelsSpec534 = new java.util.BitSet([0x0000000010000008n]);
    public static readonly FOLLOW_ID_in_channelSpec557 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_AT_in_action585 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_action589 = new java.util.BitSet([0x0000000010000000n]);
    public static readonly FOLLOW_ID_in_action594 = new java.util.BitSet([0x0000000000000010n]);
    public static readonly FOLLOW_ACTION_in_action596 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_RULES_in_rules624 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_rule_in_rules629 = new java.util.BitSet([0x0000000000000008n, 0x0000000000008000n]);
    public static readonly FOLLOW_lexerRule_in_rules631 = new java.util.BitSet([0x0000000000000008n, 0x0000000000008000n]);
    public static readonly FOLLOW_MODE_in_mode662 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_mode664 = new java.util.BitSet([0x0000000000000008n, 0x0000000000008000n]);
    public static readonly FOLLOW_lexerRule_in_mode668 = new java.util.BitSet([0x0000000000000008n, 0x0000000000008000n]);
    public static readonly FOLLOW_RULE_in_lexerRule694 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_TOKEN_REF_in_lexerRule696 = new java.util.BitSet([0x0000040000000000n, 0x0000000000010040n]);
    public static readonly FOLLOW_RULEMODIFIERS_in_lexerRule708 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_FRAGMENT_in_lexerRule712 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_optionsSpec_in_lexerRule724 = new java.util.BitSet([0x0000040000000000n, 0x0000000000000040n]);
    public static readonly FOLLOW_lexerRuleBlock_in_lexerRule745 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_RULE_in_rule790 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_RULE_REF_in_rule792 = new java.util.BitSet([0x1010040200000900n, 0x0000000000010040n]);
    public static readonly FOLLOW_RULEMODIFIERS_in_rule801 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ruleModifier_in_rule806 = new java.util.BitSet([0x0000000001000008n, 0x0000000000700000n]);
    public static readonly FOLLOW_ARG_ACTION_in_rule817 = new java.util.BitSet([0x1010040200000800n, 0x0000000000000040n]);
    public static readonly FOLLOW_ruleReturns_in_rule830 = new java.util.BitSet([0x1000040200000800n, 0x0000000000000040n]);
    public static readonly FOLLOW_throwsSpec_in_rule843 = new java.util.BitSet([0x0000040200000800n, 0x0000000000000040n]);
    public static readonly FOLLOW_locals_in_rule856 = new java.util.BitSet([0x0000040000000800n, 0x0000000000000040n]);
    public static readonly FOLLOW_optionsSpec_in_rule871 = new java.util.BitSet([0x0000040000000800n, 0x0000000000000040n]);
    public static readonly FOLLOW_ruleAction_in_rule885 = new java.util.BitSet([0x0000040000000800n, 0x0000000000000040n]);
    public static readonly FOLLOW_ruleBlock_in_rule916 = new java.util.BitSet([0x0000000000801008n]);
    public static readonly FOLLOW_exceptionGroup_in_rule918 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_exceptionHandler_in_exceptionGroup965 = new java.util.BitSet([0x0000000000801002n]);
    public static readonly FOLLOW_finallyClause_in_exceptionGroup968 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_CATCH_in_exceptionHandler994 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ARG_ACTION_in_exceptionHandler996 = new java.util.BitSet([0x0000000000000010n]);
    public static readonly FOLLOW_ACTION_in_exceptionHandler998 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_FINALLY_in_finallyClause1023 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ACTION_in_finallyClause1025 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_LOCALS_in_locals1053 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ARG_ACTION_in_locals1055 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_RETURNS_in_ruleReturns1078 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ARG_ACTION_in_ruleReturns1080 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_THROWS_in_throwsSpec1106 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_throwsSpec1108 = new java.util.BitSet([0x0000000010000008n]);
    public static readonly FOLLOW_AT_in_ruleAction1135 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_ruleAction1137 = new java.util.BitSet([0x0000000000000010n]);
    public static readonly FOLLOW_ACTION_in_ruleAction1139 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_BLOCK_in_lexerRuleBlock1217 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_lexerOuterAlternative_in_lexerRuleBlock1236 = new java.util.BitSet([0x0000000000000008n, 0x0000000000001020n]);
    public static readonly FOLLOW_BLOCK_in_ruleBlock1281 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_outerAlternative_in_ruleBlock1300 = new java.util.BitSet([0x0000000000000008n, 0x0000000000000020n]);
    public static readonly FOLLOW_lexerAlternative_in_lexerOuterAlternative1340 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_alternative_in_outerAlternative1362 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_LEXER_ALT_ACTION_in_lexerAlternative1384 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_lexerElements_in_lexerAlternative1386 = new java.util.BitSet([0x0000000010000000n, 0x0000000000000800n]);
    public static readonly FOLLOW_lexerCommand_in_lexerAlternative1388 = new java.util.BitSet([0x0000000010000008n, 0x0000000000000800n]);
    public static readonly FOLLOW_lexerElements_in_lexerAlternative1400 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ALT_in_lexerElements1428 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_lexerElement_in_lexerElements1430 = new java.util.BitSet([0x4942008100000018n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_lexerAtom_in_lexerElement1456 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_lexerSubrule_in_lexerElement1461 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ACTION_in_lexerElement1468 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_SEMPRED_in_lexerElement1482 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ACTION_in_lexerElement1497 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_lexerElement1499 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_SEMPRED_in_lexerElement1510 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_lexerElement1512 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_EPSILON_in_lexerElement1520 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_BLOCK_in_lexerBlock1543 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_optionsSpec_in_lexerBlock1545 = new java.util.BitSet([0x0000000000000000n, 0x0000000000001020n]);
    public static readonly FOLLOW_lexerAlternative_in_lexerBlock1548 = new java.util.BitSet([0x0000000000000008n, 0x0000000000001020n]);
    public static readonly FOLLOW_terminal_in_lexerAtom1579 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_NOT_in_lexerAtom1590 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_blockSet_in_lexerAtom1592 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_blockSet_in_lexerAtom1603 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_WILDCARD_in_lexerAtom1614 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_lexerAtom1616 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_WILDCARD_in_lexerAtom1627 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_LEXER_CHAR_SET_in_lexerAtom1635 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_range_in_lexerAtom1645 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ruleref_in_lexerAtom1655 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ACTION_in_actionElement1679 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ACTION_in_actionElement1687 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_actionElement1689 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_SEMPRED_in_actionElement1697 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_SEMPRED_in_actionElement1705 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_actionElement1707 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ALT_in_alternative1730 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_alternative1732 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C60C0n]);
    public static readonly FOLLOW_element_in_alternative1735 = new java.util.BitSet([0x4942408000100418n, 0x00000000000C60C0n]);
    public static readonly FOLLOW_ALT_in_alternative1743 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_alternative1745 = new java.util.BitSet([0x0000000000000000n, 0x0000000000000400n]);
    public static readonly FOLLOW_EPSILON_in_alternative1748 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_LEXER_ACTION_CALL_in_lexerCommand1774 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_lexerCommand1776 = new java.util.BitSet([0x0000000050000000n]);
    public static readonly FOLLOW_lexerCommandExpr_in_lexerCommand1778 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ID_in_lexerCommand1794 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_labeledElement_in_element1851 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_atom_in_element1856 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_subrule_in_element1861 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ACTION_in_element1868 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_SEMPRED_in_element1882 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ACTION_in_element1897 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_element1899 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_SEMPRED_in_element1910 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_element1912 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_range_in_element1920 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_NOT_in_element1926 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_blockSet_in_element1928 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_NOT_in_element1935 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_block_in_element1937 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_atom_in_astOperand1959 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_NOT_in_astOperand1965 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_blockSet_in_astOperand1967 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_NOT_in_astOperand1974 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_block_in_astOperand1976 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_set_in_labeledElement1999 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_labeledElement2005 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C60C0n]);
    public static readonly FOLLOW_element_in_labeledElement2007 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_blockSuffix_in_subrule2032 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_block_in_subrule2034 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_block_in_subrule2041 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_blockSuffix_in_lexerSubrule2066 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_lexerBlock_in_lexerSubrule2068 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_lexerBlock_in_lexerSubrule2075 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ebnfSuffix_in_blockSuffix2102 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_DOT_in_atom2163 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_atom2165 = new java.util.BitSet([0x4800000000000000n]);
    public static readonly FOLLOW_terminal_in_atom2167 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_DOT_in_atom2174 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_atom2176 = new java.util.BitSet([0x0040000000000000n]);
    public static readonly FOLLOW_ruleref_in_atom2178 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_WILDCARD_in_atom2188 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_atom2190 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_WILDCARD_in_atom2201 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_terminal_in_atom2217 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_blockSet_in_atom2225 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ruleref_in_atom2235 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_SET_in_blockSet2260 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_setElement_in_blockSet2262 = new java.util.BitSet([0x4802000100000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_setElement2286 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_setElement2288 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_TOKEN_REF_in_setElement2300 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_setElement2302 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_setElement2312 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_TOKEN_REF_in_setElement2337 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_RANGE_in_setElement2366 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_STRING_LITERAL_in_setElement2370 = new java.util.BitSet([0x0800000000000000n]);
    public static readonly FOLLOW_STRING_LITERAL_in_setElement2374 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_LEXER_CHAR_SET_in_setElement2397 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_BLOCK_in_block2422 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_optionsSpec_in_block2424 = new java.util.BitSet([0x0000000000000810n, 0x0000000000000020n]);
    public static readonly FOLLOW_ruleAction_in_block2427 = new java.util.BitSet([0x0000000000000810n, 0x0000000000000020n]);
    public static readonly FOLLOW_ACTION_in_block2430 = new java.util.BitSet([0x0000000000000000n, 0x0000000000000020n]);
    public static readonly FOLLOW_alternative_in_block2433 = new java.util.BitSet([0x0000000000000008n, 0x0000000000000020n]);
    public static readonly FOLLOW_RULE_REF_in_ruleref2463 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ARG_ACTION_in_ruleref2467 = new java.util.BitSet([0x0000000000000008n, 0x0000000000000200n]);
    public static readonly FOLLOW_elementOptions_in_ruleref2470 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_RANGE_in_range2507 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_STRING_LITERAL_in_range2509 = new java.util.BitSet([0x0800000000000000n]);
    public static readonly FOLLOW_STRING_LITERAL_in_range2511 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_terminal2541 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_terminal2543 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_terminal2566 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_TOKEN_REF_in_terminal2580 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_terminal2582 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_TOKEN_REF_in_terminal2593 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ELEMENT_OPTIONS_in_elementOptions2630 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOption_in_elementOptions2632 = new java.util.BitSet([0x0000000010000408n]);
    public static readonly FOLLOW_ID_in_elementOption2663 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption2683 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption2687 = new java.util.BitSet([0x0000000010000000n]);
    public static readonly FOLLOW_ID_in_elementOption2691 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption2707 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption2709 = new java.util.BitSet([0x0800000000000000n]);
    public static readonly FOLLOW_STRING_LITERAL_in_elementOption2713 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption2727 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption2729 = new java.util.BitSet([0x0000000000000010n]);
    public static readonly FOLLOW_ACTION_in_elementOption2733 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption2749 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption2751 = new java.util.BitSet([0x0000000040000000n]);
    public static readonly FOLLOW_INT_in_elementOption2755 = new java.util.BitSet([0x0000000000000008n]);
    protected static readonly DFA38_eotS =
		"\24\uffff";
    protected static readonly DFA38_eofS =
		"\24\uffff";
    protected static readonly DFA38_minS =
		"\1\105\1\2\1\4\1\2\2\uffff\2\3\1\2\1\4\1\34\1\4\10\3";
    protected static readonly DFA38_maxS =
		"\1\105\1\2\1\123\1\2\2\uffff\2\34\1\2\1\123\1\34\1\73\4\3\4\34";
    protected static readonly DFA38_acceptS =
		"\4\uffff\1\1\1\2\16\uffff";
    protected static readonly DFA38_specialS =
		"\24\uffff}>";
    protected static readonly DFA38_transitionS = [
			"\1\1",
			"\1\2",
			"\1\4\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff\1\4\4" +
			"\uffff\1\4\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\1\uffff\1" +
			"\3\1\5\2\uffff\2\4\3\uffff\2\4",
			"\1\6",
        "",
        "",
			"\1\11\6\uffff\1\10\21\uffff\1\7",
			"\1\11\6\uffff\1\10\21\uffff\1\7",
			"\1\12",
			"\1\4\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff\1\4\4" +
			"\uffff\1\4\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1" +
			"\5\2\uffff\2\4\3\uffff\2\4",
			"\1\13",
			"\1\16\27\uffff\1\14\1\uffff\1\17\34\uffff\1\15",
			"\1\20",
			"\1\21",
			"\1\22",
			"\1\23",
			"\1\11\6\uffff\1\10\21\uffff\1\7",
			"\1\11\6\uffff\1\10\21\uffff\1\7",
			"\1\11\6\uffff\1\10\21\uffff\1\7",
			"\1\11\6\uffff\1\10\21\uffff\1\7"
    ];

    protected static readonly DFA38_eot = DFA.unpackEncodedString(GrammarTreeVisitor.DFA38_eotS);
    protected static readonly DFA38_eof = DFA.unpackEncodedString(GrammarTreeVisitor.DFA38_eofS);
    protected static readonly DFA38_min = DFA.unpackEncodedStringToUnsignedChars(GrammarTreeVisitor.DFA38_minS);
    protected static readonly DFA38_max = DFA.unpackEncodedStringToUnsignedChars(GrammarTreeVisitor.DFA38_maxS);
    protected static readonly DFA38_accept = DFA.unpackEncodedString(GrammarTreeVisitor.DFA38_acceptS);
    protected static readonly DFA38_special = DFA.unpackEncodedString(GrammarTreeVisitor.DFA38_specialS);
    protected static readonly DFA38_transition: Int16Array[];


    public grammarName: string;
    public currentRuleAST: GrammarAST;
    public currentModeName = LexerGrammar.DEFAULT_MODE_NAME;
    public currentRuleName: string;
    public currentOuterAltRoot: GrammarAST;
    public currentOuterAltNumber = 1; // 1..n
    public rewriteEBNFLevel = 0;

    public DFA38 = (($outer) => {
        return class DFA38 extends DFA {

            public constructor(recognizer: BaseRecognizer) {
                this.recognizer = recognizer;
                this.decisionNumber = 38;
                this.eot = GrammarTreeVisitor.DFA38_eot;
                this.eof = GrammarTreeVisitor.DFA38_eof;
                this.min = GrammarTreeVisitor.DFA38_min;
                this.max = GrammarTreeVisitor.DFA38_max;
                this.accept = GrammarTreeVisitor.DFA38_accept;
                this.special = GrammarTreeVisitor.DFA38_special;
                this.transition = GrammarTreeVisitor.DFA38_transition;
            }
            @Override
            public getDescription(): string {
                return "783:1: alternative : ( ^( ALT ( elementOptions )? ( element )+ ) | ^( ALT ( elementOptions )? EPSILON ) );";
            }
        };
    })(this);

    // $ANTLR end "elementOption"

    // Delegated rules


    protected dfa38 = new DFA38(this);

    public constructor();

    // delegators


    public constructor(input: TreeNodeStream);
    public constructor(input: TreeNodeStream, state: RecognizerSharedState);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {
                this(null);

                break;
            }

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

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    // delegates
    public getDelegates(): TreeParser[] {
        return [];
    }

    @Override
    public getTokenNames(): string[] { return GrammarTreeVisitor.tokenNames; }
    @Override
    public getGrammarFileName(): string { return "org/antlr/v4/parse/GrammarTreeVisitor.g"; }

    // Should be abstract but can't make gen'd parser abstract;
    // subclasses should implement else everything goes to stderr!
    public getErrorManager(): java.util.logging.ErrorManager { return null; }

    public visitGrammar(t: GrammarAST): void { this.visit(t, "grammarSpec"); }
    public visit(t: GrammarAST, ruleName: string): void {
        let nodes = new CommonTreeNodeStream(new GrammarASTAdaptor(), t);
        setTreeNodeStream(nodes);
        try {
            let m = java.lang.Object.getClass().getMethod(ruleName);
            m.invoke(this);
        } catch (e) {
            if (e instanceof Throwable) {
                let errMgr = this.getErrorManager();
                if (e instanceof InvocationTargetException) {
                    e = e.getCause();
                }
                //e.printStackTrace(System.err);
                if (errMgr === null) {
                    System.err.println("can't find rule " + ruleName +
                        " or tree structure error: " + t.toStringTree()
                    );
                    e.printStackTrace(System.err);
                }
                else {
                    errMgr.toolError(ErrorType.INTERNAL_ERROR, e);
                }

            } else {
                throw e;
            }
        }
    }

    public discoverGrammar(root: GrammarRootAST, ID: GrammarAST): void { }
    public finishPrequels(firstPrequel: GrammarAST): void { }
    public finishGrammar(root: GrammarRootAST, ID: GrammarAST): void { }

    public grammarOption(ID: GrammarAST, valueAST: GrammarAST): void { }
    public ruleOption(ID: GrammarAST, valueAST: GrammarAST): void { }
    public blockOption(ID: GrammarAST, valueAST: GrammarAST): void { }
    public defineToken(ID: GrammarAST): void { }
    public defineChannel(ID: GrammarAST): void { }
    public globalNamedAction(scope: GrammarAST, ID: GrammarAST, action: ActionAST): void { }
    public importGrammar(label: GrammarAST, ID: GrammarAST): void { }

    public modeDef(m: GrammarAST, ID: GrammarAST): void { }

    public discoverRules(rules: GrammarAST): void { }
    public finishRules(rule: GrammarAST): void { }
    public discoverRule(rule: RuleAST, ID: GrammarAST, modifiers: Array<GrammarAST>,
        arg: ActionAST, returns: ActionAST, thrws: GrammarAST,
        options: GrammarAST, locals: ActionAST,
        actions: Array<GrammarAST>,
        block: GrammarAST): void { }
    public finishRule(rule: RuleAST, ID: GrammarAST, block: GrammarAST): void { }
    public discoverLexerRule(rule: RuleAST, ID: GrammarAST, modifiers: Array<GrammarAST>, options: GrammarAST,
        block: GrammarAST): void { }
    public finishLexerRule(rule: RuleAST, ID: GrammarAST, block: GrammarAST): void { }
    public ruleCatch(arg: GrammarAST, action: ActionAST): void { }
    public finallyAction(action: ActionAST): void { }
    public discoverOuterAlt(alt: AltAST): void { }
    public finishOuterAlt(alt: AltAST): void { }
    public discoverAlt(alt: AltAST): void { }
    public finishAlt(alt: AltAST): void { }

    public ruleRef(ref: GrammarAST, arg: ActionAST): void { }
    public tokenRef(ref: TerminalAST): void { }


    // $ANTLR start "elementOption"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:1008:1: elementOption[GrammarASTWithOptions t] : ( ID | ^( ASSIGN id= ID v= ID ) | ^( ASSIGN ID v= STRING_LITERAL ) | ^( ASSIGN ID v= ACTION ) | ^( ASSIGN ID v= INT ) );
    public readonly elementOption(t: GrammarASTWithOptions): GrammarTreeVisitor.elementOption_return;
    public elementOption(t: GrammarASTWithOptions, ID: GrammarAST, valueAST: GrammarAST): void;
    public elementOption(...args: unknown[]): GrammarTreeVisitor.elementOption_return | void {
        switch (args.length) {
            case 1: {
                const [t] = args as [GrammarASTWithOptions];


                let retval = new GrammarTreeVisitor.elementOption_return();
                retval.start = input.LT(1);

                let id = null;
                let v = null;
                let ID45 = null;
                let ID46 = null;
                let ID47 = null;
                let ID48 = null;


                this.enterElementOption((retval.start as GrammarAST));

                try {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:1015:5: ( ID | ^( ASSIGN id= ID v= ID ) | ^( ASSIGN ID v= STRING_LITERAL ) | ^( ASSIGN ID v= ACTION ) | ^( ASSIGN ID v= INT ) )
                    let alt55 = 5;
                    let LA55_0 = input.LA(1);
                    if ((LA55_0 === GrammarTreeVisitor.ID)) {
                        alt55 = 1;
                    }
                    else {
                        if ((LA55_0 === GrammarTreeVisitor.ASSIGN)) {
                            let LA55_2 = input.LA(2);
                            if ((LA55_2 === DOWN)) {
                                let LA55_3 = input.LA(3);
                                if ((LA55_3 === GrammarTreeVisitor.ID)) {
                                    switch (input.LA(4)) {
                                        case ID: {
                                            {
                                                alt55 = 2;
                                            }
                                            break;
                                        }

                                        case STRING_LITERAL: {
                                            {
                                                alt55 = 3;
                                            }
                                            break;
                                        }

                                        case ACTION: {
                                            {
                                                alt55 = 4;
                                            }
                                            break;
                                        }

                                        case INT: {
                                            {
                                                alt55 = 5;
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
                                                    new NoViableAltException("", 55, 4, input);
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
                                            new NoViableAltException("", 55, 3, input);
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
                                        new NoViableAltException("", 55, 2, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }

                        }

                        else {
                            let nvae =
                                new NoViableAltException("", 55, 0, input);
                            throw nvae;
                        }
                    }


                    switch (alt55) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:1015:7: ID
                            {
                                ID45 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_elementOption2663) as GrammarAST;
                                this.elementOption(t, ID45, null);
                            }
                            break;
                        }

                        case 2: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:1016:9: ^( ASSIGN id= ID v= ID )
                            {
                                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ASSIGN, GrammarTreeVisitor.FOLLOW_ASSIGN_in_elementOption2683);
                                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                                id = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_elementOption2687) as GrammarAST;
                                v = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_elementOption2691) as GrammarAST;
                                java.security.cert.CertSelector.match(input, Token.UP, null);

                                this.elementOption(t, id, v);
                            }
                            break;
                        }

                        case 3: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:1017:9: ^( ASSIGN ID v= STRING_LITERAL )
                            {
                                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ASSIGN, GrammarTreeVisitor.FOLLOW_ASSIGN_in_elementOption2707);
                                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                                ID46 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_elementOption2709) as GrammarAST;
                                v = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.STRING_LITERAL, GrammarTreeVisitor.FOLLOW_STRING_LITERAL_in_elementOption2713) as GrammarAST;
                                java.security.cert.CertSelector.match(input, Token.UP, null);

                                this.elementOption(t, ID46, v);
                            }
                            break;
                        }

                        case 4: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:1018:9: ^( ASSIGN ID v= ACTION )
                            {
                                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ASSIGN, GrammarTreeVisitor.FOLLOW_ASSIGN_in_elementOption2727);
                                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                                ID47 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_elementOption2729) as GrammarAST;
                                v = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_elementOption2733) as GrammarAST;
                                java.security.cert.CertSelector.match(input, Token.UP, null);

                                this.elementOption(t, ID47, v);
                            }
                            break;
                        }

                        case 5: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:1019:9: ^( ASSIGN ID v= INT )
                            {
                                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ASSIGN, GrammarTreeVisitor.FOLLOW_ASSIGN_in_elementOption2749);
                                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                                ID48 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_elementOption2751) as GrammarAST;
                                v = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.INT, GrammarTreeVisitor.FOLLOW_INT_in_elementOption2755) as GrammarAST;
                                java.security.cert.CertSelector.match(input, Token.UP, null);

                                this.elementOption(t, ID48, v);
                            }
                            break;
                        }


                        default:


                    }

                    this.exitElementOption((retval.start as GrammarAST));

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


                break;
            }

            case 3: {
                const [t, ID, valueAST] = args as [GrammarASTWithOptions, GrammarAST, GrammarAST];



                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public stringRef(ref: TerminalAST): void { }
    public wildcardRef(ref: GrammarAST): void { }
    public actionInAlt(action: ActionAST): void { }
    public sempredInAlt(pred: PredAST): void { }
    public label(op: GrammarAST, ID: GrammarAST, element: GrammarAST): void { }
    public lexerCallCommand(outerAltNumber: number, ID: GrammarAST, arg: GrammarAST): void { }


    // $ANTLR start "lexerCommand"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:796:1: lexerCommand : ( ^( LEXER_ACTION_CALL ID lexerCommandExpr ) | ID );
    public readonly lexerCommand(): GrammarTreeVisitor.lexerCommand_return;
    public lexerCommand(outerAltNumber: number, ID: GrammarAST): void;
    public lexerCommand(...args: unknown[]): GrammarTreeVisitor.lexerCommand_return | void {
        switch (args.length) {
            case 0: {

                let retval = new GrammarTreeVisitor.lexerCommand_return();
                retval.start = input.LT(1);

                let ID25 = null;
                let ID27 = null;
                let lexerCommandExpr26 = null;


                this.enterLexerCommand((retval.start as GrammarAST));

                try {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:803:2: ( ^( LEXER_ACTION_CALL ID lexerCommandExpr ) | ID )
                    let alt39 = 2;
                    let LA39_0 = input.LA(1);
                    if ((LA39_0 === GrammarTreeVisitor.LEXER_ACTION_CALL)) {
                        alt39 = 1;
                    }
                    else {
                        if ((LA39_0 === GrammarTreeVisitor.ID)) {
                            alt39 = 2;
                        }

                        else {
                            let nvae =
                                new NoViableAltException("", 39, 0, input);
                            throw nvae;
                        }
                    }


                    switch (alt39) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:803:4: ^( LEXER_ACTION_CALL ID lexerCommandExpr )
                            {
                                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.LEXER_ACTION_CALL, GrammarTreeVisitor.FOLLOW_LEXER_ACTION_CALL_in_lexerCommand1774);
                                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                                ID25 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_lexerCommand1776) as GrammarAST;
                                pushFollow(GrammarTreeVisitor.FOLLOW_lexerCommandExpr_in_lexerCommand1778);
                                lexerCommandExpr26 = this.lexerCommandExpr();
                                java.security.Signature.state._fsp--;

                                java.security.cert.CertSelector.match(input, Token.UP, null);

                                this.lexerCallCommand(this.currentOuterAltNumber, ID25, (lexerCommandExpr26 !== null ? (lexerCommandExpr26.start as GrammarAST) : null));
                            }
                            break;
                        }

                        case 2: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:805:4: ID
                            {
                                ID27 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_lexerCommand1794) as GrammarAST;
                                this.lexerCommand(this.currentOuterAltNumber, ID27);
                            }
                            break;
                        }


                        default:


                    }

                    this.exitLexerCommand((retval.start as GrammarAST));

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


                break;
            }

            case 2: {
                const [outerAltNumber, ID] = args as [number, GrammarAST];



                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    @Override
    public traceIn(ruleName: string, ruleIndex: number): void {
        System.err.println("enter " + ruleName + ": " + input.LT(1));
    }

    @Override
    public traceOut(ruleName: string, ruleIndex: number): void {
        System.err.println("exit " + ruleName + ": " + input.LT(1));
    }


    // $ANTLR start "grammarSpec"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:341:1: grammarSpec : ^( GRAMMAR ID prequelConstructs rules ( mode )* ) ;
    public readonly grammarSpec(): GrammarTreeVisitor.grammarSpec_return {
        let retval = new GrammarTreeVisitor.grammarSpec_return();
        retval.start = input.LT(1);

        let ID1 = null;
        let GRAMMAR2 = null;
        let prequelConstructs3 = null;


        this.enterGrammarSpec((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:348:5: ( ^( GRAMMAR ID prequelConstructs rules ( mode )* ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:348:9: ^( GRAMMAR ID prequelConstructs rules ( mode )* )
            {
                GRAMMAR2 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.GRAMMAR, GrammarTreeVisitor.FOLLOW_GRAMMAR_in_grammarSpec85) as GrammarAST;
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                ID1 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_grammarSpec87) as GrammarAST;
                this.grammarName = (ID1 !== null ? ID1.getText() : null);
                this.discoverGrammar(GRAMMAR2 as GrammarRootAST, ID1);
                pushFollow(GrammarTreeVisitor.FOLLOW_prequelConstructs_in_grammarSpec106);
                prequelConstructs3 = this.prequelConstructs();
                java.security.Signature.state._fsp--;

                this.finishPrequels((prequelConstructs3 !== null ? (prequelConstructs3 as GrammarTreeVisitor.prequelConstructs_return).firstOne : null));
                pushFollow(GrammarTreeVisitor.FOLLOW_rules_in_grammarSpec123);
                this.rules();
                java.security.Signature.state._fsp--;

                // org/antlr/v4/parse/GrammarTreeVisitor.g:352:14: ( mode )*
                loop1:
                while (true) {
                    let alt1 = 2;
                    let LA1_0 = input.LA(1);
                    if ((LA1_0 === GrammarTreeVisitor.MODE)) {
                        alt1 = 1;
                    }

                    switch (alt1) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:352:14: mode
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_mode_in_grammarSpec125);
                                this.mode();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            break loop1;
                        }

                    }
                }

                this.finishGrammar(GRAMMAR2 as GrammarRootAST, ID1);
                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitGrammarSpec((retval.start as GrammarAST));

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


    // $ANTLR start "prequelConstructs"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:357:1: prequelConstructs returns [GrammarAST firstOne=null] : ( ( prequelConstruct )+ |);
    public readonly prequelConstructs(): GrammarTreeVisitor.prequelConstructs_return {
        let retval = new GrammarTreeVisitor.prequelConstructs_return();
        retval.start = input.LT(1);


        this.enterPrequelConstructs((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:364:2: ( ( prequelConstruct )+ |)
            let alt3 = 2;
            let LA3_0 = input.LA(1);
            if ((LA3_0 === GrammarTreeVisitor.AT || LA3_0 === GrammarTreeVisitor.CHANNELS || LA3_0 === GrammarTreeVisitor.IMPORT || LA3_0 === GrammarTreeVisitor.OPTIONS || LA3_0 === GrammarTreeVisitor.TOKENS_SPEC)) {
                alt3 = 1;
            }
            else {
                if ((LA3_0 === GrammarTreeVisitor.RULES)) {
                    alt3 = 2;
                }

                else {
                    let nvae =
                        new NoViableAltException("", 3, 0, input);
                    throw nvae;
                }
            }


            switch (alt3) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:364:4: ( prequelConstruct )+
                    {
                        retval.firstOne = (retval.start as GrammarAST);
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:364:24: ( prequelConstruct )+
                        let cnt2 = 0;
                        loop2:
                        while (true) {
                            let alt2 = 2;
                            let LA2_0 = input.LA(1);
                            if ((LA2_0 === GrammarTreeVisitor.AT || LA2_0 === GrammarTreeVisitor.CHANNELS || LA2_0 === GrammarTreeVisitor.IMPORT || LA2_0 === GrammarTreeVisitor.OPTIONS || LA2_0 === GrammarTreeVisitor.TOKENS_SPEC)) {
                                alt2 = 1;
                            }

                            switch (alt2) {
                                case 1: {
                                    // org/antlr/v4/parse/GrammarTreeVisitor.g:364:24: prequelConstruct
                                    {
                                        pushFollow(GrammarTreeVisitor.FOLLOW_prequelConstruct_in_prequelConstructs167);
                                        this.prequelConstruct();
                                        java.security.Signature.state._fsp--;

                                    }
                                    break;
                                }


                                default: {
                                    if (cnt2 >= 1) {
                                        break loop2;
                                    }

                                    let eee = new EarlyExitException(2, input);
                                    throw eee;
                                }

                            }
                            cnt2++;
                        }

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:366:2:
                    {
                    }
                    break;
                }


                default:


            }

            this.exitPrequelConstructs((retval.start as GrammarAST));

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


    // $ANTLR start "prequelConstruct"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:368:1: prequelConstruct : ( optionsSpec | delegateGrammars | tokensSpec | channelsSpec | action );
    public readonly prequelConstruct(): GrammarTreeVisitor.prequelConstruct_return {
        let retval = new GrammarTreeVisitor.prequelConstruct_return();
        retval.start = input.LT(1);


        this.enterPrequelConstructs((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:375:2: ( optionsSpec | delegateGrammars | tokensSpec | channelsSpec | action )
            let alt4 = 5;
            switch (input.LA(1)) {
                case OPTIONS: {
                    {
                        alt4 = 1;
                    }
                    break;
                }

                case IMPORT: {
                    {
                        alt4 = 2;
                    }
                    break;
                }

                case TOKENS_SPEC: {
                    {
                        alt4 = 3;
                    }
                    break;
                }

                case CHANNELS: {
                    {
                        alt4 = 4;
                    }
                    break;
                }

                case AT: {
                    {
                        alt4 = 5;
                    }
                    break;
                }

                default: {
                    let nvae =
                        new NoViableAltException("", 4, 0, input);
                    throw nvae;
                }

            }
            switch (alt4) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:375:6: optionsSpec
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_optionsSpec_in_prequelConstruct194);
                        this.optionsSpec();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:376:9: delegateGrammars
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_delegateGrammars_in_prequelConstruct204);
                        this.delegateGrammars();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:377:9: tokensSpec
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_tokensSpec_in_prequelConstruct214);
                        this.tokensSpec();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:378:9: channelsSpec
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_channelsSpec_in_prequelConstruct224);
                        this.channelsSpec();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:379:9: action
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_action_in_prequelConstruct234);
                        this.action();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }


                default:


            }

            this.exitPrequelConstructs((retval.start as GrammarAST));

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


    // $ANTLR start "optionsSpec"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:382:1: optionsSpec : ^( OPTIONS ( option )* ) ;
    public readonly optionsSpec(): GrammarTreeVisitor.optionsSpec_return {
        let retval = new GrammarTreeVisitor.optionsSpec_return();
        retval.start = input.LT(1);


        this.enterOptionsSpec((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:389:2: ( ^( OPTIONS ( option )* ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:389:4: ^( OPTIONS ( option )* )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.OPTIONS, GrammarTreeVisitor.FOLLOW_OPTIONS_in_optionsSpec259);
                if (input.LA(1) === Token.DOWN) {
                    java.security.cert.CertSelector.match(input, Token.DOWN, null);
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:389:14: ( option )*
                    loop5:
                    while (true) {
                        let alt5 = 2;
                        let LA5_0 = input.LA(1);
                        if ((LA5_0 === GrammarTreeVisitor.ASSIGN)) {
                            alt5 = 1;
                        }

                        switch (alt5) {
                            case 1: {
                                // org/antlr/v4/parse/GrammarTreeVisitor.g:389:14: option
                                {
                                    pushFollow(GrammarTreeVisitor.FOLLOW_option_in_optionsSpec261);
                                    this.option();
                                    java.security.Signature.state._fsp--;

                                }
                                break;
                            }


                            default: {
                                break loop5;
                            }

                        }
                    }

                    java.security.cert.CertSelector.match(input, Token.UP, null);
                }

            }


            this.exitOptionsSpec((retval.start as GrammarAST));

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


    // $ANTLR start "option"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:392:1: option : ^(a= ASSIGN ID v= optionValue ) ;
    public readonly option(): GrammarTreeVisitor.option_return {
        let retval = new GrammarTreeVisitor.option_return();
        retval.start = input.LT(1);

        let a = null;
        let ID4 = null;
        let v = null;


        this.enterOption((retval.start as GrammarAST));
        let rule = inContext("RULE ...");
        let block = inContext("BLOCK ...");

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:401:5: ( ^(a= ASSIGN ID v= optionValue ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:401:9: ^(a= ASSIGN ID v= optionValue )
            {
                a = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ASSIGN, GrammarTreeVisitor.FOLLOW_ASSIGN_in_option295) as GrammarAST;
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                ID4 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_option297) as GrammarAST;
                pushFollow(GrammarTreeVisitor.FOLLOW_optionValue_in_option301);
                v = this.optionValue();
                java.security.Signature.state._fsp--;

                java.security.cert.CertSelector.match(input, Token.UP, null);


                if (block) {
                    this.blockOption(ID4, (v !== null ? (v.start as GrammarAST) : null));
                }
                // most specific first
                else {
                    if (rule) {
                        this.ruleOption(ID4, (v !== null ? (v.start as GrammarAST) : null));
                    }

                    else {
                        this.grammarOption(ID4, (v !== null ? (v.start as GrammarAST) : null));
                    }

                }


            }


            this.exitOption((retval.start as GrammarAST));

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


    // $ANTLR start "optionValue"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:409:1: optionValue returns [String v] : ( ID | STRING_LITERAL | INT );
    public readonly optionValue(): GrammarTreeVisitor.optionValue_return {
        let retval = new GrammarTreeVisitor.optionValue_return();
        retval.start = input.LT(1);


        this.enterOptionValue((retval.start as GrammarAST));
        retval.v = (retval.start as GrammarAST).token.getText();

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:417:5: ( ID | STRING_LITERAL | INT )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:
            {
                if (input.LA(1) === GrammarTreeVisitor.ID || input.LA(1) === GrammarTreeVisitor.INT || input.LA(1) === GrammarTreeVisitor.STRING_LITERAL) {
                    input.consume();
                    java.security.Signature.state.errorRecovery = false;
                }
                else {
                    let mse = new MismatchedSetException(null, input);
                    throw mse;
                }
            }


            this.exitOptionValue((retval.start as GrammarAST));

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


    // $ANTLR start "delegateGrammars"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:422:1: delegateGrammars : ^( IMPORT ( delegateGrammar )+ ) ;
    public readonly delegateGrammars(): GrammarTreeVisitor.delegateGrammars_return {
        let retval = new GrammarTreeVisitor.delegateGrammars_return();
        retval.start = input.LT(1);


        this.enterDelegateGrammars((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:429:2: ( ^( IMPORT ( delegateGrammar )+ ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:429:6: ^( IMPORT ( delegateGrammar )+ )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.IMPORT, GrammarTreeVisitor.FOLLOW_IMPORT_in_delegateGrammars389);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:429:15: ( delegateGrammar )+
                let cnt6 = 0;
                loop6:
                while (true) {
                    let alt6 = 2;
                    let LA6_0 = input.LA(1);
                    if ((LA6_0 === GrammarTreeVisitor.ASSIGN || LA6_0 === GrammarTreeVisitor.ID)) {
                        alt6 = 1;
                    }

                    switch (alt6) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:429:15: delegateGrammar
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_delegateGrammar_in_delegateGrammars391);
                                this.delegateGrammar();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt6 >= 1) {
                                break loop6;
                            }

                            let eee = new EarlyExitException(6, input);
                            throw eee;
                        }

                    }
                    cnt6++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitDelegateGrammars((retval.start as GrammarAST));

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


    // $ANTLR start "delegateGrammar"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:432:1: delegateGrammar : ( ^( ASSIGN label= ID id= ID ) |id= ID );
    public readonly delegateGrammar(): GrammarTreeVisitor.delegateGrammar_return {
        let retval = new GrammarTreeVisitor.delegateGrammar_return();
        retval.start = input.LT(1);

        let label = null;
        let id = null;


        this.enterDelegateGrammar((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:439:5: ( ^( ASSIGN label= ID id= ID ) |id= ID )
            let alt7 = 2;
            let LA7_0 = input.LA(1);
            if ((LA7_0 === GrammarTreeVisitor.ASSIGN)) {
                alt7 = 1;
            }
            else {
                if ((LA7_0 === GrammarTreeVisitor.ID)) {
                    alt7 = 2;
                }

                else {
                    let nvae =
                        new NoViableAltException("", 7, 0, input);
                    throw nvae;
                }
            }


            switch (alt7) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:439:9: ^( ASSIGN label= ID id= ID )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ASSIGN, GrammarTreeVisitor.FOLLOW_ASSIGN_in_delegateGrammar420);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        label = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_delegateGrammar424) as GrammarAST;
                        id = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_delegateGrammar428) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.UP, null);

                        this.importGrammar(label, id);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:440:9: id= ID
                    {
                        id = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_delegateGrammar443) as GrammarAST;
                        this.importGrammar(null, id);
                    }
                    break;
                }


                default:


            }

            this.exitDelegateGrammar((retval.start as GrammarAST));

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


    // $ANTLR start "tokensSpec"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:443:1: tokensSpec : ^( TOKENS_SPEC ( tokenSpec )+ ) ;
    public readonly tokensSpec(): GrammarTreeVisitor.tokensSpec_return {
        let retval = new GrammarTreeVisitor.tokensSpec_return();
        retval.start = input.LT(1);


        this.enterTokensSpec((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:450:2: ( ^( TOKENS_SPEC ( tokenSpec )+ ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:450:6: ^( TOKENS_SPEC ( tokenSpec )+ )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.TOKENS_SPEC, GrammarTreeVisitor.FOLLOW_TOKENS_SPEC_in_tokensSpec477);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:450:20: ( tokenSpec )+
                let cnt8 = 0;
                loop8:
                while (true) {
                    let alt8 = 2;
                    let LA8_0 = input.LA(1);
                    if ((LA8_0 === GrammarTreeVisitor.ID)) {
                        alt8 = 1;
                    }

                    switch (alt8) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:450:20: tokenSpec
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_tokenSpec_in_tokensSpec479);
                                this.tokenSpec();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt8 >= 1) {
                                break loop8;
                            }

                            let eee = new EarlyExitException(8, input);
                            throw eee;
                        }

                    }
                    cnt8++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitTokensSpec((retval.start as GrammarAST));

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


    // $ANTLR start "tokenSpec"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:453:1: tokenSpec : ID ;
    public readonly tokenSpec(): GrammarTreeVisitor.tokenSpec_return {
        let retval = new GrammarTreeVisitor.tokenSpec_return();
        retval.start = input.LT(1);

        let ID5 = null;


        this.enterTokenSpec((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:460:2: ( ID )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:460:4: ID
            {
                ID5 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_tokenSpec502) as GrammarAST;
                this.defineToken(ID5);
            }


            this.exitTokenSpec((retval.start as GrammarAST));

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


    // $ANTLR start "channelsSpec"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:463:1: channelsSpec : ^( CHANNELS ( channelSpec )+ ) ;
    public readonly channelsSpec(): GrammarTreeVisitor.channelsSpec_return {
        let retval = new GrammarTreeVisitor.channelsSpec_return();
        retval.start = input.LT(1);


        this.enterChannelsSpec((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:470:2: ( ^( CHANNELS ( channelSpec )+ ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:470:6: ^( CHANNELS ( channelSpec )+ )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.CHANNELS, GrammarTreeVisitor.FOLLOW_CHANNELS_in_channelsSpec532);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:470:17: ( channelSpec )+
                let cnt9 = 0;
                loop9:
                while (true) {
                    let alt9 = 2;
                    let LA9_0 = input.LA(1);
                    if ((LA9_0 === GrammarTreeVisitor.ID)) {
                        alt9 = 1;
                    }

                    switch (alt9) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:470:17: channelSpec
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_channelSpec_in_channelsSpec534);
                                this.channelSpec();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt9 >= 1) {
                                break loop9;
                            }

                            let eee = new EarlyExitException(9, input);
                            throw eee;
                        }

                    }
                    cnt9++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitChannelsSpec((retval.start as GrammarAST));

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


    // $ANTLR start "channelSpec"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:473:1: channelSpec : ID ;
    public readonly channelSpec(): GrammarTreeVisitor.channelSpec_return {
        let retval = new GrammarTreeVisitor.channelSpec_return();
        retval.start = input.LT(1);

        let ID6 = null;


        this.enterChannelSpec((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:480:2: ( ID )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:480:4: ID
            {
                ID6 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_channelSpec557) as GrammarAST;
                this.defineChannel(ID6);
            }


            this.exitChannelSpec((retval.start as GrammarAST));

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


    // $ANTLR start "action"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:483:1: action : ^( AT (sc= ID )? name= ID ACTION ) ;
    public readonly action(): GrammarTreeVisitor.action_return {
        let retval = new GrammarTreeVisitor.action_return();
        retval.start = input.LT(1);

        let sc = null;
        let name = null;
        let ACTION7 = null;


        this.enterAction((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:490:2: ( ^( AT (sc= ID )? name= ID ACTION ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:490:4: ^( AT (sc= ID )? name= ID ACTION )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.AT, GrammarTreeVisitor.FOLLOW_AT_in_action585);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:490:11: (sc= ID )?
                let alt10 = 2;
                let LA10_0 = input.LA(1);
                if ((LA10_0 === GrammarTreeVisitor.ID)) {
                    let LA10_1 = input.LA(2);
                    if ((LA10_1 === GrammarTreeVisitor.ID)) {
                        alt10 = 1;
                    }
                }
                switch (alt10) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:490:11: sc= ID
                        {
                            sc = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_action589) as GrammarAST;
                        }
                        break;
                    }


                    default:


                }

                name = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_action594) as GrammarAST;
                ACTION7 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_action596) as GrammarAST;
                java.security.cert.CertSelector.match(input, Token.UP, null);

                this.globalNamedAction(sc, name, ACTION7 as ActionAST);
            }


            this.exitAction((retval.start as GrammarAST));

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


    // $ANTLR start "rules"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:493:1: rules : ^( RULES ( rule | lexerRule )* ) ;
    public readonly rules(): GrammarTreeVisitor.rules_return {
        let retval = new GrammarTreeVisitor.rules_return();
        retval.start = input.LT(1);

        let RULES8 = null;


        this.enterRules((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:500:5: ( ^( RULES ( rule | lexerRule )* ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:500:7: ^( RULES ( rule | lexerRule )* )
            {
                RULES8 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.RULES, GrammarTreeVisitor.FOLLOW_RULES_in_rules624) as GrammarAST;
                this.discoverRules(RULES8);
                if (input.LA(1) === Token.DOWN) {
                    java.security.cert.CertSelector.match(input, Token.DOWN, null);
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:500:40: ( rule | lexerRule )*
                    loop11:
                    while (true) {
                        let alt11 = 3;
                        let LA11_0 = input.LA(1);
                        if ((LA11_0 === GrammarTreeVisitor.RULE)) {
                            let LA11_2 = input.LA(2);
                            if ((LA11_2 === DOWN)) {
                                let LA11_3 = input.LA(3);
                                if ((LA11_3 === GrammarTreeVisitor.RULE_REF)) {
                                    alt11 = 1;
                                }
                                else {
                                    if ((LA11_3 === GrammarTreeVisitor.TOKEN_REF)) {
                                        alt11 = 2;
                                    }
                                }


                            }

                        }

                        switch (alt11) {
                            case 1: {
                                // org/antlr/v4/parse/GrammarTreeVisitor.g:500:41: rule
                                {
                                    pushFollow(GrammarTreeVisitor.FOLLOW_rule_in_rules629);
                                    this.rule();
                                    java.security.Signature.state._fsp--;

                                }
                                break;
                            }

                            case 2: {
                                // org/antlr/v4/parse/GrammarTreeVisitor.g:500:46: lexerRule
                                {
                                    pushFollow(GrammarTreeVisitor.FOLLOW_lexerRule_in_rules631);
                                    this.lexerRule();
                                    java.security.Signature.state._fsp--;

                                }
                                break;
                            }


                            default: {
                                break loop11;
                            }

                        }
                    }

                    this.finishRules(RULES8);
                    java.security.cert.CertSelector.match(input, Token.UP, null);
                }

            }


            this.exitRules((retval.start as GrammarAST));

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


    // $ANTLR start "mode"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:503:1: mode : ^( MODE ID ( lexerRule )* ) ;
    public readonly mode(): GrammarTreeVisitor.mode_return {
        let retval = new GrammarTreeVisitor.mode_return();
        retval.start = input.LT(1);

        let ID9 = null;
        let MODE10 = null;


        this.enterMode((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:510:2: ( ^( MODE ID ( lexerRule )* ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:510:4: ^( MODE ID ( lexerRule )* )
            {
                MODE10 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.MODE, GrammarTreeVisitor.FOLLOW_MODE_in_mode662) as GrammarAST;
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                ID9 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_mode664) as GrammarAST;
                this.currentModeName = (ID9 !== null ? ID9.getText() : null); this.modeDef(MODE10, ID9);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:510:64: ( lexerRule )*
                loop12:
                while (true) {
                    let alt12 = 2;
                    let LA12_0 = input.LA(1);
                    if ((LA12_0 === GrammarTreeVisitor.RULE)) {
                        alt12 = 1;
                    }

                    switch (alt12) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:510:64: lexerRule
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_lexerRule_in_mode668);
                                this.lexerRule();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            break loop12;
                        }

                    }
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitMode((retval.start as GrammarAST));

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


    // $ANTLR start "lexerRule"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:513:1: lexerRule : ^( RULE TOKEN_REF ( ^( RULEMODIFIERS m= FRAGMENT ) )? (opts= optionsSpec )* lexerRuleBlock ) ;
    public readonly lexerRule(): GrammarTreeVisitor.lexerRule_return {
        let retval = new GrammarTreeVisitor.lexerRule_return();
        retval.start = input.LT(1);

        let m = null;
        let TOKEN_REF11 = null;
        let RULE12 = null;
        let opts = null;
        let lexerRuleBlock13 = null;


        this.enterLexerRule((retval.start as GrammarAST));
        let mods = new Array<GrammarAST>();
        this.currentOuterAltNumber = 0;

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:522:2: ( ^( RULE TOKEN_REF ( ^( RULEMODIFIERS m= FRAGMENT ) )? (opts= optionsSpec )* lexerRuleBlock ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:522:4: ^( RULE TOKEN_REF ( ^( RULEMODIFIERS m= FRAGMENT ) )? (opts= optionsSpec )* lexerRuleBlock )
            {
                RULE12 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.RULE, GrammarTreeVisitor.FOLLOW_RULE_in_lexerRule694) as GrammarAST;
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                TOKEN_REF11 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.TOKEN_REF, GrammarTreeVisitor.FOLLOW_TOKEN_REF_in_lexerRule696) as GrammarAST;
                this.currentRuleName = (TOKEN_REF11 !== null ? TOKEN_REF11.getText() : null); this.currentRuleAST = RULE12;
                // org/antlr/v4/parse/GrammarTreeVisitor.g:524:4: ( ^( RULEMODIFIERS m= FRAGMENT ) )?
                let alt13 = 2;
                let LA13_0 = input.LA(1);
                if ((LA13_0 === GrammarTreeVisitor.RULEMODIFIERS)) {
                    alt13 = 1;
                }
                switch (alt13) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:524:5: ^( RULEMODIFIERS m= FRAGMENT )
                        {
                            java.security.cert.CertSelector.match(input, GrammarTreeVisitor.RULEMODIFIERS, GrammarTreeVisitor.FOLLOW_RULEMODIFIERS_in_lexerRule708);
                            java.security.cert.CertSelector.match(input, Token.DOWN, null);
                            m = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.FRAGMENT, GrammarTreeVisitor.FOLLOW_FRAGMENT_in_lexerRule712) as GrammarAST;
                            mods.add(m);
                            java.security.cert.CertSelector.match(input, Token.UP, null);

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:525:8: (opts= optionsSpec )*
                loop14:
                while (true) {
                    let alt14 = 2;
                    let LA14_0 = input.LA(1);
                    if ((LA14_0 === GrammarTreeVisitor.OPTIONS)) {
                        alt14 = 1;
                    }

                    switch (alt14) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:525:8: opts= optionsSpec
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_optionsSpec_in_lexerRule724);
                                opts = this.optionsSpec();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            break loop14;
                        }

                    }
                }

                this.discoverLexerRule(RULE12 as RuleAST, TOKEN_REF11, mods, (opts !== null ? (opts.start as GrammarAST) : null), input.LT(1) as GrammarAST);
                pushFollow(GrammarTreeVisitor.FOLLOW_lexerRuleBlock_in_lexerRule745);
                lexerRuleBlock13 = this.lexerRuleBlock();
                java.security.Signature.state._fsp--;


                this.finishLexerRule(RULE12 as RuleAST, TOKEN_REF11, (lexerRuleBlock13 !== null ? (lexerRuleBlock13.start as GrammarAST) : null));
                this.currentRuleName = null; this.currentRuleAST = null;

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitLexerRule((retval.start as GrammarAST));

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


    // $ANTLR start "rule"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:535:1: rule : ^( RULE RULE_REF ( ^( RULEMODIFIERS (m= ruleModifier )+ ) )? ( ARG_ACTION )? (ret= ruleReturns )? (thr= throwsSpec )? (loc= locals )? (opts= optionsSpec |a= ruleAction )* ruleBlock exceptionGroup ) ;
    public readonly rule(): GrammarTreeVisitor.rule_return {
        let retval = new GrammarTreeVisitor.rule_return();
        retval.start = input.LT(1);

        let RULE_REF14 = null;
        let RULE15 = null;
        let ARG_ACTION16 = null;
        let m = null;
        let ret = null;
        let thr = null;
        let loc = null;
        let opts = null;
        let a = null;
        let ruleBlock17 = null;


        this.enterRule((retval.start as GrammarAST));
        let mods = new Array<GrammarAST>();
        let actions = new Array<GrammarAST>(); // track roots
        this.currentOuterAltNumber = 0;

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:545:2: ( ^( RULE RULE_REF ( ^( RULEMODIFIERS (m= ruleModifier )+ ) )? ( ARG_ACTION )? (ret= ruleReturns )? (thr= throwsSpec )? (loc= locals )? (opts= optionsSpec |a= ruleAction )* ruleBlock exceptionGroup ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:545:6: ^( RULE RULE_REF ( ^( RULEMODIFIERS (m= ruleModifier )+ ) )? ( ARG_ACTION )? (ret= ruleReturns )? (thr= throwsSpec )? (loc= locals )? (opts= optionsSpec |a= ruleAction )* ruleBlock exceptionGroup )
            {
                RULE15 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.RULE, GrammarTreeVisitor.FOLLOW_RULE_in_rule790) as GrammarAST;
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                RULE_REF14 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.RULE_REF, GrammarTreeVisitor.FOLLOW_RULE_REF_in_rule792) as GrammarAST;
                this.currentRuleName = (RULE_REF14 !== null ? RULE_REF14.getText() : null); this.currentRuleAST = RULE15;
                // org/antlr/v4/parse/GrammarTreeVisitor.g:546:4: ( ^( RULEMODIFIERS (m= ruleModifier )+ ) )?
                let alt16 = 2;
                let LA16_0 = input.LA(1);
                if ((LA16_0 === GrammarTreeVisitor.RULEMODIFIERS)) {
                    alt16 = 1;
                }
                switch (alt16) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:546:5: ^( RULEMODIFIERS (m= ruleModifier )+ )
                        {
                            java.security.cert.CertSelector.match(input, GrammarTreeVisitor.RULEMODIFIERS, GrammarTreeVisitor.FOLLOW_RULEMODIFIERS_in_rule801);
                            java.security.cert.CertSelector.match(input, Token.DOWN, null);
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:546:21: (m= ruleModifier )+
                            let cnt15 = 0;
                            loop15:
                            while (true) {
                                let alt15 = 2;
                                let LA15_0 = input.LA(1);
                                if ((LA15_0 === GrammarTreeVisitor.FRAGMENT || (LA15_0 >= GrammarTreeVisitor.PRIVATE && LA15_0 <= GrammarTreeVisitor.PUBLIC))) {
                                    alt15 = 1;
                                }

                                switch (alt15) {
                                    case 1: {
                                        // org/antlr/v4/parse/GrammarTreeVisitor.g:546:22: m= ruleModifier
                                        {
                                            pushFollow(GrammarTreeVisitor.FOLLOW_ruleModifier_in_rule806);
                                            m = this.ruleModifier();
                                            java.security.Signature.state._fsp--;

                                            mods.add((m !== null ? (m.start as GrammarAST) : null));
                                        }
                                        break;
                                    }


                                    default: {
                                        if (cnt15 >= 1) {
                                            break loop15;
                                        }

                                        let eee = new EarlyExitException(15, input);
                                        throw eee;
                                    }

                                }
                                cnt15++;
                            }

                            java.security.cert.CertSelector.match(input, Token.UP, null);

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:547:4: ( ARG_ACTION )?
                let alt17 = 2;
                let LA17_0 = input.LA(1);
                if ((LA17_0 === GrammarTreeVisitor.ARG_ACTION)) {
                    alt17 = 1;
                }
                switch (alt17) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:547:4: ARG_ACTION
                        {
                            ARG_ACTION16 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ARG_ACTION, GrammarTreeVisitor.FOLLOW_ARG_ACTION_in_rule817) as GrammarAST;
                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:548:12: (ret= ruleReturns )?
                let alt18 = 2;
                let LA18_0 = input.LA(1);
                if ((LA18_0 === GrammarTreeVisitor.RETURNS)) {
                    alt18 = 1;
                }
                switch (alt18) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:548:12: ret= ruleReturns
                        {
                            pushFollow(GrammarTreeVisitor.FOLLOW_ruleReturns_in_rule830);
                            ret = this.ruleReturns();
                            java.security.Signature.state._fsp--;

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:549:12: (thr= throwsSpec )?
                let alt19 = 2;
                let LA19_0 = input.LA(1);
                if ((LA19_0 === GrammarTreeVisitor.THROWS)) {
                    alt19 = 1;
                }
                switch (alt19) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:549:12: thr= throwsSpec
                        {
                            pushFollow(GrammarTreeVisitor.FOLLOW_throwsSpec_in_rule843);
                            thr = this.throwsSpec();
                            java.security.Signature.state._fsp--;

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:550:12: (loc= locals )?
                let alt20 = 2;
                let LA20_0 = input.LA(1);
                if ((LA20_0 === GrammarTreeVisitor.LOCALS)) {
                    alt20 = 1;
                }
                switch (alt20) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:550:12: loc= locals
                        {
                            pushFollow(GrammarTreeVisitor.FOLLOW_locals_in_rule856);
                            loc = this.locals();
                            java.security.Signature.state._fsp--;

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:551:9: (opts= optionsSpec |a= ruleAction )*
                loop21:
                while (true) {
                    let alt21 = 3;
                    let LA21_0 = input.LA(1);
                    if ((LA21_0 === GrammarTreeVisitor.OPTIONS)) {
                        alt21 = 1;
                    }
                    else {
                        if ((LA21_0 === GrammarTreeVisitor.AT)) {
                            alt21 = 2;
                        }
                    }


                    switch (alt21) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:551:11: opts= optionsSpec
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_optionsSpec_in_rule871);
                                opts = this.optionsSpec();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }

                        case 2: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:552:11: a= ruleAction
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_ruleAction_in_rule885);
                                a = this.ruleAction();
                                java.security.Signature.state._fsp--;

                                actions.add((a !== null ? (a.start as GrammarAST) : null));
                            }
                            break;
                        }


                        default: {
                            break loop21;
                        }

                    }
                }

                this.discoverRule(RULE15 as RuleAST, RULE_REF14, mods, ARG_ACTION16 as ActionAST,
                    (ret !== null ? (ret.start as GrammarAST) : null) !== null ? (ret !== null ? (ret.start as GrammarAST) : null).getChild(0) as ActionAST : null,
                    (thr !== null ? (thr.start as GrammarAST) : null), (opts !== null ? (opts.start as GrammarAST) : null),
                    (loc !== null ? (loc.start as GrammarAST) : null) !== null ? (loc !== null ? (loc.start as GrammarAST) : null).getChild(0) as ActionAST : null,
                    actions, input.LT(1) as GrammarAST);
                pushFollow(GrammarTreeVisitor.FOLLOW_ruleBlock_in_rule916);
                ruleBlock17 = this.ruleBlock();
                java.security.Signature.state._fsp--;

                pushFollow(GrammarTreeVisitor.FOLLOW_exceptionGroup_in_rule918);
                this.exceptionGroup();
                java.security.Signature.state._fsp--;

                this.finishRule(RULE15 as RuleAST, RULE_REF14, (ruleBlock17 !== null ? (ruleBlock17.start as GrammarAST) : null)); this.currentRuleName = null; this.currentRuleAST = null;
                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitRule((retval.start as GrammarAST));

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


    // $ANTLR start "exceptionGroup"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:564:1: exceptionGroup : ( exceptionHandler )* ( finallyClause )? ;
    public readonly exceptionGroup(): GrammarTreeVisitor.exceptionGroup_return {
        let retval = new GrammarTreeVisitor.exceptionGroup_return();
        retval.start = input.LT(1);


        this.enterExceptionGroup((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:571:5: ( ( exceptionHandler )* ( finallyClause )? )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:571:7: ( exceptionHandler )* ( finallyClause )?
            {
                // org/antlr/v4/parse/GrammarTreeVisitor.g:571:7: ( exceptionHandler )*
                loop22:
                while (true) {
                    let alt22 = 2;
                    let LA22_0 = input.LA(1);
                    if ((LA22_0 === GrammarTreeVisitor.CATCH)) {
                        alt22 = 1;
                    }

                    switch (alt22) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:571:7: exceptionHandler
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_exceptionHandler_in_exceptionGroup965);
                                this.exceptionHandler();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            break loop22;
                        }

                    }
                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:571:25: ( finallyClause )?
                let alt23 = 2;
                let LA23_0 = input.LA(1);
                if ((LA23_0 === GrammarTreeVisitor.FINALLY)) {
                    alt23 = 1;
                }
                switch (alt23) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:571:25: finallyClause
                        {
                            pushFollow(GrammarTreeVisitor.FOLLOW_finallyClause_in_exceptionGroup968);
                            this.finallyClause();
                            java.security.Signature.state._fsp--;

                        }
                        break;
                    }


                    default:


                }

            }


            this.exitExceptionGroup((retval.start as GrammarAST));

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


    // $ANTLR start "exceptionHandler"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:574:1: exceptionHandler : ^( CATCH ARG_ACTION ACTION ) ;
    public readonly exceptionHandler(): GrammarTreeVisitor.exceptionHandler_return {
        let retval = new GrammarTreeVisitor.exceptionHandler_return();
        retval.start = input.LT(1);

        let ARG_ACTION18 = null;
        let ACTION19 = null;


        this.enterExceptionHandler((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:581:2: ( ^( CATCH ARG_ACTION ACTION ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:581:4: ^( CATCH ARG_ACTION ACTION )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.CATCH, GrammarTreeVisitor.FOLLOW_CATCH_in_exceptionHandler994);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                ARG_ACTION18 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ARG_ACTION, GrammarTreeVisitor.FOLLOW_ARG_ACTION_in_exceptionHandler996) as GrammarAST;
                ACTION19 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_exceptionHandler998) as GrammarAST;
                java.security.cert.CertSelector.match(input, Token.UP, null);

                this.ruleCatch(ARG_ACTION18, ACTION19 as ActionAST);
            }


            this.exitExceptionHandler((retval.start as GrammarAST));

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


    // $ANTLR start "finallyClause"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:584:1: finallyClause : ^( FINALLY ACTION ) ;
    public readonly finallyClause(): GrammarTreeVisitor.finallyClause_return {
        let retval = new GrammarTreeVisitor.finallyClause_return();
        retval.start = input.LT(1);

        let ACTION20 = null;


        this.enterFinallyClause((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:591:2: ( ^( FINALLY ACTION ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:591:4: ^( FINALLY ACTION )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.FINALLY, GrammarTreeVisitor.FOLLOW_FINALLY_in_finallyClause1023);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                ACTION20 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_finallyClause1025) as GrammarAST;
                java.security.cert.CertSelector.match(input, Token.UP, null);

                this.finallyAction(ACTION20 as ActionAST);
            }


            this.exitFinallyClause((retval.start as GrammarAST));

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


    // $ANTLR start "locals"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:594:1: locals : ^( LOCALS ARG_ACTION ) ;
    public readonly locals(): GrammarTreeVisitor.locals_return {
        let retval = new GrammarTreeVisitor.locals_return();
        retval.start = input.LT(1);


        this.enterLocals((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:601:2: ( ^( LOCALS ARG_ACTION ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:601:4: ^( LOCALS ARG_ACTION )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.LOCALS, GrammarTreeVisitor.FOLLOW_LOCALS_in_locals1053);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ARG_ACTION, GrammarTreeVisitor.FOLLOW_ARG_ACTION_in_locals1055);
                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitLocals((retval.start as GrammarAST));

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


    // $ANTLR start "ruleReturns"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:604:1: ruleReturns : ^( RETURNS ARG_ACTION ) ;
    public readonly ruleReturns(): GrammarTreeVisitor.ruleReturns_return {
        let retval = new GrammarTreeVisitor.ruleReturns_return();
        retval.start = input.LT(1);


        this.enterRuleReturns((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:611:2: ( ^( RETURNS ARG_ACTION ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:611:4: ^( RETURNS ARG_ACTION )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.RETURNS, GrammarTreeVisitor.FOLLOW_RETURNS_in_ruleReturns1078);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ARG_ACTION, GrammarTreeVisitor.FOLLOW_ARG_ACTION_in_ruleReturns1080);
                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitRuleReturns((retval.start as GrammarAST));

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


    // $ANTLR start "throwsSpec"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:614:1: throwsSpec : ^( THROWS ( ID )+ ) ;
    public readonly throwsSpec(): GrammarTreeVisitor.throwsSpec_return {
        let retval = new GrammarTreeVisitor.throwsSpec_return();
        retval.start = input.LT(1);


        this.enterThrowsSpec((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:621:5: ( ^( THROWS ( ID )+ ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:621:7: ^( THROWS ( ID )+ )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.THROWS, GrammarTreeVisitor.FOLLOW_THROWS_in_throwsSpec1106);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:621:16: ( ID )+
                let cnt24 = 0;
                loop24:
                while (true) {
                    let alt24 = 2;
                    let LA24_0 = input.LA(1);
                    if ((LA24_0 === GrammarTreeVisitor.ID)) {
                        alt24 = 1;
                    }

                    switch (alt24) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:621:16: ID
                            {
                                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_throwsSpec1108);
                            }
                            break;
                        }


                        default: {
                            if (cnt24 >= 1) {
                                break loop24;
                            }

                            let eee = new EarlyExitException(24, input);
                            throw eee;
                        }

                    }
                    cnt24++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitThrowsSpec((retval.start as GrammarAST));

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


    // $ANTLR start "ruleAction"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:624:1: ruleAction : ^( AT ID ACTION ) ;
    public readonly ruleAction(): GrammarTreeVisitor.ruleAction_return {
        let retval = new GrammarTreeVisitor.ruleAction_return();
        retval.start = input.LT(1);


        this.enterRuleAction((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:631:2: ( ^( AT ID ACTION ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:631:4: ^( AT ID ACTION )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.AT, GrammarTreeVisitor.FOLLOW_AT_in_ruleAction1135);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_ruleAction1137);
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_ruleAction1139);
                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitRuleAction((retval.start as GrammarAST));

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


    // $ANTLR start "ruleModifier"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:634:1: ruleModifier : ( PUBLIC | PRIVATE | PROTECTED | FRAGMENT );
    public readonly ruleModifier(): GrammarTreeVisitor.ruleModifier_return {
        let retval = new GrammarTreeVisitor.ruleModifier_return();
        retval.start = input.LT(1);


        this.enterRuleModifier((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:641:5: ( PUBLIC | PRIVATE | PROTECTED | FRAGMENT )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:
            {
                if (input.LA(1) === GrammarTreeVisitor.FRAGMENT || (input.LA(1) >= GrammarTreeVisitor.PRIVATE && input.LA(1) <= GrammarTreeVisitor.PUBLIC)) {
                    input.consume();
                    java.security.Signature.state.errorRecovery = false;
                }
                else {
                    let mse = new MismatchedSetException(null, input);
                    throw mse;
                }
            }


            this.exitRuleModifier((retval.start as GrammarAST));

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


    // $ANTLR start "lexerRuleBlock"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:647:1: lexerRuleBlock : ^( BLOCK ( lexerOuterAlternative )+ ) ;
    public readonly lexerRuleBlock(): GrammarTreeVisitor.lexerRuleBlock_return {
        let retval = new GrammarTreeVisitor.lexerRuleBlock_return();
        retval.start = input.LT(1);


        this.enterLexerRuleBlock((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:654:5: ( ^( BLOCK ( lexerOuterAlternative )+ ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:654:7: ^( BLOCK ( lexerOuterAlternative )+ )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.BLOCK, GrammarTreeVisitor.FOLLOW_BLOCK_in_lexerRuleBlock1217);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:655:7: ( lexerOuterAlternative )+
                let cnt25 = 0;
                loop25:
                while (true) {
                    let alt25 = 2;
                    let LA25_0 = input.LA(1);
                    if ((LA25_0 === GrammarTreeVisitor.ALT || LA25_0 === GrammarTreeVisitor.LEXER_ALT_ACTION)) {
                        alt25 = 1;
                    }

                    switch (alt25) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:655:9: lexerOuterAlternative
                            {

                                this.currentOuterAltRoot = input.LT(1) as GrammarAST;
                                this.currentOuterAltNumber++;

                                pushFollow(GrammarTreeVisitor.FOLLOW_lexerOuterAlternative_in_lexerRuleBlock1236);
                                this.lexerOuterAlternative();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt25 >= 1) {
                                break loop25;
                            }

                            let eee = new EarlyExitException(25, input);
                            throw eee;
                        }

                    }
                    cnt25++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitLexerRuleBlock((retval.start as GrammarAST));

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


    // $ANTLR start "ruleBlock"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:664:1: ruleBlock : ^( BLOCK ( outerAlternative )+ ) ;
    public readonly ruleBlock(): GrammarTreeVisitor.ruleBlock_return {
        let retval = new GrammarTreeVisitor.ruleBlock_return();
        retval.start = input.LT(1);


        this.enterRuleBlock((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:671:5: ( ^( BLOCK ( outerAlternative )+ ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:671:7: ^( BLOCK ( outerAlternative )+ )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.BLOCK, GrammarTreeVisitor.FOLLOW_BLOCK_in_ruleBlock1281);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:672:7: ( outerAlternative )+
                let cnt26 = 0;
                loop26:
                while (true) {
                    let alt26 = 2;
                    let LA26_0 = input.LA(1);
                    if ((LA26_0 === GrammarTreeVisitor.ALT)) {
                        alt26 = 1;
                    }

                    switch (alt26) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:672:9: outerAlternative
                            {

                                this.currentOuterAltRoot = input.LT(1) as GrammarAST;
                                this.currentOuterAltNumber++;

                                pushFollow(GrammarTreeVisitor.FOLLOW_outerAlternative_in_ruleBlock1300);
                                this.outerAlternative();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt26 >= 1) {
                                break loop26;
                            }

                            let eee = new EarlyExitException(26, input);
                            throw eee;
                        }

                    }
                    cnt26++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitRuleBlock((retval.start as GrammarAST));

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


    // $ANTLR start "lexerOuterAlternative"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:681:1: lexerOuterAlternative : lexerAlternative ;
    public readonly lexerOuterAlternative(): GrammarTreeVisitor.lexerOuterAlternative_return {
        let retval = new GrammarTreeVisitor.lexerOuterAlternative_return();
        retval.start = input.LT(1);


        this.enterLexerOuterAlternative((retval.start as GrammarAST) as AltAST);
        this.discoverOuterAlt((retval.start as GrammarAST) as AltAST);

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:690:2: ( lexerAlternative )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:690:4: lexerAlternative
            {
                pushFollow(GrammarTreeVisitor.FOLLOW_lexerAlternative_in_lexerOuterAlternative1340);
                this.lexerAlternative();
                java.security.Signature.state._fsp--;

            }


            this.finishOuterAlt((retval.start as GrammarAST) as AltAST);
            this.exitLexerOuterAlternative((retval.start as GrammarAST) as AltAST);

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


    // $ANTLR start "outerAlternative"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:694:1: outerAlternative : alternative ;
    public readonly outerAlternative(): GrammarTreeVisitor.outerAlternative_return {
        let retval = new GrammarTreeVisitor.outerAlternative_return();
        retval.start = input.LT(1);


        this.enterOuterAlternative((retval.start as GrammarAST) as AltAST);
        this.discoverOuterAlt((retval.start as GrammarAST) as AltAST);

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:703:2: ( alternative )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:703:4: alternative
            {
                pushFollow(GrammarTreeVisitor.FOLLOW_alternative_in_outerAlternative1362);
                this.alternative();
                java.security.Signature.state._fsp--;

            }


            this.finishOuterAlt((retval.start as GrammarAST) as AltAST);
            this.exitOuterAlternative((retval.start as GrammarAST) as AltAST);

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


    // $ANTLR start "lexerAlternative"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:706:1: lexerAlternative : ( ^( LEXER_ALT_ACTION lexerElements ( lexerCommand )+ ) | lexerElements );
    public readonly lexerAlternative(): GrammarTreeVisitor.lexerAlternative_return {
        let retval = new GrammarTreeVisitor.lexerAlternative_return();
        retval.start = input.LT(1);


        this.enterLexerAlternative((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:713:2: ( ^( LEXER_ALT_ACTION lexerElements ( lexerCommand )+ ) | lexerElements )
            let alt28 = 2;
            let LA28_0 = input.LA(1);
            if ((LA28_0 === GrammarTreeVisitor.LEXER_ALT_ACTION)) {
                alt28 = 1;
            }
            else {
                if ((LA28_0 === GrammarTreeVisitor.ALT)) {
                    alt28 = 2;
                }

                else {
                    let nvae =
                        new NoViableAltException("", 28, 0, input);
                    throw nvae;
                }
            }


            switch (alt28) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:713:4: ^( LEXER_ALT_ACTION lexerElements ( lexerCommand )+ )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.LEXER_ALT_ACTION, GrammarTreeVisitor.FOLLOW_LEXER_ALT_ACTION_in_lexerAlternative1384);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_lexerElements_in_lexerAlternative1386);
                        this.lexerElements();
                        java.security.Signature.state._fsp--;

                        // org/antlr/v4/parse/GrammarTreeVisitor.g:713:37: ( lexerCommand )+
                        let cnt27 = 0;
                        loop27:
                        while (true) {
                            let alt27 = 2;
                            let LA27_0 = input.LA(1);
                            if ((LA27_0 === GrammarTreeVisitor.ID || LA27_0 === GrammarTreeVisitor.LEXER_ACTION_CALL)) {
                                alt27 = 1;
                            }

                            switch (alt27) {
                                case 1: {
                                    // org/antlr/v4/parse/GrammarTreeVisitor.g:713:37: lexerCommand
                                    {
                                        pushFollow(GrammarTreeVisitor.FOLLOW_lexerCommand_in_lexerAlternative1388);
                                        this.lexerCommand();
                                        java.security.Signature.state._fsp--;

                                    }
                                    break;
                                }


                                default: {
                                    if (cnt27 >= 1) {
                                        break loop27;
                                    }

                                    let eee = new EarlyExitException(27, input);
                                    throw eee;
                                }

                            }
                            cnt27++;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:714:9: lexerElements
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_lexerElements_in_lexerAlternative1400);
                        this.lexerElements();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }


                default:


            }

            this.exitLexerAlternative((retval.start as GrammarAST));

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


    // $ANTLR start "lexerElements"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:717:1: lexerElements : ^( ALT ( lexerElement )+ ) ;
    public readonly lexerElements(): GrammarTreeVisitor.lexerElements_return {
        let retval = new GrammarTreeVisitor.lexerElements_return();
        retval.start = input.LT(1);


        this.enterLexerElements((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:724:5: ( ^( ALT ( lexerElement )+ ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:724:7: ^( ALT ( lexerElement )+ )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ALT, GrammarTreeVisitor.FOLLOW_ALT_in_lexerElements1428);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:724:13: ( lexerElement )+
                let cnt29 = 0;
                loop29:
                while (true) {
                    let alt29 = 2;
                    let LA29_0 = input.LA(1);
                    if ((LA29_0 === GrammarTreeVisitor.ACTION || LA29_0 === GrammarTreeVisitor.LEXER_CHAR_SET || LA29_0 === GrammarTreeVisitor.NOT || LA29_0 === GrammarTreeVisitor.RANGE || LA29_0 === GrammarTreeVisitor.RULE_REF || LA29_0 === GrammarTreeVisitor.SEMPRED || LA29_0 === GrammarTreeVisitor.STRING_LITERAL || LA29_0 === GrammarTreeVisitor.TOKEN_REF || (LA29_0 >= GrammarTreeVisitor.BLOCK && LA29_0 <= GrammarTreeVisitor.CLOSURE) || LA29_0 === GrammarTreeVisitor.EPSILON || (LA29_0 >= GrammarTreeVisitor.OPTIONAL && LA29_0 <= GrammarTreeVisitor.POSITIVE_CLOSURE) || (LA29_0 >= GrammarTreeVisitor.SET && LA29_0 <= GrammarTreeVisitor.WILDCARD))) {
                        alt29 = 1;
                    }

                    switch (alt29) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:724:13: lexerElement
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_lexerElement_in_lexerElements1430);
                                this.lexerElement();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt29 >= 1) {
                                break loop29;
                            }

                            let eee = new EarlyExitException(29, input);
                            throw eee;
                        }

                    }
                    cnt29++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitLexerElements((retval.start as GrammarAST));

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


    // $ANTLR start "lexerElement"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:727:1: lexerElement : ( lexerAtom | lexerSubrule | ACTION | SEMPRED | ^( ACTION elementOptions ) | ^( SEMPRED elementOptions ) | EPSILON );
    public readonly lexerElement(): GrammarTreeVisitor.lexerElement_return {
        let retval = new GrammarTreeVisitor.lexerElement_return();
        retval.start = input.LT(1);

        let ACTION21 = null;
        let SEMPRED22 = null;
        let ACTION23 = null;
        let SEMPRED24 = null;


        this.enterLexerElement((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:734:2: ( lexerAtom | lexerSubrule | ACTION | SEMPRED | ^( ACTION elementOptions ) | ^( SEMPRED elementOptions ) | EPSILON )
            let alt30 = 7;
            switch (input.LA(1)) {
                case LEXER_CHAR_SET:
                case NOT:
                case RANGE:
                case RULE_REF:
                case STRING_LITERAL:
                case TOKEN_REF:
                case SET:
                case WILDCARD: {
                    {
                        alt30 = 1;
                    }
                    break;
                }

                case BLOCK:
                case CLOSURE:
                case javax.security.auth.login.AppConfigurationEntry.LoginModuleControlFlag.OPTIONAL:
                case POSITIVE_CLOSURE: {
                    {
                        alt30 = 2;
                    }
                    break;
                }

                case ACTION: {
                    {
                        let LA30_3 = input.LA(2);
                        if ((LA30_3 === DOWN)) {
                            alt30 = 5;
                        }
                        else {
                            if (((LA30_3 >= UP && LA30_3 <= GrammarTreeVisitor.ACTION) || LA30_3 === GrammarTreeVisitor.LEXER_CHAR_SET || LA30_3 === GrammarTreeVisitor.NOT || LA30_3 === GrammarTreeVisitor.RANGE || LA30_3 === GrammarTreeVisitor.RULE_REF || LA30_3 === GrammarTreeVisitor.SEMPRED || LA30_3 === GrammarTreeVisitor.STRING_LITERAL || LA30_3 === GrammarTreeVisitor.TOKEN_REF || (LA30_3 >= GrammarTreeVisitor.BLOCK && LA30_3 <= GrammarTreeVisitor.CLOSURE) || LA30_3 === GrammarTreeVisitor.EPSILON || (LA30_3 >= GrammarTreeVisitor.OPTIONAL && LA30_3 <= GrammarTreeVisitor.POSITIVE_CLOSURE) || (LA30_3 >= GrammarTreeVisitor.SET && LA30_3 <= GrammarTreeVisitor.WILDCARD))) {
                                alt30 = 3;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 30, 3, input);
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
                        let LA30_4 = input.LA(2);
                        if ((LA30_4 === DOWN)) {
                            alt30 = 6;
                        }
                        else {
                            if (((LA30_4 >= UP && LA30_4 <= GrammarTreeVisitor.ACTION) || LA30_4 === GrammarTreeVisitor.LEXER_CHAR_SET || LA30_4 === GrammarTreeVisitor.NOT || LA30_4 === GrammarTreeVisitor.RANGE || LA30_4 === GrammarTreeVisitor.RULE_REF || LA30_4 === GrammarTreeVisitor.SEMPRED || LA30_4 === GrammarTreeVisitor.STRING_LITERAL || LA30_4 === GrammarTreeVisitor.TOKEN_REF || (LA30_4 >= GrammarTreeVisitor.BLOCK && LA30_4 <= GrammarTreeVisitor.CLOSURE) || LA30_4 === GrammarTreeVisitor.EPSILON || (LA30_4 >= GrammarTreeVisitor.OPTIONAL && LA30_4 <= GrammarTreeVisitor.POSITIVE_CLOSURE) || (LA30_4 >= GrammarTreeVisitor.SET && LA30_4 <= GrammarTreeVisitor.WILDCARD))) {
                                alt30 = 4;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 30, 4, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }


                    }
                    break;
                }

                case EPSILON: {
                    {
                        alt30 = 7;
                    }
                    break;
                }

                default: {
                    let nvae =
                        new NoViableAltException("", 30, 0, input);
                    throw nvae;
                }

            }
            switch (alt30) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:734:4: lexerAtom
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_lexerAtom_in_lexerElement1456);
                        this.lexerAtom();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:735:4: lexerSubrule
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_lexerSubrule_in_lexerElement1461);
                        this.lexerSubrule();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:736:6: ACTION
                    {
                        ACTION21 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_lexerElement1468) as GrammarAST;
                        this.actionInAlt(ACTION21 as ActionAST);
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:737:6: SEMPRED
                    {
                        SEMPRED22 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.SEMPRED, GrammarTreeVisitor.FOLLOW_SEMPRED_in_lexerElement1482) as GrammarAST;
                        this.sempredInAlt(SEMPRED22 as PredAST);
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:738:6: ^( ACTION elementOptions )
                    {
                        ACTION23 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_lexerElement1497) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_lexerElement1499);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                        this.actionInAlt(ACTION23 as ActionAST);
                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:739:6: ^( SEMPRED elementOptions )
                    {
                        SEMPRED24 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.SEMPRED, GrammarTreeVisitor.FOLLOW_SEMPRED_in_lexerElement1510) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_lexerElement1512);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                        this.sempredInAlt(SEMPRED24 as PredAST);
                    }
                    break;
                }

                case 7: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:740:4: EPSILON
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.EPSILON, GrammarTreeVisitor.FOLLOW_EPSILON_in_lexerElement1520);
                    }
                    break;
                }


                default:


            }

            this.exitLexerElement((retval.start as GrammarAST));

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


    // $ANTLR start "lexerBlock"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:743:1: lexerBlock : ^( BLOCK ( optionsSpec )? ( lexerAlternative )+ ) ;
    public readonly lexerBlock(): GrammarTreeVisitor.lexerBlock_return {
        let retval = new GrammarTreeVisitor.lexerBlock_return();
        retval.start = input.LT(1);


        this.enterLexerBlock((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:750:3: ( ^( BLOCK ( optionsSpec )? ( lexerAlternative )+ ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:750:5: ^( BLOCK ( optionsSpec )? ( lexerAlternative )+ )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.BLOCK, GrammarTreeVisitor.FOLLOW_BLOCK_in_lexerBlock1543);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:750:13: ( optionsSpec )?
                let alt31 = 2;
                let LA31_0 = input.LA(1);
                if ((LA31_0 === GrammarTreeVisitor.OPTIONS)) {
                    alt31 = 1;
                }
                switch (alt31) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:750:13: optionsSpec
                        {
                            pushFollow(GrammarTreeVisitor.FOLLOW_optionsSpec_in_lexerBlock1545);
                            this.optionsSpec();
                            java.security.Signature.state._fsp--;

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:750:26: ( lexerAlternative )+
                let cnt32 = 0;
                loop32:
                while (true) {
                    let alt32 = 2;
                    let LA32_0 = input.LA(1);
                    if ((LA32_0 === GrammarTreeVisitor.ALT || LA32_0 === GrammarTreeVisitor.LEXER_ALT_ACTION)) {
                        alt32 = 1;
                    }

                    switch (alt32) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:750:26: lexerAlternative
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_lexerAlternative_in_lexerBlock1548);
                                this.lexerAlternative();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt32 >= 1) {
                                break loop32;
                            }

                            let eee = new EarlyExitException(32, input);
                            throw eee;
                        }

                    }
                    cnt32++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitLexerBlock((retval.start as GrammarAST));

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


    // $ANTLR start "lexerAtom"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:753:1: lexerAtom : ( terminal | ^( NOT blockSet ) | blockSet | ^( WILDCARD elementOptions ) | WILDCARD | LEXER_CHAR_SET | range | ruleref );
    public readonly lexerAtom(): GrammarTreeVisitor.lexerAtom_return {
        let retval = new GrammarTreeVisitor.lexerAtom_return();
        retval.start = input.LT(1);


        this.enterLexerAtom((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:760:5: ( terminal | ^( NOT blockSet ) | blockSet | ^( WILDCARD elementOptions ) | WILDCARD | LEXER_CHAR_SET | range | ruleref )
            let alt33 = 8;
            switch (input.LA(1)) {
                case STRING_LITERAL:
                case TOKEN_REF: {
                    {
                        alt33 = 1;
                    }
                    break;
                }

                case NOT: {
                    {
                        alt33 = 2;
                    }
                    break;
                }

                case SET: {
                    {
                        alt33 = 3;
                    }
                    break;
                }

                case WILDCARD: {
                    {
                        let LA33_4 = input.LA(2);
                        if ((LA33_4 === DOWN)) {
                            alt33 = 4;
                        }
                        else {
                            if (((LA33_4 >= UP && LA33_4 <= GrammarTreeVisitor.ACTION) || LA33_4 === GrammarTreeVisitor.LEXER_CHAR_SET || LA33_4 === GrammarTreeVisitor.NOT || LA33_4 === GrammarTreeVisitor.RANGE || LA33_4 === GrammarTreeVisitor.RULE_REF || LA33_4 === GrammarTreeVisitor.SEMPRED || LA33_4 === GrammarTreeVisitor.STRING_LITERAL || LA33_4 === GrammarTreeVisitor.TOKEN_REF || (LA33_4 >= GrammarTreeVisitor.BLOCK && LA33_4 <= GrammarTreeVisitor.CLOSURE) || LA33_4 === GrammarTreeVisitor.EPSILON || (LA33_4 >= GrammarTreeVisitor.OPTIONAL && LA33_4 <= GrammarTreeVisitor.POSITIVE_CLOSURE) || (LA33_4 >= GrammarTreeVisitor.SET && LA33_4 <= GrammarTreeVisitor.WILDCARD))) {
                                alt33 = 5;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 33, 4, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }


                    }
                    break;
                }

                case LEXER_CHAR_SET: {
                    {
                        alt33 = 6;
                    }
                    break;
                }

                case RANGE: {
                    {
                        alt33 = 7;
                    }
                    break;
                }

                case RULE_REF: {
                    {
                        alt33 = 8;
                    }
                    break;
                }

                default: {
                    let nvae =
                        new NoViableAltException("", 33, 0, input);
                    throw nvae;
                }

            }
            switch (alt33) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:760:9: terminal
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_terminal_in_lexerAtom1579);
                        this.terminal();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:761:9: ^( NOT blockSet )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.NOT, GrammarTreeVisitor.FOLLOW_NOT_in_lexerAtom1590);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_blockSet_in_lexerAtom1592);
                        this.blockSet();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:762:9: blockSet
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_blockSet_in_lexerAtom1603);
                        this.blockSet();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:763:9: ^( WILDCARD elementOptions )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.WILDCARD, GrammarTreeVisitor.FOLLOW_WILDCARD_in_lexerAtom1614);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_lexerAtom1616);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:764:9: WILDCARD
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.WILDCARD, GrammarTreeVisitor.FOLLOW_WILDCARD_in_lexerAtom1627);
                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:765:7: LEXER_CHAR_SET
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.LEXER_CHAR_SET, GrammarTreeVisitor.FOLLOW_LEXER_CHAR_SET_in_lexerAtom1635);
                    }
                    break;
                }

                case 7: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:766:9: range
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_range_in_lexerAtom1645);
                        this.range();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 8: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:767:9: ruleref
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_ruleref_in_lexerAtom1655);
                        this.ruleref();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }


                default:


            }

            this.exitLexerAtom((retval.start as GrammarAST));

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


    // $ANTLR start "actionElement"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:770:1: actionElement : ( ACTION | ^( ACTION elementOptions ) | SEMPRED | ^( SEMPRED elementOptions ) );
    public readonly actionElement(): GrammarTreeVisitor.actionElement_return {
        let retval = new GrammarTreeVisitor.actionElement_return();
        retval.start = input.LT(1);


        this.enterActionElement((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:777:2: ( ACTION | ^( ACTION elementOptions ) | SEMPRED | ^( SEMPRED elementOptions ) )
            let alt34 = 4;
            let LA34_0 = input.LA(1);
            if ((LA34_0 === GrammarTreeVisitor.ACTION)) {
                let LA34_1 = input.LA(2);
                if ((LA34_1 === DOWN)) {
                    alt34 = 2;
                }
                else {
                    if ((LA34_1 === GrammarTreeVisitor.EOF)) {
                        alt34 = 1;
                    }

                    else {
                        let nvaeMark = input.mark();
                        try {
                            input.consume();
                            let nvae =
                                new NoViableAltException("", 34, 1, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }
                }


            }
            else {
                if ((LA34_0 === GrammarTreeVisitor.SEMPRED)) {
                    let LA34_2 = input.LA(2);
                    if ((LA34_2 === DOWN)) {
                        alt34 = 4;
                    }
                    else {
                        if ((LA34_2 === GrammarTreeVisitor.EOF)) {
                            alt34 = 3;
                        }

                        else {
                            let nvaeMark = input.mark();
                            try {
                                input.consume();
                                let nvae =
                                    new NoViableAltException("", 34, 2, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }
                    }


                }

                else {
                    let nvae =
                        new NoViableAltException("", 34, 0, input);
                    throw nvae;
                }
            }


            switch (alt34) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:777:4: ACTION
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_actionElement1679);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:778:6: ^( ACTION elementOptions )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_actionElement1687);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_actionElement1689);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:779:6: SEMPRED
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.SEMPRED, GrammarTreeVisitor.FOLLOW_SEMPRED_in_actionElement1697);
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:780:6: ^( SEMPRED elementOptions )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.SEMPRED, GrammarTreeVisitor.FOLLOW_SEMPRED_in_actionElement1705);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_actionElement1707);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }


                default:


            }

            this.exitActionElement((retval.start as GrammarAST));

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


    // $ANTLR start "alternative"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:783:1: alternative : ( ^( ALT ( elementOptions )? ( element )+ ) | ^( ALT ( elementOptions )? EPSILON ) );
    public readonly alternative(): GrammarTreeVisitor.alternative_return {
        let retval = new GrammarTreeVisitor.alternative_return();
        retval.start = input.LT(1);


        this.enterAlternative((retval.start as GrammarAST) as AltAST);
        this.discoverAlt((retval.start as GrammarAST) as AltAST);

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:792:2: ( ^( ALT ( elementOptions )? ( element )+ ) | ^( ALT ( elementOptions )? EPSILON ) )
            let alt38 = 2;
            alt38 = this.dfa38.predict(input);
            switch (alt38) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:792:4: ^( ALT ( elementOptions )? ( element )+ )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ALT, GrammarTreeVisitor.FOLLOW_ALT_in_alternative1730);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:792:10: ( elementOptions )?
                        let alt35 = 2;
                        let LA35_0 = input.LA(1);
                        if ((LA35_0 === GrammarTreeVisitor.ELEMENT_OPTIONS)) {
                            alt35 = 1;
                        }
                        switch (alt35) {
                            case 1: {
                                // org/antlr/v4/parse/GrammarTreeVisitor.g:792:10: elementOptions
                                {
                                    pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_alternative1732);
                                    this.elementOptions();
                                    java.security.Signature.state._fsp--;

                                }
                                break;
                            }


                            default:


                        }

                        // org/antlr/v4/parse/GrammarTreeVisitor.g:792:26: ( element )+
                        let cnt36 = 0;
                        loop36:
                        while (true) {
                            let alt36 = 2;
                            let LA36_0 = input.LA(1);
                            if ((LA36_0 === GrammarTreeVisitor.ACTION || LA36_0 === GrammarTreeVisitor.ASSIGN || LA36_0 === GrammarTreeVisitor.DOT || LA36_0 === GrammarTreeVisitor.NOT || LA36_0 === GrammarTreeVisitor.PLUS_ASSIGN || LA36_0 === GrammarTreeVisitor.RANGE || LA36_0 === GrammarTreeVisitor.RULE_REF || LA36_0 === GrammarTreeVisitor.SEMPRED || LA36_0 === GrammarTreeVisitor.STRING_LITERAL || LA36_0 === GrammarTreeVisitor.TOKEN_REF || (LA36_0 >= GrammarTreeVisitor.BLOCK && LA36_0 <= GrammarTreeVisitor.CLOSURE) || (LA36_0 >= GrammarTreeVisitor.OPTIONAL && LA36_0 <= GrammarTreeVisitor.POSITIVE_CLOSURE) || (LA36_0 >= GrammarTreeVisitor.SET && LA36_0 <= GrammarTreeVisitor.WILDCARD))) {
                                alt36 = 1;
                            }

                            switch (alt36) {
                                case 1: {
                                    // org/antlr/v4/parse/GrammarTreeVisitor.g:792:26: element
                                    {
                                        pushFollow(GrammarTreeVisitor.FOLLOW_element_in_alternative1735);
                                        this.element();
                                        java.security.Signature.state._fsp--;

                                    }
                                    break;
                                }


                                default: {
                                    if (cnt36 >= 1) {
                                        break loop36;
                                    }

                                    let eee = new EarlyExitException(36, input);
                                    throw eee;
                                }

                            }
                            cnt36++;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:793:4: ^( ALT ( elementOptions )? EPSILON )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ALT, GrammarTreeVisitor.FOLLOW_ALT_in_alternative1743);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:793:10: ( elementOptions )?
                        let alt37 = 2;
                        let LA37_0 = input.LA(1);
                        if ((LA37_0 === GrammarTreeVisitor.ELEMENT_OPTIONS)) {
                            alt37 = 1;
                        }
                        switch (alt37) {
                            case 1: {
                                // org/antlr/v4/parse/GrammarTreeVisitor.g:793:10: elementOptions
                                {
                                    pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_alternative1745);
                                    this.elementOptions();
                                    java.security.Signature.state._fsp--;

                                }
                                break;
                            }


                            default:


                        }

                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.EPSILON, GrammarTreeVisitor.FOLLOW_EPSILON_in_alternative1748);
                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }


                default:


            }

            this.finishAlt((retval.start as GrammarAST) as AltAST);
            this.exitAlternative((retval.start as GrammarAST) as AltAST);

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


    // $ANTLR start "lexerCommandExpr"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:809:1: lexerCommandExpr : ( ID | INT );
    public readonly lexerCommandExpr(): GrammarTreeVisitor.lexerCommandExpr_return {
        let retval = new GrammarTreeVisitor.lexerCommandExpr_return();
        retval.start = input.LT(1);


        this.enterLexerCommandExpr((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:816:2: ( ID | INT )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:
            {
                if (input.LA(1) === GrammarTreeVisitor.ID || input.LA(1) === GrammarTreeVisitor.INT) {
                    input.consume();
                    java.security.Signature.state.errorRecovery = false;
                }
                else {
                    let mse = new MismatchedSetException(null, input);
                    throw mse;
                }
            }


            this.exitLexerCommandExpr((retval.start as GrammarAST));

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


    // $ANTLR start "element"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:820:1: element : ( labeledElement | atom | subrule | ACTION | SEMPRED | ^( ACTION elementOptions ) | ^( SEMPRED elementOptions ) | range | ^( NOT blockSet ) | ^( NOT block ) );
    public readonly element(): GrammarTreeVisitor.element_return {
        let retval = new GrammarTreeVisitor.element_return();
        retval.start = input.LT(1);

        let ACTION28 = null;
        let SEMPRED29 = null;
        let ACTION30 = null;
        let SEMPRED31 = null;


        this.enterElement((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:827:2: ( labeledElement | atom | subrule | ACTION | SEMPRED | ^( ACTION elementOptions ) | ^( SEMPRED elementOptions ) | range | ^( NOT blockSet ) | ^( NOT block ) )
            let alt40 = 10;
            switch (input.LA(1)) {
                case ASSIGN:
                case PLUS_ASSIGN: {
                    {
                        alt40 = 1;
                    }
                    break;
                }

                case DOT:
                case RULE_REF:
                case STRING_LITERAL:
                case TOKEN_REF:
                case SET:
                case WILDCARD: {
                    {
                        alt40 = 2;
                    }
                    break;
                }

                case BLOCK:
                case CLOSURE:
                case javax.security.auth.login.AppConfigurationEntry.LoginModuleControlFlag.OPTIONAL:
                case POSITIVE_CLOSURE: {
                    {
                        alt40 = 3;
                    }
                    break;
                }

                case ACTION: {
                    {
                        let LA40_4 = input.LA(2);
                        if ((LA40_4 === DOWN)) {
                            alt40 = 6;
                        }
                        else {
                            if (((LA40_4 >= UP && LA40_4 <= GrammarTreeVisitor.ACTION) || LA40_4 === GrammarTreeVisitor.ASSIGN || LA40_4 === GrammarTreeVisitor.DOT || LA40_4 === GrammarTreeVisitor.NOT || LA40_4 === GrammarTreeVisitor.PLUS_ASSIGN || LA40_4 === GrammarTreeVisitor.RANGE || LA40_4 === GrammarTreeVisitor.RULE_REF || LA40_4 === GrammarTreeVisitor.SEMPRED || LA40_4 === GrammarTreeVisitor.STRING_LITERAL || LA40_4 === GrammarTreeVisitor.TOKEN_REF || (LA40_4 >= GrammarTreeVisitor.BLOCK && LA40_4 <= GrammarTreeVisitor.CLOSURE) || (LA40_4 >= GrammarTreeVisitor.OPTIONAL && LA40_4 <= GrammarTreeVisitor.POSITIVE_CLOSURE) || (LA40_4 >= GrammarTreeVisitor.SET && LA40_4 <= GrammarTreeVisitor.WILDCARD))) {
                                alt40 = 4;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 40, 4, input);
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
                        let LA40_5 = input.LA(2);
                        if ((LA40_5 === DOWN)) {
                            alt40 = 7;
                        }
                        else {
                            if (((LA40_5 >= UP && LA40_5 <= GrammarTreeVisitor.ACTION) || LA40_5 === GrammarTreeVisitor.ASSIGN || LA40_5 === GrammarTreeVisitor.DOT || LA40_5 === GrammarTreeVisitor.NOT || LA40_5 === GrammarTreeVisitor.PLUS_ASSIGN || LA40_5 === GrammarTreeVisitor.RANGE || LA40_5 === GrammarTreeVisitor.RULE_REF || LA40_5 === GrammarTreeVisitor.SEMPRED || LA40_5 === GrammarTreeVisitor.STRING_LITERAL || LA40_5 === GrammarTreeVisitor.TOKEN_REF || (LA40_5 >= GrammarTreeVisitor.BLOCK && LA40_5 <= GrammarTreeVisitor.CLOSURE) || (LA40_5 >= GrammarTreeVisitor.OPTIONAL && LA40_5 <= GrammarTreeVisitor.POSITIVE_CLOSURE) || (LA40_5 >= GrammarTreeVisitor.SET && LA40_5 <= GrammarTreeVisitor.WILDCARD))) {
                                alt40 = 5;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 40, 5, input);
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
                        alt40 = 8;
                    }
                    break;
                }

                case NOT: {
                    {
                        let LA40_7 = input.LA(2);
                        if ((LA40_7 === DOWN)) {
                            let LA40_12 = input.LA(3);
                            if ((LA40_12 === GrammarTreeVisitor.SET)) {
                                alt40 = 9;
                            }
                            else {
                                if ((LA40_12 === GrammarTreeVisitor.BLOCK)) {
                                    alt40 = 10;
                                }

                                else {
                                    let nvaeMark = input.mark();
                                    try {
                                        for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                            input.consume();
                                        }
                                        let nvae =
                                            new NoViableAltException("", 40, 12, input);
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
                                input.consume();
                                let nvae =
                                    new NoViableAltException("", 40, 7, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }

                    }
                    break;
                }

                default: {
                    let nvae =
                        new NoViableAltException("", 40, 0, input);
                    throw nvae;
                }

            }
            switch (alt40) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:827:4: labeledElement
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_labeledElement_in_element1851);
                        this.labeledElement();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:828:4: atom
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_atom_in_element1856);
                        this.atom();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:829:4: subrule
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_subrule_in_element1861);
                        this.subrule();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:830:6: ACTION
                    {
                        ACTION28 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_element1868) as GrammarAST;
                        this.actionInAlt(ACTION28 as ActionAST);
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:831:6: SEMPRED
                    {
                        SEMPRED29 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.SEMPRED, GrammarTreeVisitor.FOLLOW_SEMPRED_in_element1882) as GrammarAST;
                        this.sempredInAlt(SEMPRED29 as PredAST);
                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:832:6: ^( ACTION elementOptions )
                    {
                        ACTION30 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_element1897) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_element1899);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                        this.actionInAlt(ACTION30 as ActionAST);
                    }
                    break;
                }

                case 7: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:833:6: ^( SEMPRED elementOptions )
                    {
                        SEMPRED31 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.SEMPRED, GrammarTreeVisitor.FOLLOW_SEMPRED_in_element1910) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_element1912);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                        this.sempredInAlt(SEMPRED31 as PredAST);
                    }
                    break;
                }

                case 8: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:834:4: range
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_range_in_element1920);
                        this.range();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 9: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:835:4: ^( NOT blockSet )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.NOT, GrammarTreeVisitor.FOLLOW_NOT_in_element1926);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_blockSet_in_element1928);
                        this.blockSet();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 10: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:836:4: ^( NOT block )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.NOT, GrammarTreeVisitor.FOLLOW_NOT_in_element1935);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_block_in_element1937);
                        this.block();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }


                default:


            }

            this.exitElement((retval.start as GrammarAST));

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


    // $ANTLR start "astOperand"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:839:1: astOperand : ( atom | ^( NOT blockSet ) | ^( NOT block ) );
    public readonly astOperand(): GrammarTreeVisitor.astOperand_return {
        let retval = new GrammarTreeVisitor.astOperand_return();
        retval.start = input.LT(1);


        this.enterAstOperand((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:846:2: ( atom | ^( NOT blockSet ) | ^( NOT block ) )
            let alt41 = 3;
            let LA41_0 = input.LA(1);
            if ((LA41_0 === GrammarTreeVisitor.DOT || LA41_0 === GrammarTreeVisitor.RULE_REF || LA41_0 === GrammarTreeVisitor.STRING_LITERAL || LA41_0 === GrammarTreeVisitor.TOKEN_REF || (LA41_0 >= GrammarTreeVisitor.SET && LA41_0 <= GrammarTreeVisitor.WILDCARD))) {
                alt41 = 1;
            }
            else {
                if ((LA41_0 === GrammarTreeVisitor.NOT)) {
                    let LA41_2 = input.LA(2);
                    if ((LA41_2 === DOWN)) {
                        let LA41_3 = input.LA(3);
                        if ((LA41_3 === GrammarTreeVisitor.SET)) {
                            alt41 = 2;
                        }
                        else {
                            if ((LA41_3 === GrammarTreeVisitor.BLOCK)) {
                                alt41 = 3;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                        input.consume();
                                    }
                                    let nvae =
                                        new NoViableAltException("", 41, 3, input);
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
                            input.consume();
                            let nvae =
                                new NoViableAltException("", 41, 2, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }

                }

                else {
                    let nvae =
                        new NoViableAltException("", 41, 0, input);
                    throw nvae;
                }
            }


            switch (alt41) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:846:4: atom
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_atom_in_astOperand1959);
                        this.atom();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:847:4: ^( NOT blockSet )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.NOT, GrammarTreeVisitor.FOLLOW_NOT_in_astOperand1965);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_blockSet_in_astOperand1967);
                        this.blockSet();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:848:4: ^( NOT block )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.NOT, GrammarTreeVisitor.FOLLOW_NOT_in_astOperand1974);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_block_in_astOperand1976);
                        this.block();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }


                default:


            }

            this.exitAstOperand((retval.start as GrammarAST));

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


    // $ANTLR start "labeledElement"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:851:1: labeledElement : ^( ( ASSIGN | PLUS_ASSIGN ) ID element ) ;
    public readonly labeledElement(): GrammarTreeVisitor.labeledElement_return {
        let retval = new GrammarTreeVisitor.labeledElement_return();
        retval.start = input.LT(1);

        let ID32 = null;
        let element33 = null;


        this.enterLabeledElement((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:858:2: ( ^( ( ASSIGN | PLUS_ASSIGN ) ID element ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:858:4: ^( ( ASSIGN | PLUS_ASSIGN ) ID element )
            {
                if (input.LA(1) === GrammarTreeVisitor.ASSIGN || input.LA(1) === GrammarTreeVisitor.PLUS_ASSIGN) {
                    input.consume();
                    java.security.Signature.state.errorRecovery = false;
                }
                else {
                    let mse = new MismatchedSetException(null, input);
                    throw mse;
                }
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                ID32 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_labeledElement2005) as GrammarAST;
                pushFollow(GrammarTreeVisitor.FOLLOW_element_in_labeledElement2007);
                element33 = this.element();
                java.security.Signature.state._fsp--;

                java.security.cert.CertSelector.match(input, Token.UP, null);

                this.label((retval.start as GrammarAST), ID32, (element33 !== null ? (element33.start as GrammarAST) : null));
            }


            this.exitLabeledElement((retval.start as GrammarAST));

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


    // $ANTLR start "subrule"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:861:1: subrule : ( ^( blockSuffix block ) | block );
    public readonly subrule(): GrammarTreeVisitor.subrule_return {
        let retval = new GrammarTreeVisitor.subrule_return();
        retval.start = input.LT(1);


        this.enterSubrule((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:868:2: ( ^( blockSuffix block ) | block )
            let alt42 = 2;
            let LA42_0 = input.LA(1);
            if ((LA42_0 === GrammarTreeVisitor.CLOSURE || (LA42_0 >= GrammarTreeVisitor.OPTIONAL && LA42_0 <= GrammarTreeVisitor.POSITIVE_CLOSURE))) {
                alt42 = 1;
            }
            else {
                if ((LA42_0 === GrammarTreeVisitor.BLOCK)) {
                    alt42 = 2;
                }

                else {
                    let nvae =
                        new NoViableAltException("", 42, 0, input);
                    throw nvae;
                }
            }


            switch (alt42) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:868:4: ^( blockSuffix block )
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_blockSuffix_in_subrule2032);
                        this.blockSuffix();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_block_in_subrule2034);
                        this.block();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:869:5: block
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_block_in_subrule2041);
                        this.block();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }


                default:


            }

            this.exitSubrule((retval.start as GrammarAST));

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


    // $ANTLR start "lexerSubrule"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:872:1: lexerSubrule : ( ^( blockSuffix lexerBlock ) | lexerBlock );
    public readonly lexerSubrule(): GrammarTreeVisitor.lexerSubrule_return {
        let retval = new GrammarTreeVisitor.lexerSubrule_return();
        retval.start = input.LT(1);


        this.enterLexerSubrule((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:879:2: ( ^( blockSuffix lexerBlock ) | lexerBlock )
            let alt43 = 2;
            let LA43_0 = input.LA(1);
            if ((LA43_0 === GrammarTreeVisitor.CLOSURE || (LA43_0 >= GrammarTreeVisitor.OPTIONAL && LA43_0 <= GrammarTreeVisitor.POSITIVE_CLOSURE))) {
                alt43 = 1;
            }
            else {
                if ((LA43_0 === GrammarTreeVisitor.BLOCK)) {
                    alt43 = 2;
                }

                else {
                    let nvae =
                        new NoViableAltException("", 43, 0, input);
                    throw nvae;
                }
            }


            switch (alt43) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:879:4: ^( blockSuffix lexerBlock )
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_blockSuffix_in_lexerSubrule2066);
                        this.blockSuffix();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_lexerBlock_in_lexerSubrule2068);
                        this.lexerBlock();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:880:5: lexerBlock
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_lexerBlock_in_lexerSubrule2075);
                        this.lexerBlock();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }


                default:


            }

            this.exitLexerSubrule((retval.start as GrammarAST));

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


    // $ANTLR start "blockSuffix"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:883:1: blockSuffix : ebnfSuffix ;
    public readonly blockSuffix(): GrammarTreeVisitor.blockSuffix_return {
        let retval = new GrammarTreeVisitor.blockSuffix_return();
        retval.start = input.LT(1);


        this.enterBlockSuffix((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:890:5: ( ebnfSuffix )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:890:7: ebnfSuffix
            {
                pushFollow(GrammarTreeVisitor.FOLLOW_ebnfSuffix_in_blockSuffix2102);
                this.ebnfSuffix();
                java.security.Signature.state._fsp--;

            }


            this.exitBlockSuffix((retval.start as GrammarAST));

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


    // $ANTLR start "ebnfSuffix"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:893:1: ebnfSuffix : ( OPTIONAL | CLOSURE | POSITIVE_CLOSURE );
    public readonly ebnfSuffix(): GrammarTreeVisitor.ebnfSuffix_return {
        let retval = new GrammarTreeVisitor.ebnfSuffix_return();
        retval.start = input.LT(1);


        this.enterEbnfSuffix((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:900:2: ( OPTIONAL | CLOSURE | POSITIVE_CLOSURE )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:
            {
                if (input.LA(1) === GrammarTreeVisitor.CLOSURE || (input.LA(1) >= GrammarTreeVisitor.OPTIONAL && input.LA(1) <= GrammarTreeVisitor.POSITIVE_CLOSURE)) {
                    input.consume();
                    java.security.Signature.state.errorRecovery = false;
                }
                else {
                    let mse = new MismatchedSetException(null, input);
                    throw mse;
                }
            }


            this.exitEbnfSuffix((retval.start as GrammarAST));

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


    // $ANTLR start "atom"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:905:1: atom : ( ^( DOT ID terminal ) | ^( DOT ID ruleref ) | ^( WILDCARD elementOptions ) | WILDCARD | terminal | blockSet | ruleref );
    public readonly atom(): GrammarTreeVisitor.atom_return {
        let retval = new GrammarTreeVisitor.atom_return();
        retval.start = input.LT(1);

        let WILDCARD34 = null;
        let WILDCARD35 = null;


        this.enterAtom((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:912:2: ( ^( DOT ID terminal ) | ^( DOT ID ruleref ) | ^( WILDCARD elementOptions ) | WILDCARD | terminal | blockSet | ruleref )
            let alt44 = 7;
            switch (input.LA(1)) {
                case DOT: {
                    {
                        let LA44_1 = input.LA(2);
                        if ((LA44_1 === DOWN)) {
                            let LA44_6 = input.LA(3);
                            if ((LA44_6 === GrammarTreeVisitor.ID)) {
                                let LA44_9 = input.LA(4);
                                if ((LA44_9 === GrammarTreeVisitor.STRING_LITERAL || LA44_9 === GrammarTreeVisitor.TOKEN_REF)) {
                                    alt44 = 1;
                                }
                                else {
                                    if ((LA44_9 === GrammarTreeVisitor.RULE_REF)) {
                                        alt44 = 2;
                                    }

                                    else {
                                        let nvaeMark = input.mark();
                                        try {
                                            for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                                input.consume();
                                            }
                                            let nvae =
                                                new NoViableAltException("", 44, 9, input);
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
                                        new NoViableAltException("", 44, 6, input);
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
                                    new NoViableAltException("", 44, 1, input);
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
                        let LA44_2 = input.LA(2);
                        if ((LA44_2 === DOWN)) {
                            alt44 = 3;
                        }
                        else {
                            if ((LA44_2 === GrammarTreeVisitor.EOF || (LA44_2 >= UP && LA44_2 <= GrammarTreeVisitor.ACTION) || LA44_2 === GrammarTreeVisitor.ASSIGN || LA44_2 === GrammarTreeVisitor.DOT || LA44_2 === GrammarTreeVisitor.NOT || LA44_2 === GrammarTreeVisitor.PLUS_ASSIGN || LA44_2 === GrammarTreeVisitor.RANGE || LA44_2 === GrammarTreeVisitor.RULE_REF || LA44_2 === GrammarTreeVisitor.SEMPRED || LA44_2 === GrammarTreeVisitor.STRING_LITERAL || LA44_2 === GrammarTreeVisitor.TOKEN_REF || (LA44_2 >= GrammarTreeVisitor.BLOCK && LA44_2 <= GrammarTreeVisitor.CLOSURE) || (LA44_2 >= GrammarTreeVisitor.OPTIONAL && LA44_2 <= GrammarTreeVisitor.POSITIVE_CLOSURE) || (LA44_2 >= GrammarTreeVisitor.SET && LA44_2 <= GrammarTreeVisitor.WILDCARD))) {
                                alt44 = 4;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 44, 2, input);
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
                        alt44 = 5;
                    }
                    break;
                }

                case SET: {
                    {
                        alt44 = 6;
                    }
                    break;
                }

                case RULE_REF: {
                    {
                        alt44 = 7;
                    }
                    break;
                }

                default: {
                    let nvae =
                        new NoViableAltException("", 44, 0, input);
                    throw nvae;
                }

            }
            switch (alt44) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:912:4: ^( DOT ID terminal )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.DOT, GrammarTreeVisitor.FOLLOW_DOT_in_atom2163);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_atom2165);
                        pushFollow(GrammarTreeVisitor.FOLLOW_terminal_in_atom2167);
                        this.terminal();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:913:4: ^( DOT ID ruleref )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.DOT, GrammarTreeVisitor.FOLLOW_DOT_in_atom2174);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ID, GrammarTreeVisitor.FOLLOW_ID_in_atom2176);
                        pushFollow(GrammarTreeVisitor.FOLLOW_ruleref_in_atom2178);
                        this.ruleref();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:914:7: ^( WILDCARD elementOptions )
                    {
                        WILDCARD34 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.WILDCARD, GrammarTreeVisitor.FOLLOW_WILDCARD_in_atom2188) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_atom2190);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                        this.wildcardRef(WILDCARD34);
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:915:7: WILDCARD
                    {
                        WILDCARD35 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.WILDCARD, GrammarTreeVisitor.FOLLOW_WILDCARD_in_atom2201) as GrammarAST;
                        this.wildcardRef(WILDCARD35);
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:916:9: terminal
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_terminal_in_atom2217);
                        this.terminal();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:917:7: blockSet
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_blockSet_in_atom2225);
                        this.blockSet();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }

                case 7: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:918:9: ruleref
                    {
                        pushFollow(GrammarTreeVisitor.FOLLOW_ruleref_in_atom2235);
                        this.ruleref();
                        java.security.Signature.state._fsp--;

                    }
                    break;
                }


                default:


            }

            this.exitAtom((retval.start as GrammarAST));

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


    // $ANTLR start "blockSet"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:921:1: blockSet : ^( SET ( setElement )+ ) ;
    public readonly blockSet(): GrammarTreeVisitor.blockSet_return {
        let retval = new GrammarTreeVisitor.blockSet_return();
        retval.start = input.LT(1);


        this.enterBlockSet((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:928:2: ( ^( SET ( setElement )+ ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:928:4: ^( SET ( setElement )+ )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.SET, GrammarTreeVisitor.FOLLOW_SET_in_blockSet2260);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:928:10: ( setElement )+
                let cnt45 = 0;
                loop45:
                while (true) {
                    let alt45 = 2;
                    let LA45_0 = input.LA(1);
                    if ((LA45_0 === GrammarTreeVisitor.LEXER_CHAR_SET || LA45_0 === GrammarTreeVisitor.RANGE || LA45_0 === GrammarTreeVisitor.STRING_LITERAL || LA45_0 === GrammarTreeVisitor.TOKEN_REF)) {
                        alt45 = 1;
                    }

                    switch (alt45) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:928:10: setElement
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_setElement_in_blockSet2262);
                                this.setElement();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt45 >= 1) {
                                break loop45;
                            }

                            let eee = new EarlyExitException(45, input);
                            throw eee;
                        }

                    }
                    cnt45++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitBlockSet((retval.start as GrammarAST));

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


    // $ANTLR start "setElement"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:931:1: setElement : ( ^( STRING_LITERAL elementOptions ) | ^( TOKEN_REF elementOptions ) | STRING_LITERAL | TOKEN_REF | ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) | LEXER_CHAR_SET );
    public readonly setElement(): GrammarTreeVisitor.setElement_return {
        let retval = new GrammarTreeVisitor.setElement_return();
        retval.start = input.LT(1);

        let a = null;
        let b = null;
        let STRING_LITERAL36 = null;
        let TOKEN_REF37 = null;
        let STRING_LITERAL38 = null;
        let TOKEN_REF39 = null;


        this.enterSetElement((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:938:2: ( ^( STRING_LITERAL elementOptions ) | ^( TOKEN_REF elementOptions ) | STRING_LITERAL | TOKEN_REF | ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) | LEXER_CHAR_SET )
            let alt46 = 6;
            switch (input.LA(1)) {
                case STRING_LITERAL: {
                    {
                        let LA46_1 = input.LA(2);
                        if ((LA46_1 === DOWN)) {
                            alt46 = 1;
                        }
                        else {
                            if ((LA46_1 === UP || LA46_1 === GrammarTreeVisitor.LEXER_CHAR_SET || LA46_1 === GrammarTreeVisitor.RANGE || LA46_1 === GrammarTreeVisitor.STRING_LITERAL || LA46_1 === GrammarTreeVisitor.TOKEN_REF)) {
                                alt46 = 3;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 46, 1, input);
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
                        let LA46_2 = input.LA(2);
                        if ((LA46_2 === DOWN)) {
                            alt46 = 2;
                        }
                        else {
                            if ((LA46_2 === UP || LA46_2 === GrammarTreeVisitor.LEXER_CHAR_SET || LA46_2 === GrammarTreeVisitor.RANGE || LA46_2 === GrammarTreeVisitor.STRING_LITERAL || LA46_2 === GrammarTreeVisitor.TOKEN_REF)) {
                                alt46 = 4;
                            }

                            else {
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 46, 2, input);
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
                        alt46 = 5;
                    }
                    break;
                }

                case LEXER_CHAR_SET: {
                    {
                        alt46 = 6;
                    }
                    break;
                }

                default: {
                    let nvae =
                        new NoViableAltException("", 46, 0, input);
                    throw nvae;
                }

            }
            switch (alt46) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:938:4: ^( STRING_LITERAL elementOptions )
                    {
                        STRING_LITERAL36 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.STRING_LITERAL, GrammarTreeVisitor.FOLLOW_STRING_LITERAL_in_setElement2286) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_setElement2288);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                        this.stringRef(STRING_LITERAL36 as TerminalAST);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:939:4: ^( TOKEN_REF elementOptions )
                    {
                        TOKEN_REF37 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.TOKEN_REF, GrammarTreeVisitor.FOLLOW_TOKEN_REF_in_setElement2300) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_setElement2302);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                        this.tokenRef(TOKEN_REF37 as TerminalAST);
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:940:4: STRING_LITERAL
                    {
                        STRING_LITERAL38 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.STRING_LITERAL, GrammarTreeVisitor.FOLLOW_STRING_LITERAL_in_setElement2312) as GrammarAST;
                        this.stringRef(STRING_LITERAL38 as TerminalAST);
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:941:4: TOKEN_REF
                    {
                        TOKEN_REF39 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.TOKEN_REF, GrammarTreeVisitor.FOLLOW_TOKEN_REF_in_setElement2337) as GrammarAST;
                        this.tokenRef(TOKEN_REF39 as TerminalAST);
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:942:4: ^( RANGE a= STRING_LITERAL b= STRING_LITERAL )
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.RANGE, GrammarTreeVisitor.FOLLOW_RANGE_in_setElement2366);
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        a = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.STRING_LITERAL, GrammarTreeVisitor.FOLLOW_STRING_LITERAL_in_setElement2370) as GrammarAST;
                        b = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.STRING_LITERAL, GrammarTreeVisitor.FOLLOW_STRING_LITERAL_in_setElement2374) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.UP, null);


                        this.stringRef(a as TerminalAST);
                        this.stringRef(b as TerminalAST);

                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:947:17: LEXER_CHAR_SET
                    {
                        java.security.cert.CertSelector.match(input, GrammarTreeVisitor.LEXER_CHAR_SET, GrammarTreeVisitor.FOLLOW_LEXER_CHAR_SET_in_setElement2397);
                    }
                    break;
                }


                default:


            }

            this.exitSetElement((retval.start as GrammarAST));

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


    // $ANTLR start "block"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:950:1: block : ^( BLOCK ( optionsSpec )? ( ruleAction )* ( ACTION )? ( alternative )+ ) ;
    public readonly block(): GrammarTreeVisitor.block_return {
        let retval = new GrammarTreeVisitor.block_return();
        retval.start = input.LT(1);


        this.enterBlock((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:957:5: ( ^( BLOCK ( optionsSpec )? ( ruleAction )* ( ACTION )? ( alternative )+ ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:957:7: ^( BLOCK ( optionsSpec )? ( ruleAction )* ( ACTION )? ( alternative )+ )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.BLOCK, GrammarTreeVisitor.FOLLOW_BLOCK_in_block2422);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                // org/antlr/v4/parse/GrammarTreeVisitor.g:957:15: ( optionsSpec )?
                let alt47 = 2;
                let LA47_0 = input.LA(1);
                if ((LA47_0 === GrammarTreeVisitor.OPTIONS)) {
                    alt47 = 1;
                }
                switch (alt47) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:957:15: optionsSpec
                        {
                            pushFollow(GrammarTreeVisitor.FOLLOW_optionsSpec_in_block2424);
                            this.optionsSpec();
                            java.security.Signature.state._fsp--;

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:957:28: ( ruleAction )*
                loop48:
                while (true) {
                    let alt48 = 2;
                    let LA48_0 = input.LA(1);
                    if ((LA48_0 === GrammarTreeVisitor.AT)) {
                        alt48 = 1;
                    }

                    switch (alt48) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:957:28: ruleAction
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_ruleAction_in_block2427);
                                this.ruleAction();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            break loop48;
                        }

                    }
                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:957:40: ( ACTION )?
                let alt49 = 2;
                let LA49_0 = input.LA(1);
                if ((LA49_0 === GrammarTreeVisitor.ACTION)) {
                    alt49 = 1;
                }
                switch (alt49) {
                    case 1: {
                        // org/antlr/v4/parse/GrammarTreeVisitor.g:957:40: ACTION
                        {
                            java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ACTION, GrammarTreeVisitor.FOLLOW_ACTION_in_block2430);
                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/GrammarTreeVisitor.g:957:48: ( alternative )+
                let cnt50 = 0;
                loop50:
                while (true) {
                    let alt50 = 2;
                    let LA50_0 = input.LA(1);
                    if ((LA50_0 === GrammarTreeVisitor.ALT)) {
                        alt50 = 1;
                    }

                    switch (alt50) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:957:48: alternative
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_alternative_in_block2433);
                                this.alternative();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default: {
                            if (cnt50 >= 1) {
                                break loop50;
                            }

                            let eee = new EarlyExitException(50, input);
                            throw eee;
                        }

                    }
                    cnt50++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitBlock((retval.start as GrammarAST));

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


    // $ANTLR start "ruleref"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:960:1: ruleref : ^( RULE_REF (arg= ARG_ACTION )? ( elementOptions )? ) ;
    public readonly ruleref(): GrammarTreeVisitor.ruleref_return {
        let retval = new GrammarTreeVisitor.ruleref_return();
        retval.start = input.LT(1);

        let arg = null;
        let RULE_REF40 = null;


        this.enterRuleref((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:967:5: ( ^( RULE_REF (arg= ARG_ACTION )? ( elementOptions )? ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:967:7: ^( RULE_REF (arg= ARG_ACTION )? ( elementOptions )? )
            {
                RULE_REF40 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.RULE_REF, GrammarTreeVisitor.FOLLOW_RULE_REF_in_ruleref2463) as GrammarAST;
                if (input.LA(1) === Token.DOWN) {
                    java.security.cert.CertSelector.match(input, Token.DOWN, null);
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:967:21: (arg= ARG_ACTION )?
                    let alt51 = 2;
                    let LA51_0 = input.LA(1);
                    if ((LA51_0 === GrammarTreeVisitor.ARG_ACTION)) {
                        alt51 = 1;
                    }
                    switch (alt51) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:967:21: arg= ARG_ACTION
                            {
                                arg = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ARG_ACTION, GrammarTreeVisitor.FOLLOW_ARG_ACTION_in_ruleref2467) as GrammarAST;
                            }
                            break;
                        }


                        default:


                    }

                    // org/antlr/v4/parse/GrammarTreeVisitor.g:967:34: ( elementOptions )?
                    let alt52 = 2;
                    let LA52_0 = input.LA(1);
                    if ((LA52_0 === GrammarTreeVisitor.ELEMENT_OPTIONS)) {
                        alt52 = 1;
                    }
                    switch (alt52) {
                        case 1: {
                            // org/antlr/v4/parse/GrammarTreeVisitor.g:967:34: elementOptions
                            {
                                pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_ruleref2470);
                                this.elementOptions();
                                java.security.Signature.state._fsp--;

                            }
                            break;
                        }


                        default:


                    }

                    java.security.cert.CertSelector.match(input, Token.UP, null);
                }


                this.ruleRef(RULE_REF40, arg as ActionAST);
                if (arg !== null) {
                    this.actionInAlt(arg as ActionAST);
                }


            }


            this.exitRuleref((retval.start as GrammarAST));

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


    // $ANTLR start "range"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:974:1: range : ^( RANGE STRING_LITERAL STRING_LITERAL ) ;
    public readonly range(): GrammarTreeVisitor.range_return {
        let retval = new GrammarTreeVisitor.range_return();
        retval.start = input.LT(1);


        this.enterRange((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:981:5: ( ^( RANGE STRING_LITERAL STRING_LITERAL ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:981:7: ^( RANGE STRING_LITERAL STRING_LITERAL )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.RANGE, GrammarTreeVisitor.FOLLOW_RANGE_in_range2507);
                java.security.cert.CertSelector.match(input, Token.DOWN, null);
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.STRING_LITERAL, GrammarTreeVisitor.FOLLOW_STRING_LITERAL_in_range2509);
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.STRING_LITERAL, GrammarTreeVisitor.FOLLOW_STRING_LITERAL_in_range2511);
                java.security.cert.CertSelector.match(input, Token.UP, null);

            }


            this.exitRange((retval.start as GrammarAST));

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


    // $ANTLR start "terminal"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:984:1: terminal : ( ^( STRING_LITERAL elementOptions ) | STRING_LITERAL | ^( TOKEN_REF elementOptions ) | TOKEN_REF );
    public readonly terminal(): GrammarTreeVisitor.terminal_return {
        let retval = new GrammarTreeVisitor.terminal_return();
        retval.start = input.LT(1);

        let STRING_LITERAL41 = null;
        let STRING_LITERAL42 = null;
        let TOKEN_REF43 = null;
        let TOKEN_REF44 = null;


        this.enterTerminal((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:991:5: ( ^( STRING_LITERAL elementOptions ) | STRING_LITERAL | ^( TOKEN_REF elementOptions ) | TOKEN_REF )
            let alt53 = 4;
            let LA53_0 = input.LA(1);
            if ((LA53_0 === GrammarTreeVisitor.STRING_LITERAL)) {
                let LA53_1 = input.LA(2);
                if ((LA53_1 === DOWN)) {
                    alt53 = 1;
                }
                else {
                    if ((LA53_1 === GrammarTreeVisitor.EOF || (LA53_1 >= UP && LA53_1 <= GrammarTreeVisitor.ACTION) || LA53_1 === GrammarTreeVisitor.ASSIGN || LA53_1 === GrammarTreeVisitor.DOT || LA53_1 === GrammarTreeVisitor.LEXER_CHAR_SET || LA53_1 === GrammarTreeVisitor.NOT || LA53_1 === GrammarTreeVisitor.PLUS_ASSIGN || LA53_1 === GrammarTreeVisitor.RANGE || LA53_1 === GrammarTreeVisitor.RULE_REF || LA53_1 === GrammarTreeVisitor.SEMPRED || LA53_1 === GrammarTreeVisitor.STRING_LITERAL || LA53_1 === GrammarTreeVisitor.TOKEN_REF || (LA53_1 >= GrammarTreeVisitor.BLOCK && LA53_1 <= GrammarTreeVisitor.CLOSURE) || LA53_1 === GrammarTreeVisitor.EPSILON || (LA53_1 >= GrammarTreeVisitor.OPTIONAL && LA53_1 <= GrammarTreeVisitor.POSITIVE_CLOSURE) || (LA53_1 >= GrammarTreeVisitor.SET && LA53_1 <= GrammarTreeVisitor.WILDCARD))) {
                        alt53 = 2;
                    }

                    else {
                        let nvaeMark = input.mark();
                        try {
                            input.consume();
                            let nvae =
                                new NoViableAltException("", 53, 1, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }
                }


            }
            else {
                if ((LA53_0 === GrammarTreeVisitor.TOKEN_REF)) {
                    let LA53_2 = input.LA(2);
                    if ((LA53_2 === DOWN)) {
                        alt53 = 3;
                    }
                    else {
                        if ((LA53_2 === GrammarTreeVisitor.EOF || (LA53_2 >= UP && LA53_2 <= GrammarTreeVisitor.ACTION) || LA53_2 === GrammarTreeVisitor.ASSIGN || LA53_2 === GrammarTreeVisitor.DOT || LA53_2 === GrammarTreeVisitor.LEXER_CHAR_SET || LA53_2 === GrammarTreeVisitor.NOT || LA53_2 === GrammarTreeVisitor.PLUS_ASSIGN || LA53_2 === GrammarTreeVisitor.RANGE || LA53_2 === GrammarTreeVisitor.RULE_REF || LA53_2 === GrammarTreeVisitor.SEMPRED || LA53_2 === GrammarTreeVisitor.STRING_LITERAL || LA53_2 === GrammarTreeVisitor.TOKEN_REF || (LA53_2 >= GrammarTreeVisitor.BLOCK && LA53_2 <= GrammarTreeVisitor.CLOSURE) || LA53_2 === GrammarTreeVisitor.EPSILON || (LA53_2 >= GrammarTreeVisitor.OPTIONAL && LA53_2 <= GrammarTreeVisitor.POSITIVE_CLOSURE) || (LA53_2 >= GrammarTreeVisitor.SET && LA53_2 <= GrammarTreeVisitor.WILDCARD))) {
                            alt53 = 4;
                        }

                        else {
                            let nvaeMark = input.mark();
                            try {
                                input.consume();
                                let nvae =
                                    new NoViableAltException("", 53, 2, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }
                    }


                }

                else {
                    let nvae =
                        new NoViableAltException("", 53, 0, input);
                    throw nvae;
                }
            }


            switch (alt53) {
                case 1: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:991:8: ^( STRING_LITERAL elementOptions )
                    {
                        STRING_LITERAL41 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.STRING_LITERAL, GrammarTreeVisitor.FOLLOW_STRING_LITERAL_in_terminal2541) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_terminal2543);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                        this.stringRef(STRING_LITERAL41 as TerminalAST);
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:993:7: STRING_LITERAL
                    {
                        STRING_LITERAL42 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.STRING_LITERAL, GrammarTreeVisitor.FOLLOW_STRING_LITERAL_in_terminal2566) as GrammarAST;
                        this.stringRef(STRING_LITERAL42 as TerminalAST);
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:994:7: ^( TOKEN_REF elementOptions )
                    {
                        TOKEN_REF43 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.TOKEN_REF, GrammarTreeVisitor.FOLLOW_TOKEN_REF_in_terminal2580) as GrammarAST;
                        java.security.cert.CertSelector.match(input, Token.DOWN, null);
                        pushFollow(GrammarTreeVisitor.FOLLOW_elementOptions_in_terminal2582);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;

                        java.security.cert.CertSelector.match(input, Token.UP, null);

                        this.tokenRef(TOKEN_REF43 as TerminalAST);
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:995:7: TOKEN_REF
                    {
                        TOKEN_REF44 = java.security.cert.CertSelector.match(input, GrammarTreeVisitor.TOKEN_REF, GrammarTreeVisitor.FOLLOW_TOKEN_REF_in_terminal2593) as GrammarAST;
                        this.tokenRef(TOKEN_REF44 as TerminalAST);
                    }
                    break;
                }


                default:


            }

            this.exitTerminal((retval.start as GrammarAST));

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


    // $ANTLR start "elementOptions"
    // org/antlr/v4/parse/GrammarTreeVisitor.g:998:1: elementOptions : ^( ELEMENT_OPTIONS ( elementOption[(GrammarASTWithOptions)$start.getParent()] )* ) ;
    public readonly elementOptions(): GrammarTreeVisitor.elementOptions_return {
        let retval = new GrammarTreeVisitor.elementOptions_return();
        retval.start = input.LT(1);


        this.enterElementOptions((retval.start as GrammarAST));

        try {
            // org/antlr/v4/parse/GrammarTreeVisitor.g:1005:5: ( ^( ELEMENT_OPTIONS ( elementOption[(GrammarASTWithOptions)$start.getParent()] )* ) )
            // org/antlr/v4/parse/GrammarTreeVisitor.g:1005:7: ^( ELEMENT_OPTIONS ( elementOption[(GrammarASTWithOptions)$start.getParent()] )* )
            {
                java.security.cert.CertSelector.match(input, GrammarTreeVisitor.ELEMENT_OPTIONS, GrammarTreeVisitor.FOLLOW_ELEMENT_OPTIONS_in_elementOptions2630);
                if (input.LA(1) === Token.DOWN) {
                    java.security.cert.CertSelector.match(input, Token.DOWN, null);
                    // org/antlr/v4/parse/GrammarTreeVisitor.g:1005:25: ( elementOption[(GrammarASTWithOptions)$start.getParent()] )*
                    loop54:
                    while (true) {
                        let alt54 = 2;
                        let LA54_0 = input.LA(1);
                        if ((LA54_0 === GrammarTreeVisitor.ASSIGN || LA54_0 === GrammarTreeVisitor.ID)) {
                            alt54 = 1;
                        }

                        switch (alt54) {
                            case 1: {
                                // org/antlr/v4/parse/GrammarTreeVisitor.g:1005:25: elementOption[(GrammarASTWithOptions)$start.getParent()]
                                {
                                    pushFollow(GrammarTreeVisitor.FOLLOW_elementOption_in_elementOptions2632);
                                    this.elementOption((retval.start as GrammarAST).getParent() as GrammarASTWithOptions);
                                    java.security.Signature.state._fsp--;

                                }
                                break;
                            }


                            default: {
                                break loop54;
                            }

                        }
                    }

                    java.security.cert.CertSelector.match(input, Token.UP, null);
                }

            }


            this.exitElementOptions((retval.start as GrammarAST));

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

    protected enterGrammarSpec(tree: GrammarAST): void { }
    protected exitGrammarSpec(tree: GrammarAST): void { }

    protected enterPrequelConstructs(tree: GrammarAST): void { }
    protected exitPrequelConstructs(tree: GrammarAST): void { }

    protected enterPrequelConstruct(tree: GrammarAST): void { }
    protected exitPrequelConstruct(tree: GrammarAST): void { }

    protected enterOptionsSpec(tree: GrammarAST): void { }
    protected exitOptionsSpec(tree: GrammarAST): void { }

    protected enterOption(tree: GrammarAST): void { }
    protected exitOption(tree: GrammarAST): void { }

    protected enterOptionValue(tree: GrammarAST): void { }
    protected exitOptionValue(tree: GrammarAST): void { }

    protected enterDelegateGrammars(tree: GrammarAST): void { }
    protected exitDelegateGrammars(tree: GrammarAST): void { }

    protected enterDelegateGrammar(tree: GrammarAST): void { }
    protected exitDelegateGrammar(tree: GrammarAST): void { }

    protected enterTokensSpec(tree: GrammarAST): void { }
    protected exitTokensSpec(tree: GrammarAST): void { }

    protected enterTokenSpec(tree: GrammarAST): void { }
    protected exitTokenSpec(tree: GrammarAST): void { }

    protected enterChannelsSpec(tree: GrammarAST): void { }
    protected exitChannelsSpec(tree: GrammarAST): void { }

    protected enterChannelSpec(tree: GrammarAST): void { }
    protected exitChannelSpec(tree: GrammarAST): void { }

    protected enterAction(tree: GrammarAST): void { }
    protected exitAction(tree: GrammarAST): void { }

    protected enterRules(tree: GrammarAST): void { }
    protected exitRules(tree: GrammarAST): void { }

    protected enterMode(tree: GrammarAST): void { }
    protected exitMode(tree: GrammarAST): void { }

    protected enterLexerRule(tree: GrammarAST): void { }
    protected exitLexerRule(tree: GrammarAST): void { }

    protected enterRule(tree: GrammarAST): void { }
    protected exitRule(tree: GrammarAST): void { }

    protected enterExceptionGroup(tree: GrammarAST): void { }
    protected exitExceptionGroup(tree: GrammarAST): void { }

    protected enterExceptionHandler(tree: GrammarAST): void { }
    protected exitExceptionHandler(tree: GrammarAST): void { }

    protected enterFinallyClause(tree: GrammarAST): void { }
    protected exitFinallyClause(tree: GrammarAST): void { }

    protected enterLocals(tree: GrammarAST): void { }
    protected exitLocals(tree: GrammarAST): void { }

    protected enterRuleReturns(tree: GrammarAST): void { }
    protected exitRuleReturns(tree: GrammarAST): void { }

    protected enterThrowsSpec(tree: GrammarAST): void { }
    protected exitThrowsSpec(tree: GrammarAST): void { }

    protected enterRuleAction(tree: GrammarAST): void { }
    protected exitRuleAction(tree: GrammarAST): void { }

    protected enterRuleModifier(tree: GrammarAST): void { }
    protected exitRuleModifier(tree: GrammarAST): void { }

    protected enterLexerRuleBlock(tree: GrammarAST): void { }
    protected exitLexerRuleBlock(tree: GrammarAST): void { }

    protected enterRuleBlock(tree: GrammarAST): void { }
    protected exitRuleBlock(tree: GrammarAST): void { }

    protected enterLexerOuterAlternative(tree: AltAST): void { }
    protected exitLexerOuterAlternative(tree: AltAST): void { }

    protected enterOuterAlternative(tree: AltAST): void { }
    protected exitOuterAlternative(tree: AltAST): void { }

    protected enterLexerAlternative(tree: GrammarAST): void { }
    protected exitLexerAlternative(tree: GrammarAST): void { }

    protected enterLexerElements(tree: GrammarAST): void { }
    protected exitLexerElements(tree: GrammarAST): void { }

    protected enterLexerElement(tree: GrammarAST): void { }
    protected exitLexerElement(tree: GrammarAST): void { }

    protected enterLexerBlock(tree: GrammarAST): void { }
    protected exitLexerBlock(tree: GrammarAST): void { }

    protected enterLexerAtom(tree: GrammarAST): void { }
    protected exitLexerAtom(tree: GrammarAST): void { }

    protected enterActionElement(tree: GrammarAST): void { }
    protected exitActionElement(tree: GrammarAST): void { }

    protected enterAlternative(tree: AltAST): void { }
    protected exitAlternative(tree: AltAST): void { }

    protected enterLexerCommand(tree: GrammarAST): void { }
    protected exitLexerCommand(tree: GrammarAST): void { }

    protected enterLexerCommandExpr(tree: GrammarAST): void { }
    protected exitLexerCommandExpr(tree: GrammarAST): void { }

    protected enterElement(tree: GrammarAST): void { }
    protected exitElement(tree: GrammarAST): void { }

    protected enterAstOperand(tree: GrammarAST): void { }
    protected exitAstOperand(tree: GrammarAST): void { }

    protected enterLabeledElement(tree: GrammarAST): void { }
    protected exitLabeledElement(tree: GrammarAST): void { }

    protected enterSubrule(tree: GrammarAST): void { }
    protected exitSubrule(tree: GrammarAST): void { }

    protected enterLexerSubrule(tree: GrammarAST): void { }
    protected exitLexerSubrule(tree: GrammarAST): void { }

    protected enterBlockSuffix(tree: GrammarAST): void { }
    protected exitBlockSuffix(tree: GrammarAST): void { }

    protected enterEbnfSuffix(tree: GrammarAST): void { }
    protected exitEbnfSuffix(tree: GrammarAST): void { }

    protected enterAtom(tree: GrammarAST): void { }
    protected exitAtom(tree: GrammarAST): void { }

    protected enterBlockSet(tree: GrammarAST): void { }
    protected exitBlockSet(tree: GrammarAST): void { }

    protected enterSetElement(tree: GrammarAST): void { }
    protected exitSetElement(tree: GrammarAST): void { }

    protected enterBlock(tree: GrammarAST): void { }
    protected exitBlock(tree: GrammarAST): void { }

    protected enterRuleref(tree: GrammarAST): void { }
    protected exitRuleref(tree: GrammarAST): void { }

    protected enterRange(tree: GrammarAST): void { }
    protected exitRange(tree: GrammarAST): void { }

    protected enterTerminal(tree: GrammarAST): void { }
    protected exitTerminal(tree: GrammarAST): void { }

    protected enterElementOptions(tree: GrammarAST): void { }
    protected exitElementOptions(tree: GrammarAST): void { }

    protected enterElementOption(tree: GrammarAST): void { }
    protected exitElementOption(tree: GrammarAST): void { };;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

    static {
        let numStates = GrammarTreeVisitor.DFA38_transitionS.length;
        GrammarTreeVisitor.DFA38_transition = new Int16Array(numStates)[];
        for (let i = 0; i < numStates; i++) {
            GrammarTreeVisitor.DFA38_transition[i] = DFA.unpackEncodedString(GrammarTreeVisitor.DFA38_transitionS[i]);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace GrammarTreeVisitor {
    export type grammarSpec_return = InstanceType<typeof GrammarTreeVisitor.grammarSpec_return>;
    export type prequelConstructs_return = InstanceType<typeof GrammarTreeVisitor.prequelConstructs_return>;
    export type prequelConstruct_return = InstanceType<typeof GrammarTreeVisitor.prequelConstruct_return>;
    export type optionsSpec_return = InstanceType<typeof GrammarTreeVisitor.optionsSpec_return>;
    export type option_return = InstanceType<typeof GrammarTreeVisitor.option_return>;
    export type optionValue_return = InstanceType<typeof GrammarTreeVisitor.optionValue_return>;
    export type delegateGrammars_return = InstanceType<typeof GrammarTreeVisitor.delegateGrammars_return>;
    export type delegateGrammar_return = InstanceType<typeof GrammarTreeVisitor.delegateGrammar_return>;
    export type tokensSpec_return = InstanceType<typeof GrammarTreeVisitor.tokensSpec_return>;
    export type tokenSpec_return = InstanceType<typeof GrammarTreeVisitor.tokenSpec_return>;
    export type channelsSpec_return = InstanceType<typeof GrammarTreeVisitor.channelsSpec_return>;
    export type channelSpec_return = InstanceType<typeof GrammarTreeVisitor.channelSpec_return>;
    export type action_return = InstanceType<typeof GrammarTreeVisitor.action_return>;
    export type rules_return = InstanceType<typeof GrammarTreeVisitor.rules_return>;
    export type mode_return = InstanceType<typeof GrammarTreeVisitor.mode_return>;
    export type lexerRule_return = InstanceType<typeof GrammarTreeVisitor.lexerRule_return>;
    export type rule_return = InstanceType<typeof GrammarTreeVisitor.rule_return>;
    export type exceptionGroup_return = InstanceType<typeof GrammarTreeVisitor.exceptionGroup_return>;
    export type exceptionHandler_return = InstanceType<typeof GrammarTreeVisitor.exceptionHandler_return>;
    export type finallyClause_return = InstanceType<typeof GrammarTreeVisitor.finallyClause_return>;
    export type locals_return = InstanceType<typeof GrammarTreeVisitor.locals_return>;
    export type ruleReturns_return = InstanceType<typeof GrammarTreeVisitor.ruleReturns_return>;
    export type throwsSpec_return = InstanceType<typeof GrammarTreeVisitor.throwsSpec_return>;
    export type ruleAction_return = InstanceType<typeof GrammarTreeVisitor.ruleAction_return>;
    export type ruleModifier_return = InstanceType<typeof GrammarTreeVisitor.ruleModifier_return>;
    export type lexerRuleBlock_return = InstanceType<typeof GrammarTreeVisitor.lexerRuleBlock_return>;
    export type ruleBlock_return = InstanceType<typeof GrammarTreeVisitor.ruleBlock_return>;
    export type lexerOuterAlternative_return = InstanceType<typeof GrammarTreeVisitor.lexerOuterAlternative_return>;
    export type outerAlternative_return = InstanceType<typeof GrammarTreeVisitor.outerAlternative_return>;
    export type lexerAlternative_return = InstanceType<typeof GrammarTreeVisitor.lexerAlternative_return>;
    export type lexerElements_return = InstanceType<typeof GrammarTreeVisitor.lexerElements_return>;
    export type lexerElement_return = InstanceType<typeof GrammarTreeVisitor.lexerElement_return>;
    export type lexerBlock_return = InstanceType<typeof GrammarTreeVisitor.lexerBlock_return>;
    export type lexerAtom_return = InstanceType<typeof GrammarTreeVisitor.lexerAtom_return>;
    export type actionElement_return = InstanceType<typeof GrammarTreeVisitor.actionElement_return>;
    export type alternative_return = InstanceType<typeof GrammarTreeVisitor.alternative_return>;
    export type lexerCommand_return = InstanceType<typeof GrammarTreeVisitor.lexerCommand_return>;
    export type lexerCommandExpr_return = InstanceType<typeof GrammarTreeVisitor.lexerCommandExpr_return>;
    export type element_return = InstanceType<typeof GrammarTreeVisitor.element_return>;
    export type astOperand_return = InstanceType<typeof GrammarTreeVisitor.astOperand_return>;
    export type labeledElement_return = InstanceType<typeof GrammarTreeVisitor.labeledElement_return>;
    export type subrule_return = InstanceType<typeof GrammarTreeVisitor.subrule_return>;
    export type lexerSubrule_return = InstanceType<typeof GrammarTreeVisitor.lexerSubrule_return>;
    export type blockSuffix_return = InstanceType<typeof GrammarTreeVisitor.blockSuffix_return>;
    export type ebnfSuffix_return = InstanceType<typeof GrammarTreeVisitor.ebnfSuffix_return>;
    export type atom_return = InstanceType<typeof GrammarTreeVisitor.atom_return>;
    export type blockSet_return = InstanceType<typeof GrammarTreeVisitor.blockSet_return>;
    export type setElement_return = InstanceType<typeof GrammarTreeVisitor.setElement_return>;
    export type block_return = InstanceType<typeof GrammarTreeVisitor.block_return>;
    export type ruleref_return = InstanceType<typeof GrammarTreeVisitor.ruleref_return>;
    export type range_return = InstanceType<typeof GrammarTreeVisitor.range_return>;
    export type terminal_return = InstanceType<typeof GrammarTreeVisitor.terminal_return>;
    export type elementOptions_return = InstanceType<typeof GrammarTreeVisitor.elementOptions_return>;
    export type elementOption_return = InstanceType<typeof GrammarTreeVisitor.elementOption_return>;
    export type DFA38 = InstanceType<GrammarTreeVisitor["DFA38"]>;
}
