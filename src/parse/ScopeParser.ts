/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

import { CommonToken } from "antlr4ng";

import { BaseRecognizer } from "../antlr3/BaseRecognizer.js";
import { ANTLRv4Parser } from "../generated/ANTLRv4Parser.js";

import { Character } from "../support/Character.js";
import { Attribute } from "../tool/Attribute.js";
import { AttributeDict } from "../tool/AttributeDict.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { ActionAST } from "../tool/ast/ActionAST.js";

/**
 * Parse args, return values, locals
 * <p>
 * rule[arg1, arg2, ..., argN] returns [ret1, ..., retN]
 * <p>
 * text is target language dependent.  Java/C#/C/C++ would
 * use "int i" but ruby/python would use "i". Languages with
 * postfix types like Go, Swift use "x : T" notation or "T x".
 */
export class ScopeParser {
    /**
     * Given an arg or retval scope definition list like
     * <p>
     * <code>
     * Map&lt;String, String&gt;, int[] j3, char *foo32[3]
     * </code>
     * <p>
     * or
     * <p>
     * <code>
     * int i=3, j=a[34]+20
     * </code>
     * <p>
     * convert to an attribute scope.
     */
    public static parseTypedArgList(action: ActionAST, s: string, g: Grammar): AttributeDict {
        return this.parse(action, s, ",", g);
    }

    public static parse(action: ActionAST, s: string, separator: string, g: Grammar): AttributeDict {
        const dict = new AttributeDict();
        const decls = this.splitDecls(s, separator);
        for (const decl of decls) {
            if (decl[0].trim().length > 0) {
                const a = this.parseAttributeDef(action, decl, g);
                dict.add(a!);
            }
        }

        return dict;
    }

    /**
     * For decls like "String foo" or "char *foo32[]" compute the ID
     * and type declarations.  Also handle "int x=3" and 'T t = new T("foo")'
     * but if the separator is ',' you cannot use ',' in the init value
     * unless you escape use "\," escape.
     */
    public static parseAttributeDef(action: ActionAST, decl: [string | null, number], g: Grammar): Attribute | null {
        if (decl[0] === null) {
            return null;
        }

        const attr = new Attribute();
        let rightEdgeOfDeclarator = decl[0].length - 1;
        const equalsIndex = decl[0].indexOf("=");
        if (equalsIndex > 0) {
            // everything after the '=' is the init value
            attr.initValue = decl[0].substring(equalsIndex + 1, decl[0].length).trim();
            rightEdgeOfDeclarator = equalsIndex - 1;
        }

        const declarator = decl[0].substring(0, rightEdgeOfDeclarator + 1);
        let p: [number, number];
        let text = decl[0];
        text = text.replaceAll("::", "");
        if (text.includes(":")) {
            // declarator has type appearing after the name like "x:T"
            p = ScopeParser._parsePostfixDecl(attr, declarator, action, g);
        } else {
            // declarator has type appearing before the name like "T x"
            p = ScopeParser._parsePrefixDecl(attr, declarator, action, g);
        }

        const [idStart, idStop] = p;
        attr.decl = decl[0];

        const actionText = action.getText()!;
        const lines = new Int32Array(actionText.length);
        const charPositionInLines = new Int32Array(actionText.length);
        for (let i = 0, line = 0, col = 0; i < actionText.length; i++, col++) {
            lines[i] = line;
            charPositionInLines[i] = col;
            if (actionText[i] === "\n") {
                line++;
                col = -1;
            }
        }

        const charIndexes = new Int32Array(actionText.length);
        for (let i = 0, j = 0; i < actionText.length; i++, j++) {
            charIndexes[j] = i;
            // skip comments
            if (i < actionText.length - 1 && actionText[i] === "/" && actionText[i + 1] === "/") {
                while (i < actionText.length && actionText[i] !== "\n") {
                    i++;
                }
            }
        }

        const declOffset = charIndexes[decl[1]];
        const declLine = lines[declOffset + idStart];

        const line = action.getToken()!.line + declLine;
        let charPositionInLine = charPositionInLines[declOffset + idStart];
        if (declLine === 0) {
            /* offset for the start position of the ARG_ACTION token, plus 1
             * since the ARG_ACTION text had the leading '[' stripped before
             * reaching the scope parser.
             */
            charPositionInLine += action.getToken()!.column + 1;
        }

        const offset = (action.getToken() as CommonToken).start;
        attr.token = CommonToken.fromSource([null, action.getToken()!.inputStream], ANTLRv4Parser.ID,
            BaseRecognizer.DEFAULT_TOKEN_CHANNEL, offset + declOffset + idStart + 1, offset + declOffset + idStop);
        attr.token.line = line;
        attr.token.column = charPositionInLine;

        return attr;
    }

    public static _parsePrefixDecl(attr: Attribute, decl: string, a: ActionAST, g: Grammar): [number, number] {
        // walk backwards looking for start of an ID
        let inID = false;
        let start = -1;
        for (let i = decl.length - 1; i >= 0; i--) {
            const ch = decl.codePointAt(i)!;

            // if we haven't found the end yet, keep going
            if (!inID && Character.isLetterOrDigit(ch)) {
                inID = true;
            } else {
                if (inID && !(Character.isLetterOrDigit(ch) || ch === 0x5F)) { // '_'
                    start = i + 1;
                    break;
                }
            }

        }

        if (start < 0 && inID) {
            start = 0;
        }

        if (start < 0) {
            g.tool.errMgr.grammarError(ErrorType.CANNOT_FIND_ATTRIBUTE_NAME_IN_DECL, g.fileName, a.token, decl);
        }

        // walk forward looking for end of an ID
        let stop = -1;
        for (let i = start; i < decl.length; i++) {
            const ch = decl.codePointAt(i)!;
            // if we haven't found the end yet, keep going
            if (!(Character.isLetterOrDigit(ch) || ch === 0x5F)) { // '_'
                stop = i;
                break;
            }

            if (i === decl.length - 1) {
                stop = i + 1;
            }
        }

        // the name is the last ID
        attr.name = decl.substring(start, stop);

        // the type is the decl minus the ID (could be empty)
        attr.type = decl.substring(0, start);
        if (stop <= decl.length - 1) {
            attr.type += decl.substring(stop, decl.length);
        }

        attr.type = attr.type.trim();
        if (attr.type.length === 0) {
            attr.type = null;
        }

        return [start, stop];
    }

    public static _parsePostfixDecl(attr: Attribute, decl: string, a: ActionAST, g: Grammar): [number, number] {
        let start = -1;
        let stop = -1;
        const colon = decl.indexOf(":");
        const namePartEnd = colon === -1 ? decl.length : colon;

        // look for start of name
        for (let i = 0; i < namePartEnd; ++i) {
            const ch = decl.codePointAt(i)!;
            if (Character.isLetterOrDigit(ch) || ch === 0x5F) { // '_'
                start = i;
                break;
            }
        }

        if (start === -1) {
            start = 0;
            g.tool.errMgr.grammarError(ErrorType.CANNOT_FIND_ATTRIBUTE_NAME_IN_DECL, g.fileName, a.token, decl);
        }

        // look for stop of name
        for (let i = start; i < namePartEnd; ++i) {
            const ch = decl.codePointAt(i)!;
            if (!(Character.isLetterOrDigit(ch) || ch === 0x5F)) { // '_'
                stop = i;
                break;
            }

            if (i === namePartEnd - 1) {
                stop = namePartEnd;
            }
        }

        if (stop === -1) {
            stop = start;
        }

        // extract name from decl
        attr.name = decl.substring(start, stop);

        // extract type from decl (could be empty)
        if (colon === -1) {
            attr.type = "";
        } else {
            attr.type = decl.substring(colon + 1, decl.length);
        }
        attr.type = attr.type.trim();

        if (attr.type.length === 0) {
            attr.type = null;
        }

        return [start, stop];
    }

    /**
     * Given an argument list like
     * <p>
     * x, (*a).foo(21,33), 3.2+1, '\n',
     * "a,oo\nick", {bl, "abc"eck}, ["cat\n,", x, 43]
     * <p>
     * convert to a list of attributes.  Allow nested square brackets etc...
     * Set separatorChar to ';' or ',' or whatever you want.
     */
    public static splitDecls(s: string, separatorChar: string): Array<[string, number]> {
        const args = new Array<[string, number]>();
        ScopeParser._splitArgumentList(s, 0, "", separatorChar, args);

        return args;
    }

    public static _splitArgumentList(actionText: string | null, start: number, targetChar: string,
        separatorChar: string, args: Array<[string, number]>): number {
        if (actionText === null) {
            return -1;
        }

        actionText = actionText.replaceAll("//[^\\n]*", "");
        const n = actionText.length;

        let p = start;
        let last = p;
        while (p < n && actionText[p] !== targetChar) {
            const c = actionText.charAt(p);
            switch (c) {
                case "'": {
                    p++;
                    while (p < n && actionText.charAt(p) !== "'") {
                        if (actionText.charAt(p) === "\\" && (p + 1) < n &&
                            actionText.charAt(p + 1) === "'") {
                            p++; // skip escaped quote
                        }
                        p++;
                    }
                    p++;
                    break;
                }

                case '"': {
                    p++;
                    while (p < n && actionText.charAt(p) !== '"') {
                        if (actionText.charAt(p) === "\\" && (p + 1) < n &&
                            actionText.charAt(p + 1) === '"') {
                            p++; // skip escaped quote
                        }
                        p++;
                    }
                    p++;
                    break;
                }

                case "(": {
                    p = ScopeParser._splitArgumentList(actionText, p + 1, ")", separatorChar, args);
                    break;
                }

                case "{": {
                    p = ScopeParser._splitArgumentList(actionText, p + 1, "}", separatorChar, args);
                    break;
                }

                case "<": {
                    if (actionText.indexOf(">", p + 1) >= p) {
                        // do we see a matching '>' ahead?  if so, hope it's a generic
                        // and not less followed by expr with greater than
                        p = ScopeParser._splitArgumentList(actionText, p + 1, ">", separatorChar, args);
                    } else {
                        p++; // treat as normal char
                    }
                    break;
                }

                case "[": {
                    p = ScopeParser._splitArgumentList(actionText, p + 1, "]", separatorChar, args);
                    break;
                }

                default: {
                    if (c === separatorChar && targetChar === "") {
                        const arg = actionText.substring(last, p);
                        let index = last;
                        while (index < p && Character.isWhitespace(actionText.codePointAt(index)!)) {
                            index++;
                        }

                        args.push([arg.trim(), index]);
                        last = p + 1;
                    }
                    p++;
                    break;
                }

            }
        }
        if (targetChar === "" && p <= n) {
            const arg = actionText.substring(last, p).trim();
            let index = last;
            while (index < p && Character.isWhitespace(actionText.codePointAt(index)!)) {
                index++;
            }

            if (arg.length > 0) {
                args.push([arg.trim(), index]);
            }
        }
        p++;

        return p;
    }

}
