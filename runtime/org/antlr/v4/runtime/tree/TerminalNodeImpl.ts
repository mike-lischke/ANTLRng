/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { ParseTree } from "./ParseTree";
import { ParseTreeVisitor } from "./ParseTreeVisitor";
import { Parser } from "../Parser";
import { RuleContext } from "../RuleContext";
import { Token } from "../Token";
import { Interval } from "../misc/Interval";




export  class TerminalNodeImpl extends  TerminalNode {
	public symbol?:  Token;
	public parent?:  ParseTree;

	public constructor(symbol: Token) {	super();
this.symbol = symbol;	}

	public getChild = (i: number): ParseTree => {return undefined;}

	public getSymbol = (): Token => {return this.symbol;}

	public getParent = (): ParseTree => { return this.parent; }

	public setParent = (parent: RuleContext): void => {
		this.parent = parent;
	}

	public getPayload = (): Token => { return this.symbol; }

	public getSourceInterval = (): Interval => {
		if ( this.symbol ===undefined ) {
 return Interval.INVALID;
}


		let  tokenIndex: number = this.symbol.getTokenIndex();
		return new  Interval(tokenIndex, tokenIndex);
	}

	public getChildCount = (): number => { return 0; }

	public accept =  <T>(visitor: ParseTreeVisitor< T>): T => {
		return visitor.visitTerminal(this);
	}

	public getText = (): string => { return this.symbol.getText(); }

	public toStringTree(): string;

	public toStringTree(parser: Parser): string;


	public toStringTree(parser?: Parser):  string {
if (parser === undefined) {
		return this.toString();
	}
 else  {
		return this.toString();
	}

}


	public toString = (): string => {
			if ( this.symbol.getType() === Token.EOF ) {
 return "<EOF>";
}

			return this.symbol.getText();
	}
}
