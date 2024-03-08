
/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Trees } from "./Trees.js";
import { Tool } from "../Tool.js";
import { Token, LexerInterpreter, CommonTokenStream, CommonToken, CharStreams, CharStream, DecisionInfo, ParseInfo, ParseTree } from "antlr4ng";
import { Rule } from "../tool/Rule.js";
import { LexerGrammar } from "../tool/LexerGrammar.js";
import { GrammarParserInterpreter } from "../tool/GrammarParserInterpreter.js";
import { Grammar } from "../tool/Grammar.js";
import { DefaultToolListener } from "../tool/DefaultToolListener.js";
import { ANTLRToolListener } from "../tool/ANTLRToolListener.js";



/** Interpret a lexer/parser, optionally printing tree string and dumping profile info
 *
 *  $ java org.antlr.v4.gui.Interpreter [X.g4|XParser.g4 XLexer.g4] startRuleName inputFileName
 *        [-tree]
 *        [-gui]
 *        [-trace]
 *        [-encoding encoding]
 *        [-tokens]
 *        [-profile filename.csv]
 */
export  class Interpreter {
	public static readonly  profilerColumnNames = [
			"Rule","Invocations", "Time (ms)", "Total k", "Max k", "Ambiguities", "DFA cache miss"
	];

	public static IgnoreTokenVocabGrammar =  class IgnoreTokenVocabGrammar extends Grammar {
		public  constructor(fileName: string,
									   grammarText: string,
									   tokenVocabSource: Grammar,
									   listener: ANTLRToolListener)
		{
			super(fileName, grammarText, tokenVocabSource, listener);
		}

		@Override
public override  importTokensFromTokensFile():  void {
			// don't try to import tokens files; must give me both grammars if split
		}
	};


	protected  grammarFileName:  string;
	protected  parserGrammarFileName:  string;
	protected  lexerGrammarFileName:  string;
	protected  startRuleName:  string;
	protected  printTree = false;
	protected  gui = false;
	protected  trace = false;
	protected  encoding = null;
	protected  showTokens = false;
	protected  profileFileName = null;
	protected  inputFileName:  string;

	public  constructor(args: string[]) {
		if ( args.length < 2 ) {
			System.err.println("java org.antlr.v4.gui.Intrepreter [X.g4|XParser.g4 XLexer.g4] startRuleName\n" +
					"  [-tokens] [-tree] [-gui] [-encoding encodingname]\n" +
					"  [-trace] [-profile filename.csv] [input-filename(s)]");
			System.err.println("Omitting input-filename makes rig read from stdin.");
			return;
		}
		let  i=0;
		this.grammarFileName = args[i];
		i++;
		if ( args[i].endsWith(".g4") ) {
			this.parserGrammarFileName = this.grammarFileName;
			this.lexerGrammarFileName = args[i];
			i++;
			this.grammarFileName = null;

			if ( this.parserGrammarFileName.toLowerCase().endsWith("lexer.g4") ) { // swap
				let  save = this.parserGrammarFileName;
				this.parserGrammarFileName = this.lexerGrammarFileName;
				this.lexerGrammarFileName = save;
			}
		}
		this.startRuleName = args[i];
		i++;
		while ( i<args.length ) {
			let  arg = args[i];
			i++;
			if ( arg.charAt(0)!=='-' ) { // input file name
				this.inputFileName = arg;
			}
			else {
 if ( arg.equals("-tree") ) {
				this.printTree = true;
			}
			else {
 if ( arg.equals("-gui") ) {
				this.gui = true;
			}
			else {
 if ( arg.equals("-tokens") ) {
				this.showTokens = true;
			}
			else {
 if ( arg.equals("-trace") ) {
				this.trace = true;
			}
			else {
 if ( arg.equals("-profile") ) {
				if ( i>=args.length ) {
					System.err.println("missing CSV filename on -profile (ignoring -profile)");
					return;
				}
				if ( args[i].startsWith("-") ) { // filename can't start with '-' since likely an arg
					System.err.println("missing CSV filename on -profile (ignoring -profile)");
					return;
				}
				this.profileFileName = args[i];
				if ( !this.profileFileName.endsWith(".csv") ) {
					System.err.println("warning: missing '.csv' suffix on -profile filename: "+this.profileFileName);
				}
				i++;
			}
			else {
 if ( arg.equals("-encoding") ) {
				if ( i>=args.length ) {
					System.err.println("missing encoding on -encoding");
					return;
				}
				this.encoding = args[i];
				i++;
			}
}

}

}

}

}

}

		}
	}

	public static  getValue(decisionInfo: DecisionInfo,
								  ruleNamesByDecision: string[],
								  decision: number,
								  col: number):  Object
	{
		switch (col) { // laborious but more efficient than reflection
			case 0:{
				return  string.format("%s:%d",ruleNamesByDecision[decision],decision);
}

			case 1:{
				return decisionInfo.invocations;
}

			case 2:{
				return decisionInfo.timeInPrediction/(1000.0 * 1000.0);
}

			case 3:{
				return decisionInfo.LL_TotalLook+decisionInfo.SLL_TotalLook;
}

			case 4:{
				return Math.max(decisionInfo.LL_MaxLook, decisionInfo.SLL_MaxLook);
}

			case 5:{
				return decisionInfo.ambiguities.size();
}

			case 6:{
				return decisionInfo.SLL_ATNTransitions+
						decisionInfo.LL_ATNTransitions;
}


default:

		}
		return "n/a";
	}

	public static  main(args: string[]):  void {
		let  I = new  Interpreter(args);
		I.interp();
	}

	protected  interp():  ParseInfo {
		if ( this.grammarFileName===null && (this.parserGrammarFileName===null && this.lexerGrammarFileName===null) ) {
			return null;
		}
		let  g: Grammar;
		let  lg = null;
		let  listener = new  DefaultToolListener(new  Tool());
		if (this.grammarFileName !== null) {
			let  grammarContent = Files.readString(Path.of(this.grammarFileName));
			g = new  Interpreter.IgnoreTokenVocabGrammar(this.grammarFileName, grammarContent, null, listener);
		}
		else {
			let  lexerGrammarContent = Files.readString(Path.of(this.lexerGrammarFileName));
			lg = new  LexerGrammar(lexerGrammarContent, listener);
			let  parserGrammarContent = Files.readString(Path.of(this.parserGrammarFileName));
			g = new  Interpreter.IgnoreTokenVocabGrammar(this.parserGrammarFileName, parserGrammarContent, lg, listener);
		}

		let  charset = ( this.encoding === null ? Charset.defaultCharset () : Charset.forName(this.encoding) );
		let  charStream = null;
		if ( this.inputFileName===null ) {
			charStream = CharStreams.fromStream(System.in, charset);
		}
		else {
			try {
				charStream = CharStreams.fromPath(Paths.get(this.inputFileName), charset);
			} catch (nsfe) {
if (nsfe instanceof NoSuchFileException) {
				System.err.println("Can't find input file "+this.inputFileName);
				System.exit(1);
			} else {
	throw nsfe;
	}
}
		}

		let  lexEngine = (lg!==null) ?
				lg.createLexerInterpreter(charStream) :
				g.createLexerInterpreter(charStream);

		let  tokens = new  CommonTokenStream(lexEngine);

		tokens.fill();

		if ( this.showTokens ) {
			for (let tok of tokens.getTokens()) {
				if ( tok instanceof CommonToken ) {
					System.out.println((tok as CommonToken).toString(lexEngine));
				}
				else {
					System.out.println(tok.toString());
				}
			}
		}

		let  parser = g.createGrammarParserInterpreter(tokens);
		if ( this.profileFileName!==null ) {
			parser.setProfile(true);
		}
		parser.setTrace(this.trace);

		let  r = g.rules.get(this.startRuleName);
		if (r === null) {
			System.err.println("No such start rule: "+this.startRuleName);
			return null;
		}
		let  t = parser.parse(r.index);
		let  parseInfo = parser.getParseInfo();

		if ( this.printTree ) {
			System.out.println(t.toStringTree(parser));
		}
		if ( this.gui ) {
			Trees.inspect(t, parser);
		}
		if ( this.profileFileName!==null ) {
			this.dumpProfilerCSV(parser, parseInfo);
		}

		return parseInfo;
	}

	private  dumpProfilerCSV(parser: GrammarParserInterpreter, parseInfo: ParseInfo):  void {
		let  ruleNamesByDecision = new  Array<string>(parser.getATN().decisionToState.size());
		for(let  i = 0; i < ruleNamesByDecision .length; i++) {
			ruleNamesByDecision [i] = parser.getRuleNames()[parser.getATN().getDecisionState(i).ruleIndex];
		}

		let  decisionInfo = parseInfo.getDecisionInfo();
		let  table = new  [[]];

		for (let  decision = 0; decision < decisionInfo.length; decision++) {
			for (let  col = 0; col < Interpreter.profilerColumnNames.length; col++) {
				let  colVal = Interpreter.getValue(decisionInfo[decision], ruleNamesByDecision, decision, col);
				table[decision][col] = colVal.toString();
			}
		}

		try {
			let  fileWriter = new  FileWriter(this.profileFileName);
			let  pw = new  PrintWriter(fileWriter);

			for (let  i = 0; i < Interpreter.profilerColumnNames.length; i++) {
				if (i > 0) {
 pw.print(",");
}

				pw.print(Interpreter.profilerColumnNames[i]);
			}
			pw.println();
			for (let row of table) {
				for (let  i = 0; i < Interpreter.profilerColumnNames.length; i++) {
					if (i > 0) {
 pw.print(",");
}

					pw.print(row[i]);
				}
				pw.println();
			}
			pw.close();
		} catch (ioe) {
if (ioe instanceof IOException) {
			System.err.println("Error writing profile info to "+this.profileFileName+": "+ioe.getMessage());
		} else {
	throw ioe;
	}
}
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Interpreter {
	export type IgnoreTokenVocabGrammar = InstanceType<typeof Interpreter.IgnoreTokenVocabGrammar>;
}


