lexer grammar TestLexer;

CMT:
    '/*' (CMT | .)*? '*/'
;

WS: (' ' | '\n')+
;
