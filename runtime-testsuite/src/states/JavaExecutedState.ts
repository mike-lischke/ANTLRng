/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { JavaCompiledState } from "./JavaCompiledState.js";
import { ExecutedState } from "./ExecutedState.js";
import { ParseTree } from "antlr4ng";

export class JavaExecutedState extends ExecutedState {
    public readonly parseTree: ParseTree;

    public constructor(previousState: JavaCompiledState, output: string, errors: string, parseTree: ParseTree,
        exception: Error) {
        super(previousState, output, errors, exception);
        this.parseTree = parseTree;
    }
}
