/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { AttributeDict } from "../tool/AttributeDict.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { ActionAST } from "../tool/ast/ActionAST.js";



/**
 * Parse args, return values, locals
 * <p>
 * rule[arg1, arg2, ..., argN] returns [ret1, ..., retN]
 * <p>
 * text is target language dependent.  Java/C#/C/C++ would
 * use "int i" but ruby/python would use "i". Languages with
 * postfix types like Go, Swift use "x : T" notation or "T x".
 */
export  class ScopeParser {
	/**
	 * Given an arg or retval scope definition list like
	 * <p>
	 * <code>
	 * Map&lt;String, String&gt;, int[] j3, char *foo32[3]
	 * </code>
	 * <p>
	 * or
	 * <p>
	 * <code>
	 * int i=3, j=a[34]+20
	 * </code>
	 * <p>
	 * convert to an attribute scope.
	 */
	public static  parseTypedArgList(action: ActionAST, s: string, g: Grammar):  AttributeDict {
		return ScopeParser.parse(action, s, ',', g);
	}

	public static  parse(action: ActionAST, s: string, separator: number, g: Grammar):  AttributeDict {
		let  dict = new  AttributeDict();
		let  decls = ScopeParser.splitDecls(s, separator);
		for (let decl of decls) {
			if (decl.a.trim().length() > 0) {
				let  a = ScopeParser.parseAttributeDef(action, decl, g);
				dict.add(a);
			}
		}
		return dict;
	}

	/**
	 * For decls like "String foo" or "char *foo32[]" compute the ID
	 * and type declarations.  Also handle "int x=3" and 'T t = new T("foo")'
	 * but if the separator is ',' you cannot use ',' in the initvalue
	 * unless you escape use "\," escape.
	 */
	public static  parseAttributeDef(action: ActionAST, decl: <string, number>, g: Grammar):  java.security.KeyStore.Entry.Attribute {
		if (decl.a === null) {
 return null;
}


		let  attr = new  java.security.KeyStore.Entry.Attribute();
		let  rightEdgeOfDeclarator = decl.a.length() - 1;
		let  equalsIndex = decl.a.indexOf('=');
		if (equalsIndex > 0) {
			// everything after the '=' is the init value
			attr.initValue = decl.a.substring(equalsIndex + 1, decl.a.length()).trim();
			rightEdgeOfDeclarator = equalsIndex - 1;
		}

		let  declarator = decl.a.substring(0, rightEdgeOfDeclarator + 1);
		let  p: <number, number>;
		let  text = decl.a;
		text = text.replaceAll("::","");
		if ( text.contains(":") ) {
			// declarator has type appearing after the name like "x:T"
			p = ScopeParser._parsePostfixDecl(attr, declarator, action, g);
		}
		else {
			// declarator has type appearing before the name like "T x"
			p = ScopeParser._parsePrefixDecl(attr, declarator, action, g);
		}
		let  idStart = p.a;
		let  idStop = p.b;

		attr.decl = decl.a;

		if (action !== null) {
			let  actionText = action.getText();
			let  lines = new  Int32Array(actionText.length());
			let  charPositionInLines = new  Int32Array(actionText.length());
			for (let  i = 0;
let  line = 0;
let  col = 0; i < actionText.length(); i++, col++) {
				lines[i] = line;
				charPositionInLines[i] = col;
				if (actionText.charAt(i) === '\n') {
					line++;
					col = -1;
				}
			}

			let  charIndexes = new  Int32Array(actionText.length());
			for (let  i = 0;
let  j = 0; i < actionText.length(); i++, j++) {
				charIndexes[j] = i;
				// skip comments
				if (i < actionText.length() - 1 && actionText.charAt(i) === '/' && actionText.charAt(i + 1) === '/') {
					while (i < actionText.length() && actionText.charAt(i) !== '\n') {
						i++;
					}
				}
			}

			let  declOffset = charIndexes[decl.b];
			let  declLine = lines[declOffset + idStart];

			let  line = action.getToken().getLine() + declLine;
			let  charPositionInLine = charPositionInLines[declOffset + idStart];
			if (declLine === 0) {
				/* offset for the start position of the ARG_ACTION token, plus 1
				 * since the ARG_ACTION text had the leading '[' stripped before
				 * reaching the scope parser.
				 */
				charPositionInLine += action.getToken().getCharPositionInLine() + 1;
			}

			let  offset = ( action.getToken() as CommonToken).getStartIndex();
			attr.token = new  CommonToken(action.getToken().getInputStream(), ANTLRParser.ID, BaseRecognizer.DEFAULT_TOKEN_CHANNEL, offset + declOffset + idStart + 1, offset + declOffset + idStop);
			attr.token.setLine(line);
			attr.token.setCharPositionInLine(charPositionInLine);
			/* assert attr.name.equals(attr.token.getText()) : "Attribute text should match the pseudo-token text at this point."; */
		}

		return attr;
	}

	public static  _parsePrefixDecl(attr: java.security.KeyStore.Entry.Attribute, decl: string, a: ActionAST, g: Grammar):  <number, number> {
		// walk backwards looking for start of an ID
		let  inID = false;
		let  start = -1;
		for (let  i = decl.length() - 1; i >= 0; i--) {
			let  ch = decl.charAt(i);
			// if we haven't found the end yet, keep going
			if (!inID && Character.isLetterOrDigit(ch)) {
				inID = true;
			}
			else {
 if (inID && !(Character.isLetterOrDigit(ch) || ch === '_')) {
				start = i + 1;
				break;
			}
}

		}
		if (start < 0 && inID) {
			start = 0;
		}
		if (start < 0) {
			g.tool.errMgr.grammarError(ErrorType.CANNOT_FIND_ATTRIBUTE_NAME_IN_DECL, g.fileName, a.token, decl);
		}

		// walk forward looking for end of an ID
		let  stop = -1;
		for (let  i = start; i < decl.length(); i++) {
			let  ch = decl.charAt(i);
			// if we haven't found the end yet, keep going
			if (!(Character.isLetterOrDigit(ch) || ch === '_')) {
				stop = i;
				break;
			}
			if (i === decl.length() - 1) {
				stop = i + 1;
			}
		}

		// the name is the last ID
		attr.name = decl.substring(start, stop);

		// the type is the decl minus the ID (could be empty)
		attr.type = decl.substring(0, start);
		if (stop <= decl.length() - 1) {
			attr.type += decl.substring(stop, decl.length());
		}

		attr.type = attr.type.trim();
		if (attr.type.length() === 0) {
			attr.type = null;
		}
		return new  <number, number>(start, stop);
	}

	public static  _parsePostfixDecl(attr: java.security.KeyStore.Entry.Attribute, decl: string, a: ActionAST, g: Grammar):  <number, number> {
		let  start = -1;
		let  stop = -1;
		let  colon = decl.indexOf(':');
		let  namePartEnd = colon === -1 ? decl.length() : colon;

		// look for start of name
		for (let  i = 0; i < namePartEnd; ++i) {
			let  ch = decl.charAt(i);
			if (Character.isLetterOrDigit(ch) || ch === '_') {
				start = i;
				break;
			}
		}

		if (start === -1) {
			start = 0;
			g.tool.errMgr.grammarError(ErrorType.CANNOT_FIND_ATTRIBUTE_NAME_IN_DECL, g.fileName, a.token, decl);
		}

		// look for stop of name
		for (let  i = start; i < namePartEnd; ++i) {
			let  ch = decl.charAt(i);
			if (!(Character.isLetterOrDigit(ch) || ch === '_')) {
				stop = i;
				break;
			}
			if (i === namePartEnd - 1) {
				stop = namePartEnd;
			}
		}

		if (stop === -1) {
			stop = start;
		}

		// extract name from decl
		attr.name =  decl.substring(start, stop);

		// extract type from decl (could be empty)
		if (colon === -1) {
			attr.type = "";
		}
		else {
			attr.type = decl.substring(colon + 1, decl.length());
		}
		attr.type = attr.type.trim();

		if (attr.type.length() === 0) {
			attr.type = null;
		}
		return new  <number, number>(start, stop);
	}

	/**
	 * Given an argument list like
	 * <p>
	 * x, (*a).foo(21,33), 3.2+1, '\n',
	 * "a,oo\nick", {bl, "fdkj"eck}, ["cat\n,", x, 43]
	 * <p>
	 * convert to a list of attributes.  Allow nested square brackets etc...
	 * Set separatorChar to ';' or ',' or whatever you want.
	 */
	public static  splitDecls(s: string, separatorChar: number):  Array<<string, number>> {
		let  args = new  Array<<string, number>>();
		ScopeParser._splitArgumentList(s, 0, -1, separatorChar, args);
		return args;
	}

	public static  _splitArgumentList(actionText: string,
	                                     start: number,
	                                     targetChar: number,
	                                     separatorChar: number,
	                                     args: Array<<string, number>>):  number {
		if (actionText === null) {
			return -1;
		}

		actionText = actionText.replaceAll("//[^\\n]*", "");
		let  n = actionText.length();
		//System.out.println("actionText@"+start+"->"+(char)targetChar+"="+actionText.substring(start,n));
		let  p = start;
		let  last = p;
		while (p < n && actionText.charAt(p) !== targetChar) {
			let  c = actionText.charAt(p);
			switch (c) {
				case '\'':{
					p++;
					while (p < n && actionText.charAt(p) !== '\'') {
						if (actionText.charAt(p) === '\\' && (p + 1) < n &&
								actionText.charAt(p + 1) === '\'') {
							p++; // skip escaped quote
						}
						p++;
					}
					p++;
					break;
}

				case '"':{
					p++;
					while (p < n && actionText.charAt(p) !== '\"') {
						if (actionText.charAt(p) === '\\' && (p + 1) < n &&
								actionText.charAt(p + 1) === '\"') {
							p++; // skip escaped quote
						}
						p++;
					}
					p++;
					break;
}

				case '(':{
					p = ScopeParser._splitArgumentList(actionText, p + 1, ')', separatorChar, args);
					break;
}

				case '{':{
					p = ScopeParser._splitArgumentList(actionText, p + 1, '}', separatorChar, args);
					break;
}

				case '<':{
					if (actionText.indexOf('>', p + 1) >= p) {
						// do we see a matching '>' ahead?  if so, hope it's a generic
						// and not less followed by expr with greater than
						p = ScopeParser._splitArgumentList(actionText, p + 1, '>', separatorChar, args);
					}
					else {
						p++; // treat as normal char
					}
					break;
}

				case '[':{
					p = ScopeParser._splitArgumentList(actionText, p + 1, ']', separatorChar, args);
					break;
}

				default:{
					if (c === separatorChar && targetChar === -1) {
						let  arg = actionText.substring(last, p);
						let  index = last;
						while (index < p && Character.isWhitespace(actionText.charAt(index))) {
							index++;
						}
						//System.out.println("arg="+arg);
						args.add(new  <string, number>(arg.trim(), index));
						last = p + 1;
					}
					p++;
					break;
}

			}
		}
		if (targetChar === -1 && p <= n) {
			let  arg = actionText.substring(last, p).trim();
			let  index = last;
			while (index < p && Character.isWhitespace(actionText.charAt(index))) {
				index++;
			}
			//System.out.println("arg="+arg);
			if (arg.length() > 0) {
				args.add(new  <string, number>(arg.trim(), index));
			}
		}
		p++;
		return p;
	}

}
