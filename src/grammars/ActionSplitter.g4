/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

grammar ActionSplitter;

// $antlr-format alignTrailingComments on, columnLimit 150, maxEmptyLinesToKeep 1, reflowComments off, useTab off
// $antlr-format allowShortRulesOnASingleLine off, minEmptyLines 0, alignSemicolons ownLine

@lexer::header {
import type { ActionSplitterListener } from "../../tool/src/org/antlr/v4/parse/ActionSplitterListener.js";
}

@parser::header {
import type { ActionSplitterListener } from "../../tool/src/org/antlr/v4/parse/ActionSplitterListener.js";
import { Character } from "../../tool/src/org/antlr/v4/support/Character.js";
}

@parser::members {
public delegate: ActionSplitterListener;

private isIDStartChar(c: number): boolean {
	return c == 0x5F /* "_" */ || Character.isLetter(c);
}
}

@lexer::members {
public delegate: ActionSplitterListener;

/** Force filtering (and return tokens). Triggers all above actions. */
public getActionTokens(): Token[] {
    const chunks = new Array<Token>();
    let t = this.nextToken();
    while (t.type !== Token.EOF) {
        chunks.push(t);
        t = this.nextToken();
    }

    return chunks;
}
}

parse: (
        setAttr
        | attr
        | qualifiedAttribute
        | nonLocalAttribute
        | setNoneLocalAttribute
        | nonLocalAttribute
        | randomText
    )* EOF
;

setNoneLocalAttribute:
    DOLLAR x = ID COLONCOLON y = ID WS? EQUAL expr = ATTR_VALUE_EXPR SEMICOLON { this.delegate.setNonLocalAttr($text, $x, $y, $expr); }
;

nonLocalAttribute:
    DOLLAR x = ID COLONCOLON y = ID {this.delegate.nonLocalAttr($text, $x, $y);}
;

qualifiedAttribute:
    DOLLAR x = ID DOT y = ID {this.inputStream.LA(1) !== 0x28 /* '(' */}? {this.delegate.qualifiedAttr($text, $x, $y);}
;

setAttr:
    DOLLAR x = ID WS? EQUAL expr = ATTR_VALUE_EXPR SEMICOLON { this.delegate.setAttr($text, $x, $expr); }
;

attr:
    DOLLAR x = ID {this.delegate.attr($text, $x);}
;

// Anything else is just random text
randomText
    @init {let buf = "";}
    @after {this.delegate.text(buf);}: (
        c = ~(BACKSLASH | DOLLAR) {buf += $c;}
        | ESCAPED_DOLLAR {buf += "$";}
        | BACKSLASH c = ~(DOLLAR) {buf += "\\" + $c;}
        | {!this.isIDStartChar(this.inputStream.LA(2))}? DOLLAR {buf += "$";}
    )+
;

// $antlr-format allowShortRulesOnASingleLine on, alignSemicolons none, minEmptyLines 0

DOLLAR:         '$';
ESCAPED_DOLLAR: '\\$';
EQUAL:          '=';
DOT:            '.';
COLONCOLON:     '::';
SEMICOLON:      ';';
SLASHSLASH:     '//';
BACKSLASH:      '\\';

// ignore comments right away
COMMENT: '/*' .*? '*/' {this.delegate.text(this.text);};

LINE_COMMENT: SLASHSLASH .*? '\r'? '\n' {this.delegate.text(this.text);};

ID: [a-zA-Z_] [a-zA-Z_0-9]*;

/** Don't allow an = as first char to prevent $x == 3; kind of stuff. */
ATTR_VALUE_EXPR: ~'=' (~';')*;

WS: [ \t\n\r]+;
