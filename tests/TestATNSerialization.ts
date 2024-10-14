/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ATN, ATNSerializer, IntegerList, ATNDeserializer } from "antlr4ng";



export  class TestATNSerialization {
	@Test
public  testSimpleNoBlock():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A B ;");
		let  expecting =
			"max type 2\n" +
				"0:RULE_START 0\n" +
				"1:RULE_STOP 0\n" +
				"2:BASIC 0\n" +
				"3:BASIC 0\n" +
				"4:BASIC 0\n" +
				"5:BASIC 0\n" +
				"rule 0:0\n" +
				"0->2 EPSILON 0,0,0\n" +
				"2->3 ATOM 1,0,0\n" +
				"3->4 ATOM 2,0,0\n" +
				"4->1 EPSILON 0,0,0\n";
		this.checkResults(g, expecting);
	}

	@Test
public  testEOF():  void {
		let  g = new  Grammar(
				"parser grammar T;\n"+
						"a : A EOF ;");
		let  expecting =
				"max type 1\n" +
						"0:RULE_START 0\n" +
						"1:RULE_STOP 0\n" +
						"2:BASIC 0\n" +
						"3:BASIC 0\n" +
						"4:BASIC 0\n" +
						"5:BASIC 0\n" +
						"rule 0:0\n" +
						"0->2 EPSILON 0,0,0\n" +
						"2->3 ATOM 1,0,0\n" +
						"3->4 ATOM 0,0,1\n" +
						"4->1 EPSILON 0,0,0\n";
		this.checkResults(g, expecting);
	}

	@Test
public  testEOFInSet():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : (A|EOF) ;");
		let  expecting =
			"max type 1\n" +
				"0:RULE_START 0\n" +
				"1:RULE_STOP 0\n" +
				"2:BASIC 0\n" +
				"3:BASIC 0\n" +
				"4:BASIC 0\n" +
				"rule 0:0\n" +
				"0:EOF, A..A\n" +
				"0->2 EPSILON 0,0,0\n" +
				"2->3 SET 0,0,0\n" +
				"3->1 EPSILON 0,0,0\n";
		this.checkResults(g, expecting);
	}

	@Test
public  testNot():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"tokens {A, B, C}\n" +
			"a : ~A ;");
		let  expecting =
			"max type 3\n" +
			"0:RULE_START 0\n" +
			"1:RULE_STOP 0\n" +
			"2:BASIC 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:0\n" +
			"0:A..A\n" +
			"0->2 EPSILON 0,0,0\n" +
			"2->3 NOT_SET 0,0,0\n" +
			"3->1 EPSILON 0,0,0\n";
		let  atn = createATN(g, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(g.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testWildcard():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"tokens {A, B, C}\n" +
			"a : . ;");
		let  expecting =
			"max type 3\n" +
			"0:RULE_START 0\n" +
			"1:RULE_STOP 0\n" +
			"2:BASIC 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:0\n" +
			"0->2 EPSILON 0,0,0\n" +
			"2->3 WILDCARD 0,0,0\n" +
			"3->1 EPSILON 0,0,0\n";
		this.checkResults(g, expecting);
	}

	@Test
public  testPEGAchillesHeel():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A | A B ;");
		let  expecting =
			"max type 2\n" +
				"0:RULE_START 0\n" +
				"1:RULE_STOP 0\n" +
				"2:BASIC 0\n" +
				"3:BASIC 0\n" +
				"4:BASIC 0\n" +
				"5:BLOCK_START 0 6\n" +
				"6:BLOCK_END 0\n" +
				"7:BASIC 0\n" +
				"rule 0:0\n" +
				"0->5 EPSILON 0,0,0\n" +
				"2->6 ATOM 1,0,0\n" +
				"3->4 ATOM 1,0,0\n" +
				"4->6 ATOM 2,0,0\n" +
				"5->2 EPSILON 0,0,0\n" +
				"5->3 EPSILON 0,0,0\n" +
				"6->1 EPSILON 0,0,0\n" +
				"0:5\n";
		this.checkResults(g, expecting);
	}

	@Test
public  test3Alts():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A | A B | A B C ;");
		let  expecting =
			"max type 3\n" +
				"0:RULE_START 0\n" +
				"1:RULE_STOP 0\n" +
				"2:BASIC 0\n" +
				"3:BASIC 0\n" +
				"4:BASIC 0\n" +
				"5:BASIC 0\n" +
				"6:BASIC 0\n" +
				"7:BASIC 0\n" +
				"8:BLOCK_START 0 9\n" +
				"9:BLOCK_END 0\n" +
				"10:BASIC 0\n" +
				"rule 0:0\n" +
				"0->8 EPSILON 0,0,0\n" +
				"2->9 ATOM 1,0,0\n" +
				"3->4 ATOM 1,0,0\n" +
				"4->9 ATOM 2,0,0\n" +
				"5->6 ATOM 1,0,0\n" +
				"6->7 ATOM 2,0,0\n" +
				"7->9 ATOM 3,0,0\n" +
				"8->2 EPSILON 0,0,0\n" +
				"8->3 EPSILON 0,0,0\n" +
				"8->5 EPSILON 0,0,0\n" +
				"9->1 EPSILON 0,0,0\n" +
				"0:8\n";
		this.checkResults(g, expecting);
	}

	@Test
public  testSimpleLoop():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A+ B ;");
		let  expecting =
			"max type 2\n" +
				"0:RULE_START 0\n" +
				"1:RULE_STOP 0\n" +
				"2:BASIC 0\n" +
				"3:PLUS_BLOCK_START 0 4\n" +
				"4:BLOCK_END 0\n" +
				"5:PLUS_LOOP_BACK 0\n" +
				"6:LOOP_END 0 5\n" +
				"7:BASIC 0\n" +
				"8:BASIC 0\n" +
				"9:BASIC 0\n" +
				"rule 0:0\n" +
				"0->3 EPSILON 0,0,0\n" +
				"2->4 ATOM 1,0,0\n" +
				"3->2 EPSILON 0,0,0\n" +
				"4->5 EPSILON 0,0,0\n" +
				"5->3 EPSILON 0,0,0\n" +
				"5->6 EPSILON 0,0,0\n" +
				"6->7 EPSILON 0,0,0\n" +
				"7->8 ATOM 2,0,0\n" +
				"8->1 EPSILON 0,0,0\n" +
				"0:5\n";
		this.checkResults(g, expecting);
	}

	@Test
public  testRuleRef():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : e ;\n" +
			"e : E ;\n");
		let  expecting =
			"max type 1\n" +
				"0:RULE_START 0\n" +
				"1:RULE_STOP 0\n" +
				"2:RULE_START 1\n" +
				"3:RULE_STOP 1\n" +
				"4:BASIC 0\n" +
				"5:BASIC 0\n" +
				"6:BASIC 1\n" +
				"7:BASIC 1\n" +
				"8:BASIC 1\n" +
				"rule 0:0\n" +
				"rule 1:2\n" +
				"0->4 EPSILON 0,0,0\n" +
				"2->6 EPSILON 0,0,0\n" +
				"4->5 RULE 2,1,0\n" +
				"5->1 EPSILON 0,0,0\n" +
				"6->7 ATOM 1,0,0\n" +
				"7->3 EPSILON 0,0,0\n";
		this.checkResults(g, expecting);
	}

	@Test
public  testLexerTwoRules():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'a' ;\n" +
			"B : 'b' ;\n");
		let  expecting =
			"max type 2\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:RULE_START 1\n" +
			"4:RULE_STOP 1\n" +
			"5:BASIC 0\n" +
			"6:BASIC 0\n" +
			"7:BASIC 1\n" +
			"8:BASIC 1\n" +
			"rule 0:1 1\n" +
			"rule 1:3 2\n" +
			"mode 0:0\n" +
			"0->1 EPSILON 0,0,0\n" +
			"0->3 EPSILON 0,0,0\n" +
			"1->5 EPSILON 0,0,0\n" +
			"3->7 EPSILON 0,0,0\n" +
			"5->6 ATOM 97,0,0\n" +
			"6->2 EPSILON 0,0,0\n" +
			"7->8 ATOM 98,0,0\n" +
			"8->4 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeSMPLiteralSerializedToSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : '\\u{1F4A9}' ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 ATOM 128169,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeSMPRangeSerializedToSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : ('a'..'\\u{1F4A9}') ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 RANGE 97,128169,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeSMPAndBMPSetSerialized():  void {
		let  lg = new  LexerGrammar(
				"lexer grammar L;\n"+
						"SMP : ('\\u{1F4A9}' | '\\u{1F4AF}') ;\n"+
						"BMP : ('a' | 'x') ;");
		let  expecting =
				"max type 2\n" +
						"0:TOKEN_START -1\n" +
						"1:RULE_START 0\n" +
						"2:RULE_STOP 0\n" +
						"3:RULE_START 1\n" +
						"4:RULE_STOP 1\n" +
						"5:BASIC 0\n" +
						"6:BASIC 0\n" +
						"7:BASIC 1\n" +
						"8:BASIC 1\n" +
						"rule 0:1 1\n" +
						"rule 1:3 2\n" +
						"mode 0:0\n" +
						"0:128169..128169, 128175..128175\n" +
						"1:'a'..'a', 'x'..'x'\n" +
						"0->1 EPSILON 0,0,0\n" +
						"0->3 EPSILON 0,0,0\n" +
						"1->5 EPSILON 0,0,0\n" +
						"3->7 EPSILON 0,0,0\n" +
						"5->6 SET 0,0,0\n" +
						"6->2 EPSILON 0,0,0\n" +
						"7->8 SET 1,0,0\n" +
						"8->4 EPSILON 0,0,0\n" +
						"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerWith0xFFFCInSet():  void {
		let  lg = new  LexerGrammar(
				"lexer grammar L;\n" +
						"ID : ([A-Z_]|'Ā'..'\\uFFFC') ([A-Z_0-9]|'Ā'..'\\uFFFC')*; // FFFD+ are not valid char\n");
		let  expecting =
				"max type 1\n" +
				"0:TOKEN_START -1\n" +
				"1:RULE_START 0\n" +
				"2:RULE_STOP 0\n" +
				"3:BASIC 0\n" +
				"4:BLOCK_START 0 5\n" +
				"5:BLOCK_END 0\n" +
				"6:BASIC 0\n" +
				"7:STAR_BLOCK_START 0 8\n" +
				"8:BLOCK_END 0\n" +
				"9:STAR_LOOP_ENTRY 0\n" +
				"10:LOOP_END 0 11\n" +
				"11:STAR_LOOP_BACK 0\n" +
				"rule 0:1 1\n" +
				"mode 0:0\n" +
				"0:'A'..'Z', '_'..'_', '\\u0100'..'\\uFFFC'\n" +
				"1:'0'..'9', 'A'..'Z', '_'..'_', '\\u0100'..'\\uFFFC'\n" +
				"0->1 EPSILON 0,0,0\n" +
				"1->4 EPSILON 0,0,0\n" +
				"3->5 SET 0,0,0\n" +
				"4->3 EPSILON 0,0,0\n" +
				"5->9 EPSILON 0,0,0\n" +
				"6->8 SET 1,0,0\n" +
				"7->6 EPSILON 0,0,0\n" +
				"8->11 EPSILON 0,0,0\n" +
				"9->7 EPSILON 0,0,0\n" +
				"9->10 EPSILON 0,0,0\n" +
				"10->2 EPSILON 0,0,0\n" +
				"11->9 EPSILON 0,0,0\n" +
				"0:0\n" +
				"1:4\n" +
				"2:7\n" +
				"3:9\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerNotLiteral():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : ~'a' ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:'a'..'a'\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 NOT_SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : '0'..'9' ;\n");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 RANGE 48,57,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerEOF():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : 'a' EOF ;\n");
		let  expecting =
			"max type 1\n" +
				"0:TOKEN_START -1\n" +
				"1:RULE_START 0\n" +
				"2:RULE_STOP 0\n" +
				"3:BASIC 0\n" +
				"4:BASIC 0\n" +
				"5:BASIC 0\n" +
				"rule 0:1 1\n" +
				"mode 0:0\n" +
				"0->1 EPSILON 0,0,0\n" +
				"1->3 EPSILON 0,0,0\n" +
				"3->4 ATOM 97,0,0\n" +
				"4->5 ATOM 0,0,1\n" +
				"5->2 EPSILON 0,0,0\n" +
				"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerEOFInSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : 'a' (EOF|'\\n') ;\n");
		let  expecting =
			"max type 1\n" +
				"0:TOKEN_START -1\n" +
				"1:RULE_START 0\n" +
				"2:RULE_STOP 0\n" +
				"3:BASIC 0\n" +
				"4:BASIC 0\n" +
				"5:BLOCK_START 0 6\n" +
				"6:BLOCK_END 0\n" +
				"rule 0:1 1\n" +
				"mode 0:0\n" +
				"0:EOF, '\\n'..'\\n'\n" +
				"0->1 EPSILON 0,0,0\n" +
				"1->3 EPSILON 0,0,0\n" +
				"3->5 ATOM 97,0,0\n" +
				"4->6 SET 0,0,0\n" +
				"5->4 EPSILON 0,0,0\n" +
				"6->2 EPSILON 0,0,0\n" +
				"0:0\n" +
				"1:5\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerLoops():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : '0'..'9'+ ;\n");
		let  expecting =
			"max type 1\n" +
				"0:TOKEN_START -1\n" +
				"1:RULE_START 0\n" +
				"2:RULE_STOP 0\n" +
				"3:BASIC 0\n" +
				"4:PLUS_BLOCK_START 0 5\n" +
				"5:BLOCK_END 0\n" +
				"6:PLUS_LOOP_BACK 0\n" +
				"7:LOOP_END 0 6\n" +
				"rule 0:1 1\n" +
				"mode 0:0\n" +
				"0->1 EPSILON 0,0,0\n" +
				"1->4 EPSILON 0,0,0\n" +
				"3->5 RANGE 48,57,0\n" +
				"4->3 EPSILON 0,0,0\n" +
				"5->6 EPSILON 0,0,0\n" +
				"6->4 EPSILON 0,0,0\n" +
				"6->7 EPSILON 0,0,0\n" +
				"7->2 EPSILON 0,0,0\n" +
				"0:0\n" +
				"1:6\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerAction():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'a' {a} ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' {c} ;\n");
		let  expecting =
			"max type 3\n" +
				"0:TOKEN_START -1\n" +
				"1:RULE_START 0\n" +
				"2:RULE_STOP 0\n" +
				"3:RULE_START 1\n" +
				"4:RULE_STOP 1\n" +
				"5:RULE_START 2\n" +
				"6:RULE_STOP 2\n" +
				"7:BASIC 0\n" +
				"8:BASIC 0\n" +
				"9:BASIC 0\n" +
				"10:BASIC 1\n" +
				"11:BASIC 1\n" +
				"12:BASIC 2\n" +
				"13:BASIC 2\n" +
				"14:BASIC 2\n" +
				"rule 0:1 1\n" +
				"rule 1:3 2\n" +
				"rule 2:5 3\n" +
				"mode 0:0\n" +
				"0->1 EPSILON 0,0,0\n" +
				"0->3 EPSILON 0,0,0\n" +
				"0->5 EPSILON 0,0,0\n" +
				"1->7 EPSILON 0,0,0\n" +
				"3->10 EPSILON 0,0,0\n" +
				"5->12 EPSILON 0,0,0\n" +
				"7->8 ATOM 97,0,0\n" +
				"8->9 ACTION 0,0,0\n" +
				"9->2 EPSILON 0,0,0\n" +
				"10->11 ATOM 98,0,0\n" +
				"11->4 EPSILON 0,0,0\n" +
				"12->13 ATOM 99,0,0\n" +
				"13->14 ACTION 2,1,0\n" +
				"14->6 EPSILON 0,0,0\n" +
				"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerNotSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('a'|'b')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:'a'..'b'\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 NOT_SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		this.checkResults(lg, expecting);
	}

	@Test
public  testLexerSetWithRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ('a'|'b'|'e'|'p'..'t')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:'a'..'b', 'e'..'e', 'p'..'t'\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerNotSetWithRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('a'|'b'|'e'|'p'..'t')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:'a'..'b', 'e'..'e', 'p'..'t'\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 NOT_SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeUnescapedBMPNotSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('\u4E9C'|'\u4E9D')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:'\\u4E9C'..'\\u4E9D'\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 NOT_SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeUnescapedBMPSetWithRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ('\u4E9C'|'\u4E9D'|'\u6C5F'|'\u305F'..'\u307B')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:'\\u305F'..'\\u307B', '\\u4E9C'..'\\u4E9D', '\\u6C5F'..'\\u6C5F'\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeUnescapedBMPNotSetWithRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('\u4E9C'|'\u4E9D'|'\u6C5F'|'\u305F'..'\u307B')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:'\\u305F'..'\\u307B', '\\u4E9C'..'\\u4E9D', '\\u6C5F'..'\\u6C5F'\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 NOT_SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeEscapedBMPNotSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('\\u4E9C'|'\\u4E9D')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:'\\u4E9C'..'\\u4E9D'\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 NOT_SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeEscapedBMPSetWithRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ('\\u4E9C'|'\\u4E9D'|'\\u6C5F'|'\\u305F'..'\\u307B')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:'\\u305F'..'\\u307B', '\\u4E9C'..'\\u4E9D', '\\u6C5F'..'\\u6C5F'\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeEscapedBMPNotSetWithRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('\\u4E9C'|'\\u4E9D'|'\\u6C5F'|'\\u305F'..'\\u307B')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:'\\u305F'..'\\u307B', '\\u4E9C'..'\\u4E9D', '\\u6C5F'..'\\u6C5F'\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 NOT_SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeEscapedSMPNotSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('\\u{1F4A9}'|'\\u{1F4AA}')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:128169..128170\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 NOT_SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeEscapedSMPSetWithRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ('\\u{1F4A9}'|'\\u{1F4AA}'|'\\u{1F441}'|'\\u{1D40F}'..'\\u{1D413}')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:119823..119827, 128065..128065, 128169..128170\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerUnicodeEscapedSMPNotSetWithRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('\\u{1F4A9}'|'\\u{1F4AA}'|'\\u{1F441}'|'\\u{1D40F}'..'\\u{1D413}')\n ;");
		let  expecting =
			"max type 1\n" +
			"0:TOKEN_START -1\n" +
			"1:RULE_START 0\n" +
			"2:RULE_STOP 0\n" +
			"3:BASIC 0\n" +
			"4:BASIC 0\n" +
			"rule 0:1 1\n" +
			"mode 0:0\n" +
			"0:119823..119827, 128065..128065, 128169..128170\n" +
			"0->1 EPSILON 0,0,0\n" +
			"1->3 EPSILON 0,0,0\n" +
			"3->4 NOT_SET 0,0,0\n" +
			"4->2 EPSILON 0,0,0\n" +
			"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerWildcardWithMode():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : 'a'..'z'+ ;\n"+
			"mode CMT;" +
			"COMMENT : '*/' {skip(); popMode();} ;\n" +
			"JUNK : . {more();} ;\n");
		let  expecting =
			"max type 3\n" +
				"0:TOKEN_START -1\n" +
				"1:TOKEN_START -1\n" +
				"2:RULE_START 0\n" +
				"3:RULE_STOP 0\n" +
				"4:RULE_START 1\n" +
				"5:RULE_STOP 1\n" +
				"6:RULE_START 2\n" +
				"7:RULE_STOP 2\n" +
				"8:BASIC 0\n" +
				"9:PLUS_BLOCK_START 0 10\n" +
				"10:BLOCK_END 0\n" +
				"11:PLUS_LOOP_BACK 0\n" +
				"12:LOOP_END 0 11\n" +
				"13:BASIC 1\n" +
				"14:BASIC 1\n" +
				"15:BASIC 1\n" +
				"16:BASIC 1\n" +
				"17:BASIC 1\n" +
				"18:BASIC 2\n" +
				"19:BASIC 2\n" +
				"20:BASIC 2\n" +
				"rule 0:2 1\n" +
				"rule 1:4 2\n" +
				"rule 2:6 3\n" +
				"mode 0:0\n" +
				"mode 1:1\n" +
				"0->2 EPSILON 0,0,0\n" +
				"1->4 EPSILON 0,0,0\n" +
				"1->6 EPSILON 0,0,0\n" +
				"2->9 EPSILON 0,0,0\n" +
				"4->13 EPSILON 0,0,0\n" +
				"6->18 EPSILON 0,0,0\n" +
				"8->10 RANGE 97,122,0\n" +
				"9->8 EPSILON 0,0,0\n" +
				"10->11 EPSILON 0,0,0\n" +
				"11->9 EPSILON 0,0,0\n" +
				"11->12 EPSILON 0,0,0\n" +
				"12->3 EPSILON 0,0,0\n" +
				"13->14 ATOM 42,0,0\n" +
				"14->15 ATOM 47,0,0\n" +
				"15->16 EPSILON 0,0,0\n" +
				"16->17 ACTION 1,0,0\n" +
				"17->5 EPSILON 0,0,0\n" +
				"18->19 WILDCARD 0,0,0\n" +
				"19->20 ACTION 2,1,0\n" +
				"20->7 EPSILON 0,0,0\n" +
				"0:0\n" +
				"1:1\n" +
				"2:11\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testLexerNotSetWithRange2():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('a'|'b') ~('e'|'p'..'t')\n ;");
		let  expecting =
			"max type 1\n" +
				"0:TOKEN_START -1\n" +
				"1:RULE_START 0\n" +
				"2:RULE_STOP 0\n" +
				"3:BASIC 0\n" +
				"4:BASIC 0\n" +
				"5:BASIC 0\n" +
				"rule 0:1 1\n" +
				"mode 0:0\n" +
				"0:'a'..'b'\n" +
				"1:'e'..'e', 'p'..'t'\n" +
				"0->1 EPSILON 0,0,0\n" +
				"1->3 EPSILON 0,0,0\n" +
				"3->4 NOT_SET 0,0,0\n" +
				"4->5 NOT_SET 1,0,0\n" +
				"5->2 EPSILON 0,0,0\n" +
				"0:0\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  testModeInLexer():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'a'\n ;\n" +
			"B : 'b';\n" +
			"mode M;\n" +
			"C : 'c';\n"+
			"D : 'd';\n");
		let  expecting =
			"max type 4\n" +
			"0:TOKEN_START -1\n" +
			"1:TOKEN_START -1\n" +
			"2:RULE_START 0\n" +
			"3:RULE_STOP 0\n" +
			"4:RULE_START 1\n" +
			"5:RULE_STOP 1\n" +
			"6:RULE_START 2\n" +
			"7:RULE_STOP 2\n" +
			"8:RULE_START 3\n" +
			"9:RULE_STOP 3\n" +
			"10:BASIC 0\n" +
			"11:BASIC 0\n" +
			"12:BASIC 1\n" +
			"13:BASIC 1\n" +
			"14:BASIC 2\n" +
			"15:BASIC 2\n" +
			"16:BASIC 3\n" +
			"17:BASIC 3\n" +
			"rule 0:2 1\n" +
			"rule 1:4 2\n" +
			"rule 2:6 3\n" +
			"rule 3:8 4\n" +
			"mode 0:0\n" +
			"mode 1:1\n" +
			"0->2 EPSILON 0,0,0\n" +
			"0->4 EPSILON 0,0,0\n" +
			"1->6 EPSILON 0,0,0\n" +
			"1->8 EPSILON 0,0,0\n" +
			"2->10 EPSILON 0,0,0\n" +
			"4->12 EPSILON 0,0,0\n" +
			"6->14 EPSILON 0,0,0\n" +
			"8->16 EPSILON 0,0,0\n" +
			"10->11 ATOM 97,0,0\n" +
			"11->3 EPSILON 0,0,0\n" +
			"12->13 ATOM 98,0,0\n" +
			"13->5 EPSILON 0,0,0\n" +
			"14->15 ATOM 99,0,0\n" +
			"15->7 EPSILON 0,0,0\n" +
			"16->17 ATOM 100,0,0\n" +
			"17->9 EPSILON 0,0,0\n" +
			"0:0\n" +
			"1:1\n";
		let  atn = createATN(lg, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(lg.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);
	}

	@Test
public  test2ModesInLexer():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'a'\n ;\n" +
			"mode M;\n" +
			"B : 'b';\n" +
			"mode M2;\n" +
			"C : 'c';\n");
		let  expecting =
			"max type 3\n" +
			"0:TOKEN_START -1\n" +
			"1:TOKEN_START -1\n" +
			"2:TOKEN_START -1\n" +
			"3:RULE_START 0\n" +
			"4:RULE_STOP 0\n" +
			"5:RULE_START 1\n" +
			"6:RULE_STOP 1\n" +
			"7:RULE_START 2\n" +
			"8:RULE_STOP 2\n" +
			"9:BASIC 0\n" +
			"10:BASIC 0\n" +
			"11:BASIC 1\n" +
			"12:BASIC 1\n" +
			"13:BASIC 2\n" +
			"14:BASIC 2\n" +
			"rule 0:3 1\n" +
			"rule 1:5 2\n" +
			"rule 2:7 3\n" +
			"mode 0:0\n" +
			"mode 1:1\n" +
			"mode 2:2\n" +
			"0->3 EPSILON 0,0,0\n" +
			"1->5 EPSILON 0,0,0\n" +
			"2->7 EPSILON 0,0,0\n" +
			"3->9 EPSILON 0,0,0\n" +
			"5->11 EPSILON 0,0,0\n" +
			"7->13 EPSILON 0,0,0\n" +
			"9->10 ATOM 97,0,0\n" +
			"10->4 EPSILON 0,0,0\n" +
			"11->12 ATOM 98,0,0\n" +
			"12->6 EPSILON 0,0,0\n" +
			"13->14 ATOM 99,0,0\n" +
			"14->8 EPSILON 0,0,0\n" +
			"0:0\n" +
			"1:1\n" +
			"2:2\n";
		this.checkResults(lg, expecting);
	}

	private  checkResults(g: Grammar, expecting: string):  void {
		let  atn = createATN(g, true);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  result = new  ATNDescriber(atn, Arrays.asList(g.getTokenNames())).decode(serialized.toArray());
		assertEquals(expecting, result);

		let  serialized16 = ATNDeserializer.encodeIntsWith16BitWords(serialized);
		let  ints16 = serialized16.toArray();
		let  chars = new  Uint16Array(ints16.length);
		for (let  i = 0; i < ints16.length; i++) {
			chars[i] = Number(ints16[i]);
		}
		let  serialized32 = ATNDeserializer.decodeIntsEncodedAs16BitWords(chars, true);

		assertArrayEquals(serialized.toArray(), serialized32);
	}
}
