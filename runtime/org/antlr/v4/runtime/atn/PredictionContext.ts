/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention , no-underscore-dangle */

import { java, S, JavaObject, MurmurHash } from "jree";

import { ArrayPredictionContext } from "./ArrayPredictionContext";
import { ATN } from "./ATN";
import { EmptyPredictionContext } from "./EmptyPredictionContext";
import { ParserATNSimulator } from "./ParserATNSimulator";
import { PredictionContextCache } from "./PredictionContextCache";
import { RuleTransition } from "./RuleTransition";
import { SingletonPredictionContext } from "./SingletonPredictionContext";
import { ParserRuleContext } from "../ParserRuleContext";
import { Recognizer } from "../Recognizer";
import { RuleContext } from "../RuleContext";
import { DoubleKeyMap } from "../misc/DoubleKeyMap";

import { ATNSimulator } from "./ATNSimulator";
import { Token } from "../Token";

export abstract class PredictionContext extends JavaObject {
    /**
     * Represents {@code $} in an array in full context mode, when {@code $}
     * doesn't mean wildcard: {@code $ + x = [$,x]}. Here,
     * {@code $} = {@link #EMPTY_RETURN_STATE}.
     */
    public static readonly EMPTY_RETURN_STATE = java.lang.Integer.MAX_VALUE;

    private static readonly INITIAL_HASH = 1;

    private static globalNodeCount = 0;
    public readonly id: number = PredictionContext.globalNodeCount++;

    /**
     * Stores the computed hash code of this {@link PredictionContext}. The hash
     * code is computed in parts to match the following reference algorithm.
     *
     * <pre>
     *  private int referenceHashCode() {
     *      int hash = {@link MurmurHash#initialize MurmurHash.initialize}({@link #INITIAL_HASH});
     *
     *      for (int i = 0; i &lt; {@link #size()}; i++) {
     *          hash = {@link MurmurHash#update MurmurHash.update}(hash, {@link #getParent getParent}(i));
     *      }
     *
     *      for (int i = 0; i &lt; {@link #size()}; i++) {
     *          hash = {@link MurmurHash#update MurmurHash.update}(hash, {@link #getReturnState getReturnState}(i));
     *      }
     *
     *      hash = {@link MurmurHash#finish MurmurHash.finish}(hash, 2 * {@link #size()});
     *      return hash;
     *  }
     * </pre>
     */
    public readonly cachedHashCode: number;

    public abstract size: () => number;
    public abstract getParent: (index: number) => PredictionContext | null;
    public abstract getReturnState: (index: number) => number;

    public abstract equals: (obj: unknown) => boolean;

    protected constructor(cachedHashCode: number) {
        super();
        this.cachedHashCode = cachedHashCode;
    }

    // dispatch
    public static merge = (a: PredictionContext | null, b: PredictionContext | null, rootIsWildcard: boolean,
        mergeCache: DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext> | null,
    ): PredictionContext => {
        // share same graph if both same
        if (a === b || a!.equals(b)) {
            return a!;
        }

        if (a instanceof SingletonPredictionContext && b instanceof SingletonPredictionContext) {
            return PredictionContext.mergeSingletons(a, b, rootIsWildcard, mergeCache);
        }

        // At least one of a or b is array
        // If one is $ and rootIsWildcard, return $ as * wildcard
        if (rootIsWildcard) {
            if (a instanceof EmptyPredictionContext) {
                return a;
            }

            if (b instanceof EmptyPredictionContext) {
                return b;
            }

        }

        // convert singleton so both are arrays to normalize
        if (a instanceof SingletonPredictionContext) {
            a = new ArrayPredictionContext(a);
        }
        if (b instanceof SingletonPredictionContext) {
            b = new ArrayPredictionContext(b);
        }

        return PredictionContext.mergeArrays(a as ArrayPredictionContext, b as ArrayPredictionContext,
            rootIsWildcard, mergeCache);
    };

    /**
     * Convert a {@link RuleContext} tree to a {@link PredictionContext} graph.
     *  Return {@link EmptyPredictionContext#Instance} if {@code outerContext} is empty or null.
     *
     * @param atn tbd
     * @param outerContext tbd
     *
     * @returns tbd
     */
    public static fromRuleContext = (atn: ATN, outerContext: RuleContext | null): PredictionContext => {
        if (outerContext === null) {
            outerContext = ParserRuleContext.EMPTY;
        }

        // if we are in RuleContext of start rule, s, then PredictionContext
        // is EMPTY. Nobody called us. (if we are empty, return empty)
        if (outerContext.parent === null || outerContext === ParserRuleContext.EMPTY) {
            return EmptyPredictionContext.Instance;
        }

        // If we have a parent, convert it to a PredictionContext graph
        let parent: PredictionContext = EmptyPredictionContext.Instance;
        parent = PredictionContext.fromRuleContext(atn, outerContext.parent);

        const state = atn.states.get(outerContext.invokingState);
        const transition: RuleTransition = state!.transition(0) as RuleTransition;

        return SingletonPredictionContext.create(parent, transition.followState.stateNumber);
    };

    /**
     * Merge two {@link SingletonPredictionContext} instances.
     *
     * <p>Stack tops equal, parents merge is same; return left graph.<br>
     * <embed src="images/SingletonMerge_SameRootSamePar.svg" type="image/svg+xml"/></p>
     *
     * <p>Same stack top, parents differ; merge parents giving array node, then
     * remainders of those graphs. A new root node is created to point to the
     * merged parents.<br>
     * <embed src="images/SingletonMerge_SameRootDiffPar.svg" type="image/svg+xml"/></p>
     *
     * <p>Different stack tops pointing to same parent. Make array node for the
     * root where both element in the root point to the same (original)
     * parent.<br>
     * <embed src="images/SingletonMerge_DiffRootSamePar.svg" type="image/svg+xml"/></p>
     *
     * <p>Different stack tops pointing to different parents. Make array node for
     * the root where each element points to the corresponding original
     * parent.<br>
     * <embed src="images/SingletonMerge_DiffRootDiffPar.svg" type="image/svg+xml"/></p>
     *
     * @param a the first {@link SingletonPredictionContext}
     * @param b the second {@link SingletonPredictionContext}
     * @param rootIsWildcard {@code true} if this is a local-context merge,
     * otherwise false to indicate a full-context merge
     * @param mergeCache tbd
     *
     * @returns tbd
     */
    public static mergeSingletons = (a: SingletonPredictionContext, b: SingletonPredictionContext,
        rootIsWildcard: boolean,
        mergeCache: DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext> | null,
    ): PredictionContext => {
        if (mergeCache) {
            let previous = mergeCache.get(a, b);
            if (previous !== null) {
                return previous;
            }

            previous = mergeCache.get(b, a);
            if (previous !== null) {
                return previous;
            }

        }

        const rootMerge = PredictionContext.mergeRoot(a, b, rootIsWildcard);
        if (rootMerge !== null) {
            mergeCache?.put(a, b, rootMerge);

            return rootMerge;
        }

        if (a.returnState === b.returnState) { // a == b
            const parent = PredictionContext.merge(a.parent, b.parent, rootIsWildcard, mergeCache);
            // if parent is same as existing a or b parent or reduced to a parent, return it
            if (parent === a.parent) {
                return a;
            }
            // ax + bx = ax, if a=b
            if (parent === b.parent) {
                return b;
            }
            // ax + bx = bx, if a=b
            // else: ax + ay = a'[x,y]
            // merge parents x and y, giving array node with x,y then remainders
            // of those graphs.  dup a, a' points at merged array
            // new joined parent so create new singleton pointing to it, a'
            const a_ = SingletonPredictionContext.create(parent, a.returnState);
            mergeCache?.put(a, b, a_);

            return a_;
        } else { // a != b payloads differ
            // see if we can collapse parents due to $+x parents if local ctx
            let singleParent: PredictionContext | null = null;
            if (a === b || (a.parent !== null && a.parent.equals(b.parent))) { // ax + bx = [a,b]x
                singleParent = a.parent;
            }
            if (singleParent !== null) {	// parents are same
                // sort payloads and use same parent
                const payloads = new Int32Array([a.returnState, b.returnState]);
                if (a.returnState > b.returnState) {
                    payloads[0] = b.returnState;
                    payloads[1] = a.returnState;
                }
                const parents = [singleParent, singleParent];
                const a_ = new ArrayPredictionContext(parents, payloads);
                mergeCache?.put(a, b, a_);

                return a_;
            }
            // parents differ and can't merge them. Just pack together
            // into array; can't merge.
            // ax + by = [ax,by]
            const payloads = new Int32Array([a.returnState, b.returnState]);
            let parents = [a.parent!, b.parent!];
            if (a.returnState > b.returnState) { // sort by payload
                payloads[0] = b.returnState;
                payloads[1] = a.returnState;
                parents = [b.parent!, a.parent!];
            }
            const a_ = new ArrayPredictionContext(parents, payloads);
            mergeCache?.put(a, b, a_);

            return a_;
        }
    };

    /**
     * Handle case where at least one of {@code a} or {@code b} is
     * {@link EmptyPredictionContext#Instance}. In the following diagrams, the symbol {@code $} is used
     * to represent {@link EmptyPredictionContext#Instance}.
     *
     * <h2>Local-Context Merges</h2>
     *
     * <p>These local-context merge operations are used when {@code rootIsWildcard}
     * is true.</p>
     *
     * <p>{@link EmptyPredictionContext#Instance} is superset of any graph; return
     * {@link EmptyPredictionContext#Instance}.<br>
     * <embed src="images/LocalMerge_EmptyRoot.svg" type="image/svg+xml"/></p>
     *
     * <p>{@link EmptyPredictionContext#Instance} and anything is {@code #EMPTY}, so merged parent is
     * {@code #EMPTY}; return left graph.<br>
     * <embed src="images/LocalMerge_EmptyParent.svg" type="image/svg+xml"/></p>
     *
     * <p>Special case of last merge if local context.<br>
     * <embed src="images/LocalMerge_DiffRoots.svg" type="image/svg+xml"/></p>
     *
     * <h2>Full-Context Merges</h2>
     *
     * <p>These full-context merge operations are used when {@code rootIsWildcard}
     * is false.</p>
     *
     * <p><embed src="images/FullMerge_EmptyRoots.svg" type="image/svg+xml"/></p>
     *
     * <p>Must keep all contexts; {@link EmptyPredictionContext#Instance} in array is a special value (and
     * null parent).<br>
     * <embed src="images/FullMerge_EmptyRoot.svg" type="image/svg+xml"/></p>
     *
     * <p><embed src="images/FullMerge_SameRoot.svg" type="image/svg+xml"/></p>
     *
     * @param a the first {@link SingletonPredictionContext}
     * @param b the second {@link SingletonPredictionContext}
     * @param rootIsWildcard {@code true} if this is a local-context merge,
     * otherwise false to indicate a full-context merge
     *
     * @returns tbd
     */
    public static mergeRoot = (a: SingletonPredictionContext, b: SingletonPredictionContext,
        rootIsWildcard: boolean): PredictionContext | null => {
        if (rootIsWildcard) {
            if (a === EmptyPredictionContext.Instance) {
                return EmptyPredictionContext.Instance;
            }
            // * + b = *
            if (b === EmptyPredictionContext.Instance) {
                return EmptyPredictionContext.Instance;
            }
            // a + * = *
        } else {
            if (a === EmptyPredictionContext.Instance && b === EmptyPredictionContext.Instance) {
                return EmptyPredictionContext.Instance;
            }
            // $ + $ = $
            if (a === EmptyPredictionContext.Instance) { // $ + x = [x,$]
                const payloads = new Int32Array([b.returnState, PredictionContext.EMPTY_RETURN_STATE]);
                const parents = [b.parent, null];
                const joined = new ArrayPredictionContext(parents, payloads);

                return joined;
            }
            if (b === EmptyPredictionContext.Instance) { // x + $ = [x,$] ($ is always last if present)
                const payloads = new Int32Array([a.returnState, PredictionContext.EMPTY_RETURN_STATE]);
                const parents = [a.parent, null];
                const joined = new ArrayPredictionContext(parents, payloads);

                return joined;
            }
        }

        return null;
    };

    /**
     * Merge two {@link ArrayPredictionContext} instances.
     *
     * <p>Different tops, different parents.<br>
     * <embed src="images/ArrayMerge_DiffTopDiffPar.svg" type="image/svg+xml"/></p>
     *
     * <p>Shared top, same parents.<br>
     * <embed src="images/ArrayMerge_ShareTopSamePar.svg" type="image/svg+xml"/></p>
     *
     * <p>Shared top, different parents.<br>
     * <embed src="images/ArrayMerge_ShareTopDiffPar.svg" type="image/svg+xml"/></p>
     *
     * <p>Shared top, all shared parents.<br>
     * <embed src="images/ArrayMerge_ShareTopSharePar.svg" type="image/svg+xml"/></p>
     *
     * <p>Equal tops, merge parents and reduce top to
     * {@link SingletonPredictionContext}.<br>
     * <embed src="images/ArrayMerge_EqualTop.svg" type="image/svg+xml"/></p>
     *
     * @param a tbd
     * @param b tbd
     * @param rootIsWildcard tbd
     * @param mergeCache tbd
     *
     * @returns tbd
     */
    public static mergeArrays = (a: ArrayPredictionContext, b: ArrayPredictionContext, rootIsWildcard: boolean,
        mergeCache: DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext> | null,
    ): PredictionContext => {
        if (mergeCache) {
            let previous = mergeCache.get(a, b);
            if (previous !== null) {
                if (ParserATNSimulator.trace_atn_sim) {
                    java.lang.System.out.println(S`mergeArrays a=${a},b=${b} -> previous`);
                }

                return previous;
            }
            previous = mergeCache.get(b, a);
            if (previous !== null) {
                if (ParserATNSimulator.trace_atn_sim) {
                    java.lang.System.out.println(S`mergeArrays a=${a},b=${b} -> previous`);
                }

                return previous;
            }
        }

        // merge sorted payloads a + b => M
        let i = 0; // walks a
        let j = 0; // walks b
        let k = 0; // walks target M array

        let mergedReturnStates = new Int32Array([a.returnStates.length + b.returnStates.length]);
        let mergedParents = new Array<PredictionContext | null>(a.returnStates.length + b.returnStates.length);
        // walk and merge to yield mergedParents, mergedReturnStates
        while (i < a.returnStates.length && j < b.returnStates.length) {
            const a_parent = a.parents[i];
            const b_parent = b.parents[j];
            if (a.returnStates[i] === b.returnStates[j]) {
                // same payload (stack tops are equal), must yield merged singleton
                const payload: number = a.returnStates[i];
                // $+$ = $
                const both$ = payload === PredictionContext.EMPTY_RETURN_STATE &&
                    a_parent === null && b_parent === null;
                const ax_ax = (a_parent !== null && b_parent !== null) &&
                    a_parent.equals(b_parent); // ax+ax -> ax
                if (both$ || ax_ax) {
                    mergedParents[k] = a_parent; // choose left
                    mergedReturnStates[k] = payload;
                } else { // ax+ay -> a'[x,y]
                    const mergedParent = PredictionContext.merge(a_parent, b_parent, rootIsWildcard, mergeCache);
                    mergedParents[k] = mergedParent;
                    mergedReturnStates[k] = payload;
                }
                i++; // hop over left one as usual
                j++; // but also skip one in right side since we merge
            } else {
                if (a.returnStates[i] < b.returnStates[j]) { // copy a[i] to M
                    mergedParents[k] = a_parent;
                    mergedReturnStates[k] = a.returnStates[i];
                    i++;
                } else { // b > a, copy b[j] to M
                    mergedParents[k] = b_parent;
                    mergedReturnStates[k] = b.returnStates[j];
                    j++;
                }
            }

            k++;
        }

        // copy over any payloads remaining in either array
        if (i < a.returnStates.length) {
            for (let p: number = i; p < a.returnStates.length; p++) {
                mergedParents[k] = a.parents[p];
                mergedReturnStates[k] = a.returnStates[p];
                k++;
            }
        } else {
            for (let p: number = j; p < b.returnStates.length; p++) {
                mergedParents[k] = b.parents[p];
                mergedReturnStates[k] = b.returnStates[p];
                k++;
            }
        }

        // trim merged if we combined a few that had same stack tops
        if (k < mergedParents.length) { // write index < last position; trim
            if (k === 1) { // for just one merged element, return singleton top
                const a_: PredictionContext =
                    SingletonPredictionContext.create(mergedParents[0],
                        mergedReturnStates[0]);
                mergeCache?.put(a, b, a_);

                return a_;
            }
            mergedParents = mergedParents.slice(0, k);
            mergedReturnStates = mergedReturnStates.slice(0, k);
        }

        const M = new ArrayPredictionContext(mergedParents, mergedReturnStates);

        // if we created same array as a or b, return that instead
        // TODO: track whether this is possible above during merge sort for speed
        if (M.equals(a)) {
            mergeCache?.put(a, b, a);

            if (ParserATNSimulator.trace_atn_sim) {
                java.lang.System.out.println(S`mergeArrays a=${a},b=${b} -> a`);
            }

            return a;
        }
        if (M.equals(b)) {
            mergeCache?.put(a, b, b);

            if (ParserATNSimulator.trace_atn_sim) {
                java.lang.System.out.println(S`mergeArrays a=${a},b=${b} -> b`);
            }

            return b;
        }

        PredictionContext.combineCommonParents(mergedParents);

        mergeCache?.put(a, b, M);

        if (ParserATNSimulator.trace_atn_sim) {
            java.lang.System.out.println(S`mergeArrays a=${a},b=${b} -> ${M}`);
        }

        return M;
    };

    public static toDOTString = (context: PredictionContext | null): java.lang.String | null => {
        if (context === null) {
            return S``;
        }

        const buf = new java.lang.StringBuilder();
        buf.append(S`digraph G {\n`);
        buf.append(S`rankdir=LR;\n`);

        const nodes = PredictionContext.getAllContextNodes(context);
        java.util.Collections.sort(nodes, new class implements java.util.Comparator<PredictionContext> {
            public compare = (o1: PredictionContext, o2: PredictionContext): number => {
                return o1.id - o2.id;
            };
        }());

        for (const current of nodes) {
            if (current instanceof SingletonPredictionContext) {
                const s: java.lang.String = java.lang.String.valueOf(current.id);
                buf.append(S`  s`).append(s);
                let returnState: java.lang.String = java.lang.String.valueOf(current.getReturnState(0));
                if (current instanceof EmptyPredictionContext) {
                    returnState = S`$`;
                }

                buf.append(S` [label=\"`).append(returnState).append(S`\"];\n`);
                continue;
            }
            const arr: ArrayPredictionContext = current as ArrayPredictionContext;
            buf.append(S`  s`).append(arr.id);
            buf.append(S` [shape=box, label=\"`);
            buf.append(S`[`);
            let first = true;
            for (const inv of arr.returnStates) {
                if (!first) {
                    buf.append(S`, `);
                }

                if (inv === PredictionContext.EMPTY_RETURN_STATE) {
                    buf.append(S`$`);
                } else {
                    buf.append(inv);
                }

                first = false;
            }
            buf.append(S`]`);
            buf.append(S`\"];\n`);
        }

        for (const current of nodes) {
            if (current === EmptyPredictionContext.Instance) {
                continue;
            }

            for (let i = 0; i < current.size(); i++) {
                if (current.getParent(i) === null) {
                    continue;
                }

                const s = java.lang.String.valueOf(current.id);
                buf.append(S`  s`).append(s);
                buf.append(S`->`);
                buf.append(S`s`);
                buf.append(current.getParent(i)!.id);
                if (current.size() > 1) {
                    buf.append(S` [label=\"parent[${i}]\"];\n`);
                } else {
                    buf.append(S`;\n`);
                }
            }
        }

        buf.append(S`}\n`);

        return buf.toString();
    };

    // From Sam
    public static getCachedContext = (context: PredictionContext, contextCache: PredictionContextCache,
        visited: java.util.IdentityHashMap<PredictionContext, PredictionContext>): PredictionContext => {
        if (!context || context.isEmpty()) {
            return context;
        }

        let existing = visited.get(context);
        if (existing !== null) {
            return existing;
        }

        existing = contextCache.get(context);
        if (existing !== null) {
            visited.put(context, existing);

            return existing;
        }

        let changed = false;
        let parents = new Array<PredictionContext | null>(context.size());
        for (let i = 0; i < parents.length; i++) {
            const parent = PredictionContext.getCachedContext(context.getParent(i)!, contextCache, visited);
            if (changed || parent !== context.getParent(i)) {
                if (!changed) {
                    parents = new Array<PredictionContext>(context.size());
                    for (let j = 0; j < context.size(); j++) {
                        parents[j] = context.getParent(j);
                    }

                    changed = true;
                }

                parents[i] = parent;
            }
        }

        if (!changed) {
            contextCache.add(context);
            visited.put(context, context);

            return context;
        }

        let updated: PredictionContext;
        if (parents.length === 0) {
            updated = EmptyPredictionContext.Instance;
        } else {
            if (parents.length === 1) {
                updated = SingletonPredictionContext.create(parents[0], context.getReturnState(0));
            } else {
                const arrayPredictionContext: ArrayPredictionContext = context as ArrayPredictionContext;
                updated = new ArrayPredictionContext(parents, arrayPredictionContext.returnStates);
            }
        }

        contextCache.add(updated);
        visited.put(updated, updated);
        visited.put(context, updated);

        return updated;
    };

    // ter's recursive version of Sam's getAllNodes()
    public static getAllContextNodes = (context: PredictionContext): java.util.List<PredictionContext> => {
        const nodes = new java.util.ArrayList<PredictionContext>();
        const visited = new java.util.IdentityHashMap<PredictionContext, PredictionContext>();
        PredictionContext.getAllContextNodes_(context, nodes, visited);

        return nodes;
    };

    public static getAllContextNodes_ = (context: PredictionContext | null, nodes: java.util.List<PredictionContext>,
        visited: java.util.Map<PredictionContext, PredictionContext>): void => {
        if (context === null || visited.containsKey(context)) {
            return;
        }

        visited.put(context, context);
        nodes.add(context);
        for (let i = 0; i < context.size(); i++) {
            PredictionContext.getAllContextNodes_(context.getParent(i), nodes, visited);
        }
    };

    protected static calculateEmptyHashCode = (): number => {
        let hash: number = MurmurHash.initialize(PredictionContext.INITIAL_HASH);
        hash = MurmurHash.finish(hash, 0);

        return hash;
    };

    protected static calculateHashCode(parent: PredictionContext, returnState: number): number;
    protected static calculateHashCode(parents: Array<PredictionContext | null>, returnStates: Int32Array): number;
    protected static calculateHashCode(parentOrParents: PredictionContext | Array<PredictionContext | null>,
        returnStateOrReturnStates: number | Int32Array): number {
        if (parentOrParents instanceof PredictionContext) {
            let hash = MurmurHash.initialize(PredictionContext.INITIAL_HASH);
            hash = MurmurHash.update(hash, parentOrParents);
            hash = MurmurHash.update(hash, returnStateOrReturnStates);
            hash = MurmurHash.finish(hash, 2);

            return hash;
        } else {
            const returnStates = returnStateOrReturnStates as Int32Array;
            let hash: number = MurmurHash.initialize(PredictionContext.INITIAL_HASH);

            for (const parent of parentOrParents) {
                hash = MurmurHash.update(hash, parent);
            }

            for (const returnState of returnStates) {
                hash = MurmurHash.update(hash, returnState);
            }

            hash = MurmurHash.finish(hash, 2 * parentOrParents.length);

            return hash;
        }

    }

    /**
     * Make pass over all <em>M</em> {@code parents}; merge any {@code equals()}
     * ones.
     *
     * @param parents tbd
     */
    protected static combineCommonParents = (parents: Array<PredictionContext | null>): void => {
        const uniqueParents = new java.util.HashMap<PredictionContext | null, PredictionContext | null>();

        for (const parent of parents) {
            if (!uniqueParents.containsKey(parent)) { // don't replace
                uniqueParents.put(parent, parent);
            }
        }

        for (let p = 0; p < parents.length; p++) {
            parents[p] = uniqueParents.get(parents[p])!;
        }
    };

    public toString = <S extends Token, T extends ATNSimulator>(
        _recog?: Recognizer<S, T> | null): java.lang.String => {
        return super.toString();
    };

    public toStrings<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<S, T>,
        currentState: number): java.lang.String[];
    public toStrings<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<S, T>,
        stop: PredictionContext, currentState: number): java.lang.String[];
    public toStrings<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<S, T>,
        currentStateOrStop: number | PredictionContext, currentState?: number): java.lang.String[] {
        let state: number;
        let stop;
        if (currentStateOrStop instanceof PredictionContext) {
            stop = currentStateOrStop;
            state = currentState!;
        } else {
            state = currentStateOrStop;
            stop = EmptyPredictionContext.Instance;
        }

        const result: java.lang.String[] = [];
        const atn = recognizer.getATN()!;

        outer:
        for (let perm = 0; ; perm++) {
            let offset = 0;
            let last = true;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let p: PredictionContext | null = this;
            let stateNumber = state;
            const localBuffer = new java.lang.StringBuilder();
            localBuffer.append(S`[`);
            while (p && !p.isEmpty() && p !== stop) {
                let index = 0;
                if (p.size() > 0) {
                    let bits = 1;
                    while ((1 << bits) < p.size()) {
                        bits++;
                    }

                    const mask = (1 << bits) - 1;
                    index = (perm >> offset) & mask;
                    last &&= index >= p.size() - 1;
                    if (index >= p.size()) {
                        continue outer;
                    }
                    offset += bits;
                }

                if (recognizer !== null) {
                    if (localBuffer.length() > 1) {
                        // first char is '[', if more than that this isn't the first rule
                        localBuffer.append(" ");
                    }

                    const s = atn.states.get(stateNumber);
                    const ruleName = recognizer.getRuleNames()[s!.ruleIndex];
                    localBuffer.append(ruleName);
                } else {
                    if (p.getReturnState(index) !== PredictionContext.EMPTY_RETURN_STATE) {
                        if (!p.isEmpty()) {
                            if (localBuffer.length() > 1) {
                                // first char is '[', if more than that this isn't the first rule
                                localBuffer.append(" ");
                            }

                            localBuffer.append(p.getReturnState(index));
                        }
                    }
                }

                stateNumber = p.getReturnState(index);
                p = p.getParent(index);
            }

            localBuffer.append(S`]`);
            result.push(localBuffer.toString());

            if (last) {
                break;
            }
        }

        return result;
    }

    /**
     * This means only the {@link EmptyPredictionContext#Instance} (wildcard? not sure) context is in set.
     *
     * @returns tbd
     */
    public isEmpty = (): boolean => {
        return false;
    };

    public hasEmptyPath = (): boolean => {
        // since EMPTY_RETURN_STATE can only appear in the last position, we check last one
        return this.getReturnState(this.size() - 1) === PredictionContext.EMPTY_RETURN_STATE;
    };

    public readonly hashCode = (): number => {
        return this.cachedHashCode;
    };

}
