/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { RuleActionFunction } from "./RuleActionFunction.js";
import { Recognizer } from "./Recognizer.js";
import { ModelElement } from "./ModelElement.js";
import { LexerFile } from "./LexerFile.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Target } from "../Target.js";
import { Grammar } from "../../tool/Grammar.js";
import { LexerGrammar } from "../../tool/LexerGrammar.js";
import { Rule } from "../../tool/Rule.js";
import { LinkedHashMap as HashMap } from "antlr4ng";

export  class Lexer extends Recognizer {
    public readonly  channelNames:  java.util.Collection<string>;
    public readonly  escapedChannels:  Map<string, number>;
    public readonly  file:  LexerFile;
    public readonly  modes:  java.util.Collection<string>;
    public readonly  escapedModeNames:  java.util.Collection<string>;

    @ModelElement
    public  actionFuncs =
            new  LinkedHashMap<Rule, RuleActionFunction>();

    public  constructor(factory: OutputModelFactory, file: LexerFile) {
        super(factory);
        this.file = file; // who contains us?

        const  g = factory.getGrammar();
        const  target = factory.getGenerator().getTarget();

        this.escapedChannels = new  LinkedHashMap();
        this.channelNames = [];
        for (const key of g.channelNameToValueMap.keySet()) {
            const  value = g.channelNameToValueMap.get(key);
            this.escapedChannels.put(target.escapeIfNeeded(key), value);
            this.channelNames.add(key);
        }

        this.modes = (g as LexerGrammar).modes.keySet();
        this.escapedModeNames = new  Array(this.modes.size());
        for (const mode of this.modes) {
            this.escapedModeNames.add(target.escapeIfNeeded(mode));
        }
    }
}
