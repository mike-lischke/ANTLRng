/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

import { STGroup } from "stringtemplate4ts";

import { RuntimeTestUtils } from "./RuntimeTestUtils.js";
import { RuntimeTestDescriptorParser } from "./RuntimeTestDescriptorParser.js";
import { RuntimeTestDescriptor } from "./RuntimeTestDescriptor.js";
import { RuntimeRunner } from "./RuntimeRunner.js";
import { FileUtils } from "./FileUtils.js";
import { CustomDescriptors } from "./CustomDescriptors.js";
import { AfterAll, BeforeAll, TestFactory } from "../utils/decorators.js";
import { TestFunctionGroup, TestFunctionList } from "../utils/TestNG.js";

/**
 * This class represents runtime tests for specified runtime.
 *  It pulls data from {@link RuntimeTestDescriptor} and uses junit to trigger tests.
 *  The only functionality needed to execute a test is defined in {@link RuntimeRunner}.
 *  All the various test rig classes derived from this one.
 */
export class RuntimeTests {
    public static readonly cachedTargetTemplates = new Map<string, STGroup>();

    private static readonly testDescriptors = new Map<string, RuntimeTestDescriptor[]>();

    static #tempTestDir = "";
    static #keepTestDir = false;
    static #currentDir = "";

    @BeforeAll
    public beforeAll(): void {
        RuntimeTests.#currentDir = process.cwd();

        // We use one single temp directory for all tests.
        FileUtils.mkdir(RuntimeTests.#tempTestDir);

        // Copy the package.json and tsconfig.json files to the temp directory.
        let source = path.join(RuntimeTestUtils.resourcePath, "helpers", "package.txt");
        FileUtils.copyFileOrFolder(source, path.join(RuntimeTests.#tempTestDir, "package.json"));

        source = path.join(RuntimeTestUtils.resourcePath, "helpers", "tsconfig.txt");
        FileUtils.copyFileOrFolder(source, path.join(RuntimeTests.#tempTestDir, "tsconfig.json"));

        // Install the dependencies. This may throw an error if the installation fails, which stops the tests.
        execSync("npm run install-deps", { encoding: "utf-8", cwd: RuntimeTests.#tempTestDir });

        //process.chdir(RuntimeTests.#tempTestDir);
    }

    @AfterAll
    public afterAll(): void {
        //process.chdir(RuntimeTests.#currentDir);

        if (!RuntimeTests.#keepTestDir) {
            FileUtils.deleteDirectory(RuntimeTests.#tempTestDir);
        }
    }

    @TestFactory
    public runtimeTests(): TestFunctionGroup {
        const result: TestFunctionGroup = [];

        const includedGroups: string[] = [];
        const includedTests: string[] = [];

        for (const [caption, descriptors] of RuntimeTests.testDescriptors) {
            if (includedGroups.length > 0 && !includedGroups.includes(caption)) {
                continue;
            }

            const list: TestFunctionList = [];
            const groupPath = path.join(RuntimeTests.#tempTestDir, caption);
            for (const descriptor of descriptors) {
                if (includedTests.length > 0 && !includedTests.includes(descriptor.name)) {
                    continue;
                }

                list.push([descriptor.name, () => {
                    const runner = new RuntimeRunner(groupPath, descriptor.name);
                    //runner.keepTargetDir = true;

                    try {
                        runner.test(descriptor);
                        if (runner.keepTargetDir) {
                            RuntimeTests.#keepTestDir = true;
                        }
                    } catch (error) {
                        RuntimeTests.#keepTestDir = true;
                        throw error;
                    }

                }]);
            }

            result.push([caption, list]);
        }

        return result;
    }

    static {
        const descriptorsDir = path.join(RuntimeTestUtils.resourcePath, "descriptors");
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

    static {
        const dirName = "antlrng-runtime-tests-" + new Date().getTime();
        RuntimeTests.#tempTestDir = path.join(RuntimeTestUtils.TempDirectory, dirName);
    }
}
