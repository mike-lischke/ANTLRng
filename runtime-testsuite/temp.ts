/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable max-classes-per-file */

import { ATN, RuleStartState, Vocabulary } from "antlr4ng";
import { ST } from "stringtemplate4ts";

/**
 * Skeleton implementations for classes from the ANTLR tool.
 * Because we want to make the runtime tests independent from the tool we need to provide separate/duplicate
 * implementations for some of the tool classes.
 */

export class Rule {
    public readonly index = 0;
}

export class ANTLRMessage {
    public toString(): string {
        return "";
    }

}

export class ToolMessage extends ANTLRMessage {
}

export interface ANTLRToolListener {
    info(msg: string): void;
    error(msg: ANTLRMessage): void;
    warning(msg: ANTLRMessage): void;
}

export class DefaultToolListener implements ANTLRToolListener {
    public constructor(private tool: Tool) { }

    public info(msg: string): void {
        console.log(msg);
    }

    public error(msg: ANTLRMessage): void {
        console.error(msg.toString());
    }

    public warning(msg: ANTLRMessage): void {
        console.warn(msg.toString());
    }
}

export class ErrorManager {
    public getMessageTemplate(msg: ANTLRMessage): ST | undefined {
        return undefined;
    }
}

export class Tool {
    public errMgr!: ErrorManager;

    public constructor(private args: string[]) { }

    public addListener(listener: ANTLRToolListener): void { }

    public processGrammarsOnCommandLine(): void { }
}

export const padZero = (num: number, len: number): string => {
    return num.toString().padStart(len, "0");
};
