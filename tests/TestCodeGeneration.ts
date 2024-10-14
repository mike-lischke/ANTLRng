/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





export class TestCodeGeneration {

    /** Add tags around each attribute/template/value write */
    public static DebugInterpreter = class DebugInterpreter extends Interpreter {
        protected evals = new Array<string>();
        protected myErrMgrCopy: java.util.logging.ErrorManager;
        protected tab = 0;
        public constructor(group: STGroup, errMgr: java.util.logging.ErrorManager, debug: boolean) {
            super(group, errMgr, debug);
            this.myErrMgrCopy = errMgr;
        }

        public indent(out: STWriter): void {
            for (let i = 1; i <= this.tab; i++) {
                out.write("\t");
            }
        }


        protected writeObject(out: STWriter, scope: InstanceScope, o: Object, options: string[]): number {
            if (o instanceof ST) {
                let name = (o as ST).getName();
                name = name.substring(1);
                if (!name.startsWith("_sub")) {
                    try {
                        out.write("<ST:" + name + ">");
                        this.evals.add("<ST:" + name + ">");
                        let r = super.writeObject(out, scope, o, options);
                        out.write("</ST:" + name + ">");
                        this.evals.add("</ST:" + name + ">");
                        return r;
                    } catch (ioe) {
                        if (ioe instanceof IOException) {
                            this.myErrMgrCopy.IOError(scope.st, ErrorType.WRITE_IO_ERROR, ioe);
                        } else {
                            throw ioe;
                        }
                    }
                }
            }
            return super.writeObject(out, scope, o, options);
        }


        protected writePOJO(out: STWriter, scope: InstanceScope, o: Object, options: string[]): number {
            let type = o.getClass();
            let name = type.getSimpleName();
            out.write("<pojo:" + name + ">" + o.toString() + "</pojo:" + name + ">");
            this.evals.add("<pojo:" + name + ">" + o.toString() + "</pojo:" + name + ">");
            return super.writePOJO(out, scope, o, options);
        }
    };

    @Test
    public testArgDecl(): void { // should use template not string
		/*ErrorQueue equeue = */new ErrorQueue();
        let g =
            "grammar T;\n" +
            "a[int xyz] : 'a' ;\n";
        let evals = this.getEvalInfoForString(g, "int xyz");
        System.out.println(evals);
        for (let i = 0; i < evals.size(); i++) {
            let eval = evals.get(i);
            assertFalse(eval.startsWith("<pojo:"), "eval should not be POJO: " + eval);
        }
    }

    @Test
    public AssignTokenNamesToStringLiteralsInGeneratedParserRuleContexts(): void {
        let g =
            "grammar T;\n" +
            "root: 't1';\n" +
            "Token: 't1';";
        let evals = this.getEvalInfoForString(g, "() { return getToken(");
        assertNotEquals(0, evals.size());
    }

    @Test
    public AssignTokenNamesToStringLiteralArraysInGeneratedParserRuleContexts(): void {
        let g =
            "grammar T;\n" +
            "root: 't1' 't1';\n" +
            "Token: 't1';";
        let evals = this.getEvalInfoForString(g, "() { return getTokens(");
        assertNotEquals(0, evals.size());
    }

    public getEvalInfoForString(grammarString: string, pattern: string): Array<string> {
        let equeue = new ErrorQueue();
        let g = new Grammar(grammarString);
        let evals = new Array<string>();
        if (g.ast !== null && !g.ast.hasErrors) {
            let sem = new SemanticPipeline(g);
            sem.process();

            let factory = new ParserATNFactory(g);
            if (g.isLexer()) {
                factory = new LexerATNFactory(g as LexerGrammar);
            }

            g.atn = factory.createATN();

            let gen = CodeGenerator.create(g);
            let outputFileST = gen.generateParser();

            //			STViz viz = outputFileST.inspect();
            //			try {
            //				viz.waitForClose();
            //			}
            //			catch (Exception e) {
            //				e.printStackTrace();
            //			}

            let debug = false;
            let interp =
                new TestCodeGeneration.DebugInterpreter(outputFileST.groupThatCreatedThisInstance,
                    outputFileST.impl.nativeGroup.errMgr,
                    debug);
            let scope = new InstanceScope(null, outputFileST);
            let sw = new StringWriter();
            let out = new AutoIndentWriter(sw);
            interp.exec(out, scope);

            for (let e of interp.evals) {
                if (e.contains(pattern)) {
                    evals.add(e);
                }
            }
        }
        if (equeue.size() > 0) {
            System.err.println(equeue.toString());
        }
        return evals;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TestCodeGeneration {
    export type DebugInterpreter = InstanceType<typeof TestCodeGeneration.DebugInterpreter>;
}
