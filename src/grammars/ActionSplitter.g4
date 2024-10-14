/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

lexer grammar ActionSplitter;

// $antlr-format alignTrailingComments on, columnLimit 150, maxEmptyLinesToKeep 1, reflowComments off, useTab off
// $antlr-format allowShortRulesOnASingleLine on, alignSemicolons none, minEmptyLines 0

@header {
import { Character } from "../support/Character.js";
import type { ActionSplitterListener } from "../parse/ActionSplitterListener.js";
}

@members {

/** Force filtering (and return tokens).Sends token values to the delegate. */
public getActionTokens(delegate: ActionSplitterListener): Token[] {
    const chunks = new Array<Token>();
    let t = this.nextToken();
    while (t.type !== Token.EOF) {
        switch (t.type) {
            case ActionSplitter.COMMENT:
            case ActionSplitter.LINE_COMMENT:
            case ActionSplitter.TEXT: {
                delegate.text(t.text!);

                break;
            }

            case ActionSplitter.SET_NONLOCAL_ATTR: {
                const regex = /\$(?<x>[a-zA-Z_][a-zA-Z0-9_]*)::\s*(?<y>[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?<expr>[^=][^;]*);/;
                const text = t.text!;

                // Parse the text and extract the named groups from the match result.
                const match = text.match(regex);
                if (match === null) {
                    throw new Error(`Mismatched input '${text}'`);
                }

                const { x, y, expr } = match.groups!;
                delegate.setNonLocalAttr(text, x, y, expr);

                break;
            }

            case ActionSplitter.NONLOCAL_ATTR: {
                const regex = /\$(?<x>[a-zA-Z_][a-zA-Z0-9_]*)::\s*(?<y>[a-zA-Z_][a-zA-Z0-9_]*)/;
                const text = t.text!;

                const match = text.match(regex);
                if (match === null) {
                    throw new Error(`Mismatched input '${text}'`);
                }

                const { x, y } = match.groups!;
                delegate.nonLocalAttr(text, x, y);

                break;
            }

            case ActionSplitter.QUALIFIED_ATTR: {
                const regex = /\$(?<x>[a-zA-Z_][a-zA-Z0-9_]*)::\s*(?<y>[a-zA-Z_][a-zA-Z0-9_]*)/;
                const text = t.text!;

                const match = text.match(regex);
                if (match === null) {
                    throw new Error(`Mismatched input '${text}'`);
                }

                const { x, y } = match.groups!;
                delegate.qualifiedAttr(text, x, y);

                break;
            }

            case ActionSplitter.SET_ATTR: {
                const regex = /\$(?<x>[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?<expr>[^=][^;]*);/;
                const text = t.text!;

                const match = text.match(regex);
                if (match === null) {
                    throw new Error(`Mismatched input '${text}'`);
                }

                const { x, expr } = match.groups!;
                delegate.setAttr(text, x, expr);

                break;
            }

            case ActionSplitter.ATTR: {
                const regex = /\$(?<x>[a-zA-Z_][a-zA-Z0-9_]*)/;
                const text = t.text!;

                const match = text.match(regex);
                if (match === null) {
                    throw new Error(`Mismatched input '${text}'`);
                }

                const { x } = match.groups!;
                delegate.attr(text, x);

                break;
            }

            default:
        }

        chunks.push(t);
        t = this.nextToken();
    }

    return chunks;
}

private isIDStartChar(c: number): boolean {
	return c == 0x5F /* "_" */ || Character.isLetter(c);
}

}

// ignore comments right away

COMMENT:      '/*' .*? '*/';
LINE_COMMENT: '//' ~('\n' | '\r')* '\r'? '\n';

SET_NONLOCAL_ATTR: '$' ID '::' ID WS? '=' ATTR_VALUE_EXPR ';';

NONLOCAL_ATTR: '$' ID '::' ID;

QUALIFIED_ATTR: '$' ID '.' ID;

SET_ATTR: '$' ID WS? '=' ATTR_VALUE_EXPR ';';

ATTR: '$' ID;

// Anything else is just random text
TEXT: ( ~('\\' | '$') | '\\$' | '\\' ~('$') | {!this.isIDStartChar(this.inputStream.LA(2))}? '$')+;

fragment ID: ('a' ..'z' | 'A' ..'Z' | '_') ('a' ..'z' | 'A' ..'Z' | '0' ..'9' | '_')*;

/** Don't allow an = as first char to prevent $x == 3; kind of stuff. */
fragment ATTR_VALUE_EXPR: ~'=' (~';')*;

fragment WS: (' ' | '\t' | '\n' | '\r')+;
