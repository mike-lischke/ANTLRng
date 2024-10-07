/* java2ts: keep */

/*
* Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
* Use of this file is governed by the BSD 3-clause license that
* can be found in the LICENSE.txt file in the project root.
*/
 
export enum LabelType {
    RULE_LABEL = 0,
    TOKEN_LABEL = 1,
    RULE_LIST_LABEL = 2,
    TOKEN_LIST_LABEL = 3,
    LEXER_STRING_LABEL = 4         // used in lexer for x='a'
}
