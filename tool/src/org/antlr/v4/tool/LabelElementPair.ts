/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { LabelType } from "./LabelType.js";
import { Grammar } from "./Grammar.js";
import { GrammarAST } from "./ast/GrammarAST.js";



export  class LabelElementPair {
    public static readonly  tokenTypeForTokens = new  java.util.BitSet();

    public  label:  GrammarAST;
    public  element:  GrammarAST;
    public  type:  LabelType;

    public  constructor(g: Grammar, label: GrammarAST, element: GrammarAST, labelOp: number) {
        this.label = label;
        this.element = element;
        // compute general case for label type
        if ( element.getFirstDescendantWithType(LabelElementPair.tokenTypeForTokens)!==null ) {
            if ( labelOp===ANTLRParser.ASSIGN ) {
 this.type = LabelType.TOKEN_LABEL;
}

            else {
 this.type = LabelType.TOKEN_LIST_LABEL;
}

        }
        else {
 if ( element.getFirstDescendantWithType(ANTLRParser.RULE_REF)!==null ) {
            if ( labelOp===ANTLRParser.ASSIGN ) {
 this.type = LabelType.RULE_LABEL;
}

            else {
 this.type = LabelType.RULE_LIST_LABEL;
}

        }
}


        // now reset if lexer and string
        if ( g.isLexer() ) {
            if ( element.getFirstDescendantWithType(ANTLRParser.STRING_LITERAL)!==null ) {
                if ( labelOp===ANTLRParser.ASSIGN ) {
 this.type = LabelType.LEXER_STRING_LABEL;
}

            }
        }
    }

    @Override
public override  toString():  string {
        return this.label.getText()+" "+this.type+" "+this.element.toString();
    }
     static {
        LabelElementPair.tokenTypeForTokens.add(ANTLRParser.TOKEN_REF);
        LabelElementPair.tokenTypeForTokens.add(ANTLRParser.STRING_LITERAL);
        LabelElementPair.tokenTypeForTokens.add(ANTLRParser.WILDCARD);
    }
}
