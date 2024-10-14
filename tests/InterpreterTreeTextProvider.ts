/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ErrorNode, Trees, type ParseTree } from "antlr4ng";

export class InterpreterTreeTextProvider implements TreeTextProvider {
    public ruleNames: string[];
    public constructor(ruleNames: string[]) {
        this.ruleNames = ruleNames;
    }

    public getText(node: ParseTree | null): string {
        if (node === null) {
            return "null";
        }

        const nodeText = Trees.getNodeText(node, this.ruleNames) ?? "<unknown>";
        if (node instanceof ErrorNode) {
            return "<error " + nodeText + ">";
        }

        return nodeText;
    }
}
