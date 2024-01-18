
import { java, JavaObject, type int } from "jree";
import { Stage } from "./Stage.js";
import { RuntimeTestDescriptor } from "./RuntimeTestDescriptor.js";
import { RuntimeRunner } from "./RuntimeRunner.js";
import { RunOptions } from "./RunOptions.js";
import { GrammarType } from "./GrammarType.js";
import { FileUtils } from "./FileUtils.js";
import { PredictionMode } from "antlr4ng";
import { JavaRunner } from "./java/JavaRunner.js";
import { ExecutedState } from "./states/ExecutedState.js";
import { assertEquals, assertThrows } from "../junit.js";

type String = java.lang.String;
const String = java.lang.String;
type System = java.lang.System;
const System = java.lang.System;
type Files = java.nio.file.Files;
const Files = java.nio.file.Files;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;
type Class<T> = java.lang.Class<T>;
const Class = java.lang.Class;

import { Test, Override } from "../decorators.js";

/**
 * Run a lexer/parser and dump ATN debug/trace information
 *
 *  java org.antlr.v4.test.runtime.TraceATN [X.g4|XParser.g4 XLexer.g4] startRuleName -target [Java|Cpp|...] inputFileName
 *
 *
 * In preparation, run this so we get right jars before trying this script:
 *
 * cd ANTLR-ROOT-DIR
 * mvn install -DskipTests=true
 * cd runtime-tests
 * mvn install jar:test-jar -DskipTests=true
 *
 * Run shell script with
 *
 * scripts/traceatn.sh /tmp/JSON.g4 json /tmp/foo.json
 *
 * Here is scripts/traceatn.sh:
 *
 * export ANTLRJAR=/Users/parrt/.m2/repository/org/antlr/antlr4/4.11.2-SNAPSHOT/antlr4-4.11.2-SNAPSHOT-complete.jar
 * export TESTJAR=/Users/parrt/.m2/repository/org/antlr/antlr4-runtime-testsuite/4.11.2-SNAPSHOT/antlr4-runtime-testsuite-4.11.2-SNAPSHOT-tests.jar
 * java -classpath $ANTLRJAR:$TESTJAR org.antlr.v4.test.runtime.TraceATN $@
 */
export class TraceATN extends JavaObject {
    public static IgnoreTokenVocabGrammar = class IgnoreTokenVocabGrammar extends Grammar {
        public constructor(fileName: String,
            grammarText: String,
            tokenVocabSource: Grammar,
            listener: ANTLRToolListener) {
            super(fileName, grammarText, tokenVocabSource, listener);
        }

        @Override
        public importTokensFromTokensFile(): void {
            // don't try to import tokens files; must give me both grammars if split
        }
    };

    protected grammarFileName: String;
    protected parserGrammarFileName: String;
    protected lexerGrammarFileName: String;
    protected startRuleName: String;
    protected inputFileName: String;
    protected targetName = "Java";
    protected encoding: String;

    public constructor(args: String[]) {
        super();
        if (args.length < 2) {
            System.err.println("java org.antlr.v4.test.runtime.TraceATN [X.g4|XParser.g4 XLexer.g4] startRuleName\n" +
                "    [-encoding encodingname] -target (Java|Cpp|...) input-filename");
            System.err.println("Omitting input-filename makes program read from stdin.");

            return;
        }
        let i = 0;
        this.grammarFileName = args[i];
        i++;
        if (args[i].endsWith(".g4")) {
            this.parserGrammarFileName = this.grammarFileName;
            this.lexerGrammarFileName = args[i];
            i++;
            this.grammarFileName = null;

            if (this.parserGrammarFileName.toLowerCase().endsWith("lexer.g4")) { // swap
                const save = this.parserGrammarFileName;
                this.parserGrammarFileName = this.lexerGrammarFileName;
                this.lexerGrammarFileName = save;
            }
        }
        this.startRuleName = args[i];
        i++;
        while (i < args.length) {
            const arg = args[i];
            i++;
            if (arg.charAt(0) !== "-") { // input file name
                this.inputFileName = arg;
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
                    if (arg.equals("-target")) {
                        if (i >= args.length) {
                            System.err.println("missing name on -target");

                            return;
                        }
                        this.targetName = args[i];
                        i++;
                    }
                }

            }

        }
    }

    public static getRunner(targetName: String): RuntimeRunner {
        const cl = Class.forName("org.antlr.v4.test.runtime." +
            targetName.toLowerCase() + "." + targetName + "Runner");

        return cl.newInstance() as RuntimeRunner;
    }

    public static main(args: String[]): void {
        const I = new TraceATN(args);
        I.execParse();
    }

    public test(descriptor: RuntimeTestDescriptor, runner: RuntimeRunner, targetName: String): String {
        FileUtils.mkdir(runner.getTempDirPath());

        const grammarName = descriptor.grammarName;
        const grammar = descriptor.grammar;

        let lexerName: String;
        let parserName: String;
        let useListenerOrVisitor: boolean;
        let superClass: String;
        if (descriptor.testType === GrammarType.Parser || descriptor.testType === GrammarType.CompositeParser) {
            lexerName = grammarName + "Lexer";
            parserName = grammarName + "Parser";
            useListenerOrVisitor = true;
            if (targetName !== null && targetName.equals("Java")) {
                superClass = JavaRunner.runtimeTestParserName;
            }
            else {
                superClass = null;
            }
        }
        else {
            lexerName = grammarName;
            parserName = null;
            useListenerOrVisitor = false;
            if (targetName.equals("Java")) {
                superClass = JavaRunner.runtimeTestLexerName;
            }
            else {
                superClass = null;
            }
        }

        const runOptions = new RunOptions(grammarName + ".g4",
            grammar,
            parserName,
            lexerName,
            useListenerOrVisitor,
            useListenerOrVisitor,
            descriptor.startRule,
            descriptor.input,
            false,
            descriptor.showDiagnosticErrors,
            descriptor.traceATN,
            descriptor.showDFA,
            Stage.Execute,
            targetName,
            superClass,
            PredictionMode.LL,
            true,
        );

        const result = runner.run(runOptions);

        let executedState: ExecutedState;
        if (result instanceof ExecutedState) {
            executedState = result;
            if (executedState.exception !== null) {
                return result.getErrorMessage();
            }

            return executedState.output;
        }
        else {
            return result.getErrorMessage();
        }
    }

    protected execParse(): void {
        if (this.grammarFileName === null && (this.parserGrammarFileName === null && this.lexerGrammarFileName === null)) {
            System.err.println("No grammar specified");

            return;
        }

        if (this.inputFileName === null) {
            System.err.println("No input file specified");

            return;
        }

        let grammarName =
            this.grammarFileName.substring(this.grammarFileName.lastIndexOf("/") + 1, this.grammarFileName.length());
        grammarName = grammarName.substring(0, grammarName.indexOf(".g4"));
        if (this.grammarFileName !== null) {
            const grammar = new String(Files.readAllBytes(Paths.get(this.grammarFileName)));

            const input = new String(Files.readAllBytes(Paths.get(this.inputFileName)));

            const descriptor = new RuntimeTestDescriptor(
                GrammarType.CompositeParser,
                "TraceATN-" + this.grammarFileName,
                "",
                input,
                "",
                "",
                this.startRuleName,
                grammarName,
                grammar,
                null,
                false,
                true,
                false,
                PredictionMode.LL,
                true,
                null,
                null);

            const runner = TraceATN.getRunner(this.targetName);

            const result = this.test(descriptor, runner, this.targetName);
            console.log(result);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TraceATN {
    export type IgnoreTokenVocabGrammar = InstanceType<typeof TraceATN.IgnoreTokenVocabGrammar>;
}
