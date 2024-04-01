// $ANTLR 3.5.3 org/antlr/v4/parse/BlockSetTransformer.g


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





export class BlockSetTransformer extends TreeRewriter {
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


    public static topdown_return = class topdown_return extends TreeRuleReturnScope {
        protected tree: GrammarAST;
        @Override
        public getTree(): GrammarAST { return this.tree; }
    };

    // $ANTLR end "topdown"


    public static setAlt_return = class setAlt_return extends TreeRuleReturnScope {
        protected tree: GrammarAST;
        @Override
        public getTree(): GrammarAST { return this.tree; }
    };

    // $ANTLR end "setAlt"


    public static ebnfBlockSet_return = class ebnfBlockSet_return extends TreeRuleReturnScope {
        protected tree: GrammarAST;
        @Override
        public getTree(): GrammarAST { return this.tree; }
    };

    // $ANTLR end "ebnfBlockSet"


    public static ebnfSuffix_return = class ebnfSuffix_return extends TreeRuleReturnScope {
        protected tree: GrammarAST;
        @Override
        public getTree(): GrammarAST { return this.tree; }
    };

    // $ANTLR end "ebnfSuffix"


    public static blockSet_return = class blockSet_return extends TreeRuleReturnScope {
        protected tree: GrammarAST;
        @Override
        public getTree(): GrammarAST { return this.tree; }
    };

    // $ANTLR end "blockSet"


    public static setElement_return = class setElement_return extends TreeRuleReturnScope {
        protected tree: GrammarAST;
        @Override
        public getTree(): GrammarAST { return this.tree; }
    };

    // $ANTLR end "setElement"


    public static elementOptions_return = class elementOptions_return extends TreeRuleReturnScope {
        protected tree: GrammarAST;
        @Override
        public getTree(): GrammarAST { return this.tree; }
    };

    // $ANTLR end "elementOptions"


    public static elementOption_return = class elementOption_return extends TreeRuleReturnScope {
        protected tree: GrammarAST;
        @Override
        public getTree(): GrammarAST { return this.tree; }
    };


    public static readonly FOLLOW_RULE_in_topdown86 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_TOKEN_REF_in_topdown91 = new java.util.BitSet([0xFFFFFFFFFFFFFFF0n, 0x00000000000FFFFFn]);
    public static readonly FOLLOW_RULE_REF_in_topdown95 = new java.util.BitSet([0xFFFFFFFFFFFFFFF0n, 0x00000000000FFFFFn]);
    public static readonly FOLLOW_setAlt_in_topdown110 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ebnfBlockSet_in_topdown118 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_blockSet_in_topdown126 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ALT_in_setAlt141 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ebnfSuffix_in_ebnfBlockSet161 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_blockSet_in_ebnfBlockSet163 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_BLOCK_in_blockSet244 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ALT_in_blockSet249 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_blockSet251 = new java.util.BitSet([0x4802000000000000n]);
    public static readonly FOLLOW_setElement_in_blockSet256 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ALT_in_blockSet263 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_blockSet265 = new java.util.BitSet([0x4802000000000000n]);
    public static readonly FOLLOW_setElement_in_blockSet268 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_BLOCK_in_blockSet313 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ALT_in_blockSet316 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_blockSet318 = new java.util.BitSet([0x4802000000000000n]);
    public static readonly FOLLOW_setElement_in_blockSet321 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ALT_in_blockSet328 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_blockSet330 = new java.util.BitSet([0x4802000000000000n]);
    public static readonly FOLLOW_setElement_in_blockSet333 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_setElement373 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_setElement375 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_STRING_LITERAL_in_setElement388 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_TOKEN_REF_in_setElement400 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOptions_in_setElement402 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_TOKEN_REF_in_setElement414 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_RANGE_in_setElement425 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_STRING_LITERAL_in_setElement429 = new java.util.BitSet([0x0800000000000000n]);
    public static readonly FOLLOW_STRING_LITERAL_in_setElement433 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ELEMENT_OPTIONS_in_elementOptions455 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_elementOption_in_elementOptions457 = new java.util.BitSet([0x0000000010000408n]);
    public static readonly FOLLOW_ID_in_elementOption470 = new java.util.BitSet([0x0000000000000002n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption476 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption480 = new java.util.BitSet([0x0000000010000000n]);
    public static readonly FOLLOW_ID_in_elementOption484 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption491 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption493 = new java.util.BitSet([0x0800000000000000n]);
    public static readonly FOLLOW_STRING_LITERAL_in_elementOption497 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption504 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption506 = new java.util.BitSet([0x0000000000000010n]);
    public static readonly FOLLOW_ACTION_in_elementOption510 = new java.util.BitSet([0x0000000000000008n]);
    public static readonly FOLLOW_ASSIGN_in_elementOption517 = new java.util.BitSet([0x0000000000000004n]);
    public static readonly FOLLOW_ID_in_elementOption519 = new java.util.BitSet([0x0000000040000000n]);
    public static readonly FOLLOW_INT_in_elementOption523 = new java.util.BitSet([0x0000000000000008n]);
    protected static readonly DFA10_eotS =
		"\174\uffff";
    protected static readonly DFA10_eofS =
		"\174\uffff";
    protected static readonly DFA10_minS =
		"\1\106\1\2\1\105\1\2\1\61\4\2\1\3\1\111\1\105\1\111\1\73\1\3\1\2\1\61" +
		"\3\2\1\73\1\34\1\3\1\61\2\3\1\4\1\3\1\2\1\3\4\2\1\3\1\2\6\3\1\34\2\3\1" +
		"\111\1\3\1\111\1\73\1\34\5\3\1\4\1\3\1\2\1\61\1\2\1\0\1\2\1\73\1\4\4\3" +
		"\1\34\1\3\2\uffff\12\3\1\4\1\3\1\2\2\3\1\2\12\3\1\34\1\3\1\34\5\3\2\4" +
		"\20\3";
    protected static readonly DFA10_maxS =
		"\1\106\1\2\1\105\1\2\1\111\1\2\2\3\1\2\1\34\1\111\1\105\1\111\1\73\1\34" +
		"\1\2\1\76\3\2\1\73\2\34\1\111\1\34\1\3\1\73\1\34\1\2\1\3\1\2\2\3\1\2\1" +
		"\34\1\2\6\3\1\34\1\3\1\34\1\111\1\105\1\111\1\73\1\34\1\3\4\34\1\73\1" +
		"\34\1\2\1\76\1\2\1\0\1\2\2\73\4\3\2\34\2\uffff\1\34\5\3\4\34\1\73\1\34" +
		"\1\2\1\3\1\34\1\2\2\3\4\34\4\3\1\34\1\3\1\34\1\3\4\34\2\73\10\3\10\34";
    protected static readonly DFA10_acceptS =
		"\106\uffff\1\1\1\2\64\uffff";
    protected static readonly DFA10_specialS =
		"\74\uffff\1\0\77\uffff}>";
    protected static readonly DFA10_transitionS = [
			"\1\1",
			"\1\2",
			"\1\3",
			"\1\4",
			"\1\10\11\uffff\1\6\2\uffff\1\7\12\uffff\1\5",
			"\1\11",
			"\1\12\1\13",
			"\1\14\1\13",
			"\1\15",
			"\1\20\6\uffff\1\17\21\uffff\1\16",
			"\1\21",
			"\1\22",
			"\1\23",
			"\1\24",
			"\1\20\6\uffff\1\17\21\uffff\1\16",
			"\1\25",
			"\1\10\11\uffff\1\6\2\uffff\1\7",
			"\1\26",
			"\1\27",
			"\1\30",
			"\1\31",
			"\1\32",
			"\1\35\6\uffff\1\34\21\uffff\1\33",
			"\1\41\11\uffff\1\37\2\uffff\1\40\12\uffff\1\36",
			"\1\44\6\uffff\1\43\21\uffff\1\42",
			"\1\45",
			"\1\50\27\uffff\1\46\1\uffff\1\51\34\uffff\1\47",
			"\1\35\6\uffff\1\34\21\uffff\1\33",
			"\1\52",
			"\1\53",
			"\1\54",
			"\1\55\1\56",
			"\1\57\1\56",
			"\1\60",
			"\1\44\6\uffff\1\43\21\uffff\1\42",
			"\1\61",
			"\1\62",
			"\1\13",
			"\1\63",
			"\1\64",
			"\1\65",
			"\1\66",
			"\1\67",
			"\1\13",
			"\1\72\6\uffff\1\71\21\uffff\1\70",
			"\1\73",
			"\1\74\101\uffff\1\22",
			"\1\75",
			"\1\76",
			"\1\77",
			"\1\13",
			"\1\20\6\uffff\1\17\21\uffff\1\16",
			"\1\20\6\uffff\1\17\21\uffff\1\16",
			"\1\20\6\uffff\1\17\21\uffff\1\16",
			"\1\20\6\uffff\1\17\21\uffff\1\16",
			"\1\102\27\uffff\1\100\1\uffff\1\103\34\uffff\1\101",
			"\1\72\6\uffff\1\71\21\uffff\1\70",
			"\1\104",
			"\1\41\11\uffff\1\37\2\uffff\1\40",
			"\1\105",
			"\1\uffff",
			"\1\110",
			"\1\111",
			"\1\114\27\uffff\1\112\1\uffff\1\115\34\uffff\1\113",
			"\1\116",
			"\1\117",
			"\1\120",
			"\1\121",
			"\1\122",
			"\1\125\6\uffff\1\124\21\uffff\1\123",
        "",
        "",
			"\1\130\6\uffff\1\127\21\uffff\1\126",
			"\1\131",
			"\1\132",
			"\1\133",
			"\1\134",
			"\1\135",
			"\1\35\6\uffff\1\34\21\uffff\1\33",
			"\1\35\6\uffff\1\34\21\uffff\1\33",
			"\1\35\6\uffff\1\34\21\uffff\1\33",
			"\1\35\6\uffff\1\34\21\uffff\1\33",
			"\1\140\27\uffff\1\136\1\uffff\1\141\34\uffff\1\137",
			"\1\125\6\uffff\1\124\21\uffff\1\123",
			"\1\142",
			"\1\143",
			"\1\130\6\uffff\1\127\21\uffff\1\126",
			"\1\144",
			"\1\145",
			"\1\56",
			"\1\44\6\uffff\1\43\21\uffff\1\42",
			"\1\44\6\uffff\1\43\21\uffff\1\42",
			"\1\44\6\uffff\1\43\21\uffff\1\42",
			"\1\44\6\uffff\1\43\21\uffff\1\42",
			"\1\146",
			"\1\147",
			"\1\150",
			"\1\151",
			"\1\152",
			"\1\56",
			"\1\153",
			"\1\56",
			"\1\72\6\uffff\1\71\21\uffff\1\70",
			"\1\72\6\uffff\1\71\21\uffff\1\70",
			"\1\72\6\uffff\1\71\21\uffff\1\70",
			"\1\72\6\uffff\1\71\21\uffff\1\70",
			"\1\156\27\uffff\1\154\1\uffff\1\157\34\uffff\1\155",
			"\1\162\27\uffff\1\160\1\uffff\1\163\34\uffff\1\161",
			"\1\164",
			"\1\165",
			"\1\166",
			"\1\167",
			"\1\170",
			"\1\171",
			"\1\172",
			"\1\173",
			"\1\125\6\uffff\1\124\21\uffff\1\123",
			"\1\125\6\uffff\1\124\21\uffff\1\123",
			"\1\125\6\uffff\1\124\21\uffff\1\123",
			"\1\125\6\uffff\1\124\21\uffff\1\123",
			"\1\130\6\uffff\1\127\21\uffff\1\126",
			"\1\130\6\uffff\1\127\21\uffff\1\126",
			"\1\130\6\uffff\1\127\21\uffff\1\126",
			"\1\130\6\uffff\1\127\21\uffff\1\126"
    ];

    protected static readonly DFA10_eot = DFA.unpackEncodedString(BlockSetTransformer.DFA10_eotS);
    protected static readonly DFA10_eof = DFA.unpackEncodedString(BlockSetTransformer.DFA10_eofS);
    protected static readonly DFA10_min = DFA.unpackEncodedStringToUnsignedChars(BlockSetTransformer.DFA10_minS);
    protected static readonly DFA10_max = DFA.unpackEncodedStringToUnsignedChars(BlockSetTransformer.DFA10_maxS);
    protected static readonly DFA10_accept = DFA.unpackEncodedString(BlockSetTransformer.DFA10_acceptS);
    protected static readonly DFA10_special = DFA.unpackEncodedString(BlockSetTransformer.DFA10_specialS);
    protected static readonly DFA10_transition: Int16Array[];


    public currentRuleName: string;
    public currentAlt: GrammarAST;
    public g: Grammar;

    public DFA10 = (($outer) => {
        return class DFA10 extends DFA {

            public constructor(recognizer: BaseRecognizer) {
                this.recognizer = recognizer;
                this.decisionNumber = 10;
                this.eot = BlockSetTransformer.DFA10_eot;
                this.eof = BlockSetTransformer.DFA10_eof;
                this.min = BlockSetTransformer.DFA10_min;
                this.max = BlockSetTransformer.DFA10_max;
                this.accept = BlockSetTransformer.DFA10_accept;
                this.special = BlockSetTransformer.DFA10_special;
                this.transition = BlockSetTransformer.DFA10_transition;
            }
            @Override
            public getDescription(): string {
                return "90:1: blockSet : ({...}? ^( BLOCK ^(alt= ALT ( elementOptions )? {...}? setElement[inLexer] ) ( ^( ALT ( elementOptions )? setElement[inLexer] ) )+ ) -> ^( BLOCK[$BLOCK.token] ^( ALT[$BLOCK.token,\"ALT\"] ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ ) ) ) |{...}? ^( BLOCK ^( ALT ( elementOptions )? setElement[inLexer] ) ( ^( ALT ( elementOptions )? setElement[inLexer] ) )+ ) -> ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ ) );";
            }
            @Override
            public specialStateTransition(s: number, _input: java.util.stream.IntStream): number {
                let input = _input as TreeNodeStream;
                let _s = s;
                switch (s) {
                    case 0: {
                        let LA10_60 = input.LA(1);

                        let index10_60 = input.index();
                        input.rewind();
                        s = -1;
                        if (((inContext("RULE")))) { s = 70; }
                        else {
                            if (((!inContext("RULE")))) { s = 71; }
                        }


                        input.seek(index10_60);
                        if (s >= 0) {
                            return s;
                        }

                        break;
                    }


                    default:

                }
                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return -1; }
                let nvae =
                    new NoViableAltException(this.getDescription(), 10, _s, input);
                java.util.logging.ErrorManager.error(nvae);
                throw nvae;
            }
        };
    })(this);


    protected adaptor = new CommonTreeAdaptor();
    // $ANTLR end "elementOption"

    // Delegated rules


    protected dfa10 = new DFA10(this);

    // delegators


    public constructor(input: TreeNodeStream);
    public constructor(input: TreeNodeStream, state: RecognizerSharedState);
    public constructor(input: TreeNodeStream, g: Grammar);
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
                const [input, g] = args as [TreeNodeStream, Grammar];


                this(input, new RecognizerSharedState());
                this.g = g;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    // delegates
    public getDelegates(): TreeRewriter[] {
        return [];
    }

    public setTreeAdaptor(adaptor: TreeAdaptor): void {
        this.adaptor = adaptor;
    }
    public getTreeAdaptor(): TreeAdaptor {
        return this.adaptor;
    }
    @Override
    public getTokenNames(): string[] { return BlockSetTransformer.tokenNames; }
    @Override
    public getGrammarFileName(): string { return "org/antlr/v4/parse/BlockSetTransformer.g"; }


    // $ANTLR start "topdown"
    // org/antlr/v4/parse/BlockSetTransformer.g:63:1: topdown : ( ^( RULE (id= TOKEN_REF |id= RULE_REF ) ( . )+ ) | setAlt | ebnfBlockSet | blockSet );
    @Override
    public readonly topdown(): BlockSetTransformer.topdown_return {
        let retval = new BlockSetTransformer.topdown_return();
        retval.start = input.LT(1);

        let root_0 = null;

        let _first_0 = null;
        let _last = null;


        let id = null;
        let RULE1 = null;
        let wildcard2 = null;
        let setAlt3 = null;
        let ebnfBlockSet4 = null;
        let blockSet5 = null;

        let id_tree = null;
        let RULE1_tree = null;
        let wildcard2_tree = null;

        try {
            // org/antlr/v4/parse/BlockSetTransformer.g:64:5: ( ^( RULE (id= TOKEN_REF |id= RULE_REF ) ( . )+ ) | setAlt | ebnfBlockSet | blockSet )
            let alt3 = 4;
            switch (input.LA(1)) {
                case RULE: {
                    {
                        alt3 = 1;
                    }
                    break;
                }

                case ALT: {
                    {
                        alt3 = 2;
                    }
                    break;
                }

                case CLOSURE:
                case javax.security.auth.login.AppConfigurationEntry.LoginModuleControlFlag.OPTIONAL:
                case POSITIVE_CLOSURE: {
                    {
                        alt3 = 3;
                    }
                    break;
                }

                case BLOCK: {
                    {
                        alt3 = 4;
                    }
                    break;
                }

                default: {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                    let nvae =
                        new NoViableAltException("", 3, 0, input);
                    throw nvae;
                }

            }
            switch (alt3) {
                case 1: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:64:7: ^( RULE (id= TOKEN_REF |id= RULE_REF ) ( . )+ )
                    {
                        _last = input.LT(1) as GrammarAST;
                        {
                            let _save_last_1 = _last;
                            let _first_1 = null;
                            _last = input.LT(1) as GrammarAST;
                            RULE1 = java.security.cert.CertSelector.match(input, BlockSetTransformer.RULE, BlockSetTransformer.FOLLOW_RULE_in_topdown86) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_0 === null) {
                                    _first_0 = RULE1;
                                }

                            }

                            java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            // org/antlr/v4/parse/BlockSetTransformer.g:64:14: (id= TOKEN_REF |id= RULE_REF )
                            let alt1 = 2;
                            let LA1_0 = input.LA(1);
                            if ((LA1_0 === BlockSetTransformer.TOKEN_REF)) {
                                alt1 = 1;
                            }
                            else {
                                if ((LA1_0 === BlockSetTransformer.RULE_REF)) {
                                    alt1 = 2;
                                }

                                else {
                                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                    let nvae =
                                        new NoViableAltException("", 1, 0, input);
                                    throw nvae;
                                }
                            }


                            switch (alt1) {
                                case 1: {
                                    // org/antlr/v4/parse/BlockSetTransformer.g:64:15: id= TOKEN_REF
                                    {
                                        _last = input.LT(1) as GrammarAST;
                                        id = java.security.cert.CertSelector.match(input, BlockSetTransformer.TOKEN_REF, BlockSetTransformer.FOLLOW_TOKEN_REF_in_topdown91) as GrammarAST; if (java.security.Signature.state.failed) {
                                            return retval;
                                        }


                                        if (java.security.Signature.state.backtracking === 1) {

                                            if (_first_1 === null) {
                                                _first_1 = id;
                                            }

                                        }


                                        if (java.security.Signature.state.backtracking === 1) {
                                            retval.tree = _first_0;
                                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                            }

                                        }

                                    }
                                    break;
                                }

                                case 2: {
                                    // org/antlr/v4/parse/BlockSetTransformer.g:64:28: id= RULE_REF
                                    {
                                        _last = input.LT(1) as GrammarAST;
                                        id = java.security.cert.CertSelector.match(input, BlockSetTransformer.RULE_REF, BlockSetTransformer.FOLLOW_RULE_REF_in_topdown95) as GrammarAST; if (java.security.Signature.state.failed) {
                                            return retval;
                                        }


                                        if (java.security.Signature.state.backtracking === 1) {

                                            if (_first_1 === null) {
                                                _first_1 = id;
                                            }

                                        }


                                        if (java.security.Signature.state.backtracking === 1) {
                                            retval.tree = _first_0;
                                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                            }

                                        }

                                    }
                                    break;
                                }


                                default:


                            }

                            if (java.security.Signature.state.backtracking === 1) { this.currentRuleName = (id !== null ? id.getText() : null); }
                            // org/antlr/v4/parse/BlockSetTransformer.g:64:69: ( . )+
                            let cnt2 = 0;
                            loop2:
                            while (true) {
                                let alt2 = 2;
                                let LA2_0 = input.LA(1);
                                if (((LA2_0 >= BlockSetTransformer.ACTION && LA2_0 <= BlockSetTransformer.WILDCARD))) {
                                    alt2 = 1;
                                }
                                else {
                                    if ((LA2_0 === UP)) {
                                        alt2 = 2;
                                    }
                                }


                                switch (alt2) {
                                    case 1: {
                                        // org/antlr/v4/parse/BlockSetTransformer.g:64:69: .
                                        {
                                            _last = input.LT(1) as GrammarAST;
                                            wildcard2 = input.LT(1) as GrammarAST;
                                            matchAny(input); if (java.security.Signature.state.failed) {
                                                return retval;
                                            }


                                            if (java.security.Signature.state.backtracking === 1) {

                                                if (_first_1 === null) {
                                                    _first_1 = wildcard2;
                                                }

                                            }


                                            if (java.security.Signature.state.backtracking === 1) {
                                                retval.tree = _first_0;
                                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                                }

                                            }

                                        }
                                        break;
                                    }


                                    default: {
                                        if (cnt2 >= 1) {
                                            break loop2;
                                        }

                                        if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                        let eee = new EarlyExitException(2, input);
                                        throw eee;
                                    }

                                }
                                cnt2++;
                            }

                            java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = _save_last_1;
                        }


                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = _first_0;
                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                            }

                        }

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:65:7: setAlt
                    {
                        _last = input.LT(1) as GrammarAST;
                        pushFollow(BlockSetTransformer.FOLLOW_setAlt_in_topdown110);
                        setAlt3 = this.setAlt();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return retval;
                        }

                        if (java.security.Signature.state.backtracking === 1) {


                            if (_first_0 === null) {
                                _first_0 = setAlt3.getTree() as GrammarAST;
                            }

                        }


                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = _first_0;
                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                            }

                        }

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:66:7: ebnfBlockSet
                    {
                        _last = input.LT(1) as GrammarAST;
                        pushFollow(BlockSetTransformer.FOLLOW_ebnfBlockSet_in_topdown118);
                        ebnfBlockSet4 = this.ebnfBlockSet();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return retval;
                        }

                        if (java.security.Signature.state.backtracking === 1) {


                            if (_first_0 === null) {
                                _first_0 = ebnfBlockSet4.getTree() as GrammarAST;
                            }

                        }


                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = _first_0;
                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                            }

                        }

                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:67:7: blockSet
                    {
                        _last = input.LT(1) as GrammarAST;
                        pushFollow(BlockSetTransformer.FOLLOW_blockSet_in_topdown126);
                        blockSet5 = this.blockSet();
                        java.security.Signature.state._fsp--;
                        if (java.security.Signature.state.failed) {
                            return retval;
                        }

                        if (java.security.Signature.state.backtracking === 1) {


                            if (_first_0 === null) {
                                _first_0 = blockSet5.getTree() as GrammarAST;
                            }

                        }


                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = _first_0;
                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                            }

                        }

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


    // $ANTLR start "setAlt"
    // org/antlr/v4/parse/BlockSetTransformer.g:70:1: setAlt :{...}? ALT ;
    public readonly setAlt(): BlockSetTransformer.setAlt_return {
        let retval = new BlockSetTransformer.setAlt_return();
        retval.start = input.LT(1);

        let root_0 = null;

        let _first_0 = null;
        let _last = null;


        let ALT6 = null;

        let ALT6_tree = null;

        try {
            // org/antlr/v4/parse/BlockSetTransformer.g:71:2: ({...}? ALT )
            // org/antlr/v4/parse/BlockSetTransformer.g:71:4: {...}? ALT
            {
                if (!((inContext("RULE BLOCK")))) {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                    throw new FailedPredicateException(input, "setAlt", "inContext(\"RULE BLOCK\")");
                }
                _last = input.LT(1) as GrammarAST;
                ALT6 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ALT, BlockSetTransformer.FOLLOW_ALT_in_setAlt141) as GrammarAST; if (java.security.Signature.state.failed) {
                    return retval;
                }


                if (java.security.Signature.state.backtracking === 1) {

                    if (_first_0 === null) {
                        _first_0 = ALT6;
                    }

                }


                if (java.security.Signature.state.backtracking === 1) { this.currentAlt = (retval.start as GrammarAST); }
                if (java.security.Signature.state.backtracking === 1) {
                    retval.tree = _first_0;
                    if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                        retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                    }

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
        return retval;
    }


    // $ANTLR start "ebnfBlockSet"
    // org/antlr/v4/parse/BlockSetTransformer.g:76:1: ebnfBlockSet : ^( ebnfSuffix blockSet ) -> ^( ebnfSuffix ^( BLOCK ^( ALT blockSet ) ) ) ;
    public readonly ebnfBlockSet(): BlockSetTransformer.ebnfBlockSet_return {
        let retval = new BlockSetTransformer.ebnfBlockSet_return();
        retval.start = input.LT(1);

        let root_0 = null;

        let _first_0 = null;
        let _last = null;


        let ebnfSuffix7 = null;
        let blockSet8 = null;

        let stream_blockSet = new RewriteRuleSubtreeStream(this.adaptor, "rule blockSet");
        let stream_ebnfSuffix = new RewriteRuleSubtreeStream(this.adaptor, "rule ebnfSuffix");

        try {
            // org/antlr/v4/parse/BlockSetTransformer.g:80:2: ( ^( ebnfSuffix blockSet ) -> ^( ebnfSuffix ^( BLOCK ^( ALT blockSet ) ) ) )
            // org/antlr/v4/parse/BlockSetTransformer.g:80:4: ^( ebnfSuffix blockSet )
            {
                _last = input.LT(1) as GrammarAST;
                {
                    let _save_last_1 = _last;
                    let _first_1 = null;
                    _last = input.LT(1) as GrammarAST;
                    pushFollow(BlockSetTransformer.FOLLOW_ebnfSuffix_in_ebnfBlockSet161);
                    ebnfSuffix7 = this.ebnfSuffix();
                    java.security.Signature.state._fsp--;
                    if (java.security.Signature.state.failed) {
                        return retval;
                    }

                    if (java.security.Signature.state.backtracking === 1) {
                        stream_ebnfSuffix.add(ebnfSuffix7.getTree());
                    }

                    if (java.security.Signature.state.backtracking === 1) {

                        if (_first_0 === null) {
                            _first_0 = ebnfSuffix7.getTree() as GrammarAST;
                        }

                    }

                    java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                        return retval;
                    }

                    _last = input.LT(1) as GrammarAST;
                    pushFollow(BlockSetTransformer.FOLLOW_blockSet_in_ebnfBlockSet163);
                    blockSet8 = this.blockSet();
                    java.security.Signature.state._fsp--;
                    if (java.security.Signature.state.failed) {
                        return retval;
                    }

                    if (java.security.Signature.state.backtracking === 1) {
                        stream_blockSet.add(blockSet8.getTree());
                    }

                    java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                        return retval;
                    }

                    _last = _save_last_1;
                }



                // AST REWRITE
                // elements:
                // token labels:
                // rule labels: retval
                // token list labels:
                // rule list labels:
                // wildcard labels:
                if (java.security.Signature.state.backtracking === 1) {
                    retval.tree = root_0;
                    let stream_retval = new RewriteRuleSubtreeStream(this.adaptor, "rule retval", retval !== null ? retval.getTree() : null);

                    root_0 = this.adaptor.nil() as GrammarAST;
                    // 80:27: -> ^( ebnfSuffix ^( BLOCK ^( ALT blockSet ) ) )
                    {
                        // org/antlr/v4/parse/BlockSetTransformer.g:80:30: ^( ebnfSuffix ^( BLOCK ^( ALT blockSet ) ) )
                        {
                            let root_1 = this.adaptor.nil() as GrammarAST;
                            root_1 = this.adaptor.becomeRoot(stream_ebnfSuffix.nextNode(), root_1) as GrammarAST;
                            // org/antlr/v4/parse/BlockSetTransformer.g:80:43: ^( BLOCK ^( ALT blockSet ) )
                            {
                                let root_2 = this.adaptor.nil() as GrammarAST;
                                root_2 = this.adaptor.becomeRoot(new BlockAST(BlockSetTransformer.BLOCK), root_2) as GrammarAST;
                                // org/antlr/v4/parse/BlockSetTransformer.g:80:61: ^( ALT blockSet )
                                {
                                    let root_3 = this.adaptor.nil() as GrammarAST;
                                    root_3 = this.adaptor.becomeRoot(new AltAST(BlockSetTransformer.ALT), root_3) as GrammarAST;
                                    this.adaptor.addChild(root_3, stream_blockSet.nextTree());
                                    this.adaptor.addChild(root_2, root_3);
                                }

                                this.adaptor.addChild(root_1, root_2);
                            }

                            this.adaptor.addChild(root_0, root_1);
                        }

                    }


                    retval.tree = this.adaptor.rulePostProcessing(root_0) as GrammarAST;
                    input.replaceChildren(this.adaptor.getParent(retval.start),
                        this.adaptor.getChildIndex(retval.start),
                        this.adaptor.getChildIndex(_last),
                        retval.tree);
                }

            }

            if (java.security.Signature.state.backtracking === 1) {
                GrammarTransformPipeline.setGrammarPtr(this.g, retval.tree);
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


    // $ANTLR start "ebnfSuffix"
    // org/antlr/v4/parse/BlockSetTransformer.g:83:1: ebnfSuffix : ( OPTIONAL | CLOSURE | POSITIVE_CLOSURE );
    public readonly ebnfSuffix(): BlockSetTransformer.ebnfSuffix_return {
        let retval = new BlockSetTransformer.ebnfSuffix_return();
        retval.start = input.LT(1);

        let root_0 = null;

        let _first_0 = null;
        let _last = null;


        let set9 = null;

        let set9_tree = null;

        try {
            // org/antlr/v4/parse/BlockSetTransformer.g:85:2: ( OPTIONAL | CLOSURE | POSITIVE_CLOSURE )
            // org/antlr/v4/parse/BlockSetTransformer.g:
            {
                _last = input.LT(1) as GrammarAST;
                set9 = input.LT(1) as GrammarAST;
                if (input.LA(1) === BlockSetTransformer.CLOSURE || (input.LA(1) >= BlockSetTransformer.OPTIONAL && input.LA(1) <= BlockSetTransformer.POSITIVE_CLOSURE)) {
                    input.consume();
                    java.security.Signature.state.errorRecovery = false;
                    java.security.Signature.state.failed = false;
                }
                else {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                    let mse = new MismatchedSetException(null, input);
                    throw mse;
                }

                if (java.security.Signature.state.backtracking === 1) {
                    retval.tree = _first_0;
                    if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                        retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                    }

                }


            }

            if (java.security.Signature.state.backtracking === 1) { retval.tree = this.adaptor.dupNode((retval.start as GrammarAST)) as GrammarAST; }
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
    // org/antlr/v4/parse/BlockSetTransformer.g:90:1: blockSet : ({...}? ^( BLOCK ^(alt= ALT ( elementOptions )? {...}? setElement[inLexer] ) ( ^( ALT ( elementOptions )? setElement[inLexer] ) )+ ) -> ^( BLOCK[$BLOCK.token] ^( ALT[$BLOCK.token,\"ALT\"] ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ ) ) ) |{...}? ^( BLOCK ^( ALT ( elementOptions )? setElement[inLexer] ) ( ^( ALT ( elementOptions )? setElement[inLexer] ) )+ ) -> ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ ) );
    public readonly blockSet(): BlockSetTransformer.blockSet_return {
        let retval = new BlockSetTransformer.blockSet_return();
        retval.start = input.LT(1);

        let root_0 = null;

        let _first_0 = null;
        let _last = null;


        let alt = null;
        let BLOCK10 = null;
        let ALT13 = null;
        let BLOCK16 = null;
        let ALT17 = null;
        let ALT20 = null;
        let elementOptions11 = null;
        let setElement12 = null;
        let elementOptions14 = null;
        let setElement15 = null;
        let elementOptions18 = null;
        let setElement19 = null;
        let elementOptions21 = null;
        let setElement22 = null;

        let alt_tree = null;
        let BLOCK10_tree = null;
        let ALT13_tree = null;
        let BLOCK16_tree = null;
        let ALT17_tree = null;
        let ALT20_tree = null;
        let stream_BLOCK = new RewriteRuleNodeStream(this.adaptor, "token BLOCK");
        let stream_ALT = new RewriteRuleNodeStream(this.adaptor, "token ALT");
        let stream_elementOptions = new RewriteRuleSubtreeStream(this.adaptor, "rule elementOptions");
        let stream_setElement = new RewriteRuleSubtreeStream(this.adaptor, "rule setElement");


        let inLexer = Grammar.isTokenName(this.currentRuleName);

        try {
            // org/antlr/v4/parse/BlockSetTransformer.g:97:2: ({...}? ^( BLOCK ^(alt= ALT ( elementOptions )? {...}? setElement[inLexer] ) ( ^( ALT ( elementOptions )? setElement[inLexer] ) )+ ) -> ^( BLOCK[$BLOCK.token] ^( ALT[$BLOCK.token,\"ALT\"] ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ ) ) ) |{...}? ^( BLOCK ^( ALT ( elementOptions )? setElement[inLexer] ) ( ^( ALT ( elementOptions )? setElement[inLexer] ) )+ ) -> ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ ) )
            let alt10 = 2;
            alt10 = this.dfa10.predict(input);
            switch (alt10) {
                case 1: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:97:4: {...}? ^( BLOCK ^(alt= ALT ( elementOptions )? {...}? setElement[inLexer] ) ( ^( ALT ( elementOptions )? setElement[inLexer] ) )+ )
                    {
                        if (!((inContext("RULE")))) {
                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                            throw new FailedPredicateException(input, "blockSet", "inContext(\"RULE\")");
                        }
                        _last = input.LT(1) as GrammarAST;
                        {
                            let _save_last_1 = _last;
                            let _first_1 = null;
                            _last = input.LT(1) as GrammarAST;
                            BLOCK10 = java.security.cert.CertSelector.match(input, BlockSetTransformer.BLOCK, BlockSetTransformer.FOLLOW_BLOCK_in_blockSet244) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {
                                stream_BLOCK.add(BLOCK10);
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_0 === null) {
                                    _first_0 = BLOCK10;
                                }

                            }

                            java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = input.LT(1) as GrammarAST;
                            {
                                let _save_last_2 = _last;
                                let _first_2 = null;
                                _last = input.LT(1) as GrammarAST;
                                alt = java.security.cert.CertSelector.match(input, BlockSetTransformer.ALT, BlockSetTransformer.FOLLOW_ALT_in_blockSet249) as GrammarAST; if (java.security.Signature.state.failed) {
                                    return retval;
                                }


                                if (java.security.Signature.state.backtracking === 1) {
                                    stream_ALT.add(alt);
                                }


                                if (java.security.Signature.state.backtracking === 1) {

                                    if (_first_1 === null) {
                                        _first_1 = alt;
                                    }

                                }

                                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                // org/antlr/v4/parse/BlockSetTransformer.g:98:21: ( elementOptions )?
                                let alt4 = 2;
                                let LA4_0 = input.LA(1);
                                if ((LA4_0 === BlockSetTransformer.ELEMENT_OPTIONS)) {
                                    alt4 = 1;
                                }
                                switch (alt4) {
                                    case 1: {
                                        // org/antlr/v4/parse/BlockSetTransformer.g:98:21: elementOptions
                                        {
                                            _last = input.LT(1) as GrammarAST;
                                            pushFollow(BlockSetTransformer.FOLLOW_elementOptions_in_blockSet251);
                                            elementOptions11 = this.elementOptions();
                                            java.security.Signature.state._fsp--;
                                            if (java.security.Signature.state.failed) {
                                                return retval;
                                            }

                                            if (java.security.Signature.state.backtracking === 1) {
                                                stream_elementOptions.add(elementOptions11.getTree());
                                            }

                                            if (java.security.Signature.state.backtracking === 1) {
                                                retval.tree = _first_0;
                                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                                }

                                            }

                                        }
                                        break;
                                    }


                                    default:


                                }

                                if (!(((alt as AltAST).altLabel === null))) {
                                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                    throw new FailedPredicateException(input, "blockSet", "((AltAST)$alt).altLabel==null");
                                }
                                _last = input.LT(1) as GrammarAST;
                                pushFollow(BlockSetTransformer.FOLLOW_setElement_in_blockSet256);
                                setElement12 = this.setElement(inLexer);
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                if (java.security.Signature.state.backtracking === 1) {
                                    stream_setElement.add(setElement12.getTree());
                                }

                                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                _last = _save_last_2;
                            }


                            // org/antlr/v4/parse/BlockSetTransformer.g:98:91: ( ^( ALT ( elementOptions )? setElement[inLexer] ) )+
                            let cnt6 = 0;
                            loop6:
                            while (true) {
                                let alt6 = 2;
                                let LA6_0 = input.LA(1);
                                if ((LA6_0 === BlockSetTransformer.ALT)) {
                                    alt6 = 1;
                                }

                                switch (alt6) {
                                    case 1: {
                                        // org/antlr/v4/parse/BlockSetTransformer.g:98:93: ^( ALT ( elementOptions )? setElement[inLexer] )
                                        {
                                            _last = input.LT(1) as GrammarAST;
                                            {
                                                let _save_last_2 = _last;
                                                let _first_2 = null;
                                                _last = input.LT(1) as GrammarAST;
                                                ALT13 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ALT, BlockSetTransformer.FOLLOW_ALT_in_blockSet263) as GrammarAST; if (java.security.Signature.state.failed) {
                                                    return retval;
                                                }


                                                if (java.security.Signature.state.backtracking === 1) {
                                                    stream_ALT.add(ALT13);
                                                }


                                                if (java.security.Signature.state.backtracking === 1) {

                                                    if (_first_1 === null) {
                                                        _first_1 = ALT13;
                                                    }

                                                }

                                                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                                    return retval;
                                                }

                                                // org/antlr/v4/parse/BlockSetTransformer.g:98:99: ( elementOptions )?
                                                let alt5 = 2;
                                                let LA5_0 = input.LA(1);
                                                if ((LA5_0 === BlockSetTransformer.ELEMENT_OPTIONS)) {
                                                    alt5 = 1;
                                                }
                                                switch (alt5) {
                                                    case 1: {
                                                        // org/antlr/v4/parse/BlockSetTransformer.g:98:99: elementOptions
                                                        {
                                                            _last = input.LT(1) as GrammarAST;
                                                            pushFollow(BlockSetTransformer.FOLLOW_elementOptions_in_blockSet265);
                                                            elementOptions14 = this.elementOptions();
                                                            java.security.Signature.state._fsp--;
                                                            if (java.security.Signature.state.failed) {
                                                                return retval;
                                                            }

                                                            if (java.security.Signature.state.backtracking === 1) {
                                                                stream_elementOptions.add(elementOptions14.getTree());
                                                            }

                                                            if (java.security.Signature.state.backtracking === 1) {
                                                                retval.tree = _first_0;
                                                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                                                }

                                                            }

                                                        }
                                                        break;
                                                    }


                                                    default:


                                                }

                                                _last = input.LT(1) as GrammarAST;
                                                pushFollow(BlockSetTransformer.FOLLOW_setElement_in_blockSet268);
                                                setElement15 = this.setElement(inLexer);
                                                java.security.Signature.state._fsp--;
                                                if (java.security.Signature.state.failed) {
                                                    return retval;
                                                }

                                                if (java.security.Signature.state.backtracking === 1) {
                                                    stream_setElement.add(setElement15.getTree());
                                                }

                                                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                                    return retval;
                                                }

                                                _last = _save_last_2;
                                            }


                                            if (java.security.Signature.state.backtracking === 1) {
                                                retval.tree = _first_0;
                                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                                }

                                            }

                                        }
                                        break;
                                    }


                                    default: {
                                        if (cnt6 >= 1) {
                                            break loop6;
                                        }

                                        if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                        let eee = new EarlyExitException(6, input);
                                        throw eee;
                                    }

                                }
                                cnt6++;
                            }

                            java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = _save_last_1;
                        }



                        // AST REWRITE
                        // elements:
                        // token labels:
                        // rule labels: retval
                        // token list labels:
                        // rule list labels:
                        // wildcard labels:
                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = root_0;
                            let stream_retval = new RewriteRuleSubtreeStream(this.adaptor, "rule retval", retval !== null ? retval.getTree() : null);

                            root_0 = this.adaptor.nil() as GrammarAST;
                            // 99:3: -> ^( BLOCK[$BLOCK.token] ^( ALT[$BLOCK.token,\"ALT\"] ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ ) ) )
                            {
                                // org/antlr/v4/parse/BlockSetTransformer.g:99:6: ^( BLOCK[$BLOCK.token] ^( ALT[$BLOCK.token,\"ALT\"] ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ ) ) )
                                {
                                    let root_1 = this.adaptor.nil() as GrammarAST;
                                    root_1 = this.adaptor.becomeRoot(new BlockAST(BlockSetTransformer.BLOCK, BLOCK10.token), root_1) as GrammarAST;
                                    // org/antlr/v4/parse/BlockSetTransformer.g:99:38: ^( ALT[$BLOCK.token,\"ALT\"] ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ ) )
                                    {
                                        let root_2 = this.adaptor.nil() as GrammarAST;
                                        root_2 = this.adaptor.becomeRoot(new AltAST(BlockSetTransformer.ALT, BLOCK10.token, "ALT"), root_2) as GrammarAST;
                                        // org/antlr/v4/parse/BlockSetTransformer.g:99:72: ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ )
                                        {
                                            let root_3 = this.adaptor.nil() as GrammarAST;
                                            root_3 = this.adaptor.becomeRoot(this.adaptor.create(BlockSetTransformer.SET, BLOCK10.token, "SET") as GrammarAST, root_3) as GrammarAST;
                                            if (!(stream_setElement.hasNext())) {
                                                throw new RewriteEarlyExitException();
                                            }
                                            while (stream_setElement.hasNext()) {
                                                this.adaptor.addChild(root_3, stream_setElement.nextTree());
                                            }
                                            stream_setElement.reset();

                                            this.adaptor.addChild(root_2, root_3);
                                        }

                                        this.adaptor.addChild(root_1, root_2);
                                    }

                                    this.adaptor.addChild(root_0, root_1);
                                }

                            }


                            retval.tree = this.adaptor.rulePostProcessing(root_0) as GrammarAST;
                            input.replaceChildren(this.adaptor.getParent(retval.start),
                                this.adaptor.getChildIndex(retval.start),
                                this.adaptor.getChildIndex(_last),
                                retval.tree);
                        }

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:100:4: {...}? ^( BLOCK ^( ALT ( elementOptions )? setElement[inLexer] ) ( ^( ALT ( elementOptions )? setElement[inLexer] ) )+ )
                    {
                        if (!((!inContext("RULE")))) {
                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                            throw new FailedPredicateException(input, "blockSet", "!inContext(\"RULE\")");
                        }
                        _last = input.LT(1) as GrammarAST;
                        {
                            let _save_last_1 = _last;
                            let _first_1 = null;
                            _last = input.LT(1) as GrammarAST;
                            BLOCK16 = java.security.cert.CertSelector.match(input, BlockSetTransformer.BLOCK, BlockSetTransformer.FOLLOW_BLOCK_in_blockSet313) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {
                                stream_BLOCK.add(BLOCK16);
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_0 === null) {
                                    _first_0 = BLOCK16;
                                }

                            }

                            java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = input.LT(1) as GrammarAST;
                            {
                                let _save_last_2 = _last;
                                let _first_2 = null;
                                _last = input.LT(1) as GrammarAST;
                                ALT17 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ALT, BlockSetTransformer.FOLLOW_ALT_in_blockSet316) as GrammarAST; if (java.security.Signature.state.failed) {
                                    return retval;
                                }


                                if (java.security.Signature.state.backtracking === 1) {
                                    stream_ALT.add(ALT17);
                                }


                                if (java.security.Signature.state.backtracking === 1) {

                                    if (_first_1 === null) {
                                        _first_1 = ALT17;
                                    }

                                }

                                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                // org/antlr/v4/parse/BlockSetTransformer.g:101:17: ( elementOptions )?
                                let alt7 = 2;
                                let LA7_0 = input.LA(1);
                                if ((LA7_0 === BlockSetTransformer.ELEMENT_OPTIONS)) {
                                    alt7 = 1;
                                }
                                switch (alt7) {
                                    case 1: {
                                        // org/antlr/v4/parse/BlockSetTransformer.g:101:17: elementOptions
                                        {
                                            _last = input.LT(1) as GrammarAST;
                                            pushFollow(BlockSetTransformer.FOLLOW_elementOptions_in_blockSet318);
                                            elementOptions18 = this.elementOptions();
                                            java.security.Signature.state._fsp--;
                                            if (java.security.Signature.state.failed) {
                                                return retval;
                                            }

                                            if (java.security.Signature.state.backtracking === 1) {
                                                stream_elementOptions.add(elementOptions18.getTree());
                                            }

                                            if (java.security.Signature.state.backtracking === 1) {
                                                retval.tree = _first_0;
                                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                                }

                                            }

                                        }
                                        break;
                                    }


                                    default:


                                }

                                _last = input.LT(1) as GrammarAST;
                                pushFollow(BlockSetTransformer.FOLLOW_setElement_in_blockSet321);
                                setElement19 = this.setElement(inLexer);
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                if (java.security.Signature.state.backtracking === 1) {
                                    stream_setElement.add(setElement19.getTree());
                                }

                                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                _last = _save_last_2;
                            }


                            // org/antlr/v4/parse/BlockSetTransformer.g:101:54: ( ^( ALT ( elementOptions )? setElement[inLexer] ) )+
                            let cnt9 = 0;
                            loop9:
                            while (true) {
                                let alt9 = 2;
                                let LA9_0 = input.LA(1);
                                if ((LA9_0 === BlockSetTransformer.ALT)) {
                                    alt9 = 1;
                                }

                                switch (alt9) {
                                    case 1: {
                                        // org/antlr/v4/parse/BlockSetTransformer.g:101:56: ^( ALT ( elementOptions )? setElement[inLexer] )
                                        {
                                            _last = input.LT(1) as GrammarAST;
                                            {
                                                let _save_last_2 = _last;
                                                let _first_2 = null;
                                                _last = input.LT(1) as GrammarAST;
                                                ALT20 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ALT, BlockSetTransformer.FOLLOW_ALT_in_blockSet328) as GrammarAST; if (java.security.Signature.state.failed) {
                                                    return retval;
                                                }


                                                if (java.security.Signature.state.backtracking === 1) {
                                                    stream_ALT.add(ALT20);
                                                }


                                                if (java.security.Signature.state.backtracking === 1) {

                                                    if (_first_1 === null) {
                                                        _first_1 = ALT20;
                                                    }

                                                }

                                                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                                    return retval;
                                                }

                                                // org/antlr/v4/parse/BlockSetTransformer.g:101:62: ( elementOptions )?
                                                let alt8 = 2;
                                                let LA8_0 = input.LA(1);
                                                if ((LA8_0 === BlockSetTransformer.ELEMENT_OPTIONS)) {
                                                    alt8 = 1;
                                                }
                                                switch (alt8) {
                                                    case 1: {
                                                        // org/antlr/v4/parse/BlockSetTransformer.g:101:62: elementOptions
                                                        {
                                                            _last = input.LT(1) as GrammarAST;
                                                            pushFollow(BlockSetTransformer.FOLLOW_elementOptions_in_blockSet330);
                                                            elementOptions21 = this.elementOptions();
                                                            java.security.Signature.state._fsp--;
                                                            if (java.security.Signature.state.failed) {
                                                                return retval;
                                                            }

                                                            if (java.security.Signature.state.backtracking === 1) {
                                                                stream_elementOptions.add(elementOptions21.getTree());
                                                            }

                                                            if (java.security.Signature.state.backtracking === 1) {
                                                                retval.tree = _first_0;
                                                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                                                }

                                                            }

                                                        }
                                                        break;
                                                    }


                                                    default:


                                                }

                                                _last = input.LT(1) as GrammarAST;
                                                pushFollow(BlockSetTransformer.FOLLOW_setElement_in_blockSet333);
                                                setElement22 = this.setElement(inLexer);
                                                java.security.Signature.state._fsp--;
                                                if (java.security.Signature.state.failed) {
                                                    return retval;
                                                }

                                                if (java.security.Signature.state.backtracking === 1) {
                                                    stream_setElement.add(setElement22.getTree());
                                                }

                                                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                                    return retval;
                                                }

                                                _last = _save_last_2;
                                            }


                                            if (java.security.Signature.state.backtracking === 1) {
                                                retval.tree = _first_0;
                                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                                }

                                            }

                                        }
                                        break;
                                    }


                                    default: {
                                        if (cnt9 >= 1) {
                                            break loop9;
                                        }

                                        if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                        let eee = new EarlyExitException(9, input);
                                        throw eee;
                                    }

                                }
                                cnt9++;
                            }

                            java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = _save_last_1;
                        }



                        // AST REWRITE
                        // elements:
                        // token labels:
                        // rule labels: retval
                        // token list labels:
                        // rule list labels:
                        // wildcard labels:
                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = root_0;
                            let stream_retval = new RewriteRuleSubtreeStream(this.adaptor, "rule retval", retval !== null ? retval.getTree() : null);

                            root_0 = this.adaptor.nil() as GrammarAST;
                            // 102:3: -> ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ )
                            {
                                // org/antlr/v4/parse/BlockSetTransformer.g:102:6: ^( SET[$BLOCK.token, \"SET\"] ( setElement )+ )
                                {
                                    let root_1 = this.adaptor.nil() as GrammarAST;
                                    root_1 = this.adaptor.becomeRoot(this.adaptor.create(BlockSetTransformer.SET, BLOCK16.token, "SET") as GrammarAST, root_1) as GrammarAST;
                                    if (!(stream_setElement.hasNext())) {
                                        throw new RewriteEarlyExitException();
                                    }
                                    while (stream_setElement.hasNext()) {
                                        this.adaptor.addChild(root_1, stream_setElement.nextTree());
                                    }
                                    stream_setElement.reset();

                                    this.adaptor.addChild(root_0, root_1);
                                }

                            }


                            retval.tree = this.adaptor.rulePostProcessing(root_0) as GrammarAST;
                            input.replaceChildren(this.adaptor.getParent(retval.start),
                                this.adaptor.getChildIndex(retval.start),
                                this.adaptor.getChildIndex(_last),
                                retval.tree);
                        }

                    }
                    break;
                }


                default:


            }
            if (java.security.Signature.state.backtracking === 1) {
                GrammarTransformPipeline.setGrammarPtr(this.g, retval.tree);
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


    // $ANTLR start "setElement"
    // org/antlr/v4/parse/BlockSetTransformer.g:105:1: setElement[boolean inLexer] : ( ^(a= STRING_LITERAL elementOptions ) {...}?|a= STRING_LITERAL {...}?|{...}? => ^( TOKEN_REF elementOptions ) |{...}? => TOKEN_REF |{...}? => ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) {...}?) ;
    public readonly setElement(inLexer: boolean): BlockSetTransformer.setElement_return {
        let retval = new BlockSetTransformer.setElement_return();
        retval.start = input.LT(1);

        let root_0 = null;

        let _first_0 = null;
        let _last = null;


        let a = null;
        let b = null;
        let TOKEN_REF24 = null;
        let TOKEN_REF26 = null;
        let RANGE27 = null;
        let elementOptions23 = null;
        let elementOptions25 = null;

        let a_tree = null;
        let b_tree = null;
        let TOKEN_REF24_tree = null;
        let TOKEN_REF26_tree = null;
        let RANGE27_tree = null;

        try {
            // org/antlr/v4/parse/BlockSetTransformer.g:109:2: ( ( ^(a= STRING_LITERAL elementOptions ) {...}?|a= STRING_LITERAL {...}?|{...}? => ^( TOKEN_REF elementOptions ) |{...}? => TOKEN_REF |{...}? => ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) {...}?) )
            // org/antlr/v4/parse/BlockSetTransformer.g:109:4: ( ^(a= STRING_LITERAL elementOptions ) {...}?|a= STRING_LITERAL {...}?|{...}? => ^( TOKEN_REF elementOptions ) |{...}? => TOKEN_REF |{...}? => ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) {...}?)
            {
                // org/antlr/v4/parse/BlockSetTransformer.g:109:4: ( ^(a= STRING_LITERAL elementOptions ) {...}?|a= STRING_LITERAL {...}?|{...}? => ^( TOKEN_REF elementOptions ) |{...}? => TOKEN_REF |{...}? => ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) {...}?)
                let alt11 = 5;
                let LA11_0 = input.LA(1);
                if ((LA11_0 === BlockSetTransformer.STRING_LITERAL)) {
                    let LA11_1 = input.LA(2);
                    if ((LA11_1 === DOWN)) {
                        alt11 = 1;
                    }
                    else {
                        if ((LA11_1 === UP)) {
                            alt11 = 2;
                        }

                        else {
                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                            let nvaeMark = input.mark();
                            try {
                                input.consume();
                                let nvae =
                                    new NoViableAltException("", 11, 1, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }
                    }


                }
                else {
                    if ((LA11_0 === BlockSetTransformer.TOKEN_REF) && ((!inLexer))) {
                        let LA11_2 = input.LA(2);
                        if ((LA11_2 === DOWN) && ((!inLexer))) {
                            alt11 = 3;
                        }
                        else {
                            if ((LA11_2 === UP) && ((!inLexer))) {
                                alt11 = 4;
                            }
                        }


                    }
                    else {
                        if ((LA11_0 === BlockSetTransformer.RANGE) && ((inLexer))) {
                            alt11 = 5;
                        }
                    }

                }


                switch (alt11) {
                    case 1: {
                        // org/antlr/v4/parse/BlockSetTransformer.g:109:6: ^(a= STRING_LITERAL elementOptions ) {...}?
                        {
                            _last = input.LT(1) as GrammarAST;
                            {
                                let _save_last_1 = _last;
                                let _first_1 = null;
                                _last = input.LT(1) as GrammarAST;
                                a = java.security.cert.CertSelector.match(input, BlockSetTransformer.STRING_LITERAL, BlockSetTransformer.FOLLOW_STRING_LITERAL_in_setElement373) as GrammarAST; if (java.security.Signature.state.failed) {
                                    return retval;
                                }


                                if (java.security.Signature.state.backtracking === 1) {

                                    if (_first_0 === null) {
                                        _first_0 = a;
                                    }

                                }

                                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                _last = input.LT(1) as GrammarAST;
                                pushFollow(BlockSetTransformer.FOLLOW_elementOptions_in_setElement375);
                                elementOptions23 = this.elementOptions();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                if (java.security.Signature.state.backtracking === 1) {


                                    if (_first_1 === null) {
                                        _first_1 = elementOptions23.getTree() as GrammarAST;
                                    }

                                }


                                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                _last = _save_last_1;
                            }


                            if (!((!inLexer || CharSupport.getCharValueFromGrammarCharLiteral(a.getText()) !== -1))) {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                throw new FailedPredicateException(input, "setElement", "!inLexer || CharSupport.getCharValueFromGrammarCharLiteral($a.getText())!=-1");
                            }
                            if (java.security.Signature.state.backtracking === 1) {
                                retval.tree = _first_0;
                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                }

                            }

                        }
                        break;
                    }

                    case 2: {
                        // org/antlr/v4/parse/BlockSetTransformer.g:110:7: a= STRING_LITERAL {...}?
                        {
                            _last = input.LT(1) as GrammarAST;
                            a = java.security.cert.CertSelector.match(input, BlockSetTransformer.STRING_LITERAL, BlockSetTransformer.FOLLOW_STRING_LITERAL_in_setElement388) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_0 === null) {
                                    _first_0 = a;
                                }

                            }


                            if (!((!inLexer || CharSupport.getCharValueFromGrammarCharLiteral(a.getText()) !== -1))) {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                throw new FailedPredicateException(input, "setElement", "!inLexer || CharSupport.getCharValueFromGrammarCharLiteral($a.getText())!=-1");
                            }
                            if (java.security.Signature.state.backtracking === 1) {
                                retval.tree = _first_0;
                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                }

                            }

                        }
                        break;
                    }

                    case 3: {
                        // org/antlr/v4/parse/BlockSetTransformer.g:111:5: {...}? => ^( TOKEN_REF elementOptions )
                        {
                            if (!((!inLexer))) {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                throw new FailedPredicateException(input, "setElement", "!inLexer");
                            }
                            _last = input.LT(1) as GrammarAST;
                            {
                                let _save_last_1 = _last;
                                let _first_1 = null;
                                _last = input.LT(1) as GrammarAST;
                                TOKEN_REF24 = java.security.cert.CertSelector.match(input, BlockSetTransformer.TOKEN_REF, BlockSetTransformer.FOLLOW_TOKEN_REF_in_setElement400) as GrammarAST; if (java.security.Signature.state.failed) {
                                    return retval;
                                }


                                if (java.security.Signature.state.backtracking === 1) {

                                    if (_first_0 === null) {
                                        _first_0 = TOKEN_REF24;
                                    }

                                }

                                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                _last = input.LT(1) as GrammarAST;
                                pushFollow(BlockSetTransformer.FOLLOW_elementOptions_in_setElement402);
                                elementOptions25 = this.elementOptions();
                                java.security.Signature.state._fsp--;
                                if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                if (java.security.Signature.state.backtracking === 1) {


                                    if (_first_1 === null) {
                                        _first_1 = elementOptions25.getTree() as GrammarAST;
                                    }

                                }


                                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                _last = _save_last_1;
                            }


                            if (java.security.Signature.state.backtracking === 1) {
                                retval.tree = _first_0;
                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                }

                            }

                        }
                        break;
                    }

                    case 4: {
                        // org/antlr/v4/parse/BlockSetTransformer.g:112:5: {...}? => TOKEN_REF
                        {
                            if (!((!inLexer))) {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                throw new FailedPredicateException(input, "setElement", "!inLexer");
                            }
                            _last = input.LT(1) as GrammarAST;
                            TOKEN_REF26 = java.security.cert.CertSelector.match(input, BlockSetTransformer.TOKEN_REF, BlockSetTransformer.FOLLOW_TOKEN_REF_in_setElement414) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_0 === null) {
                                    _first_0 = TOKEN_REF26;
                                }

                            }


                            if (java.security.Signature.state.backtracking === 1) {
                                retval.tree = _first_0;
                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                }

                            }

                        }
                        break;
                    }

                    case 5: {
                        // org/antlr/v4/parse/BlockSetTransformer.g:113:5: {...}? => ^( RANGE a= STRING_LITERAL b= STRING_LITERAL ) {...}?
                        {
                            if (!((inLexer))) {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                throw new FailedPredicateException(input, "setElement", "inLexer");
                            }
                            _last = input.LT(1) as GrammarAST;
                            {
                                let _save_last_1 = _last;
                                let _first_1 = null;
                                _last = input.LT(1) as GrammarAST;
                                RANGE27 = java.security.cert.CertSelector.match(input, BlockSetTransformer.RANGE, BlockSetTransformer.FOLLOW_RANGE_in_setElement425) as GrammarAST; if (java.security.Signature.state.failed) {
                                    return retval;
                                }


                                if (java.security.Signature.state.backtracking === 1) {

                                    if (_first_0 === null) {
                                        _first_0 = RANGE27;
                                    }

                                }

                                java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                _last = input.LT(1) as GrammarAST;
                                a = java.security.cert.CertSelector.match(input, BlockSetTransformer.STRING_LITERAL, BlockSetTransformer.FOLLOW_STRING_LITERAL_in_setElement429) as GrammarAST; if (java.security.Signature.state.failed) {
                                    return retval;
                                }


                                if (java.security.Signature.state.backtracking === 1) {

                                    if (_first_1 === null) {
                                        _first_1 = a;
                                    }

                                }


                                _last = input.LT(1) as GrammarAST;
                                b = java.security.cert.CertSelector.match(input, BlockSetTransformer.STRING_LITERAL, BlockSetTransformer.FOLLOW_STRING_LITERAL_in_setElement433) as GrammarAST; if (java.security.Signature.state.failed) {
                                    return retval;
                                }


                                if (java.security.Signature.state.backtracking === 1) {

                                    if (_first_1 === null) {
                                        _first_1 = b;
                                    }

                                }


                                java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                    return retval;
                                }

                                _last = _save_last_1;
                            }


                            if (!((CharSupport.getCharValueFromGrammarCharLiteral(a.getText()) !== -1 &&
                                CharSupport.getCharValueFromGrammarCharLiteral(b.getText()) !== -1))) {
                                if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                throw new FailedPredicateException(input, "setElement", "CharSupport.getCharValueFromGrammarCharLiteral($a.getText())!=-1 &&\n\t\t\t CharSupport.getCharValueFromGrammarCharLiteral($b.getText())!=-1");
                            }
                            if (java.security.Signature.state.backtracking === 1) {
                                retval.tree = _first_0;
                                if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                    retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                }

                            }

                        }
                        break;
                    }


                    default:


                }

                if (java.security.Signature.state.backtracking === 1) {
                    retval.tree = _first_0;
                    if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                        retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                    }

                }

            }

            if (java.security.Signature.state.backtracking === 1) {
                GrammarTransformPipeline.setGrammarPtr(this.g, retval.tree);
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


    // $ANTLR start "elementOptions"
    // org/antlr/v4/parse/BlockSetTransformer.g:119:1: elementOptions : ^( ELEMENT_OPTIONS ( elementOption )* ) ;
    public readonly elementOptions(): BlockSetTransformer.elementOptions_return {
        let retval = new BlockSetTransformer.elementOptions_return();
        retval.start = input.LT(1);

        let root_0 = null;

        let _first_0 = null;
        let _last = null;


        let ELEMENT_OPTIONS28 = null;
        let elementOption29 = null;

        let ELEMENT_OPTIONS28_tree = null;

        try {
            // org/antlr/v4/parse/BlockSetTransformer.g:120:2: ( ^( ELEMENT_OPTIONS ( elementOption )* ) )
            // org/antlr/v4/parse/BlockSetTransformer.g:120:4: ^( ELEMENT_OPTIONS ( elementOption )* )
            {
                _last = input.LT(1) as GrammarAST;
                {
                    let _save_last_1 = _last;
                    let _first_1 = null;
                    _last = input.LT(1) as GrammarAST;
                    ELEMENT_OPTIONS28 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ELEMENT_OPTIONS, BlockSetTransformer.FOLLOW_ELEMENT_OPTIONS_in_elementOptions455) as GrammarAST; if (java.security.Signature.state.failed) {
                        return retval;
                    }


                    if (java.security.Signature.state.backtracking === 1) {

                        if (_first_0 === null) {
                            _first_0 = ELEMENT_OPTIONS28;
                        }

                    }

                    if (input.LA(1) === Token.DOWN) {
                        java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                            return retval;
                        }

                        // org/antlr/v4/parse/BlockSetTransformer.g:120:22: ( elementOption )*
                        loop12:
                        while (true) {
                            let alt12 = 2;
                            let LA12_0 = input.LA(1);
                            if ((LA12_0 === BlockSetTransformer.ASSIGN || LA12_0 === BlockSetTransformer.ID)) {
                                alt12 = 1;
                            }

                            switch (alt12) {
                                case 1: {
                                    // org/antlr/v4/parse/BlockSetTransformer.g:120:22: elementOption
                                    {
                                        _last = input.LT(1) as GrammarAST;
                                        pushFollow(BlockSetTransformer.FOLLOW_elementOption_in_elementOptions457);
                                        elementOption29 = this.elementOption();
                                        java.security.Signature.state._fsp--;
                                        if (java.security.Signature.state.failed) {
                                            return retval;
                                        }

                                        if (java.security.Signature.state.backtracking === 1) {


                                            if (_first_1 === null) {
                                                _first_1 = elementOption29.getTree() as GrammarAST;
                                            }

                                        }


                                        if (java.security.Signature.state.backtracking === 1) {
                                            retval.tree = _first_0;
                                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                                            }

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
                            return retval;
                        }

                    }
                    _last = _save_last_1;
                }


                if (java.security.Signature.state.backtracking === 1) {
                    retval.tree = _first_0;
                    if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                        retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                    }

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
        return retval;
    }


    // $ANTLR start "elementOption"
    // org/antlr/v4/parse/BlockSetTransformer.g:123:1: elementOption : ( ID | ^( ASSIGN id= ID v= ID ) | ^( ASSIGN ID v= STRING_LITERAL ) | ^( ASSIGN ID v= ACTION ) | ^( ASSIGN ID v= INT ) );
    public readonly elementOption(): BlockSetTransformer.elementOption_return {
        let retval = new BlockSetTransformer.elementOption_return();
        retval.start = input.LT(1);

        let root_0 = null;

        let _first_0 = null;
        let _last = null;


        let id = null;
        let v = null;
        let ID30 = null;
        let ASSIGN31 = null;
        let ASSIGN32 = null;
        let ID33 = null;
        let ASSIGN34 = null;
        let ID35 = null;
        let ASSIGN36 = null;
        let ID37 = null;

        let id_tree = null;
        let v_tree = null;
        let ID30_tree = null;
        let ASSIGN31_tree = null;
        let ASSIGN32_tree = null;
        let ID33_tree = null;
        let ASSIGN34_tree = null;
        let ID35_tree = null;
        let ASSIGN36_tree = null;
        let ID37_tree = null;

        try {
            // org/antlr/v4/parse/BlockSetTransformer.g:124:2: ( ID | ^( ASSIGN id= ID v= ID ) | ^( ASSIGN ID v= STRING_LITERAL ) | ^( ASSIGN ID v= ACTION ) | ^( ASSIGN ID v= INT ) )
            let alt13 = 5;
            let LA13_0 = input.LA(1);
            if ((LA13_0 === BlockSetTransformer.ID)) {
                alt13 = 1;
            }
            else {
                if ((LA13_0 === BlockSetTransformer.ASSIGN)) {
                    let LA13_2 = input.LA(2);
                    if ((LA13_2 === DOWN)) {
                        let LA13_3 = input.LA(3);
                        if ((LA13_3 === BlockSetTransformer.ID)) {
                            switch (input.LA(4)) {
                                case ID: {
                                    {
                                        alt13 = 2;
                                    }
                                    break;
                                }

                                case STRING_LITERAL: {
                                    {
                                        alt13 = 3;
                                    }
                                    break;
                                }

                                case ACTION: {
                                    {
                                        alt13 = 4;
                                    }
                                    break;
                                }

                                case INT: {
                                    {
                                        alt13 = 5;
                                    }
                                    break;
                                }

                                default: {
                                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                                    let nvaeMark = input.mark();
                                    try {
                                        for (let nvaeConsume = 0; nvaeConsume < 4 - 1; nvaeConsume++) {
                                            input.consume();
                                        }
                                        let nvae =
                                            new NoViableAltException("", 13, 4, input);
                                        throw nvae;
                                    } finally {
                                        input.rewind(nvaeMark);
                                    }
                                }

                            }
                        }

                        else {
                            if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                            let nvaeMark = input.mark();
                            try {
                                for (let nvaeConsume = 0; nvaeConsume < 3 - 1; nvaeConsume++) {
                                    input.consume();
                                }
                                let nvae =
                                    new NoViableAltException("", 13, 3, input);
                                throw nvae;
                            } finally {
                                input.rewind(nvaeMark);
                            }
                        }

                    }

                    else {
                        if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                        let nvaeMark = input.mark();
                        try {
                            input.consume();
                            let nvae =
                                new NoViableAltException("", 13, 2, input);
                            throw nvae;
                        } finally {
                            input.rewind(nvaeMark);
                        }
                    }

                }

                else {
                    if (java.security.Signature.state.backtracking > 0) { java.security.Signature.state.failed = true; return retval; }
                    let nvae =
                        new NoViableAltException("", 13, 0, input);
                    throw nvae;
                }
            }


            switch (alt13) {
                case 1: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:124:4: ID
                    {
                        _last = input.LT(1) as GrammarAST;
                        ID30 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ID, BlockSetTransformer.FOLLOW_ID_in_elementOption470) as GrammarAST; if (java.security.Signature.state.failed) {
                            return retval;
                        }


                        if (java.security.Signature.state.backtracking === 1) {

                            if (_first_0 === null) {
                                _first_0 = ID30;
                            }

                        }


                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = _first_0;
                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                            }

                        }

                    }
                    break;
                }

                case 2: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:125:4: ^( ASSIGN id= ID v= ID )
                    {
                        _last = input.LT(1) as GrammarAST;
                        {
                            let _save_last_1 = _last;
                            let _first_1 = null;
                            _last = input.LT(1) as GrammarAST;
                            ASSIGN31 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ASSIGN, BlockSetTransformer.FOLLOW_ASSIGN_in_elementOption476) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_0 === null) {
                                    _first_0 = ASSIGN31;
                                }

                            }

                            java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = input.LT(1) as GrammarAST;
                            id = java.security.cert.CertSelector.match(input, BlockSetTransformer.ID, BlockSetTransformer.FOLLOW_ID_in_elementOption480) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_1 === null) {
                                    _first_1 = id;
                                }

                            }


                            _last = input.LT(1) as GrammarAST;
                            v = java.security.cert.CertSelector.match(input, BlockSetTransformer.ID, BlockSetTransformer.FOLLOW_ID_in_elementOption484) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_1 === null) {
                                    _first_1 = v;
                                }

                            }


                            java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = _save_last_1;
                        }


                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = _first_0;
                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                            }

                        }

                    }
                    break;
                }

                case 3: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:126:4: ^( ASSIGN ID v= STRING_LITERAL )
                    {
                        _last = input.LT(1) as GrammarAST;
                        {
                            let _save_last_1 = _last;
                            let _first_1 = null;
                            _last = input.LT(1) as GrammarAST;
                            ASSIGN32 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ASSIGN, BlockSetTransformer.FOLLOW_ASSIGN_in_elementOption491) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_0 === null) {
                                    _first_0 = ASSIGN32;
                                }

                            }

                            java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = input.LT(1) as GrammarAST;
                            ID33 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ID, BlockSetTransformer.FOLLOW_ID_in_elementOption493) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_1 === null) {
                                    _first_1 = ID33;
                                }

                            }


                            _last = input.LT(1) as GrammarAST;
                            v = java.security.cert.CertSelector.match(input, BlockSetTransformer.STRING_LITERAL, BlockSetTransformer.FOLLOW_STRING_LITERAL_in_elementOption497) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_1 === null) {
                                    _first_1 = v;
                                }

                            }


                            java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = _save_last_1;
                        }


                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = _first_0;
                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                            }

                        }

                    }
                    break;
                }

                case 4: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:127:4: ^( ASSIGN ID v= ACTION )
                    {
                        _last = input.LT(1) as GrammarAST;
                        {
                            let _save_last_1 = _last;
                            let _first_1 = null;
                            _last = input.LT(1) as GrammarAST;
                            ASSIGN34 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ASSIGN, BlockSetTransformer.FOLLOW_ASSIGN_in_elementOption504) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_0 === null) {
                                    _first_0 = ASSIGN34;
                                }

                            }

                            java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = input.LT(1) as GrammarAST;
                            ID35 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ID, BlockSetTransformer.FOLLOW_ID_in_elementOption506) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_1 === null) {
                                    _first_1 = ID35;
                                }

                            }


                            _last = input.LT(1) as GrammarAST;
                            v = java.security.cert.CertSelector.match(input, BlockSetTransformer.ACTION, BlockSetTransformer.FOLLOW_ACTION_in_elementOption510) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_1 === null) {
                                    _first_1 = v;
                                }

                            }


                            java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = _save_last_1;
                        }


                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = _first_0;
                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                            }

                        }

                    }
                    break;
                }

                case 5: {
                    // org/antlr/v4/parse/BlockSetTransformer.g:128:4: ^( ASSIGN ID v= INT )
                    {
                        _last = input.LT(1) as GrammarAST;
                        {
                            let _save_last_1 = _last;
                            let _first_1 = null;
                            _last = input.LT(1) as GrammarAST;
                            ASSIGN36 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ASSIGN, BlockSetTransformer.FOLLOW_ASSIGN_in_elementOption517) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_0 === null) {
                                    _first_0 = ASSIGN36;
                                }

                            }

                            java.security.cert.CertSelector.match(input, Token.DOWN, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = input.LT(1) as GrammarAST;
                            ID37 = java.security.cert.CertSelector.match(input, BlockSetTransformer.ID, BlockSetTransformer.FOLLOW_ID_in_elementOption519) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_1 === null) {
                                    _first_1 = ID37;
                                }

                            }


                            _last = input.LT(1) as GrammarAST;
                            v = java.security.cert.CertSelector.match(input, BlockSetTransformer.INT, BlockSetTransformer.FOLLOW_INT_in_elementOption523) as GrammarAST; if (java.security.Signature.state.failed) {
                                return retval;
                            }


                            if (java.security.Signature.state.backtracking === 1) {

                                if (_first_1 === null) {
                                    _first_1 = v;
                                }

                            }


                            java.security.cert.CertSelector.match(input, Token.UP, null); if (java.security.Signature.state.failed) {
                                return retval;
                            }

                            _last = _save_last_1;
                        }


                        if (java.security.Signature.state.backtracking === 1) {
                            retval.tree = _first_0;
                            if (this.adaptor.getParent(retval.tree) !== null && this.adaptor.isNil(this.adaptor.getParent(retval.tree))) {

                                retval.tree = this.adaptor.getParent(retval.tree) as GrammarAST;
                            }

                        }

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
    };;;;;;;;

    static {
        let numStates = BlockSetTransformer.DFA10_transitionS.length;
        BlockSetTransformer.DFA10_transition = new Int16Array(numStates)[];
        for (let i = 0; i < numStates; i++) {
            BlockSetTransformer.DFA10_transition[i] = DFA.unpackEncodedString(BlockSetTransformer.DFA10_transitionS[i]);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace BlockSetTransformer {
    export type topdown_return = InstanceType<typeof BlockSetTransformer.topdown_return>;
    export type setAlt_return = InstanceType<typeof BlockSetTransformer.setAlt_return>;
    export type ebnfBlockSet_return = InstanceType<typeof BlockSetTransformer.ebnfBlockSet_return>;
    export type ebnfSuffix_return = InstanceType<typeof BlockSetTransformer.ebnfSuffix_return>;
    export type blockSet_return = InstanceType<typeof BlockSetTransformer.blockSet_return>;
    export type setElement_return = InstanceType<typeof BlockSetTransformer.setElement_return>;
    export type elementOptions_return = InstanceType<typeof BlockSetTransformer.elementOptions_return>;
    export type elementOption_return = InstanceType<typeof BlockSetTransformer.elementOption_return>;
    export type DFA10 = InstanceType<BlockSetTransformer["DFA10"]>;
}
