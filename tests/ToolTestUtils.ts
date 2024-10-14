/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ANTLRInputStream, Lexer, Token, PredictionMode, LexerATNSimulator, ATNSerializer, ATNDeserializer, ATN, IntegerList } from "antlr4ng";



export  class ToolTestUtils {
	public static  execLexer(grammarFileName: string, grammarStr: string, lexerName: string, input: string):  ExecutedState;

	public static  execLexer(grammarFileName: string, grammarStr: string, lexerName: string, input: string,
									  tempDir: Path, saveTestDir: boolean):  ExecutedState;
public static execLexer(...args: unknown[]):  ExecutedState {
		switch (args.length) {
			case 4: {
				const [grammarFileName, grammarStr, lexerName, input] = args as [string, string, string, string];


		return ToolTestUtils.execLexer(grammarFileName, grammarStr, lexerName, input, null, false);
	

				break;
			}

			case 6: {
				const [grammarFileName, grammarStr, lexerName, input, tempDir, saveTestDir] = args as [string, string, string, string, Path, boolean];


		return ToolTestUtils.execRecognizer(grammarFileName, grammarStr, null, lexerName,
				null, input, false, tempDir, saveTestDir);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public static  execParser(grammarFileName: string, grammarStr: string,
									   parserName: string, lexerName: string, startRuleName: string,
									   input: string, showDiagnosticErrors: boolean
	):  ExecutedState;

	public static  execParser(grammarFileName: string, grammarStr: string,
									parserName: string, lexerName: string, startRuleName: string,
									input: string, showDiagnosticErrors: boolean, workingDir: Path
	):  ExecutedState;
public static execParser(...args: unknown[]):  ExecutedState {
		switch (args.length) {
			case 7: {
				const [grammarFileName, grammarStr, parserName, lexerName, startRuleName, input, showDiagnosticErrors] = args as [string, string, string, string, string, string, boolean];


		return ToolTestUtils.execParser(grammarFileName, grammarStr, parserName, lexerName, startRuleName,
				input, showDiagnosticErrors, null);
	

				break;
			}

			case 8: {
				const [grammarFileName, grammarStr, parserName, lexerName, startRuleName, input, showDiagnosticErrors, workingDir] = args as [string, string, string, string, string, string, boolean, Path];


		return ToolTestUtils.execRecognizer(grammarFileName, grammarStr, parserName, lexerName,
				startRuleName, input, showDiagnosticErrors, workingDir, false);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public static  createOptionsForJavaToolTests(
			grammarFileName: string, grammarStr: string, parserName: string, lexerName: string,
			useListener: boolean, useVisitor: boolean, startRuleName: string,
			input: string, profile: boolean, showDiagnosticErrors: boolean,
			endStage: Stage
	):  RunOptions {
		return new  RunOptions(grammarFileName, grammarStr, parserName, lexerName, useListener, useVisitor, startRuleName,
				input, profile, showDiagnosticErrors, false, false, endStage, "Java",
				JavaRunner.runtimeTestParserName, PredictionMode.LL, true);
	}

	public static  testErrors(pairs: string[], printTree: boolean):  void {
		for (let  i = 0; i < pairs.length; i += 2) {
			let  grammarStr = pairs[i];
			let  expect = pairs[i + 1];

			let  lines = grammarStr.split("\n");
			let  fileName = ToolTestUtils.getFilenameFromFirstLineOfGrammar(lines[0]);

			let  tempDirName = "AntlrTestErrors-" + Thread.currentThread().getName() + "-" + System.currentTimeMillis();
			let  tempTestDir = Paths.get(TempDirectory, tempDirName).toString();

			try {
				let  equeue = antlrOnString(tempTestDir, null, fileName, grammarStr, false);

				let  actual = equeue.toString(true);
				actual = actual.replace(tempTestDir + File.separator, "");
				let  msg = grammarStr;
				msg = msg.replace("\n", "\\n");
				msg = msg.replace("\r", "\\r");
				msg = msg.replace("\t", "\\t");

				assertEquals(expect, actual, "error in: " + msg);
			}
			finally {
				try {
					java.nio.file.SecureDirectoryStream.deleteDirectory(new  File(tempTestDir));
				} catch (ignored) {
if (ignored instanceof IOException) {
				} else {
	throw ignored;
	}
}
			}
		}
	}

	public static  getFilenameFromFirstLineOfGrammar(line: string):  string {
		let  fileName = "A" + Tool.GRAMMAR_EXTENSION;
		let  grIndex = line.lastIndexOf("grammar");
		let  semi = line.lastIndexOf(';');
		if ( grIndex>=0 && semi>=0 ) {
			let  space = line.indexOf(' ', grIndex);
			fileName = line.substring(space+1, semi)+Tool.GRAMMAR_EXTENSION;
		}
		if ( fileName.length()===Tool.GRAMMAR_EXTENSION.length() ) {
 fileName = "A" + Tool.GRAMMAR_EXTENSION;
}

		return fileName;
	}

	public static  realElements(elements: Array<string>):  Array<string> {
		return elements.subList(Token.MIN_USER_TOKEN_TYPE, elements.size());
	}

	public static  load(fileName: string):  string {
		if ( fileName===null ) {
			return null;
		}

		let  fullFileName = ToolTestUtils.class.getPackage().getName().replace('.', '/')+'/'+fileName;
		let  size = 65000;
		let  fis = ToolTestUtils.class.getClassLoader().getResourceAsStream(fullFileName);
		 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const isr: InputStreamReader  = new  InputStreamReader(fis)
try {
	try  {
			let  data = new  Uint16Array(size);
			let  n = isr.read(data);
			return new  string(data, 0, n);
		}
	finally {
	error = closeResources([isr]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	public static  createATN(g: Grammar, useSerializer: boolean):  ATN {
		if ( g.atn===null ) {
			ToolTestUtils.semanticProcess(g);
			assertEquals(0, g.tool.getNumErrors());

			let  f = g.isLexer() ? new  LexerATNFactory( g as LexerGrammar) : new  ParserATNFactory(g);

			g.atn = f.createATN();
			assertEquals(0, g.tool.getNumErrors());
		}

		let  atn = g.atn;
		if ( useSerializer ) {
			// sets some flags in ATN
			let  serialized = ATNSerializer.getSerialized(atn);
			return new  ATNDeserializer().deserialize(serialized.toArray());
		}

		return atn;
	}

	public static  semanticProcess(g: Grammar):  void {
		if ( g.ast!==null && !g.ast.hasErrors ) {
//			System.out.println(g.ast.toStringTree());
			let  antlr = new  Tool();
			let  sem = new  SemanticPipeline(g);
			sem.process();
			if ( g.getImportedGrammars()!==null ) { // process imported grammars (if any)
				for (let imp of g.getImportedGrammars()) {
					antlr.processNonCombinedGrammar(imp, false);
				}
			}
		}
	}

	public static  getTokenTypesViaATN(input: string, lexerATN: LexerATNSimulator):  IntegerList {
		let  in = new  ANTLRInputStream(input);
		let  tokenTypes = new  IntegerList();
		let  ttype: number;
		do {
			ttype = lexerATN.match(in, Lexer.DEFAULT_MODE);
			tokenTypes.add(ttype);
		} while ( ttype!== Token.EOF );
		return tokenTypes;
	}

	private static  execRecognizer(grammarFileName: string, grammarStr: string,
										 parserName: string, lexerName: string, startRuleName: string,
										 input: string, showDiagnosticErrors: boolean,
										 workingDir: Path, saveTestDir: boolean):  ExecutedState {
		let  runOptions = ToolTestUtils.createOptionsForJavaToolTests(grammarFileName, grammarStr, parserName, lexerName,
				false, true, startRuleName, input,
				false, showDiagnosticErrors, Stage.Execute);
		 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const runner: JavaRunner  = new  JavaRunner(workingDir, saveTestDir)
try {
	try  {
			let  result = runner.run(runOptions);
			if (!(result instanceof ExecutedState)) {
				fail(result.getErrorMessage());
			}
			return   result as ExecutedState;
		}
	finally {
	error = closeResources([runner]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}
}
