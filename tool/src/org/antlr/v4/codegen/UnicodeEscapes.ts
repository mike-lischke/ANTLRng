/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */



/**
 * Utility class to escape Unicode code points using various
 * languages' syntax.
 */
export  class UnicodeEscapes {
	public static  escapeCodePoint(codePoint: number, language: string):  string {
		let  result = new  StringBuilder();
		UnicodeEscapes.appendEscapedCodePoint(result, codePoint, language);
		return result.toString();
	}

	public static  appendEscapedCodePoint(sb: StringBuilder, codePoint: number, language: string):  void {
		switch (language) {
			case "CSharp":
			case "Python3":
			case "Cpp":
			case "Go":
			case "PHP":{
				let  format = Character.isSupplementaryCodePoint(codePoint) ? "\\U%08X" : "\\u%04X";
				sb.append(string.format(format, codePoint));
				break;
}

			case "Swift":{
				sb.append(string.format("\\u{%04X}", codePoint));
				break;
}

			case "Java":
			case "JavaScript":
			case "TypeScript":
			case "Dart":
			default:{
				if (Character.isSupplementaryCodePoint(codePoint)) {
					// char is not an 'integral' type, so we have to explicitly convert
					// to int before passing to the %X formatter or else it throws.
					sb.append(string.format("\\u%04X", Number(Character.highSurrogate(codePoint))));
					sb.append(string.format("\\u%04X", Number(Character.lowSurrogate(codePoint))));
				}
				else {
					sb.append(string.format("\\u%04X", codePoint));
				}
				break;
}

		}
	}
}
