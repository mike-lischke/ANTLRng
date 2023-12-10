/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject, closeResources, handleResourceError, throwResourceError } from "jree";
import { TraceATN } from "./TraceATN";
import { Stage } from "./Stage";
import { RuntimeTestUtils } from "./RuntimeTestUtils";
import { RuntimeTestDescriptorParser } from "./RuntimeTestDescriptorParser";
import { RuntimeTestDescriptor } from "./RuntimeTestDescriptor";
import { RuntimeRunner } from "./RuntimeRunner";
import { RunOptions } from "./RunOptions";
import { GrammarType } from "./GrammarType";
import { FileUtils } from "./FileUtils";
import { CustomDescriptors } from "./CustomDescriptors";
import { Pair } from "antlr4ng";
import { JavaRunner } from "./java/JavaRunner";
import { ExecutedState } from "./states/ExecutedState";

type String = java.lang.String;
const String = java.lang.String;
type File = java.io.File;
const File = java.io.File;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;
type Files = java.nio.file.Files;
const Files = java.nio.file.Files;
type IOException = java.io.IOException;
const IOException = java.io.IOException;
type RuntimeException = java.lang.RuntimeException;
const RuntimeException = java.lang.RuntimeException;
type Stream<T> = java.util.stream.Stream<T>;
type Path = java.nio.file.Path;
type System = java.lang.System;
const System = java.lang.System;
type ClassLoader = java.lang.ClassLoader;
const ClassLoader = java.lang.ClassLoader;
type URL = java.net.URL;
const URL = java.net.URL;



/** This class represents runtime tests for specified runtime.
 *  It pulls data from {@link RuntimeTestDescriptor} and uses junit to trigger tests.
 *  The only functionality needed to execute a test is defined in {@link RuntimeRunner}.
 *  All the various test rig classes derived from this one.
 *  E.g., see {@link JavaRuntimeTests}.
 */
export abstract class RuntimeTests extends JavaObject {

    private static readonly testDescriptors = new java.util.HashMap();
    private static readonly cachedTargetTemplates = new java.util.HashMap();
    private static readonly rendered = new StringRenderer();

    public static assertCorrectOutput(descriptor: RuntimeTestDescriptor, targetName: String, state: java.lang.Thread.State): String {
        let executedState;
        if (state instanceof ExecutedState) {
            executedState = state as ExecutedState;
            if (executedState.exception !== null) {
                return state.getErrorMessage();
            }
        }
        else {
            return state.getErrorMessage();
        }

        let expectedOutput = descriptor.output;
        let expectedParseErrors = descriptor.errors;

        let doesOutputEqualToExpected = executedState.output.equals(expectedOutput);
        if (!doesOutputEqualToExpected || !executedState.errors.equals(expectedParseErrors)) {
            let message;
            if (doesOutputEqualToExpected) {
                message = "Parse output is as expected, but errors are not: ";
            }
            else {
                message = "Parse output is incorrect: " +
                    "expectedOutput:<" + expectedOutput + ">; actualOutput:<" + executedState.output + ">; ";
            }

            return "[" + targetName + ":" + descriptor.name + "] " +
                message +
                "expectedParseErrors:<" + expectedParseErrors + ">;" +
                "actualParseErrors:<" + executedState.errors + ">.";
        }

        return null;
    }

    private static test(descriptor: RuntimeTestDescriptor, runner: RuntimeRunner): String {
        let targetName = runner.getLanguage();
        if (descriptor.ignore(targetName)) {
            System.out.println("Ignore " + descriptor);
            return null;
        }

        FileUtils.mkdir(runner.getTempDirPath());

        let grammarName = descriptor.grammarName;
        let grammar = RuntimeTests.prepareGrammars(descriptor, runner);

        let lexerName;
        let parserName;
        let useListenerOrVisitor;
        let superClass;
        if (descriptor.testType === GrammarType.Parser || descriptor.testType === GrammarType.CompositeParser) {
            lexerName = grammarName + "Lexer";
            parserName = grammarName + "Parser";
            useListenerOrVisitor = true;
            if (targetName.equals("Java")) {
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

        let runOptions = new RunOptions(grammarName + ".g4",
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
            descriptor.predictionMode,
            descriptor.buildParseTree
        );

        let result = runner.run(runOptions);

        return RuntimeTests.assertCorrectOutput(descriptor, targetName, result);
    }

    private static prepareGrammars(descriptor: RuntimeTestDescriptor, runner: RuntimeRunner): String {
        let targetName = runner.getLanguage();

        let targetTemplates;
        /* synchronized (cachedTargetTemplates) { */
        targetTemplates = RuntimeTests.cachedTargetTemplates.get(targetName);
        if (targetTemplates === null) {
            let classLoader = RuntimeTests.class.getClassLoader();
            let templates = classLoader.getResource("org/antlr/v4/test/runtime/templates/" + targetName + ".test.stg");
            /* assert templates != null; */
            targetTemplates = new STGroupFile(templates, "UTF-8", '<', '>');
            targetTemplates.registerRenderer(String.class, RuntimeTests.rendered);
            RuntimeTests.cachedTargetTemplates.put(targetName, targetTemplates);
        }
        /* } */

        // write out any slave grammars
        let slaveGrammars = descriptor.slaveGrammars;
        if (slaveGrammars !== null) {
            for (let spair of slaveGrammars) {
                let g = new STGroup('<', '>');
                g.registerRenderer(String.class, RuntimeTests.rendered);
                g.importTemplates(targetTemplates);
                let grammarST = new ST(g, spair.b);
                FileUtils.writeFile(runner.getTempDirPath(), spair.a + ".g4", grammarST.render());
            }
        }

        let g = new STGroup('<', '>');
        g.importTemplates(targetTemplates);
        g.registerRenderer(String.class, RuntimeTests.rendered);
        let grammarST = new ST(g, descriptor.grammar);
        return grammarST.render();
    }

    @TestFactory
    @TestFactory

    @Execution(ExecutionMode.CONCURRENT)
    public runtimeTests(): java.util.List<DynamicNode> {
        let result = new java.util.ArrayList();

        for (let group of RuntimeTests.testDescriptors.keySet()) {
            let descriptorTests = new java.util.ArrayList();
            let descriptors = RuntimeTests.testDescriptors.get(group);
            for (let descriptor of descriptors) {
                descriptorTests.add(dynamicTest(descriptor.name, descriptor.uri, () => {
                    try {
                        // This holds the final error to throw (if any).
                        let error: java.lang.Throwable | undefined;

                        const runner: RuntimeRunner = this.createRuntimeRunner();
                        try {
                            try {
                                let errorMessage = RuntimeTests.test(descriptor, TraceATN.test.runner);
                                if (errorMessage !== null) {
                                    TraceATN.test.runner.setSaveTestDir(true);
                                    fail(RuntimeTestUtils.joinLines("Test: " + descriptor.name + "; " + errorMessage, "Test directory: " + TraceATN.test.runner.getTempDirPath()));
                                }
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

				}));
            }

            let descriptorGroupPath = Paths.get(RuntimeTestUtils.resourcePath.toString(), "descriptors", group);
            result.add(dynamicContainer(group, descriptorGroupPath.toUri(), java.util.Arrays.stream(descriptorTests.toArray(new Array<DynamicNode>(0)))));
        }

        return result;
    }
    protected abstract createRuntimeRunner(): RuntimeRunner;

    static {
        let descriptorsDir = new File(Paths.get(RuntimeTestUtils.resourcePath.toString(), "org/antlr/v4/test/runtime/descriptors").toString());
        let directoryListing = descriptorsDir.listFiles();
        /* assert directoryListing != null; */
        for (let directory of directoryListing) {
            let groupName = directory.getName();
            if (groupName.startsWith(".")) {
                continue; // Ignore service directories (like .DS_Store in Mac)
            }

            let descriptors = new java.util.ArrayList();

            let descriptorFiles = directory.listFiles();
            /* assert descriptorFiles != null; */
            for (let descriptorFile of descriptorFiles) {
                let name = descriptorFile.getName().replace(".txt", "");
                if (name.startsWith(".")) {
                    continue;
                }

                let text;
                try {
                    text = new String(Files.readAllBytes(descriptorFile.toPath()));
                } catch (e) {
                    if (e instanceof IOException) {
                        throw new RuntimeException(e);
                    } else {
                        throw e;
                    }
                }
                descriptors.add(RuntimeTestDescriptorParser.parse(name, text, descriptorFile.toURI()));
            }

            RuntimeTests.testDescriptors.put(groupName, descriptors.toArray(new Array<RuntimeTestDescriptor>(0)));
        }

        for (let key of CustomDescriptors.descriptors.keySet()) {
            let descriptors = CustomDescriptors.descriptors.get(key);
            let existedDescriptors = RuntimeTests.testDescriptors.putIfAbsent(key, descriptors);
            if (existedDescriptors !== null) {
                RuntimeTests.testDescriptors.put(key, Stream.concat(java.util.Arrays.stream(existedDescriptors), java.util.Arrays.stream(descriptors))
                    .toArray(RuntimeTestDescriptor[].new));
            }
        }
    }
}
