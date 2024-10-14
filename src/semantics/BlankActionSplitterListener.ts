/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ActionSplitterListener } from "../parse/ActionSplitterListener.js";

export class BlankActionSplitterListener implements ActionSplitterListener {

    public qualifiedAttr(expr: string, x: string, y: string): void {
        // Do nothing
    }

    public setAttr(expr: string, x: string, rhs: string): void {
        // Do nothing
    }

    public attr(expr: string, x: string): void {
        // Do nothing
    }

    public templateInstance(expr: string): void {
        // Do nothing
    }

    public nonLocalAttr(expr: string, x: string, y: string): void {
        // Do nothing
    }

    public setNonLocalAttr(expr: string, x: string, y: string, rhs: string): void {
        // Do nothing
    }

    public indirectTemplateInstance(expr: string): void {
        // Do nothing
    }

    public setExprAttribute(expr: string): void {
        // Do nothing
    }

    public setSTAttribute(expr: string): void {
        // Do nothing
    }

    public templateExpr(expr: string): void {
        // Do nothing
    }

    public text(text: string): void {
        // Do nothing
    }
}
