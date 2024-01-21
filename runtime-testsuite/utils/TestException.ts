/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
 * Exception thrown when an exception happens while running a test method.
 *
 * This is an implementation of the org.testng.TestException class.
 */
export class TestException extends Error {
    public constructor(exception: Error) {
        super(undefined, { cause: exception });
    }
}
