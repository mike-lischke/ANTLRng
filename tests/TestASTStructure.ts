/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





export  class TestASTStructure {
	protected  lexerClassName = "org.antlr.v4.parse.ANTLRLexer";
	protected  parserClassName = "org.antlr.v4.parse.ANTLRParser";
	protected   adaptorClassName = "org.antlr.v4.parse.GrammarASTAdaptor";

	public  execParser(
	ruleName: string,
	input: string,
	scriptLine: number):  Object
	{
		let  is = new  ANTLRStringStream(input);
		let  lexerClass = Class.forName(this.lexerClassName).asSubclass(TokenSource.class);
		let  lexConstructor = lexerClass.getConstructor(CharStream.class);
		let  lexer = lexConstructor.newInstance(is);
		is.setLine(scriptLine);

		let  tokens = new  CommonTokenStream(lexer);

		let  parserClass = Class.forName(this.parserClassName).asSubclass(Parser.class);
		let  parConstructor = parserClass.getConstructor(TokenStream.class);
		let  parser = parConstructor.newInstance(tokens);

		// set up customized tree adaptor if necessary
		if ( this.adaptorClassName!==null ) {
			let  m = parserClass.getMethod("setTreeAdaptor", TreeAdaptor.class);
			let  adaptorClass = Class.forName(this.adaptorClassName).asSubclass(TreeAdaptor.class);
			m.invoke(parser, adaptorClass.newInstance());
		}

		let  ruleMethod = parserClass.getMethod(ruleName);

		// INVOKE RULE
		return ruleMethod.invoke(parser);
	}

	@Test
public  test_grammarSpec1():  void {
		// gunit test on line 15
		let  rstruct = this.execParser("grammarSpec", "parser grammar P; a : A;", 15) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(PARSER_GRAMMAR P (RULES (RULE a (BLOCK (ALT A)))))";
		assertEquals(expecting, actual, "testing rule grammarSpec");
	}

	@Test
public  test_grammarSpec2():  void {
		// gunit test on line 18
		let  rstruct = this.execParser("grammarSpec", "\n    parser grammar P;\n    tokens { A, B }\n    @header {foo}\n    a : A;\n    ", 18) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(PARSER_GRAMMAR P (tokens { A B) (@ header {foo}) (RULES (RULE a (BLOCK (ALT A)))))";
		assertEquals(expecting, actual, "testing rule grammarSpec");
	}

	@Test
public  test_grammarSpec3():  void {
		// gunit test on line 30
		let  rstruct = this.execParser("grammarSpec", "\n    parser grammar P;\n    @header {foo}\n    tokens { A,B }\n    a : A;\n    ", 30) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(PARSER_GRAMMAR P (@ header {foo}) (tokens { A B) (RULES (RULE a (BLOCK (ALT A)))))";
		assertEquals(expecting, actual, "testing rule grammarSpec");
	}

	@Test
public  test_grammarSpec4():  void {
		// gunit test on line 42
		let  rstruct = this.execParser("grammarSpec", "\n    parser grammar P;\n    import A=B, C;\n    a : A;\n    ", 42) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(PARSER_GRAMMAR P (import (= A B) C) (RULES (RULE a (BLOCK (ALT A)))))";
		assertEquals(expecting, actual, "testing rule grammarSpec");
	} @Test
public  test_delegateGrammars1():  void {
		// gunit test on line 53
		let  rstruct = this.execParser("delegateGrammars", "import A;", 53) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(import A)";
		assertEquals(expecting, actual, "testing rule delegateGrammars");
	} @Test
public  test_rule1():  void {
		// gunit test on line 56
		let  rstruct = this.execParser("rule", "a : A<X,Y=a.b.c>;", 56) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(RULE a (BLOCK (ALT (A (ELEMENT_OPTIONS X (= Y a.b.c))))))";
		assertEquals(expecting, actual, "testing rule rule");
	}

	@Test
public  test_rule2():  void {
		// gunit test on line 58
		let  rstruct = this.execParser("rule", "A : B+;", 58) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(RULE A (BLOCK (ALT (+ (BLOCK (ALT B))))))";
		assertEquals(expecting, actual, "testing rule rule");
	}

	@Test
public  test_rule3():  void {
		// gunit test on line 60
		let  rstruct = this.execParser("rule", "\n    a[int i] returns [int y]\n    @init {blort}\n      : ID ;\n    ", 60) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(RULE a int i (returns int y) (@ init {blort}) (BLOCK (ALT ID)))";
		assertEquals(expecting, actual, "testing rule rule");
	}

	@Test
public  test_rule4():  void {
		// gunit test on line 75
		let  rstruct = this.execParser("rule", "\n    a[int i] returns [int y]\n    @init {blort}\n    options {backtrack=true;}\n      : ID;\n    ", 75) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(RULE a int i (returns int y) (@ init {blort}) (OPTIONS (= backtrack true)) (BLOCK (ALT ID)))";
		assertEquals(expecting, actual, "testing rule rule");
	}

	@Test
public  test_rule5():  void {
		// gunit test on line 88
		let  rstruct = this.execParser("rule", "\n    a : ID ;\n      catch[A b] {foo}\n      finally {bar}\n    ", 88) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(RULE a (BLOCK (ALT ID)) (catch A b {foo}) (finally {bar}))";
		assertEquals(expecting, actual, "testing rule rule");
	}

	@Test
public  test_rule6():  void {
		// gunit test on line 97
		let  rstruct = this.execParser("rule", "\n    a : ID ;\n      catch[A a] {foo}\n      catch[B b] {fu}\n      finally {bar}\n    ", 97) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(RULE a (BLOCK (ALT ID)) (catch A a {foo}) (catch B b {fu}) (finally {bar}))";
		assertEquals(expecting, actual, "testing rule rule");
	}

	@Test
public  test_rule7():  void {
		// gunit test on line 107
		let  rstruct = this.execParser("rule", "\n\ta[int i]\n\tlocals [int a, float b]\n\t\t:\tA\n\t\t;\n\t", 107) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(RULE a int i (locals int a, float b) (BLOCK (ALT A)))";
		assertEquals(expecting, actual, "testing rule rule");
	}

	@Test
public  test_rule8():  void {
		// gunit test on line 115
		let  rstruct = this.execParser("rule", "\n\ta[int i] throws a.b.c\n\t\t:\tA\n\t\t;\n\t", 115) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(RULE a int i (throws a.b.c) (BLOCK (ALT A)))";
		assertEquals(expecting, actual, "testing rule rule");
	} @Test
public  test_ebnf1():  void {
		// gunit test on line 123
		let  rstruct = this.execParser("ebnf", "(A|B)", 123) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(BLOCK (ALT A) (ALT B))";
		assertEquals(expecting, actual, "testing rule ebnf");
	}

	@Test
public  test_ebnf2():  void {
		// gunit test on line 124
		let  rstruct = this.execParser("ebnf", "(A|B)?", 124) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(? (BLOCK (ALT A) (ALT B)))";
		assertEquals(expecting, actual, "testing rule ebnf");
	}

	@Test
public  test_ebnf3():  void {
		// gunit test on line 125
		let  rstruct = this.execParser("ebnf", "(A|B)*", 125) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(* (BLOCK (ALT A) (ALT B)))";
		assertEquals(expecting, actual, "testing rule ebnf");
	}

	@Test
public  test_ebnf4():  void {
		// gunit test on line 126
		let  rstruct = this.execParser("ebnf", "(A|B)+", 126) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(+ (BLOCK (ALT A) (ALT B)))";
		assertEquals(expecting, actual, "testing rule ebnf");
	} @Test
public  test_element1():  void {
		// gunit test on line 129
		let  rstruct = this.execParser("element", "~A", 129) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(~ (SET A))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element2():  void {
		// gunit test on line 130
		let  rstruct = this.execParser("element", "b+", 130) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(+ (BLOCK (ALT b)))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element3():  void {
		// gunit test on line 131
		let  rstruct = this.execParser("element", "(b)+", 131) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(+ (BLOCK (ALT b)))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element4():  void {
		// gunit test on line 132
		let  rstruct = this.execParser("element", "b?", 132) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(? (BLOCK (ALT b)))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element5():  void {
		// gunit test on line 133
		let  rstruct = this.execParser("element", "(b)?", 133) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(? (BLOCK (ALT b)))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element6():  void {
		// gunit test on line 134
		let  rstruct = this.execParser("element", "(b)*", 134) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(* (BLOCK (ALT b)))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element7():  void {
		// gunit test on line 135
		let  rstruct = this.execParser("element", "b*", 135) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(* (BLOCK (ALT b)))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element8():  void {
		// gunit test on line 136
		let  rstruct = this.execParser("element", "'while'*", 136) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(* (BLOCK (ALT 'while')))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element9():  void {
		// gunit test on line 137
		let  rstruct = this.execParser("element", "'a'+", 137) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(+ (BLOCK (ALT 'a')))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element10():  void {
		// gunit test on line 138
		let  rstruct = this.execParser("element", "a[3]", 138) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(a 3)";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element11():  void {
		// gunit test on line 139
		let  rstruct = this.execParser("element", "'a'..'z'+", 139) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(+ (BLOCK (ALT (.. 'a' 'z'))))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element12():  void {
		// gunit test on line 140
		let  rstruct = this.execParser("element", "x=ID", 140) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(= x ID)";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element13():  void {
		// gunit test on line 141
		let  rstruct = this.execParser("element", "x=ID?", 141) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(? (BLOCK (ALT (= x ID))))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element14():  void {
		// gunit test on line 142
		let  rstruct = this.execParser("element", "x=ID*", 142) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(* (BLOCK (ALT (= x ID))))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element15():  void {
		// gunit test on line 143
		let  rstruct = this.execParser("element", "x=b", 143) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(= x b)";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element16():  void {
		// gunit test on line 144
		let  rstruct = this.execParser("element", "x=(A|B)", 144) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(= x (BLOCK (ALT A) (ALT B)))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element17():  void {
		// gunit test on line 145
		let  rstruct = this.execParser("element", "x=~(A|B)", 145) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(= x (~ (SET A B)))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element18():  void {
		// gunit test on line 146
		let  rstruct = this.execParser("element", "x+=~(A|B)", 146) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(+= x (~ (SET A B)))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element19():  void {
		// gunit test on line 147
		let  rstruct = this.execParser("element", "x+=~(A|B)+", 147) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(+ (BLOCK (ALT (+= x (~ (SET A B))))))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element20():  void {
		// gunit test on line 148
		let  rstruct = this.execParser("element", "x=b+", 148) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(+ (BLOCK (ALT (= x b))))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element21():  void {
		// gunit test on line 149
		let  rstruct = this.execParser("element", "x+=ID*", 149) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(* (BLOCK (ALT (+= x ID))))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element22():  void {
		// gunit test on line 150
		let  rstruct = this.execParser("element", "x+='int'*", 150) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(* (BLOCK (ALT (+= x 'int'))))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element23():  void {
		// gunit test on line 151
		let  rstruct = this.execParser("element", "x+=b+", 151) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(+ (BLOCK (ALT (+= x b))))";
		assertEquals(expecting, actual, "testing rule element");
	}

	@Test
public  test_element24():  void {
		// gunit test on line 152
		let  rstruct = this.execParser("element", "({blort} 'x')*", 152) as RuleReturnScope;
		let  actual = (rstruct.getTree() as Tree).toStringTree();
		let  expecting = "(* (BLOCK (ALT {blort} 'x')))";
		assertEquals(expecting, actual, "testing rule element");
	}
}
