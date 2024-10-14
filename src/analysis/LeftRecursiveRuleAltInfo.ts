/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { AltAST } from "../tool/ast/AltAST.js";

export class LeftRecursiveRuleAltInfo {
    public altNum: number; // original alt index (from 1)
    public leftRecursiveRuleRefLabel?: string;
    public altLabel?: string;
    public readonly isListLabel: boolean;
    public altText: string;
    public originalAltAST?: AltAST;
    public altAST: AltAST; // transformed ALT
    public nextPrec: number;

    public constructor(altNum: number, altText: string, leftRecursiveRuleRefLabel?: string, altLabel?: string,
        isListLabel?: boolean, originalAltAST?: AltAST) {
        this.altNum = altNum;
        this.altText = altText;
        this.leftRecursiveRuleRefLabel = leftRecursiveRuleRefLabel;
        this.altLabel = altLabel;
        this.isListLabel = isListLabel ?? false;
        this.originalAltAST = originalAltAST;
    }

}
