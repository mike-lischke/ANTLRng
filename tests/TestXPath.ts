/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Parser, ParseRuleContext, ParseTree, TerminalNode, XPath } from "antlr4ng";



export class TestXPath {
    public static readonly grammar =
        "grammar Expr;\n" +
        "prog:   func+ ;\n" +
        "func:  'def' ID '(' arg (',' arg)* ')' body ;\n" +
        "body:  '{' stat+ '}' ;\n" +
        "arg :  ID ;\n" +
        "stat:   expr ';'                 # printExpr\n" +
        "    |   ID '=' expr ';'          # assign\n" +
        "    |   'return' expr ';'        # ret\n" +
        "    |   ';'                      # blank\n" +
        "    ;\n" +
        "expr:   expr ('*'|'/') expr      # MulDiv\n" +
        "    |   expr ('+'|'-') expr      # AddSub\n" +
        "    |   primary                  # prim\n" +
        "    ;\n" +
        "primary" +
        "    :   INT                      # int\n" +
        "    |   ID                       # id\n" +
        "    |   '(' expr ')'             # parens\n" +
        "	 ;" +
        "\n" +
        "MUL :   '*' ; // assigns token name to '*' used above in grammar\n" +
        "DIV :   '/' ;\n" +
        "ADD :   '+' ;\n" +
        "SUB :   '-' ;\n" +
        "RETURN : 'return' ;\n" +
        "ID  :   [a-zA-Z]+ ;      // match identifiers\n" +
        "INT :   [0-9]+ ;         // match integers\n" +
        "NEWLINE:'\\r'? '\\n' -> skip;     // return newlines to parser (is end-statement signal)\n" +
        "WS  :   [ \\t]+ -> skip ; // toss out whitespace\n";
    public static readonly SAMPLE_PROGRAM =
        "def f(x,y) { x = 3+4; y; ; }\n" +
        "def g(x) { return 1+2*x; }\n";

    @Test
    public testValidPaths(): void {
        let xpath = [
            "/prog/func",		// all funcs under prog at root
            "/prog/*",			// all children of prog at root
            "/*/func",			// all func kids of any root node
            "prog",				// prog must be root node
            "/prog",			// prog must be root node
            "/*",				// any root
            "*",				// any root
            "//ID",				// any ID in tree
            "//expr/primary/ID",// any ID child of a primary under any expr
            "//body//ID",		// any ID under a body
            "//'return'",		// any 'return' literal in tree, matched by literal name
            "//RETURN",			// any 'return' literal in tree, matched by symbolic name
            "//primary/*",		// all kids of any primary
            "//func/*/stat",	// all stat nodes grand kids of any func node
            "/prog/func/'def'",	// all def literal kids of func kid of prog
            "//stat/';'",		// all ';' under any stat node
            "//expr/primary/!ID",	// anything but ID under primary under any expr node
            "//expr/!primary",	// anything but primary under any expr node
            "//!*",				// nothing anywhere
            "/!*",				// nothing at root
            "//expr//ID",		// any ID under any expression (tests antlr/antlr4#370)
        ];
        let expected = [
            "[func, func]",
            "[func, func]",
            "[func, func]",
            "[prog]",
            "[prog]",
            "[prog]",
            "[prog]",
            "[f, x, y, x, y, g, x, x]",
            "[y, x]",
            "[x, y, x]",
            "[return]",
            "[return]",
            "[3, 4, y, 1, 2, x]",
            "[stat, stat, stat, stat]",
            "[def, def]",
            "[;, ;, ;, ;]",
            "[3, 4, 1, 2]",
            "[expr, expr, expr, expr, expr, expr]",
            "[]",
            "[]",
            "[y, x]",
        ];

        for (let i = 0; i < xpath.length; i++) {
            let nodes = this.getNodeStrings("Expr.g4", TestXPath.grammar, TestXPath.SAMPLE_PROGRAM, xpath[i], "prog", "ExprParser", "ExprLexer");
            let result = nodes.toString();
            assertEquals(expected[i], result, "path " + xpath[i] + " failed");
        }
    }

    @Test
    public testWeirdChar(): void {
        let path = "&";
        let expected = "Invalid tokens or characters at index 0 in path '&'";

        this.testError("Expr.g4", TestXPath.grammar, TestXPath.SAMPLE_PROGRAM, path, expected, "prog", "ExprParser", "ExprLexer");
    }

    @Test
    public testWeirdChar2(): void {
        let path = "//w&e/";
        let expected = "Invalid tokens or characters at index 3 in path '//w&e/'";

        this.testError("Expr.g4", TestXPath.grammar, TestXPath.SAMPLE_PROGRAM, path, expected, "prog", "ExprParser", "ExprLexer");
    }

    @Test
    public testBadSyntax(): void {
        let path = "///";
        let expected = "/ at index 2 isn't a valid rule name";

        this.testError("Expr.g4", TestXPath.grammar, TestXPath.SAMPLE_PROGRAM, path, expected, "prog", "ExprParser", "ExprLexer");
    }

    @Test
    public testMissingWordAtEnd(): void {
        let path = "//";
        let expected = "Missing path element at end of path";

        this.testError("Expr.g4", TestXPath.grammar, TestXPath.SAMPLE_PROGRAM, path, expected, "prog", "ExprParser", "ExprLexer");
    }

    @Test
    public testBadTokenName(): void {
        let path = "//Ick";
        let expected = "Ick at index 2 isn't a valid token name";

        this.testError("Expr.g4", TestXPath.grammar, TestXPath.SAMPLE_PROGRAM, path, expected, "prog", "ExprParser", "ExprLexer");
    }

    @Test
    public testBadRuleName(): void {
        let path = "/prog/ick";
        let expected = "ick at index 6 isn't a valid rule name";

        this.testError("Expr.g4", TestXPath.grammar, TestXPath.SAMPLE_PROGRAM, path, expected, "prog", "ExprParser", "ExprLexer");
    }

    private testError(grammarFileName: string, grammar: string, input: string, xpath: string, expected: string,
        startRuleName: string, parserName: string, lexerName: string): void {
        let e = null;
        try {
            this.compileAndExtract(grammarFileName, grammar, input, xpath, startRuleName, parserName, lexerName);
        } catch (iae) {
            if (iae instanceof IllegalArgumentException) {
                e = iae;
            } else {
                throw iae;
            }
        }
        assertNotNull(e);
        assertEquals(expected, e.getMessage());
    }

    private getNodeStrings(grammarFileName: string, grammar: string, input: string, xpath: string,
        startRuleName: string, parserName: string, lexerName: string): Array<string> {
        let result = this.compileAndExtract(
            grammarFileName, grammar, input, xpath, startRuleName, parserName, lexerName);

        let nodes = new Array();
        for (let t of result.b) {
            if (t instanceof RuleContext) {
                let r = t as RuleContext;
                nodes.add(result.a[r.getRuleIndex()]);
            }
            else {
                let token = t as TerminalNode;
                nodes.add(token.getText());
            }
        }
        return nodes;
    }

    private compileAndExtract(grammarFileName: string, grammar: string,
        input: string, xpath: string, startRuleName: string,
        parserName: string, lexerName: string
    ): <string[], Collection<ParseTree>> {
        let  runOptions = createOptionsForJavaToolTests(grammarFileName, grammar, parserName, lexerName,
            false, false, startRuleName, input,
            false, false, Stage.Execute);
		 {
    // This holds the final error to throw (if any).
    let error: java.lang.Throwable | undefined;

    const runner: JavaRunner = new JavaRunner();
    try {
        try {
            let executedState = runner.run(runOptions) as JavaExecutedState;
            let compiledState = executedState.previousState as JavaCompiledState;
            let parser = compiledState.initializeLexerAndParser(input).b;
            let found = XPath.findAll(executedState.parseTree, xpath, parser);

            return new (parser.getRuleNames(), found);
        }
        finally {
            error = closeResources([runner]);
        }
    } catch (e) {
        error = handleResourceError(e, error);
    } finally {
        throwResourceError(error);
    }
}

	}
}
