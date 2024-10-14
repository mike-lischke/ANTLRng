
/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { TokenStream, TokenSource, Token, RuleContext, IntStream, CommonToken, IntegerList, Interval } from "antlr4ng";



export class MockIntTokenStream implements TokenStream {

    public types: IntegerList;
    protected p = 0;

    public constructor(types: IntegerList) { this.types = types; }


    public consume(): void { this.p++; }


    public LA(i: number): number { return this.LT(i).getType(); }


    public mark(): number {
        return this.index();
    }


    public index(): number { return this.p; }


    public release(marker: number): void {
        this.seek(marker);
    }


    public seek(index: number): void {
        this.p = index;
    }


    public size(): number {
        return this.types.size();
    }


    public getSourceName(): string {
        return IntStream.UNKNOWN_SOURCE_NAME;
    }


    public LT(i: number): Token {
        let t: CommonToken;
        let rawIndex = this.p + i - 1;
        if (rawIndex >= this.types.size()) {
            t = new CommonToken(Token.EOF);
        }

        else {
            t = new CommonToken(this.types.get(rawIndex));
        }

        t.setTokenIndex(rawIndex);
        return t;
    }


    public get(i: number): Token {
        return new org.antlr.v4.runtime.CommonToken(this.types.get(i));
    }


    public getTokenSource(): TokenSource {
        return null;
    }



    public getText(): string;



    public getText(interval: Interval): string;



    public getText(ctx: RuleContext): string;



    public getText(start: Token, stop: Token): string;
    public getText(...args: unknown[]): string {
        switch (args.length) {
            case 0: {

                throw new UnsupportedOperationException("can't give strings");


                break;
            }

            case 1: {
                const [interval] = args as [Interval];


                throw new UnsupportedOperationException("can't give strings");


                break;
            }

            case 1: {
                const [ctx] = args as [RuleContext];


                throw new UnsupportedOperationException("can't give strings");


                break;
            }

            case 2: {
                const [start, stop] = args as [Token, Token];


                throw new UnsupportedOperationException("can't give strings");


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

}
