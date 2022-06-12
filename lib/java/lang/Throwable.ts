/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { NotImplementedError } from "../../NotImplementedError";

export class Throwable extends Error { // This is the JS Error object, not that of the Java polyfills!

    public constructor(message?: string, cause?: Throwable);
    public constructor(message: string, cause: Throwable, enableSuppression: boolean, writableStackTrace: boolean)
    public constructor(cause: Throwable);
    public constructor(messageOrCause?: string | Throwable, cause?: Throwable, _enableSuppression?: boolean,
        _writableStackTrace?: boolean) {
        if (!messageOrCause) {
            super();
        } else if (typeof messageOrCause === "string") {
            super(messageOrCause, { cause });
        } else {
            super("", { cause: messageOrCause });
        }
    }

    // Appends the specified exception to the exceptions that were suppressed in order to deliver this exception.
    public addSuppressed(_exception: Throwable): void {
        throw new NotImplementedError();
    }

    // Fills in the execution stack trace.
    public fillInStackTrace(): Throwable {
        throw new NotImplementedError();
    }

    // Returns the cause of this throwable or null if the cause is nonexistent or unknown.
    public getCause(): Throwable {
        return this.cause as Throwable;
    }

    // Creates a localized description of this throwable.
    public getLocalizedMessage(): string | undefined {
        return this.message;
    }

    // Returns the detail message string of this throwable.
    public getMessage(): string | undefined {
        return this.message;
    }

    // Provides programmatic access to the stack trace information printed by printStackTrace().
    public getStackTrace(): unknown[] {
        throw new NotImplementedError();
    }

    // Returns an array containing all of the exceptions that were suppressed, typically by the try-with-resources
    // statement, in order to deliver this exception.
    public getSuppressed(): Throwable[] {
        throw new NotImplementedError();
    }

    // Initializes the cause of this throwable to the specified value.
    public initCause(_cause: Throwable): Throwable {
        throw new NotImplementedError();
    }

    // Prints this throwable and its backtrace to the standard error stream.
    public printStackTrace(_s?: unknown): void {
        console.log(this.stack);
    }

    // Sets the stack trace elements that will be returned by getStackTrace() and printed by printStackTrace() and
    // related methods.
    public setStackTrace(_stackTrace: unknown[]): void {
        throw new NotImplementedError();
    }

    // Returns a short description of this throwable.
    public toString(): string {
        const message = this.getLocalizedMessage();
        if (!message) {
            return this.name;
        }

        return this.name + ":" + message;
    }
}
