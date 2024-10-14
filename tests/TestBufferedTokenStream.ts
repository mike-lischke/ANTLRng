/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ANTLRInputStream, BufferedTokenStream, CharStream, LexerInterpreter, Token, TokenSource, TokenStream } from "antlr4ng";



export  class TestBufferedTokenStream {

	@Test
public  testFirstToken():  void {
        let  g = new  LexerGrammar(
            "lexer grammar t;\n"+
            "ID : 'a'..'z'+;\n" +
            "INT : '0'..'9'+;\n" +
            "SEMI : ';';\n" +
            "ASSIGN : '=';\n" +
            "PLUS : '+';\n" +
            "MULT : '*';\n" +
            "WS : ' '+;\n");
        // Tokens: 012345678901234567
        // Input:  x = 3 * 0 + 2 * 0;
        let  input = new  ANTLRInputStream("x = 3 * 0 + 2 * 0;");
        let  lexEngine = g.createLexerInterpreter(input);
        let  tokens = this.createTokenStream(lexEngine);

        let  result = tokens.LT(1).getText();
        let  expecting = "x";
        assertEquals(expecting, result);
    }

    @Test
public  test2ndToken():  void {
        let  g = new  LexerGrammar(
            "lexer grammar t;\n"+
            "ID : 'a'..'z'+;\n" +
            "INT : '0'..'9'+;\n" +
            "SEMI : ';';\n" +
            "ASSIGN : '=';\n" +
            "PLUS : '+';\n" +
            "MULT : '*';\n" +
            "WS : ' '+;\n");
        // Tokens: 012345678901234567
        // Input:  x = 3 * 0 + 2 * 0;
        let  input = new  ANTLRInputStream("x = 3 * 0 + 2 * 0;");
        let  lexEngine = g.createLexerInterpreter(input);
        let  tokens = this.createTokenStream(lexEngine);

        let  result = tokens.LT(2).getText();
        let  expecting = " ";
        assertEquals(expecting, result);
    }

    @Test
public  testCompleteBuffer():  void {
        let  g = new  LexerGrammar(
            "lexer grammar t;\n"+
            "ID : 'a'..'z'+;\n" +
            "INT : '0'..'9'+;\n" +
            "SEMI : ';';\n" +
            "ASSIGN : '=';\n" +
            "PLUS : '+';\n" +
            "MULT : '*';\n" +
            "WS : ' '+;\n");
        // Tokens: 012345678901234567
        // Input:  x = 3 * 0 + 2 * 0;
        let  input = new  ANTLRInputStream("x = 3 * 0 + 2 * 0;");
        let  lexEngine = g.createLexerInterpreter(input);
        let  tokens = this.createTokenStream(lexEngine);

        let  i = 1;
        let  t = tokens.LT(i);
        while ( t.getType()!==Token.EOF ) {
            i++;
            t = tokens.LT(i);
        }
        tokens.LT(i++); // push it past end
        tokens.LT(i++);

        let  result = tokens.getText();
        let  expecting = "x = 3 * 0 + 2 * 0;";
        assertEquals(expecting, result);
    }

    @Test
public  testCompleteBufferAfterConsuming():  void {
        let  g = new  LexerGrammar(
            "lexer grammar t;\n"+
            "ID : 'a'..'z'+;\n" +
            "INT : '0'..'9'+;\n" +
            "SEMI : ';';\n" +
            "ASSIGN : '=';\n" +
            "PLUS : '+';\n" +
            "MULT : '*';\n" +
            "WS : ' '+;\n");
        // Tokens: 012345678901234567
        // Input:  x = 3 * 0 + 2 * 0;
        let  input = new  ANTLRInputStream("x = 3 * 0 + 2 * 0;");
        let  lexEngine = g.createLexerInterpreter(input);
        let  tokens = this.createTokenStream(lexEngine);

        let  t = tokens.LT(1);
        while ( t.getType()!==Token.EOF ) {
            tokens.consume();
            t = tokens.LT(1);
        }

        let  result = tokens.getText();
        let  expecting = "x = 3 * 0 + 2 * 0;";
        assertEquals(expecting, result);
    }

    @Test
public  testLookback():  void {
        let  g = new  LexerGrammar(
            "lexer grammar t;\n"+
            "ID : 'a'..'z'+;\n" +
            "INT : '0'..'9'+;\n" +
            "SEMI : ';';\n" +
            "ASSIGN : '=';\n" +
            "PLUS : '+';\n" +
            "MULT : '*';\n" +
            "WS : ' '+;\n");
        // Tokens: 012345678901234567
        // Input:  x = 3 * 0 + 2 * 0;
        let  input = new  ANTLRInputStream("x = 3 * 0 + 2 * 0;");
        let  lexEngine = g.createLexerInterpreter(input);
        let  tokens = this.createTokenStream(lexEngine);

        tokens.consume(); // get x into buffer
        let  t = tokens.LT(-1);
        assertEquals("x", t.getText());

        tokens.consume();
        tokens.consume(); // consume '='
        t = tokens.LT(-3);
        assertEquals("x", t.getText());
        t = tokens.LT(-2);
        assertEquals(" ", t.getText());
        t = tokens.LT(-1);
        assertEquals("=", t.getText());
    }
	protected  createTokenStream(src: TokenSource):  TokenStream {
		return new  BufferedTokenStream(src);
	}

}
