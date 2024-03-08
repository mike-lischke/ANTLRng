/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { AnalysisPipeline } from "./analysis/AnalysisPipeline.js";
import { ATNFactory } from "./automata/ATNFactory.js";
import { LexerATNFactory } from "./automata/LexerATNFactory.js";
import { ParserATNFactory } from "./automata/ParserATNFactory.js";
import { CodeGenPipeline } from "./codegen/CodeGenPipeline.js";
import { CodeGenerator } from "./codegen/CodeGenerator.js";
import { Graph } from "./misc/Graph.js";
import { GrammarASTAdaptor } from "./parse/GrammarASTAdaptor.js";
import { ToolANTLRLexer } from "./parse/ToolANTLRLexer.js";
import { ToolANTLRParser } from "./parse/ToolANTLRParser.js";
import { RuntimeMetaData, LogManager, IntegerList, ATNSerializer, HashMap } from "antlr4ng";
import { SemanticPipeline } from "./semantics/SemanticPipeline.js";
import { ANTLRMessage } from "./tool/ANTLRMessage.js";
import { ANTLRToolListener } from "./tool/ANTLRToolListener.js";
import { BuildDependencyGenerator } from "./tool/BuildDependencyGenerator.js";
import { DOTGenerator } from "./tool/DOTGenerator.js";
import { DefaultToolListener } from "./tool/DefaultToolListener.js";
import { ErrorType } from "./tool/ErrorType.js";
import { Grammar } from "./tool/Grammar.js";
import { GrammarTransformPipeline } from "./tool/GrammarTransformPipeline.js";
import { LexerGrammar } from "./tool/LexerGrammar.js";
import { Rule } from "./tool/Rule.js";
import { GrammarAST } from "./tool/ast/GrammarAST.js";
import { GrammarASTErrorNode } from "./tool/ast/GrammarASTErrorNode.js";
import { GrammarRootAST } from "./tool/ast/GrammarRootAST.js";
import { RuleAST } from "./tool/ast/RuleAST.js";



export  class Tool {
	public static readonly  VERSION:  string;

	public static readonly  GRAMMAR_EXTENSION = ".g4";
	public static readonly  LEGACY_GRAMMAR_EXTENSION = ".g";

	public static readonly  ALL_GRAMMAR_EXTENSIONS =
		java.util.Collections.unmodifiableList(java.util.Arrays.asList(Tool.GRAMMAR_EXTENSION, Tool.LEGACY_GRAMMAR_EXTENSION)); // NONE implies boolean
	public static Option =  class Option {
		protected  fieldName: string;
		protected  name: string;
		protected  argType: Tool.OptionArgType;
		protected  description: string;

		public  constructor(fieldName: string, name: string, description: string);

		public  constructor(fieldName: string, name: string, argType: Tool.OptionArgType, description: string);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 3: {
				const [fieldName, name, description] = args as [string, string, string];


			this(fieldName, name, Tool.OptionArgType.NONE, description);
		

				break;
			}

			case 4: {
				const [fieldName, name, argType, description] = args as [string, string, Tool.OptionArgType, string];


			this.fieldName = fieldName;
			this.name = name;
			this.argType = argType;
			this.description = description;
		

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}

	};


    public static readonly  optionDefs = [
		new  Tool.Option("outputDirectory",             "-o", Tool.OptionArgType.STRING, "specify output directory where all output is generated"),
		new  Tool.Option("libDirectory",                "-lib", Tool.OptionArgType.STRING, "specify location of grammars, tokens files"),
		new  Tool.Option("generate_ATN_dot",            "-atn", "generate rule augmented transition network diagrams"),
		new  Tool.Option("grammarEncoding",             "-encoding", Tool.OptionArgType.STRING, "specify grammar file encoding; e.g., euc-jp"),
		new  Tool.Option("msgFormat",                   "-message-format", Tool.OptionArgType.STRING, "specify output style for messages in antlr, gnu, vs2005"),
		new  Tool.Option("longMessages",                "-long-messages", "show exception details when available for errors and warnings"),
		new  Tool.Option("gen_listener",                "-listener", "generate parse tree listener (default)"),
		new  Tool.Option("gen_listener",                "-no-listener", "don't generate parse tree listener"),
		new  Tool.Option("gen_visitor",                 "-visitor", "generate parse tree visitor"),
		new  Tool.Option("gen_visitor",                 "-no-visitor", "don't generate parse tree visitor (default)"),
		new  Tool.Option("genPackage",                  "-package", Tool.OptionArgType.STRING, "specify a package/namespace for the generated code"),
		new  Tool.Option("gen_dependencies",            "-depend", "generate file dependencies"),
		new  Tool.Option("",                            "-D<option>=value", "set/override a grammar-level option"),
		new  Tool.Option("warnings_are_errors",         "-Werror", "treat warnings as errors"),
		new  Tool.Option("launch_ST_inspector",         "-XdbgST", "launch StringTemplate visualizer on generated code"),
		new  Tool.Option("ST_inspector_wait_for_close", "-XdbgSTWait", "wait for STViz to close before continuing"),
		new  Tool.Option("force_atn",                   "-Xforce-atn", "use the ATN simulator for all predictions"),
		new  Tool.Option("log",                         "-Xlog", "dump lots of logging info to antlr-timestamp.log"),
	    new  Tool.Option("exact_output_dir",            "-Xexact-output-dir", "all output goes into -o dir regardless of paths/package"),
	];

	// fields set by option manager

	public  inputDirectory:  File; // used by mvn plugin but not set by tool itself.
	public  outputDirectory:  string;
	public  libDirectory:  string;
	public  generate_ATN_dot = false;
	public  grammarEncoding = null; // use default locale's encoding
	public  msgFormat = "antlr";
	public  launch_ST_inspector = false;
	public  ST_inspector_wait_for_close = false;
    public  force_atn = false;
    public  log = false;
	public  gen_listener = true;
	public  gen_visitor = false;
	public  gen_dependencies = false;
	public  genPackage = null;
	public  grammarOptions = null;
	public  warnings_are_errors = false;
	public  longMessages = false;
	public  exact_output_dir = false;


	public readonly  args:  string[];

	public  errMgr:  java.util.logging.ErrorManager;
    public  logMgr = new  java.util.logging.LogManager();

	// helper vars for option management
	protected  haveOutputDir = false;
	protected  return_dont_exit = false;

	protected  grammarFiles = new  Array<string>();

	protected  listeners = new  CopyOnWriteArrayList<ANTLRToolListener>();

	/** Track separately so if someone adds a listener, it's the only one
	 *  instead of it and the default stderr listener.
	 */
	protected  defaultListener = new  DefaultToolListener(this);

	private readonly  importedGrammars = new  HashMap<string, Grammar>();

	public  constructor();

	public  constructor(args: string[]);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 0: {
 this(null); 

				break;
			}

			case 1: {
				const [args] = args as [string[]];


		this.args = args;
		this.errMgr = new  java.util.logging.ErrorManager(this);
		// We have to use the default message format until we have
		// parsed the -message-format command line option.
		this.errMgr.setFormat("antlr");
		this.handleArgs();
		this.errMgr.setFormat(this.msgFormat);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public static  main(args: string[]):  void {
        let  antlr = new  Tool(args);
        if ( args.length === 0 ) { antlr.help(); antlr.exit(0); }

        try {
            antlr.processGrammarsOnCommandLine();
        }
        finally {
            if ( antlr.log ) {
                try {
                    let  logname = antlr.logMgr.save();
                    System.out.println("wrote "+logname);
                } catch (ioe) {
if (ioe instanceof IOException) {
                    antlr.errMgr.toolError(ErrorType.INTERNAL_ERROR, ioe);
                } else {
	throw ioe;
	}
}
            }
        }
		if ( antlr.return_dont_exit ) {
 return;
}


		if (antlr.errMgr.getNumErrors() > 0) {
			antlr.exit(1);
		}
		antlr.exit(0);
	}

	/** Manually get option node from tree; return null if no defined. */
	public static  findOptionValueAST(root: GrammarRootAST, option: string):  GrammarAST {
		let  options = root.getFirstChildWithType(ANTLRParser.OPTIONS) as GrammarAST;
		if ( options!==null && options.getChildCount() > 0 ) {
			for (let o of options.getChildren()) {
				let  c = o as GrammarAST;
				if ( c.getType() === ANTLRParser.ASSIGN &&
					 c.getChild(0).getText().equals(option) )
				{
					return c.getChild(1) as GrammarAST;
				}
			}
		}
		return null;
	}

	public static  generateInterpreterData(g: Grammar):  string {
		let  content = new  StringBuilder();

		content.append("token literal names:\n");
		let  names = g.getTokenLiteralNames();
		for (let name of names) {
			content.append(name + "\n");
		}
		content.append("\n");

		content.append("token symbolic names:\n");
		names = g.getTokenSymbolicNames();
		for (let name of names) {
			content.append(name + "\n");
		}
		content.append("\n");

		content.append("rule names:\n");
		names = g.getRuleNames();
		for (let name of names) {
			content.append(name + "\n");
		}
		content.append("\n");

		if ( g.isLexer() ) {
			content.append("channel names:\n");
			content.append("DEFAULT_TOKEN_CHANNEL\n");
			content.append("HIDDEN\n");
			for (let channel of g.channelValueToNameList) {
				content.append(channel + "\n");
			}
			content.append("\n");

			content.append("mode names:\n");
			for (let mode of (g as LexerGrammar).modes.keySet()) {
				content.append(mode + "\n");
			}
		}
		content.append("\n");

		let  serializedATN = ATNSerializer.getSerialized(g.atn);
		// Uncomment if you'd like to write out histogram info on the numbers of
		// each integer value:
		//Utils.writeSerializedATNIntegerHistogram(g.name+"-histo.csv", serializedATN);

		content.append("atn:\n");
		content.append(serializedATN.toString());

		return content.toString();
	}

	public  processGrammarsOnCommandLine():  void {
		let  sortedGrammars = this.sortGrammarByTokenVocab(this.grammarFiles);

		for (let t of sortedGrammars) {
			 let  g = this.createGrammar(t);
			g.fileName = t.fileName;
			if ( this.gen_dependencies ) {
				let  dep =
					new  BuildDependencyGenerator(this, g);
				/*
					List outputFiles = dep.getGeneratedFileList();
					List dependents = dep.getDependenciesFileList();
					System.out.println("output: "+outputFiles);
					System.out.println("dependents: "+dependents);
					 */
				System.out.println(dep.getDependencies().render());

			}
			else {
 if (this.errMgr.getNumErrors() === 0) {
				this.process(g, true);
			}
}

		}
	}

	/** To process a grammar, we load all of its imported grammars into
		subordinate grammar objects. Then we merge the imported rules
		into the root grammar. If a root grammar is a combined grammar,
		we have to extract the implicit lexer. Once all this is done, we
		process the lexer first, if present, and then the parser grammar
	 */
	public  process(g: Grammar, gencode: boolean):  void {
		g.loadImportedGrammars();

		let  transform = new  GrammarTransformPipeline(g, this);
		transform.process();

		let  lexerg: LexerGrammar;
		let  lexerAST: GrammarRootAST;
		if ( g.ast!==null && g.ast.grammarType=== ANTLRParser.COMBINED &&
			 !g.ast.hasErrors )
		{
			lexerAST = transform.extractImplicitLexer(g); // alters g.ast
			if ( lexerAST!==null ) {
				if (this.grammarOptions !== null) {
					lexerAST.cmdLineOptions = this.grammarOptions;
				}

				lexerg = new  LexerGrammar(this, lexerAST);
				lexerg.fileName = g.fileName;
				lexerg.originalGrammar = g;
				g.implicitLexer = lexerg;
				lexerg.implicitLexerOwner = g;
				this.processNonCombinedGrammar(lexerg, gencode);
//				System.out.println("lexer tokens="+lexerg.tokenNameToTypeMap);
//				System.out.println("lexer strings="+lexerg.stringLiteralToTypeMap);
			}
		}
		if ( g.implicitLexer!==null ) {
 g.importVocab(g.implicitLexer);
}

//		System.out.println("tokens="+g.tokenNameToTypeMap);
//		System.out.println("strings="+g.stringLiteralToTypeMap);
		this.processNonCombinedGrammar(g, gencode);
	}

	public  processNonCombinedGrammar(g: Grammar, gencode: boolean):  void {
		if ( g.ast===null || g.ast.hasErrors ) {
 return;
}


		let  ruleFail = this.checkForRuleIssues(g);
		if ( ruleFail ) {
 return;
}


		let  prevErrors = this.errMgr.getNumErrors();
		// MAKE SURE GRAMMAR IS SEMANTICALLY CORRECT (FILL IN GRAMMAR OBJECT)
		let  sem = new  SemanticPipeline(g);
		sem.process();

		if ( this.errMgr.getNumErrors()>prevErrors ) {
 return;
}


		let  codeGenerator = CodeGenerator.create(g);
		if (codeGenerator === null) {
			return;
		}

		// BUILD ATN FROM AST
		let  factory: ATNFactory;
		if ( g.isLexer() ) {
 factory = new  LexerATNFactory(g as LexerGrammar, codeGenerator);
}

		else {
 factory = new  ParserATNFactory(g);
}

		g.atn = factory.createATN();

		if ( this.generate_ATN_dot ) {
 this.generateATNs(g);
}


		if (gencode && g.tool.getNumErrors()===0 ) {
			let  interpFile = Tool.generateInterpreterData(g);
			try {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const fw: Writer  = this.getOutputFileWriter(g, g.name + ".interp")
try {
	try  {
				LogManager.save.#block#.fw.write(interpFile);
			}
	finally {
	error = closeResources([fw]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}
 catch (ioe) {
if (ioe instanceof IOException) {
				this.errMgr.toolError(ErrorType.CANNOT_WRITE_FILE, ioe);
			} else {
	throw ioe;
	}
}
		}

		// PERFORM GRAMMAR ANALYSIS ON ATN: BUILD DECISION DFAs
		let  anal = new  AnalysisPipeline(g);
		anal.process();

		//if ( generate_DFA_dot ) generateDFAs(g);

		if ( g.tool.getNumErrors()>prevErrors ) {
 return;
}


		// GENERATE CODE
		if ( gencode ) {
			let  gen = new  CodeGenPipeline(g, codeGenerator);
			gen.process();
		}
	}

	/**
	 * Important enough to avoid multiple definitions that we do very early,
	 * right after AST construction. Also check for undefined rules in
	 * parser/lexer to avoid exceptions later. Return true if we find multiple
	 * definitions of the same rule or a reference to an undefined rule or
	 * parser rule ref in lexer rule.
	 */
	public  checkForRuleIssues(/* final */  g: Grammar):  boolean {
		// check for redefined rules
		let  RULES = g.ast.getFirstChildWithType(ANTLRParser.RULES) as GrammarAST;
		let  rules = new  Array<GrammarAST>(RULES.getAllChildrenWithType(ANTLRParser.RULE));
		for (let mode of g.ast.getAllChildrenWithType(ANTLRParser.MODE)) {
			rules.addAll(mode.getAllChildrenWithType(ANTLRParser.RULE));
		}

		let  redefinition = false;
		 let  ruleToAST = new  HashMap<string, RuleAST>();
		for (let r of rules) {
			let  ruleAST = r as RuleAST;
			let  ID = ruleAST.getChild(0) as GrammarAST;
			let  ruleName = ID.getText();
			let  prev = ruleToAST.get(ruleName);
			if ( prev !==null ) {
				let  prevChild = prev.getChild(0) as GrammarAST;
				g.tool.errMgr.grammarError(ErrorType.RULE_REDEFINITION,
										   g.fileName,
										   ID.getToken(),
										   ruleName,
										   prevChild.getToken().getLine());
				redefinition = true;
				continue;
			}
			ruleToAST.put(ruleName, ruleAST);
		}

		// check for undefined rules
		/* class UndefChecker extends GrammarTreeVisitor {
			public boolean badref = false;
			@Override
			public void tokenRef(TerminalAST ref) {
				if ("EOF".equals(ref.getText())) {
					// this is a special predefined reference
					return;
				}

				if ( g.isLexer() ) ruleRef(ref, null);
			}

			@Override
			public void ruleRef(GrammarAST ref, ActionAST arg) {
				RuleAST ruleAST = ruleToAST.get(ref.getText());
				String fileName = ref.getToken().getInputStream().getSourceName();
				if (Character.isUpperCase(currentRuleName.charAt(0)) &&
					Character.isLowerCase(ref.getText().charAt(0)))
				{
					badref = true;
					errMgr.grammarError(ErrorType.PARSER_RULE_REF_IN_LEXER_RULE,
										fileName, ref.getToken(), ref.getText(), currentRuleName);
				}
				else if ( ruleAST==null ) {
					badref = true;
					errMgr.grammarError(ErrorType.UNDEFINED_RULE_REF,
										fileName, ref.token, ref.getText());
				}
			}
			@Override
			public ErrorManager getErrorManager() { return errMgr; }
		} */ 

		let  chk = new  UndefChecker();
		chk.visitGrammar(g.ast);

		return redefinition || chk.badref;
	}

	public  sortGrammarByTokenVocab(fileNames: Array<string>):  Array<GrammarRootAST> {
//		System.out.println(fileNames);
		let  g = new  Graph<string>();
		let  roots = new  Array<GrammarRootAST>();
		for (let fileName of fileNames) {
			let  t = this.parseGrammar(fileName);
			if ( t===null || t instanceof GrammarASTErrorNode) {
 continue;
}
 // came back as error node
			if ( (t as GrammarRootAST).hasErrors ) {
 continue;
}

			let  root = t as GrammarRootAST;
			roots.add(root);
			root.fileName = fileName;
			let  grammarName = root.getChild(0).getText();

			let  tokenVocabNode = Tool.findOptionValueAST(root, "tokenVocab");
			// Make grammars depend on any tokenVocab options
			if ( tokenVocabNode!==null ) {
				let  vocabName = tokenVocabNode.getText();
				// Strip quote characters if any
				let  len = vocabName.length();
				let  firstChar = vocabName.charAt(0);
				let  lastChar = vocabName.charAt(len - 1);
				if (len >= 2 && firstChar === '\'' && lastChar === '\'') {
					vocabName = vocabName.substring(1, len-1);
				}
				// If the name contains a path delimited by forward slashes,
				// use only the part after the last slash as the name
				let  lastSlash = vocabName.lastIndexOf('/');
				if (lastSlash >= 0) {
					vocabName = vocabName.substring(lastSlash + 1);
				}
				g.addEdge(grammarName, vocabName);
			}
			// add cycle to graph so we always process a grammar if no error
			// even if no dependency
			g.addEdge(grammarName, grammarName);
		}

		let  sortedGrammarNames = g.sort();
//		System.out.println("sortedGrammarNames="+sortedGrammarNames);

		let  sortedRoots = new  Array<GrammarRootAST>();
		for (let grammarName of sortedGrammarNames) {
			for (let root of roots) {
				if ( root.getGrammarName().equals(grammarName) ) {
					sortedRoots.add(root);
					break;
				}
			}
		}

		return sortedRoots;
	}


	/** Given the raw AST of a grammar, create a grammar object
		associated with the AST. Once we have the grammar object, ensure
		that all nodes in tree referred to this grammar. Later, we will
		use it for error handling and generally knowing from where a rule
		comes from.
	 */
	public  createGrammar(ast: GrammarRootAST):  Grammar {
		 let  g: Grammar;
		if ( ast.grammarType===ANTLRParser.LEXER ) {
 g = new  LexerGrammar(this, ast);
}

		else {
 g = new  Grammar(this, ast);
}


		// ensure each node has pointer to surrounding grammar
		GrammarTransformPipeline.setGrammarPtr(g, ast);
		return g;
	}

	public  parseGrammar(fileName: string):  GrammarRootAST {
		try {
			let  file = new  File(fileName);
			if (!file.isAbsolute()) {
				file = new  File(this.inputDirectory, fileName);
			}

			let  in = new  ANTLRFileStream(file.getAbsolutePath(), this.grammarEncoding);
			let  t = this.parse(fileName, in);
			return t;
		} catch (ioe) {
if (ioe instanceof IOException) {
			this.errMgr.toolError(ErrorType.CANNOT_OPEN_FILE, ioe, fileName);
		} else {
	throw ioe;
	}
}
		return null;
	}

	/** Convenience method to load and process an ANTLR grammar. Useful
	 *  when creating interpreters.  If you need to access to the lexer
	 *  grammar created while processing a combined grammar, use
	 *  getImplicitLexer() on returned grammar.
	 */
	public  loadGrammar(fileName: string):  Grammar {
		let  grammarRootAST = this.parseGrammar(fileName);
		 let  g = this.createGrammar(grammarRootAST);
		g.fileName = fileName;
		this.process(g, false);
		return g;
	}

	/**
	 * Try current dir then dir of g then lib dir
	 * @param g
	 * @param nameNode The node associated with the imported grammar name.
	 */
	public  loadImportedGrammar(g: Grammar, nameNode: GrammarAST):  Grammar {
		let  name = nameNode.getText();
		let  imported = this.importedGrammars.get(name);
		if (imported === null) {
			g.tool.log("grammar", "load " + name + " from " + g.fileName);
			let  importedFile = null;
			for (let extension of Tool.ALL_GRAMMAR_EXTENSIONS) {
				importedFile = this.getImportedGrammarFile(g, name + extension);
				if (importedFile !== null) {
					break;
				}
			}

			if ( importedFile===null ) {
				this.errMgr.grammarError(ErrorType.CANNOT_FIND_IMPORTED_GRAMMAR, g.fileName, nameNode.getToken(), name);
				return null;
			}

			let  absolutePath = importedFile.getAbsolutePath();
			let  in = new  ANTLRFileStream(absolutePath, this.grammarEncoding);
			let  root = this.parse(g.fileName, in);
			if (root === null) {
				return null;
			}

			imported = this.createGrammar(root);
			imported.fileName = absolutePath;
			this.importedGrammars.put(root.getGrammarName(), imported);
		}

		return imported;
	}

	public  parseGrammarFromString(grammar: string):  GrammarRootAST {
		return this.parse("<string>", new  ANTLRStringStream(grammar));
	}

	public  parse(fileName: string, in: CharStream):  GrammarRootAST {
		try {
			let  adaptor = new  GrammarASTAdaptor(in);
			let  lexer = new  ToolANTLRLexer(in, this);
			let  tokens = new  CommonTokenStream(lexer);
			lexer.tokens = tokens;
			let  p = new  ToolANTLRParser(tokens, this);
			p.setTreeAdaptor(adaptor);
			let  r = p.grammarSpec();
			let  root =  r.getTree() as GrammarAST;
			if (root instanceof GrammarRootAST) {
				( root as GrammarRootAST).hasErrors = lexer.getNumberOfSyntaxErrors() > 0 || p.getNumberOfSyntaxErrors() > 0;
				/* assert ((GrammarRootAST) root).tokenStream == tokens; */ 
				if (this.grammarOptions !== null) {
					( root as GrammarRootAST).cmdLineOptions = this.grammarOptions;
				}
				return ( root as GrammarRootAST);
			}
			return null;
		} catch (re) {
if (re instanceof RecognitionException) {
			// TODO: do we gen errors now?
			java.util.logging.ErrorManager.internalError("can't generate this message at moment; antlr recovers");
		} else {
	throw re;
	}
}
		return null;
	}

	public  generateATNs(g: Grammar):  void {
		let  dotGenerator = new  DOTGenerator(g);
		let  grammars = new  Array<Grammar>();
		grammars.add(g);
		let  imported = g.getAllImportedGrammars();
		if ( imported!==null ) {
 grammars.addAll(imported);
}

		for (let ig of grammars) {
			for (let r of ig.rules.values()) {
				try {
					let  dot = dotGenerator.getDOT(g.atn.ruleToStartState[r.index], g.isLexer());
					if (dot !== null) {
						this.writeDOTFile(g, r, dot);
					}
				} catch (ioe) {
if (ioe instanceof IOException) {
					this.errMgr.toolError(ErrorType.CANNOT_WRITE_FILE, ioe);
				} else {
	throw ioe;
	}
}
			}
		}
	}

	/** This method is used by all code generators to create new output
	 *  files. If the outputDir set by -o is not present it will be created.
	 *  The final filename is sensitive to the output directory and
	 *  the directory where the grammar file was found.  If -o is /tmp
	 *  and the original grammar file was foo/t.g4 then output files
	 *  go in /tmp/foo.
	 *
	 *  The output dir -o spec takes precedence if it's absolute.
	 *  E.g., if the grammar file dir is absolute the output dir is given
	 *  precedence. "-o /tmp /usr/lib/t.g4" results in "/tmp/T.java" as
	 *  output (assuming t.g4 holds T.java).
	 *
	 *  If no -o is specified, then just write to the directory where the
	 *  grammar file was found.
	 *
	 *  If outputDirectory==null then write a String.
	 */
	public  getOutputFileWriter(g: Grammar, fileName: string):  Writer {
		if (this.outputDirectory === null) {
			return new  StringWriter();
		}
		// output directory is a function of where the grammar file lives
		// for subdir/T.g4, you get subdir here.  Well, depends on -o etc...
		let  outputDir = this.getOutputDirectory(g.fileName);
		let  outputFile = new  File(outputDir, fileName);

		if (!outputDir.exists()) {
			outputDir.mkdirs();
		}
		let  fos = new  FileOutputStream(outputFile);
		let  osw: OutputStreamWriter;
		if ( this.grammarEncoding!==null ) {
			osw = new  OutputStreamWriter(fos, this.grammarEncoding);
		}
		else {
			osw = new  OutputStreamWriter(fos);
		}
		return new  BufferedWriter(osw);
	}

	public  getImportedGrammarFile(g: Grammar, fileName: string):  File {
		let  importedFile = new  File(this.inputDirectory, fileName);
		if ( !importedFile.exists() ) {
			let  gfile = new  File(g.fileName);
			let  parentDir = gfile.getParent();
			importedFile = new  File(parentDir, fileName);
			if ( !importedFile.exists() ) { // try in lib dir
				importedFile = new  File(this.libDirectory, fileName);
				if ( !importedFile.exists() ) {
					return null;
				}
			}
		}
		return importedFile;
	}

	/**
	 * Return the location where ANTLR will generate output files for a given
	 * file. This is a base directory and output files will be relative to
	 * here in some cases such as when -o option is used and input files are
	 * given relative to the input directory.
	 *
	 * @param fileNameWithPath path to input source
	 */
	public  getOutputDirectory(fileNameWithPath: string):  File {
		if ( this.exact_output_dir ) {
			return this.new_getOutputDirectory(fileNameWithPath);
		}

		let  outputDir: File;
		let  fileDirectory: string;

		// Some files are given to us without a PATH but should should
		// still be written to the output directory in the relative path of
		// the output directory. The file directory is either the set of sub directories
		// or just or the relative path recorded for the parent grammar. This means
		// that when we write the tokens files, or the .java files for imported grammars
		// taht we will write them in the correct place.
		if ((fileNameWithPath === null) || (fileNameWithPath.lastIndexOf(File.separatorChar) === -1)) {
			// No path is included in the file name, so make the file
			// directory the same as the parent grammar (which might sitll be just ""
			// but when it is not, we will write the file in the correct place.
			fileDirectory = ".";

		}
		else {
			fileDirectory = fileNameWithPath.substring(0, fileNameWithPath.lastIndexOf(File.separatorChar));
		}
		if ( this.haveOutputDir ) {
			// -o /tmp /var/lib/t.g4 => /tmp/T.java
			// -o subdir/output /usr/lib/t.g4 => subdir/output/T.java
			// -o . /usr/lib/t.g4 => ./T.java
			if (fileDirectory !== null &&
				(new  File(fileDirectory).isAbsolute() ||
					fileDirectory.startsWith("~"))) { // isAbsolute doesn't count this :(
				// somebody set the dir, it takes precendence; write new file there
				outputDir = new  File(this.outputDirectory);
			}
			else {
				// -o /tmp subdir/t.g4 => /tmp/subdir/T.java
				if (fileDirectory !== null) {
					outputDir = new  File(this.outputDirectory, fileDirectory);
				}
				else {
					outputDir = new  File(this.outputDirectory);
				}
			}
		}
		else {
			// they didn't specify a -o dir so just write to location
			// where grammar is, absolute or relative, this will only happen
			// with command line invocation as build tools will always
			// supply an output directory.
			outputDir = new  File(fileDirectory);
		}
		return outputDir;
	}

	/** @since 4.7.1 in response to -Xexact-output-dir */
	public  new_getOutputDirectory(fileNameWithPath: string):  File {
		let  outputDir: File;
		let  fileDirectory: string;

		if (fileNameWithPath.lastIndexOf(File.separatorChar) === -1) {
			// No path is included in the file name, so make the file
			// directory the same as the parent grammar (which might still be just ""
			// but when it is not, we will write the file in the correct place.
			fileDirectory = ".";
		}
		else {
			fileDirectory = fileNameWithPath.substring(0, fileNameWithPath.lastIndexOf(File.separatorChar));
		}
		if ( this.haveOutputDir ) {
			// -o /tmp /var/lib/t.g4 => /tmp/T.java
			// -o subdir/output /usr/lib/t.g4 => subdir/output/T.java
			// -o . /usr/lib/t.g4 => ./T.java
			// -o /tmp subdir/t.g4 => /tmp/T.java
			outputDir = new  File(this.outputDirectory);
		}
		else {
			// they didn't specify a -o dir so just write to location
			// where grammar is, absolute or relative, this will only happen
			// with command line invocation as build tools will always
			// supply an output directory.
			outputDir = new  File(fileDirectory);
		}
		return outputDir;
	}

	public  help():  void {
		this.info("ANTLR Parser Generator  Version " + Tool.VERSION);
		for (let o of Tool.optionDefs) {
			let  name = o.name + (o.argType!==Tool.OptionArgType.NONE? " ___" : "");
			let  s = string.format(" %-19s %s", name, o.description);
			this.info(s);
		}
	}
    public  log(msg: string):  void;

    public  log(component: string, msg: string):  void;
public log(...args: unknown[]):  void {
		switch (args.length) {
			case 1: {
				const [msg] = args as [string];

 this.log(null, msg); 

				break;
			}

			case 2: {
				const [component, msg] = args as [string, string];

 this.logMgr.log(component, msg); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  getNumErrors():  number { return this.errMgr.getNumErrors(); }

	public  addListener(tl: ANTLRToolListener):  void {
		if ( tl!==null ) {
 this.listeners.add(tl);
}

	}
	public  removeListener(tl: ANTLRToolListener):  void { this.listeners.remove(tl); }
	public  removeListeners():  void { this.listeners.clear(); }
	public  getListeners():  Array<ANTLRToolListener> { return this.listeners; }

	public  info(msg: string):  void {
		if ( this.listeners.isEmpty() ) {
			this.defaultListener.info(msg);
			return;
		}
		for (let l of this.listeners) {
 l.info(msg);
}

	}
	public  error(msg: ANTLRMessage):  void {
		if ( this.listeners.isEmpty() ) {
			this.defaultListener.error(msg);
			return;
		}
		for (let l of this.listeners) {
 l.error(msg);
}

	}
	public  warning(msg: ANTLRMessage):  void {
		if ( this.listeners.isEmpty() ) {
			this.defaultListener.warning(msg);
		}
		else {
			for (let l of this.listeners) {
 l.warning(msg);
}

		}

		if (this.warnings_are_errors) {
			this.errMgr.emit(ErrorType.WARNING_TREATED_AS_ERROR, new  ANTLRMessage(ErrorType.WARNING_TREATED_AS_ERROR));
		}
	}

	public  version():  void {
		this.info("ANTLR Parser Generator  Version " + Tool.VERSION);
	}

	public  exit(e: number):  void { System.exit(e); }

	public  panic():  void { throw new  Error("ANTLR panic"); }

	protected  handleArgs():  void {
		let  i=0;
		while ( this.args!==null && i<this.args.length ) {
			let  arg = this.args[i];
			i++;
			if ( arg.startsWith("-D") ) { // -Dlanguage=Java syntax
				this.handleOptionSetArg(arg);
				continue;
			}
			if ( arg.charAt(0)!=='-' ) { // file name
				if ( !this.grammarFiles.contains(arg) ) {
 this.grammarFiles.add(arg);
}

				continue;
			}
			let  found = false;
			for (let o of Tool.optionDefs) {
				if ( arg.equals(o.name) ) {
					found = true;
					let  argValue = null;
					if ( o.argType===Tool.OptionArgType.STRING ) {
						argValue = this.args[i];
						i++;
					}
					// use reflection to set field
					let  c = this.getClass();
					try {
						let  f = c.getField(o.fieldName);
						if ( argValue===null ) {
							if ( arg.startsWith("-no-") ) {
 f.setBoolean(this, false);
}

							else {
 f.setBoolean(this, true);
}

						}
						else {
 f.set(this, argValue);
}

					} catch (e) {
if (e instanceof Exception) {
						this.errMgr.toolError(ErrorType.INTERNAL_ERROR, "can't access field "+o.fieldName);
					} else {
	throw e;
	}
}
				}
			}
			if ( !found ) {
				this.errMgr.toolError(ErrorType.INVALID_CMDLINE_ARG, arg);
			}
		}
		if ( this.outputDirectory!==null ) {
			if (this.outputDirectory.endsWith("/") ||
				this.outputDirectory.endsWith("\\")) {
				this.outputDirectory =
					this.outputDirectory.substring(0, this.outputDirectory.length() - 1);
			}
			let  outDir = new  File(this.outputDirectory);
			this.haveOutputDir = true;
			if (outDir.exists() && !outDir.isDirectory()) {
				this.errMgr.toolError(ErrorType.OUTPUT_DIR_IS_FILE, this.outputDirectory);
				this.outputDirectory = ".";
			}
		}
		else {
			this.outputDirectory = ".";
		}
		if ( this.libDirectory!==null ) {
			if (this.libDirectory.endsWith("/") ||
				this.libDirectory.endsWith("\\")) {
				this.libDirectory = this.libDirectory.substring(0, this.libDirectory.length() - 1);
			}
			let  outDir = new  File(this.libDirectory);
			if (!outDir.exists()) {
				this.errMgr.toolError(ErrorType.DIR_NOT_FOUND, this.libDirectory);
				this.libDirectory = ".";
			}
		}
		else {
			this.libDirectory = ".";
		}
		if ( this.launch_ST_inspector ) {
			STGroup.trackCreationEvents = true;
			this.return_dont_exit = true;
		}
	}

	protected  handleOptionSetArg(arg: string):  void {
		let  eq = arg.indexOf('=');
		if ( eq>0 && arg.length()>3 ) {
			let  option = arg.substring("-D".length(), eq);
			let  value = arg.substring(eq+1);
			if ( value.length()===0 ) {
				this.errMgr.toolError(ErrorType.BAD_OPTION_SET_SYNTAX, arg);
				return;
			}
			if ( Grammar.parserOptions.contains(option) ||
				 Grammar.lexerOptions.contains(option) )
			{
				if ( this.grammarOptions===null ) {
 this.grammarOptions = new  HashMap<string, string>();
}

				this.grammarOptions.put(option, value);
			}
			else {
				this.errMgr.grammarError(ErrorType.ILLEGAL_OPTION,
									null,
									null,
									option);
			}
		}
		else {
			this.errMgr.toolError(ErrorType.BAD_OPTION_SET_SYNTAX, arg);
		}
	}

	protected  writeDOTFile(g: Grammar, r: Rule, dot: string):  void;

	protected  writeDOTFile(g: Grammar, name: string, dot: string):  void;
protected writeDOTFile(...args: unknown[]):  void {
		switch (args.length) {
			case 3: {
				const [g, r, dot] = args as [Grammar, Rule, string];


		this.writeDOTFile(g, r.g.name + "." + r.name, dot);
	

				break;
			}

			case 3: {
				const [g, name, dot] = args as [Grammar, string, string];


		let  fw = this.getOutputFileWriter(g, name + ".dot");
		try {
			fw.write(dot);
		}
		finally {
			fw.close();
		}
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}

	 static {
		// Assigned in a static{} block to prevent the field from becoming a
		// compile-time constant
		Tool.VERSION = RuntimeMetaData.VERSION;
	}

	public static  OptionArgType =  class OptionArgType extends Enum<OptionArgType> { public static readonly NONE: OptionArgType = new class extends OptionArgType {
}(S`NONE`, 0); public static readonly STRING: OptionArgType = new class extends OptionArgType {
}(S`STRING`, 1) };


}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Tool {
	export type OptionArgType = InstanceType<typeof Tool.OptionArgType>;
	export type Option = InstanceType<typeof Tool.Option>;
}


