/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import {
    CharStream, CommonToken, CommonTokenStream, DiagnosticErrorListener, Lexer, Parser, ParserRuleContext,
    PredictionMode, TokenStream,
} from "antlr4ng";

/**
 * Run a lexer/parser combo, optionally printing tree string or generating
 *  postscript file. Optionally taking input file.
 *
 *  $ java org.antlr.v4.runtime.misc.TestRig GrammarName startRuleName
 *        [-tree]
 *        [-tokens] [-gui] [-ps file.ps]
 *        [-trace]
 *        [-diagnostics]
 *        [-SLL]
 *        [input-filename(s)]
 */
export class TestRig {
    public static readonly LEXER_START_RULE_NAME = "tokens";

    protected grammarName: string;
    protected startRuleName: string;
    protected readonly inputFiles = new Array<string>();
    protected printTree = false;
    protected gui = false;
    protected psFile = null;
    protected showTokens = false;
    protected trace = false;
    protected diagnostics = false;
    protected encoding = null;
    protected SLL = false;

    public constructor(args: string[]) {
        if (args.length < 2) {
            System.err.println("java org.antlr.v4.gui.TestRig GrammarName startRuleName\n" +
                "  [-tokens] [-tree] [-gui] [-ps file.ps] [-encoding encodingname]\n" +
                "  [-trace] [-diagnostics] [-SLL]\n" +
                "  [input-filename(s)]");
            System.err.println("Use startRuleName='tokens' if GrammarName is a lexer grammar.");
            System.err.println("Omitting input-filename makes rig read from stdin.");

            return;
        }
        let i = 0;
        this.grammarName = args[i];
        i++;
        this.startRuleName = args[i];
        i++;
        while (i < args.length) {
            const arg = args[i];
            i++;
            if (!arg.startsWith("-")) { // input file name
                this.inputFiles.add(arg);
                continue;
            }
            if (arg.equals("-tree")) {
                this.printTree = true;
            }
            if (arg.equals("-gui")) {
                this.gui = true;
            }
            if (arg.equals("-tokens")) {
                this.showTokens = true;
            }
            else {
                if (arg.equals("-trace")) {
                    this.trace = true;
                }
                else {
                    if (arg.equals("-SLL")) {
                        this.SLL = true;
                    }
                    else {
                        if (arg.equals("-diagnostics")) {
                            this.diagnostics = true;
                        }
                        else {
                            if (arg.equals("-encoding")) {
                                if (i >= args.length) {
                                    System.err.println("missing encoding on -encoding");

                                    return;
                                }
                                this.encoding = args[i];
                                i++;
                            }
                            else {
                                if (arg.equals("-ps")) {
                                    if (i >= args.length) {
                                        System.err.println("missing filename on -ps");

                                        return;
                                    }
                                    this.psFile = args[i];
                                    i++;
                                }
                            }

                        }

                    }

                }

            }

        }
    }

    public static main(args: string[]): void {
        const testRig = new TestRig(args);
        if (args.length >= 2) {
            testRig.process();
        }
    }

    public process(): void;

    protected process(lexer: Lexer, parserClass: Class<Parser>, parser: Parser, input: CharStream): void;
    public process(...args: unknown[]): void {
        switch (args.length) {
            case 0: {

                //		System.out.println("exec "+grammarName+"."+startRuleName);
                let lexerName = this.grammarName + "Lexer";
                const cl = Thread.currentThread().getContextClassLoader();
                let lexerClass = null;
                try {
                    lexerClass = cl.loadClass(lexerName).asSubclass(Lexer.class);
                } catch (cnfe) {
                    if (cnfe instanceof java.lang.ClassNotFoundException) {
                        // might be pure lexer grammar; no Lexer suffix then
                        lexerName = this.grammarName;
                        try {
                            lexerClass = cl.loadClass(lexerName).asSubclass(Lexer.class);
                        } catch (cnfe2) {
                            if (cnfe2 instanceof ClassNotFoundException) {
                                System.err.println("Can't load " + lexerName + " as lexer or parser");

                                return;
                            } else {
                                throw cnfe2;
                            }
                        }
                    } else {
                        throw cnfe;
                    }
                }

                const lexerCtor = lexerClass.getConstructor(CharStream.class);
                const lexer = lexerCtor.newInstance(null as CharStream);

                let parserClass = null;
                let parser = null;
                if (!this.startRuleName.equals(TestRig.LEXER_START_RULE_NAME)) {
                    const parserName = this.grammarName + "Parser";
                    parserClass = cl.loadClass(parserName).asSubclass(Parser.class);
                    const parserCtor = parserClass.getConstructor(TokenStream.class);
                    parser = parserCtor.newInstance(null as TokenStream);
                }

                const charset = (this.encoding === null ? Charset.defaultCharset() : Charset.forName(this.encoding));
                if (this.inputFiles.size() === 0) {
                    const charStream = CharStreams.fromStream(System.in, charset);
                    this.process(lexer, parserClass, parser, charStream);

                    return;
                }
                for (const inputFile of this.inputFiles) {
                    const charStream = CharStreams.fromPath(Paths.get(inputFile), charset);
                    if (this.inputFiles.size() > 1) {
                        System.err.println(inputFile);
                    }
                    this.process(lexer, parserClass, parser, charStream);
                }

                break;
            }

            case 4: {
                const [lexer, parserClass, parser, input] = args as [Lexer, Class<Parser>, Parser, CharStream];

                lexer.setInputStream(input);
                const tokens = new CommonTokenStream(lexer);

                tokens.fill();

                if (this.showTokens) {
                    for (const tok of tokens.getTokens()) {
                        if (tok instanceof CommonToken) {
                            System.out.println((tok).toString(lexer));
                        }
                        else {
                            System.out.println(tok.toString());
                        }
                    }
                }

                if (this.startRuleName.equals(TestRig.LEXER_START_RULE_NAME)) {
                    return;
                }

                if (this.diagnostics) {
                    parser.addErrorListener(new DiagnosticErrorListener());
                    parser.getInterpreter().setPredictionMode(PredictionMode.LL_EXACT_AMBIG_DETECTION);
                }

                if (this.printTree || this.gui || this.psFile !== null) {
                    parser.setBuildParseTree(true);
                }

                if (this.SLL) { // overrides diagnostics
                    parser.getInterpreter().setPredictionMode(PredictionMode.SLL);
                }

                parser.setTokenStream(tokens);
                parser.setTrace(this.trace);

                try {
                    const startRule = parserClass.getMethod(this.startRuleName);
                    const tree = startRule.invoke(parser, null as object[]) as ParserRuleContext;

                    if (this.printTree) {
                        System.out.println(tree.toStringTree(parser));
                    }
                    if (this.gui) {
                        Trees.inspect(tree, parser);
                    }
                    if (this.psFile !== null) {
                        Trees.save(tree, parser, this.psFile); // Generate postscript
                    }
                } catch (nsme) {
                    if (nsme instanceof NoSuchMethodException) {
                        System.err.println("No method for rule " + this.startRuleName + " or it has arguments");
                    } else {
                        throw nsme;
                    }
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

}
