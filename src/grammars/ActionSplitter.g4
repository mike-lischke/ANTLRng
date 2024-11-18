/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

lexer grammar ActionSplitter;

// $antlr-format alignTrailingComments on, columnLimit 150, maxEmptyLinesToKeep 1, reflowComments off, useTab off
// $antlr-format allowShortRulesOnASingleLine on, alignSemicolons none, minEmptyLines 0

@header {
/* eslint-disable */

import { Character } from "../support/Character.js";
import type { ActionSplitterListener } from "../parse/ActionSplitterListener.js";
}

@members {
static readonly #attrValueExpr = /[^=][^;]*/;
static readonly #ws = /[ \t\n\r]+/;
static readonly #id = /[a-zA-Z_][a-zA-Z0-9_]*/;
static readonly #setNonLocalAttr = new RegExp(`\\$(?<x>${this.#id.source})::(<y>${this.#id.source})\s?=(?<expr>${this.#attrValueExpr.source});`);
static readonly #nonLocalAttr = new RegExp(`\\$(?<x>${this.#id.source})::(?<y>${this.#id.source})`);
static readonly #qualifiedAttr = new RegExp(`\\$(?<x>${this.#id.source}).(?<y>${this.#id.source})`);
static readonly #setAttr = new RegExp(`\\$(?<x>${this.#id.source})\s?=(?<expr>${this.#attrValueExpr.source});`);
static readonly #attr = new RegExp(`\\$(?<x>${this.#id.source})`);

/** Force filtering (and return tokens). Sends token values to the delegate. */
public getActionTokens(delegate: ActionSplitterListener): Token[] {
    const tokens = this.getAllTokens();
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        switch (t.type) {
            case ActionSplitter.COMMENT:
            case ActionSplitter.LINE_COMMENT:
            case ActionSplitter.TEXT: {
                // Replace $ with $.
                const text = t.text!.replaceAll("\\$", "$");
                delegate.text(text);

                break;
            }

            case ActionSplitter.SET_NONLOCAL_ATTR: {
                const text = t.text!;

                // Parse the text and extract the named groups from the match result.
                const match = text.match(ActionSplitter.#setNonLocalAttr);
                if (match === null) {
                    throw new Error(`Mismatched input '${text}'`);
                }

                const { x, y, expr } = match.groups!;
                delegate.setNonLocalAttr(text, x, y, expr);

                break;
            }

            case ActionSplitter.NONLOCAL_ATTR: {
                const text = t.text!;

                const match = text.match(ActionSplitter.#nonLocalAttr);
                if (match === null) {
                    throw new Error(`Mismatched input '${text}'`);
                }

                const { x, y } = match.groups!;
                delegate.nonLocalAttr(text, x, y);

                break;
            }

            case ActionSplitter.QUALIFIED_ATTR: {
                let text = t.text!;

                const match = text.match(ActionSplitter.#qualifiedAttr);
                if (match === null) {
                    throw new Error(`Mismatched input '${text}'`);
                }

                const { x, y } = match.groups!;

                // In the ANTLR3 version of the grammar, QUALIFIED_ATTR was not matched if followed by a '('.
                // We have to simulate this behavior here.
                if (i + 1 < tokens.length && tokens[i + 1].text?.startsWith("(")) {
                    // Pretend we matched ATTR instead of QUALIFIED_ATTR, with the first part of the qualified name.
                    delegate.attr("$" + x, x);

                    // Pretend we matched TEXT instead of QUALIFIED_ATTR, with the rest of the qualified name.
                    text = "." + y + tokens[++i].text!;
                    delegate.text(text);

                    break;
                }

                delegate.qualifiedAttr(text, x, y);

                break;
            }

            case ActionSplitter.SET_ATTR: {
                const text = t.text!;

                const match = text.match(ActionSplitter.#setAttr);
                if (match === null) {
                    throw new Error(`Mismatched input '${text}'`);
                }

                const { x, expr } = match.groups!;
                delegate.setAttr(text, x, expr);

                break;
            }

            case ActionSplitter.ATTR: {
                const text = t.text!;

                const match = text.match(ActionSplitter.#attr);
                if (match === null) {
                    throw new Error(`Mismatched input '${text}'`);
                }

                const { x } = match.groups!;
                delegate.attr(text, x);

                break;
            }

            default:
        }
    }

    // TODO: need to remove the EOF token from the list of tokens?
    return tokens;
}

private isIDStartChar(c: number): boolean {
    return c == 0x5F /* "_" */ || Character.isLetter(c);
}}

// ignore comments right away

COMMENT:      '/*' .*? '*/';
LINE_COMMENT: '//' ~('\n' | '\r')* '\r'? '\n';

SET_NONLOCAL_ATTR: '$' ID '::' ID WS? '=' ATTR_VALUE_EXPR ';';

NONLOCAL_ATTR: '$' ID '::' ID;

QUALIFIED_ATTR: '$' ID '.' ID;

SET_ATTR: '$' ID WS? '=' ATTR_VALUE_EXPR ';';

ATTR: '$' ID;

// Anything else is just random text

TEXT: (~'$' | '\\$' | '$' ~[a-zA-Z_])+;

fragment ID: ('a' ..'z' | 'A' ..'Z' | '_') ('a' ..'z' | 'A' ..'Z' | '0' ..'9' | '_')*;

/** Don't allow an = as first char to prevent $x == 3; kind of stuff. */

fragment ATTR_VALUE_EXPR: ~'=' (~';')*;

fragment WS: (' ' | '\t' | '\n' | '\r')+;
