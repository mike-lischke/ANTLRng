/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { LinkedHashMap as HashMap } from "antlr4ng";



export  class TestCompositeGrammars {
	protected  debug = false;

	public static  sort <K extends Comparable< K>,V>(data: Map<K,V>):  LinkedHashMap<K,V> {
		let  dup = new  LinkedHashMap<K, V>();
		let  keys = new  Array<K>(data.keySet());
		java.util.Collections.sort(keys);
		for (let k of keys) {
			dup.put(k, data.get(k));
		}
		return dup;
	}

	private static  checkGrammarSemanticsWarning(equeue: ErrorQueue, expectedMessage: GrammarSemanticsMessage):  void {
		let  foundMsg = null;
		for (let  i = 0; i < equeue.warnings.size(); i++) {
			let  m = equeue.warnings.get(i);
			if (m.getErrorType()===expectedMessage.getErrorType() ) {
				foundMsg = m;
			}
		}
		assertNotNull(foundMsg, "no error; "+expectedMessage.getErrorType()+" expected");
		assertTrue(foundMsg instanceof GrammarSemanticsMessage, "error is not a GrammarSemanticsMessage");
		assertEquals(java.util.Arrays.toString(expectedMessage.getArgs()), java.util.Arrays.toString(foundMsg.getArgs()));
		if ( equeue.size()!==1 ) {
			System.err.println(equeue);
		}
	}

	private static  compile(grammarFileName: string, grammarStr: string, parserName: string, startRuleName: string,
							tempDirPath: Path
	):  boolean {
		let  runOptions = createOptionsForJavaToolTests(grammarFileName, grammarStr, parserName, null,
				false, false, startRuleName, null,
				false, false, Stage.Compile);
		 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const runner: JavaRunner  = new  JavaRunner(tempDirPath, false)
try {
	try  {
			let  compiledState =  runner.run(runOptions) as JavaCompiledState;
			return !compiledState.containsErrors();
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

	@Test
public  testImportFileLocationInSubdir(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  slave =
			"parser grammar S;\n" +
			"a : B {System.out.println(\"S.a\");} ;\n";
		FileUtils.mkdir(tempDirPath);
		let  subdir = tempDirPath + PathSeparator + "sub";
		FileUtils.mkdir(subdir);
		writeFile(subdir, "S.g4", slave);
		let  master =
			"grammar M;\n" +
			"import S;\n" +
			"s : a ;\n" +
			"B : 'b' ;" + // defines B from inherited token space
			"WS : (' '|'\\n') -> skip ;\n" ;
		writeFile(tempDirPath, "M.g4", master);
		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", subdir);
		assertEquals(0, equeue.size());
	}

	// Test for https://github.com/antlr/antlr4/issues/1317
	@Test
public  testImportSelfLoop(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		FileUtils.mkdir(tempDirPath);
		let  master =
			"grammar M;\n" +
			"import M;\n" +
			"s : 'a' ;\n";
		writeFile(tempDirPath, "M.g4", master);
		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", tempDirPath);
		assertEquals(0, equeue.size());
	}

	@Test
public  testImportIntoLexerGrammar(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		FileUtils.mkdir(tempDirPath);

		let  master =
			"lexer grammar M;\n" +
			"import S;\n" +
			"A : 'a';\n" +
			"B : 'b';\n";
		writeFile(tempDirPath, "M.g4", master);

		let  slave =
		    "lexer grammar S;\n" +
			"C : 'c';\n";
		writeFile(tempDirPath, "S.g4", slave);

		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", tempDirPath);
		assertEquals(0, equeue.errors.size());
	}

	@Test
public  testImportModesIntoLexerGrammar(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		FileUtils.mkdir(tempDirPath);

		let  master =
			"lexer grammar M;\n" +
			"import S;\n" +
			"A : 'a' -> pushMode(X);\n" +
			"B : 'b';\n";
		writeFile(tempDirPath, "M.g4", master);

		let  slave =
			"lexer grammar S;\n" +
			"D : 'd';\n" +
			"mode X;\n" +
			"C : 'c' -> popMode;\n";
		writeFile(tempDirPath, "S.g4", slave);

		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", tempDirPath);
		assertEquals(0, equeue.errors.size());
	}

	@Test
public  testImportChannelsIntoLexerGrammar(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		FileUtils.mkdir(tempDirPath);

		let  master =
			"lexer grammar M;\n" +
			"import S;\n" +
			"channels {CH_A, CH_B}\n" +
			"A : 'a' -> channel(CH_A);\n" +
			"B : 'b' -> channel(CH_B);\n";
		writeFile(tempDirPath, "M.g4", master);

		let  slave =
			"lexer grammar S;\n" +
			"C : 'c';\n";
		writeFile(tempDirPath, "S.g4", slave);

		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", tempDirPath);
		assertEquals(0, equeue.errors.size());
	}

	@Test
public  testImportMixedChannelsIntoLexerGrammar(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		FileUtils.mkdir(tempDirPath);

		let  master =
			"lexer grammar M;\n" +
			"import S;\n" +
			"channels {CH_A, CH_B}\n" +
			"A : 'a' -> channel(CH_A);\n" +
			"B : 'b' -> channel(CH_B);\n";
		writeFile(tempDirPath, "M.g4", master);

		let  slave =
			"lexer grammar S;\n" +
			"channels {CH_C}\n" +
			"C : 'c' -> channel(CH_C);\n";
		writeFile(tempDirPath, "S.g4", slave);

		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", tempDirPath);
		assertEquals(0, equeue.errors.size());
	}

	@Test
public  testImportClashingChannelsIntoLexerGrammar(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		FileUtils.mkdir(tempDirPath);

		let  master =
			"lexer grammar M;\n" +
			"import S;\n" +
			"channels {CH_A, CH_B, CH_C}\n" +
			"A : 'a' -> channel(CH_A);\n" +
			"B : 'b' -> channel(CH_B);\n" +
			"C : 'C' -> channel(CH_C);\n";
		writeFile(tempDirPath, "M.g4", master);

		let  slave =
			"lexer grammar S;\n" +
			"channels {CH_C}\n" +
			"C : 'c' -> channel(CH_C);\n";
		writeFile(tempDirPath, "S.g4", slave);

		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", tempDirPath);
		assertEquals(0, equeue.errors.size());
	}

	@Test
public  testMergeModesIntoLexerGrammar(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		FileUtils.mkdir(tempDirPath);

		let  master =
			"lexer grammar M;\n" +
			"import S;\n" +
			"A : 'a' -> pushMode(X);\n" +
			"mode X;\n" +
			"B : 'b';\n";
		writeFile(tempDirPath, "M.g4", master);

		let  slave =
			"lexer grammar S;\n" +
			"D : 'd';\n" +
			"mode X;\n" +
			"C : 'c' -> popMode;\n";
		writeFile(tempDirPath, "S.g4", slave);

		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", tempDirPath);
		assertEquals(0, equeue.errors.size());
	}

	@Test
public  testEmptyModesInLexerGrammar(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		FileUtils.mkdir(tempDirPath);

		let  master =
			"lexer grammar M;\n" +
			"import S;\n" +
			"A : 'a';\n" +
			"C : 'e';\n" +
			"B : 'b';\n";
		writeFile(tempDirPath, "M.g4", master);

		let  slave =
			"lexer grammar S;\n" +
			"D : 'd';\n" +
			"mode X;\n" +
			"C : 'c' -> popMode;\n";
		writeFile(tempDirPath, "S.g4", slave);

		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", tempDirPath);
		assertEquals(0, equeue.errors.size());
	}

	@Test
public  testCombinedGrammarImportsModalLexerGrammar(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		FileUtils.mkdir(tempDirPath);

		let  master =
			"grammar M;\n" +
			"import S;\n" +
			"A : 'a';\n" +
			"B : 'b';\n" +
			"r : A B;\n";
		writeFile(tempDirPath, "M.g4", master);

		let  slave =
			"lexer grammar S;\n" +
			"D : 'd';\n" +
			"mode X;\n" +
			"C : 'c' -> popMode;\n";
		writeFile(tempDirPath, "S.g4", slave);

		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", tempDirPath);
		assertEquals(1, equeue.errors.size());
		let  msg = equeue.errors.get(0);
		assertEquals(ErrorType.MODE_NOT_IN_LEXER, msg.getErrorType());
		assertEquals("X", msg.getArgs()[0]);
		assertEquals(3, msg.line);
		assertEquals(5, msg.charPosition);
		assertEquals("M.g4", new  File(msg.fileName).getName());
	}

	@Test
public  testDelegatesSeeSameTokenType(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  slaveS =
			"parser grammar S;\n"+
			"tokens { A, B, C }\n"+
			"x : A ;\n";
		let  slaveT =
			"parser grammar T;\n"+
			"tokens { C, B, A } // reverse order\n"+
			"y : A ;\n";

		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "S.g4", slaveS);
		writeFile(tempDirPath, "T.g4", slaveT);

		let  master =
			"// The lexer will create rules to match letters a, b, c.\n"+
			"// The associated token types A, B, C must have the same value\n"+
			"// and all import'd parsers.  Since ANTLR regenerates all imports\n"+
			"// for use with the delegator M, it can generate the same token type\n"+
			"// mapping in each parser:\n"+
			"// public static final int C=6;\n"+
			"// public static final int EOF=-1;\n"+
			"// public static final int B=5;\n"+
			"// public static final int WS=7;\n"+
			"// public static final int A=4;\n"+
			"grammar M;\n"+
			"import S,T;\n"+
			"s : x y ; // matches AA, which should be 'aa'\n"+
			"B : 'b' ; // another order: B, A, C\n"+
			"A : 'a' ;\n"+
			"C : 'c' ;\n"+
			"WS : (' '|'\\n') -> skip ;\n";
		writeFile(tempDirPath, "M.g4", master);
		let  equeue = new  ErrorQueue();
		let  g = new  Grammar(tempDirPath+"/M.g4", master, equeue);
		let  expectedTokenIDToTypeMap = "{EOF=-1, B=1, A=2, C=3, WS=4}";
		let  expectedStringLiteralToTypeMap = "{'a'=2, 'b'=1, 'c'=3}";
		let  expectedTypeToTokenList = "[B, A, C, WS]";
		assertEquals(expectedTokenIDToTypeMap, g.tokenNameToTypeMap.toString());
		assertEquals(expectedStringLiteralToTypeMap, TestCompositeGrammars.sort(g.stringLiteralToTypeMap).toString());
		assertEquals(expectedTypeToTokenList, realElements(g.typeToTokenList).toString());
		assertEquals(0, equeue.errors.size(), "unexpected errors: "+equeue);
	}

	@Test
public  testErrorInImportedGetsRightFilename(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  slave =
			"parser grammar S;\n" +
			"a : 'a' | c;\n";
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "S.g4", slave);
		let  master =
			"grammar M;\n" +
			"import S;\n";
		writeFile(tempDirPath, "M.g4", master);
		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-lib", tempDirPath);
		let  msg = equeue.errors.get(0);
		assertEquals(ErrorType.UNDEFINED_RULE_REF, msg.getErrorType());
		assertEquals("c", msg.getArgs()[0]);
		assertEquals(2, msg.line);
		assertEquals(10, msg.charPosition);
		assertEquals("S.g4", new  File(msg.fileName).getName());
	}

	@Test
public  testImportFileNotSearchedForInOutputDir(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  slave =
			"parser grammar S;\n" +
			"a : B {System.out.println(\"S.a\");} ;\n";
		FileUtils.mkdir(tempDirPath);
		let  outdir = tempDirPath + "/out";
		FileUtils.mkdir(outdir);
		writeFile(outdir, "S.g4", slave);
		let  master =
			"grammar M;\n" +
			"import S;\n" +
			"s : a ;\n" +
			"B : 'b' ;" + // defines B from inherited token space
			"WS : (' '|'\\n') -> skip ;\n" ;
		writeFile(tempDirPath, "M.g4", master);
		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-o", outdir);
		assertEquals(ErrorType.CANNOT_FIND_IMPORTED_GRAMMAR, equeue.errors.get(0).getErrorType());
	}

	@Test
public  testOutputDirShouldNotEffectImports(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  slave =
			"parser grammar S;\n" +
			"a : B {System.out.println(\"S.a\");} ;\n";
		FileUtils.mkdir(tempDirPath);
		let  subdir = tempDirPath + "/sub";
		FileUtils.mkdir(subdir);
		writeFile(subdir, "S.g4", slave);
		let  master =
			"grammar M;\n" +
			"import S;\n" +
			"s : a ;\n" +
			"B : 'b' ;" + // defines B from inherited token space
			"WS : (' '|'\\n') -> skip ;\n" ;
		writeFile(tempDirPath, "M.g4", master);
		let  outdir = tempDirPath + "/out";
		FileUtils.mkdir(outdir);
		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", false, "-o", outdir, "-lib", subdir);
		assertEquals(0, equeue.size());
	}

	@Test
public  testTokensFileInOutputDirAndImportFileInSubdir(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  slave =
			"parser grammar S;\n" +
			"a : B {System.out.println(\"S.a\");} ;\n";
		FileUtils.mkdir(tempDirPath);
		let  subdir = tempDirPath + "/sub";
		FileUtils.mkdir(subdir);
		writeFile(subdir, "S.g4", slave);
		let  parser =
			"parser grammar MParser;\n" +
			"import S;\n" +
			"options {tokenVocab=MLexer;}\n" +
			"s : a ;\n";
		writeFile(tempDirPath, "MParser.g4", parser);
		let  lexer =
			"lexer grammar MLexer;\n" +
			"B : 'b' ;" + // defines B from inherited token space
			"WS : (' '|'\\n') -> skip ;\n" ;
		writeFile(tempDirPath, "MLexer.g4", lexer);
		let  outdir = tempDirPath + "/out";
		FileUtils.mkdir(outdir);
		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "MLexer.g4", false, "-o", outdir);
		assertEquals(0, equeue.size());
		equeue = Generator.antlrOnString(tempDirPath, "Java", "MParser.g4", false, "-o", outdir, "-lib", subdir);
		assertEquals(0, equeue.size());
	}

	@Test
public  testImportedTokenVocabIgnoredWithWarning(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  equeue = new  ErrorQueue();
		let  slave =
			"parser grammar S;\n" +
			"options {tokenVocab=whatever;}\n" +
			"tokens { A }\n" +
			"x : A {System.out.println(\"S.x\");} ;\n";
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "S.g4", slave);

		let  master =
			"grammar M;\n" +
			"import S;\n" +
			"s : x ;\n" +
			"WS : (' '|'\\n') -> skip ;\n" ;
		writeFile(tempDirPath, "M.g4", master);
		let  g = new  Grammar(tempDirPath+"/M.g4", master, equeue);

		let  expectedArg = "S";
		let  expectedMsgID = ErrorType.OPTIONS_IN_DELEGATE;
		let  expectedMessage =
			new  GrammarSemanticsMessage(expectedMsgID, g.fileName, null, expectedArg);
		TestCompositeGrammars.checkGrammarSemanticsWarning(equeue, expectedMessage);

		assertEquals(0, equeue.errors.size(), "unexpected errors: "+equeue);
		assertEquals(1, equeue.warnings.size(), "unexpected warnings: "+equeue);
	}

	@Test
public  testSyntaxErrorsInImportsNotThrownOut(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  equeue = new  ErrorQueue();
		let  slave =
			"parser grammar S;\n" +
			"options {toke\n";
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "S.g4", slave);

		let  master =
			"grammar M;\n" +
			"import S;\n" +
			"s : x ;\n" +
			"WS : (' '|'\\n') -> skip ;\n" ;
		writeFile(tempDirPath, "M.g4", master);
		/*Grammar g =*/ new  Grammar(tempDirPath+"/M.g4", master, equeue);

		assertEquals(ErrorType.SYNTAX_ERROR, equeue.errors.get(0).getErrorType());
	}

	// Make sure that M can import S that imports T.
	@Test
public  test3LevelImport(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  equeue = new  ErrorQueue();
		let  slave =
			"parser grammar T;\n" +
			"a : T ;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "T.g4", slave);
		let  slave2 =
			"parser grammar S;\n" +
			"import T;\n" +
			"a : S ;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "S.g4", slave2);

		let  master =
			"grammar M;\n" +
			"import S;\n" +
			"a : M ;\n" ;
		writeFile(tempDirPath, "M.g4", master);
		let  g = new  Grammar(tempDirPath+"/M.g4", master, equeue);

		let  expectedTokenIDToTypeMap = "{EOF=-1, M=1}"; // S and T aren't imported; overridden
		let  expectedStringLiteralToTypeMap = "{}";
		let  expectedTypeToTokenList = "[M]";

		assertEquals(expectedTokenIDToTypeMap,
					 g.tokenNameToTypeMap.toString());
		assertEquals(expectedStringLiteralToTypeMap, g.stringLiteralToTypeMap.toString());
		assertEquals(expectedTypeToTokenList,
					 realElements(g.typeToTokenList).toString());

		assertEquals(0, equeue.errors.size(), "unexpected errors: "+equeue);
		assertTrue(TestCompositeGrammars.compile("M.g4", master, "MParser", "a", tempDir));
	}

	@Test
public  testBigTreeOfImports(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  equeue = new  ErrorQueue();
		let  slave =
			"parser grammar T;\n" +
			"tokens{T}\n" +
			"x : T ;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "T.g4", slave);
		slave =
			"parser grammar S;\n" +
			"import T;\n" +
			"tokens{S}\n" +
			"y : S ;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "S.g4", slave);

		slave =
			"parser grammar C;\n" +
			"tokens{C}\n" +
			"i : C ;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "C.g4", slave);
		slave =
			"parser grammar B;\n" +
			"tokens{B}\n" +
			"j : B ;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "B.g4", slave);
		slave =
			"parser grammar A;\n" +
			"import B,C;\n" +
			"tokens{A}\n" +
			"k : A ;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "A.g4", slave);

		let  master =
			"grammar M;\n" +
			"import S,A;\n" +
			"tokens{M}\n" +
			"a : M ;\n" ;
		writeFile(tempDirPath, "M.g4", master);
		let  g = new  Grammar(tempDirPath+"/M.g4", master, equeue);

		assertEquals("[]", equeue.errors.toString());
		assertEquals("[]", equeue.warnings.toString());
		let  expectedTokenIDToTypeMap = "{EOF=-1, M=1, S=2, T=3, A=4, B=5, C=6}";
		let  expectedStringLiteralToTypeMap = "{}";
		let  expectedTypeToTokenList = "[M, S, T, A, B, C]";

		assertEquals(expectedTokenIDToTypeMap,
					 g.tokenNameToTypeMap.toString());
		assertEquals(expectedStringLiteralToTypeMap, g.stringLiteralToTypeMap.toString());
		assertEquals(expectedTypeToTokenList,
					 realElements(g.typeToTokenList).toString());
		assertTrue(TestCompositeGrammars.compile("M.g4", master, "MParser", "a", tempDir));
	}

	@Test
public  testRulesVisibleThroughMultilevelImport(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  equeue = new  ErrorQueue();
		let  slave =
			"parser grammar T;\n" +
			"x : T ;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "T.g4", slave);
		let  slave2 =
			"parser grammar S;\n" + // A, B, C token type order
			"import T;\n" +
			"a : S ;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "S.g4", slave2);

		let  master =
			"grammar M;\n" +
			"import S;\n" +
			"a : M x ;\n" ; // x MUST BE VISIBLE TO M
		writeFile(tempDirPath, "M.g4", master);
		let  g = new  Grammar(tempDirPath+"/M.g4", master, equeue);

		let  expectedTokenIDToTypeMap = "{EOF=-1, M=1, T=2}";
		let  expectedStringLiteralToTypeMap = "{}";
		let  expectedTypeToTokenList = "[M, T]";

		assertEquals(expectedTokenIDToTypeMap,
					 g.tokenNameToTypeMap.toString());
		assertEquals(expectedStringLiteralToTypeMap, g.stringLiteralToTypeMap.toString());
		assertEquals(expectedTypeToTokenList,
					 realElements(g.typeToTokenList).toString());

		assertEquals(0, equeue.errors.size(), "unexpected errors: "+equeue);
	}

	@Test
public  testNestedComposite(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		// Wasn't compiling. http://www.antlr.org/jira/browse/ANTLR-438
		let  equeue = new  ErrorQueue();
		let  gstr =
			"lexer grammar L;\n" +
			"T1: '1';\n" +
			"T2: '2';\n" +
			"T3: '3';\n" +
			"T4: '4';\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "L.g4", gstr);
		gstr =
			"parser grammar G1;\n" +
			"s: a | b;\n" +
			"a: T1;\n" +
			"b: T2;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "G1.g4", gstr);

		gstr =
			"parser grammar G2;\n" +
			"import G1;\n" +
			"a: T3;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "G2.g4", gstr);
		let  G3str =
			"grammar G3;\n" +
			"import G2;\n" +
			"b: T4;\n" ;
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "G3.g4", G3str);

		let  g = new  Grammar(tempDirPath+"/G3.g4", G3str, equeue);

		let  expectedTokenIDToTypeMap = "{EOF=-1, T4=1, T3=2}";
		let  expectedStringLiteralToTypeMap = "{}";
		let  expectedTypeToTokenList = "[T4, T3]";

		assertEquals(expectedTokenIDToTypeMap,
					 g.tokenNameToTypeMap.toString());
		assertEquals(expectedStringLiteralToTypeMap, g.stringLiteralToTypeMap.toString());
		assertEquals(expectedTypeToTokenList,
					 realElements(g.typeToTokenList).toString());

		assertEquals(0, equeue.errors.size(), "unexpected errors: "+equeue);

		assertTrue(TestCompositeGrammars.compile("G3.g4", G3str, "G3Parser", "b", tempDir));
	}

	@Test
public  testHeadersPropogatedCorrectlyToImportedGrammars(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  slave =
			"parser grammar S;\n" +
			"a : B {System.out.print(\"S.a\");} ;\n";
		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "S.g4", slave);
		let  master =
			"grammar M;\n" +
			"import S;\n" +
			"@header{package mypackage;}\n" +
			"s : a ;\n" +
			"B : 'b' ;" + // defines B from inherited token space
			"WS : (' '|'\\n') -> skip ;\n" ;
		let  equeue = Generator.antlrOnString(tempDirPath, "Java", "M.g4", master, false);
		let  expecting = 0; // should be ok
		assertEquals(expecting, equeue.errors.size());
	}

	/**
	 * This is a regression test for antlr/antlr4#670 "exception when importing
	 * grammar".  I think this one always worked but I found that a different
	 * Java grammar caused an error and so I made the testImportLeftRecursiveGrammar() test below.
	 * https://github.com/antlr/antlr4/issues/670
	 */
	// TODO: migrate to test framework
	@Test
public  testImportLargeGrammar(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  slave = java.lang.Runtime.load("Java.g4");
		let  master =
			"grammar NewJava;\n" +
			"import Java;\n";

		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "Java.g4", slave);
		let  executedState = execParser("NewJava.g4", master,
				"NewJavaParser", "NewJavaLexer", "compilationUnit", "package Foo;",
				this.debug, tempDir);
		assertEquals("", executedState.output);
		assertEquals("", executedState.errors);
	}

	/**
	 * This is a regression test for antlr/antlr4#670 "exception when importing
	 * grammar".
	 * https://github.com/antlr/antlr4/issues/670
	 */
	// TODO: migrate to test framework
	@Test
public  testImportLeftRecursiveGrammar(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  slave =
			"grammar Java;\n" +
			"e : '(' e ')'\n" +
			"  | e '=' e\n" +
			"  | ID\n" +
			"  ;\n" +
			"ID : [a-z]+ ;\n";
		let  master =
			"grammar T;\n" +
			"import Java;\n" +
			"s : e ;\n";

		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "Java.g4", slave);
		let  executedState = execParser(
				"T.g4", master, "TParser", "TLexer", "s", "a=b", this.debug,
				tempDir);
		assertEquals("", executedState.output);
		assertEquals("", executedState.errors);
	}

	// ISSUE: https://github.com/antlr/antlr4/issues/2296
	@Test
public  testCircularGrammarInclusion(/* @TempDir */  tempDir: Path):  void {
		let  tempDirPath = tempDir.toString();
		let  g1 =
				"grammar G1;\n" +
				"import  G2;\n" +
				"r : 'R1';";

		let  g2 =
				"grammar G2;\n" +
				"import  G1;\n" +
				"r : 'R2';";

		FileUtils.mkdir(tempDirPath);
		writeFile(tempDirPath, "G1.g4", g1);
		let  executedState = execParser("G2.g4", g2, "G2Parser", "G2Lexer", "r", "R2", this.debug, tempDir);
		assertEquals("", executedState.errors);
	}
}
