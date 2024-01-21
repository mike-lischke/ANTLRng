/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import fs from "fs";

import { ST, STGroup, STGroupFile, StringRenderer } from "stringtemplate4ts";

import { Stage } from "./Stage.js";
import { RuntimeTestUtils } from "./RuntimeTestUtils.js";
import { RuntimeTestDescriptorParser } from "./RuntimeTestDescriptorParser.js";
import { RuntimeTestDescriptor } from "./RuntimeTestDescriptor.js";
import { RuntimeRunner } from "./RuntimeRunner.js";
import { RunOptions } from "./RunOptions.js";
import { GrammarType } from "./GrammarType.js";
import { FileUtils } from "./FileUtils.js";
import { CustomDescriptors } from "./CustomDescriptors.js";
import { ExecutedState } from "./states/ExecutedState.js";
import { State } from "./states/State.js";
import { Test } from "../utils/decorators.js";
import path from "path";

/**
 * This class represents runtime tests for specified runtime.
 *  It pulls data from {@link RuntimeTestDescriptor} and uses junit to trigger tests.
 *  The only functionality needed to execute a test is defined in {@link RuntimeRunner}.
 *  All the various test rig classes derived from this one.
 */
export abstract class RuntimeTests {

    private static readonly testDescriptors = new Map<string, RuntimeTestDescriptor[]>();
    private static readonly cachedTargetTemplates = new Map<string, STGroup>();
    private static readonly rendered = new StringRenderer();

    public static assertCorrectOutput(descriptor: RuntimeTestDescriptor, targetName: string,
        state: State): string | null {
        let executedState: ExecutedState;
        if (state instanceof ExecutedState) {
            executedState = state;
            if (executedState.exception !== null) {
                return state.getErrorMessage();
            }
        } else {
            return state.getErrorMessage();
        }

        const expectedOutput = descriptor.output;
        const expectedParseErrors = descriptor.errors;

        const doesOutputEqualToExpected = executedState.output === expectedOutput;
        if (!doesOutputEqualToExpected || executedState.errors !== expectedParseErrors) {
            let message: String;
            if (doesOutputEqualToExpected) {
                message = "Parse output is as expected, but errors are not: ";
            } else {
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

    private static async test(descriptor: RuntimeTestDescriptor, runner: RuntimeRunner): Promise<string | null> {
        const targetName = runner.getLanguage();
        if (descriptor.ignore(targetName)) {
            console.log("Ignore " + descriptor);

            return null;
        }

        FileUtils.mkdir(runner.getTempDirPath());

        const grammarName = descriptor.grammarName;
        const grammar = RuntimeTests.prepareGrammars(descriptor, runner);

        let lexerName: string | null;
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
            descriptor.predictionMode,
            descriptor.buildParseTree,
        );

        const result = await runner.run(runOptions);

        return RuntimeTests.assertCorrectOutput(descriptor, targetName, result);
    }

    private static prepareGrammars(descriptor: RuntimeTestDescriptor, runner: RuntimeRunner): string {
        const targetName = runner.getLanguage();

        let targetTemplates = RuntimeTests.cachedTargetTemplates.get(targetName);
        if (!targetTemplates) {
            const templates = fs.readFileSync("runtime-testsuite/test/templates/" + targetName + ".test.stg",
                { encoding: "utf-8" });
            targetTemplates = new STGroupFile(templates, "UTF-8", "<", ">");
            targetTemplates.registerRenderer(String, RuntimeTests.rendered);
            RuntimeTests.cachedTargetTemplates.set(targetName, targetTemplates);
        }

        // write out any slave grammars
        const slaveGrammars = descriptor.slaveGrammars;
        if (slaveGrammars !== null) {
            for (const pair of slaveGrammars) {
                const g = new STGroup("<", ">");
                g.registerRenderer(String, RuntimeTests.rendered);
                g.importTemplates(targetTemplates);
                const grammarST = new ST(g, pair[1]);
                FileUtils.writeFile(runner.getTempDirPath(), pair[0] + ".g4", grammarST.render());
            }
        }

        const g = new STGroup("<", ">");
        g.importTemplates(targetTemplates);
        g.registerRenderer(String, RuntimeTests.rendered);
        const grammarST = new ST(g, descriptor.grammar);

        return grammarST.render();
    }

    @Test
    public runtimeTests(): void {
        for (const [, descriptors] of RuntimeTests.testDescriptors) {
            for (const descriptor of descriptors) {
                const runner = this.createRuntimeRunner();
                const errorMessage = RuntimeTests.test(descriptor, runner);
                if (errorMessage !== null) {
                    runner.setSaveTestDir(true);
                    fail(RuntimeTestUtils.joinLines("Test: " + descriptor.name + "; " + errorMessage,
                        "Test directory: " + runner.getTempDirPath()));
                }
            }

            // let descriptorGroupPath = path.join(RuntimeTestUtils.resourcePath, "descriptors", group);
        }
    }

    protected abstract createRuntimeRunner(): RuntimeRunner;

    static {
        const descriptorsDir = path.join(RuntimeTestUtils.resourcePath, "runtime-testsuite/test/descriptors");
        fs.readdirSync(descriptorsDir).forEach((entry) => {
            const stat = fs.statSync(path.join(descriptorsDir, entry));
            if (stat.isDirectory()) {
                const groupName = entry;
                if (!groupName.startsWith(".")) { // Ignore hidden entries.
                    const descriptors: RuntimeTestDescriptor[] = [];

                    fs.readdirSync(path.join(descriptorsDir, groupName)).forEach((descriptorFile) => {
                        if (!descriptorFile.startsWith(".")) {
                            const name = descriptorFile.replace(".txt", "");
                            const content = fs.readFileSync(path.join(descriptorsDir, groupName, descriptorFile),
                                { encoding: "utf-8" });
                            descriptors.push(RuntimeTestDescriptorParser.parse(name, content, descriptorFile));
                        }
                    });

                    RuntimeTests.testDescriptors.set(groupName, descriptors);
                }
            }
        });

        for (const [key, descriptors] of CustomDescriptors.descriptors) {
            if (!RuntimeTests.testDescriptors.has(key)) {
                RuntimeTests.testDescriptors.set(key, descriptors);
            } else {
                RuntimeTests.testDescriptors.get(key)!.push(...descriptors);
            }
        }
    }
}
