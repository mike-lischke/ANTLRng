/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java, JavaObject, type int } from "jree";
import { ANTLRInputStream, BaseErrorListener, CommonTokenStream, RecognitionException, Recognizer, AbstractParseTreeVisitor, ErrorNode, RuleNode, TerminalNode } from "antlr4ng";

type String = java.lang.String;
const String = java.lang.String;
type List<E> = java.util.List<E>;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
type RuntimeException = java.lang.RuntimeException;
const RuntimeException = java.lang.RuntimeException;
type Integer = java.lang.Integer;
const Integer = java.lang.Integer;

import { Test, Override } from "../../../../../../../../decorators.js";


export  class TestVisitors extends JavaObject {

	/**
	 * This test verifies the basic behavior of visitors, with an emphasis on
	 * {@link AbstractParseTreeVisitor#visitTerminal}.
	 */
	@Test
public  testVisitTerminalNode():  void {
		let  input = "A";
		let  lexer = new  VisitorBasicLexer(new  ANTLRInputStream(input));
		let  parser = new  VisitorBasicParser(new  CommonTokenStream(lexer));

		let  context = parser.s();
		assertEquals("(s A <EOF>)", context.toStringTree(parser));

		let  listener = new  class extends VisitorBasicBaseVisitor<String> {
			@Override
public  visitTerminal(node: TerminalNode):  String {
				return node.getSymbol().toString() + "\n";
			}

			@Override
protected  defaultResult():  String {
				return "";
			}

			@Override
protected  aggregateResult(aggregate: String, nextResult: String):  String {
				return aggregate + nextResult;
			}
		}();

		let  result = listener.visit(context);
		let  expected =
			"[@0,0:0='A',<1>,1:0]\n" +
			"[@1,1:0='<EOF>',<-1>,1:1]\n";
		assertEquals(expected, result);
	}

	/**
	 * This test verifies the basic behavior of visitors, with an emphasis on
	 * {@link AbstractParseTreeVisitor#visitErrorNode}.
	 */
	@Test
public  testVisitErrorNode():  void {
		let  input = "";
		let  lexer = new  VisitorBasicLexer(new  ANTLRInputStream(input));
		let  parser = new  VisitorBasicParser(new  CommonTokenStream(lexer));

		 let  errors = new  ArrayList();
		parser.removeErrorListeners();
		parser.addErrorListener(new  class extends BaseErrorListener {
			@Override
public  syntaxError(recognizer: Recognizer<unknown, unknown>, offendingSymbol: java.lang.Object, line: int, charPositionInLine: int, msg: String, e: RecognitionException):  void {
				errors.add("line " + line + ":" + charPositionInLine + " " + msg);
			}
		}());

		let  context = parser.s();
		assertEquals("(s <missing 'A'> <EOF>)", context.toStringTree(parser));
		assertEquals(1, errors.size());
		assertEquals("line 1:0 missing 'A' at '<EOF>'", errors.get(0));

		let  listener = new  class extends VisitorBasicBaseVisitor<String> {
			@Override
public  visitErrorNode(node: ErrorNode):  String {
				return "Error encountered: " + node.getSymbol();
			}

			@Override
protected  defaultResult():  String {
				return "";
			}

			@Override
protected  aggregateResult(aggregate: String, nextResult: String):  String {
				return aggregate + nextResult;
			}
		}();

		let  result = listener.visit(context);
		let  expected = "Error encountered: [@-1,-1:-1='<missing 'A'>',<1>,1:0]";
		assertEquals(expected, result);
	}

	/**
	 * This test verifies that {@link AbstractParseTreeVisitor#visitChildren} does not call
	 * {@link org.antlr.v4.runtime.tree.ParseTreeVisitor#visit} after
	 * {@link org.antlr.v4.runtime.tree.AbstractParseTreeVisitor#shouldVisitNextChild} returns
	 * {@code false}.
	 */
	@Test
public  testShouldNotVisitEOF():  void {
		let  input = "A";
		let  lexer = new  VisitorBasicLexer(new  ANTLRInputStream(input));
		let  parser = new  VisitorBasicParser(new  CommonTokenStream(lexer));

		let  context = parser.s();
		assertEquals("(s A <EOF>)", context.toStringTree(parser));

		let  listener = new  class extends VisitorBasicBaseVisitor<String> {
			@Override
public  visitTerminal(node: TerminalNode):  String {
				return node.getSymbol().toString() + "\n";
			}

			@Override
protected  shouldVisitNextChild(node: RuleNode, currentResult: String):  boolean {
				return currentResult === null || currentResult.isEmpty();
			}
		}();

		let  result = listener.visit(context);
		let  expected = "[@0,0:0='A',<1>,1:0]\n";
		assertEquals(expected, result);
	}

	/**
	 * This test verifies that {@link AbstractParseTreeVisitor#shouldVisitNextChild} is called before visiting the first
	 * child. It also verifies that {@link AbstractParseTreeVisitor#defaultResult} provides the default return value for
	 * visiting a tree.
	 */
	@Test
public  testShouldNotVisitTerminal():  void {
		let  input = "A";
		let  lexer = new  VisitorBasicLexer(new  ANTLRInputStream(input));
		let  parser = new  VisitorBasicParser(new  CommonTokenStream(lexer));

		let  context = parser.s();
		assertEquals("(s A <EOF>)", context.toStringTree(parser));

		let  listener = new  class extends VisitorBasicBaseVisitor<String> {
			@Override
public  visitTerminal(node: TerminalNode):  String {
				throw new  RuntimeException("Should not be reachable");
			}

			@Override
protected  defaultResult():  String {
				return "default result";
			}

			@Override
protected  shouldVisitNextChild(node: RuleNode, currentResult: String):  boolean {
				return false;
			}
		}();

		let  result = listener.visit(context);
		let  expected = "default result";
		assertEquals(expected, result);
	}

	/**
	 * This test verifies that the visitor correctly dispatches calls for labeled outer alternatives.
	 */
	@Test
public  testCalculatorVisitor():  void {
		let  input = "2 + 8 / 2";
		let  lexer = new  VisitorCalcLexer(new  ANTLRInputStream(input));
		let  parser = new  VisitorCalcParser(new  CommonTokenStream(lexer));

		let  context = parser.s();
		assertEquals("(s (expr (expr 2) + (expr (expr 8) / (expr 2))) <EOF>)", context.toStringTree(parser));

		let  listener = new  class extends VisitorCalcBaseVisitor<Integer> {
			@Override
public  visitS(ctx: VisitorCalcParser.SContext):  Integer {
				return AbstractParseTreeVisitor.visit(ctx.expr());
			}

			@Override
public  visitNumber(ctx: VisitorCalcParser.NumberContext):  Integer {
				return Integer.valueOf(ctx.INT().getText());
			}

			@Override
public  visitMultiply(ctx: VisitorCalcParser.MultiplyContext):  Integer {
				let  left = AbstractParseTreeVisitor.visit(ctx.expr(0));
				let  right = AbstractParseTreeVisitor.visit(ctx.expr(1));
				if (ctx.MUL() !== null) {
					return left * right;
				}
				else {
					return left / right;
				}
			}

			@Override
public  visitAdd(ctx: VisitorCalcParser.AddContext):  Integer {
				let  left = AbstractParseTreeVisitor.visit(ctx.expr(0));
				let  right = AbstractParseTreeVisitor.visit(ctx.expr(1));
				if (ctx.ADD() !== null) {
					return left + right;
				}
				else {
					return left - right;
				}
			}

			@Override
protected  defaultResult():  Integer {
				throw new  RuntimeException("Should not be reachable");
			}

			@Override
protected  aggregateResult(aggregate: Integer, nextResult: Integer):  Integer {
				throw new  RuntimeException("Should not be reachable");
			}
		}();

		let  result = listener.visit(context);
		let  expected = 6;
		assertEquals(expected, result);
	}

}
