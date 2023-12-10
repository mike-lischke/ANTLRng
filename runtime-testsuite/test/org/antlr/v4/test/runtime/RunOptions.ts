/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { JavaObject, java } from "jree";
import { Stage } from "./Stage";
import { PredictionMode } from "antlr4ng";

type String = java.lang.String;
const String = java.lang.String;



export  class RunOptions extends JavaObject {
	public readonly  grammarFileName;
	public readonly  grammarStr;
	public readonly  parserName;
	public readonly  lexerName;
	public readonly  grammarName;
	public readonly  useListener;
	public readonly  useVisitor;
	public readonly  startRuleName;
	public readonly  input;
	public readonly  profile;
	public readonly  showDiagnosticErrors;
	public readonly  traceATN;
	public readonly  showDFA;
	public readonly  endStage;
	public readonly  superClass;
	public readonly  predictionMode;
	public readonly  buildParseTree;

	public  constructor(grammarFileName: String, grammarStr: String, parserName: String, lexerName: String,
					  useListener: boolean, useVisitor: boolean, startRuleName: String,
					  input: String, profile: boolean, showDiagnosticErrors: boolean,
					  traceATN: boolean, showDFA: boolean, endStage: Stage,
					  language: String, superClass: String, predictionMode: PredictionMode, buildParseTree: boolean) {
		super();
this.grammarFileName = grammarFileName;
		this.grammarStr = grammarStr;
		this.parserName = parserName;
		this.lexerName = lexerName;
		let  grammarName = null;
		let  isCombinedGrammar = lexerName !== null && parserName !== null || language.equals("Go");
		if (isCombinedGrammar) {
			if (parserName !== null) {
				grammarName = parserName.endsWith("Parser")
					? parserName.substring(0, parserName.length() - "Parser".length())
					: parserName;
			}
			else {
 if (lexerName !== null) {
				grammarName = lexerName.endsWith("Lexer")
					? lexerName.substring(0, lexerName.length() - "Lexer".length())
					: lexerName;
			}
}

		}
		else {
			if (parserName !== null) {
				grammarName = parserName;
			}
			else {
				grammarName = lexerName;
			}
		}
		this.grammarName = grammarName;
		this.useListener = useListener;
		this.useVisitor = useVisitor;
		this.startRuleName = startRuleName;
		this.input = input;
		this.profile = profile;
		this.showDiagnosticErrors = showDiagnosticErrors;
		this.traceATN = traceATN;
		this.showDFA = showDFA;
		this.endStage = endStage;
		this.superClass = superClass;
		this.predictionMode = predictionMode;
		this.buildParseTree = buildParseTree;
	}
}
