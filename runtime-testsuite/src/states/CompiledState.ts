/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { GeneratedState } from "./GeneratedState.js";
import { Stage } from "../Stage.js";
import { State } from "./State.js";

export class CompiledState extends State {

    public constructor(previousState: GeneratedState, exception: Error | null) {
        super(previousState, exception);
    }

    public getStage(): Stage {
        return Stage.Compile;
    }
}
