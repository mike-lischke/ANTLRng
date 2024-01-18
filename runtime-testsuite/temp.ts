/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable max-classes-per-file */

import { ATN, RuleStartState } from "antlr4ng";
import { ST } from "stringtemplate4ts";

/**
 * Skeleton implementations for classes from the ANTLR tool.
 * Because we want to make the runtime tests independent from the tool we need to provide separate/duplicate
 * implementations for some of the tool classes.
 */

export class Rule {
    public readonly index = 0;
}

export class Grammar {
    public getRule(name: string): Rule {
        return new Rule();
    }

    public getATN(): ATN {
        return new ATN(0, 0);
    }
}

export class ATNPrinter {
    public constructor(grammar: Grammar, startState: RuleStartState | null) {
    }

    public asString(): string {
        return "";
    }
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

export class ErrorManager {
    public getMessageTemplate(msg: ANTLRMessage): ST | undefined {
        return undefined;
    }
}

export class Tool {
    public errMgr!: ErrorManager;
}
