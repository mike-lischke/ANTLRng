/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ANTLRInputStream, CharStream, CharStreams, CommonTokenStream, LexerInterpreter, ParseTree } from "antlr4ng";



export  class TestUnicodeGrammar {

	private static  parseTreeForGrammarWithInput(
			grammarText: string,
			rootRule: string,
			inputText: string):  string {
		let  grammar = new  Grammar(grammarText);
		let  lexEngine = grammar.createLexerInterpreter(
				CharStreams.fromString(inputText));
		let  tokens = new  CommonTokenStream(lexEngine);
		let  parser = grammar.createGrammarParserInterpreter(tokens);
		let  parseTree = parser.parse(grammar.rules.get(rootRule).index);
		let  nodeTextProvider =
				new  InterpreterTreeTextProvider(grammar.getRuleNames());
		return Trees.toStringTree(parseTree, nodeTextProvider);
	}
	@Test
public  unicodeBMPLiteralInGrammar():  void {
		let  grammarText =
			"grammar Unicode;\n" +
			"r : 'hello' WORLD;\n" +
			"WORLD : ('world' | '\\u4E16\\u754C' | '\\u1000\\u1019\\u1039\\u1018\\u102C' );\n" +
			"WS : [ \\t\\r\\n]+ -> skip;\n";
		let  inputText = "hello \u4E16\u754C";
		assertEquals(
				"(r:1 " + inputText + ")",
				TestUnicodeGrammar.parseTreeForGrammarWithInput(
						grammarText,
						"r",
						inputText));
	}

	// TODO: This test cannot pass unless we change either the grammar
	// parser to decode surrogate pair literals to code points (which
	// would break existing clients) or to treat them as an
	// alternative:
	//
	// '\\uD83C\\uDF0D' -> ('\\u{1F30E}' | '\\uD83C\\uDF0D')
	//
	// but I worry that might cause parse ambiguity if we're not careful.
	//@Test
	public  unicodeSurrogatePairLiteralInGrammar():  void {
		let  grammarText =
			"grammar Unicode;\n" +
			"r : 'hello' WORLD;\n" +
			"WORLD : ('\\uD83C\\uDF0D' | '\\uD83C\\uDF0E' | '\\uD83C\\uDF0F' );\n" +
			"WS : [ \\t\\r\\n]+ -> skip;\n";
		let  inputText = new  StringBuilder("hello ")
				.appendCodePoint(0x1F30E)
				.toString();
		assertEquals(
				"(r:1 " + inputText + ")",
				TestUnicodeGrammar.parseTreeForGrammarWithInput(
						grammarText,
						"r",
						inputText));
	}

	@Test
public  unicodeSMPLiteralInGrammar():  void {
		let  grammarText =
			"grammar Unicode;\n" +
			"r : 'hello' WORLD;\n" +
			"WORLD : ('\\u{1F30D}' | '\\u{1F30E}' | '\\u{1F30F}' );\n" +
			"WS : [ \\t\\r\\n]+ -> skip;\n";
		let  inputText = new  StringBuilder("hello ")
				.appendCodePoint(0x1F30E)
				.toString();
		assertEquals(
				"(r:1 " + inputText + ")",
				TestUnicodeGrammar.parseTreeForGrammarWithInput(
						grammarText,
						"r",
						inputText));
	}

	@Test
public  unicodeSMPRangeInGrammar():  void {
		let  grammarText =
			"grammar Unicode;\n" +
			"r : 'hello' WORLD;\n" +
			"WORLD : ('\\u{1F30D}'..'\\u{1F30F}' );\n" +
			"WS : [ \\t\\r\\n]+ -> skip;\n";
		let  inputText = new  StringBuilder("hello ")
				.appendCodePoint(0x1F30E)
				.toString();
		assertEquals(
				"(r:1 " + inputText + ")",
				TestUnicodeGrammar.parseTreeForGrammarWithInput(
						grammarText,
						"r",
						inputText));
	}

	@Test
public  matchingDanglingSurrogateInInput():  void {
		let  grammarText =
			"grammar Unicode;\n" +
			"r : 'hello' WORLD;\n" +
			"WORLD : ('\\uD83C' | '\\uD83D' | '\\uD83E' );\n" +
			"WS : [ \\t\\r\\n]+ -> skip;\n";
		let  inputText = "hello \uD83C";
		assertEquals(
				"(r:1 " + inputText + ")",
				TestUnicodeGrammar.parseTreeForGrammarWithInput(
						grammarText,
						"r",
						inputText));
	}

	@Test
public  binaryGrammar():  void {
		let  grammarText =
			"grammar Binary;\n" +
			"r : HEADER PACKET+ FOOTER;\n" +
			"HEADER : '\\u0002\\u0000\\u0001\\u0007';\n" +
			"PACKET : '\\u00D0' ('\\u00D1' | '\\u00D2' | '\\u00D3') +;\n" +
			"FOOTER : '\\u00FF';\n";
		let  toParse =  [
				Number(0x02), Number(0x00), Number(0x01), Number(0x07),
				Number(0xD0), Number(0xD2), Number(0xD2), Number(0xD3), Number(0xD3), Number(0xD3),
				Number(0xD0), Number(0xD3), Number(0xD3), Number(0xD1),
				Number(0xFF)
		];
		let  charStream: CharStream;
		 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const is: ByteArrayInputStream  = new  ByteArrayInputStream(toParse);
		     // Note we use ISO_8859_1 to treat all byte values as Unicode "characters" from
		     // U+0000 to U+00FF.
		     const isr: InputStreamReader  = new  InputStreamReader(CharStreams.fromStream.is, StandardCharsets.ISO_8859_1)
try {
	try  {
			charStream = new  ANTLRInputStream(isr);
		}
	finally {
	error = closeResources([is, isr]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

		let  grammar = new  Grammar(grammarText);
		let  lexEngine = grammar.createLexerInterpreter(charStream);
		let  tokens = new  CommonTokenStream(lexEngine);
		let  parser = grammar.createGrammarParserInterpreter(tokens);
		let  parseTree = parser.parse(grammar.rules.get("r").index);
		let  nodeTextProvider =
				new  InterpreterTreeTextProvider(grammar.getRuleNames());
		let  result = Trees.toStringTree(parseTree, nodeTextProvider);

		assertEquals(
				"(r:1 \u0002\u0000\u0001\u0007 \u00D0\u00D2\u00D2\u00D3\u00D3\u00D3 \u00D0\u00D3\u00D3\u00D1 \u00FF)",
				result);
	}
}
