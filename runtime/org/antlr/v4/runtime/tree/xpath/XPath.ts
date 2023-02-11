/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject, S } from "jree";
import { XPathElement } from "./XPathElement";
import { XPathLexer } from "./XPathLexer";
import { XPathLexerErrorListener } from "./XPathLexerErrorListener";
import { XPathRuleAnywhereElement } from "./XPathRuleAnywhereElement";
import { XPathRuleElement } from "./XPathRuleElement";
import { XPathTokenAnywhereElement } from "./XPathTokenAnywhereElement";
import { XPathTokenElement } from "./XPathTokenElement";
import { XPathWildcardAnywhereElement } from "./XPathWildcardAnywhereElement";
import { XPathWildcardElement } from "./XPathWildcardElement";
import { ANTLRInputStream } from "../../ANTLRInputStream";
import { CommonTokenStream } from "../../CommonTokenStream";
import { LexerNoViableAltException } from "../../LexerNoViableAltException";
import { Parser } from "../../Parser";
import { ParserRuleContext } from "../../ParserRuleContext";
import { Token } from "../../Token";
import { ParseTree } from "../ParseTree";




/**
 * Represent a subset of XPath XML path syntax for use in identifying nodes in
 * parse trees.
 *
 * <p>
 * Split path into words and separators {@code /} and {@code //} via ANTLR
 * itself then walk path elements from left to right. At each separator-word
 * pair, find set of nodes. Next stage uses those as work list.</p>
 *
 * <p>
 * The basic interface is
 * {@link XPath#findAll ParseTree.findAll}{@code (tree, pathString, parser)}.
 * But that is just shorthand for:</p>
 *
 * <pre>
 * {@link XPath} p = new {@link XPath#XPath XPath}(parser, pathString);
 * return p.{@link #evaluate evaluate}(tree);
 * </pre>
 *
 * <p>
 * See {@code org.antlr.v4.test.TestXPath} for descriptions. In short, this
 * allows operators:</p>
 *
 * <dl>
 * <dt>/</dt> <dd>root</dd>
 * <dt>//</dt> <dd>anywhere</dd>
 * <dt>!</dt> <dd>invert; this must appear directly after root or anywhere
 * operator</dd>
 * </dl>
 *
 * <p>
 * and path elements:</p>
 *
 * <dl>
 * <dt>ID</dt> <dd>token name</dd>
 * <dt>'string'</dt> <dd>any string literal token from the grammar</dd>
 * <dt>expr</dt> <dd>rule name</dd>
 * <dt>*</dt> <dd>wildcard matching any node</dd>
 * </dl>
 *
 * <p>
 * Whitespace is not allowed.</p>
 */
export  class XPath extends JavaObject {
	public static readonly WILDCARD:  java.lang.String | null = S`*`; // word not operator/separator
	public static readonly NOT:  java.lang.String | null = S`!`; 	   // word for invert operator

	protected path:  java.lang.String | null;
	protected elements:  XPathElement[] | null;
	protected parser:  Parser | null;

	public constructor(parser: Parser| null, path: java.lang.String| null) {
		super();
this.parser = parser;
		this.path = path;
		this.elements = this.split(path);
//		System.out.println(Arrays.toString(elements));
	}

	// TODO: check for invalid token/rule names, bad syntax

	public split = (path: java.lang.String| null):  XPathElement[] | null => {
		let  in: ANTLRInputStream;
		try {
			in = new  ANTLRInputStream(new  StringReader(path));
		} catch (ioe) {
if (ioe instanceof java.io.IOException) {
			throw new  java.lang.IllegalArgumentException(S`Could not read path: `+path, ioe);
		} else {
	throw ioe;
	}
}
		let  lexer: XPathLexer = new  class extends XPathLexer {
			public recover = (e: LexerNoViableAltException| null):  void => { throw e;	}
		}(in);
		lexer.removeErrorListeners();
		lexer.addErrorListener(new  XPathLexerErrorListener());
		let  tokenStream: CommonTokenStream = new  CommonTokenStream(lexer);
		try {
			tokenStream.fill();
		} catch (e) {
if (e instanceof LexerNoViableAltException) {
			let  pos: number = lexer.getCharPositionInLine();
			let  msg: java.lang.String = S`Invalid tokens or characters at index `+pos+S` in path '`+path+S`'`;
			throw new  java.lang.IllegalArgumentException(msg, e);
		} else {
	throw e;
	}
}

		let  tokens: java.util.List<Token> = tokenStream.getTokens();
//		System.out.println("path="+path+"=>"+tokens);
		let  elements: java.util.List<XPathElement> = new  java.util.ArrayList<XPathElement>();
		let  n: number = tokens.size();
		let  i: number=0;
loop:
		while ( i<n ) {
			let  el: Token = tokens.get(i);
			let  next: Token = null;
			switch ( el.getType() ) {
				case XPathLexer.ROOT :
				case XPathLexer.ANYWHERE :{
					let  anywhere: boolean = el.getType() === XPathLexer.ANYWHERE;
					i++;
					next = tokens.get(i);
					let  invert: boolean = next.getType()===XPathLexer.BANG;
					if ( invert ) {
						i++;
						next = tokens.get(i);
					}
					let  pathElement: XPathElement = this.getXPathElement(next, anywhere);
					pathElement.invert = invert;
					elements.add(pathElement);
					i++;
					break;
}


				case XPathLexer.TOKEN_REF :
				case XPathLexer.RULE_REF :
				case XPathLexer.WILDCARD :{
					elements.add( this.getXPathElement(el, false) );
					i++;
					break;
}


				case Token.EOF :{
					break loop;
}


				default :{
					throw new  java.lang.IllegalArgumentException(S`Unknowth path element `+el);
}

			}
		}
		return elements.toArray(new   Array<XPathElement>(0));
	}

	/**
	 * Convert word like {@code *} or {@code ID} or {@code expr} to a path
	 * element. {@code anywhere} is `true` if {@code //} precedes the
	 * word.
	 */
	protected getXPathElement = (wordToken: Token| null, anywhere: boolean):  XPathElement | null => {
		if ( wordToken.getType()===Token.EOF ) {
			throw new  java.lang.IllegalArgumentException(S`Missing path element at end of path`);
		}
		let  word: java.lang.String = wordToken.getText();
		let  ttype: number = this.parser.getTokenType(word);
		let  ruleIndex: number = this.parser.getRuleIndex(word);
		switch ( wordToken.getType() ) {
			case XPathLexer.WILDCARD :{
				return anywhere ?
					new  XPathWildcardAnywhereElement() :
					new  XPathWildcardElement();
}

			case XPathLexer.TOKEN_REF :
			case XPathLexer.STRING :{
				if ( ttype===Token.INVALID_TYPE ) {
					throw new  java.lang.IllegalArgumentException(word+
													   S` at index `+
													   wordToken.getStartIndex()+
													   S` isn't a valid token name`);
				}
				return anywhere ?
					new  XPathTokenAnywhereElement(word, ttype) :
					new  XPathTokenElement(word, ttype);
}

			default :{
				if ( ruleIndex===-1 ) {
					throw new  java.lang.IllegalArgumentException(word+
													   S` at index `+
													   wordToken.getStartIndex()+
													   S` isn't a valid rule name`);
				}
				return anywhere ?
					new  XPathRuleAnywhereElement(word, ruleIndex) :
					new  XPathRuleElement(word, ruleIndex);
}

		}
	}


	public static findAll = (tree: ParseTree| null, xpath: java.lang.String| null, parser: Parser| null):  java.util.Collection<ParseTree> | null => {
		let  p: XPath = new  XPath(parser, xpath);
		return p.evaluate(tree);
	}

	/**
	 * Return a list of all nodes starting at {@code t} as root that satisfy the
	 * path. The root {@code /} is relative to the node passed to
	 * {@link #evaluate}.
	 */
	public evaluate = (/* final */  t: ParseTree| null):  java.util.Collection<ParseTree> | null => {
		let  dummyRoot: ParserRuleContext = new  ParserRuleContext();
		dummyRoot.children = java.util.Collections.singletonList(t); // don't set t's parent.

		let  work: java.util.Collection<ParseTree> = java.util.Collections.<ParseTree>singleton(dummyRoot);

		let  i: number = 0;
		while ( i < this.elements.length ) {
			let  next: java.util.Collection<ParseTree> = new  java.util.LinkedHashSet<ParseTree>();
			for (let node of work) {
				if ( node.getChildCount()>0 ) {
					// only try to match next element if it has children
					// e.g., //func/*/stat might have a token node for which
					// we can't go looking for stat nodes.
					let  matching: java.util.Collection< ParseTree> = this.elements[i].evaluate(node);
					next.addAll(matching);
				}
			}
			i++;
			work = next;
		}

		return work;
	}
}
