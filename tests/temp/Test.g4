grammar Test;

@members {#members#int \\$n; "\\$in string\\$"#end-members#}

a[int x, int x1]
    returns[int y]
    @init {#init##end-init#}:
    id = ID ids += ID lab = b[34] c d {
		 #inline##end-inline#
		 } c
;
finally {
#finally##end-finally#
}

b[int d]
    returns[int e]:
    {#inline2##end-inline2#}
;

c
    returns[int x, int y]:
;

d:
;

ID:
    [a-z]+
;