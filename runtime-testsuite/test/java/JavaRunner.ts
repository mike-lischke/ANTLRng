/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java, type int, JavaObject, S } from "jree";
import { ParserRuleContext, Parser, Lexer, DiagnosticErrorListener, CommonTokenStream, ParserATNSimulator, ProfilingATNSimulator, ParseTree, ParseTreeWalker } from "antlr4ng";
import { StreamReader } from "../StreamReader.js";
import { RuntimeTestUtils } from "../RuntimeTestUtils.js";
import { RuntimeRunner } from "../RuntimeRunner.js";
import { RunOptions } from "../RunOptions.js";
import { GeneratedFile } from "../GeneratedFile.js";
import { FileUtils } from "../FileUtils.js";
import { CustomStreamErrorListener } from "./helpers/CustomStreamErrorListener.js";
import { RuntimeTestLexer } from "./helpers/RuntimeTestLexer.js";
import { RuntimeTestParser } from "./helpers/RuntimeTestParser.js";
import { TreeShapeListener } from "./helpers/TreeShapeListener.js";
import { JavaExecutedState } from "../states/JavaExecutedState.js";
import { JavaCompiledState } from "../states/JavaCompiledState.js";
import { GeneratedState } from "../states/GeneratedState.js";
import { ExecutedState } from "../states/ExecutedState.js";
import { CompiledState } from "../states/CompiledState.js";

type String = java.lang.String;
const String = java.lang.String;
type System = java.lang.System;
const System = java.lang.System;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;
type Path = java.nio.file.Path;
type List<E> = java.util.List<E>;
type ClassLoader = java.lang.ClassLoader;
const ClassLoader = java.lang.ClassLoader;
type Class<T> = java.lang.Class<T>;
const Class = java.lang.Class;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
type Iterable<T> = java.lang.Iterable<T>;
type Arrays = java.util.Arrays;
const Arrays = java.util.Arrays;
type URLClassLoader = java.net.URLClassLoader;
const URLClassLoader = java.net.URLClassLoader;
type Method = java.lang.reflect.Method;
const Method = java.lang.reflect.Method;
type NoSuchMethodException = java.lang.NoSuchMethodException;
const NoSuchMethodException = java.lang.NoSuchMethodException;

import { Test, Override } from "../../decorators.js";


export class JavaRunner extends RuntimeRunner {

    public static readonly classPath = System.getProperty("java.class.path");

    public static readonly runtimeTestLexerName = "org.antlr.v4.test.runtime.java.helpers.RuntimeTestLexer";
    public static readonly runtimeTestParserName = "org.antlr.v4.test.runtime.java.helpers.RuntimeTestParser";

    public static readonly runtimeHelpersPath = Paths.get(RuntimeTestUtils.runtimeTestsuitePath.toString(),
        "test", "org", "antlr", "v4", "test", "runtime", "java", "helpers").toString();

    public static InMemoryStreamHelper = class InMemoryStreamHelper extends JavaObject {
        private readonly pipedOutputStream: java.io.PipedOutputStream;
        private readonly streamReader: StreamReader;

        private constructor(pipedOutputStream: java.io.PipedOutputStream, streamReader: StreamReader) {
            super();
            this.pipedOutputStream = pipedOutputStream;
            this.streamReader = streamReader;
        }

        public static initialize(): InMemoryStreamHelper {
            let pipedInputStream = new java.io.PipedInputStream();
            let pipedOutputStream = new java.io.PipedOutputStream(pipedInputStream);
            let stdoutReader = new StreamReader(pipedInputStream);
            stdoutReader.start();
            return new InMemoryStreamHelper(pipedOutputStream, stdoutReader);
        }

        public override  close(): String {
            this.pipedOutputStream.close();
            this.streamReader.join();
            return this.streamReader.toString();
        }
    };


    private static compiler: JavaCompiler;

    private static readonly DiagnosticErrorListenerInstance = new DiagnosticErrorListener();

    public constructor();

    public constructor(tempDir: Path, saveTestDir: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                super();


                break;
            }

            case 2: {
                const [tempDir, saveTestDir] = args as [Path, boolean];


                super(tempDir, saveTestDir);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    @Override
    public override  getLanguage(): String {
        return "Java";
    }

    @Override
    protected override  initRuntime(runOptions: RunOptions): void {
        JavaRunner.compiler = java.util.spi.ToolProvider.getSystemJavaCompiler();
    }

    @Override
    protected override  getCompilerName(): String {
        return "javac";
    }

    @Override
    protected override  writeInputFile(runOptions: RunOptions): void { }

    @Override
    protected override  writeRecognizerFile(runOptions: RunOptions): void { }

    @Override
    protected override  compile(runOptions: RunOptions, generatedState: GeneratedState): JavaCompiledState {
        let tempTestDir = this.getTempDirPath();

        let generatedFiles = generatedState.generatedFiles;
        let firstFile = generatedFiles.get(0);

        if (!firstFile.isParser) {
            try {
                // superClass for combined grammar generates the same extends base class for Lexer and Parser
                // So, for lexer it should be replaced on correct base lexer class
                FileUtils.replaceInFile(Paths.get(this.getTempDirPath(), firstFile.name),
                    "extends " + JavaRunner.runtimeTestParserName + " {",
                    "extends " + JavaRunner.runtimeTestLexerName + " {");
            } catch (e) {
                if (e instanceof java.io.IOException) {
                    return new JavaCompiledState(generatedState, null, null, null, e);
                } else {
                    throw e;
                }
            }
        }

        let loader = null;
        let lexer = null;
        let parser = null;
        let exception = null;

        try {
            let fileManager = JavaRunner.compiler.getStandardFileManager(null, null, null);

            let systemClassLoader = ClassLoader.getSystemClassLoader();

            let files = new ArrayList();
            if (runOptions.lexerName !== null) {
                files.add(new java.io.File(tempTestDir, runOptions.lexerName + ".java"));
            }
            if (runOptions.parserName !== null) {
                files.add(new java.io.File(tempTestDir, runOptions.parserName + ".java"));
            }

            let compilationUnits = fileManager.getJavaFileObjectsFromFiles(files);

            let compileOptions =
                Arrays.asList("-g", "-source", "1.8", "-target", "1.8", "-implicit:class", "-Xlint:-options", "-d",
                    tempTestDir, "-cp", tempTestDir + RuntimeTestUtils.PathSeparator + JavaRunner.runtimeHelpersPath + RuntimeTestUtils.PathSeparator + JavaRunner.classPath);

            let task =
                JavaRunner.compiler.getTask(null, fileManager, null, compileOptions, null,
                    compilationUnits);
            task.call();

            loader = new URLClassLoader([new java.io.File(tempTestDir).toURI().toURL()], systemClassLoader);
            if (runOptions.lexerName !== null) {
                lexer = loader.loadClass(runOptions.lexerName).asSubclass(Lexer.class);
            }
            if (runOptions.parserName !== null) {
                parser = loader.loadClass(runOptions.parserName).asSubclass(Parser.class);
            }
        } catch (ex) {
            if (ex instanceof Exception) {
                exception = ex;
            } else {
                throw ex;
            }
        }

        return new JavaCompiledState(generatedState, loader, lexer, parser, exception);
    }

    @Override
    protected override  execute(runOptions: RunOptions, compiledState: CompiledState): ExecutedState {
        let javaCompiledState = compiledState as JavaCompiledState;
        let output = null;
        let errors = null;
        let parseTree = null;
        let exception = null;

        try {
            let outputStreamHelper = JavaRunner.InMemoryStreamHelper.initialize();
            let errorsStreamHelper = JavaRunner.InMemoryStreamHelper.initialize();

            let outStream = new java.io.PrintStream(outputStreamHelper.pipedOutputStream);
            let errorListener = new CustomStreamErrorListener(new java.io.PrintStream(errorsStreamHelper.pipedOutputStream));

            let tokenStream: CommonTokenStream;
            let lexer: RuntimeTestLexer;
            if (runOptions.lexerName !== null) {
                lexer = javaCompiledState.initializeLexer(runOptions.input) as RuntimeTestLexer;
                lexer.setOutStream(outStream);
                lexer.removeErrorListeners();
                lexer.addErrorListener(errorListener);
                tokenStream = new CommonTokenStream(lexer);
            } else {
                lexer = null;
                tokenStream = null;
            }

            if (runOptions.parserName !== null) {
                let parser = javaCompiledState.initializeParser(tokenStream) as RuntimeTestParser;
                parser.setOutStream(outStream);
                parser.removeErrorListeners();
                parser.addErrorListener(errorListener);

                if (runOptions.showDiagnosticErrors) {
                    parser.addErrorListener(JavaRunner.DiagnosticErrorListenerInstance);
                }

                if (runOptions.traceATN) {
                    // Setting trace_atn_sim isn't thread-safe,
                    // But it's used only in helper TraceATN that is not integrated into tests infrastructure
                    ParserATNSimulator.trace_atn_sim = true;
                }

                let profiler = null;
                if (runOptions.profile) {
                    profiler = new ProfilingATNSimulator(parser);
                    parser.setInterpreter(profiler);
                }
                parser.getInterpreter().setPredictionMode(runOptions.predictionMode);
                parser.setBuildParseTree(runOptions.buildParseTree);

                let startRule: Method;
                let args = null;
                try {
                    startRule = javaCompiledState.parser.getMethod(runOptions.startRuleName);
                } catch (noSuchMethodException) {
                    if (noSuchMethodException instanceof NoSuchMethodException) {
                        // try with int _p arg for recursive func
                        startRule = javaCompiledState.parser.getMethod(runOptions.startRuleName, int.class);
                        args = [0];
                    } else {
                        throw noSuchMethodException;
                    }
                }

                parseTree = startRule.invoke(parser, args) as ParserRuleContext;

                if (runOptions.profile) {
                    outStream.println(Arrays.toString(profiler.getDecisionInfo()));
                }

                ParseTreeWalker.DEFAULT.walk(TreeShapeListener.INSTANCE, parseTree);
            }
            else {
                /* assert tokenStream != null; */
                tokenStream.fill();
                for (let t of tokenStream.getTokens()) {
                    outStream.println(t);
                }
                if (runOptions.showDFA) {
                    outStream.print(lexer.getInterpreter().getDFA(Lexer.DEFAULT_MODE).toLexerString());
                }
            }

            output = outputStreamHelper.close();
            errors = errorsStreamHelper.close();
        } catch (ex) {
            if (ex instanceof Exception) {
                exception = ex;
            } else {
                throw ex;
            }
        }
        return new JavaExecutedState(javaCompiledState, output, errors, parseTree, exception);
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace JavaRunner {
    export type InMemoryStreamHelper = InstanceType<typeof JavaRunner.InMemoryStreamHelper>;
}
