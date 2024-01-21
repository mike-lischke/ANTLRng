/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CompiledState } from "./CompiledState.js";
import { Stage } from "../Stage.js";
import { State } from "./State.js";

export class ExecutedState extends State {

    public readonly output: string;
    public readonly errors: string;

    public constructor(previousState: CompiledState, output: string | null, errors: string | null,
        exception: Error | null) {
        super(previousState, exception);
        this.output = output ?? "";
        this.errors = errors ?? "";
    }

    public getStage(): Stage {
        return Stage.Execute;
    }
}
