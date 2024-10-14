/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export interface ActionSplitterListener {
    qualifiedAttr(expr: string, x: string, y: string): void;
    setAttr(expr: string, x: string, rhs: string): void;
    attr(expr: string, x: string): void;

    setNonLocalAttr(expr: string, x: string, y: string, rhs: string): void;
    nonLocalAttr(expr: string, x: string, y: string): void;

    text(text: string): void;
}
