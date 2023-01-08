/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { ParseTree } from "./ParseTree";
import { ParseTreeVisitor } from "./ParseTreeVisitor";
import { Parser } from "../Parser";
import { RuleContext } from "../RuleContext";
import { Token } from "../Token";
import { Interval } from "../misc/Interval";


import { JavaObject } from "../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../lib/templates";


export  class TerminalNodeImpl extends JavaObject implements TerminalNode {
	public symbol:  Token | null;
	public parent:  ParseTree | null;

	public constructor(symbol: Token| null) {	super();
this.symbol = symbol;	}

	public getChild = (i: number):  ParseTree | null => {return null;}

	public getSymbol = ():  Token | null => {return this.symbol;}

	public getParent = ():  ParseTree | null => { return this.parent; }

	public setParent = (parent: RuleContext| null):  void => {
		this.parent = parent;
	}

	public getPayload = ():  Token | null => { return this.symbol; }

	public getSourceInterval = ():  Interval | null => {
		if ( this.symbol ===null ) {
 return Interval.INVALID;
}


		let  tokenIndex: number = this.symbol.getTokenIndex();
		return new  Interval(tokenIndex, tokenIndex);
	}

	public getChildCount = ():  number => { return 0; }

	public accept =  <T>(visitor: ParseTreeVisitor< T>| null):  T | null => {
		return visitor.visitTerminal(this);
	}

	public getText = ():  java.lang.String | null => { return this.symbol.getText(); }

	public toStringTree():  java.lang.String | null;

	public toStringTree(parser: Parser| null):  java.lang.String | null;


	public toStringTree(parser?: Parser | null):  java.lang.String | null {
if (parser === undefined) {
		return this.toString();
	}
 else  {
		return this.toString();
	}

}


	public toString = ():  java.lang.String | null => {
			if ( this.symbol.getType() === Token.EOF ) {
 return S`<EOF>`;
}

			return this.symbol.getText();
	}
}
