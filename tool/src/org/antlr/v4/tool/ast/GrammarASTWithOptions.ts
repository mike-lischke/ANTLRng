/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { GrammarAST } from "./GrammarAST.js";
import { ActionAST } from "./ActionAST.js";
import { CharSupport } from "../../misc/CharSupport.js";
import { ErrorType } from "../ErrorType.js";

export abstract class GrammarASTWithOptions extends GrammarAST {
    protected options = new Map<string, GrammarAST | null>();

    public setOption(key: string, node: GrammarAST | null): void {
        this.options.set(key, node);
    }

    public getOptionString(key: string): string | null {
        const value = this.getOptionAST(key);
        if (value === null) {
            return null;
        }

        if (value instanceof ActionAST) {
            return value.getText();
        } else {
            let v = value.getText();
            if (v && (v.startsWith("'") || v.startsWith("\""))) {
                v = CharSupport.getStringFromGrammarStringLiteral(v);
                if (v === null) {
                    this.g.tool.errMgr.grammarError(ErrorType.INVALID_ESCAPE_SEQUENCE, this.g.fileName,
                        value.getToken(), value.getText()!);
                    v = "";
                }
            }

            return v;
        }
    }

    /**
     * Gets AST node holding value for option key; ignores default options
     *  and command-line forced options.
     */
    public getOptionAST(key: string): GrammarAST | null {
        if (this.options === null) {
            return null;
        }

        return this.options.get(key) ?? null;
    }

    public getNumberOfOptions(): number {
        return this.options.size;
    }

    public getOptions(): Map<string, GrammarAST | null> {
        return this.options;
    }

    public abstract override dupNode(): GrammarASTWithOptions;
}
