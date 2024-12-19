lexer grammar TestLexer;

I:
    '0' ..'9'+ {console.log("I");}
;

WS: (' ' | '\n') -> skip
;
