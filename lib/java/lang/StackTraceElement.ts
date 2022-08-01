/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { final } from "../../Decorators";

@final
export class StackTraceElement {
    private declaringClass?: string;
    private methodName?: string;
    private fileName?: string;
    private lineNumber?: number;

    // Just for completeness. We don't get native stack traces here.
    private isNative?: boolean;

    /**
     * Creates a stack trace element representing the specified execution point.
     *
     * @param line The stack trace line to parse.
     */
    public constructor(line: string) {
        if (line.match(/^\s*[-]{4,}$/)) {
            return;
        }

        const lineMatch = line.match(/at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/);
        if (!lineMatch) {
            return;
        }

        this.isNative = (lineMatch[5] === "native");
        let method;
        if (lineMatch[1]) {
            this.methodName = lineMatch[1];
            let methodStart = this.methodName.lastIndexOf(".");
            if (this.methodName[methodStart - 1] === ".") {
                --methodStart;
            }

            if (methodStart > 0) {
                this.declaringClass = this.methodName.substring(0, methodStart);
                method = this.methodName.substring(methodStart + 1);
                const objectEnd = this.declaringClass.indexOf(".Module");
                if (objectEnd > 0) {
                    this.methodName = this.methodName.substring(objectEnd + 1);
                    this.declaringClass = this.declaringClass.substring(0, objectEnd);
                }
            }
        }

        if (method === "<anonymous>") {
            this.methodName = undefined;
        }

    }

    public getFileName(): string {
        return this.fileName ?? "";
    }

    public getLineNumber(): number {
        return this.lineNumber ?? 0;
    }
}
