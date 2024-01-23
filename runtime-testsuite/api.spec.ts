/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { TestCodePointCharStream } from "./src/api/TestCodePointCharStream.js";
import { TestInterpreterDataReader } from "./src/api/TestInterpreterDataReader.js";
import { TestTokenStream } from "./src/api/TestTokenStream.js";
import { TestTokenStreamRewriter } from "./src/api/TestTokenStreamRewriter.js";
import { TestVisitors } from "./src/api/TestVisitors.js";
import { TestNG } from "./utils/TestNG.js";

describe("TokenStreamRewriter", () => {
    const testNG = new TestNG();
    testNG.run(TestTokenStreamRewriter);
});

describe("TestTokenStream", () => {
    const testNG = new TestNG();
    testNG.run(TestTokenStream);
});

describe("TestVisitors", () => {
    const testNG = new TestNG();
    testNG.run(TestVisitors);
});

describe("TestCodePointCharStream", () => {
    const testNG = new TestNG();
    testNG.run(TestCodePointCharStream);
});

describe("TestInterpreterDataReader", () => {
    const testNG = new TestNG();
    testNG.run(TestInterpreterDataReader);
});
