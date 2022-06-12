/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */

import { ATNState } from "./ATNState";
import { Transition } from "./Transition";

export class ActionTransition extends Transition {
    public readonly ruleIndex: number;
    public readonly actionIndex: number;
    public readonly isCtxDependent: boolean; // e.g., $i ref in action

    /* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
    public constructor(target: ATNState, ruleIndex: number);
    public constructor(target: ATNState, ruleIndex: number, actionIndex: number, isCtxDependent: boolean);
    /* @ts-expect-error, because of the super() call in the closure. */
    public constructor(target: ATNState, ruleIndex: number, actionIndex?: number, isCtxDependent?: boolean) {
        const $this = (target: ATNState, ruleIndex: number, actionIndex?: number, isCtxDependent?: boolean): void => {
            if (target instanceof ATNState && typeof ruleIndex === "number" && actionIndex === undefined) {
                $this(target, ruleIndex, -1, false);
            } else {
                /* @ts-expect-error, because of the super() call in the closure. */
                super(target);
                // @ts-ignore
                this.ruleIndex = ruleIndex;
                // @ts-ignore
                this.actionIndex = actionIndex;
                // @ts-ignore
                this.isCtxDependent = isCtxDependent;
            }
        };

        $this(target, ruleIndex, actionIndex, isCtxDependent);
    }

    /* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

    public getSerializationType(): number {
        return Transition.ACTION;
    }

    public isEpsilon(): boolean {
        return true; // we are to be ignored by analysis 'cept for predicates
    }

    public matches(_symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean {
        return false;
    }

    public toString(): string {
        return "action_" + this.ruleIndex + ":" + this.actionIndex;
    }

}
