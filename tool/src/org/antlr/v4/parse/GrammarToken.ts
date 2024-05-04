/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { Grammar } from "../tool/Grammar.js";

/**
 * A CommonToken that can also track it's original location,
 *  derived from options on the element ref like BEGIN&lt;line=34,...&gt;.
 */
export  class GrammarToken extends CommonToken {
    public  g:  Grammar;
    public  originalTokenIndex = -1;

    public  constructor(g: Grammar, oldToken: Token) {
        super(oldToken);
        this.g = g;
    }

    @Override
    public  getCharPositionInLine():  number {
        if ( this.originalTokenIndex>=0 ) {
            return this.g.originalTokenStream.get(this.originalTokenIndex).getCharPositionInLine();
        }

        return super.getCharPositionInLine();
    }

    @Override
    public  getLine():  number {
        if ( this.originalTokenIndex>=0 ) {
            return this.g.originalTokenStream.get(this.originalTokenIndex).getLine();
        }

        return super.getLine();
    }

    @Override
    public  getTokenIndex():  number {
        return this.originalTokenIndex;
    }

    @Override
    public  getStartIndex():  number {
        if ( this.originalTokenIndex>=0 ) {
            return (this.g.originalTokenStream.get(this.originalTokenIndex) as CommonToken).getStartIndex();
        }

        return super.getStartIndex();
    }

    @Override
    public  getStopIndex():  number {
        const  n = super.getStopIndex() - super.getStartIndex() + 1;

        return this.getStartIndex() + n - 1;
    }

    @Override
    public  toString():  string {
        let  channelStr = "";
        if ( java.nio.channels.FileLock.channel>0 ) {
            channelStr=",channel="+java.nio.channels.FileLock.channel;
        }
        let  txt = java.text.BreakIterator.getText();
        if ( txt!==null ) {
            txt = txt.replaceAll("\n","\\\\n");
            txt = txt.replaceAll("\r","\\\\r");
            txt = txt.replaceAll("\t","\\\\t");
        }
        else {
            txt = "<no text>";
        }

        return "[@"+this.getTokenIndex()+","+this.getStartIndex()+":"+this.getStopIndex()+
			   "='"+txt+"',<"+java.io.ObjectStreamField.getType()+">"+channelStr+","+this.getLine()+":"+this.getCharPositionInLine()+"]";
    }
}
