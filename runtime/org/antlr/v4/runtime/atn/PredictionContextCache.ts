/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject } from "jree";
import { EmptyPredictionContext } from "./EmptyPredictionContext";
import { PredictionContext } from "./PredictionContext";

/**
 * Used to cache {@link PredictionContext} objects. Its used for the shared
 *  context cash associated with contexts in DFA states. This cache
 *  can be used for both lexers and parsers.
 */
export class PredictionContextCache extends JavaObject {
    protected readonly cache: java.util.Map<PredictionContext, PredictionContext> =
        new java.util.HashMap<PredictionContext, PredictionContext>();

    /**
     * Add a context to the cache and return it. If the context already exists,
     *  return that one instead and do not add a new context to the cache.
     *  Protect shared cache from unsafe thread access.
     *
     * @param ctx tbd
     *
     * @returns tbd
     */
    public add = (ctx: PredictionContext): PredictionContext => {
        if (ctx === EmptyPredictionContext.Instance) {
            return EmptyPredictionContext.Instance;
        }

        const existing = this.cache.get(ctx);
        if (existing !== null) {
            //			System.out.println(name+" reuses "+existing);
            return existing;
        }
        this.cache.put(ctx, ctx);

        return ctx;
    };

    public get = (ctx: PredictionContext): PredictionContext | null => {
        return this.cache.get(ctx);
    };

    public size = (): number => {
        return this.cache.size();
    };
}
