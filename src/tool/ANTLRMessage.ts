/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";
import { ST } from "stringtemplate4ts";

import { ErrorType } from "./ErrorType.js";

export class ANTLRMessage {
    private static readonly EMPTY_ARGS = [];

    // used for location template
    public fileName: string;
    public line = -1;
    public charPosition = -1;

    /**
     * Most of the time, we'll have a token such as an undefined rule ref
     *  and so this will be set.
     */
    public readonly offendingToken: Token | null;

    private readonly errorType: ErrorType;

    private readonly args: unknown[] | null = null;

    private readonly e: Error | null = null;

    public constructor(errorType: ErrorType, offendingToken?: Token | null, ...args: unknown[]);
    public constructor(errorType: ErrorType, e: Error, offendingToken: Token, ...args: unknown[]);
    public constructor(...args: unknown[]) {
        this.errorType = args.shift() as ErrorType;
        if (args.length > 0) {
            if (args[0] instanceof Error) {
                this.e = args.shift() as Error;
            } else {
                this.offendingToken = args.shift() as Token;
            }

            if (args.length > 0) {
                this.args = args;
            }
        }
    }

    public getErrorType(): ErrorType {
        return this.errorType;
    }

    public getArgs(): unknown[] {
        if (this.args === null) {
            return ANTLRMessage.EMPTY_ARGS;
        }

        return this.args;
    }

    public getMessageTemplate(verbose: boolean): ST {
        const messageST = new ST(this.getErrorType().msg);
        messageST.impl!.name = this.errorType.name;

        messageST.add("verbose", verbose);
        const args = this.getArgs();
        for (let i = 0; i < args.length; i++) {
            let attr = "arg";
            if (i > 0) {
                attr += String(i + 1);
            }

            messageST.add(attr, args[i]);
        }
        if (args.length < 2) {
            messageST.add("arg2", null);
        }
        // some messages ref arg2

        const cause = this.getCause();
        if (cause !== null) {
            messageST.add("exception", cause);
            messageST.add("stackTrace", cause.stack);
        } else {
            messageST.add("exception", null); // avoid ST error msg
            messageST.add("stackTrace", null);
        }

        return messageST;
    }

    public getCause(): Error | null {
        return this.e;
    }

    public toString(): string {
        return "Message{" +
            "errorType=" + this.getErrorType().name +
            ", args=" + String(this.getArgs()) +
            ", e=" + String(this.getCause()) +
            ", fileName='" + this.fileName + "'" +
            ", line=" + String(this.line) +
            ", charPosition=" + String(this.charPosition) +
            "}";
    }
}
