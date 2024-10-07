/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ActionSplitterListener } from "../parse/ActionSplitterListener.js";

export class BlankActionSplitterListener implements ActionSplitterListener {
    @Override
    public qualifiedAttr(expr: string, x: Token, y: Token): void {
    }

    @Override
    public setAttr(expr: string, x: Token, rhs: Token): void {
    }

    @Override
    public attr(expr: string, x: Token): void {
    }

    public templateInstance(expr: string): void {
    }

    @Override
    public nonLocalAttr(expr: string, x: Token, y: Token): void {
    }

    @Override
    public setNonLocalAttr(expr: string, x: Token, y: Token, rhs: Token): void {
    }

    public indirectTemplateInstance(expr: string): void {
    }

    public setExprAttribute(expr: string): void {
    }

    public setSTAttribute(expr: string): void {
    }

    public templateExpr(expr: string): void {
    }

    @Override
    public text(text: string): void {
    }
}
