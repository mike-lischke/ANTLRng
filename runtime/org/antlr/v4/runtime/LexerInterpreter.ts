/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable no-underscore-dangle */

import { java, S } from "jree";
import { CharStream } from "./CharStream";
import { Lexer } from "./Lexer";
import { Vocabulary } from "./Vocabulary";
import { ATN } from "./atn/ATN";
import { ATNType } from "./atn/ATNType";
import { LexerATNSimulator } from "./atn/LexerATNSimulator";
import { PredictionContextCache } from "./atn/PredictionContextCache";
import { DFA } from "./dfa/DFA";

export class LexerInterpreter extends Lexer {
    protected readonly grammarFileName: string;
    protected readonly atn: ATN;

    protected readonly tokenNames: string[];
    protected readonly ruleNames: string[];
    protected readonly channelNames: string[];
    protected readonly modeNames: string[];

    protected readonly _decisionToDFA: DFA[];
    protected readonly _sharedContextCache: PredictionContextCache = new PredictionContextCache();

    private readonly vocabulary: Vocabulary;

    public constructor(grammarFileName: string, vocabulary: Vocabulary,
        ruleNames: java.util.Collection<string>, channelNames: java.util.Collection<string>,
        modeNames: java.util.Collection<string>, atn: ATN, input: CharStream) {
        super(input);

        if (atn.grammarType !== ATNType.LEXER) {
            throw new java.lang.IllegalArgumentException(S`The ATN must be a lexer ATN.`);
        }

        this.grammarFileName = grammarFileName;
        this.atn = atn;
        this.tokenNames = new Array(atn.maxTokenType);
        for (let i = 0; i < atn.maxTokenType; i++) {
            this.tokenNames[i] = vocabulary.getDisplayName(i)!;
        }

        this.ruleNames = ruleNames.toArray();
        this.channelNames = channelNames.toArray();
        this.modeNames = modeNames.toArray();
        this.vocabulary = vocabulary;

        this._decisionToDFA = new Array(atn.getNumberOfDecisions());
        for (let i = 0; i < this._decisionToDFA.length; ++i) {
            this._decisionToDFA[i] = new DFA(atn.getDecisionState(i), i);
        }

        this.interpreter = new LexerATNSimulator(atn, this._decisionToDFA, this._sharedContextCache);
    }

    public getATN = (): ATN => {
        return this.atn;
    };

    public getGrammarFileName = (): string => {
        return this.grammarFileName;
    };

    public override getTokenNames = (): string[] => {
        return this.tokenNames;
    };

    public getRuleNames = (): string[] => {
        return this.ruleNames;
    };

    public override getChannelNames = (): string[] => {
        return this.channelNames;
    };

    public override getModeNames = (): string[] => {
        return this.modeNames;
    };

    public override getVocabulary = (): Vocabulary => {
        return this.vocabulary;
    };
}
