/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


import { java } from "../../../../../lib/java/java";
import { Token } from "./Token";




export  interface WritableToken extends Token {
	 setText: (text: java.lang.String| null) => void;

	 setType: (ttype: number) => void;

	 setLine: (line: number) => void;

	 setCharPositionInLine: (pos: number) => void;

	 setChannel: (channel: number) => void;

	 setTokenIndex: (index: number) => void;
}
