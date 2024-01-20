/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable max-classes-per-file */

import { ATN, CharStream, Lexer, LexerATNSimulator, LexerInterpreter, RuleStartState, Vocabulary } from "antlr4ng";
import { ST } from "stringtemplate4ts";
import { GrammarType } from "./test/GrammarType.js";

/**
 * Skeleton implementations for classes from the ANTLR tool.
 * Because we want to make the runtime tests independent from the tool we need to provide separate/duplicate
 * implementations for some of the tool classes.
 */

export class Rule {
    public readonly index = 0;
}

export class Grammar {
    public constructor(public grammarText: string) {
    }
    public getRule(name: string): Rule {
        return new Rule();
    }

    public getATN(): ATN {
        return new ATN(0, 0);
    }

    public getTokenNames(): Vocabulary {
        return new Vocabulary([], []);
    }
}

export class LexerGrammar extends Grammar {
    public createLexerInterpreter(input: CharStream): Lexer {
        return new LexerInterpreter("", new Vocabulary([], []), [], [], [], new ATN(GrammarType.Lexer, 0), input);
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
