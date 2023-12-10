/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject, type int } from "jree";
import { RuntimeTestDescriptor } from "./RuntimeTestDescriptor";
import { GrammarType } from "./GrammarType";
import { PredictionMode, Pair } from "antlr4ng";

type String = java.lang.String;
const String = java.lang.String;
type URI = java.net.URI;
const URI = java.net.URI;
type StringBuilder = java.lang.StringBuilder;
const StringBuilder = java.lang.StringBuilder;
type Enum<E extends Enum<E>> = java.lang.Enum<E extends Enum<E>>;
const Enum = java.lang.Enum;
type RuntimeException = java.lang.RuntimeException;
const RuntimeException = java.lang.RuntimeException;

import { Test, Override } from "../../../../../../decorators.js";


export  class RuntimeTestDescriptorParser extends JavaObject {
	private static readonly  sections = new  java.util.HashSet(java.util.Arrays.asList(
			"notes", "type", "grammar", "slaveGrammar", "start", "input", "output", "errors", "flags", "skip"
	));

	/**  Read stuff like:
	 [grammar]
	 grammar T;
	 s @after {<DumpDFA()>}
	 : ID | ID {} ;
	 ID : 'a'..'z'+;
	 WS : (' '|'\t'|'\n')+ -> skip ;

	 [grammarName]
	 T

	 [start]
	 s

	 [input]
	 abc

	 [output]
	 Decision 0:
	 s0-ID->:s1^=>1

	 [errors]
	 """line 1:0 reportAttemptingFullContext d=0 (s), input='abc'
	 """

	 Some can be missing like [errors].

	 Get gr names automatically "lexer grammar Unicode;" "grammar T;" "parser grammar S;"

	 Also handle slave grammars:

	 [grammar]
	 grammar M;
	 import S,T;
	 s : a ;
	 B : 'b' ; // defines B from inherited token space
	 WS : (' '|'\n') -> skip ;

	 [slaveGrammar]
	 parser grammar T;
	 a : B {<writeln("\"T.a\"")>};<! hidden by S.a !>

	 [slaveGrammar]
	 parser grammar S;
	 a : b {<writeln("\"S.a\"")>};
	 b : B;
	 */
	public static  parse(name: String, text: String, uri: URI):  RuntimeTestDescriptor {
		let  currentField = null;
		let  currentValue = new  StringBuilder();

		let  pairs = new  java.util.ArrayList();
		let  lines = text.split("\r?\n");

		for (let line of lines) {
			let  newSection = false;
			let  sectionName = null;
			if (line.startsWith("[") && line.length() > 2) {
				sectionName = line.substring(1, line.length() - 1);
				newSection = RuntimeTestDescriptorParser.sections.contains(sectionName);
			}

			if (newSection) {
				if (currentField !== null) {
					pairs.add(new  Pair(currentField, currentValue.toString()));
				}
				currentField = sectionName;
				currentValue.setLength(0);
			}
			else {
				currentValue.append(line);
				currentValue.append("\n");
			}
		}
		pairs.add(new  Pair(currentField, currentValue.toString()));

		let  notes = "";
		let  testType = GrammarType.Lexer;
		let  grammar = "";
		let  grammarName = "";
		let  slaveGrammars = new  java.util.ArrayList();
		let  startRule = "";
		let  input = "";
		let  output = "";
		let  errors = "";
		let  showDFA = false;
		let  showDiagnosticErrors = false;
		let  traceATN = false;
		let  predictionMode = PredictionMode.LL;
		let  buildParseTree = true;
		let  skipTargets = new  Array<String>(0);
		for (let p of pairs) {
			let  section = p.a;
			let  value = "";
			if ( p.b!==null ) {
				value = p.b.trim();
			}
			if ( value.startsWith("\"\"\"") ) {
				value = value.replace("\"\"\"", "");
			}
			else {
 if ( value.indexOf('\n')>=0 ) {
				value = value + "\n"; // if multi line and not quoted, leave \n on end.
			}
}

			switch (section) {
				case "notes":{
					notes = value;
					break;
}

				case "type":{
					testType = Enum.valueOf(GrammarType.class, value);
					break;
}

				case "grammar":{
					grammarName = RuntimeTestDescriptorParser.getGrammarName(value.split("\n")[0]);
					grammar = value;
					break;
}

				case "slaveGrammar":{
					let  gname = RuntimeTestDescriptorParser.getGrammarName(value.split("\n")[0]);
					slaveGrammars.add(new  Pair(gname, value));
}

				case "start":{
					startRule = value;
					break;
}

				case "input":{
					input = value;
					break;
}

				case "output":{
					output = value;
					break;
}

				case "errors":{
					errors = value;
					break;
}

				case "flags":{
					let  flags = value.split("\n");
					for (let f of flags) {
						let  parts = f.split("=", 2);
						switch (parts[0]) {
							case "showDFA":{
								showDFA = true;
								break;
}

							case "showDiagnosticErrors":{
								showDiagnosticErrors = true;
								break;
}

							case "traceATN":{
								traceATN = true;
								break;
}

							case "predictionMode":{
								predictionMode = PredictionMode.valueOf(parts[1]);
								break;
}

							case "notBuildParseTree":{
								buildParseTree = false;
								break;
}


default:

						}
					}
					break;
}

				case "skip":{
					skipTargets = value.split("\n");
					break;
}

				default:{
					throw new  RuntimeException("Unknown descriptor section ignored: "+section);
}

			}
		}
		return new  RuntimeTestDescriptor(testType, name, notes, input, output, errors, startRule, grammarName, grammar,
				slaveGrammars, showDiagnosticErrors, traceATN, showDFA, predictionMode, buildParseTree, skipTargets, uri);
	}

	/** Get A, B, or C from:
	 * "lexer grammar A;" "grammar B;" "parser grammar C;"
	 */
	private static  getGrammarName(grammarDeclLine: String):  String {
		let  gi = grammarDeclLine.indexOf("grammar ");
		if ( gi<0 ) {
			return "<unknown grammar name>";
		}
		gi += "grammar ".length();
		let  gsemi = grammarDeclLine.indexOf(';');
		return grammarDeclLine.substring(gi, gsemi);
	}
}
