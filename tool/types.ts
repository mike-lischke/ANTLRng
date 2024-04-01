/*
* Copyright (c) The ANTLR Project. All rights reserved.
* Use of this file is governed by the BSD 3-clause license that
* can be found in the LICENSE.txt file in the project root.
*/

import type { ParseTree } from "antlr4ng";

export interface RuleReturnScope {
    start?: ParseTree;
    stop?: ParseTree;
}
