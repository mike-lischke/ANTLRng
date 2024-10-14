/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { CharStream, CommonTokenFactory, CommonTokenStream, LexerInterpreter, UnbufferedCharStream, Interval } from "antlr4ng";



export  class TestUnbufferedCharStream {

	public static TestingUnbufferedCharStream =  class TestingUnbufferedCharStream extends UnbufferedCharStream {

		public  constructor(input: Reader);

		public  constructor(input: Reader, bufferSize: number);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [input] = args as [Reader];


			super(input);
		

				break;
			}

			case 2: {
				const [input, bufferSize] = args as [Reader, number];


			super(input, bufferSize);
		

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


		/** For testing.  What's in moving window into data stream from
		 *  current index, LA(1) or data[p], to end of buffer?
		 */
		public  getRemainingBuffer():  string {
			if ( this.n===0 ) {
 return "";
}

			let  len = this.n;
			if (this.data[len-1] === java.util.stream.IntStream.EOF) {
				// Don't pass -1 to new String().
				return new  string(this.data,this.p,len-this.p-1) + "\uFFFF";
			} else {
				return new  string(this.data,this.p,len-this.p);
			}
		}

		/** For testing.  What's in moving window buffer into data stream.
		 *  From 0..p-1 have been consume.
		 */
		public  getBuffer():  string {
			if ( this.n===0 ) {
 return "";
}

			let  len = this.n;
			// Don't pass -1 to new String().
			if (this.data[len-1] === java.util.stream.IntStream.EOF) {
				// Don't pass -1 to new String().
				return new  string(this.data,0,len-1) + "\uFFFF";
			} else {
				return new  string(this.data,0,len);
			}
		}

	};


	protected static  createStream(text: string):  TestUnbufferedCharStream.TestingUnbufferedCharStream;

	protected static  createStream(text: string, bufferSize: number):  TestUnbufferedCharStream.TestingUnbufferedCharStream;
protected static createStream(...args: unknown[]):  TestUnbufferedCharStream.TestingUnbufferedCharStream {
		switch (args.length) {
			case 1: {
				const [text] = args as [string];


		return new  TestUnbufferedCharStream.TestingUnbufferedCharStream(new  StringReader(text));
	

				break;
			}

			case 2: {
				const [text, bufferSize] = args as [string, number];


		return new  TestUnbufferedCharStream.TestingUnbufferedCharStream(new  StringReader(text), bufferSize);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}

	@Test
public  testNoChar():  void {
		let  input = TestUnbufferedCharStream.createStream("");
		assertEquals(java.util.stream.IntStream.EOF, input.LA(1));
		assertEquals(java.util.stream.IntStream.EOF, input.LA(2));
	}

	/**
	 * The {@link IntStream} interface does not specify the behavior when the
	 * EOF symbol is consumed, but {@link UnbufferedCharStream} handles this
	 * particular case by throwing an {@link IllegalStateException}.
	 */
	@Test
public  testConsumeEOF():  void {
		let  input = TestUnbufferedCharStream.createStream("");
		assertEquals(java.util.stream.IntStream.EOF, input.LA(1));
		assertThrows(IllegalStateException.class, input.consume);
	}

	@Test
public  testNegativeSeek():  void {
		let  input = TestUnbufferedCharStream.createStream("");
		assertThrows(IllegalArgumentException.class, () => input.seek(-1));
	}

	@Test
public  testSeekPastEOF():  void {
		let  input = TestUnbufferedCharStream.createStream("");
		assertEquals(0, input.index());
		input.seek(1);
		assertEquals(0, input.index());
	}

	/**
	 * The {@link IntStream} interface does not specify the behavior when marks
	 * are not released in the reversed order they were created, but
	 * {@link UnbufferedCharStream} handles this case by throwing an
	 * {@link IllegalStateException}.
	 */
	@Test
public  testMarkReleaseOutOfOrder():  void {
		let  input = TestUnbufferedCharStream.createStream("");
		let  m1 = input.mark();
		let  m2 = input.mark();
		assertThrows(IllegalStateException.class, () => input.release(m1));
	}

	/**
	 * The {@link IntStream} interface does not specify the behavior when a mark
	 * is released twice, but {@link UnbufferedCharStream} handles this case by
	 * throwing an {@link IllegalStateException}.
	 */
	@Test
public  testMarkReleasedTwice():  void {
		let  input = TestUnbufferedCharStream.createStream("");
		let  m1 = input.mark();
		input.release(m1);
		assertThrows(IllegalStateException.class, () => input.release(m1));
	}

	/**
	 * The {@link IntStream} interface does not specify the behavior when a mark
	 * is released twice, but {@link UnbufferedCharStream} handles this case by
	 * throwing an {@link IllegalStateException}.
	 */
	@Test
public  testNestedMarkReleasedTwice():  void {
		let  input = TestUnbufferedCharStream.createStream("");
		let  m1 = input.mark();
		let  m2 = input.mark();
		input.release(m2);
		assertThrows(IllegalStateException.class, () => input.release(m2));
	}

	/**
	 * It is not valid to pass a mark to {@link IntStream#seek}, but
	 * {@link UnbufferedCharStream} creates marks in such a way that this
	 * invalid usage results in an {@link IllegalArgumentException}.
	 */
	@Test
public  testMarkPassedToSeek():  void {
		let  input = TestUnbufferedCharStream.createStream("");
		let  m1 = input.mark();
		assertThrows(IllegalArgumentException.class, () => input.seek(m1));
	}

	@Test
public  testSeekBeforeBufferStart():  void {
		let  input = TestUnbufferedCharStream.createStream("xyz");
		input.consume();
		let  m1 = input.mark();
		assertEquals(1, input.index());
		input.consume();
		assertThrows(IllegalArgumentException.class, () => input.seek(0));
	}

	@Test
public  testGetTextBeforeBufferStart():  void {
		let  input = TestUnbufferedCharStream.createStream("xyz");
		input.consume();
		let  m1 = input.mark();
		assertEquals(1, input.index());
		assertThrows(UnsupportedOperationException.class, () => input.getText(new  Interval(0, 1)));
	}

	@Test
public  testGetTextInMarkedRange():  void {
		let  input = TestUnbufferedCharStream.createStream("xyz");
		input.consume();
		let  m1 = input.mark();
		assertEquals(1, input.index());
		input.consume();
		input.consume();
		assertEquals("yz", input.getText(new  Interval(1, 2)));
	}

	@Test
public  testLastChar():  void {
		let  input = TestUnbufferedCharStream.createStream("abcdef");

		input.consume();
		assertEquals('a', input.LA(-1));

		let  m1 = input.mark();
		input.consume();
		input.consume();
		input.consume();
		assertEquals('d', input.LA(-1));

		input.seek(2);
		assertEquals('b', input.LA(-1));

		input.release(m1);
		input.seek(3);
		assertEquals('c', input.LA(-1));
		// this special case is not required by the IntStream interface, but
		// UnbufferedCharStream allows it so we have to make sure the resulting
		// state is consistent
		input.seek(2);
		assertEquals('b', input.LA(-1));
	}

	@Test
public  test1Char():  void {
		let  input = TestUnbufferedCharStream.createStream("x");
		assertEquals('x', input.LA(1));
		input.consume();
		assertEquals(java.util.stream.IntStream.EOF, input.LA(1));
		let  r = input.getRemainingBuffer();
		assertEquals("\uFFFF", r); // shouldn't include x
		assertEquals("\uFFFF", input.getBuffer()); // whole buffer
	}

	@Test
public  test2Char():  void {
		let  input = TestUnbufferedCharStream.createStream("xy");
		assertEquals('x', input.LA(1));
		input.consume();
		assertEquals('y', input.LA(1));
		assertEquals("y", input.getRemainingBuffer()); // shouldn't include x
		assertEquals("y", input.getBuffer());
		input.consume();
		assertEquals(java.util.stream.IntStream.EOF, input.LA(1));
		assertEquals("\uFFFF", input.getBuffer());
	}

    @Test
public  test2CharAhead():  void {
   		let  input = TestUnbufferedCharStream.createStream("xy");
   		assertEquals('x', input.LA(1));
   		assertEquals('y', input.LA(2));
   		assertEquals(java.util.stream.IntStream.EOF, input.LA(3));
   	}

    @Test
public  testBufferExpand():  void {
		let  input = TestUnbufferedCharStream.createStream("01234", 2);
   		assertEquals('0', input.LA(1));
        assertEquals('1', input.LA(2));
        assertEquals('2', input.LA(3));
        assertEquals('3', input.LA(4));
        assertEquals('4', input.LA(5));
		assertEquals("01234", input.getBuffer());
   		assertEquals(java.util.stream.IntStream.EOF, input.LA(6));
   	}

    @Test
public  testBufferWrapSize1():  void {
   		let  input = TestUnbufferedCharStream.createStream("01234", 1);
        assertEquals('0', input.LA(1));
        input.consume();
        assertEquals('1', input.LA(1));
        input.consume();
        assertEquals('2', input.LA(1));
        input.consume();
        assertEquals('3', input.LA(1));
        input.consume();
        assertEquals('4', input.LA(1));
        input.consume();
   		assertEquals(java.util.stream.IntStream.EOF, input.LA(1));
   	}

    @Test
public  testBufferWrapSize2():  void {
   		let  input = TestUnbufferedCharStream.createStream("01234", 2);
        assertEquals('0', input.LA(1));
        input.consume();
        assertEquals('1', input.LA(1));
        input.consume();
        assertEquals('2', input.LA(1));
        input.consume();
        assertEquals('3', input.LA(1));
        input.consume();
        assertEquals('4', input.LA(1));
        input.consume();
   		assertEquals(java.util.stream.IntStream.EOF, input.LA(1));
   	}

	@Test
public  test1Mark():  void {
		let  input = TestUnbufferedCharStream.createStream("xyz");
		let  m = input.mark();
		assertEquals('x', input.LA(1));
		assertEquals('y', input.LA(2));
		assertEquals('z', input.LA(3));
		input.release(m);
		assertEquals(java.util.stream.IntStream.EOF, input.LA(4));
		assertEquals("xyz\uFFFF", input.getBuffer());
	}

	@Test
public  test1MarkWithConsumesInSequence():  void {
		let  input = TestUnbufferedCharStream.createStream("xyz");
		let  m = input.mark();
		input.consume(); // x, moves to y
		input.consume(); // y
		input.consume(); // z, moves to EOF
		assertEquals(java.util.stream.IntStream.EOF, input.LA(1));
		assertEquals("xyz\uFFFF", input.getBuffer());
		input.release(m); // wipes buffer
		assertEquals("\uFFFF", input.getBuffer());
	}

    @Test
public  test2Mark():  void {
		let  input = TestUnbufferedCharStream.createStream("xyz", 100);
   		assertEquals('x', input.LA(1));
        input.consume(); // reset buffer index (p) to 0
        let  m1 = input.mark();
   		assertEquals('y', input.LA(1));
        input.consume();
        let  m2 = input.mark();
		assertEquals("yz", input.getBuffer());
        input.release(m2); // drop to 1 marker
        input.consume();
        input.release(m1); // shifts remaining char to beginning
   		assertEquals(java.util.stream.IntStream.EOF, input.LA(1));
		assertEquals("\uFFFF", input.getBuffer());
   	}

    @Test
public  testAFewTokens():  void {
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
		let  input = TestUnbufferedCharStream.createStream("x = 302 * 91 + 20234234 * 0;");
        let  lexEngine = g.createLexerInterpreter(input);
		// copy text into tokens from char stream
		lexEngine.setTokenFactory(new  CommonTokenFactory(true));
		let  tokens = new  CommonTokenStream(lexEngine);
        let  result = tokens.LT(1).getText();
        let  expecting = "x";
        assertEquals(expecting, result);
		tokens.fill();
		expecting =
			"[[@0,0:0='x',<1>,1:0], [@1,1:1=' ',<7>,1:1], [@2,2:2='=',<4>,1:2]," +
			" [@3,3:3=' ',<7>,1:3], [@4,4:6='302',<2>,1:4], [@5,7:7=' ',<7>,1:7]," +
			" [@6,8:8='*',<6>,1:8], [@7,9:9=' ',<7>,1:9], [@8,10:11='91',<2>,1:10]," +
			" [@9,12:12=' ',<7>,1:12], [@10,13:13='+',<5>,1:13], [@11,14:14=' ',<7>,1:14]," +
			" [@12,15:22='20234234',<2>,1:15], [@13,23:23=' ',<7>,1:23]," +
			" [@14,24:24='*',<6>,1:24], [@15,25:25=' ',<7>,1:25], [@16,26:26='0',<2>,1:26]," +
			" [@17,27:27=';',<3>,1:27], [@18,28:27='',<-1>,1:28]]";
		assertEquals(expecting, tokens.getTokens().toString());
    }

	@Test
public  testUnicodeSMP():  void {
		let  input = TestUnbufferedCharStream.createStream("\uD83C\uDF0E");
		assertEquals(0x1F30E, input.LA(1));
		assertEquals("\uD83C\uDF0E", input.getBuffer());
		input.consume();
		assertEquals(java.util.stream.IntStream.EOF, input.LA(1));
		assertEquals("\uFFFF", input.getBuffer());
	}

	@Test
public  testDanglingHighSurrogateAtEOFThrows():  void {
		assertThrows(RuntimeException.class, () => TestUnbufferedCharStream.createStream("\uD83C"));
	}

	@Test
public  testDanglingHighSurrogateThrows():  void {
		assertThrows(RuntimeException.class, () => TestUnbufferedCharStream.createStream("\uD83C\u0123"));
	}

	@Test
public  testDanglingLowSurrogateThrows():  void {
		assertThrows(RuntimeException.class, () => TestUnbufferedCharStream.createStream("\uDF0E"));
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TestUnbufferedCharStream {
	export type TestingUnbufferedCharStream = InstanceType<typeof TestUnbufferedCharStream.TestingUnbufferedCharStream>;
}


