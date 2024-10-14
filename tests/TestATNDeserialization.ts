/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ATN, ATNDeserializer, ATNSerializer, IntegerList } from "antlr4ng";




export  class TestATNDeserialization {
	@Test
public  testSimpleNoBlock():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A B ;");
		this.checkDeserializationIsStable(g);
	}

	@Test
public  testEOF():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : EOF ;");
		this.checkDeserializationIsStable(g);
	}

	@Test
public  testEOFInSet():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : (EOF|A) ;");
		this.checkDeserializationIsStable(g);
	}

	@Test
public  testNot():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"tokens {A, B, C}\n" +
			"a : ~A ;");
		this.checkDeserializationIsStable(g);
	}

	@Test
public  testWildcard():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"tokens {A, B, C}\n" +
			"a : . ;");
		this.checkDeserializationIsStable(g);
	}

	@Test
public  testPEGAchillesHeel():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A | A B ;");
		this.checkDeserializationIsStable(g);
	}

	@Test
public  test3Alts():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A | A B | A B C ;");
		this.checkDeserializationIsStable(g);
	}

	@Test
public  testSimpleLoop():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A+ B ;");
		this.checkDeserializationIsStable(g);
	}

	@Test
public  testRuleRef():  void {
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : e ;\n" +
			"e : E ;\n");
		this.checkDeserializationIsStable(g);
	}

	@Test
public  testLexerTwoRules():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'a' ;\n" +
			"B : 'b' ;\n");
		this.checkDeserializationIsStable(lg);
	}

	@Test
public  testLexerEOF():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'a' EOF ;\n");
		this.checkDeserializationIsStable(lg);
	}

	@Test
public  testLexerEOFInSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'a' (EOF|'\\n') ;\n");
		this.checkDeserializationIsStable(lg);
	}

	@Test
public  testLexerRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : '0'..'9' ;\n");
		this.checkDeserializationIsStable(lg);
	}

	@Test
public  testLexerLoops():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : '0'..'9'+ ;\n");
		this.checkDeserializationIsStable(lg);
	}

	@Test
public  testLexerNotSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('a'|'b')\n ;");
		this.checkDeserializationIsStable(lg);
	}

	@Test
public  testLexerNotSetWithRange():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('a'|'b'|'e'|'p'..'t')\n ;");
		this.checkDeserializationIsStable(lg);
	}

	@Test
public  testLexerNotSetWithRange2():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('a'|'b') ~('e'|'p'..'t')\n ;");
		this.checkDeserializationIsStable(lg);
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
		this.checkDeserializationIsStable(lg);
	}

	@Test
public  testLastValidBMPCharInSet():  void {
		let  lg = new  LexerGrammar(
				"lexer grammar L;\n" +
						"ID : 'Ā'..'\\uFFFC'; // FFFD+ are not valid char\n");
		this.checkDeserializationIsStable(lg);
	}

	protected  checkDeserializationIsStable(g: Grammar):  void {
		let  atn = createATN(g, false);
		let  serialized = ATNSerializer.getSerialized(atn);
		let  atnData = new  ATNDescriber(atn, Arrays.asList(g.getTokenNames())).decode(serialized.toArray());

		let  serialized16 = ATNDeserializer.encodeIntsWith16BitWords(serialized);
		let  ints16 = serialized16.toArray();
		let  chars = new  Uint16Array(ints16.length);
		for (let  i = 0; i < ints16.length; i++) {
			chars[i] = Number(ints16[i]);
		}
		let  serialized32 = ATNDeserializer.decodeIntsEncodedAs16BitWords(chars, true);

		assertArrayEquals(serialized.toArray(), serialized32);

		let  atn2 = new  ATNDeserializer().deserialize(serialized.toArray());
		let  serialized1 = ATNSerializer.getSerialized(atn2);
		let  atn2Data = new  ATNDescriber(atn2, Arrays.asList(g.getTokenNames())).decode(serialized1.toArray());

		assertEquals(atnData, atn2Data);
	}
}
