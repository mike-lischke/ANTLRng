/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





/** */
export  class TestActionTranslation {
	protected  attributeTemplate =
		"attributeTemplate(members,init,inline,finally,inline2) ::= <<\n" +
		"parser grammar A;\n"+
		"@members {#members#<members>#end-members#}\n" +
		"a[int x, int x1] returns [int y]\n" +
		"@init {#init#<init>#end-init#}\n" +
		"    :   id=ID ids+=ID lab=b[34] c d {\n" +
		"		 #inline#<inline>#end-inline#\n" +
		"		 }\n" +
		"		 c\n" +
		"    ;\n" +
		"    finally {#finally#<finally>#end-finally#}\n" +
		"b[int d] returns [int e]\n" +
		"    :   {#inline2#<inline2>#end-inline2#}\n" +
		"    ;\n" +
		"c returns [int x, int y] : ;\n" +
		"d	 :   ;\n" +
		">>";

	private static  testActions(templates: string, actionName: string, action: string, expected: string):  void {
		let  lp = templates.indexOf('(');
		let  name = templates.substring(0, lp);
		let  group = new  STGroupString(templates);
		let  st = group.getInstanceOf(name);
		st.add(actionName, action);
		let  grammar = st.render();
		let  equeue = new  ErrorQueue();
		let  g = new  Grammar(grammar, equeue);
		if ( g.ast!==null && !g.ast.hasErrors ) {
			let  sem = new  SemanticPipeline(g);
			sem.process();

			let  factory = new  ParserATNFactory(g);
			if ( g.isLexer() ) {
 factory = new  LexerATNFactory(g as LexerGrammar);
}

			g.atn = factory.createATN();

			let  anal = new  AnalysisPipeline(g);
			anal.process();

			let  gen = CodeGenerator.create(g);
			let  outputFileST = gen.generateParser(false);
			let  output = outputFileST.render();
			//System.out.println(output);
			let  b = "#" + actionName + "#";
			let  start = output.indexOf(b);
			let  e = "#end-" + actionName + "#";
			let  end = output.indexOf(e);
			let  snippet = output.substring(start+b.length(),end);
			assertEquals(expected, snippet);
		}
		if ( equeue.size()>0 ) {
//			System.err.println(equeue.toString());
		}
	}

    @Test
public  testEscapedLessThanInAction():  void {
        let  action = "i<3; '<xmltag>'";
		let  expected = "i<3; '<xmltag>'";
		TestActionTranslation.testActions(this.attributeTemplate, "members", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "init", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "finally", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline2", action, expected);
    }

    @Test
public  testEscaped$InAction():  void {
		let  action = "int \\$n; \"\\$in string\\$\"";
		let  expected = "int $n; \"$in string$\"";
		TestActionTranslation.testActions(this.attributeTemplate, "members", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "init", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "finally", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline2", action, expected);
    }

	/**
	 * Regression test for "in antlr v4 lexer, $ translation issue in action".
	 * https://github.com/antlr/antlr4/issues/176
	 */
	@Test
public  testUnescaped$InAction():  void {
		let  action = "\\$string$";
		let  expected = "$string$";
		TestActionTranslation.testActions(this.attributeTemplate, "members", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "init", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "finally", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline2", action, expected);
	}

	@Test
public  testEscapedSlash():  void {
		let  action   = "x = '\\n';";  // x = '\n'; -> x = '\n';
		let  expected = "x = '\\n';";
		TestActionTranslation.testActions(this.attributeTemplate, "members", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "init", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "finally", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline2", action, expected);
	}

	@Test
public  testComplicatedArgParsing():  void {
		let  action = "x, (*a).foo(21,33), 3.2+1, '\\n', "+
						"\"a,oo\\nick\", {bl, \"fdkj\"eck}";
		let  expected = "x, (*a).foo(21,33), 3.2+1, '\\n', "+
						"\"a,oo\\nick\", {bl, \"fdkj\"eck}";
		TestActionTranslation.testActions(this.attributeTemplate, "members", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "init", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "finally", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline2", action, expected);
	}

	@Test
public  testComplicatedArgParsingWithTranslation():  void {
		let  action = "x, $ID.text+\"3242\", (*$ID).foo(21,33), 3.2+1, '\\n', "+
						"\"a,oo\\nick\", {bl, \"fdkj\"eck}";
		let  expected =
			"x, (((AContext)_localctx).ID!=null?((AContext)_localctx).ID.getText():null)+\"3242\", " +
			"(*((AContext)_localctx).ID).foo(21,33), 3.2+1, '\\n', \"a,oo\\nick\", {bl, \"fdkj\"eck}";
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
	}

	@Test
public  testArguments():  void {
		let  action = "$x; $ctx.x";
		let  expected = "_localctx.x; _localctx.x";
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
	}

	@Test
public  testReturnValue():  void {
		let  action = "$y; $ctx.y";
		let  expected = "_localctx.y; _localctx.y";
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
	}

	@Test
public  testReturnValueWithNumber():  void {
		let  action = "$ctx.x1";
		let  expected = "_localctx.x1";
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
	}

	@Test
public  testReturnValuesCurrentRule():  void {
		let  action = "$y; $ctx.y;";
		let  expected = "_localctx.y; _localctx.y;";
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
	}

	@Test
public  testReturnValues():  void {
		let  action = "$lab.e; $b.e; $y.e = \"\";";
		let  expected = "((AContext)_localctx).lab.e; ((AContext)_localctx).b.e; _localctx.y.e = \"\";";
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
	}

    @Test
public  testReturnWithMultipleRuleRefs():  void {
		let  action = "$c.x; $c.y;";
		let  expected = "((AContext)_localctx).c.x; ((AContext)_localctx).c.y;";
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
    }

    @Test
public  testTokenRefs():  void {
		let  action = "$id; $ID; $id.text; $id.getText(); $id.line;";
		let  expected = "((AContext)_localctx).id; ((AContext)_localctx).ID; (((AContext)_localctx).id!=null?((AContext)_localctx).id.getText():null); ((AContext)_localctx).id.getText(); (((AContext)_localctx).id!=null?((AContext)_localctx).id.getLine():0);";
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
    }

    @Test
public  testRuleRefs():  void {
        let  action = "$lab.start; $c.text;";
		let  expected = "(((AContext)_localctx).lab!=null?(((AContext)_localctx).lab.start):null); (((AContext)_localctx).c!=null?_input.getText(((AContext)_localctx).c.start,((AContext)_localctx).c.stop):null);";
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
    }

    /** Added in response to https://github.com/antlr/antlr4/issues/1211 */
	@Test
public  testUnknownAttr():  void {
		let  action = "$qqq.text";
		let  expected = ""; // was causing an exception
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
	}

	/**
	 * Regression test for issue #1295
     * $e.v yields incorrect value 0 in "e returns [int v] : '1' {$v = 1;} | '(' e ')' {$v = $e.v;} ;"
	 * https://github.com/antlr/antlr4/issues/1295
	 */
	@Test
public  testRuleRefsRecursive():  void {
        let  recursiveTemplate =
            "recursiveTemplate(inline) ::= <<\n" +
            "parser grammar A;\n"+
            "e returns [int v]\n" +
            "    :   INT {$v = $INT.int;}\n" +
            "    |   '(' e ')' {\n" +
            "		 #inline#<inline>#end-inline#\n" +
            "		 }\n" +
            "    ;\n" +
            ">>";
        let  leftRecursiveTemplate =
            "recursiveTemplate(inline) ::= <<\n" +
            "parser grammar A;\n"+
            "e returns [int v]\n" +
            "    :   a=e op=('*'|'/') b=e  {$v = eval($a.v, $op.type, $b.v);}\n" +
            "    |   INT {$v = $INT.int;}\n" +
            "    |   '(' e ')' {\n" +
            "		 #inline#<inline>#end-inline#\n" +
            "		 }\n" +
            "    ;\n" +
            ">>";
        // ref to value returned from recursive call to rule
        let  action = "$v = $e.v;";
		let  expected = "((EContext)_localctx).v =  ((EContext)_localctx).e.v;";
		TestActionTranslation.testActions(recursiveTemplate, "inline", action, expected);
		TestActionTranslation.testActions(leftRecursiveTemplate, "inline", action, expected);
        // ref to predefined attribute obtained from recursive call to rule
        action = "$v = $e.text.length();";
        expected = "((EContext)_localctx).v =  (((EContext)_localctx).e!=null?_input.getText(((EContext)_localctx).e.start,((EContext)_localctx).e.stop):null).length();";
		TestActionTranslation.testActions(recursiveTemplate, "inline", action, expected);
		TestActionTranslation.testActions(leftRecursiveTemplate, "inline", action, expected);
	}

	@Test
public  testRefToTextAttributeForCurrentRule():  void {
        let  action = "$ctx.text; $text";

		// this is the expected translation for all cases
		let  expected =
			"_localctx.text; _input.getText(_localctx.start, _input.LT(-1))";

		TestActionTranslation.testActions(this.attributeTemplate, "init", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "inline", action, expected);
		TestActionTranslation.testActions(this.attributeTemplate, "finally", action, expected);
    }

    @Test
public  testEmptyActions():  void {
	    let  gS =
	   		"grammar A;\n"+
	   		"a[] : 'a' ;\n" +
	   		"c : a[] c[] ;\n";
	    let  g = new  Grammar(gS);
    }
}
