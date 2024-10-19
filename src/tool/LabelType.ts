/*
* Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
* Use of this file is governed by the BSD 3-clause license that
* can be found in the LICENSE.txt file in the project root.
*/

export enum LabelType {
    RuleLabel = 0,
    TokenLabel = 1,
    RuleListLabel = 2,
    TokenListLabel = 3,
    LexerStringLabel = 4 // used in lexer for x='a'
}
