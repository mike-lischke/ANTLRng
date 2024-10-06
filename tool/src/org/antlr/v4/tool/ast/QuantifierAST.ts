/* java2ts: keep */

import type { GrammarAST } from "./GrammarAST.js";

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export interface QuantifierAST extends GrammarAST {
    isGreedy(): boolean;
}
