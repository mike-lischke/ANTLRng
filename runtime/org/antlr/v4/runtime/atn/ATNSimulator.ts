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

import { java, S, JavaObject } from "jree";

import { ATN } from "./ATN";
import { ATNConfigSet } from "./ATNConfigSet";
import { PredictionContext } from "./PredictionContext";
import { PredictionContextCache } from "./PredictionContextCache";
import { DFAState } from "../dfa/DFAState";

export abstract class ATNSimulator extends JavaObject {
    /** Must distinguish between missing edge and edge we know leads nowhere */

    public static readonly ERROR: DFAState;

    public readonly atn: ATN;

    /**
     * The context cache maps all PredictionContext objects that are equals()
     *  to a single cached copy. This cache is shared across all contexts
     *  in all ATNConfigs in all DFA states.  We rebuild each ATNConfigSet
     *  to use only cached nodes/graphs in addDFAState(). We don't want to
     *  fill this during closure() since there are lots of contexts that
     *  pop up but are not used ever again. It also greatly slows down closure().
     *
     *  <p>This cache makes a huge difference in memory and a little bit in speed.
     *  For the Java grammar on java.*, it dropped the memory requirements
     *  at the end from 25M to 16M. We don't store any of the full context
     *  graphs in the DFA because they are limited to local context only,
     *  but apparently there's a lot of repetition there as well. We optimize
     *  the config contexts before storing the config set in the DFA states
     *  by literally rebuilding them with cached subgraphs only.</p>
     *
     *  <p>I tried a cache for use during closure operations, that was
     *  whacked after each adaptivePredict(). It cost a little bit
     *  more time I think and doesn't save on the overall footprint
     *  so it's not worth the complexity.</p>
     */
    public readonly sharedContextCache: PredictionContextCache | null;

    public constructor(atn: ATN, sharedContextCache: PredictionContextCache | null) {
        super();
        this.atn = atn;
        this.sharedContextCache = sharedContextCache;
    }

    public abstract reset: () => void;

    /**
     * Clear the DFA cache used by the current instance. Since the DFA cache may
     * be shared by multiple ATN simulators, this method may affect the
     * performance (but not accuracy) of other parsers which are being used
     * concurrently.
     *
     * @throws UnsupportedOperationException if the current instance does not
     * support clearing the DFA.
     *
     *
     */
    public clearDFA = (): void => {
        throw new java.lang.UnsupportedOperationException(S`This ATN simulator does not support clearing the DFA.`);
    };

    public getSharedContextCache = (): PredictionContextCache | null => {
        return this.sharedContextCache;
    };

    public getCachedContext = (context: PredictionContext): PredictionContext => {
        if (this.sharedContextCache === null) {
            return context;
        }

		/* synchronized (sharedContextCache) */ {
            const visited = new java.util.IdentityHashMap<PredictionContext, PredictionContext>();

            return PredictionContext.getCachedContext(context,
                this.sharedContextCache,
                visited);
        }
    };

    static {
        // @ts-ignore
        ATNSimulator.ERROR = new DFAState(new ATNConfigSet());
        ATNSimulator.ERROR.stateNumber = java.lang.Integer.MAX_VALUE;
    }
}
