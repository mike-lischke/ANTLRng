/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S, JavaObject, MurmurHash } from "jree";



import { ParseTree } from "./ParseTree";
import { ParseTreeVisitor } from "./ParseTreeVisitor";
import { Parser } from "../Parser";
import { RuleContext } from "../RuleContext";
import { Token } from "../Token";
import { Interval } from "../misc/Interval";
import { TerminalNode } from "./TerminalNode";

export class TerminalNodeImpl extends JavaObject implements TerminalNode {
    public symbol: Token;
    public parent: ParseTree | null = null;

    public constructor(symbol: Token) {
        super();
        this.symbol = symbol;
    }

    public getChild = (_i: number): ParseTree | null => {
        return null;
    };

    public getSymbol = (): Token => {
        return this.symbol;
    };

    public getParent = (): ParseTree | null => {
        return this.parent;
    };

    public setParent = (parent: RuleContext | null): void => {
        this.parent = parent;
    };

    public getPayload = (): Token => {
        return this.symbol;
    };

    public getSourceInterval = (): Interval => {
        if (this.symbol === null) {
            return Interval.INVALID;
        }

        const tokenIndex: number = this.symbol.getTokenIndex();

        return new Interval(tokenIndex, tokenIndex);
    };

    public getChildCount = (): number => {
        return 0;
    };

    public accept = <T>(visitor: ParseTreeVisitor<T>): T => {
        return visitor.visitTerminal(this);
    };

    public getText = (): java.lang.String => {
        return this.symbol.getText();
    };

    public toStringTree(_parser?: Parser | null): java.lang.String {
        return this.toString();
    }

    public toString = (): java.lang.String => {
        if (this.symbol.getType() === Token.EOF) {
            return S`<EOF>`;
        }

        return this.symbol.getText();
    };
}
