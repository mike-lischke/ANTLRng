grammar Test;

s:
    e EOF
;

e: ({} ID <tokenIndex = 74>) (
        {precpred(_ctx, 5)}? <p = 5> '*' <tokenIndex = 25> e <tokenIndex = 27>
        | {precpred(_ctx, 4)}? <p = 4> '+' <tokenIndex = 38> e <tokenIndex = 40>
        | {precpred(_ctx, 3)}? <p = 3> '?' <tokenIndex = 51> e <tokenIndex = 53> ':' <tokenIndex = 55> e <tokenIndex = 57>
        | {precpred(_ctx, 2)}? <p = 2> '=' <tokenIndex = 68> e <tokenIndex = 70>
    )*
;

ID:
    [a-zA-Z]+
;
