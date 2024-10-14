/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





export  class TestDollarParser {
	@Test
public  testSimpleCall():  void {
		let  grammar = "grammar T;\n" +
                      "a : ID  { outStream.println(new java.io.File($parser.getSourceName()).getAbsolutePath()); }\n" +
                      "  ;\n" +
                      "ID : 'a'..'z'+ ;\n";
		let  executedState = execParser("T.g4", grammar, "TParser", "TLexer", "a", "x", true);
		assertTrue(executedState.output.contains("input"));
		assertEquals("", executedState.errors);
	}
}
