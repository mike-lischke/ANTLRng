/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */



import { java } from "../../../../../lib/java/java";
import { CharStream } from "./CharStream";
import { Lexer } from "./Lexer";
import { Vocabulary } from "./Vocabulary";
import { VocabularyImpl } from "./VocabularyImpl";
import { ATN } from "./atn/ATN";
import { ATNType } from "./atn/ATNType";
import { LexerATNSimulator } from "./atn/LexerATNSimulator";
import { PredictionContextCache } from "./atn/PredictionContextCache";
import { DFA } from "./dfa/DFA";




export  class LexerInterpreter extends Lexer {
	protected readonly  grammarFileName?:  string;
	protected readonly  atn?:  ATN;

	protected readonly  tokenNames?:  string[];
	protected readonly  ruleNames?:  string[];
	protected readonly  channelNames?:  string[];
	protected readonly  modeNames?:  string[];


	private readonly  vocabulary?:  Vocabulary;

	protected readonly  _decisionToDFA?:  DFA[];
	protected readonly  _sharedContextCache?:  PredictionContextCache =
		new  PredictionContextCache();

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(grammarFileName: string, tokenNames: java.util.Collection<string>, ruleNames: java.util.Collection<string>, modeNames: java.util.Collection<string>, atn: ATN, input: CharStream);

	public constructor(grammarFileName: string, vocabulary: Vocabulary, ruleNames: java.util.Collection<string>, modeNames: java.util.Collection<string>, atn: ATN, input: CharStream);

	public constructor(grammarFileName: string, vocabulary: Vocabulary, ruleNames: java.util.Collection<string>, channelNames: java.util.Collection<string>, modeNames: java.util.Collection<string>, atn: ATN, input: CharStream);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(grammarFileName: string, tokenNamesOrVocabulary: java.util.Collection<string> | Vocabulary, ruleNames: java.util.Collection<string>, modeNamesOrChannelNames: java.util.Collection<string>, atnOrModeNames: ATN | java.util.Collection<string>, inputOrAtn: CharStream | ATN, input?: CharStream) {
const $this = (grammarFileName: string, tokenNamesOrVocabulary: java.util.Collection<string> | Vocabulary, ruleNames: java.util.Collection<string>, modeNamesOrChannelNames: java.util.Collection<string>, atnOrModeNames: ATN | java.util.Collection<string>, inputOrAtn: CharStream | ATN, input?: CharStream): void => {
if (tokenNamesOrVocabulary instanceof java.util.Collection && atnOrModeNames instanceof ATN && inputOrAtn instanceof CharStream && input === undefined) {
const tokenNames = tokenNamesOrVocabulary as java.util.Collection<string>;
const atn = atnOrModeNames as ATN;
const input = inputOrAtn as CharStream;
		$this(grammarFileName, VocabularyImpl.fromTokenNames(tokenNames.toArray(new   Array<string>(0))), ruleNames, new  java.util.ArrayList<string>(), modeNames, atn, input);
	}
 else if (tokenNamesOrVocabulary instanceof Vocabulary && atnOrModeNames instanceof ATN && inputOrAtn instanceof CharStream && input === undefined) {
const vocabulary = tokenNamesOrVocabulary as Vocabulary;
const atn = atnOrModeNames as ATN;
const input = inputOrAtn as CharStream;
		$this(grammarFileName, vocabulary, ruleNames, new  java.util.ArrayList<string>(), modeNames, atn, input);
	}
 else  {
let vocabulary = tokenNamesOrVocabulary as Vocabulary;
let channelNames = modeNamesOrChannelNames as java.util.Collection<string>;
let modeNames = atnOrModeNames as java.util.Collection<string>;
let atn = inputOrAtn as ATN;
/* @ts-expect-error, because of the super() call in the closure. */
		super(input);

		if (atn.grammarType !== ATNType.LEXER) {
			throw new  java.lang.IllegalArgumentException("The ATN must be a lexer ATN.");
		}

		this.grammarFileName = grammarFileName;
		this.atn = atn;
		this.tokenNames = new   Array<string>(atn.maxTokenType);
		for (let  i: number = 0; i < this.tokenNames.length; i++) {
			this.tokenNames[i] = vocabulary.getDisplayName(i);
		}

		this.ruleNames = ruleNames.toArray(new   Array<string>(0));
		this.channelNames = channelNames.toArray(new   Array<string>(0));
		this.modeNames = modeNames.toArray(new   Array<string>(0));
		this.vocabulary = vocabulary;

		this._decisionToDFA = new   Array<DFA>(atn.getNumberOfDecisions());
		for (let  i: number = 0; i < this._decisionToDFA.length; i++) {
			this._decisionToDFA[i] = new  DFA(atn.getDecisionState(i), i);
		}
		this._interp = new  LexerATNSimulator(this,atn,this._decisionToDFA,this._sharedContextCache);
	}
};

$this(grammarFileName, tokenNamesOrVocabulary, ruleNames, modeNamesOrChannelNames, atnOrModeNames, inputOrAtn, input);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	public getATN = (): ATN => {
		return this.atn;
	}

	public getGrammarFileName = (): string => {
		return this.grammarFileName;
	}

	public getTokenNames = (): string[] => {
		return this.tokenNames;
	}

	public getRuleNames = (): string[] => {
		return this.ruleNames;
	}

	public getChannelNames = (): string[] => {
		return this.channelNames;
	}

	public getModeNames = (): string[] => {
		return this.modeNames;
	}

	public getVocabulary = (): Vocabulary => {
		if (this.vocabulary !== undefined) {
			return this.vocabulary;
		}

		return super.getVocabulary();
	}
}
