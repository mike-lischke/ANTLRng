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
	protected readonly  grammarFileName:  java.lang.String | null;
	protected readonly  atn:  ATN | null;

	protected readonly  tokenNames:  java.lang.String[] | null;
	protected readonly  ruleNames:  java.lang.String[] | null;
	protected readonly  channelNames:  java.lang.String[] | null;
	protected readonly  modeNames:  java.lang.String[] | null;


	private readonly  vocabulary:  Vocabulary | null;

	protected readonly  _decisionToDFA:  DFA[] | null;
	protected readonly  _sharedContextCache:  PredictionContextCache | null =
		new  PredictionContextCache();

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(grammarFileName: java.lang.String| null, tokenNames: java.util.Collection<java.lang.String>| null, ruleNames: java.util.Collection<java.lang.String>| null, modeNames: java.util.Collection<java.lang.String>| null, atn: ATN| null, input: CharStream| null);

	public constructor(grammarFileName: java.lang.String| null, vocabulary: Vocabulary| null, ruleNames: java.util.Collection<java.lang.String>| null, modeNames: java.util.Collection<java.lang.String>| null, atn: ATN| null, input: CharStream| null);

	public constructor(grammarFileName: java.lang.String| null, vocabulary: Vocabulary| null, ruleNames: java.util.Collection<java.lang.String>| null, channelNames: java.util.Collection<java.lang.String>| null, modeNames: java.util.Collection<java.lang.String>| null, atn: ATN| null, input: CharStream| null);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(grammarFileName: java.lang.String | null, tokenNamesOrVocabulary: java.util.Collection<java.lang.String> | Vocabulary | null, ruleNames: java.util.Collection<java.lang.String> | null, modeNamesOrChannelNames: java.util.Collection<java.lang.String> | null, atnOrModeNames: ATN | java.util.Collection<java.lang.String> | null, inputOrAtn: CharStream | ATN | null, input?: CharStream | null) {
const $this = (grammarFileName: java.lang.String | null, tokenNamesOrVocabulary: java.util.Collection<java.lang.String> | Vocabulary | null, ruleNames: java.util.Collection<java.lang.String> | null, modeNamesOrChannelNames: java.util.Collection<java.lang.String> | null, atnOrModeNames: ATN | java.util.Collection<java.lang.String> | null, inputOrAtn: CharStream | ATN | null, input?: CharStream | null): void => {
if (tokenNamesOrVocabulary instanceof java.util.Collection && atnOrModeNames instanceof ATN && inputOrAtn instanceof CharStream && input === undefined) {
const tokenNames = tokenNamesOrVocabulary as java.util.Collection<java.lang.String>;
const atn = atnOrModeNames as ATN;
const input = inputOrAtn as CharStream;
		$this(grammarFileName, VocabularyImpl.fromTokenNames(tokenNames.toArray(new   Array<java.lang.String>(0))), ruleNames, new  java.util.ArrayList<java.lang.String>(), modeNames, atn, input);
	}
 else if (tokenNamesOrVocabulary instanceof Vocabulary && atnOrModeNames instanceof ATN && inputOrAtn instanceof CharStream && input === undefined) {
const vocabulary = tokenNamesOrVocabulary as Vocabulary;
const atn = atnOrModeNames as ATN;
const input = inputOrAtn as CharStream;
		$this(grammarFileName, vocabulary, ruleNames, new  java.util.ArrayList<java.lang.String>(), modeNames, atn, input);
	}
 else  {
let vocabulary = tokenNamesOrVocabulary as Vocabulary;
let channelNames = modeNamesOrChannelNames as java.util.Collection<java.lang.String>;
let modeNames = atnOrModeNames as java.util.Collection<java.lang.String>;
let atn = inputOrAtn as ATN;
/* @ts-expect-error, because of the super() call in the closure. */
		super(input);

		if (atn.grammarType !== ATNType.LEXER) {
			throw new  java.lang.IllegalArgumentException("The ATN must be a lexer ATN.");
		}

		this.grammarFileName = grammarFileName;
		this.atn = atn;
		this.tokenNames = new   Array<java.lang.String>(atn.maxTokenType);
		for (let  i: number = 0; i < this.tokenNames.length; i++) {
			this.tokenNames[i] = vocabulary.getDisplayName(i);
		}

		this.ruleNames = ruleNames.toArray(new   Array<java.lang.String>(0));
		this.channelNames = channelNames.toArray(new   Array<java.lang.String>(0));
		this.modeNames = modeNames.toArray(new   Array<java.lang.String>(0));
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

	public getATN = ():  ATN | null => {
		return this.atn;
	}

	public getGrammarFileName = ():  java.lang.String | null => {
		return this.grammarFileName;
	}

	public getTokenNames = ():  java.lang.String[] | null => {
		return this.tokenNames;
	}

	public getRuleNames = ():  java.lang.String[] | null => {
		return this.ruleNames;
	}

	public getChannelNames = ():  java.lang.String[] | null => {
		return this.channelNames;
	}

	public getModeNames = ():  java.lang.String[] | null => {
		return this.modeNames;
	}

	public getVocabulary = ():  Vocabulary | null => {
		if (this.vocabulary !== null) {
			return this.vocabulary;
		}

		return super.getVocabulary();
	}
}
