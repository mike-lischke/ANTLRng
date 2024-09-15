/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Decl } from "./decl/Decl.js";

/** All the rule elements we can label like tokens, rules, sets, wildcard. */
interface LabeledOp {
    getLabels(): Decl[];
}
