parser grammar TestParser;

options{
    tokenVocab = TestLexer;
}

a:
    A
    | A B
;
