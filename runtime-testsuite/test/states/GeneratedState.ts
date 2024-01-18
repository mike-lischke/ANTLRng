/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ErrorQueue } from "../ErrorQueue.js";
import { GeneratedFile } from "../GeneratedFile.js";
import { Stage } from "../Stage.js";
import { RuntimeTestUtils } from "../RuntimeTestUtils.js";
import { State } from "./State.js";

export class GeneratedState extends State {

    public readonly errorQueue: ErrorQueue;
    public readonly generatedFiles: GeneratedFile[];

    public constructor(errorQueue: ErrorQueue, generatedFiles: GeneratedFile[], exception?: Error) {
        super(undefined, exception);
        this.errorQueue = errorQueue;
        this.generatedFiles = generatedFiles;
    }

    public getStage(): Stage {
        return Stage.Generate;
    }

    public override containsErrors(): boolean {
        return this.errorQueue.errors.length > 0 || super.containsErrors();
    }

    public override getErrorMessage(): string {
        let result = super.getErrorMessage();

        if (this.errorQueue.errors.length > 0) {
            result = RuntimeTestUtils.joinLines(result, this.errorQueue.toString(true));
        }

        return result;
    }
}
