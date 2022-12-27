/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */




import { java } from "../../../../../../../lib/java/java";
import { Chunk } from "./Chunk";
import { ParseTreeMatch } from "./ParseTreeMatch";
import { ParseTreePattern } from "./ParseTreePattern";
import { RuleTagToken } from "./RuleTagToken";
import { TagChunk } from "./TagChunk";
import { TextChunk } from "./TextChunk";
import { TokenTagToken } from "./TokenTagToken";
import { ANTLRInputStream } from "../../ANTLRInputStream";
import { BailErrorStrategy } from "../../BailErrorStrategy";
import { CommonTokenStream } from "../../CommonTokenStream";
import { Lexer } from "../../Lexer";
import { ListTokenSource } from "../../ListTokenSource";
import { Parser } from "../../Parser";
import { ParserInterpreter } from "../../ParserInterpreter";
import { ParserRuleContext } from "../../ParserRuleContext";
import { RecognitionException } from "../../RecognitionException";
import { Token } from "../../Token";
import { MultiMap } from "../../misc/MultiMap";
import { ParseCancellationException } from "../../misc/ParseCancellationException";
import { ParseTree } from "../ParseTree";
import { RuleNode } from "../RuleNode";
import { TerminalNode } from "../TerminalNode";


import { JavaObject } from "../../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../../lib/templates";


/**
 * A tree pattern matching mechanism for ANTLR {@link ParseTree}s.
 *
 * <p>Patterns are strings of source input text with special tags representing
 * token or rule references such as:</p>
 *
 * <p>{@code <ID> = <expr>;}</p>
 *
 * <p>Given a pattern start rule such as {@code statement}, this object constructs
 * a {@link ParseTree} with placeholders for the {@code ID} and {@code expr}
 * subtree. Then the {@link #match} routines can compare an actual
 * {@link ParseTree} from a parse with this pattern. Tag {@code <ID>} matches
 * any {@code ID} token and tag {@code <expr>} references the result of the
 * {@code expr} rule (generally an instance of {@code ExprContext}.</p>
 *
 * <p>Pattern {@code x = 0;} is a similar pattern that matches the same pattern
 * except that it requires the identifier to be {@code x} and the expression to
 * be {@code 0}.</p>
 *
 * <p>The {@link #matches} routines return {@code true} or {@code false} based
 * upon a match for the tree rooted at the parameter sent in. The
 * {@link #match} routines return a {@link ParseTreeMatch} object that
 * contains the parse tree, the parse tree pattern, and a map from tag name to
 * matched nodes (more below). A subtree that fails to match, returns with
 * {@link ParseTreeMatch#mismatchedNode} set to the first tree node that did not
 * match.</p>
 *
 * <p>For efficiency, you can compile a tree pattern in string form to a
 * {@link ParseTreePattern} object.</p>
 *
 * <p>See {@code TestParseTreeMatcher} for lots of examples.
 * {@link ParseTreePattern} has two static helper methods:
 * {@link ParseTreePattern#findAll} and {@link ParseTreePattern#match} that
 * are easy to use but not super efficient because they create new
 * {@link ParseTreePatternMatcher} objects each time and have to compile the
 * pattern in string form before using it.</p>
 *
 * <p>The lexer and parser that you pass into the {@link ParseTreePatternMatcher}
 * constructor are used to parse the pattern in string form. The lexer converts
 * the {@code <ID> = <expr>;} into a sequence of four tokens (assuming lexer
 * throws out whitespace or puts it on a hidden channel). Be aware that the
 * input stream is reset for the lexer (but not the parser; a
 * {@link ParserInterpreter} is created to parse the input.). Any user-defined
 * fields you have put into the lexer might get changed when this mechanism asks
 * it to scan the pattern string.</p>
 *
 * <p>Normally a parser does not accept token {@code <expr>} as a valid
 * {@code expr} but, from the parser passed in, we create a special version of
 * the underlying grammar representation (an {@link ATN}) that allows imaginary
 * tokens representing rules ({@code <expr>}) to match entire rules. We call
 * these <em>bypass alternatives</em>.</p>
 *
 * <p>Delimiters are {@code <} and {@code >}, with {@code \} as the escape string
 * by default, but you can set them to whatever you want using
 * {@link #setDelimiters}. You must escape both start and stop strings
 * {@code \<} and {@code \>}.</p>
 */
export  class ParseTreePatternMatcher extends JavaObject {
	public static CannotInvokeStartRule =  class CannotInvokeStartRule extends java.lang.RuntimeException {
		public constructor(e: java.lang.Throwable| null) {
			super(e);
		}
	};


	// Fixes https://github.com/antlr/antlr4/issues/413
	// "Tree pattern compilation doesn't check for a complete parse"
	public static StartRuleDoesNotConsumeFullPattern =  class StartRuleDoesNotConsumeFullPattern extends java.lang.RuntimeException {
	};


	/**
	 * This is the backing field for {@link #getLexer()}.
	 */
	private readonly  lexer:  Lexer | null;

	/**
	 * This is the backing field for {@link #getParser()}.
	 */
	private readonly  parser:  Parser | null;

	protected start:  java.lang.String | null = S`<`;
	protected stop:  java.lang.String | null = S`>`;
	protected escape:  java.lang.String | null = S`\\`; // e.g., \< and \> must escape BOTH!

	/**
	 * Constructs a {@link ParseTreePatternMatcher} or from a {@link Lexer} and
	 * {@link Parser} object. The lexer input stream is altered for tokenizing
	 * the tree patterns. The parser is used as a convenient mechanism to get
	 * the grammar name, plus token, rule names.
	 */
	public constructor(lexer: Lexer| null, parser: Parser| null) {
		super();
this.lexer = lexer;
		this.parser = parser;
	}

	/**
	 * Set the delimiters used for marking rule and token tags within concrete
	 * syntax used by the tree pattern parser.
	 *
	 * @param start The start delimiter.
	 * @param stop The stop delimiter.
	 * @param escapeLeft The escape sequence to use for escaping a start or stop delimiter.
	 *
	 * @exception IllegalArgumentException if {@code start} is {@code null} or empty.
	 * @exception IllegalArgumentException if {@code stop} is {@code null} or empty.
	 */
	public setDelimiters = (start: java.lang.String| null, stop: java.lang.String| null, escapeLeft: java.lang.String| null):  void => {
		if (start === null || start.isEmpty()) {
			throw new  java.lang.IllegalArgumentException(S`start cannot be null or empty`);
		}

		if (stop === null || stop.isEmpty()) {
			throw new  java.lang.IllegalArgumentException(S`stop cannot be null or empty`);
		}

		this.start = start;
		this.stop = stop;
		this.escape = escapeLeft;
	}

	/** Does {@code pattern} matched as rule patternRuleIndex match tree? Pass in a
	 *  compiled pattern instead of a string representation of a tree pattern.
	 */
	public matches(tree: ParseTree| null, pattern: ParseTreePattern| null):  boolean;

	/** Does {@code pattern} matched as rule {@code patternRuleIndex} match {@code tree}? */
	public matches(tree: ParseTree| null, pattern: java.lang.String| null, patternRuleIndex: number):  boolean;


	/** Does {@code pattern} matched as rule {@code patternRuleIndex} match {@code tree}? */
	public matches(tree: ParseTree | null, pattern: ParseTreePattern | java.lang.String | null, patternRuleIndex?: number):  boolean {
if (pattern instanceof ParseTreePattern && patternRuleIndex === undefined) {
		let  labels: MultiMap<java.lang.String, ParseTree> = new  MultiMap<java.lang.String, ParseTree>();
		let  mismatchedNode: ParseTree = this.matchImpl(tree, pattern.getPatternTree(), labels);
		return mismatchedNode === null;
	}
 else  {
		let  p: ParseTreePattern = this.compile(pattern, patternRuleIndex);
		return this.matches(tree, p);
	}

}


	/**
	 * Compare {@code pattern} matched against {@code tree} and return a
	 * {@link ParseTreeMatch} object that contains the matched elements, or the
	 * node at which the match failed. Pass in a compiled pattern instead of a
	 * string representation of a tree pattern.
	 */

	public match(tree: ParseTree| null, pattern: ParseTreePattern| null):  ParseTreeMatch | null;

	/**
	 * Compare {@code pattern} matched as rule {@code patternRuleIndex} against
	 * {@code tree} and return a {@link ParseTreeMatch} object that contains the
	 * matched elements, or the node at which the match failed.
	 */
	public match(tree: ParseTree| null, pattern: java.lang.String| null, patternRuleIndex: number):  ParseTreeMatch | null;


	/**
	 * Compare {@code pattern} matched as rule {@code patternRuleIndex} against
	 * {@code tree} and return a {@link ParseTreeMatch} object that contains the
	 * matched elements, or the node at which the match failed.
	 */
	public match(tree: ParseTree | null, pattern: ParseTreePattern | java.lang.String | null, patternRuleIndex?: number):  ParseTreeMatch | null {
if (pattern instanceof ParseTreePattern && patternRuleIndex === undefined) {
		let  labels: MultiMap<java.lang.String, ParseTree> = new  MultiMap<java.lang.String, ParseTree>();
		let  mismatchedNode: ParseTree = this.matchImpl(tree, pattern.getPatternTree(), labels);
		return new  ParseTreeMatch(tree, pattern, labels, mismatchedNode);
	}
 else  {
		let  p: ParseTreePattern = this.compile(pattern, patternRuleIndex);
		return this.match(tree, p);
	}

}


	/**
	 * For repeated use of a tree pattern, compile it to a
	 * {@link ParseTreePattern} using this method.
	 */
	public compile = (pattern: java.lang.String| null, patternRuleIndex: number):  ParseTreePattern | null => {
		let  tokenList: java.util.List< Token> = this.tokenize(pattern);
		let  tokenSrc: ListTokenSource = new  ListTokenSource(tokenList);
		let  tokens: CommonTokenStream = new  CommonTokenStream(tokenSrc);

		let  parserInterp: ParserInterpreter = new  ParserInterpreter(this.parser.getGrammarFileName(),
															   this.parser.getVocabulary(),
															   java.util.Arrays.asList(this.parser.getRuleNames()),
															   this.parser.getATNWithBypassAlts(),
															   tokens);

		let  tree: ParseTree = null;
		try {
			parserInterp.setErrorHandler(new  BailErrorStrategy());
			tree = parserInterp.parse(patternRuleIndex);
//			System.out.println("pattern tree = "+tree.toStringTree(parserInterp));
		} catch (eOrRe) {
if (eOrRe instanceof ParseCancellationException) {
			const e = eOrRe;
throw e.getCause() as RecognitionException;
		} else {
	throw eOrRe;
	}
else if (eOrRe instanceof RecognitionException) {
			const re = eOrRe;
throw re;
		} else {
	throw eOrRe;
	}
else if (eOrRe instanceof java.lang.Exception) {
			const e = eOrRe;
throw new  ParseTreePatternMatcher.CannotInvokeStartRule(e);
		} else {
	throw eOrRe;
	}
}

		// Make sure tree pattern compilation checks for a complete parse
		if ( tokens.LA(1)!==Token.EOF ) {
			throw new  ParseTreePatternMatcher.StartRuleDoesNotConsumeFullPattern();
		}

		return new  ParseTreePattern(this, pattern, patternRuleIndex, tree);
	}

	/**
	 * Used to convert the tree pattern string into a series of tokens. The
	 * input stream is reset.
	 */

	public getLexer = ():  Lexer | null => {
		return this.lexer;
	}

	/**
	 * Used to collect to the grammar file name, token names, rule names for
	 * used to parse the pattern into a parse tree.
	 */

	public getParser = ():  Parser | null => {
		return this.parser;
	}

	// ---- SUPPORT CODE ----

	/**
	 * Recursively walk {@code tree} against {@code patternTree}, filling
	 * {@code match.}{@link ParseTreeMatch#labels labels}.
	 *
	  @returns the first node encountered in {@code tree} which does not match
	 * a corresponding node in {@code patternTree}, or {@code null} if the match
	 * was successful. The specific node returned depends on the matching
	 * algorithm used by the implementation, and may be overridden.
	 */

	protected matchImpl = (tree: ParseTree| null,
								  patternTree: ParseTree| null,
								  labels: MultiMap<java.lang.String, ParseTree>| null):  ParseTree | null =>
	{
		if (tree === null) {
			throw new  java.lang.IllegalArgumentException(S`tree cannot be null`);
		}

		if (patternTree === null) {
			throw new  java.lang.IllegalArgumentException(S`patternTree cannot be null`);
		}

		// x and <ID>, x and y, or x and x; or could be mismatched types
		if ( tree instanceof TerminalNode && patternTree instanceof TerminalNode ) {
			let  t1: TerminalNode = tree as TerminalNode;
			let  t2: TerminalNode = patternTree as TerminalNode;
			let  mismatchedNode: ParseTree = null;
			// both are tokens and they have same type
			if ( t1.getSymbol().getType() === t2.getSymbol().getType() ) {
				if ( t2.getSymbol() instanceof TokenTagToken ) { // x and <ID>
					let  tokenTagToken: TokenTagToken = t2.getSymbol() as TokenTagToken;
					// track label->list-of-nodes for both token name and label (if any)
					labels.map(tokenTagToken.getTokenName(), tree);
					if ( tokenTagToken.getLabel()!==null ) {
						labels.map(tokenTagToken.getLabel(), tree);
					}
				}
				else {
 if ( t1.getText().equals(t2.getText()) ) {
					// x and x
				}
				else {
					// x and y
					if (mismatchedNode === null) {
						mismatchedNode = t1;
					}
				}
}

			}
			else {
				if (mismatchedNode === null) {
					mismatchedNode = t1;
				}
			}

			return mismatchedNode;
		}

		if ( tree instanceof ParserRuleContext && patternTree instanceof ParserRuleContext ) {
			let  r1: ParserRuleContext = tree as ParserRuleContext;
			let  r2: ParserRuleContext = patternTree as ParserRuleContext;
			let  mismatchedNode: ParseTree = null;
			// (expr ...) and <expr>
			let  ruleTagToken: RuleTagToken = this.getRuleTagToken(r2);
			if ( ruleTagToken!==null ) {
				let  m: ParseTreeMatch = null;
				if ( r1.getRuleContext().getRuleIndex() === r2.getRuleContext().getRuleIndex() ) {
					// track label->list-of-nodes for both rule name and label (if any)
					labels.map(ruleTagToken.getRuleName(), tree);
					if ( ruleTagToken.getLabel()!==null ) {
						labels.map(ruleTagToken.getLabel(), tree);
					}
				}
				else {
					if (mismatchedNode === null) {
						mismatchedNode = r1;
					}
				}

				return mismatchedNode;
			}

			// (expr ...) and (expr ...)
			if ( r1.getChildCount()!==r2.getChildCount() ) {
				if (mismatchedNode === null) {
					mismatchedNode = r1;
				}

				return mismatchedNode;
			}

			let  n: number = r1.getChildCount();
			for (let  i: number = 0; i<n; i++) {
				let  childMatch: ParseTree = this.matchImpl(r1.getChild(i), patternTree.getChild(i), labels);
				if ( childMatch !== null ) {
					return childMatch;
				}
			}

			return mismatchedNode;
		}

		// if nodes aren't both tokens or both rule nodes, can't match
		return tree;
	}

	/** Is {@code t} {@code (expr <expr>)} subtree? */
	protected getRuleTagToken = (t: ParseTree| null):  RuleTagToken | null => {
		if ( t instanceof RuleNode ) {
			let  r: RuleNode = t as RuleNode;
			if ( r.getChildCount()===1 && r.getChild(0) instanceof TerminalNode ) {
				let  c: TerminalNode = r.getChild(0) as TerminalNode;
				if ( c.getSymbol() instanceof RuleTagToken ) {
//					System.out.println("rule tag subtree "+t.toStringTree(parser));
					return c.getSymbol() as RuleTagToken;
				}
			}
		}
		return null;
	}

	public tokenize = (pattern: java.lang.String| null):  java.util.List< Token> | null => {
		// split pattern into chunks: sea (raw input) and islands (<ID>, <expr>)
		let  chunks: java.util.List<Chunk> = this.split(pattern);

		// create token stream from text and tags
		let  tokens: java.util.List<Token> = new  java.util.ArrayList<Token>();
		for (let chunk of chunks) {
			if ( chunk instanceof TagChunk ) {
				let  tagChunk: TagChunk = chunk as TagChunk;
				// add special rule token or conjure up new token from name
				if ( java.lang.Character.isUpperCase(tagChunk.getTag().charAt(0)) ) {
					let  ttype: java.lang.Integer = this.parser.getTokenType(tagChunk.getTag());
					if ( ttype===Token.INVALID_TYPE ) {
						throw new  java.lang.IllegalArgumentException(S`Unknown token `+tagChunk.getTag()+S` in pattern: `+pattern);
					}
					let  t: TokenTagToken = new  TokenTagToken(tagChunk.getTag(), ttype, tagChunk.getLabel());
					tokens.add(t);
				}
				else {
 if ( java.lang.Character.isLowerCase(tagChunk.getTag().charAt(0)) ) {
					let  ruleIndex: number = this.parser.getRuleIndex(tagChunk.getTag());
					if ( ruleIndex===-1 ) {
						throw new  java.lang.IllegalArgumentException(S`Unknown rule `+tagChunk.getTag()+S` in pattern: `+pattern);
					}
					let  ruleImaginaryTokenType: number = this.parser.getATNWithBypassAlts().ruleToTokenType[ruleIndex];
					tokens.add(new  RuleTagToken(tagChunk.getTag(), ruleImaginaryTokenType, tagChunk.getLabel()));
				}
				else {
					throw new  java.lang.IllegalArgumentException(S`invalid tag: `+tagChunk.getTag()+S` in pattern: `+pattern);
				}
}

			}
			else {
				let  textChunk: TextChunk = chunk as TextChunk;
				let  in: ANTLRInputStream = new  ANTLRInputStream(textChunk.getText());
				this.lexer.setInputStream(in);
				let  t: Token = this.lexer.nextToken();
				while ( t.getType()!==Token.EOF ) {
					tokens.add(t);
					t = this.lexer.nextToken();
				}
			}
		}

//		System.out.println("tokens="+tokens);
		return tokens;
	}

	/** Split {@code <ID> = <e:expr> ;} into 4 chunks for tokenizing by {@link #tokenize}. */
	public split = (pattern: java.lang.String| null):  java.util.List<Chunk> | null => {
		let  p: number = 0;
		let  n: number = pattern.length();
		let  chunks: java.util.List<Chunk> = new  java.util.ArrayList<Chunk>();
		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		// find all start and stop indexes first, then collect
		let  starts: java.util.List<java.lang.Integer> = new  java.util.ArrayList<java.lang.Integer>();
		let  stops: java.util.List<java.lang.Integer> = new  java.util.ArrayList<java.lang.Integer>();
		while ( p<n ) {
			if ( p === pattern.indexOf(this.escape+this.start,p) ) {
				p += this.escape.length() + this.start.length();
			}
			else {
 if ( p === pattern.indexOf(this.escape+this.stop,p) ) {
				p += this.escape.length() + this.stop.length();
			}
			else {
 if ( p === pattern.indexOf(this.start,p) ) {
				starts.add(p);
				p += this.start.length();
			}
			else {
 if ( p === pattern.indexOf(this.stop,p) ) {
				stops.add(p);
				p += this.stop.length();
			}
			else {
				p++;
			}
}

}

}

		}

//		System.out.println("");
//		System.out.println(starts);
//		System.out.println(stops);
		if ( starts.size() > stops.size() ) {
			throw new  java.lang.IllegalArgumentException(S`unterminated tag in pattern: `+pattern);
		}

		if ( starts.size() < stops.size() ) {
			throw new  java.lang.IllegalArgumentException(S`missing start tag in pattern: `+pattern);
		}

		let  ntags: number = starts.size();
		for (let  i: number=0; i<ntags; i++) {
			if ( starts.get(i)>=stops.get(i) ) {
				throw new  java.lang.IllegalArgumentException(S`tag delimiters out of order in pattern: `+pattern);
			}
		}

		// collect into chunks now
		if ( ntags===0 ) {
			let  text: java.lang.String = pattern.substring(0, n);
			chunks.add(new  TextChunk(text));
		}

		if ( ntags>0 && starts.get(0)>0 ) { // copy text up to first tag into chunks
			let  text: java.lang.String = pattern.substring(0, starts.get(0));
			chunks.add(new  TextChunk(text));
		}
		for (let  i: number=0; i<ntags; i++) {
			// copy inside of <tag>
			let  tag: java.lang.String = pattern.substring(starts.get(i) + this.start.length(), stops.get(i));
			let  ruleOrToken: java.lang.String = tag;
			let  label: java.lang.String = null;
			let  colon: number = tag.indexOf(':');
			if ( colon >= 0 ) {
				label = tag.substring(0,colon);
				ruleOrToken = tag.substring(colon+1, tag.length());
			}
			chunks.add(new  TagChunk(label, ruleOrToken));
			if ( i+1 < ntags ) {
				// copy from end of <tag> to start of next
				let  text: java.lang.String = pattern.substring(stops.get(i) + this.stop.length(), starts.get(i + 1));
				chunks.add(new  TextChunk(text));
			}
		}
		if ( ntags>0 ) {
			let  afterLastTag: number = stops.get(ntags - 1) + this.stop.length();
			if ( afterLastTag < n ) { // copy text from end of last tag to end
				let  text: java.lang.String = pattern.substring(afterLastTag, n);
				chunks.add(new  TextChunk(text));
			}
		}

		// strip out the escape sequences from text chunks but not tags
		for (let  i: number = 0; i < chunks.size(); i++) {
			let  c: Chunk = chunks.get(i);
			if ( c instanceof TextChunk ) {
				let  tc: TextChunk = c as TextChunk;
				let  unescaped: java.lang.String = tc.getText().replace(this.escape, S``);
				if (unescaped.length() < tc.getText().length()) {
					chunks.set(i, new  TextChunk(unescaped));
				}
			}
		}

		return chunks;
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace ParseTreePatternMatcher {
	export type CannotInvokeStartRule = InstanceType<typeof ParseTreePatternMatcher.CannotInvokeStartRule>;
	export type StartRuleDoesNotConsumeFullPattern = InstanceType<typeof ParseTreePatternMatcher.StartRuleDoesNotConsumeFullPattern>;
}


