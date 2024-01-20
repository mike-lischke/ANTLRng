/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Stage } from "../Stage.js";

export abstract class State {
    public readonly previousState: State | null;
    public readonly exception: Error | null;

    public constructor(previousState: State | null, exception: Error | null) {
        this.previousState = previousState;
        this.exception = exception;
    }

    public containsErrors(): boolean {
        return this.exception !== undefined;
    }

    public getErrorMessage(): string {
        let result = "State: " + this.getStage() + "; ";
        if (this.exception) {
            result += this.exception.toString();
            if (this.exception.cause) {
                result += "\nCause:\n";
                result += String(this.exception.cause);
            }
        }

        return result;
    }

    public abstract getStage(): Stage;

}
