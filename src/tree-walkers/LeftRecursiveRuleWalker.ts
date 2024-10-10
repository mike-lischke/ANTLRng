/* java2ts: keep */

// $ANTLR 3.5.3 org/antlr/v4/parse/LeftRecursiveRuleWalker.g






/** Find left-recursive rules */
export class LeftRecursiveRuleWalker extends TreeParser {
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
    // $ANTLR end "ruleModifier"


    public static ruleBlock_return = class ruleBlock_return extends TreeRuleReturnScope {
        public isLeftRec: boolean;
    };

    // $ANTLR end "ruleBlock"


    public static outerAlternative_return = class outerAlternative_return extends TreeRuleReturnScope {
        public isLeftRec: boolean;
    };


    public static readonly FOLLOW_RULE_in_rec_rule72 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_RULE_REF_in_rec_rule76 = new java.util.BitSet([0x0010040200000800n, 0x0000000000700040n]);
    public static readonly FOLLOW_ruleModifier_in_rec_rule83 = new java.util.BitSet([0x0010040200000800n, 0x0000000000000040n]);
    public static readonly FOLLOW_RETURNS_in_rec_rule92 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ARG_ACTION_in_rec_rule96 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_LOCALS_in_rec_rule115 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ARG_ACTION_in_rec_rule117 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_OPTIONS_in_rec_rule135 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_AT_in_rec_rule152 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_rec_rule154 = new java.util.BitSet([0x0000000000000010n]);
    public static readonly FOLLOW_ACTION_in_rec_rule156 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ruleBlock_in_rec_rule172 = new java.util.BitSet([0x0000000000801008n]);
    public static readonly FOLLOW_exceptionGroup_in_rec_rule179 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_exceptionHandler_in_exceptionGroup197 = new java.util.BitSet([0x0000000000801002n]);
    public static readonly FOLLOW_finallyClause_in_exceptionGroup200 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_CATCH_in_exceptionHandler216 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ARG_ACTION_in_exceptionHandler218 = new java.util.BitSet([0x0000000000000010n]);
    public static readonly FOLLOW_ACTION_in_exceptionHandler220 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_FINALLY_in_finallyClause233 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ACTION_in_finallyClause235 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_BLOCK_in_ruleBlock290 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_outerAlternative_in_ruleBlock303 = new java.util.BitSet([0x0000000000000008n, 0x0000000000000020n]);
    public static readonly FOLLOW_binary_in_outerAlternative362 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_prefix_in_outerAlternative418 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_suffix_in_outerAlternative474 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_nonLeftRecur_in_outerAlternative515 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ALT_in_binary541 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_binary543 = new java.util.BitSet([0x0040400000000400n]);
    public static readonly FOLLOW_recurse_in_binary546 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_element_in_binary548 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_recurse_in_binary551 = new java.util.BitSet([0x0100000000000018n, 0x0000000000000400n]);
    public static readonly FOLLOW_epsilonElement_in_binary553 = new java.util.BitSet([0x0100000000000018n, 0x0000000000000400n]);
    public static readonly FOLLOW_ALT_in_prefix579 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_prefix581 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_element_in_prefix587 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_recurse_in_prefix593 = new java.util.BitSet([0x0100000000000018n, 0x0000000000000400n]);
    public static readonly FOLLOW_epsilonElement_in_prefix595 = new java.util.BitSet([0x0100000000000018n, 0x0000000000000400n]);
    public static readonly FOLLOW_ALT_in_suffix630 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_suffix632 = new java.util.BitSet([0x0040400000000400n]);
    public static readonly FOLLOW_recurse_in_suffix635 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_element_in_suffix637 = new java.util.BitSet([0x4942408000100418n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_ALT_in_nonLeftRecur671 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_nonLeftRecur673 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_element_in_nonLeftRecur676 = new java.util.BitSet([0x4942408000100418n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_ASSIGN_in_recurse693 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_recurse695 = new java.util.BitSet([0x0040000000000000n]);
    public static readonly FOLLOW_recurseNoLabel_in_recurse697 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_PLUS_ASSIGN_in_recurse704 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_recurse706 = new java.util.BitSet([0x0040000000000000n]);
    public static readonly FOLLOW_recurseNoLabel_in_recurse708 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_recurseNoLabel_in_recurse714 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_RULE_REF_in_recurseNoLabel726 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ASSIGN_in_token740 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_token742 = new java.util.BitSet([0x4800400000000400n]);
    public static readonly FOLLOW_token_in_token746 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_PLUS_ASSIGN_in_token755 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_token757 = new java.util.BitSet([0x4800400000000400n]);
    public static readonly FOLLOW_token_in_token761 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_token771 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_STRING_LITERAL_in_token792 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_token794 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_TOKEN_REF_in_token809 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_token811 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_TOKEN_REF_in_token823 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ELEMENT_OPTIONS_in_elementOptions853 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOption_in_elementOptions855 = new java.util.BitSet([0x0000000010000408n]);
    public static readonly FOLLOW_ID_in_elementOption874 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption885 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption887 = new java.util.BitSet([0x0000000010000000n]);
    public static readonly FOLLOW_ID_in_elementOption889 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption901 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption903 = new java.util.BitSet([0x0800000000000000n]);
    public static readonly FOLLOW_STRING_LITERAL_in_elementOption905 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption917 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption919 = new java.util.BitSet([0x0000000000000010n]);
    public static readonly FOLLOW_ACTION_in_elementOption921 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption933 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption935 = new java.util.BitSet([0x0000000040000000n]);
    public static readonly FOLLOW_INT_in_elementOption937 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_atom_in_element952 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_NOT_in_element958 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_element_in_element960 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_RANGE_in_element967 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_atom_in_element969 = new java.util.BitSet([0x4840000000100000n, 0x0000000000080000n]);
    public static readonly FOLLOW_atom_in_element971 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ASSIGN_in_element978 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_element980 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_element_in_element982 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_PLUS_ASSIGN_in_element989 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_element991 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_element_in_element993 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_SET_in_element1003 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_setElement_in_element1005 = new java.util.BitSet([0x4800000000000008n]);
    public static readonly FOLLOW_RULE_REF_in_element1017 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ebnf_in_element1022 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_epsilonElement_in_element1027 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ACTION_in_epsilonElement1038 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_SEMPRED_in_epsilonElement1043 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_EPSILON_in_epsilonElement1048 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ACTION_in_epsilonElement1054 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_epsilonElement1056 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_SEMPRED_in_epsilonElement1063 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_epsilonElement1065 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_setElement1078 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_setElement1080 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_TOKEN_REF_in_setElement1087 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_setElement1089 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_setElement1095 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_TOKEN_REF_in_setElement1100 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_block_in_ebnf1111 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_OPTIONAL_in_ebnf1123 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_block_in_ebnf1125 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_CLOSURE_in_ebnf1139 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_block_in_ebnf1141 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_POSITIVE_CLOSURE_in_ebnf1155 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_block_in_ebnf1157 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_BLOCK_in_block1177 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ACTION_in_block1179 = new java.util.BitSet([0x0000000000000000n, 0x0000000000000020n]);
    public static readonly FOLLOW_alternative_in_block1182 = new java.util.BitSet([0x0000000000000008n, 0x0000000000000020n]);
    public static readonly FOLLOW_ALT_in_alternative1199 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_alternative1201 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_element_in_alternative1204 = new java.util.BitSet([0x4942408000100418n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_RULE_REF_in_atom1221 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ARG_ACTION_in_atom1223 = new java.util.BitSet([0x0000000000000008n, 0x0000000000000200n]);
    public static readonly FOLLOW_elementOptions_in_atom1226 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_atom1238 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_atom1240 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_atom1246 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_TOKEN_REF_in_atom1255 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_atom1257 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_TOKEN_REF_in_atom1263 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_WILDCARD_in_atom1272 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_atom1274 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_WILDCARD_in_atom1280 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_DOT_in_atom1286 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_atom1288 = new java.util.BitSet([0x4942408000100410n, 0x00000000000C64C0n]);
    public static readonly FOLLOW_element_in_atom1290 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_binary_in_synpred1_LeftRecursiveRuleWalker348 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_prefix_in_synpred2_LeftRecursiveRuleWalker404 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_suffix_in_synpred3_LeftRecursiveRuleWalker460 = new java.util.BitSet([0x0000000000000002n]);
    protected static readonly DFA11_eotS =
		"\130\uffff";
    protected static readonly DFA11_eofS =
		"\130\uffff";
    protected static readonly DFA11_minS =
		"\1\4\3\2\1\uffff\2\34\2\2\1\3\1\uffff\2\4\2\111\4\2\4\3\2\2\2\3\1\2\2" +
		"\3\1\2\1\3\2\111\1\34\1\3\1\34\1\3\2\2\2\4\13\3\1\2\2\3\1\2\11\3\1\34" +
		"\1\3\1\34\1\3\2\4\20\3";
    protected static readonly DFA11_maxS =
		"\1\123\2\2\1\123\1\uffff\2\34\3\123\1\uffff\2\123\2\111\2\3\2\2\2\123" +
		"\2\34\3\123\1\34\1\2\1\3\1\34\1\2\1\3\2\111\1\34\1\123\1\34\1\123\2\2" +
		"\2\73\2\34\10\3\1\34\1\2\1\3\1\34\1\2\1\3\11\34\1\123\1\34\1\123\2\73" +
		"\10\3\10\34";
    protected static readonly DFA11_acceptS =
		"\4\uffff\1\1\5\uffff\1\2\115\uffff";
    protected static readonly DFA11_specialS =
		"\130\uffff}>";
    protected static readonly DFA11_transitionS = [
			"\1\4\5\uffff\1\1\11\uffff\1\4\22\uffff\1\4\6\uffff\1\2\2\uffff\1\4\4" +
			"\uffff\1\3\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1" +
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\5",
			"\1\6",
			"\1\4\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
        "",
			"\1\13",
			"\1\14",
			"\1\15\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\16\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
        "",
			"\1\4\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff\1\4\4" +
			"\uffff\1\17\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1" +
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\4\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff\1\4\4" +
			"\uffff\1\20\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1" +
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\21",
			"\1\22",
			"\1\4\1\23",
			"\1\4\1\24",
			"\1\25",
			"\1\26",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\40\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2" +
			"\uffff\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2" +
			"\4\2\uffff\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\41\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2" +
			"\uffff\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2" +
			"\4\2\uffff\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\42",
			"\1\43",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\44",
			"\1\45",
			"\1\46",
			"\1\47",
			"\1\50",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\51",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\52",
			"\1\53",
			"\1\56\27\uffff\1\54\1\uffff\1\57\34\uffff\1\55",
			"\1\62\27\uffff\1\60\1\uffff\1\63\34\uffff\1\61",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\72",
			"\1\73",
			"\1\74",
			"\1\75",
			"\1\76",
			"\1\77",
			"\1\100",
			"\1\101",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\102",
			"\1\103",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\104",
			"\1\105",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\106",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\107",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\112\27\uffff\1\110\1\uffff\1\113\34\uffff\1\111",
			"\1\116\27\uffff\1\114\1\uffff\1\117\34\uffff\1\115",
			"\1\120",
			"\1\121",
			"\1\122",
			"\1\123",
			"\1\124",
			"\1\125",
			"\1\126",
			"\1\127",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67"
    ];

    protected static readonly DFA11_eot = DFA.unpackEncodedString(LeftRecursiveRuleWalker.DFA11_eotS);
    protected static readonly DFA11_eof = DFA.unpackEncodedString(LeftRecursiveRuleWalker.DFA11_eofS);
    protected static readonly DFA11_min = DFA.unpackEncodedStringToUnsignedChars(LeftRecursiveRuleWalker.DFA11_minS);
    protected static readonly DFA11_max = DFA.unpackEncodedStringToUnsignedChars(LeftRecursiveRuleWalker.DFA11_maxS);
    protected static readonly DFA11_accept = DFA.unpackEncodedString(LeftRecursiveRuleWalker.DFA11_acceptS);
    protected static readonly DFA11_special = DFA.unpackEncodedString(LeftRecursiveRuleWalker.DFA11_specialS);
    protected static readonly DFA11_transition: Int16Array[];

    protected static readonly DFA14_eotS =
		"\130\uffff";
    protected static readonly DFA14_eofS =
		"\130\uffff";
    protected static readonly DFA14_minS =
		"\1\4\3\2\1\uffff\2\34\2\2\1\3\1\uffff\2\4\2\111\4\2\4\3\2\2\2\3\1\2\2" +
		"\3\1\2\1\3\2\111\1\34\1\3\1\34\1\3\2\2\2\4\13\3\1\2\2\3\1\2\11\3\1\34" +
		"\1\3\1\34\1\3\2\4\20\3";
    protected static readonly DFA14_maxS =
		"\1\123\2\2\1\123\1\uffff\2\34\3\123\1\uffff\2\123\2\111\2\3\2\2\2\123" +
		"\2\34\3\123\1\34\1\2\1\3\1\34\1\2\1\3\2\111\1\34\1\123\1\34\1\123\2\2" +
		"\2\73\2\34\10\3\1\34\1\2\1\3\1\34\1\2\1\3\11\34\1\123\1\34\1\123\2\73" +
		"\10\3\10\34";
    protected static readonly DFA14_acceptS =
		"\4\uffff\1\1\5\uffff\1\2\115\uffff";
    protected static readonly DFA14_specialS =
		"\130\uffff}>";
    protected static readonly DFA14_transitionS = [
			"\1\4\5\uffff\1\1\11\uffff\1\4\22\uffff\1\4\6\uffff\1\2\2\uffff\1\4\4" +
			"\uffff\1\3\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1" +
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\5",
			"\1\6",
			"\1\4\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
        "",
			"\1\13",
			"\1\14",
			"\1\15\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\16\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
        "",
			"\1\4\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff\1\4\4" +
			"\uffff\1\17\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1" +
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\4\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff\1\4\4" +
			"\uffff\1\20\1\uffff\1\4\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff\1" +
			"\4\2\uffff\2\4\3\uffff\2\4",
			"\1\21",
			"\1\22",
			"\1\4\1\23",
			"\1\4\1\24",
			"\1\25",
			"\1\26",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\40\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2" +
			"\uffff\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2" +
			"\4\2\uffff\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\41\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2" +
			"\uffff\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2" +
			"\4\2\uffff\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\42",
			"\1\43",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\44",
			"\1\45",
			"\1\46",
			"\1\47",
			"\1\50",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\51",
			"\1\12\1\7\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\10\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\11\2\uffff\2\4\3\uffff\2\4",
			"\1\52",
			"\1\53",
			"\1\56\27\uffff\1\54\1\uffff\1\57\34\uffff\1\55",
			"\1\62\27\uffff\1\60\1\uffff\1\63\34\uffff\1\61",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\72",
			"\1\73",
			"\1\74",
			"\1\75",
			"\1\76",
			"\1\77",
			"\1\100",
			"\1\101",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\102",
			"\1\103",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\104",
			"\1\105",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\34\6\uffff\1\33\21\uffff\1\32",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\37\6\uffff\1\36\21\uffff\1\35",
			"\1\106",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\107",
			"\1\12\1\27\5\uffff\1\4\11\uffff\1\4\22\uffff\1\4\6\uffff\1\4\2\uffff" +
			"\1\4\4\uffff\1\4\1\uffff\1\30\2\uffff\1\4\2\uffff\1\4\7\uffff\2\4\2\uffff" +
			"\1\31\2\uffff\2\4\3\uffff\2\4",
			"\1\112\27\uffff\1\110\1\uffff\1\113\34\uffff\1\111",
			"\1\116\27\uffff\1\114\1\uffff\1\117\34\uffff\1\115",
			"\1\120",
			"\1\121",
			"\1\122",
			"\1\123",
			"\1\124",
			"\1\125",
			"\1\126",
			"\1\127",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\66\6\uffff\1\65\21\uffff\1\64",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67",
			"\1\71\6\uffff\1\70\21\uffff\1\67"
    ];

    protected static readonly DFA14_eot = DFA.unpackEncodedString(LeftRecursiveRuleWalker.DFA14_eotS);
    protected static readonly DFA14_eof = DFA.unpackEncodedString(LeftRecursiveRuleWalker.DFA14_eofS);
    protected static readonly DFA14_min = DFA.unpackEncodedStringToUnsignedChars(LeftRecursiveRuleWalker.DFA14_minS);
    protected static readonly DFA14_max = DFA.unpackEncodedStringToUnsignedChars(LeftRecursiveRuleWalker.DFA14_maxS);
    protected static readonly DFA14_accept = DFA.unpackEncodedString(LeftRecursiveRuleWalker.DFA14_acceptS);
    protected static readonly DFA14_special = DFA.unpackEncodedString(LeftRecursiveRuleWalker.DFA14_specialS);
    protected static readonly DFA14_transition: Int16Array[]; // which outer alt of rule?
    public numAlts: number;

    public DFA11 = (($outer) => {
        return class DFA11 extends DFA {

            public constructor(recognizer: BaseRecognizer) {
                this.recognizer = recognizer;
                this.decisionNumber = 11;
                this.eot = LeftRecursiveRuleWalker.DFA11_eot;
                this.eof = LeftRecursiveRuleWalker.DFA11_eof;
                this.min = LeftRecursiveRuleWalker.DFA11_min;
                this.max = LeftRecursiveRuleWalker.DFA11_max;
                this.accept = LeftRecursiveRuleWalker.DFA11_accept;
                this.special = LeftRecursiveRuleWalker.DFA11_special;
                this.transition = LeftRecursiveRuleWalker.DFA11_transition;
            }

            public getDescription(): string {
                return "()* loopback of 124:35: ( element )*";
            }
        };
    })(this);


    public DFA14 = (($outer) => {
        return class DFA14 extends DFA {

            public constructor(recognizer: BaseRecognizer) {
                this.recognizer = recognizer;
                this.decisionNumber = 14;
                this.eot = LeftRecursiveRuleWalker.DFA14_eot;
                this.eof = LeftRecursiveRuleWalker.DFA14_eof;
                this.min = LeftRecursiveRuleWalker.DFA14_min;
                this.max = LeftRecursiveRuleWalker.DFA14_max;
                this.accept = LeftRecursiveRuleWalker.DFA14_accept;
                this.special = LeftRecursiveRuleWalker.DFA14_special;
                this.transition = LeftRecursiveRuleWalker.DFA14_transition;
            }

            public getDescription(): string {
                return "()+ loopback of 130:4: ( element )+";
            }
        };
    })(this);



    protected dfa11 = new DFA11(this);
    protected dfa14 = new DFA14(this);


    protected ruleName: string;
    private currentOuterAltNumber: number;

    // delegators


    public constructor(input: TreeNodeStream);
    public constructor(input: TreeNodeStream, state: RecognizerSharedState);
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

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    // delegates
    public getDelegates(): TreeParser[] {
        return [];
    }


    public getTokenNames(): string[] { return LeftRecursiveRuleWalker.tokenNames; }

    public getGrammarFileName(): string { return "org/antlr/v4/parse/LeftRecursiveRuleWalker.g"; }  // how many alts for this rule total?

    public setAltAssoc(altTree: AltAST, alt: number): void { }
    public binaryAlt(altTree: AltAST, alt: number): void { }
    public prefixAlt(altTree: AltAST, alt: number): void { }
    public suffixAlt(altTree: AltAST, alt: number): void { }
    public otherAlt(altTree: AltAST, alt: number): void { }
    public setReturnValues(t: GrammarAST): void { }



    // $ANTLR start "rec_rule"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:64:1: public rec_rule returns [boolean isLeftRec] : ^(r= RULE id= RULE_REF ( ruleModifier )? ( ^( RETURNS a= ARG_ACTION ) )? ( ^( LOCALS ARG_ACTION ) )? ( ^( OPTIONS ( . )* ) | ^( AT ID ACTION ) )* ruleBlock exceptionGroup ) ;
    public readonly rec_rule(): boolean {
        let isLeftRec = false;


        let r = null;
        let id = null;
        let a = null;
        let ruleBlock1 = null;


        this.currentOuterAltNumber = 1;

        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:69:2: ( ^(r= RULE id= RULE_REF ( ruleModifier )? ( ^( RETURNS a= ARG_ACTION ) )? ( ^( LOCALS ARG_ACTION ) )? ( ^( OPTIONS ( . )* ) | ^( AT ID ACTION ) )* ruleBlock exceptionGroup ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:69:4: ^(r= RULE id= RULE_REF ( ruleModifier )? ( ^( RETURNS a= ARG_ACTION ) )? ( ^( LOCALS ARG_ACTION ) )? ( ^( OPTIONS ( . )* ) | ^( AT ID ACTION ) )* ruleBlock exceptionGroup )
            {
                r = java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.RULE, LeftRecursiveRuleWalker.FOLLOW_RULE_in_rec_rule72) as GrammarAST; if (java.security.Signature.state.failed) {
                    return isLeftRec;
                }

                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                    return isLeftRec;
                }

                id = java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.RULE_REF, LeftRecursiveRuleWalker.FOLLOW_RULE_REF_in_rec_rule76) as GrammarAST; if (java.security.Signature.state.failed) {
                    return isLeftRec;
                }

                if (java.security.Signature.state.backtracking === 0) { this.ruleName = id.getText(); }
                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:70:4: ( ruleModifier )?
                let alt1 = 2;
                let LA1_0 = input.LA(1);
                if (((LA1_0 >= LeftRecursiveRuleWalker.PRIVATE && LA1_0 <= LeftRecursiveRuleWalker.PUBLIC))) {
                    alt1 = 1;
                }
                switch (alt1) {
                    case 1: {
                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:70:4: ruleModifier
                        {
                            pushFollow(LeftRecursiveRuleWalker.FOLLOW_ruleModifier_in_rec_rule83);
                            this.ruleModifier();
                            java.security.Signature.state._fsp--;
                            if (java.security.Signature.state.failed) {
                                return isLeftRec;
                            }

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:72:4: ( ^( RETURNS a= ARG_ACTION ) )?
                let alt2 = 2;
                let LA2_0 = input.LA(1);
                if ((LA2_0 === LeftRecursiveRuleWalker.RETURNS)) {
                    alt2 = 1;
                }
                switch (alt2) {
                    case 1: {
                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:72:5: ^( RETURNS a= ARG_ACTION )
                        {
                            java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.RETURNS, LeftRecursiveRuleWalker.FOLLOW_RETURNS_in_rec_rule92); if (java.security.Signature.state.failed) {
                                return isLeftRec;
                            }

                            java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                return isLeftRec;
                            }

                            a = java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ARG_ACTION, LeftRecursiveRuleWalker.FOLLOW_ARG_ACTION_in_rec_rule96) as GrammarAST; if (java.security.Signature.state.failed) {
                                return isLeftRec;
                            }

                            if (java.security.Signature.state.backtracking === 0) { this.setReturnValues(a); }
                            java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                return isLeftRec;
                            }


                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:74:9: ( ^( LOCALS ARG_ACTION ) )?
                let alt3 = 2;
                let LA3_0 = input.LA(1);
                if ((LA3_0 === LeftRecursiveRuleWalker.LOCALS)) {
                    alt3 = 1;
                }
                switch (alt3) {
                    case 1: {
                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:74:11: ^( LOCALS ARG_ACTION )
                        {
                            java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.LOCALS, LeftRecursiveRuleWalker.FOLLOW_LOCALS_in_rec_rule115); if (java.security.Signature.state.failed) {
                                return isLeftRec;
                            }

                            java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                return isLeftRec;
                            }

                            java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ARG_ACTION, LeftRecursiveRuleWalker.FOLLOW_ARG_ACTION_in_rec_rule117); if (java.security.Signature.state.failed) {
                                return isLeftRec;
                            }

                            java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                return isLeftRec;
                            }


                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:75:9: ( ^( OPTIONS ( . )* ) | ^( AT ID ACTION ) )*
                loop5:
                while (true) {
                    let alt5 = 3;
                    let LA5_0 = input.LA(1);
                    if ((LA5_0 === LeftRecursiveRuleWalker.OPTIONS)) {
                        alt5 = 1;
                    }
                    else {
                        if ((LA5_0 === LeftRecursiveRuleWalker.AT)) {
                            alt5 = 2;
                        }
                    }


                    switch (alt5) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:75:11: ^( OPTIONS ( . )* )
                            {
                                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.OPTIONS, LeftRecursiveRuleWalker.FOLLOW_OPTIONS_in_rec_rule135); if (java.security.Signature.state.failed) {
                                    return isLeftRec;
                                }

                                if (input.LA(1) === Token.DOWN) {
                                    java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                        return isLeftRec;
                                    }

                                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:75:21: ( . )*
                                    loop4:
                                    while (true) {
                                        let alt4 = 2;
                                        let LA4_0 = input.LA(1);
                                        if (((LA4_0 >= LeftRecursiveRuleWalker.ACTION && LA4_0 <= LeftRecursiveRuleWalker.PUBLIC))) {
                                            alt4 = 1;
                                        }
                                        else {
                                            if ((LA4_0 === UP)) {
                                                alt4 = 2;
                                            }
                                        }


                                        switch (alt4) {
                                            case 1: {
                                                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:75:21: .
                                                {
                                                    matchAny(input); if (java.security.Signature.state.failed) {
                                                        return isLeftRec;
                                                    }

                                                }
                                                break;
                                            }


                                            default: {
                                                break loop4;
                                            }

                                        }
                                    }

                                    java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                        return isLeftRec;
                                    }

                                }

                            }
                            break;
                        }

                        case 2: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:76:11: ^( AT ID ACTION )
                            {
                                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.AT, LeftRecursiveRuleWalker.FOLLOW_AT_in_rec_rule152); if (java.security.Signature.state.failed) {
                                    return isLeftRec;
                                }

                                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                    return isLeftRec;
                                }

                                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_rec_rule154); if (java.security.Signature.state.failed) {
                                    return isLeftRec;
                                }

                                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ACTION, LeftRecursiveRuleWalker.FOLLOW_ACTION_in_rec_rule156); if (java.security.Signature.state.failed) {
                                    return isLeftRec;
                                }

                                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                    return isLeftRec;
                                }


                            }
                            break;
                        }


                        default: {
                            break loop5;
                        }

                    }
                }

                pushFollow(LeftRecursiveRuleWalker.FOLLOW_ruleBlock_in_rec_rule172);
                ruleBlock1 = this.ruleBlock();
                java.security.Signature.state._fsp--;
                if (java.security.Signature.state.failed) {
                    return isLeftRec;
                }

                if (java.security.Signature.state.backtracking === 0) { isLeftRec = (ruleBlock1 !== null ? (ruleBlock1 as LeftRecursiveRuleWalker.ruleBlock_return).isLeftRec : false); }
                pushFollow(LeftRecursiveRuleWalker.FOLLOW_exceptionGroup_in_rec_rule179);
                this.exceptionGroup();
                java.security.Signature.state._fsp--;
                if (java.security.Signature.state.failed) {
                    return isLeftRec;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                    return isLeftRec;
                }


            }

        }

        finally {
            // do for sure before leaving
        }
        return isLeftRec;
    }
    // $ANTLR end "rec_rule"



    // $ANTLR start "exceptionGroup"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:83:1: exceptionGroup : ( exceptionHandler )* ( finallyClause )? ;
    public readonly exceptionGroup(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:5: ( ( exceptionHandler )* ( finallyClause )? )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:7: ( exceptionHandler )* ( finallyClause )?
            {
                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:7: ( exceptionHandler )*
                loop6:
                while (true) {
                    let alt6 = 2;
                    let LA6_0 = input.LA(1);
                    if ((LA6_0 === LeftRecursiveRuleWalker.CATCH)) {
                        alt6 = 1;
                    }

                    switch (alt6) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:7: exceptionHandler
                            {
                                pushFollow(LeftRecursiveRuleWalker.FOLLOW_exceptionHandler_in_exceptionGroup197);
                                this.exceptionHandler();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return;
                                }

                            }
                            break;
                        }


                        default: {
                            break loop6;
                        }

                    }
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:25: ( finallyClause )?
                let alt7 = 2;
                let LA7_0 = input.LA(1);
                if ((LA7_0 === LeftRecursiveRuleWalker.FINALLY)) {
                    alt7 = 1;
                }
                switch (alt7) {
                    case 1: {
                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:84:25: finallyClause
                        {
                            pushFollow(LeftRecursiveRuleWalker.FOLLOW_finallyClause_in_exceptionGroup200);
                            this.finallyClause();
                            java.security.Signature.state._fsp--;
                            if (java.security.Signature.state.failed) {
                                return;
                            }

                        }
                        break;
                    }


                    default:


                }

            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "exceptionGroup"



    // $ANTLR start "exceptionHandler"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:87:1: exceptionHandler : ^( CATCH ARG_ACTION ACTION ) ;
    public readonly exceptionHandler(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:88:2: ( ^( CATCH ARG_ACTION ACTION ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:88:4: ^( CATCH ARG_ACTION ACTION )
            {
                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.CATCH, LeftRecursiveRuleWalker.FOLLOW_CATCH_in_exceptionHandler216); if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ARG_ACTION, LeftRecursiveRuleWalker.FOLLOW_ARG_ACTION_in_exceptionHandler218); if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ACTION, LeftRecursiveRuleWalker.FOLLOW_ACTION_in_exceptionHandler220); if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                    return;
                }


            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "exceptionHandler"



    // $ANTLR start "finallyClause"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:91:1: finallyClause : ^( FINALLY ACTION ) ;
    public readonly finallyClause(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:92:2: ( ^( FINALLY ACTION ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:92:4: ^( FINALLY ACTION )
            {
                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.FINALLY, LeftRecursiveRuleWalker.FOLLOW_FINALLY_in_finallyClause233); if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ACTION, LeftRecursiveRuleWalker.FOLLOW_ACTION_in_finallyClause235); if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                    return;
                }


            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "finallyClause"



    // $ANTLR start "ruleModifier"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:95:1: ruleModifier : ( PUBLIC | PRIVATE | PROTECTED );
    public readonly ruleModifier(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:96:5: ( PUBLIC | PRIVATE | PROTECTED )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:
            {
                if ((input.LA(1) >= LeftRecursiveRuleWalker.PRIVATE && input.LA(1) <= LeftRecursiveRuleWalker.PUBLIC)) {
                    input.consume();
                    java.security.Signature.state.errorRecovery = false;
                    java.security.Signature.state.failed = false;
                }
                else {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                    let mse = new MismatchedSetException(null, input);
                    throw mse;
                }
            }

        }

        finally {
            // do for sure before leaving
        }
    }


    // $ANTLR start "ruleBlock"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:101:1: ruleBlock returns [boolean isLeftRec] : ^( BLOCK (o= outerAlternative )+ ) ;
    public readonly ruleBlock(): LeftRecursiveRuleWalker.ruleBlock_return {
        let retval = new LeftRecursiveRuleWalker.ruleBlock_return();
        retval.start = input.LT(1);

        let o = null;

        let lr = false; this.numAlts = (retval.start as GrammarAST).getChildCount();
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:103:2: ( ^( BLOCK (o= outerAlternative )+ ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:103:4: ^( BLOCK (o= outerAlternative )+ )
            {
                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.BLOCK, LeftRecursiveRuleWalker.FOLLOW_BLOCK_in_ruleBlock290); if (java.security.Signature.state.failed) {
                    return retval;
                }

                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                    return retval;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:104:4: (o= outerAlternative )+
                let cnt8 = 0;
                loop8:
                while (true) {
                    let alt8 = 2;
                    let LA8_0 = input.LA(1);
                    if ((LA8_0 === LeftRecursiveRuleWalker.ALT)) {
                        alt8 = 1;
                    }

                    switch (alt8) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:105:5: o= outerAlternative
                            {
                                pushFollow(LeftRecursiveRuleWalker.FOLLOW_outerAlternative_in_ruleBlock303);
                                o = this.outerAlternative();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                if (java.security.Signature.state.backtracking === 0) {
                                    if ((o !== null ? (o as LeftRecursiveRuleWalker.outerAlternative_return).isLeftRec : false)) {
                                        retval.isLeftRec = true;
                                    }
                                }
                                if (java.security.Signature.state.backtracking === 0) { this.currentOuterAltNumber++; }
                            }
                            break;
                        }


                        default: {
                            if (cnt8 >= 1) {
                                break loop8;
                            }

                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                            let eee = new EarlyExitException(8, input);
                            throw eee;
                        }

                    }
                    cnt8++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                    return retval;
                }


            }

        }

        finally {
            // do for sure before leaving
        }
        return retval;
    }


    // $ANTLR start "outerAlternative"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:113:1: outerAlternative returns [boolean isLeftRec] : ( ( binary )=> binary | ( prefix )=> prefix | ( suffix )=> suffix | nonLeftRecur );
    public readonly outerAlternative(): LeftRecursiveRuleWalker.outerAlternative_return {
        let retval = new LeftRecursiveRuleWalker.outerAlternative_return();
        retval.start = input.LT(1);

        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:114:5: ( ( binary )=> binary | ( prefix )=> prefix | ( suffix )=> suffix | nonLeftRecur )
            let alt9 = 4;
            let LA9_0 = input.LA(1);
            if ((LA9_0 === LeftRecursiveRuleWalker.ALT)) {
                let LA9_1 = input.LA(2);
                if ((this.synpred1_LeftRecursiveRuleWalker())) {
                    alt9 = 1;
                }
                else {
                    if ((this.synpred2_LeftRecursiveRuleWalker())) {
                        alt9 = 2;
                    }
                    else {
                        if ((this.synpred3_LeftRecursiveRuleWalker())) {
                            alt9 = 3;
                        }
                        else {
                            if ((true)) {
                                alt9 = 4;
                            }
                        }

                    }

                }


            }

            else {
                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                let nvae =
                    new NoViableAltException("", 9, 0, input);
                throw nvae;
            }

            switch (alt9) {
                case 1: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:114:9: ( binary )=> binary
                    {
                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_binary_in_outerAlternative362);
                        this.binary();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return retval;
                        }

                        if (java.security.Signature.state.backtracking === 0) { this.binaryAlt((retval.start as GrammarAST) as AltAST, this.currentOuterAltNumber); retval.isLeftRec = true; }
                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:116:9: ( prefix )=> prefix
                    {
                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_prefix_in_outerAlternative418);
                        this.prefix();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return retval;
                        }

                        if (java.security.Signature.state.backtracking === 0) { this.prefixAlt((retval.start as GrammarAST) as AltAST, this.currentOuterAltNumber); }
                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:118:9: ( suffix )=> suffix
                    {
                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_suffix_in_outerAlternative474);
                        this.suffix();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return retval;
                        }

                        if (java.security.Signature.state.backtracking === 0) { this.suffixAlt((retval.start as GrammarAST) as AltAST, this.currentOuterAltNumber); retval.isLeftRec = true; }
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:120:9: nonLeftRecur
                    {
                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_nonLeftRecur_in_outerAlternative515);
                        this.nonLeftRecur();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return retval;
                        }

                        if (java.security.Signature.state.backtracking === 0) { this.otherAlt((retval.start as GrammarAST) as AltAST, this.currentOuterAltNumber); }
                    }
                    break;
                }


                default:


            }
        }

        finally {
            // do for sure before leaving
        }
        return retval;
    }
    // $ANTLR end "outerAlternative"



    // $ANTLR start "binary"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:123:1: binary : ^( ALT ( elementOptions )? recurse ( element )* recurse ( epsilonElement )* ) ;
    public readonly binary(): void {
        let ALT2 = null;

        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:2: ( ^( ALT ( elementOptions )? recurse ( element )* recurse ( epsilonElement )* ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:4: ^( ALT ( elementOptions )? recurse ( element )* recurse ( epsilonElement )* )
            {
                ALT2 = java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ALT, LeftRecursiveRuleWalker.FOLLOW_ALT_in_binary541) as GrammarAST; if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                    return;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:11: ( elementOptions )?
                let alt10 = 2;
                let LA10_0 = input.LA(1);
                if ((LA10_0 === LeftRecursiveRuleWalker.ELEMENT_OPTIONS)) {
                    alt10 = 1;
                }
                switch (alt10) {
                    case 1: {
                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:11: elementOptions
                        {
                            pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_binary543);
                            this.elementOptions();
                            java.security.Signature.state._fsp--;
                            if (java.security.Signature.state.failed) {
                                return;
                            }

                        }
                        break;
                    }


                    default:


                }

                pushFollow(LeftRecursiveRuleWalker.FOLLOW_recurse_in_binary546);
                this.recurse();
                java.security.Signature.state._fsp--;
                if (java.security.Signature.state.failed) {
                    return;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:35: ( element )*
                loop11:
                while (true) {
                    let alt11 = 2;
                    alt11 = this.dfa11.predict(input);
                    switch (alt11) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:35: element
                            {
                                pushFollow(LeftRecursiveRuleWalker.FOLLOW_element_in_binary548);
                                this.element();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return;
                                }

                            }
                            break;
                        }


                        default: {
                            break loop11;
                        }

                    }
                }

                pushFollow(LeftRecursiveRuleWalker.FOLLOW_recurse_in_binary551);
                this.recurse();
                java.security.Signature.state._fsp--;
                if (java.security.Signature.state.failed) {
                    return;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:52: ( epsilonElement )*
                loop12:
                while (true) {
                    let alt12 = 2;
                    let LA12_0 = input.LA(1);
                    if ((LA12_0 === LeftRecursiveRuleWalker.ACTION || LA12_0 === LeftRecursiveRuleWalker.SEMPRED || LA12_0 === LeftRecursiveRuleWalker.EPSILON)) {
                        alt12 = 1;
                    }

                    switch (alt12) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:124:52: epsilonElement
                            {
                                pushFollow(LeftRecursiveRuleWalker.FOLLOW_epsilonElement_in_binary553);
                                this.epsilonElement();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return;
                                }

                            }
                            break;
                        }


                        default: {
                            break loop12;
                        }

                    }
                }

                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                    return;
                }


                if (java.security.Signature.state.backtracking === 0) { this.setAltAssoc(ALT2 as AltAST, this.currentOuterAltNumber); }
            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "binary"



    // $ANTLR start "prefix"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:128:1: prefix : ^( ALT ( elementOptions )? ( element )+ recurse ( epsilonElement )* ) ;
    public readonly prefix(): void {
        let ALT3 = null;

        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:129:2: ( ^( ALT ( elementOptions )? ( element )+ recurse ( epsilonElement )* ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:129:4: ^( ALT ( elementOptions )? ( element )+ recurse ( epsilonElement )* )
            {
                ALT3 = java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ALT, LeftRecursiveRuleWalker.FOLLOW_ALT_in_prefix579) as GrammarAST; if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                    return;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:129:11: ( elementOptions )?
                let alt13 = 2;
                let LA13_0 = input.LA(1);
                if ((LA13_0 === LeftRecursiveRuleWalker.ELEMENT_OPTIONS)) {
                    alt13 = 1;
                }
                switch (alt13) {
                    case 1: {
                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:129:11: elementOptions
                        {
                            pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_prefix581);
                            this.elementOptions();
                            java.security.Signature.state._fsp--;
                            if (java.security.Signature.state.failed) {
                                return;
                            }

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:130:4: ( element )+
                let cnt14 = 0;
                loop14:
                while (true) {
                    let alt14 = 2;
                    alt14 = this.dfa14.predict(input);
                    switch (alt14) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:130:4: element
                            {
                                pushFollow(LeftRecursiveRuleWalker.FOLLOW_element_in_prefix587);
                                this.element();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return;
                                }

                            }
                            break;
                        }


                        default: {
                            if (cnt14 >= 1) {
                                break loop14;
                            }

                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                            let eee = new EarlyExitException(14, input);
                            throw eee;
                        }

                    }
                    cnt14++;
                }

                pushFollow(LeftRecursiveRuleWalker.FOLLOW_recurse_in_prefix593);
                this.recurse();
                java.security.Signature.state._fsp--;
                if (java.security.Signature.state.failed) {
                    return;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:131:12: ( epsilonElement )*
                loop15:
                while (true) {
                    let alt15 = 2;
                    let LA15_0 = input.LA(1);
                    if ((LA15_0 === LeftRecursiveRuleWalker.ACTION || LA15_0 === LeftRecursiveRuleWalker.SEMPRED || LA15_0 === LeftRecursiveRuleWalker.EPSILON)) {
                        alt15 = 1;
                    }

                    switch (alt15) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:131:12: epsilonElement
                            {
                                pushFollow(LeftRecursiveRuleWalker.FOLLOW_epsilonElement_in_prefix595);
                                this.epsilonElement();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return;
                                }

                            }
                            break;
                        }


                        default: {
                            break loop15;
                        }

                    }
                }

                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                    return;
                }


                if (java.security.Signature.state.backtracking === 0) { this.setAltAssoc(ALT3 as AltAST, this.currentOuterAltNumber); }
            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "prefix"



    // $ANTLR start "suffix"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:136:1: suffix : ^( ALT ( elementOptions )? recurse ( element )+ ) ;
    public readonly suffix(): void {
        let ALT4 = null;

        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:5: ( ^( ALT ( elementOptions )? recurse ( element )+ ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:9: ^( ALT ( elementOptions )? recurse ( element )+ )
            {
                ALT4 = java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ALT, LeftRecursiveRuleWalker.FOLLOW_ALT_in_suffix630) as GrammarAST; if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                    return;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:16: ( elementOptions )?
                let alt16 = 2;
                let LA16_0 = input.LA(1);
                if ((LA16_0 === LeftRecursiveRuleWalker.ELEMENT_OPTIONS)) {
                    alt16 = 1;
                }
                switch (alt16) {
                    case 1: {
                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:16: elementOptions
                        {
                            pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_suffix632);
                            this.elementOptions();
                            java.security.Signature.state._fsp--;
                            if (java.security.Signature.state.failed) {
                                return;
                            }

                        }
                        break;
                    }


                    default:


                }

                pushFollow(LeftRecursiveRuleWalker.FOLLOW_recurse_in_suffix635);
                this.recurse();
                java.security.Signature.state._fsp--;
                if (java.security.Signature.state.failed) {
                    return;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:40: ( element )+
                let cnt17 = 0;
                loop17:
                while (true) {
                    let alt17 = 2;
                    let LA17_0 = input.LA(1);
                    if ((LA17_0 === LeftRecursiveRuleWalker.ACTION || LA17_0 === LeftRecursiveRuleWalker.ASSIGN || LA17_0 === LeftRecursiveRuleWalker.DOT || LA17_0 === LeftRecursiveRuleWalker.NOT || LA17_0 === LeftRecursiveRuleWalker.PLUS_ASSIGN || LA17_0 === LeftRecursiveRuleWalker.RANGE || LA17_0 === LeftRecursiveRuleWalker.RULE_REF || LA17_0 === LeftRecursiveRuleWalker.SEMPRED || LA17_0 === LeftRecursiveRuleWalker.STRING_LITERAL || LA17_0 === LeftRecursiveRuleWalker.TOKEN_REF || (LA17_0 >= LeftRecursiveRuleWalker.BLOCK && LA17_0 <= LeftRecursiveRuleWalker.CLOSURE) || LA17_0 === LeftRecursiveRuleWalker.EPSILON || (LA17_0 >= LeftRecursiveRuleWalker.OPTIONAL && LA17_0 <= LeftRecursiveRuleWalker.POSITIVE_CLOSURE) || (LA17_0 >= LeftRecursiveRuleWalker.SET && LA17_0 <= LeftRecursiveRuleWalker.WILDCARD))) {
                        alt17 = 1;
                    }

                    switch (alt17) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:137:40: element
                            {
                                pushFollow(LeftRecursiveRuleWalker.FOLLOW_element_in_suffix637);
                                this.element();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return;
                                }

                            }
                            break;
                        }


                        default: {
                            if (cnt17 >= 1) {
                                break loop17;
                            }

                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                            let eee = new EarlyExitException(17, input);
                            throw eee;
                        }

                    }
                    cnt17++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                    return;
                }


                if (java.security.Signature.state.backtracking === 0) { this.setAltAssoc(ALT4 as AltAST, this.currentOuterAltNumber); }
            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "suffix"



    // $ANTLR start "nonLeftRecur"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:141:1: nonLeftRecur : ^( ALT ( elementOptions )? ( element )+ ) ;
    public readonly nonLeftRecur(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:5: ( ^( ALT ( elementOptions )? ( element )+ ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:9: ^( ALT ( elementOptions )? ( element )+ )
            {
                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ALT, LeftRecursiveRuleWalker.FOLLOW_ALT_in_nonLeftRecur671); if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                    return;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:15: ( elementOptions )?
                let alt18 = 2;
                let LA18_0 = input.LA(1);
                if ((LA18_0 === LeftRecursiveRuleWalker.ELEMENT_OPTIONS)) {
                    alt18 = 1;
                }
                switch (alt18) {
                    case 1: {
                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:15: elementOptions
                        {
                            pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_nonLeftRecur673);
                            this.elementOptions();
                            java.security.Signature.state._fsp--;
                            if (java.security.Signature.state.failed) {
                                return;
                            }

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:31: ( element )+
                let cnt19 = 0;
                loop19:
                while (true) {
                    let alt19 = 2;
                    let LA19_0 = input.LA(1);
                    if ((LA19_0 === LeftRecursiveRuleWalker.ACTION || LA19_0 === LeftRecursiveRuleWalker.ASSIGN || LA19_0 === LeftRecursiveRuleWalker.DOT || LA19_0 === LeftRecursiveRuleWalker.NOT || LA19_0 === LeftRecursiveRuleWalker.PLUS_ASSIGN || LA19_0 === LeftRecursiveRuleWalker.RANGE || LA19_0 === LeftRecursiveRuleWalker.RULE_REF || LA19_0 === LeftRecursiveRuleWalker.SEMPRED || LA19_0 === LeftRecursiveRuleWalker.STRING_LITERAL || LA19_0 === LeftRecursiveRuleWalker.TOKEN_REF || (LA19_0 >= LeftRecursiveRuleWalker.BLOCK && LA19_0 <= LeftRecursiveRuleWalker.CLOSURE) || LA19_0 === LeftRecursiveRuleWalker.EPSILON || (LA19_0 >= LeftRecursiveRuleWalker.OPTIONAL && LA19_0 <= LeftRecursiveRuleWalker.POSITIVE_CLOSURE) || (LA19_0 >= LeftRecursiveRuleWalker.SET && LA19_0 <= LeftRecursiveRuleWalker.WILDCARD))) {
                        alt19 = 1;
                    }

                    switch (alt19) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:142:31: element
                            {
                                pushFollow(LeftRecursiveRuleWalker.FOLLOW_element_in_nonLeftRecur676);
                                this.element();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return;
                                }

                            }
                            break;
                        }


                        default: {
                            if (cnt19 >= 1) {
                                break loop19;
                            }

                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                            let eee = new EarlyExitException(19, input);
                            throw eee;
                        }

                    }
                    cnt19++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                    return;
                }


            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "nonLeftRecur"



    // $ANTLR start "recurse"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:145:1: recurse : ( ^( ASSIGN ID recurseNoLabel ) | ^( PLUS_ASSIGN ID recurseNoLabel ) | recurseNoLabel );
    public readonly recurse(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:146:2: ( ^( ASSIGN ID recurseNoLabel ) | ^( PLUS_ASSIGN ID recurseNoLabel ) | recurseNoLabel )
            let alt20 = 3;
            switch (input.LA(1)) {
                case ASSIGN: {
                    {
                        alt20 = 1;
                    }
                    break;
                }

                case PLUS_ASSIGN: {
                    {
                        alt20 = 2;
                    }
                    break;
                }

                case RULE_REF: {
                    {
                        alt20 = 3;
                    }
                    break;
                }

                default: {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                    let nvae =
                        new NoViableAltException("", 20, 0, input);
                    throw nvae;
                }

            }
            switch (alt20) {
                case 1: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:146:4: ^( ASSIGN ID recurseNoLabel )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ASSIGN, LeftRecursiveRuleWalker.FOLLOW_ASSIGN_in_recurse693); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_recurse695); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_recurseNoLabel_in_recurse697);
                        this.recurseNoLabel();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:147:4: ^( PLUS_ASSIGN ID recurseNoLabel )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.PLUS_ASSIGN, LeftRecursiveRuleWalker.FOLLOW_PLUS_ASSIGN_in_recurse704); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_recurse706); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_recurseNoLabel_in_recurse708);
                        this.recurseNoLabel();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:148:4: recurseNoLabel
                    {
                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_recurseNoLabel_in_recurse714);
                        this.recurseNoLabel();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }


                default:


            }
        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "recurse"



    // $ANTLR start "recurseNoLabel"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:151:1: recurseNoLabel :{...}? RULE_REF ;
    public readonly recurseNoLabel(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:151:16: ({...}? RULE_REF )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:151:18: {...}? RULE_REF
            {
                if (!(((input.LT(1) as CommonTree).getText().equals(this.ruleName)))) {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                    throw new FailedPredicateException(input, "recurseNoLabel", "((CommonTree)input.LT(1)).getText().equals(ruleName)");
                }
                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.RULE_REF, LeftRecursiveRuleWalker.FOLLOW_RULE_REF_in_recurseNoLabel726); if (java.security.Signature.state.failed) {
                    return;
                }

            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "recurseNoLabel"



    // $ANTLR start "token"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:153:1: token returns [GrammarAST t=null] : ( ^( ASSIGN ID s= token ) | ^( PLUS_ASSIGN ID s= token ) |b= STRING_LITERAL | ^(b= STRING_LITERAL elementOptions ) | ^(c= TOKEN_REF elementOptions ) |c= TOKEN_REF );
    public readonly token(): GrammarAST {
        let t = null;


        let b = null;
        let c = null;
        let s = null;

        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:154:2: ( ^( ASSIGN ID s= token ) | ^( PLUS_ASSIGN ID s= token ) |b= STRING_LITERAL | ^(b= STRING_LITERAL elementOptions ) | ^(c= TOKEN_REF elementOptions ) |c= TOKEN_REF )
            let alt21 = 6;
            switch (input.LA(1)) {
                case ASSIGN: {
                    {
                        alt21 = 1;
                    }
                    break;
                }

                case PLUS_ASSIGN: {
                    {
                        alt21 = 2;
                    }
                    break;
                }

                case STRING_LITERAL: {
                    {
                        let LA21_3 = input.LA(2);
                        if ((LA21_3 === DOWN)) {
                            alt21 = 4;
                        }
                        else {
                            if ((LA21_3 === UP)) {
                                alt21 = 3;
                            }

                            else {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return t; }
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 21, 3, input);
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
                        let LA21_4 = input.LA(2);
                        if ((LA21_4 === DOWN)) {
                            alt21 = 5;
                        }
                        else {
                            if ((LA21_4 === UP)) {
                                alt21 = 6;
                            }

                            else {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return t; }
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 21, 4, input);
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
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return t; }
                    let nvae =
                        new NoViableAltException("", 21, 0, input);
                    throw nvae;
                }

            }
            switch (alt21) {
                case 1: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:154:4: ^( ASSIGN ID s= token )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ASSIGN, LeftRecursiveRuleWalker.FOLLOW_ASSIGN_in_token740); if (java.security.Signature.state.failed) {
                            return t;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return t;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_token742); if (java.security.Signature.state.failed) {
                            return t;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_token_in_token746);
                        s = this.token();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return t;
                        }

                        if (java.security.Signature.state.backtracking === 0) { t = s; }
                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return t;
                        }


                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:155:4: ^( PLUS_ASSIGN ID s= token )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.PLUS_ASSIGN, LeftRecursiveRuleWalker.FOLLOW_PLUS_ASSIGN_in_token755); if (java.security.Signature.state.failed) {
                            return t;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return t;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_token757); if (java.security.Signature.state.failed) {
                            return t;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_token_in_token761);
                        s = this.token();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return t;
                        }

                        if (java.security.Signature.state.backtracking === 0) { t = s; }
                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return t;
                        }


                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:156:4: b= STRING_LITERAL
                    {
                        b = java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.STRING_LITERAL, LeftRecursiveRuleWalker.FOLLOW_STRING_LITERAL_in_token771) as GrammarAST; if (java.security.Signature.state.failed) {
                            return t;
                        }

                        if (java.security.Signature.state.backtracking === 0) { t = b; }
                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:157:7: ^(b= STRING_LITERAL elementOptions )
                    {
                        b = java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.STRING_LITERAL, LeftRecursiveRuleWalker.FOLLOW_STRING_LITERAL_in_token792) as GrammarAST; if (java.security.Signature.state.failed) {
                            return t;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return t;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_token794);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return t;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return t;
                        }


                        if (java.security.Signature.state.backtracking === 0) { t = b; }
                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:158:7: ^(c= TOKEN_REF elementOptions )
                    {
                        c = java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.TOKEN_REF, LeftRecursiveRuleWalker.FOLLOW_TOKEN_REF_in_token809) as GrammarAST; if (java.security.Signature.state.failed) {
                            return t;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return t;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_token811);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return t;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return t;
                        }


                        if (java.security.Signature.state.backtracking === 0) { t = c; }
                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:159:4: c= TOKEN_REF
                    {
                        c = java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.TOKEN_REF, LeftRecursiveRuleWalker.FOLLOW_TOKEN_REF_in_token823) as GrammarAST; if (java.security.Signature.state.failed) {
                            return t;
                        }

                        if (java.security.Signature.state.backtracking === 0) { t = c; }
                    }
                    break;
                }


                default:


            }
        }

        finally {
            // do for sure before leaving
        }
        return t;
    }
    // $ANTLR end "token"



    // $ANTLR start "elementOptions"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:162:1: elementOptions : ^( ELEMENT_OPTIONS ( elementOption )* ) ;
    public readonly elementOptions(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:163:5: ( ^( ELEMENT_OPTIONS ( elementOption )* ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:163:7: ^( ELEMENT_OPTIONS ( elementOption )* )
            {
                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ELEMENT_OPTIONS, LeftRecursiveRuleWalker.FOLLOW_ELEMENT_OPTIONS_in_elementOptions853); if (java.security.Signature.state.failed) {
                    return;
                }

                if (input.LA(1) === Token.DOWN) {
                    java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                        return;
                    }

                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:163:25: ( elementOption )*
                    loop22:
                    while (true) {
                        let alt22 = 2;
                        let LA22_0 = input.LA(1);
                        if ((LA22_0 === LeftRecursiveRuleWalker.ASSIGN || LA22_0 === LeftRecursiveRuleWalker.ID)) {
                            alt22 = 1;
                        }

                        switch (alt22) {
                            case 1: {
                                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:163:25: elementOption
                                {
                                    pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOption_in_elementOptions855);
                                    this.elementOption();
                                    java.security.Signature.state._fsp--;
                                    if (java.security.Signature.state.failed) {
                                        return;
                                    }

                                }
                                break;
                            }


                            default: {
                                break loop22;
                            }

                        }
                    }

                    java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                        return;
                    }

                }

            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "elementOptions"



    // $ANTLR start "elementOption"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:166:1: elementOption : ( ID | ^( ASSIGN ID ID ) | ^( ASSIGN ID STRING_LITERAL ) | ^( ASSIGN ID ACTION ) | ^( ASSIGN ID INT ) );
    public readonly elementOption(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:167:5: ( ID | ^( ASSIGN ID ID ) | ^( ASSIGN ID STRING_LITERAL ) | ^( ASSIGN ID ACTION ) | ^( ASSIGN ID INT ) )
            let alt23 = 5;
            let LA23_0 = input.LA(1);
            if ((LA23_0 === LeftRecursiveRuleWalker.ID)) {
                alt23 = 1;
            }
            else {
                if ((LA23_0 === LeftRecursiveRuleWalker.ASSIGN)) {
                    let LA23_2 = input.LA(2);
                    if ((LA23_2 === DOWN)) {
                        let LA23_3 = input.LA(3);
                        if ((LA23_3 === LeftRecursiveRuleWalker.ID)) {
                            switch (input.LA(4)) {
                                case ID: {
                                    {
                                        alt23 = 2;
                                    }
                                    break;
                                }

                                case STRING_LITERAL: {
                                    {
                                        alt23 = 3;
                                    }
                                    break;
                                }

                                case ACTION: {
                                    {
                                        alt23 = 4;
                                    }
                                    break;
                                }

                                case INT: {
                                    {
                                        alt23 = 5;
                                    }
                                    break;
                                }

                                default: {
                                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                                    let nvaeMark = input.mark();
                                    try {
                                        for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                            input.consume();
                                        }
                                        let nvae =
                                            new NoViableAltException("", 23, 4, input);
                                        throw nvae;
                                    } finally {
                                        input.rewind(nvaeMark);
                                    }
                                }

                            }
                        }

                        else {
                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                            let nvaeMark = input.mark();
                            try {
                                for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                    input.consume();
                                }
                                let nvae =
                                    new NoViableAltException("", 23, 3, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }

                    }

                    else {
                        if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                        let nvaeMark = input.mark();
                        try {
                            input.consume();
                            let nvae =
                                new NoViableAltException("", 23, 2, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }

                }

                else {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                    let nvae =
                        new NoViableAltException("", 23, 0, input);
                    throw nvae;
                }
            }


            switch (alt23) {
                case 1: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:167:7: ID
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_elementOption874); if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:168:9: ^( ASSIGN ID ID )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ASSIGN, LeftRecursiveRuleWalker.FOLLOW_ASSIGN_in_elementOption885); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_elementOption887); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_elementOption889); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:169:9: ^( ASSIGN ID STRING_LITERAL )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ASSIGN, LeftRecursiveRuleWalker.FOLLOW_ASSIGN_in_elementOption901); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_elementOption903); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.STRING_LITERAL, LeftRecursiveRuleWalker.FOLLOW_STRING_LITERAL_in_elementOption905); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:170:9: ^( ASSIGN ID ACTION )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ASSIGN, LeftRecursiveRuleWalker.FOLLOW_ASSIGN_in_elementOption917); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_elementOption919); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ACTION, LeftRecursiveRuleWalker.FOLLOW_ACTION_in_elementOption921); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:171:9: ^( ASSIGN ID INT )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ASSIGN, LeftRecursiveRuleWalker.FOLLOW_ASSIGN_in_elementOption933); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_elementOption935); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.INT, LeftRecursiveRuleWalker.FOLLOW_INT_in_elementOption937); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }


                default:


            }
        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "elementOption"



    // $ANTLR start "element"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:174:1: element : ( atom | ^( NOT element ) | ^( RANGE atom atom ) | ^( ASSIGN ID element ) | ^( PLUS_ASSIGN ID element ) | ^( SET ( setElement )+ ) | RULE_REF | ebnf | epsilonElement );
    public readonly element(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:175:2: ( atom | ^( NOT element ) | ^( RANGE atom atom ) | ^( ASSIGN ID element ) | ^( PLUS_ASSIGN ID element ) | ^( SET ( setElement )+ ) | RULE_REF | ebnf | epsilonElement )
            let alt25 = 9;
            switch (input.LA(1)) {
                case RULE_REF: {
                    {
                        let LA25_1 = input.LA(2);
                        if ((LA25_1 === DOWN)) {
                            alt25 = 1;
                        }
                        else {
                            if (((LA25_1 >= UP && LA25_1 <= LeftRecursiveRuleWalker.ACTION) || LA25_1 === LeftRecursiveRuleWalker.ASSIGN || LA25_1 === LeftRecursiveRuleWalker.DOT || LA25_1 === LeftRecursiveRuleWalker.NOT || LA25_1 === LeftRecursiveRuleWalker.PLUS_ASSIGN || LA25_1 === LeftRecursiveRuleWalker.RANGE || LA25_1 === LeftRecursiveRuleWalker.RULE_REF || LA25_1 === LeftRecursiveRuleWalker.SEMPRED || LA25_1 === LeftRecursiveRuleWalker.STRING_LITERAL || LA25_1 === LeftRecursiveRuleWalker.TOKEN_REF || (LA25_1 >= LeftRecursiveRuleWalker.BLOCK && LA25_1 <= LeftRecursiveRuleWalker.CLOSURE) || LA25_1 === LeftRecursiveRuleWalker.EPSILON || (LA25_1 >= LeftRecursiveRuleWalker.OPTIONAL && LA25_1 <= LeftRecursiveRuleWalker.POSITIVE_CLOSURE) || (LA25_1 >= LeftRecursiveRuleWalker.SET && LA25_1 <= LeftRecursiveRuleWalker.WILDCARD))) {
                                alt25 = 7;
                            }

                            else {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 25, 1, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }


                    }
                    break;
                }

                case DOT:
                case STRING_LITERAL:
                case TOKEN_REF:
                case WILDCARD: {
                    {
                        alt25 = 1;
                    }
                    break;
                }

                case NOT: {
                    {
                        alt25 = 2;
                    }
                    break;
                }

                case RANGE: {
                    {
                        alt25 = 3;
                    }
                    break;
                }

                case ASSIGN: {
                    {
                        alt25 = 4;
                    }
                    break;
                }

                case PLUS_ASSIGN: {
                    {
                        alt25 = 5;
                    }
                    break;
                }

                case SET: {
                    {
                        alt25 = 6;
                    }
                    break;
                }

                case BLOCK:
                case CLOSURE:
                case javax.security.auth.login.AppConfigurationEntry.LoginModuleControlFlag.OPTIONAL:
                case POSITIVE_CLOSURE: {
                    {
                        alt25 = 8;
                    }
                    break;
                }

                case ACTION:
                case SEMPRED:
                case EPSILON: {
                    {
                        alt25 = 9;
                    }
                    break;
                }

                default: {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                    let nvae =
                        new NoViableAltException("", 25, 0, input);
                    throw nvae;
                }

            }
            switch (alt25) {
                case 1: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:175:4: atom
                    {
                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_atom_in_element952);
                        this.atom();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:176:4: ^( NOT element )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.NOT, LeftRecursiveRuleWalker.FOLLOW_NOT_in_element958); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_element_in_element960);
                        this.element();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:177:4: ^( RANGE atom atom )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.RANGE, LeftRecursiveRuleWalker.FOLLOW_RANGE_in_element967); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_atom_in_element969);
                        this.atom();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_atom_in_element971);
                        this.atom();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:178:4: ^( ASSIGN ID element )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ASSIGN, LeftRecursiveRuleWalker.FOLLOW_ASSIGN_in_element978); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_element980); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_element_in_element982);
                        this.element();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:179:4: ^( PLUS_ASSIGN ID element )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.PLUS_ASSIGN, LeftRecursiveRuleWalker.FOLLOW_PLUS_ASSIGN_in_element989); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_element991); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_element_in_element993);
                        this.element();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:180:7: ^( SET ( setElement )+ )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.SET, LeftRecursiveRuleWalker.FOLLOW_SET_in_element1003); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:180:13: ( setElement )+
                        let cnt24 = 0;
                        loop24:
                        while (true) {
                            let alt24 = 2;
                            let LA24_0 = input.LA(1);
                            if ((LA24_0 === LeftRecursiveRuleWalker.STRING_LITERAL || LA24_0 === LeftRecursiveRuleWalker.TOKEN_REF)) {
                                alt24 = 1;
                            }

                            switch (alt24) {
                                case 1: {
                                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:180:13: setElement
                                    {
                                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_setElement_in_element1005);
                                        this.setElement();
                                        java.security.Signature.state._fsp--;
                                        if (java.security.Signature.state.failed) {
                                            return;
                                        }

                                    }
                                    break;
                                }


                                default: {
                                    if (cnt24 >= 1) {
                                        break loop24;
                                    }

                                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                                    let eee = new EarlyExitException(24, input);
                                    throw eee;
                                }

                            }
                            cnt24++;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 7: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:181:9: RULE_REF
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.RULE_REF, LeftRecursiveRuleWalker.FOLLOW_RULE_REF_in_element1017); if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 8: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:182:4: ebnf
                    {
                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_ebnf_in_element1022);
                        this.ebnf();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 9: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:183:4: epsilonElement
                    {
                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_epsilonElement_in_element1027);
                        this.epsilonElement();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }


                default:


            }
        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "element"



    // $ANTLR start "epsilonElement"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:186:1: epsilonElement : ( ACTION | SEMPRED | EPSILON | ^( ACTION elementOptions ) | ^( SEMPRED elementOptions ) );
    public readonly epsilonElement(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:187:2: ( ACTION | SEMPRED | EPSILON | ^( ACTION elementOptions ) | ^( SEMPRED elementOptions ) )
            let alt26 = 5;
            switch (input.LA(1)) {
                case ACTION: {
                    {
                        let LA26_1 = input.LA(2);
                        if ((LA26_1 === DOWN)) {
                            alt26 = 4;
                        }
                        else {
                            if (((LA26_1 >= UP && LA26_1 <= LeftRecursiveRuleWalker.ACTION) || LA26_1 === LeftRecursiveRuleWalker.ASSIGN || LA26_1 === LeftRecursiveRuleWalker.DOT || LA26_1 === LeftRecursiveRuleWalker.NOT || LA26_1 === LeftRecursiveRuleWalker.PLUS_ASSIGN || LA26_1 === LeftRecursiveRuleWalker.RANGE || LA26_1 === LeftRecursiveRuleWalker.RULE_REF || LA26_1 === LeftRecursiveRuleWalker.SEMPRED || LA26_1 === LeftRecursiveRuleWalker.STRING_LITERAL || LA26_1 === LeftRecursiveRuleWalker.TOKEN_REF || (LA26_1 >= LeftRecursiveRuleWalker.BLOCK && LA26_1 <= LeftRecursiveRuleWalker.CLOSURE) || LA26_1 === LeftRecursiveRuleWalker.EPSILON || (LA26_1 >= LeftRecursiveRuleWalker.OPTIONAL && LA26_1 <= LeftRecursiveRuleWalker.POSITIVE_CLOSURE) || (LA26_1 >= LeftRecursiveRuleWalker.SET && LA26_1 <= LeftRecursiveRuleWalker.WILDCARD))) {
                                alt26 = 1;
                            }

                            else {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 26, 1, input);
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
                        let LA26_2 = input.LA(2);
                        if ((LA26_2 === DOWN)) {
                            alt26 = 5;
                        }
                        else {
                            if (((LA26_2 >= UP && LA26_2 <= LeftRecursiveRuleWalker.ACTION) || LA26_2 === LeftRecursiveRuleWalker.ASSIGN || LA26_2 === LeftRecursiveRuleWalker.DOT || LA26_2 === LeftRecursiveRuleWalker.NOT || LA26_2 === LeftRecursiveRuleWalker.PLUS_ASSIGN || LA26_2 === LeftRecursiveRuleWalker.RANGE || LA26_2 === LeftRecursiveRuleWalker.RULE_REF || LA26_2 === LeftRecursiveRuleWalker.SEMPRED || LA26_2 === LeftRecursiveRuleWalker.STRING_LITERAL || LA26_2 === LeftRecursiveRuleWalker.TOKEN_REF || (LA26_2 >= LeftRecursiveRuleWalker.BLOCK && LA26_2 <= LeftRecursiveRuleWalker.CLOSURE) || LA26_2 === LeftRecursiveRuleWalker.EPSILON || (LA26_2 >= LeftRecursiveRuleWalker.OPTIONAL && LA26_2 <= LeftRecursiveRuleWalker.POSITIVE_CLOSURE) || (LA26_2 >= LeftRecursiveRuleWalker.SET && LA26_2 <= LeftRecursiveRuleWalker.WILDCARD))) {
                                alt26 = 2;
                            }

                            else {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 26, 2, input);
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
                        alt26 = 3;
                    }
                    break;
                }

                default: {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                    let nvae =
                        new NoViableAltException("", 26, 0, input);
                    throw nvae;
                }

            }
            switch (alt26) {
                case 1: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:187:4: ACTION
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ACTION, LeftRecursiveRuleWalker.FOLLOW_ACTION_in_epsilonElement1038); if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:188:4: SEMPRED
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.SEMPRED, LeftRecursiveRuleWalker.FOLLOW_SEMPRED_in_epsilonElement1043); if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:189:4: EPSILON
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.EPSILON, LeftRecursiveRuleWalker.FOLLOW_EPSILON_in_epsilonElement1048); if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:190:4: ^( ACTION elementOptions )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ACTION, LeftRecursiveRuleWalker.FOLLOW_ACTION_in_epsilonElement1054); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_epsilonElement1056);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:191:4: ^( SEMPRED elementOptions )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.SEMPRED, LeftRecursiveRuleWalker.FOLLOW_SEMPRED_in_epsilonElement1063); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_epsilonElement1065);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }


                default:


            }
        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "epsilonElement"



    // $ANTLR start "setElement"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:194:1: setElement : ( ^( STRING_LITERAL elementOptions ) | ^( TOKEN_REF elementOptions ) | STRING_LITERAL | TOKEN_REF );
    public readonly setElement(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:195:2: ( ^( STRING_LITERAL elementOptions ) | ^( TOKEN_REF elementOptions ) | STRING_LITERAL | TOKEN_REF )
            let alt27 = 4;
            let LA27_0 = input.LA(1);
            if ((LA27_0 === LeftRecursiveRuleWalker.STRING_LITERAL)) {
                let LA27_1 = input.LA(2);
                if ((LA27_1 === DOWN)) {
                    alt27 = 1;
                }
                else {
                    if ((LA27_1 === UP || LA27_1 === LeftRecursiveRuleWalker.STRING_LITERAL || LA27_1 === LeftRecursiveRuleWalker.TOKEN_REF)) {
                        alt27 = 3;
                    }

                    else {
                        if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                        let nvaeMark = input.mark();
                        try {
                            input.consume();
                            let nvae =
                                new NoViableAltException("", 27, 1, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }
                }


            }
            else {
                if ((LA27_0 === LeftRecursiveRuleWalker.TOKEN_REF)) {
                    let LA27_2 = input.LA(2);
                    if ((LA27_2 === DOWN)) {
                        alt27 = 2;
                    }
                    else {
                        if ((LA27_2 === UP || LA27_2 === LeftRecursiveRuleWalker.STRING_LITERAL || LA27_2 === LeftRecursiveRuleWalker.TOKEN_REF)) {
                            alt27 = 4;
                        }

                        else {
                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                            let nvaeMark = input.mark();
                            try {
                                input.consume();
                                let nvae =
                                    new NoViableAltException("", 27, 2, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }
                    }


                }

                else {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                    let nvae =
                        new NoViableAltException("", 27, 0, input);
                    throw nvae;
                }
            }


            switch (alt27) {
                case 1: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:195:4: ^( STRING_LITERAL elementOptions )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.STRING_LITERAL, LeftRecursiveRuleWalker.FOLLOW_STRING_LITERAL_in_setElement1078); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_setElement1080);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:196:4: ^( TOKEN_REF elementOptions )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.TOKEN_REF, LeftRecursiveRuleWalker.FOLLOW_TOKEN_REF_in_setElement1087); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_setElement1089);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:197:4: STRING_LITERAL
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.STRING_LITERAL, LeftRecursiveRuleWalker.FOLLOW_STRING_LITERAL_in_setElement1095); if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:198:4: TOKEN_REF
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.TOKEN_REF, LeftRecursiveRuleWalker.FOLLOW_TOKEN_REF_in_setElement1100); if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }


                default:


            }
        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "setElement"



    // $ANTLR start "ebnf"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:201:1: ebnf : ( block | ^( OPTIONAL block ) | ^( CLOSURE block ) | ^( POSITIVE_CLOSURE block ) );
    public readonly ebnf(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:201:5: ( block | ^( OPTIONAL block ) | ^( CLOSURE block ) | ^( POSITIVE_CLOSURE block ) )
            let alt28 = 4;
            switch (input.LA(1)) {
                case BLOCK: {
                    {
                        alt28 = 1;
                    }
                    break;
                }

                case javax.security.auth.login.AppConfigurationEntry.LoginModuleControlFlag.OPTIONAL: {
                    {
                        alt28 = 2;
                    }
                    break;
                }

                case CLOSURE: {
                    {
                        alt28 = 3;
                    }
                    break;
                }

                case POSITIVE_CLOSURE: {
                    {
                        alt28 = 4;
                    }
                    break;
                }

                default: {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                    let nvae =
                        new NoViableAltException("", 28, 0, input);
                    throw nvae;
                }

            }
            switch (alt28) {
                case 1: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:201:9: block
                    {
                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_block_in_ebnf1111);
                        this.block();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:202:9: ^( OPTIONAL block )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.OPTIONAL, LeftRecursiveRuleWalker.FOLLOW_OPTIONAL_in_ebnf1123); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_block_in_ebnf1125);
                        this.block();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:203:9: ^( CLOSURE block )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.CLOSURE, LeftRecursiveRuleWalker.FOLLOW_CLOSURE_in_ebnf1139); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_block_in_ebnf1141);
                        this.block();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:204:9: ^( POSITIVE_CLOSURE block )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.POSITIVE_CLOSURE, LeftRecursiveRuleWalker.FOLLOW_POSITIVE_CLOSURE_in_ebnf1155); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_block_in_ebnf1157);
                        this.block();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }


                default:


            }
        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "ebnf"



    // $ANTLR start "block"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:207:1: block : ^( BLOCK ( ACTION )? ( alternative )+ ) ;
    public readonly block(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:5: ( ^( BLOCK ( ACTION )? ( alternative )+ ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:7: ^( BLOCK ( ACTION )? ( alternative )+ )
            {
                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.BLOCK, LeftRecursiveRuleWalker.FOLLOW_BLOCK_in_block1177); if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                    return;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:15: ( ACTION )?
                let alt29 = 2;
                let LA29_0 = input.LA(1);
                if ((LA29_0 === LeftRecursiveRuleWalker.ACTION)) {
                    alt29 = 1;
                }
                switch (alt29) {
                    case 1: {
                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:15: ACTION
                        {
                            java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ACTION, LeftRecursiveRuleWalker.FOLLOW_ACTION_in_block1179); if (java.security.Signature.state.failed) {
                                return;
                            }

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:23: ( alternative )+
                let cnt30 = 0;
                loop30:
                while (true) {
                    let alt30 = 2;
                    let LA30_0 = input.LA(1);
                    if ((LA30_0 === LeftRecursiveRuleWalker.ALT)) {
                        alt30 = 1;
                    }

                    switch (alt30) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:208:23: alternative
                            {
                                pushFollow(LeftRecursiveRuleWalker.FOLLOW_alternative_in_block1182);
                                this.alternative();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return;
                                }

                            }
                            break;
                        }


                        default: {
                            if (cnt30 >= 1) {
                                break loop30;
                            }

                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                            let eee = new EarlyExitException(30, input);
                            throw eee;
                        }

                    }
                    cnt30++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                    return;
                }


            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "block"



    // $ANTLR start "alternative"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:211:1: alternative : ^( ALT ( elementOptions )? ( element )+ ) ;
    public readonly alternative(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:2: ( ^( ALT ( elementOptions )? ( element )+ ) )
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:4: ^( ALT ( elementOptions )? ( element )+ )
            {
                java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ALT, LeftRecursiveRuleWalker.FOLLOW_ALT_in_alternative1199); if (java.security.Signature.state.failed) {
                    return;
                }

                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                    return;
                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:10: ( elementOptions )?
                let alt31 = 2;
                let LA31_0 = input.LA(1);
                if ((LA31_0 === LeftRecursiveRuleWalker.ELEMENT_OPTIONS)) {
                    alt31 = 1;
                }
                switch (alt31) {
                    case 1: {
                        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:10: elementOptions
                        {
                            pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_alternative1201);
                            this.elementOptions();
                            java.security.Signature.state._fsp--;
                            if (java.security.Signature.state.failed) {
                                return;
                            }

                        }
                        break;
                    }


                    default:


                }

                // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:26: ( element )+
                let cnt32 = 0;
                loop32:
                while (true) {
                    let alt32 = 2;
                    let LA32_0 = input.LA(1);
                    if ((LA32_0 === LeftRecursiveRuleWalker.ACTION || LA32_0 === LeftRecursiveRuleWalker.ASSIGN || LA32_0 === LeftRecursiveRuleWalker.DOT || LA32_0 === LeftRecursiveRuleWalker.NOT || LA32_0 === LeftRecursiveRuleWalker.PLUS_ASSIGN || LA32_0 === LeftRecursiveRuleWalker.RANGE || LA32_0 === LeftRecursiveRuleWalker.RULE_REF || LA32_0 === LeftRecursiveRuleWalker.SEMPRED || LA32_0 === LeftRecursiveRuleWalker.STRING_LITERAL || LA32_0 === LeftRecursiveRuleWalker.TOKEN_REF || (LA32_0 >= LeftRecursiveRuleWalker.BLOCK && LA32_0 <= LeftRecursiveRuleWalker.CLOSURE) || LA32_0 === LeftRecursiveRuleWalker.EPSILON || (LA32_0 >= LeftRecursiveRuleWalker.OPTIONAL && LA32_0 <= LeftRecursiveRuleWalker.POSITIVE_CLOSURE) || (LA32_0 >= LeftRecursiveRuleWalker.SET && LA32_0 <= LeftRecursiveRuleWalker.WILDCARD))) {
                        alt32 = 1;
                    }

                    switch (alt32) {
                        case 1: {
                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:212:26: element
                            {
                                pushFollow(LeftRecursiveRuleWalker.FOLLOW_element_in_alternative1204);
                                this.element();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return;
                                }

                            }
                            break;
                        }


                        default: {
                            if (cnt32 >= 1) {
                                break loop32;
                            }

                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                            let eee = new EarlyExitException(32, input);
                            throw eee;
                        }

                    }
                    cnt32++;
                }

                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                    return;
                }


            }

        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "alternative"



    // $ANTLR start "atom"
    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:215:1: atom : ( ^( RULE_REF ( ARG_ACTION )? ( elementOptions )? ) | ^( STRING_LITERAL elementOptions ) | STRING_LITERAL | ^( TOKEN_REF elementOptions ) | TOKEN_REF | ^( WILDCARD elementOptions ) | WILDCARD | ^( DOT ID element ) );
    public readonly atom(): void {
        try {
            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:2: ( ^( RULE_REF ( ARG_ACTION )? ( elementOptions )? ) | ^( STRING_LITERAL elementOptions ) | STRING_LITERAL | ^( TOKEN_REF elementOptions ) | TOKEN_REF | ^( WILDCARD elementOptions ) | WILDCARD | ^( DOT ID element ) )
            let alt35 = 8;
            switch (input.LA(1)) {
                case RULE_REF: {
                    {
                        alt35 = 1;
                    }
                    break;
                }

                case STRING_LITERAL: {
                    {
                        let LA35_2 = input.LA(2);
                        if ((LA35_2 === DOWN)) {
                            alt35 = 2;
                        }
                        else {
                            if (((LA35_2 >= UP && LA35_2 <= LeftRecursiveRuleWalker.ACTION) || LA35_2 === LeftRecursiveRuleWalker.ASSIGN || LA35_2 === LeftRecursiveRuleWalker.DOT || LA35_2 === LeftRecursiveRuleWalker.NOT || LA35_2 === LeftRecursiveRuleWalker.PLUS_ASSIGN || LA35_2 === LeftRecursiveRuleWalker.RANGE || LA35_2 === LeftRecursiveRuleWalker.RULE_REF || LA35_2 === LeftRecursiveRuleWalker.SEMPRED || LA35_2 === LeftRecursiveRuleWalker.STRING_LITERAL || LA35_2 === LeftRecursiveRuleWalker.TOKEN_REF || (LA35_2 >= LeftRecursiveRuleWalker.BLOCK && LA35_2 <= LeftRecursiveRuleWalker.CLOSURE) || LA35_2 === LeftRecursiveRuleWalker.EPSILON || (LA35_2 >= LeftRecursiveRuleWalker.OPTIONAL && LA35_2 <= LeftRecursiveRuleWalker.POSITIVE_CLOSURE) || (LA35_2 >= LeftRecursiveRuleWalker.SET && LA35_2 <= LeftRecursiveRuleWalker.WILDCARD))) {
                                alt35 = 3;
                            }

                            else {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 35, 2, input);
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
                        let LA35_3 = input.LA(2);
                        if ((LA35_3 === DOWN)) {
                            alt35 = 4;
                        }
                        else {
                            if (((LA35_3 >= UP && LA35_3 <= LeftRecursiveRuleWalker.ACTION) || LA35_3 === LeftRecursiveRuleWalker.ASSIGN || LA35_3 === LeftRecursiveRuleWalker.DOT || LA35_3 === LeftRecursiveRuleWalker.NOT || LA35_3 === LeftRecursiveRuleWalker.PLUS_ASSIGN || LA35_3 === LeftRecursiveRuleWalker.RANGE || LA35_3 === LeftRecursiveRuleWalker.RULE_REF || LA35_3 === LeftRecursiveRuleWalker.SEMPRED || LA35_3 === LeftRecursiveRuleWalker.STRING_LITERAL || LA35_3 === LeftRecursiveRuleWalker.TOKEN_REF || (LA35_3 >= LeftRecursiveRuleWalker.BLOCK && LA35_3 <= LeftRecursiveRuleWalker.CLOSURE) || LA35_3 === LeftRecursiveRuleWalker.EPSILON || (LA35_3 >= LeftRecursiveRuleWalker.OPTIONAL && LA35_3 <= LeftRecursiveRuleWalker.POSITIVE_CLOSURE) || (LA35_3 >= LeftRecursiveRuleWalker.SET && LA35_3 <= LeftRecursiveRuleWalker.WILDCARD))) {
                                alt35 = 5;
                            }

                            else {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 35, 3, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }


                    }
                    break;
                }

                case WILDCARD: {
                    {
                        let LA35_4 = input.LA(2);
                        if ((LA35_4 === DOWN)) {
                            alt35 = 6;
                        }
                        else {
                            if (((LA35_4 >= UP && LA35_4 <= LeftRecursiveRuleWalker.ACTION) || LA35_4 === LeftRecursiveRuleWalker.ASSIGN || LA35_4 === LeftRecursiveRuleWalker.DOT || LA35_4 === LeftRecursiveRuleWalker.NOT || LA35_4 === LeftRecursiveRuleWalker.PLUS_ASSIGN || LA35_4 === LeftRecursiveRuleWalker.RANGE || LA35_4 === LeftRecursiveRuleWalker.RULE_REF || LA35_4 === LeftRecursiveRuleWalker.SEMPRED || LA35_4 === LeftRecursiveRuleWalker.STRING_LITERAL || LA35_4 === LeftRecursiveRuleWalker.TOKEN_REF || (LA35_4 >= LeftRecursiveRuleWalker.BLOCK && LA35_4 <= LeftRecursiveRuleWalker.CLOSURE) || LA35_4 === LeftRecursiveRuleWalker.EPSILON || (LA35_4 >= LeftRecursiveRuleWalker.OPTIONAL && LA35_4 <= LeftRecursiveRuleWalker.POSITIVE_CLOSURE) || (LA35_4 >= LeftRecursiveRuleWalker.SET && LA35_4 <= LeftRecursiveRuleWalker.WILDCARD))) {
                                alt35 = 7;
                            }

                            else {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                                let nvaeMark = input.mark();
                                try {
                                    input.consume();
                                    let nvae =
                                        new NoViableAltException("", 35, 4, input);
                                    throw nvae;
                                } finally {
                                    input.rewind(nvaeMark);
                                }
                            }
                        }


                    }
                    break;
                }

                case DOT: {
                    {
                        alt35 = 8;
                    }
                    break;
                }

                default: {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return; }
                    let nvae =
                        new NoViableAltException("", 35, 0, input);
                    throw nvae;
                }

            }
            switch (alt35) {
                case 1: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:4: ^( RULE_REF ( ARG_ACTION )? ( elementOptions )? )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.RULE_REF, LeftRecursiveRuleWalker.FOLLOW_RULE_REF_in_atom1221); if (java.security.Signature.state.failed) {
                            return;
                        }

                        if (input.LA(1) === Token.DOWN) {
                            java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                return;
                            }

                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:15: ( ARG_ACTION )?
                            let alt33 = 2;
                            let LA33_0 = input.LA(1);
                            if ((LA33_0 === LeftRecursiveRuleWalker.ARG_ACTION)) {
                                alt33 = 1;
                            }
                            switch (alt33) {
                                case 1: {
                                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:15: ARG_ACTION
                                    {
                                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ARG_ACTION, LeftRecursiveRuleWalker.FOLLOW_ARG_ACTION_in_atom1223); if (java.security.Signature.state.failed) {
                                            return;
                                        }

                                    }
                                    break;
                                }


                                default:


                            }

                            // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:27: ( elementOptions )?
                            let alt34 = 2;
                            let LA34_0 = input.LA(1);
                            if ((LA34_0 === LeftRecursiveRuleWalker.ELEMENT_OPTIONS)) {
                                alt34 = 1;
                            }
                            switch (alt34) {
                                case 1: {
                                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:216:27: elementOptions
                                    {
                                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_atom1226);
                                        this.elementOptions();
                                        java.security.Signature.state._fsp--;
                                        if (java.security.Signature.state.failed) {
                                            return;
                                        }

                                    }
                                    break;
                                }


                                default:


                            }

                            java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                return;
                            }

                        }

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:217:8: ^( STRING_LITERAL elementOptions )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.STRING_LITERAL, LeftRecursiveRuleWalker.FOLLOW_STRING_LITERAL_in_atom1238); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_atom1240);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:218:4: STRING_LITERAL
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.STRING_LITERAL, LeftRecursiveRuleWalker.FOLLOW_STRING_LITERAL_in_atom1246); if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:219:7: ^( TOKEN_REF elementOptions )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.TOKEN_REF, LeftRecursiveRuleWalker.FOLLOW_TOKEN_REF_in_atom1255); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_atom1257);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:220:4: TOKEN_REF
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.TOKEN_REF, LeftRecursiveRuleWalker.FOLLOW_TOKEN_REF_in_atom1263); if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 6: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:221:7: ^( WILDCARD elementOptions )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.WILDCARD, LeftRecursiveRuleWalker.FOLLOW_WILDCARD_in_atom1272); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_elementOptions_in_atom1274);
                        this.elementOptions();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }

                case 7: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:222:4: WILDCARD
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.WILDCARD, LeftRecursiveRuleWalker.FOLLOW_WILDCARD_in_atom1280); if (java.security.Signature.state.failed) {
                            return;
                        }

                    }
                    break;
                }

                case 8: {
                    // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:223:4: ^( DOT ID element )
                    {
                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.DOT, LeftRecursiveRuleWalker.FOLLOW_DOT_in_atom1286); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, LeftRecursiveRuleWalker.ID, LeftRecursiveRuleWalker.FOLLOW_ID_in_atom1288); if (java.security.Signature.state.failed) {
                            return;
                        }

                        pushFollow(LeftRecursiveRuleWalker.FOLLOW_element_in_atom1290);
                        this.element();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return;
                        }

                        java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                            return;
                        }


                    }
                    break;
                }


                default:


            }
        }

        finally {
            // do for sure before leaving
        }
    }
    // $ANTLR end "atom"

    // $ANTLR start synpred1_LeftRecursiveRuleWalker
    public readonly synpred1_LeftRecursiveRuleWalker_fragment(): void {
        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:114:9: ( binary )
        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:114:10: binary
        {
            pushFollow(LeftRecursiveRuleWalker.FOLLOW_binary_in_synpred1_LeftRecursiveRuleWalker348);
            this.binary();
            java.security.Signature.state._fsp--;
            if (java.security.Signature.state.failed) {
                return;
            }

        }

    }
    // $ANTLR end synpred1_LeftRecursiveRuleWalker

    // $ANTLR start synpred2_LeftRecursiveRuleWalker
    public readonly synpred2_LeftRecursiveRuleWalker_fragment(): void {
        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:116:9: ( prefix )
        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:116:10: prefix
        {
            pushFollow(LeftRecursiveRuleWalker.FOLLOW_prefix_in_synpred2_LeftRecursiveRuleWalker404);
            this.prefix();
            java.security.Signature.state._fsp--;
            if (java.security.Signature.state.failed) {
                return;
            }

        }

    }
    // $ANTLR end synpred2_LeftRecursiveRuleWalker

    // $ANTLR start synpred3_LeftRecursiveRuleWalker
    public readonly synpred3_LeftRecursiveRuleWalker_fragment(): void {
        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:118:9: ( suffix )
        // org/antlr/v4/parse/LeftRecursiveRuleWalker.g:118:10: suffix
        {
            pushFollow(LeftRecursiveRuleWalker.FOLLOW_suffix_in_synpred3_LeftRecursiveRuleWalker460);
            this.suffix();
            java.security.Signature.state._fsp--;
            if (java.security.Signature.state.failed) {
                return;
            }

        }

    }
    // $ANTLR end synpred3_LeftRecursiveRuleWalker

    // Delegated rules

    public readonly synpred1_LeftRecursiveRuleWalker(): boolean {
        java.security.Signature.state.backtracking++;
        let start = input.mark();
        try {
            this.synpred1_LeftRecursiveRuleWalker_fragment(); // can never throw exception
        } catch (re) {
            if (re instanceof RecognitionException) {
                System.err.println("impossible: " + re);
            } else {
                throw re;
            }
        }
        let success = !java.security.Signature.state.failed;
        input.rewind(start);
        java.security.Signature.state.backtracking--;
        java.security.Signature.state.failed = false;
        return success;
    }
    public readonly synpred2_LeftRecursiveRuleWalker(): boolean {
        java.security.Signature.state.backtracking++;
        let start = input.mark();
        try {
            this.synpred2_LeftRecursiveRuleWalker_fragment(); // can never throw exception
        } catch (re) {
            if (re instanceof RecognitionException) {
                System.err.println("impossible: " + re);
            } else {
                throw re;
            }
        }
        let success = !java.security.Signature.state.failed;
        input.rewind(start);
        java.security.Signature.state.backtracking--;
        java.security.Signature.state.failed = false;
        return success;
    }
    public readonly synpred3_LeftRecursiveRuleWalker(): boolean {
        java.security.Signature.state.backtracking++;
        let start = input.mark();
        try {
            this.synpred3_LeftRecursiveRuleWalker_fragment(); // can never throw exception
        } catch (re) {
            if (re instanceof RecognitionException) {
                System.err.println("impossible: " + re);
            } else {
                throw re;
            }
        }
        let success = !java.security.Signature.state.failed;
        input.rewind(start);
        java.security.Signature.state.backtracking--;
        java.security.Signature.state.failed = false;
        return success;
    };;

    static {
        let numStates = LeftRecursiveRuleWalker.DFA11_transitionS.length;
        LeftRecursiveRuleWalker.DFA11_transition = new Int16Array(numStates)[];
        for (let i = 0; i < numStates; i++) {
            LeftRecursiveRuleWalker.DFA11_transition[i] = DFA.unpackEncodedString(LeftRecursiveRuleWalker.DFA11_transitionS[i]);
        }
    }

    static {
        let numStates = LeftRecursiveRuleWalker.DFA14_transitionS.length;
        LeftRecursiveRuleWalker.DFA14_transition = new Int16Array(numStates)[];
        for (let i = 0; i < numStates; i++) {
            LeftRecursiveRuleWalker.DFA14_transition[i] = DFA.unpackEncodedString(LeftRecursiveRuleWalker.DFA14_transitionS[i]);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace LeftRecursiveRuleWalker {
    export type ruleBlock_return = InstanceType<typeof LeftRecursiveRuleWalker.ruleBlock_return>;
    export type outerAlternative_return = InstanceType<typeof LeftRecursiveRuleWalker.outerAlternative_return>;
    export type DFA11 = InstanceType<LeftRecursiveRuleWalker["DFA11"]>;
    export type DFA14 = InstanceType<LeftRecursiveRuleWalker["DFA14"]>;
}
