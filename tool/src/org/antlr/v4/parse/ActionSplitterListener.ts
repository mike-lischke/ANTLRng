/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





/** */
 interface ActionSplitterListener {
      qualifiedAttr(expr: string, x: Token, y: Token): void;
	  setAttr(expr: string, x: Token, rhs: Token): void;
	  attr(expr: string, x: Token): void;

	  setNonLocalAttr(expr: string, x: Token, y: Token, rhs: Token): void;
	  nonLocalAttr(expr: string, x: Token, y: Token): void;

      text(text: string): void;
}
