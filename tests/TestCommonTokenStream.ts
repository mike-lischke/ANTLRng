/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { CharStream, CommonToken, CommonTokenStream, Lexer, Token, TokenFactory, TokenSource, TokenStream, WritableToken } from "antlr4ng";



export class TestCommonTokenStream extends TestBufferedTokenStream {

    @Test
    public testOffChannel(): void {
        let lexer = // simulate input " x =34  ;\n"
            new class implements TokenSource {
                protected i = 0;
                @SuppressWarnings("serial")
                protected tokens = [
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, " "),
                    new CommonToken(1, "x"),
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, " "),
                    new CommonToken(1, "="),
                    new CommonToken(1, "34"),
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, " "),
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, " "),
                    new CommonToken(1, ";"),
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, "\n"),
                    new CommonToken(Token.EOF, "")
                ];

                public nextToken(): Token {
                    return this.tokens[this.i++];
                }

                public getSourceName(): string { return "test"; }

                public getCharPositionInLine(): number {
                    return 0;
                }

                public getLine(): number {
                    return 0;
                }

                public getInputStream(): CharStream {
                    return null;
                }


                public setTokenFactory(factory: TokenFactory<unknown>): void {
                }


                public getTokenFactory(): TokenFactory<unknown> {
                    return null;
                }
            }();

        let tokens = new CommonTokenStream(lexer);

        assertEquals("x", tokens.LT(1).getText()); // must skip first off channel token
        tokens.consume();
        assertEquals("=", tokens.LT(1).getText());
        assertEquals("x", tokens.LT(-1).getText());

        tokens.consume();
        assertEquals("34", tokens.LT(1).getText());
        assertEquals("=", tokens.LT(-1).getText());

        tokens.consume();
        assertEquals(";", tokens.LT(1).getText());
        assertEquals("34", tokens.LT(-1).getText());

        tokens.consume();
        assertEquals(Token.EOF, tokens.LA(1));
        assertEquals(";", tokens.LT(-1).getText());

        assertEquals("34", tokens.LT(-2).getText());
        assertEquals("=", tokens.LT(-3).getText());
        assertEquals("x", tokens.LT(-4).getText());
    }

    @Test
    public testFetchOffChannel(): void {
        let lexer = // simulate input " x =34  ; \n"
            // token indexes   01234 56789
            new class implements TokenSource {
                protected i = 0;
                @SuppressWarnings("serial")
                protected tokens = [
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, " "), // 0
                    new CommonToken(1, "x"),								// 1
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, " "),	// 2
                    new CommonToken(1, "="),								// 3
                    new CommonToken(1, "34"),							// 4
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, " "),	// 5
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, " "), // 6
                    new CommonToken(1, ";"),								// 7
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, " "),// 8
                    new class extends CommonToken {
                        public constructor() {
                            super();
                            java.nio.channels.FileLock.channel = Lexer.HIDDEN;
                        }
                    }(1, "\n"),// 9
                    new CommonToken(Token.EOF, "")						// 10
                ];

                public nextToken(): Token {
                    return this.tokens[this.i++];
                }

                public getSourceName(): string { return "test"; }

                public getCharPositionInLine(): number {
                    return 0;
                }

                public getLine(): number {
                    return 0;
                }

                public getInputStream(): CharStream {
                    return null;
                }


                public setTokenFactory(factory: TokenFactory<unknown>): void {
                }


                public getTokenFactory(): TokenFactory<unknown> {
                    return null;
                }
            }();

        let tokens = new CommonTokenStream(lexer);
        tokens.fill();
        assertEquals(null, tokens.getHiddenTokensToLeft(0));
        assertEquals(null, tokens.getHiddenTokensToRight(0));

        assertEquals("[[@0,0:0=' ',<1>,channel=1,0:-1]]",
            tokens.getHiddenTokensToLeft(1).toString());
        assertEquals("[[@2,0:0=' ',<1>,channel=1,0:-1]]",
            tokens.getHiddenTokensToRight(1).toString());

        assertEquals(null, tokens.getHiddenTokensToLeft(2));
        assertEquals(null, tokens.getHiddenTokensToRight(2));

        assertEquals("[[@2,0:0=' ',<1>,channel=1,0:-1]]",
            tokens.getHiddenTokensToLeft(3).toString());
        assertEquals(null, tokens.getHiddenTokensToRight(3));

        assertEquals(null, tokens.getHiddenTokensToLeft(4));
        assertEquals("[[@5,0:0=' ',<1>,channel=1,0:-1], [@6,0:0=' ',<1>,channel=1,0:-1]]",
            tokens.getHiddenTokensToRight(4).toString());

        assertEquals(null, tokens.getHiddenTokensToLeft(5));
        assertEquals("[[@6,0:0=' ',<1>,channel=1,0:-1]]",
            tokens.getHiddenTokensToRight(5).toString());

        assertEquals("[[@5,0:0=' ',<1>,channel=1,0:-1]]",
            tokens.getHiddenTokensToLeft(6).toString());
        assertEquals(null, tokens.getHiddenTokensToRight(6));

        assertEquals("[[@5,0:0=' ',<1>,channel=1,0:-1], [@6,0:0=' ',<1>,channel=1,0:-1]]",
            tokens.getHiddenTokensToLeft(7).toString());
        assertEquals("[[@8,0:0=' ',<1>,channel=1,0:-1], [@9,0:0='\\n',<1>,channel=1,0:-1]]",
            tokens.getHiddenTokensToRight(7).toString());

        assertEquals(null, tokens.getHiddenTokensToLeft(8));
        assertEquals("[[@9,0:0='\\n',<1>,channel=1,0:-1]]",
            tokens.getHiddenTokensToRight(8).toString());

        assertEquals("[[@8,0:0=' ',<1>,channel=1,0:-1]]",
            tokens.getHiddenTokensToLeft(9).toString());
        assertEquals(null, tokens.getHiddenTokensToRight(9));
    }

    @Test
    public testSingleEOF(): void {
        let lexer = new class implements TokenSource {


            public nextToken(): Token {
                return new CommonToken(Token.EOF);
            }


            public getLine(): number {
                return 0;
            }


            public getCharPositionInLine(): number {
                return 0;
            }


            public getInputStream(): CharStream {
                return null;
            }


            public getSourceName(): string {
                return java.util.stream.IntStream.UNKNOWN_SOURCE_NAME;
            }


            public getTokenFactory(): TokenFactory<unknown> {
                throw new UnsupportedOperationException("Not supported yet.");
            }


            public setTokenFactory(factory: TokenFactory<unknown>): void {
                throw new UnsupportedOperationException("Not supported yet.");
            }
        }();

        let tokens = new CommonTokenStream(lexer);
        tokens.fill();

        assertEquals(Token.EOF, tokens.LA(1));
        assertEquals(0, tokens.index());
        assertEquals(1, tokens.size());
    }

    @Test
    public testCannotConsumeEOF(): void {
        let lexer = new class implements TokenSource {


            public nextToken(): Token {
                return new CommonToken(Token.EOF);
            }


            public getLine(): number {
                return 0;
            }


            public getCharPositionInLine(): number {
                return 0;
            }


            public getInputStream(): CharStream {
                return null;
            }


            public getSourceName(): string {
                return java.util.stream.IntStream.UNKNOWN_SOURCE_NAME;
            }


            public getTokenFactory(): TokenFactory<unknown> {
                throw new UnsupportedOperationException("Not supported yet.");
            }


            public setTokenFactory(factory: TokenFactory<unknown>): void {
                throw new UnsupportedOperationException("Not supported yet.");
            }
        }();

        let tokens = new CommonTokenStream(lexer);
        tokens.fill();

        assertEquals(Token.EOF, tokens.LA(1));
        assertEquals(0, tokens.index());
        assertEquals(1, tokens.size());
        assertThrows(IllegalStateException.class, tokens.consume);
    }

    protected createTokenStream(src: TokenSource): TokenStream {
        return new CommonTokenStream(src);
    }
}
