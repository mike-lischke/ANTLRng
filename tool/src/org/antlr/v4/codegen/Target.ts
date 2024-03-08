/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { UnicodeEscapes } from "./UnicodeEscapes.js";
import { CodeGenerator } from "./CodeGenerator.js";
import { Tool } from "../Tool.js";
import { RuleFunction } from "./model/RuleFunction.js";
import { CharSupport } from "../misc/CharSupport.js";
import { Utils } from "../misc/Utils.js";
import { RuntimeMetaData, Token, HashMap } from "antlr4ng";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { Rule } from "../tool/Rule.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";



/** */
export abstract  class Target {

	protected static readonly  defaultCharValueEscape:  Map<Character, string>;
	private static readonly  languageTemplates = new  HashMap();

	protected readonly  gen:  CodeGenerator;

	protected  constructor(gen: CodeGenerator) {
		this.gen = gen;
	}

	protected static  addEscapedChar(map: HashMap<Character, string>, key: number):  void;

	protected static  addEscapedChar(map: HashMap<Character, string>, key: number, representation: number):  void;
protected static addEscapedChar(...args: unknown[]):  void {
		switch (args.length) {
			case 2: {
				const [map, key] = args as [HashMap<Character, string>, number];


		Target.addEscapedChar(map, key, key);
	

				break;
			}

			case 3: {
				const [map, key, representation] = args as [HashMap<Character, string>, number, number];


		map.put(key, "\\" + representation);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/** For pure strings of Unicode char, how can we display
	 *  it in the target language as a literal. Useful for dumping
	 *  predicates and such that may refer to chars that need to be escaped
	 *  when represented as strings.  Also, templates need to be escaped so
	 *  that the target language can hold them as a string.
	 *  Each target can have a different set in memory at same time.
	 */
	public  getTargetCharValueEscape():  Map<Character, string> {
		return Target.defaultCharValueEscape;
	}

	public  getLanguage():  string { return this.gen.language; }

	public  getCodeGenerator():  CodeGenerator {
		return this.gen;
	}

	/** ANTLR tool should check output templates / target are compatible with tool code generation.
	 *  For now, a simple string match used on x.y of x.y.z scheme. We use a method to avoid mismatches
	 *  between a template called VERSION. This value is checked against Tool.VERSION during load of templates.
	 *
	 *  This additional method forces all targets 4.3 and beyond to add this method.
	 *
	 * @since 4.3
	 */
	public  getVersion():  string {
		return Tool.VERSION;
	}

	public  getTemplates():  STGroup {
		let  language = this.getLanguage();
		let  templates = Target.languageTemplates.get(language);

		if (templates === null) {
			let  version = this.getVersion();
			if (version === null ||
					!RuntimeMetaData.getMajorMinorVersion(version).equals(RuntimeMetaData.getMajorMinorVersion(Tool.VERSION))) {
				this.gen.tool.errMgr.toolError(ErrorType.INCOMPATIBLE_TOOL_AND_TEMPLATES, version, Tool.VERSION, language);
			}
			templates = this.loadTemplates();
			Target.languageTemplates.put(language, templates);
		}

		return templates;
	}

	public  escapeIfNeeded(identifier: string):  string {
		return this.getReservedWords().contains(identifier) ? this.escapeWord(identifier) : identifier;
	}

	/** Get a meaningful name for a token type useful during code generation.
	 *  Literals without associated names are converted to the string equivalent
	 *  of their integer values. Used to generate x==ID and x==34 type comparisons
	 *  etc...  Essentially we are looking for the most obvious way to refer
	 *  to a token type in the generated code.
	 */
	public  getTokenTypeAsTargetLabel(g: Grammar, ttype: number):  string {
	    let  name = this.escapeIfNeeded(g.getTokenName(ttype));
		// If name is not valid, return the token type instead
		if ( Grammar.INVALID_TOKEN_NAME.equals(name) ) {
			return string.valueOf(ttype);
		}

		return name;
	}

	public  getTokenTypesAsTargetLabels(g: Grammar, ttypes: Int32Array):  string[] {
		let  labels = new  Array<string>(ttypes.length);
		for (let  i=0; i<ttypes.length; i++) {
			labels[i] = this.getTokenTypeAsTargetLabel(g, ttypes[i]);
		}
		return labels;
	}

	public  getTargetStringLiteralFromString(s: string):  string;

	/** Given a random string of Java unicode chars, return a new string with
	 *  optionally appropriate quote characters for target language and possibly
	 *  with some escaped characters.  For example, if the incoming string has
	 *  actual newline characters, the output of this method would convert them
	 *  to the two char sequence \n for Java, C, C++, ...  The new string has
	 *  double-quotes around it as well.  Example String in memory:
	 *
	 *     a"[newlinechar]b'c[carriagereturnchar]d[tab]e\f
	 *
	 *  would be converted to the valid Java s:
	 *
	 *     "a\"\nb'c\rd\te\\f"
	 *
	 *  or
	 *
	 *     a\"\nb'c\rd\te\\f
	 *
	 *  depending on the quoted arg.
	 */
	public  getTargetStringLiteralFromString(s: string, quoted: boolean):  string;
public getTargetStringLiteralFromString(...args: unknown[]):  string {
		switch (args.length) {
			case 1: {
				const [s] = args as [string];


		return this.getTargetStringLiteralFromString(s, true);
	

				break;
			}

			case 2: {
				const [s, quoted] = args as [string, boolean];


		if ( s===null ) {
			return null;
		}

		let  buf = new  StringBuilder();
		if ( quoted ) {
			buf.append('"');
		}
		for (let  i=0; i < s.length(); ) {
			let  c = s.codePointAt(i);
			let  escaped = c <= Character.MAX_VALUE ? this.getTargetCharValueEscape().get(Number(c)) : null;
			if (c !== '\'' && escaped !== null) { // don't escape single quotes in strings for java
				buf.append(escaped);
			}
			else {
 if (this.shouldUseUnicodeEscapeForCodePointInDoubleQuotedString(c)) {
				this.appendUnicodeEscapedCodePoint(i, buf);
			}
			else
			{
				buf.appendCodePoint(c);
			}
}

			i += Character.charCount(c);
		}
		if ( quoted ) {
			buf.append('"');
		}
		return buf.toString();
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  getTargetStringLiteralFromANTLRStringLiteral(generator: CodeGenerator, literal: string, addQuotes: boolean):  string;

	/**
	 * <p>Convert from an ANTLR string literal found in a grammar file to an
	 * equivalent string literal in the target language.
	 *</p>
	 * <p>
	 * For Java, this is the translation {@code 'a\n"'} &rarr; {@code "a\n\""}.
	 * Expect single quotes around the incoming literal. Just flip the quotes
	 * and replace double quotes with {@code \"}.
	 * </p>
	 * <p>
	 * Note that we have decided to allow people to use '\"' without penalty, so
	 * we must build the target string in a loop as {@link String#replace}
	 * cannot handle both {@code \"} and {@code "} without a lot of messing
	 * around.
	 * </p>
	 */
	public  getTargetStringLiteralFromANTLRStringLiteral(
		generator: CodeGenerator,
		literal: string,
		addQuotes: boolean,
		escapeSpecial: boolean):  string;
public getTargetStringLiteralFromANTLRStringLiteral(...args: unknown[]):  string {
		switch (args.length) {
			case 3: {
				const [generator, literal, addQuotes] = args as [CodeGenerator, string, boolean];


		return this.getTargetStringLiteralFromANTLRStringLiteral(generator, literal, addQuotes, false);
	

				break;
			}

			case 4: {
				const [generator, literal, addQuotes, escapeSpecial] = args as [CodeGenerator, string, boolean, boolean];


		let  sb = new  StringBuilder();

		if ( addQuotes ) {
 sb.append('"');
}


		for (let  i = 1; i < literal.length() -1; ) {
			let  codePoint = literal.codePointAt(i);
			let  toAdvance = Character.charCount(codePoint);
			if  (codePoint === '\\') {
				// Anything escaped is what it is! We assume that
				// people know how to escape characters correctly. However
				// we catch anything that does not need an escape in Java (which
				// is what the default implementation is dealing with and remove
				// the escape. The C target does this for instance.
				//
				let  escapedCodePoint = literal.codePointAt(i+toAdvance);
				toAdvance++;
				switch (escapedCodePoint) {
					// Pass through any escapes that Java also needs
					//
					case    'n':
					case    'r':
					case    't':
					case    'b':
					case    'f':
					case    '\\':{
						// Pass the escape through
						if (escapeSpecial && escapedCodePoint !== '\\') {
							sb.append('\\');
						}
						sb.append('\\');
						sb.appendCodePoint(escapedCodePoint);
						break;
}


					case    'u':{    // Either unnnn or u{nnnnnn}
						if (literal.charAt(i+toAdvance) === '{') {
							while (literal.charAt(i+toAdvance) !== '}') {
								toAdvance++;
							}
							toAdvance++;
						}
						else {
							toAdvance += 4;
						}
						if ( i+toAdvance <= literal.length() ) { // we might have an invalid \\uAB or something
							let  fullEscape = literal.substring(i, i+toAdvance);
							this.appendUnicodeEscapedCodePoint(
								CharSupport.getCharValueFromCharInGrammarLiteral(fullEscape),
								sb,
								escapeSpecial);
						}
						break;
}

					default:{
						if (this.shouldUseUnicodeEscapeForCodePointInDoubleQuotedString(escapedCodePoint)) {
							this.appendUnicodeEscapedCodePoint(escapedCodePoint, sb, escapeSpecial);
						}
						else {
							sb.appendCodePoint(escapedCodePoint);
						}
						break;
}

				}
			}
			else {
				if (codePoint === 0x22) {
					// ANTLR doesn't escape " in literal strings,
					// but every other language needs to do so.
					sb.append("\\\"");
				}
				else {
 if (this.shouldUseUnicodeEscapeForCodePointInDoubleQuotedString(codePoint)) {
					this.appendUnicodeEscapedCodePoint(codePoint, sb, escapeSpecial);
				}
				else {
					sb.appendCodePoint(codePoint);
				}
}

			}
			i += toAdvance;
		}

		if ( addQuotes ) {
 sb.append('"');
}


		return sb.toString();
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/** Assume 16-bit char */
	public  encodeInt16AsCharEscape(v: number):  string {
		if (v < Character.MIN_VALUE || v > Character.MAX_VALUE) {
			throw new  IllegalArgumentException(string.format("Cannot encode the specified value: %d", v));
		}

		if ( this.isATNSerializedAsInts() ) {
			return number.toString(v);
		}

		let  c = Number(v);
		let  escaped = this.getTargetCharValueEscape().get(c);
		if (escaped !== null) {
			return escaped;
		}

		switch (Character.getType(c)) {
			case Character.CONTROL:
			case Character.LINE_SEPARATOR:
			case Character.PARAGRAPH_SEPARATOR:{
				return this.escapeChar(v);
}

			default:{
				if ( v<=127 ) {
					return string.valueOf(c);  // ascii chars can be as-is, no encoding
				}
				// else we use hex encoding to ensure pure ascii chars generated
				return this.escapeChar(v);
}

		}
	}

	public  getLoopLabel(ast: GrammarAST):  string {
		return "loop"+ ast.token.getTokenIndex();
	}

	public  getLoopCounter(ast: GrammarAST):  string {
		return "cnt"+ ast.token.getTokenIndex();
	}

	public  getListLabel(label: string):  string {
		let  st = this.getTemplates().getInstanceOf("ListLabelName");
		st.add("label", label);
		return st.render();
	}

	public  getRuleFunctionContextStructName(r: Rule):  string;

	/** If we know which actual function, we can provide the actual ctx type.
	 *  This will contain implicit labels etc...  From outside, though, we
	 *  see only ParserRuleContext unless there are externally visible stuff
	 *  like args, locals, explicit labels, etc...
	 */
	public  getRuleFunctionContextStructName(function: RuleFunction):  string;
public getRuleFunctionContextStructName(...args: unknown[]):  string {
		switch (args.length) {
			case 1: {
				const [r] = args as [Rule];


		if ( r.g.isLexer() ) {
			return this.getTemplates().getInstanceOf("LexerRuleContext").render();
		}
		return Utils.capitalize(r.name)+this.getTemplates().getInstanceOf("RuleContextNameSuffix").render();
	

				break;
			}

			case 1: {
				const [function] = args as [RuleFunction];


		let  r = function.rule;
		if ( r.g.isLexer() ) {
			return this.getTemplates().getInstanceOf("LexerRuleContext").render();
		}
		return Utils.capitalize(r.name)+this.getTemplates().getInstanceOf("RuleContextNameSuffix").render();
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  getAltLabelContextStructName(label: string):  string {
		return Utils.capitalize(label)+this.getTemplates().getInstanceOf("RuleContextNameSuffix").render();
	}

	// should be same for all refs to same token like ctx.ID within single rule function
	// for literals like 'while', we gen _s<ttype>
	public  getImplicitTokenLabel(tokenName: string):  string {
		let  st = this.getTemplates().getInstanceOf("ImplicitTokenLabel");
		let  ttype = this.getCodeGenerator().g.getTokenType(tokenName);
		if ( tokenName.startsWith("'") ) {
			return "s"+ttype;
		}
		let  text = this.getTokenTypeAsTargetLabel(this.getCodeGenerator().g, ttype);
		st.add("tokenName", text);
		return st.render();
	}

	// x=(A|B)
	public  getImplicitSetLabel(id: string):  string {
		let  st = this.getTemplates().getInstanceOf("ImplicitSetLabel");
		st.add("id", id);
		return st.render();
	}

	public  getImplicitRuleLabel(ruleName: string):  string {
		let  st = this.getTemplates().getInstanceOf("ImplicitRuleLabel");
		st.add("ruleName", ruleName);
		return st.render();
	}

	public  getElementListName(name: string):  string {
		let  st = this.getTemplates().getInstanceOf("ElementListName");
		st.add("elemName", this.getElementName(name));
		return st.render();
	}

	public  getElementName(name: string):  string {
		if (".".equals(name)) {
			return "_wild";
		}

		if ( this.getCodeGenerator().g.getRule(name)!==null ) {
 return name;
}

		let  ttype = this.getCodeGenerator().g.getTokenType(name);
		if ( ttype===Token.INVALID_TYPE ) {
 return name;
}

		return this.getTokenTypeAsTargetLabel(this.getCodeGenerator().g, ttype);
	}

	/** Generate TParser.java and TLexer.java from T.g4 if combined, else
	 *  just use T.java as output regardless of type.
	 */
	public  getRecognizerFileName(header: boolean):  string {
		let  extST = this.getTemplates().getInstanceOf("codeFileExtension");
		let  recognizerName = this.gen.g.getRecognizerName();
		return recognizerName+extST.render();
	}

	/** A given grammar T, return the listener name such as
	 *  TListener.java, if we're using the Java target.
 	 */
	public  getListenerFileName(header: boolean):  string {
		/* assert gen.g.name != null; */ 
		let  extST = this.getTemplates().getInstanceOf("codeFileExtension");
		let  listenerName = this.gen.g.name + "Listener";
		return listenerName+extST.render();
	}

	/** A given grammar T, return the visitor name such as
	 *  TVisitor.java, if we're using the Java target.
 	 */
	public  getVisitorFileName(header: boolean):  string {
		/* assert gen.g.name != null; */ 
		let  extST = this.getTemplates().getInstanceOf("codeFileExtension");
		let  listenerName = this.gen.g.name + "Visitor";
		return listenerName+extST.render();
	}

	/** A given grammar T, return a blank listener implementation
	 *  such as TBaseListener.java, if we're using the Java target.
 	 */
	public  getBaseListenerFileName(header: boolean):  string {
		/* assert gen.g.name != null; */ 
		let  extST = this.getTemplates().getInstanceOf("codeFileExtension");
		let  listenerName = this.gen.g.name + "BaseListener";
		return listenerName+extST.render();
	}

	/** A given grammar T, return a blank listener implementation
	 *  such as TBaseListener.java, if we're using the Java target.
 	 */
	public  getBaseVisitorFileName(header: boolean):  string {
		/* assert gen.g.name != null; */ 
		let  extST = this.getTemplates().getInstanceOf("codeFileExtension");
		let  listenerName = this.gen.g.name + "BaseVisitor";
		return listenerName+extST.render();
	}

	/**
	 * Gets the maximum number of 16-bit unsigned integers that can be encoded
	 * in a single segment (a declaration in target language) of the serialized ATN.
	 * E.g., in C++, a small segment length results in multiple decls like:
	 *
	 *   static const int32_t serializedATNSegment1[] = {
	 *     0x7, 0x12, 0x2, 0x13, 0x7, 0x13, 0x2, 0x14, 0x7, 0x14, 0x2, 0x15, 0x7,
	 *        0x15, 0x2, 0x16, 0x7, 0x16, 0x2, 0x17, 0x7, 0x17, 0x2, 0x18, 0x7,
	 *        0x18, 0x2, 0x19, 0x7, 0x19, 0x2, 0x1a, 0x7, 0x1a, 0x2, 0x1b, 0x7,
	 *        0x1b, 0x2, 0x1c, 0x7, 0x1c, 0x2, 0x1d, 0x7, 0x1d, 0x2, 0x1e, 0x7,
	 *        0x1e, 0x2, 0x1f, 0x7, 0x1f, 0x2, 0x20, 0x7, 0x20, 0x2, 0x21, 0x7,
	 *        0x21, 0x2, 0x22, 0x7, 0x22, 0x2, 0x23, 0x7, 0x23, 0x2, 0x24, 0x7,
	 *        0x24, 0x2, 0x25, 0x7, 0x25, 0x2, 0x26,
	 *   };
	 *
	 * instead of one big one.  Targets are free to ignore this like JavaScript does.
	 *
	 * This is primarily needed by Java target to limit size of any single ATN string
	 * to 65k length.
	 *
	 * @see SerializedATN#getSegments
	 *
	 * @return the serialized ATN segment limit
	 */
	public  getSerializedATNSegmentLimit():  number {
		return number.MAX_VALUE;
	}

	/** How many bits should be used to do inline token type tests? Java assumes
	 *  a 64-bit word for bitsets.  Must be a valid wordsize for your target like
	 *  8, 16, 32, 64, etc...
	 *
	 *  @since 4.5
	 */
	public  getInlineTestSetWordSize():  number { return 64; }

	public  grammarSymbolCausesIssueInGeneratedCode(idNode: GrammarAST):  boolean {
		switch (idNode.getParent().getType()) {
			case ANTLRParser.ASSIGN:{
				switch (idNode.getParent().getParent().getType()) {
					case ANTLRParser.ELEMENT_OPTIONS:
					case ANTLRParser.OPTIONS:{
						return false;
}


					default:{
						break;
}

				}

				break;
}


			case ANTLRParser.AT:
			case ANTLRParser.ELEMENT_OPTIONS:{
				return false;
}


			case ANTLRParser.LEXER_ACTION_CALL:{
				if (idNode.getChildIndex() === 0) {
					// first child is the command name which is part of the ANTLR language
					return false;
				}

				// arguments to the command should be checked
				break;
}


			default:{
				break;
}

		}

		return this.getReservedWords().contains(idNode.getText());
	}

	public  templatesExist():  boolean {
		return this.loadTemplatesHelper(false) !== null;
	}

	/**
	 * @since 4.3
	 */
	public  wantsBaseListener():  boolean {
		return true;
	}

	/**
	 * @since 4.3
	 */
	public  wantsBaseVisitor():  boolean {
		return true;
	}

	/**
	 * @since 4.3
	 */
	public  supportsOverloadedMethods():  boolean {
		return true;
	}

	public  isATNSerializedAsInts():  boolean {
		return true;
	}

	/** @since 4.6 */
	public  needsHeader():  boolean { return false; }

	protected abstract  getReservedWords():  Set<string>;

	protected  escapeWord(word: string):  string {
		return word + "_";
	}

	protected  genFile(g: Grammar, outputFileST: ST, fileName: string):  void
	{
		this.getCodeGenerator().write(outputFileST, fileName);
	}

	/**
	 * Escape the Unicode code point appropriately for this language
	 * and append the escaped value to {@code sb}.
	 * It exists for flexibility and backward compatibility with external targets
	 * The static method {@link UnicodeEscapes#appendEscapedCodePoint(StringBuilder, int, String)} can be used as well
	 * if default escaping method (Java) is used or language is officially supported
	 */
	protected  appendUnicodeEscapedCodePoint(codePoint: number, sb: StringBuilder):  void;

	private  appendUnicodeEscapedCodePoint(codePoint: number, sb: StringBuilder, escape: boolean):  void;
protected appendUnicodeEscapedCodePoint(...args: unknown[]):  void {
		switch (args.length) {
			case 2: {
				const [codePoint, sb] = args as [number, StringBuilder];


		UnicodeEscapes.appendEscapedCodePoint(sb, codePoint, this.getLanguage());
	

				break;
			}

			case 3: {
				const [codePoint, sb, escape] = args as [number, StringBuilder, boolean];


		if (escape) {
			sb.append("\\");
		}
		this.appendUnicodeEscapedCodePoint(codePoint, sb);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	protected  shouldUseUnicodeEscapeForCodePointInDoubleQuotedString(codePoint: number):  boolean {
		// We don't want anyone passing 0x0A (newline) or 0x22
		// (double-quote) here because Java treats \\u000A as
		// a literal newline and \\u0022 as a literal
		// double-quote, so Unicode escaping doesn't help.
		/* assert codePoint != 0x0A && codePoint != 0x22; */ 

		return
			codePoint < 0x20  || // control characters up to but not including space
			codePoint === 0x5C || // backslash
			codePoint >= 0x7F;   // DEL and beyond (keeps source code 7-bit US-ASCII)
	}

	protected  escapeChar(v: number):  string {
		return string.format("\\u%04x", v);
	}

	@Deprecated
protected  visibleGrammarSymbolCausesIssueInGeneratedCode(idNode: GrammarAST):  boolean {
		return this.getReservedWords().contains(idNode.getText());
	}

	protected  loadTemplates():  STGroup {
		let  result = this.loadTemplatesHelper(true);
		if (result === null) {
			return null;
		}
		result.registerRenderer(number.class, new  NumberRenderer());
		result.registerRenderer(string.class, new  StringRenderer());
		result.setListener(new  class extends STErrorListener {
			@Override
public  compileTimeError(msg: STMessage):  void {
				this.reportError(msg);
			}

			@Override
public  runTimeError(msg: STMessage):  void {
				this.reportError(msg);
			}

			@Override
public  IOError(msg: STMessage):  void {
				this.reportError(msg);
			}

			@Override
public  internalError(msg: STMessage):  void {
				this.reportError(msg);
			}

			private  reportError(msg: STMessage):  void {
				$outer.getCodeGenerator().tool.errMgr.toolError(ErrorType.STRING_TEMPLATE_WARNING, msg.cause, msg.toString());
			}
		}());

		return result;
	}

	private  loadTemplatesHelper(reportErrorIfFail: boolean):  STGroup {
		let  language = this.getLanguage();
		let  groupFileName = CodeGenerator.TEMPLATE_ROOT + "/" + language + "/" + language + STGroup.GROUP_FILE_EXTENSION;
		try {
			return new  STGroupFile(groupFileName);
		} catch (iae) {
if (iae instanceof IllegalArgumentException) {
			if (reportErrorIfFail) {
				this.gen.tool.errMgr.toolError(ErrorType.MISSING_CODE_GEN_TEMPLATES, iae, this.getLanguage());
			}
			return null;
		} else {
	throw iae;
	}
}
	}
	 static {
		// https://docs.oracle.com/javase/tutorial/java/data/characters.html
		let  map = new  HashMap();
		Target.addEscapedChar(map, '\t', 't');
		Target.addEscapedChar(map, '\b', 'b');
		Target.addEscapedChar(map, '\n', 'n');
		Target.addEscapedChar(map, '\r', 'r');
		Target.addEscapedChar(map, '\f', 'f');
		Target.addEscapedChar(map, '\'');
		Target.addEscapedChar(map, '\"');
		Target.addEscapedChar(map, '\\');
		Target.defaultCharValueEscape = map;
	} // Override in targets that need header files.
}
