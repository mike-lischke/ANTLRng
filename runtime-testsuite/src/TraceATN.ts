/* java2ts: keep */

// cspell: disable

import fs from "fs";

import { Stage } from "./Stage.js";
import { RuntimeTestDescriptor } from "./RuntimeTestDescriptor.js";
import { RuntimeRunner } from "./RuntimeRunner.js";
import { RunOptions } from "./RunOptions.js";
import { GrammarType } from "./GrammarType.js";
import { FileUtils } from "./FileUtils.js";
import { ExecutedState } from "./states/ExecutedState.js";

/**
 * Run a lexer/parser and dump ATN debug/trace information
 *
 *  TraceATN [X.g4|XParser.g4 XLexer.g4] startRuleName -target [Java|Cpp|...] inputFileName
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
 * export TESTJAR=/Users/parrt/.m2/repository/org/antlr/antlr4-runtime-testsuite/4.11.2-SNAPSHOT/\
 *      antlr4-runtime-testsuite-4.11.2-SNAPSHOT-tests.jar
 * java -classpath $ANTLRJAR:$TESTJAR org.antlr.v4.test.runtime.TraceATN $@
 */
export class TraceATN {
    protected grammarFileName: string | null = null;
    protected parserGrammarFileName: string | null = null;
    protected lexerGrammarFileName: string | null = null;
    protected startRuleName: string | null = null;
    protected inputFileName: string | null = null;
    protected targetName = "Java";
    protected encoding: string | null = null;

    public constructor(args: string[]) {
        if (args.length < 2) {
            console.error("TraceATN [X.g4|XParser.g4 XLexer.g4] startRuleName\n" +
                "    [-encoding encodingName] -target (Java|Cpp|...) input-filename");
            console.error("Omitting input-filename makes program read from stdin.");

            throw new Error("Invalid arguments");
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
            } else {
                if (arg === "-encoding") {
                    if (i >= args.length) {
                        throw new Error("missing encoding on -encoding");
                    }

                    this.encoding = args[i];
                    i++;
                } else {
                    if (arg === "-target") {
                        if (i >= args.length) {
                            throw new Error("missing name on -target");
                        }

                        this.targetName = args[i];
                        i++;
                    }
                }
            }
        }
    }

    public static async getRunner(targetName: string): Promise<RuntimeRunner> {
        const module = await import("runtime-testsuite/test/" + targetName.toLowerCase() + "/" + targetName +
            "Runner") as { [K in typeof targetName]: typeof RuntimeRunner };
        const TargetNameRunner = module[targetName + "Runner"];

        return Reflect.construct(TargetNameRunner, []) as RuntimeRunner;
    }

    public static async main(args: string[]): Promise<void> {
        const instance = new TraceATN(args);
        await instance.execParse();
    }

    public test(descriptor: RuntimeTestDescriptor, runner: RuntimeRunner, targetName: string): string {
        FileUtils.mkdir(runner.targetPath);

        const grammarName = descriptor.grammarName;
        const grammar = descriptor.grammar;

        let lexerName: string;
        let parserName: string | null;
        let useListenerOrVisitor: boolean;
        let superClass: string | null;
        if (descriptor.testType === GrammarType.Parser || descriptor.testType === GrammarType.CompositeParser) {
            lexerName = grammarName + "Lexer";
            parserName = grammarName + "Parser";
            useListenerOrVisitor = true;
            superClass = null;
        } else {
            lexerName = grammarName;
            parserName = null;
            useListenerOrVisitor = false;
            superClass = null;
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
            "LL",
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
        } else {
            return result.getErrorMessage();
        }
    }

    protected async execParse(): Promise<void> {
        if (this.grammarFileName === null && (this.parserGrammarFileName === null
            && this.lexerGrammarFileName === null)) {
            throw new Error("No grammar specified");
        }

        if (this.inputFileName === null) {
            throw new Error("No input file specified");
        }

        let grammarName = this.grammarFileName!.substring(this.grammarFileName!.lastIndexOf("/") + 1,
            this.grammarFileName!.length);
        grammarName = grammarName.substring(0, grammarName.indexOf(".g4"));
        if (this.grammarFileName !== null) {
            const grammar = fs.readFileSync(this.grammarFileName, { encoding: "utf-8" });
            const input = fs.readFileSync(this.inputFileName, { encoding: "utf-8" });

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
                "LL",
                true,
                null,
                null);

            const runner = await TraceATN.getRunner(this.targetName);

            const result = this.test(descriptor, runner, this.targetName);
            console.log(result);
        }
    }
}
