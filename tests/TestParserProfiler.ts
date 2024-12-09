/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ANTLRInputStream, CommonTokenStream, LexerInterpreter, ParserInterpreter, ParserRuleContext, DecisionInfo } from "antlr4ng";

export class TestParserProfiler {
    protected static readonly lg: LexerGrammar;

    @Test
    public testLL1(): void {
        const g = new Grammar(
            "parser grammar T;\n" +
            "s : ';'{}\n" +
            "  | '.'\n" +
            "  ;\n",
            TestParserProfiler.lg);

        const info = this.interpAndGetDecisionInfo(TestParserProfiler.lg, g, "s", ";");
        assertEquals(1, info.length);
        const expecting =
            "{decision=0, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=1, " +
            "SLL_ATNTransitions=1, SLL_DFATransitions=0, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}";
        assertEquals(expecting, info[0].toString());
    }

    @Test
    public testLL2(): void {
        const g = new Grammar(
            "parser grammar T;\n" +
            "s : ID ';'{}\n" +
            "  | ID '.'\n" +
            "  ;\n",
            TestParserProfiler.lg);

        const info = this.interpAndGetDecisionInfo(TestParserProfiler.lg, g, "s", "xyz;");
        assertEquals(1, info.length);
        const expecting =
            "{decision=0, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=2, " +
            "SLL_ATNTransitions=2, SLL_DFATransitions=0, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}";
        assertEquals(expecting, info[0].toString());
    }

    @Test
    public testRepeatedLL2(): void {
        const g = new Grammar(
            "parser grammar T;\n" +
            "s : ID ';'{}\n" +
            "  | ID '.'\n" +
            "  ;\n",
            TestParserProfiler.lg);

        const info = this.interpAndGetDecisionInfo(TestParserProfiler.lg, g, "s", "xyz;", "abc;");
        assertEquals(1, info.length);
        const expecting =
            "{decision=0, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=4, " +
            "SLL_ATNTransitions=2, SLL_DFATransitions=2, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}";
        assertEquals(expecting, info[0].toString());
    }

    @Test
    public test3xLL2(): void {
        const g = new Grammar(
            "parser grammar T;\n" +
            "s : ID ';'{}\n" +
            "  | ID '.'\n" +
            "  ;\n",
            TestParserProfiler.lg);

        // The '.' vs ';' causes another ATN transition
        const info = this.interpAndGetDecisionInfo(TestParserProfiler.lg, g, "s", "xyz;", "abc;", "z.");
        assertEquals(1, info.length);
        const expecting =
            "{decision=0, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=6, " +
            "SLL_ATNTransitions=3, SLL_DFATransitions=3, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}";
        assertEquals(expecting, info[0].toString());
    }

    @Test
    public testOptional(): void {
        const g = new Grammar(
            "parser grammar T;\n" +
            "s : ID ('.' ID)? ';'\n" +
            "  | ID INT \n" +
            "  ;\n",
            TestParserProfiler.lg);

        const info = this.interpAndGetDecisionInfo(TestParserProfiler.lg, g, "s", "a.b;");
        assertEquals(2, info.length);
        const expecting =
            "[{decision=0, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=1, " +
            "SLL_ATNTransitions=1, SLL_DFATransitions=0, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}, " +
            "{decision=1, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=2, " +
            "SLL_ATNTransitions=2, SLL_DFATransitions=0, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}]";
        assertEquals(expecting, Arrays.toString(info));
    }

    @Test
    public test2xOptional(): void {
        const g = new Grammar(
            "parser grammar T;\n" +
            "s : ID ('.' ID)? ';'\n" +
            "  | ID INT \n" +
            "  ;\n",
            TestParserProfiler.lg);

        const info = this.interpAndGetDecisionInfo(TestParserProfiler.lg, g, "s", "a.b;", "a.b;");
        assertEquals(2, info.length);
        const expecting =
            "[{decision=0, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=2, " +
            "SLL_ATNTransitions=1, SLL_DFATransitions=1, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}, " +
            "{decision=1, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=4, " +
            "SLL_ATNTransitions=2, SLL_DFATransitions=2, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}]";
        assertEquals(expecting, Arrays.toString(info));
    }

    @Test
    public testContextSensitivity(): void {
        const g = new Grammar(
            "parser grammar T;\n" +
            "a : '.' e ID \n" +
            "  | ';' e INT ID ;\n" +
            "e : INT | ;\n",
            TestParserProfiler.lg);
        const info = this.interpAndGetDecisionInfo(TestParserProfiler.lg, g, "a", "; 1 x");
        assertEquals(2, info.length);
        const expecting =
            "{decision=1, contextSensitivities=1, errors=0, ambiguities=0, SLL_lookahead=3, SLL_ATNTransitions=2, SLL_DFATransitions=0, LL_Fallback=1, LL_lookahead=3, LL_ATNTransitions=2}";
        assertEquals(expecting, info[1].toString());
    }

    @Disabled
    @Disabled

    @Test
    public testSimpleLanguage(): void {
        const g = new Grammar(TestXPath.grammar);
        const input =
            "def f(x,y) { x = 3+4*1*1/5*1*1+1*1+1; y; ; }\n" +
            "def g(x,a,b,c,d,e) { return 1+2*x; }\n" +
            "def h(x) { a=3; x=0+1; return a*x; }\n";
        const info = this.interpAndGetDecisionInfo(g.getImplicitLexer(), g, "prog", input);
        const expecting =
            "[{decision=0, contextSensitivities=1, errors=0, ambiguities=0, SLL_lookahead=3, " +
            "SLL_ATNTransitions=2, SLL_DFATransitions=0, LL_Fallback=1, LL_ATNTransitions=1}]";

        assertEquals(expecting, Arrays.toString(info));
        assertEquals(1, info.length);
    }

    @Disabled
    @Disabled

    @Test
    public testDeepLookahead(): void {
        const g = new Grammar(
            "parser grammar T;\n" +
            "s : e ';'\n" +
            "  | e '.' \n" +
            "  ;\n" +
            "e : (ID|INT) ({true}? '+' e)*\n" + // d=1 entry, d=2 bypass
            "  ;\n",
            TestParserProfiler.lg);

        // pred forces to
        // ambig and ('+' e)* tail recursion forces lookahead to fall out of e
        // any non-precedence predicates are always evaluated as true by the interpreter
        const info = this.interpAndGetDecisionInfo(TestParserProfiler.lg, g, "s", "a+b+c;");
        // at "+b" it uses k=1 and enters loop then calls e for b...
        // e matches and d=2 uses "+c;" for k=3
        assertEquals(2, info.length);
        const expecting =
            "[{decision=0, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=6, " +
            "SLL_ATNTransitions=6, SLL_DFATransitions=0, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}, " +
            "{decision=1, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=4, " +
            "SLL_ATNTransitions=2, SLL_DFATransitions=2, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}]";
        assertEquals(expecting, Arrays.toString(info));
    }

    @Test
    public testProfilerGeneratedCode(): void {
        const grammar =
            "grammar T;\n" +
            "s : a+ ID EOF ;\n" +
            "a : ID ';'{}\n" +
            "  | ID '.'\n" +
            "  ;\n" +
            "WS : [ \\r\\t\\n]+ -> channel(HIDDEN) ;\n" +
            "SEMI : ';' ;\n" +
            "DOT : '.' ;\n" +
            "ID : [a-zA-Z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "PLUS : '+' ;\n" +
            "MULT : '*' ;\n";

        const runOptions = createOptionsForJavaToolTests("T.g4", grammar, "TParser", "TLexer",
            false, false, "s", "xyz;abc;z.q",
            true, false, Stage.Execute);
        {
            // This holds the final error to throw (if any).
            let error: java.lang.Throwable | undefined;

            const runner: JavaRunner = new JavaRunner();
            try {
                try {
                    const state = runner.run(runOptions) as ExecutedState;
                    const expecting =
                        "[{decision=0, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=6, SLL_ATNTransitions=4, " +
                        "SLL_DFATransitions=2, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}," +
                        " {decision=1, contextSensitivities=0, errors=0, ambiguities=0, SLL_lookahead=6, " +
                        "SLL_ATNTransitions=3, SLL_DFATransitions=3, LL_Fallback=0, LL_lookahead=0, LL_ATNTransitions=0}]\n";
                    assertEquals(expecting, state.output);
                    assertEquals("", state.errors);
                } finally {
                    error = closeResources([runner]);
                }
            } catch (e) {
                error = handleResourceError(e, error);
            } finally {
                throwResourceError(error);
            }
        }

    }

    public interpAndGetDecisionInfo(
        lg: LexerGrammar, g: Grammar,
        startRule: string, ...input: string[]): DecisionInfo[] {

        const lexEngine = lg.createLexerInterpreter(null);
        const parser = g.createParserInterpreter(null);
        parser.setProfile(true);
        for (const s of ANTLRInputStream.ANTLRInputStream.input) {
            lexEngine.reset();
            parser.reset();
            lexEngine.setInputStream(new ANTLRInputStream(s));
            const tokens = new CommonTokenStream(lexEngine);
            parser.setInputStream(tokens);
            const r = g.rules.get(startRule);
            if (r === null) {
                return parser.getParseInfo().getDecisionInfo();
            }
            const t = parser.parse(r.index);
            //			try {
            //				Utils.waitForClose(t.inspect(parser).get());
            //			}
            //			catch (Exception e) {
            //				e.printStackTrace();
            //			}
            //
            //			System.out.println(t.toStringTree(parser));
        }

        return parser.getParseInfo().getDecisionInfo();
    }

    static {
        try {
            TestParserProfiler.lg = new LexerGrammar(
                "lexer grammar L;\n" +
                "WS : [ \\r\\t\\n]+ -> channel(HIDDEN) ;\n" +
                "SEMI : ';' ;\n" +
                "DOT : '.' ;\n" +
                "ID : [a-zA-Z]+ ;\n" +
                "INT : [0-9]+ ;\n" +
                "PLUS : '+' ;\n" +
                "MULT : '*' ;\n");
        } catch (e) {
            if (e instanceof RecognitionException) {
                throw new RuntimeException(e);
            } else {
                throw e;
            }
        }
    }
}
