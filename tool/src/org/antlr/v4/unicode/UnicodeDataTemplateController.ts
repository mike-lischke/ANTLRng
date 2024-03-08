/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Interval, IntervalSet, LinkedHashMap as HashMap } from "antlr4ng";



/**
 * StringTemplate controller used to generate parameters to feed
 * to {@code unicodedata.st} to code-generate {@code UnicodeData.java},
 * used by the tool for Unicode property escapes like {@code \\p\{Lu\}}.
 *
 * Uses ICU to iterate over Unicode character categories, properties,
 * and script codes, as well as aliases for those codes.
 *
 * This class exists in its own Maven module to avoid adding a
 * dependency from the tool onto the (large) ICU runtime.
 */
export abstract  class UnicodeDataTemplateController {

	public static  getProperties():  Map<string, Object> {
		let  propertyCodePointRanges = new  LinkedHashMap();
		UnicodeDataTemplateController.addUnicodeCategoryCodesToCodePointRanges(propertyCodePointRanges);
		UnicodeDataTemplateController.addUnicodeBinaryPropertyCodesToCodePointRanges(propertyCodePointRanges);
		UnicodeDataTemplateController.addUnicodeIntPropertyCodesToCodePointRanges(propertyCodePointRanges);
		UnicodeDataTemplateController.addTR35ExtendedPictographicPropertyCodesToCodePointRanges(propertyCodePointRanges);
		UnicodeDataTemplateController.addEmojiPresentationPropertyCodesToCodePointRanges(propertyCodePointRanges);

		let  propertyAliases = new  LinkedHashMap();
		UnicodeDataTemplateController.addUnicodeCategoryCodesToNames(propertyAliases);
		UnicodeDataTemplateController.addUnicodeBinaryPropertyCodesToNames(propertyAliases);
		UnicodeDataTemplateController.addUnicodeScriptCodesToNames(propertyAliases);
		UnicodeDataTemplateController.addUnicodeBlocksToNames(propertyAliases);
		UnicodeDataTemplateController.addUnicodeIntPropertyCodesToNames(propertyAliases);
		propertyAliases.put("EP", "Extended_Pictographic");

		let  rawPropertyCodePointRanges = new  LinkedHashMap();
		for (let entry of propertyCodePointRanges.entrySet()) {
			rawPropertyCodePointRanges.put(entry.getKey().toLowerCase(Intl.Locale.US), UnicodeDataTemplateController.convertToRawArray(entry.getValue()));
		}
		let  rawPropertyAliases = new  Array(propertyAliases.size() * 2);
		for (let entry of propertyAliases.entrySet()) {
			rawPropertyAliases.add(entry.getKey().toLowerCase(Intl.Locale.US));
			rawPropertyAliases.add(entry.getValue().toLowerCase(Intl.Locale.US));
		}

		let  properties = new  LinkedHashMap();
		properties.put("rawPropertyCodePointRanges", rawPropertyCodePointRanges);
		properties.put("rawPropertyAliases", rawPropertyAliases);
		return properties;
	}
	private static  addIntervalForCategory(
			categoryMap: Map<string, IntervalSet>,
			categoryName: string,
			start: number,
			finish: number):  void {
		let  intervalSet = categoryMap.get(categoryName);
		if (intervalSet === null) {
			intervalSet = new  IntervalSet();
			categoryMap.put(categoryName, intervalSet);
		}
		intervalSet.add(start, finish);
	}

	private static  addPropertyAliases(
			propertyAliases: Map<string, string>,
			propertyName: string,
			property: number):  void {
		let  nameChoice = UProperty.NameChoice.LONG;
		while (true) {
			let  alias: string;
			try {
				alias = UCharacter.getPropertyName(property, nameChoice);
			} catch (e) {
if (e instanceof IllegalArgumentException) {
				// No more aliases.
				break;
			} else {
	throw e;
	}
}
			/* assert alias != null; */ 
			UnicodeDataTemplateController.addPropertyAlias(propertyAliases, alias, propertyName);
			nameChoice++;
		}
	}

	private static  addPropertyAlias(
			propertyAliases: Map<string, string>,
			alias: string,
			propertyName: string):  void {
		propertyAliases.put(alias, propertyName);
	}

	private static  convertToRawArray(intervalSet: IntervalSet):  Array<number> {
		let  intervals = intervalSet.getIntervals();
		let  intervalSetSize = intervals.size();
		let  rawArray = new  Array(intervalSetSize * 2);
		for (let interval of intervals) {
			rawArray.add(interval.a);
			rawArray.add(interval.b);
		}
		return rawArray;
	}

	private static  getShortPropertyName(property: number):  string {
		let  propertyName = UCharacter.getPropertyName(property, UProperty.NameChoice.SHORT);
		// For some reason, a few properties only have long names.
		if (propertyName === null) {
			propertyName = UCharacter.getPropertyName(property, UProperty.NameChoice.LONG);
		}
		return propertyName;
	}

	private static  addUnicodeCategoryCodesToCodePointRanges(propertyCodePointRanges: Map<string, IntervalSet>):  void {
		let  iter = UCharacter.getTypeIterator();
		let  element = new  RangeValueIterator.Element();
		while (iter.next(element)) {
			let  categoryName = UCharacter.getPropertyValueName(
					UProperty.GENERAL_CATEGORY_MASK,
					1 << element.value,
					UProperty.NameChoice.SHORT);
			UnicodeDataTemplateController.addIntervalForCategory(propertyCodePointRanges, categoryName, element.start, element.limit - 1);
			// Add short category so Ll, Lu, Lo, etc. all show up under L
			let  shortCategoryName = categoryName.substring(0, 1);
			UnicodeDataTemplateController.addIntervalForCategory(propertyCodePointRanges, shortCategoryName, element.start, element.limit - 1);
		}
	}

	private static  addUnicodeCategoryCodesToNames(propertyAliases: Map<string, string>):  void {
		let  iter = UCharacter.getTypeIterator();
		let  element = new  RangeValueIterator.Element();
		while (iter.next(element)) {
			let  generalCategoryMask = 1 << element.value;
			let  categoryName = UCharacter.getPropertyValueName(
					UProperty.GENERAL_CATEGORY_MASK,
					generalCategoryMask,
					UProperty.NameChoice.SHORT);
			let  nameChoice = UProperty.NameChoice.LONG;
			while (true) {
				let  alias: string;
				try {
					alias = UCharacter.getPropertyValueName(
							UProperty.GENERAL_CATEGORY_MASK,
							generalCategoryMask,
							nameChoice);
				} catch (e) {
if (e instanceof IllegalArgumentException) {
					// No more aliases.
					break;
				} else {
	throw e;
	}
}
				/* assert alias != null; */ 
				UnicodeDataTemplateController.addPropertyAlias(propertyAliases, alias, categoryName);
				nameChoice++;
			}
		}
		// Add short categories
		UnicodeDataTemplateController.addPropertyAlias(propertyAliases, "Control", "C");
		UnicodeDataTemplateController.addPropertyAlias(propertyAliases, "Letter", "L");
		UnicodeDataTemplateController.addPropertyAlias(propertyAliases, "Number", "N");
		UnicodeDataTemplateController.addPropertyAlias(propertyAliases, "Mark", "M");
		UnicodeDataTemplateController.addPropertyAlias(propertyAliases, "Punctuation", "P");
		UnicodeDataTemplateController.addPropertyAlias(propertyAliases, "Symbol", "S");
		UnicodeDataTemplateController.addPropertyAlias(propertyAliases, "Space", "Z");
	}

	private static  addUnicodeBinaryPropertyCodesToCodePointRanges(propertyCodePointRanges: Map<string, IntervalSet>):  void {
		for (let  property = UProperty.BINARY_START;
		     property < UProperty.BINARY_LIMIT;
		     property++) {
			let  propertyName = UnicodeDataTemplateController.getShortPropertyName(property);
			let  intervalSet = new  IntervalSet();
			let  unicodeSet = new  UnicodeSet();
			unicodeSet.applyIntPropertyValue(property, 1);
			for (let range of unicodeSet.ranges()) {
				intervalSet.add(range.codepoint, range.codepointEnd);
			}
			propertyCodePointRanges.put(propertyName, intervalSet);
		}
	}

	private static  addUnicodeBinaryPropertyCodesToNames(propertyAliases: Map<string, string>):  void {
		for (let  property = UProperty.BINARY_START;
		     property < UProperty.BINARY_LIMIT;
		     property++) {
			let  propertyName = UnicodeDataTemplateController.getShortPropertyName(property);
			UnicodeDataTemplateController.addPropertyAliases(propertyAliases, propertyName, property);
		}
	}

	private static  addIntPropertyRanges(property: number, namePrefix: string, propertyCodePointRanges: Map<string, IntervalSet>):  void {
		for (let  propertyValue = UCharacter.getIntPropertyMinValue(property);
		     propertyValue <= UCharacter.getIntPropertyMaxValue(property);
		     propertyValue++) {
			let  set = new  UnicodeSet();
			set.applyIntPropertyValue(property, propertyValue);
			let  propertyName = namePrefix + UCharacter.getPropertyValueName(property, propertyValue, UProperty.NameChoice.SHORT);
			let  intervalSet = propertyCodePointRanges.get(propertyName);
			if (intervalSet === null) {
				intervalSet = new  IntervalSet();
				propertyCodePointRanges.put(propertyName, intervalSet);
			}
			UnicodeDataTemplateController.addUnicodeSetToIntervalSet(set, intervalSet);
		}
	}

	private static  addUnicodeSetToIntervalSet(unicodeSet: UnicodeSet, intervalSet: IntervalSet):  void {
		for (let range of unicodeSet.ranges()) {
			intervalSet.add(range.codepoint, range.codepointEnd);
		}
	}

	private static  addUnicodeIntPropertyCodesToCodePointRanges(propertyCodePointRanges: Map<string, IntervalSet>):  void {
		for (let  property = UProperty.INT_START;
		     property < UProperty.INT_LIMIT;
		     property++) {
			let  propertyName = UnicodeDataTemplateController.getShortPropertyName(property);
			UnicodeDataTemplateController.addIntPropertyRanges(property, propertyName + "=", propertyCodePointRanges);
		}
	}

	private static  addTR35ExtendedPictographicPropertyCodesToCodePointRanges(propertyCodePointRanges: Map<string, IntervalSet>):  void {
		let  set = new  IntervalSet();
		// Generated using scripts/parse-extended-pictographic/parse.py
		set.add(0x1F774, 0x1F77F);
		set.add(0x2700, 0x2701);
		set.add(0x2703, 0x2704);
		set.add(0x270E);
		set.add(0x2710, 0x2711);
		set.add(0x2765, 0x2767);
		set.add(0x1F030, 0x1F093);
		set.add(0x1F094, 0x1F09F);
		set.add(0x1F10D, 0x1F10F);
		set.add(0x1F12F);
		set.add(0x1F16C, 0x1F16F);
		set.add(0x1F1AD, 0x1F1E5);
		set.add(0x1F260, 0x1F265);
		set.add(0x1F203, 0x1F20F);
		set.add(0x1F23C, 0x1F23F);
		set.add(0x1F249, 0x1F24F);
		set.add(0x1F252, 0x1F25F);
		set.add(0x1F266, 0x1F2FF);
		set.add(0x1F7D5, 0x1F7FF);
		set.add(0x1F000, 0x1F003);
		set.add(0x1F005, 0x1F02B);
		set.add(0x1F02C, 0x1F02F);
		set.add(0x1F322, 0x1F323);
		set.add(0x1F394, 0x1F395);
		set.add(0x1F398);
		set.add(0x1F39C, 0x1F39D);
		set.add(0x1F3F1, 0x1F3F2);
		set.add(0x1F3F6);
		set.add(0x1F4FE);
		set.add(0x1F53E, 0x1F548);
		set.add(0x1F54F);
		set.add(0x1F568, 0x1F56E);
		set.add(0x1F571, 0x1F572);
		set.add(0x1F57B, 0x1F586);
		set.add(0x1F588, 0x1F589);
		set.add(0x1F58E, 0x1F58F);
		set.add(0x1F591, 0x1F594);
		set.add(0x1F597, 0x1F5A3);
		set.add(0x1F5A6, 0x1F5A7);
		set.add(0x1F5A9, 0x1F5B0);
		set.add(0x1F5B3, 0x1F5BB);
		set.add(0x1F5BD, 0x1F5C1);
		set.add(0x1F5C5, 0x1F5D0);
		set.add(0x1F5D4, 0x1F5DB);
		set.add(0x1F5DF, 0x1F5E0);
		set.add(0x1F5E2);
		set.add(0x1F5E4, 0x1F5E7);
		set.add(0x1F5E9, 0x1F5EE);
		set.add(0x1F5F0, 0x1F5F2);
		set.add(0x1F5F4, 0x1F5F9);
		set.add(0x2605);
		set.add(0x2607, 0x260D);
		set.add(0x260F, 0x2610);
		set.add(0x2612);
		set.add(0x2616, 0x2617);
		set.add(0x2619, 0x261C);
		set.add(0x261E, 0x261F);
		set.add(0x2621);
		set.add(0x2624, 0x2625);
		set.add(0x2627, 0x2629);
		set.add(0x262B, 0x262D);
		set.add(0x2630, 0x2637);
		set.add(0x263B, 0x2647);
		set.add(0x2654, 0x265F);
		set.add(0x2661, 0x2662);
		set.add(0x2664);
		set.add(0x2667);
		set.add(0x2669, 0x267A);
		set.add(0x267C, 0x267E);
		set.add(0x2680, 0x2691);
		set.add(0x2695);
		set.add(0x2698);
		set.add(0x269A);
		set.add(0x269D, 0x269F);
		set.add(0x26A2, 0x26A9);
		set.add(0x26AC, 0x26AF);
		set.add(0x26B2, 0x26BC);
		set.add(0x26BF, 0x26C3);
		set.add(0x26C6, 0x26C7);
		set.add(0x26C9, 0x26CD);
		set.add(0x26D0);
		set.add(0x26D2);
		set.add(0x26D5, 0x26E8);
		set.add(0x26EB, 0x26EF);
		set.add(0x26F6);
		set.add(0x26FB, 0x26FC);
		set.add(0x26FE, 0x26FF);
		set.add(0x2388);
		set.add(0x1FA00, 0x1FFFD);
		set.add(0x1F0A0, 0x1F0AE);
		set.add(0x1F0B1, 0x1F0BF);
		set.add(0x1F0C1, 0x1F0CF);
		set.add(0x1F0D1, 0x1F0F5);
		set.add(0x1F0AF, 0x1F0B0);
		set.add(0x1F0C0);
		set.add(0x1F0D0);
		set.add(0x1F0F6, 0x1F0FF);
		set.add(0x1F80C, 0x1F80F);
		set.add(0x1F848, 0x1F84F);
		set.add(0x1F85A, 0x1F85F);
		set.add(0x1F888, 0x1F88F);
		set.add(0x1F8AE, 0x1F8FF);
		set.add(0x1F900, 0x1F90B);
		set.add(0x1F91F);
		set.add(0x1F928, 0x1F92F);
		set.add(0x1F931, 0x1F932);
		set.add(0x1F94C);
		set.add(0x1F95F, 0x1F96B);
		set.add(0x1F992, 0x1F997);
		set.add(0x1F9D0, 0x1F9E6);
		set.add(0x1F90C, 0x1F90F);
		set.add(0x1F93F);
		set.add(0x1F94D, 0x1F94F);
		set.add(0x1F96C, 0x1F97F);
		set.add(0x1F998, 0x1F9BF);
		set.add(0x1F9C1, 0x1F9CF);
		set.add(0x1F9E7, 0x1F9FF);
		set.add(0x1F6C6, 0x1F6CA);
		set.add(0x1F6D3, 0x1F6D4);
		set.add(0x1F6E6, 0x1F6E8);
		set.add(0x1F6EA);
		set.add(0x1F6F1, 0x1F6F2);
		set.add(0x1F6F7, 0x1F6F8);
		set.add(0x1F6D5, 0x1F6DF);
		set.add(0x1F6ED, 0x1F6EF);
		set.add(0x1F6F9, 0x1F6FF);
		propertyCodePointRanges.put("Extended_Pictographic", set);

		let  emojiRKUnicodeSet = new  UnicodeSet("[\\p{GCB=Regional_Indicator}\\*#0-9\\u00a9\\u00ae\\u2122\\u3030\\u303d]");
		let  emojiRKIntervalSet = new  IntervalSet();
		UnicodeDataTemplateController.addUnicodeSetToIntervalSet(emojiRKUnicodeSet, emojiRKIntervalSet);
		propertyCodePointRanges.put("EmojiRK", emojiRKIntervalSet);

		let  emojiNRKUnicodeSet = new  UnicodeSet("[\\p{Emoji=Yes}]");
		emojiNRKUnicodeSet.removeAll(emojiRKUnicodeSet);
		let  emojiNRKIntervalSet = new  IntervalSet();
		UnicodeDataTemplateController.addUnicodeSetToIntervalSet(emojiNRKUnicodeSet, emojiNRKIntervalSet);
		propertyCodePointRanges.put("EmojiNRK", emojiNRKIntervalSet);
	}

	private static  addEmojiPresentationPropertyCodesToCodePointRanges(propertyCodePointRanges: Map<string, IntervalSet>):  void {
		let  emojiDefaultUnicodeSet = new  UnicodeSet("[[\\p{Emoji=Yes}]&[\\p{Emoji_Presentation=Yes}]]");
		let  emojiDefaultIntervalSet = new  IntervalSet();
		UnicodeDataTemplateController.addUnicodeSetToIntervalSet(emojiDefaultUnicodeSet, emojiDefaultIntervalSet);
		propertyCodePointRanges.put("EmojiPresentation=EmojiDefault", emojiDefaultIntervalSet);

		let  textDefaultUnicodeSet = new  UnicodeSet("[[\\p{Emoji=Yes}]&[\\p{Emoji_Presentation=No}]]");
		let  textDefaultIntervalSet = new  IntervalSet();
		UnicodeDataTemplateController.addUnicodeSetToIntervalSet(textDefaultUnicodeSet, textDefaultIntervalSet);
		propertyCodePointRanges.put("EmojiPresentation=TextDefault", textDefaultIntervalSet);

		let  textUnicodeSet = new  UnicodeSet("[\\p{Emoji=No}]");
		let  textIntervalSet = new  IntervalSet();
		UnicodeDataTemplateController.addUnicodeSetToIntervalSet(textUnicodeSet, textIntervalSet);
		propertyCodePointRanges.put("EmojiPresentation=Text", textIntervalSet);
        }

	private static  addIntPropertyAliases(property: number, namePrefix: string, propertyAliases: Map<string, string>):  void {
		let  propertyName = UnicodeDataTemplateController.getShortPropertyName(property);
		for (let  propertyValue = UCharacter.getIntPropertyMinValue(property);
		     propertyValue <= UCharacter.getIntPropertyMaxValue(property);
		     propertyValue++) {
			let  aliasTarget = propertyName + "=" + UCharacter.getPropertyValueName(property, propertyValue, UProperty.NameChoice.SHORT);
			let  nameChoice = UProperty.NameChoice.SHORT;
			let  alias: string;
			while (true) {
				try {
					alias = namePrefix + UCharacter.getPropertyValueName(property, propertyValue, nameChoice);
				} catch (e) {
if (e instanceof IllegalArgumentException) {
					// No more aliases.
					break;
				} else {
	throw e;
	}
}
				/* assert alias != null; */ 
				UnicodeDataTemplateController.addPropertyAlias(propertyAliases, alias, aliasTarget);
				nameChoice++;
			}
		}
	}

	private static  addUnicodeScriptCodesToNames(propertyAliases: Map<string, string>):  void {
		UnicodeDataTemplateController.addIntPropertyAliases(UProperty.SCRIPT, "", propertyAliases);
	}

	private static  addUnicodeBlocksToNames(propertyAliases: Map<string, string>):  void {
		UnicodeDataTemplateController.addIntPropertyAliases(UProperty.BLOCK, "In", propertyAliases);
	}

	private static  addUnicodeIntPropertyCodesToNames(propertyAliases: Map<string, string>):  void {
		for (let  property = UProperty.INT_START;
		     property < UProperty.INT_LIMIT;
		     property++) {
			let  nameChoice = UProperty.NameChoice.SHORT + 1;
			while (true) {
				let  propertyNameAlias: string;
				try {
					propertyNameAlias = UCharacter.getPropertyName(property, nameChoice);
				} catch (e) {
if (e instanceof IllegalArgumentException) {
					// No more aliases.
					break;
				} else {
	throw e;
	}
}
				UnicodeDataTemplateController.addIntPropertyAliases(property, propertyNameAlias + "=", propertyAliases);
				nameChoice++;
			}
		}
	}
}
