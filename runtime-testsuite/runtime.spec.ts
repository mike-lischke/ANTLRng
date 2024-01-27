/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { RuntimeTests } from "./src/RuntimeTests.js";
import { TestNG } from "./utils/TestNG.js";

describe("RuntimeTests", () => {
    const testNG = new TestNG();
    testNG.run(RuntimeTests);
});
