/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LexerGrammar } from "../../tool/LexerGrammar.js";
import { Rule } from "../../tool/Rule.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { LexerFile } from "./LexerFile.js";
import { Recognizer } from "./Recognizer.js";
import { RuleActionFunction } from "./RuleActionFunction.js";

export class Lexer extends Recognizer {
    public readonly channelNames: string[] = [];
    public readonly escapedChannels = new Map<string, number>();
    public readonly file: LexerFile;
    public readonly modes: string[];
    public readonly escapedModeNames: string[];

    public actionFuncs = new Map<Rule, RuleActionFunction>();

    public constructor(factory: OutputModelFactory, file: LexerFile) {
        super(factory);
        this.file = file; // who contains us?

        const g = factory.getGrammar();
        const target = factory.getGenerator().getTarget();

        for (const [key, value] of g.channelNameToValueMap) {
            this.escapedChannels.set(target.escapeIfNeeded(key), value);
            this.channelNames.push(key);
        }

        this.modes = Array.from((g as LexerGrammar).modes.keys());
        for (const mode of this.modes) {
            this.escapedModeNames.push(target.escapeIfNeeded(mode));
        }
    }
}
