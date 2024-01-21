/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { TestTokenStreamRewriter } from "./src/tests/api/TestTokenStreamRewriter.js";
import { TestNG } from "./utils/TestNG.js";

describe("Direct API Tests", () => {
    describe("TokenStreamRewriter", () => {
        const testNG = new TestNG();
        testNG.run(TestTokenStreamRewriter);
    });
});
