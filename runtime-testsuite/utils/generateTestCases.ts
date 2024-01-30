/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";
import { ST, STGroup, STGroupFile, StringRenderer } from "stringtemplate4ts";

import { CustomDescriptors } from "../src/CustomDescriptors.js";
import { Generator } from "../src/Generator.js";
import { GrammarType } from "../src/GrammarType.js";
import { IRunOptions } from "../src/RunOptions.js";
import { IRuntimeTestDescriptor } from "../src/IRuntimeTestDescriptor.js";
import { RuntimeTestDescriptorParser } from "../src/RuntimeTestDescriptorParser.js";
import { Stage } from "../src/Stage.js";

/**
 * This file generates the test cases for the runtime testsuite. It uses the test descriptors files
 * and generates all files needed to run the tests, including the test spec file.
 */

const targetPath = "runtime-testsuite/generated";
const descriptorsPath = "runtime-testsuite/resources/descriptors";
const templatePath = "runtime-testsuite/resources/templates";
const helpersPath = "runtime-testsuite/resources/helpers";

const testDescriptors = new Map<string, IRuntimeTestDescriptor[]>();
const stringRenderer = new StringRenderer();

const consolidate = (text: string): string => {
    text = text.replace(/\\/g, "\\\\");
    text = text.split("\n").join("\\n");
    text = text.replace(/"/g, "\\\"");

    return text;
};

/**
 * Generates a test file for the given options.
 *
 * @param targetPath The path to the test file.
 * @param runOptions Details for the generation.
 */
const writeTestFile = (targetPath: string, runOptions: IRunOptions): void => {
    const text = readFileSync(join(helpersPath, "Test.ts.stg"), { encoding: "utf-8" });
    const outputFileST = new ST(text);
    outputFileST.add("grammarName", runOptions.grammarName);
    outputFileST.add("lexerName", runOptions.lexerName);
    outputFileST.add("parserName", runOptions.parserName);
    outputFileST.add("parserStartRuleName", runOptions.startRuleName ?? "");
    outputFileST.add("showDiagnosticErrors", runOptions.showDiagnosticErrors);
    outputFileST.add("traceATN", runOptions.traceATN);
    outputFileST.add("profile", runOptions.profile);
    outputFileST.add("showDFA", runOptions.showDFA);
    outputFileST.add("useListener", runOptions.useListener);
    outputFileST.add("useVisitor", runOptions.useVisitor);
    outputFileST.add("predictionMode", runOptions.predictionMode);
    outputFileST.add("buildParseTree", runOptions.buildParseTree);
    outputFileST.add("hideMainInvocation", true);
    writeFileSync(join(targetPath, "Test.ts"), outputFileST.render());
};

/**
 * Generates the parser/lexer/visitor/listener files for a grammar.
 *
 * @param targetPath The folder for this particular test.
 * @param runOptions Details for the generation.
 */
const generateParserFiles = (targetPath: string, runOptions: IRunOptions): void => {
    const options: string[] = [];
    if (runOptions.useVisitor) {
        options.push("-visitor");
    }

    if (runOptions.superClass) {
        options.push("-DsuperClass=" + runOptions.superClass);
    }

    const errorQueue = Generator.generateANTLRFilesInTempDir(targetPath, "TypeScript",
        runOptions.grammarFileName, runOptions.grammarStr, false, options);

    if (errorQueue.errors.length > 0) {
        errorQueue.errors.forEach((error) => {
            console.error(error);
        });

        return;
    }

    writeTestFile(targetPath, runOptions);
    writeFileSync(join(targetPath, "input"), runOptions.input);
};

console.log("Generating test cases...");
const start = performance.now();

// Start by loading all file-based descriptors.
readdirSync(descriptorsPath).forEach((entry) => {
    const stat = statSync(join(descriptorsPath, entry));
    if (stat.isDirectory()) {
        const groupName = entry;
        if (!groupName.startsWith(".")) { // Ignore hidden entries.
            const descriptors: IRuntimeTestDescriptor[] = [];

            const groupDir = join(descriptorsPath, groupName);
            readdirSync(groupDir).forEach((descriptorFile) => {
                if (!descriptorFile.startsWith(".")) {
                    const name = descriptorFile.replace(".txt", "");
                    const content = readFileSync(join(groupDir, descriptorFile), { encoding: "utf-8" });
                    descriptors.push(RuntimeTestDescriptorParser.parse(name, content, descriptorFile));
                }
            });

            testDescriptors.set(groupName, descriptors);
        }
    }
});

console.log("Test descriptors loaded.");

// Add custom descriptors.
for (const [key, descriptors] of CustomDescriptors.descriptors) {
    if (!testDescriptors.has(key)) {
        testDescriptors.set(key, descriptors);
    } else {
        testDescriptors.get(key)?.push(...descriptors);
    }
}

console.log("Custom test descriptors loaded.");

const includedGroups: string[] = [];
const includedTests: string[] = [];

console.log();

// Now iterate over all descriptors and generate the test files. Determine the total number of tests for the progress.
let totalTests = 0;
for (const [caption, descriptors] of testDescriptors) {
    if (includedGroups.length > 0 && !includedGroups.includes(caption)) {
        continue;
    }

    for (const descriptor of descriptors) {
        if (includedTests.length > 0 && !includedTests.includes(descriptor.name)) {
            continue;
        }

        ++totalTests;
    }
}
//*
let currentTest = 0;
for (const [caption, descriptors] of testDescriptors) {
    if (includedGroups.length > 0 && !includedGroups.includes(caption)) {
        continue;
    }

    const groupPath = join(targetPath, caption);
    mkdirSync(groupPath, { recursive: true });

    for (const descriptor of descriptors) {
        if (includedTests.length > 0 && !includedTests.includes(descriptor.name)) {
            continue;
        }

        ++currentTest;
        const message = `Processing (${Math.round(10000 * currentTest / totalTests) / 100}%): ` +
            `${caption} > ${descriptor.name}`;
        process.stdout.write(`\r${message.padEnd(120)}`);

        const testPath = join(groupPath, descriptor.name);
        mkdirSync(testPath, { recursive: true });

        const targetTemplates = new STGroupFile(join(templatePath, "TypeScript.test.stg"), "utf-8", "<", ">");
        targetTemplates.registerRenderer(String, stringRenderer);

        // Write out any slave grammars.
        const slaveGrammars = descriptor.slaveGrammars;
        if (slaveGrammars) {
            for (const pair of slaveGrammars) {
                const group = new STGroup("<", ">");
                group.registerRenderer(String, stringRenderer);
                group.importTemplates(targetTemplates);
                const grammarST = new ST(group, pair[1]);
                writeFileSync(join(testPath, pair[0] + ".g4"), grammarST.render(), { encoding: "utf-8" });
            }
        }

        const group = new STGroup("<", ">");
        group.importTemplates(targetTemplates);
        group.registerRenderer(String, stringRenderer);

        const grammarST = new ST(group, descriptor.grammar);
        const grammar = grammarST.render();

        let lexerName: string | undefined;
        let parserName: string | undefined;
        let useListenerOrVisitor: boolean;
        let superClass: string | undefined;
        if (descriptor.testType === GrammarType.Parser || descriptor.testType === GrammarType.CompositeParser) {
            lexerName = descriptor.grammarName + "Lexer";
            parserName = descriptor.grammarName + "Parser";
            useListenerOrVisitor = true;
        } else {
            lexerName = descriptor.grammarName;
            useListenerOrVisitor = false;
        }

        let grammarName;

        const isCombinedGrammar = lexerName && parserName;
        if (isCombinedGrammar) {
            if (parserName) {
                grammarName = parserName.endsWith("Parser")
                    ? parserName.substring(0, parserName.length - "Parser".length)
                    : parserName;
            } else {
                if (lexerName) {
                    grammarName = lexerName.endsWith("Lexer")
                        ? lexerName.substring(0, lexerName.length - "Lexer".length)
                        : lexerName;
                }
            }
        } else {
            if (parserName !== null) {
                grammarName = parserName;
            } else {
                grammarName = lexerName;
            }
        }

        const runOptions: IRunOptions = {
            grammarFileName: descriptor.grammarName + ".g4",
            grammarStr: grammar,
            grammarName,
            parserName,
            lexerName,
            useListener: useListenerOrVisitor,
            useVisitor: useListenerOrVisitor,
            startRuleName: descriptor.startRule,
            input: descriptor.input,
            profile: false,
            showDiagnosticErrors: descriptor.showDiagnosticErrors,
            traceATN: descriptor.traceATN,
            showDFA: descriptor.showDFA,
            endStage: Stage.Execute,
            superClass,
            predictionMode: descriptor.predictionMode,
            buildParseTree: descriptor.buildParseTree,
        };

        generateParserFiles(testPath, runOptions);
    };
}
// */

//*
// Generate the spec files containing for each descriptor.
for (const [caption, descriptors] of testDescriptors) {
    if (includedGroups.length > 0 && !includedGroups.includes(caption)) {
        continue;
    }

    const groupPath = caption;
    const groupDescribes: string[] = [];
    for (const descriptor of descriptors) {
        if (includedTests.length > 0 && !includedTests.includes(descriptor.name)) {
            continue;
        }

        const testFile = join(groupPath, descriptor.name, "Test.js");
        const inputFile = join(targetPath, groupPath, descriptor.name, "input");

        const output = consolidate(descriptor.output);
        const errors = consolidate(descriptor.errors);

        const command = descriptor.skipTargets?.has("TypeScript") ? "xit" : "it";
        const testDescribe = `${command}("${descriptor.name}", async () => {\n` +
            `${descriptor.notes.replace(/^/gm, "    // ")}\n` +
            `    const expectedOutput = "${output}";\n` +
            `    const expectedErrors = "${errors}";\n\n` +
            `    const Test = await import("./${testFile}");\n\n` +
            `    const params = ["", "", "${inputFile}"];\n` +
            `    const [output, errors] = runTestAndCaptureOutput(Test.main, params);\n\n` +
            `    expect(output).toEqual(expectedOutput);\n` +
            `    expect(errors).toEqual(expectedErrors);\n` +
            `});\n`;

        groupDescribes.push(testDescribe);
    }

    if (groupDescribes.length > 0) {
        const combined = groupDescribes.join("\n").replace(/^/gm, "    ");
        const content = `// Generated by generateTestCases.ts. Do not edit.\n\n` +
            `import { runTestAndCaptureOutput } from "../utils/test-helpers.js";\n\n` +
            `describe("${caption}", () => {\n${combined}\n});`;
        writeFileSync(join(targetPath, caption + ".spec.ts"), content, { encoding: "utf-8" });
    }
}

//*/

// Finally write a local tsconfig.json file that disables certain checks.
const tsconfig = `{
    "extends": "../tsconfig.json",
    "compilerOptions": {
        "strictNullChecks": false,
        "noImplicitAny": false,
        "noImplicitOverride": false,
        "strictPropertyInitialization": false,
    }
}`;
writeFileSync(join(targetPath, "tsconfig.json"), tsconfig, { encoding: "utf-8" });

console.log(`\nDone (${Math.round(performance.now() - start) / 1000}s).`);
