/*
* Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
* Use of this file is governed by the BSD 3-clause license that
* can be found in the LICENSE.txt file in the project root.
*/

// The string values of this type appear in look up maps.
// TODO: Change to enum.
export enum LabelType {
    RuleLabel = "RULE_LABEL",
    TokenLabel = "TOKEN_LABEL",
    RuleListLabel = "RULE_LIST_LABEL",
    TokenListLabel = "TOKEN_LIST_LABEL",
    LexerStringLabel = "LEXER_STRING_LABEL" // used in lexer for x='a'
}
