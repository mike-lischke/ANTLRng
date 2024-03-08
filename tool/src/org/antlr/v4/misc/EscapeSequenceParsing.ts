/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { CharSupport } from "./CharSupport.js";
import { IntervalSet } from "antlr4ng";



/**
 * Utility class to parse escapes like:
 *   \\n
 *   \\uABCD
 *   \\u{10ABCD}
 *   \\p{Foo}
 *   \\P{Bar}
 *   \\p{Baz=Blech}
 *   \\P{Baz=Blech}
 */
export abstract  class EscapeSequenceParsing {
	public static Result =  class Result {

		public readonly  type:  EscapeSequenceParsing.Result.Type;
		public readonly  codePoint:  number;
		public readonly  propertyIntervalSet:  IntervalSet;
		public readonly  startOffset:  number;
		public readonly  parseLength:  number;

		public  constructor(type: EscapeSequenceParsing.Result.Type, codePoint: number, propertyIntervalSet: IntervalSet, startOffset: number, parseLength: number) {
			this.type = type;
			this.codePoint = codePoint;
			this.propertyIntervalSet = propertyIntervalSet;
			this.startOffset = startOffset;
			this.parseLength = parseLength;
		}

		@Override
public override  toString():  string {
			return string.format(
					"%s type=%s codePoint=%d propertyIntervalSet=%s parseLength=%d",
					super.toString(),
					this.type,
					this.codePoint,
					this.propertyIntervalSet,
					this.parseLength);
		}

		@Override
public override  equals(other: Object):  boolean {
			if (!(other instanceof Result)) {
				return false;
			}
			let  that =  other as Result;
			if (this === that) {
				return true;
			}
			return Objects.equals(this.type, that.type) &&
				Objects.equals(this.codePoint, that.codePoint) &&
				Objects.equals(this.propertyIntervalSet, that.propertyIntervalSet) &&
				Objects.equals(this.parseLength, that.parseLength);
		}

		@Override
public override  hashCode():  number {
			return Objects.hash(this.type, this.codePoint, this.propertyIntervalSet, this.parseLength);
		}
		public static  Type =  class Type extends Enum<Type> {
			public static readonly INVALID: Type = new class extends Type {
}(S`INVALID`, 0);
			public static readonly CODE_POINT: Type = new class extends Type {
}(S`CODE_POINT`, 1);
			public static readonly PROPERTY: Type = new class extends Type {
}(S`PROPERTY`, 2)
		};
 ;
	};


	/**
	 * Parses a single escape sequence starting at {@code startOff}.
	 *
	 * Returns a type of INVALID if no valid escape sequence was found, a Result otherwise.
	 */
	public static  parseEscape(s: string, startOff: number):  EscapeSequenceParsing.Result {
		let  offset = startOff;
		if (offset + 2 > s.length() || s.codePointAt(offset) !== '\\') {
			return EscapeSequenceParsing.invalid(startOff, s.length()-1);
		}
		// Move past backslash
		offset++;
		let  escaped = s.codePointAt(offset);
		// Move past escaped code point
		offset += Character.charCount(escaped);
		if (escaped === 'u') {
			// \\u{1} is the shortest we support
			if (offset + 3 > s.length()) {
				return EscapeSequenceParsing.invalid(startOff, s.length()-1);
			}
			let  hexStartOffset: number;
			let  hexEndOffset: number; // appears to be exclusive
			if (s.codePointAt(offset) === '{') {
				hexStartOffset = offset + 1;
				hexEndOffset = s.indexOf('}', hexStartOffset);
				if (hexEndOffset === -1) {
					return EscapeSequenceParsing.invalid(startOff, s.length()-1);
				}
				offset = hexEndOffset + 1;
			}
			else {
				if (offset + 4 > s.length()) {
					return EscapeSequenceParsing.invalid(startOff, s.length()-1);
				}
				hexStartOffset = offset;
				hexEndOffset = offset + 4;
				offset = hexEndOffset;
			}
			let  codePointValue = CharSupport.parseHexValue(s, hexStartOffset, hexEndOffset);
			if (codePointValue === -1 || codePointValue > Character.MAX_CODE_POINT) {
				return EscapeSequenceParsing.invalid(startOff, startOff+6-1);
			}
			return new  EscapeSequenceParsing.Result(
				EscapeSequenceParsing.Result.Type.CODE_POINT,
				codePointValue,
				IntervalSet.EMPTY_SET,
				startOff,
				offset - startOff);
		}
		else {
 if (escaped === 'p' || escaped === 'P') {
			// \p{L} is the shortest we support
			if (offset + 3 > s.length()) {
				return EscapeSequenceParsing.invalid(startOff, s.length()-1);
			}
			if (s.codePointAt(offset) !== '{') {
				return EscapeSequenceParsing.invalid(startOff, offset);
			}
			let  openBraceOffset = offset;
			let  closeBraceOffset = s.indexOf('}', openBraceOffset);
			if (closeBraceOffset === -1) {
				return EscapeSequenceParsing.invalid(startOff, s.length()-1);
			}
			let  propertyName = s.substring(openBraceOffset + 1, closeBraceOffset);
			let  propertyIntervalSet = UnicodeData.getPropertyCodePoints(propertyName);
			if (propertyIntervalSet === null || propertyIntervalSet.isNil()) {
				return EscapeSequenceParsing.invalid(startOff, closeBraceOffset);
			}
			offset = closeBraceOffset + 1;
			if (escaped === 'P') {
				propertyIntervalSet = propertyIntervalSet.complement(IntervalSet.COMPLETE_CHAR_SET);
			}
			return new  EscapeSequenceParsing.Result(
				EscapeSequenceParsing.Result.Type.PROPERTY,
				-1,
				propertyIntervalSet,
				startOff,
				offset - startOff);
		}
		else {
 if (escaped < CharSupport.ANTLRLiteralEscapedCharValue.length) {
			let  codePoint = CharSupport.ANTLRLiteralEscapedCharValue[escaped];
			if (codePoint === 0) {
				if (escaped !== ']' && escaped !== '-') { // escape ']' and '-' only in char sets.
					return EscapeSequenceParsing.invalid(startOff, startOff+1);
				}
				else {
					codePoint = escaped;
				}
			}
			return new  EscapeSequenceParsing.Result(
				EscapeSequenceParsing.Result.Type.CODE_POINT,
				codePoint,
				IntervalSet.EMPTY_SET,
				startOff,
				offset - startOff);
		}
		else {
			return EscapeSequenceParsing.invalid(startOff,s.length()-1);
		}
}

}

	}

	private static  invalid(start: number, stop: number):  EscapeSequenceParsing.Result { // start..stop is inclusive
		return new  EscapeSequenceParsing.Result(
			EscapeSequenceParsing.Result.Type.INVALID,
			0,
			IntervalSet.EMPTY_SET,
			start,
			stop - start + 1);
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace EscapeSequenceParsing {
	export type Result = InstanceType<typeof EscapeSequenceParsing.Result>;


// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
namespace Result {
	export type Type = InstanceType<typeof Result.Type>;
}

}


