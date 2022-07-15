/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NotImplementedError } from "../../NotImplementedError";
import { StackTraceElement } from "./StackTraceElement";

export class Throwable extends Error { // This is the JS Error object, not that of the Java polyfills!
    private elements: StackTraceElement[] = [];

    public constructor(message?: string, cause?: Throwable);
    // This constructor is protected in Java, but in TS we cannot mix different modifiers in overloading.
    public constructor(message: string, cause: Throwable, enableSuppression: boolean, writableStackTrace: boolean);
    public constructor(cause: Throwable);
    public constructor(messageOrCause?: string | Throwable, cause?: Throwable, _enableSuppression?: boolean,
        private writableStackTrace?: boolean) {

        let message;
        let options: ErrorOptions;

        if (typeof messageOrCause === "string") {
            message = messageOrCause;
            options = { cause };
        } else {
            message = "";
            options = { cause: messageOrCause };
        }

        super(message, options);
    }

    /**
     * Creates a throwable wrapper around a JS error, while keeping the cause-chain intact.
     *
     * @param error A JS error.
     *
     * @returns A Throwable instance which wraps the given error.
     */
    public static fromError(error: unknown): Throwable {
        if (error instanceof Error) {
            let cause;
            if (error.cause) {
                cause = Throwable.fromError(error.cause);
                cause.parseStackTrace(error);
            }

            return new Throwable(error.message, cause);
        }

        return new Throwable(String(error));
    }

    /**
     * Appends the specified exception to the exceptions that were suppressed in order to deliver this exception.
     *
     * @param exception tbd
     */
    public addSuppressed(exception: Throwable): void {
        throw new NotImplementedError();
    }

    /** Fills in the execution stack trace. */
    public fillInStackTrace(): Throwable {
        throw new NotImplementedError();
    }

    /** Returns the cause of this throwable or null if the cause is nonexistent or unknown. */
    public getCause(): Throwable {
        return this.cause as Throwable;
    }

    /** Creates a localized description of this throwable. */
    public getLocalizedMessage(): string | undefined {
        return this.message;
    }

    /** Returns the detail message string of this throwable. */
    public getMessage(): string | undefined {
        return this.message;
    }

    /** Provides programmatic access to the stack trace information printed by printStackTrace(). */
    public getStackTrace(): StackTraceElement[] {
        return this.elements;
    }

    /** Returns an array containing all of the exceptions that were suppressed, typically by the try-with-resources */
    /** statement, in order to deliver this exception. */
    public getSuppressed(): Throwable[] {
        throw new NotImplementedError();
    }

    /**
     * Initializes the cause of this throwable to the specified value.
     *
     * @param cause tbd
     */
    public initCause(cause: Throwable): Throwable {
        throw new NotImplementedError();
    }

    /**
     * Prints this throwable and its backtrace to the standard error stream.
     *
     * @param s tbd
     */
    public printStackTrace(s?: unknown): void {
        console.log(this.stack);
    }

    /**
     * Sets the stack trace elements that will be returned by getStackTrace() and printed by printStackTrace() and
     * related methods.
     *
     * @param stackTrace tbd
     */
    public setStackTrace(stackTrace: StackTraceElement[]): void {
        this.elements = stackTrace;
    }

    /** Returns a short description of this throwable. */
    public toString(): string {
        const message = this.getLocalizedMessage();
        if (!message) {
            return this.name;
        }

        return this.name + ": " + message;
    }

    private parseStackTrace(error: Error): void {
        if (!error.stack) {
            this.elements = [];
        }

        const lines = error.stack.split("\n").slice(1);

        this.elements = lines.map((line) => {
            return new StackTraceElement(line);
        });
    }
}
