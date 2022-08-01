/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */

import { java } from "../../../../../../../lib/java/java";
import { ArrayPredictionContext } from "./ArrayPredictionContext";
import { ATN } from "./ATN";
import { ATNState } from "./ATNState";
import { EmptyPredictionContext } from "./EmptyPredictionContext";
import { PredictionContextCache } from "./PredictionContextCache";
import { RuleTransition } from "./RuleTransition";
import { SingletonPredictionContext } from "./SingletonPredictionContext";
import { Recognizer } from "../Recognizer";
import { RuleContext } from "../RuleContext";
import { DoubleKeyMap } from "../misc/DoubleKeyMap";
import { MurmurHash } from "../../../../../../lib/MurmurHash";
import { ParserRuleContext } from "../ParserRuleContext";
import { ATNSimulator } from "./ATNSimulator";

export abstract class PredictionContext {
    /**
     * Represents {@code $} in local context prediction, which means wildcard.
     * {@code *+x = *}.
     */
    public static readonly EMPTY = new EmptyPredictionContext();

    /**
     * Represents {@code $} in an array in full context mode, when {@code $}
     * doesn't mean wildcard: {@code $ + x = [$,x]}. Here,
     * {@code $} = {@link #EMPTY_RETURN_STATE}.
     */
    public static readonly EMPTY_RETURN_STATE: number = java.lang.Integer.MAX_VALUE;

    private static readonly INITIAL_HASH: number = 1;

    public static globalNodeCount = 0;
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

    protected constructor(cachedHashCode: number) {
        this.cachedHashCode = cachedHashCode;
    }

    /**
     * Convert a {@link RuleContext} tree to a {@link PredictionContext} graph.
     *  Return {@link #EMPTY} if {@code outerContext} is empty or null.
     *
     * @param atn
     * @param outerContext
     */
    public static fromRuleContext = (atn: ATN, outerContext: RuleContext): PredictionContext => {
        if (outerContext === undefined) {
            outerContext = ParserRuleContext.EMPTY;
        }

        // if we are in RuleContext of start rule, s, then PredictionContext
        // is EMPTY. Nobody called us. (if we are empty, return empty)
        if (outerContext.parent === undefined || outerContext === ParserRuleContext.EMPTY) {
            return PredictionContext.EMPTY;
        }

        // If we have a parent, convert it to a PredictionContext graph
        let parent: PredictionContext = PredictionContext.EMPTY;
        parent = PredictionContext.fromRuleContext(atn, outerContext.parent);

        const state: ATNState = atn.states.get(outerContext.invokingState);
        const transition: RuleTransition = state.transition(0) as RuleTransition;

        return SingletonPredictionContext.create(parent, transition.followState.stateNumber);
    };

    public abstract size: () => number;

    public abstract getParent: (index: number) => PredictionContext;

    public abstract getReturnState: (index: number) => number;

    /**
     * This means only the {@link #EMPTY} (wildcard? not sure) context is in set.
     *
     * @returns True if this is an empty context.
     */
    public isEmpty = (): boolean => {
        return this === PredictionContext.EMPTY;
    };

    public hasEmptyPath = (): boolean => {
        // since EMPTY_RETURN_STATE can only appear in the last position, we check last one
        return this.getReturnState(this.size() - 1) === PredictionContext.EMPTY_RETURN_STATE;
    };

    public readonly hashCode = (): number => {
        return this.cachedHashCode;
    };

    public abstract equals: (obj: object) => boolean;

    protected static calculateEmptyHashCode = (): number => {
        let hash: number = MurmurHash.initialize(PredictionContext.INITIAL_HASH);
        hash = MurmurHash.finish(hash, 0);

        return hash;
    };

    protected static calculateHashCode(parent: PredictionContext, returnState: number): number;

    protected static calculateHashCode(parents: PredictionContext[], returnStates: number[]): number;

    protected static calculateHashCode(parentOrParents: PredictionContext | PredictionContext[],
        returnStateOrReturnStates: number | number[]): number {
        if (parentOrParents instanceof PredictionContext && typeof returnStateOrReturnStates === "number") {
            const parent = parentOrParents;
            const returnState = returnStateOrReturnStates;
            let hash: number = MurmurHash.initialize(PredictionContext.INITIAL_HASH);
            hash = MurmurHash.update(hash, parent);
            hash = MurmurHash.update(hash, returnState);
            hash = MurmurHash.finish(hash, 2);

            return hash;
        } else {
            const parents = parentOrParents as PredictionContext[];
            const returnStates = returnStateOrReturnStates as number[];
            let hash: number = MurmurHash.initialize(PredictionContext.INITIAL_HASH);

            for (const parent of parents) {
                hash = MurmurHash.update(hash, parent);
            }

            for (const returnState of returnStates) {
                hash = MurmurHash.update(hash, returnState);
            }

            hash = MurmurHash.finish(hash, 2 * parents.length);

            return hash;
        }
    }

    // dispatch
    public static merge = (
        a: PredictionContext, b: PredictionContext,
        rootIsWildcard: boolean,
        mergeCache: DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext>): PredictionContext => {
        /* assert a!=null && b!=null; */  // must be empty context, never null

        // share same graph if both same
        if (a === b || a.equals(b)) {
            return a;
        }

        if (a instanceof SingletonPredictionContext && b instanceof SingletonPredictionContext) {
            return PredictionContext.mergeSingletons(a,
                b,
                rootIsWildcard, mergeCache);
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
     * Merge two {@link SingletonPredictionContext} instances.
     *
     * Stack tops equal, parents merge is same; return left graph.
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
     * @param rootIsWildcard {@code true} if this is a local-context merge, otherwise false to indicate a full-context
     *                       merge
     * @param mergeCache tbd
     *
     * @returns The merged prediction context.
     */
    public static mergeSingletons = (
        a: SingletonPredictionContext,
        b: SingletonPredictionContext,
        rootIsWildcard: boolean,
        mergeCache: DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext>): PredictionContext => {
        if (mergeCache !== undefined) {
            let previous: PredictionContext = mergeCache.get(a, b);
            if (previous !== undefined) {
                return previous;
            }

            previous = mergeCache.get(b, a);
            if (previous !== undefined) {
                return previous;
            }

        }

        const rootMerge: PredictionContext = PredictionContext.mergeRoot(a, b, rootIsWildcard);
        if (rootMerge !== undefined) {
            if (mergeCache !== undefined) {
                mergeCache.put(a, b, rootMerge);
            }

            return rootMerge;
        }

        if (a.returnState === b.returnState) { // a == b
            const parent: PredictionContext = PredictionContext.merge(a.parent, b.parent, rootIsWildcard, mergeCache);
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
            const a_: PredictionContext = SingletonPredictionContext.create(parent, a.returnState);
            if (mergeCache !== undefined) {
                mergeCache.put(a, b, a_);
            }

            return a_;
        } else { // a != b payloads differ
            // see if we can collapse parents due to $+x parents if local ctx
            let singleParent: PredictionContext;
            if (a === b || (a.parent !== undefined && a.parent.equals(b.parent))) { // ax + bx = [a,b]x
                singleParent = a.parent;
            }
            if (singleParent !== undefined) {	// parents are same
                // sort payloads and use same parent
                const payloads: number[] = [a.returnState, b.returnState];
                if (a.returnState > b.returnState) {
                    payloads[0] = b.returnState;
                    payloads[1] = a.returnState;
                }
                const parents: PredictionContext[] = [singleParent, singleParent];
                const a_: PredictionContext = new ArrayPredictionContext(parents, payloads);
                if (mergeCache !== undefined) {
                    mergeCache.put(a, b, a_);
                }

                return a_;
            }
            // parents differ and can't merge them. Just pack together
            // into array; can't merge.
            // ax + by = [ax,by]
            const payloads: number[] = [a.returnState, b.returnState];
            let parents: PredictionContext[] = [a.parent, b.parent];
            if (a.returnState > b.returnState) { // sort by payload
                payloads[0] = b.returnState;
                payloads[1] = a.returnState;
                parents = [b.parent, a.parent];
            }
            const a_: PredictionContext = new ArrayPredictionContext(parents, payloads);
            if (mergeCache !== undefined) {
                mergeCache.put(a, b, a_);
            }

            return a_;
        }
    };

    /**
     * Handle case where at least one of {@code a} or {@code b} is
     * {@link #EMPTY}. In the following diagrams, the symbol {@code $} is used
     * to represent {@link #EMPTY}.
     *
     * <h2>Local-Context Merges</h2>
     *
     * <p>These local-context merge operations are used when {@code rootIsWildcard}
     * is true.</p>
     *
     * <p>{@link #EMPTY} is superset of any graph; return {@link #EMPTY}.<br>
     * <embed src="images/LocalMerge_EmptyRoot.svg" type="image/svg+xml"/></p>
     *
     * <p>{@link #EMPTY} and anything is {@code #EMPTY}, so merged parent is
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
     * <p>Must keep all contexts; {@link #EMPTY} in array is a special value (and
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
    public static mergeRoot = (a: SingletonPredictionContext,
        b: SingletonPredictionContext,
        rootIsWildcard: boolean): PredictionContext | undefined => {
        if (rootIsWildcard) {
            if (a === PredictionContext.EMPTY) {
                return PredictionContext.EMPTY;
            }
            // * + b = *
            if (b === PredictionContext.EMPTY) {
                return PredictionContext.EMPTY;
            }
            // a + * = *
        } else {
            if (a === PredictionContext.EMPTY && b === PredictionContext.EMPTY) {
                return PredictionContext.EMPTY;
            }
            // $ + $ = $
            if (a === PredictionContext.EMPTY) { // $ + x = [x,$]
                const payloads: number[] = [b.returnState, PredictionContext.EMPTY_RETURN_STATE];
                const parents: PredictionContext[] = [b.parent, undefined];
                const joined: PredictionContext =
                    new ArrayPredictionContext(parents, payloads);

                return joined;
            }
            if (b === PredictionContext.EMPTY) { // x + $ = [x,$] ($ is always last if present)
                const payloads: number[] = [a.returnState, PredictionContext.EMPTY_RETURN_STATE];
                const parents: PredictionContext[] = [a.parent, undefined];
                const joined: PredictionContext =
                    new ArrayPredictionContext(parents, payloads);

                return joined;
            }
        }

        return undefined;
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
     * @returns The merged prediction context.
     */
    public static mergeArrays = (
        a: ArrayPredictionContext,
        b: ArrayPredictionContext,
        rootIsWildcard: boolean,
        mergeCache: DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext>): PredictionContext => {
        if (mergeCache !== undefined) {
            let previous: PredictionContext = mergeCache.get(a, b);
            if (previous !== undefined) {
                return previous;
            }

            previous = mergeCache.get(b, a);
            if (previous !== undefined) {
                return previous;
            }

        }

        // merge sorted payloads a + b => M
        let i = 0; // walks a
        let j = 0; // walks b
        let k = 0; // walks target M array

        let mergedReturnStates: number[] =
            new Array<number>(a.returnStates.length + b.returnStates.length);
        let mergedParents: PredictionContext[] =
            new Array<PredictionContext>(a.returnStates.length + b.returnStates.length);
        // walk and merge to yield mergedParents, mergedReturnStates
        while (i < a.returnStates.length && j < b.returnStates.length) {
            const a_parent: PredictionContext = a.parents[i];
            const b_parent: PredictionContext = b.parents[j];
            if (a.returnStates[i] === b.returnStates[j]) {
                // same payload (stack tops are equal), must yield merged singleton
                const payload: number = a.returnStates[i];
                // $+$ = $
                const both$: boolean = payload === PredictionContext.EMPTY_RETURN_STATE &&
                    a_parent === undefined && b_parent === undefined;
                const ax_ax: boolean = (a_parent !== undefined && b_parent !== undefined) &&
                    a_parent.equals(b_parent); // ax+ax -> ax
                if (both$ || ax_ax) {
                    mergedParents[k] = a_parent; // choose left
                    mergedReturnStates[k] = payload;
                } else { // ax+ay -> a'[x,y]
                    const mergedParent: PredictionContext =
                        PredictionContext.merge(a_parent, b_parent, rootIsWildcard, mergeCache);
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
                if (mergeCache !== undefined) {
                    mergeCache.put(a, b, a_);
                }

                return a_;
            }
            mergedParents = java.util.Arrays.copyOf(mergedParents, k);
            mergedReturnStates = java.util.Arrays.copyOf(mergedReturnStates, k);
        }

        const M: PredictionContext =
            new ArrayPredictionContext(mergedParents, mergedReturnStates);

        // if we created same array as a or b, return that instead
        // TODO: track whether this is possible above during merge sort for speed
        if (M.equals(a)) {
            if (mergeCache !== undefined) {
                mergeCache.put(a, b, a);
            }

            return a;
        }
        if (M.equals(b)) {
            if (mergeCache !== undefined) {
                mergeCache.put(a, b, b);
            }

            return b;
        }

        PredictionContext.combineCommonParents(mergedParents);

        if (mergeCache !== undefined) {
            mergeCache.put(a, b, M);
        }

        return M;
    };

    /**
     * Make pass over all <em>M</em> {@code parents}; merge any {@code equals()}
     * ones.
     *
     * @param parents
     */
    protected static combineCommonParents = (parents: PredictionContext[]): void => {
        const uniqueParents: Map<PredictionContext, PredictionContext> =
            new java.util.HashMap<PredictionContext, PredictionContext>();

        for (const parent of parents) {
            if (!uniqueParents.has(parent)) { // don't replace
                uniqueParents.set(parent, parent);
            }
        }

        for (let p = 0; p < parents.length; p++) {
            parents[p] = uniqueParents.get(parents[p]);
        }
    };

    public static toDOTString = (context: PredictionContext): string => {
        if (context === undefined) {
            return "";
        }

        const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
        buf.append("digraph G {\n");
        buf.append("rankdir=LR;\n");

        const nodes: java.util.List<PredictionContext> = PredictionContext.getAllContextNodes(context);
        java.util.Collections.sort(nodes, new class extends java.util.Comparator<PredictionContext> {
            public compare = (o1: PredictionContext, o2: PredictionContext): number => {
                return o1.id - o2.id;
            };
        }());

        for (const current of nodes) {
            if (current instanceof SingletonPredictionContext) {
                const s = String(current.id);
                buf.append("  s").append(s);
                let returnState = String(current.getReturnState(0));
                if (current instanceof EmptyPredictionContext) {
                    returnState = "$";
                }

                buf.append(" [label=\"").append(returnState).append("\"];\n");
                continue;
            }
            const arr: ArrayPredictionContext = current as ArrayPredictionContext;
            buf.append("  s").append(arr.id);
            buf.append(" [shape=box, label=\"");
            buf.append("[");
            let first = true;
            for (const inv of arr.returnStates) {
                if (!first) {
                    buf.append(", ");
                }

                if (inv === PredictionContext.EMPTY_RETURN_STATE) {
                    buf.append("$");
                } else {
                    buf.append(inv);
                }

                first = false;
            }
            buf.append("]");
            buf.append("\"];\n");
        }

        for (const current of nodes) {
            if (current === PredictionContext.EMPTY) {
                continue;
            }

            for (let i = 0; i < current.size(); i++) {
                if (current.getParent(i) === undefined) {
                    continue;
                }

                const s = String(current.id);
                buf.append("  s").append(s);
                buf.append("->");
                buf.append("s");
                buf.append(current.getParent(i).id);
                if (current.size() > 1) {
                    buf.append(" [label=\"parent[" + i + "]\"];\n");
                } else {
                    buf.append(";\n");
                }

            }
        }

        buf.append("}\n");

        return buf.toString();
    };

    // From Sam
    public static getCachedContext = (
        context: PredictionContext,
        contextCache: PredictionContextCache,
        visited: IdentityHashMap<PredictionContext, PredictionContext>): PredictionContext => {
        if (context.isEmpty()) {
            return context;
        }

        let existing: PredictionContext = visited.get(context);
        if (existing !== undefined) {
            return existing;
        }

        existing = contextCache.get(context);
        if (existing !== undefined) {
            visited.put(context, existing);

            return existing;
        }

        let changed = false;
        let parents: PredictionContext[] = new Array<PredictionContext>(context.size());
        for (let i = 0; i < parents.length; i++) {
            const parent = PredictionContext.getCachedContext(context.getParent(i), contextCache, visited);
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
            updated = PredictionContext.EMPTY;
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

    //	// extra structures, but cut/paste/morphed works, so leave it.
    //	// seems to do a breadth-first walk
    //	public static List<PredictionContext> getAllNodes(PredictionContext context) {
    //		Map<PredictionContext, PredictionContext> visited =
    //			new IdentityHashMap<PredictionContext, PredictionContext>();
    //		Deque<PredictionContext> workList = new ArrayDeque<PredictionContext>();
    //		workList.add(context);
    //		visited.put(context, context);
    //		List<PredictionContext> nodes = new ArrayList<PredictionContext>();
    //		while (!workList.isEmpty()) {
    //			PredictionContext current = workList.pop();
    //			nodes.add(current);
    //			for (int i = 0; i < current.size(); i++) {
    //				PredictionContext parent = current.getParent(i);
    //				if ( parent!=null && visited.put(parent, parent) == null) {
    //					workList.push(parent);
    //				}
    //			}
    //		}
    //		return nodes;
    //	}

    // ter's recursive version of Sam's getAllNodes()
    public static getAllContextNodes = (context: PredictionContext): java.util.List<PredictionContext> => {
        const nodes: java.util.List<PredictionContext> = new java.util.ArrayList<PredictionContext>();
        const visited: Map<PredictionContext, PredictionContext> =
            new IdentityHashMap<PredictionContext, PredictionContext>();
        PredictionContext.getAllContextNodes_(context, nodes, visited);

        return nodes;
    };

    public static getAllContextNodes_ = (context: PredictionContext,
        nodes: java.util.List<PredictionContext>,
        visited: Map<PredictionContext, PredictionContext>): void => {
        if (context === undefined || visited.has(context)) {
            return;
        }

        visited.set(context, context);
        nodes.add(context);
        for (let i = 0; i < context.size(); i++) {
            PredictionContext.getAllContextNodes_(context.getParent(i), nodes, visited);
        }
    };

    public toStrings(recognizer: Recognizer<unknown, ATNSimulator>, currentState: number): string[];
    public toStrings(recognizer: Recognizer<unknown, ATNSimulator>, stop: PredictionContext,
        currentState: number): string[];
    public toStrings(recognizer: Recognizer<unknown, ATNSimulator>, currentStateOrStop: number | PredictionContext,
        currentState?: number): string[] {
        if (typeof currentStateOrStop === "number" && currentState === undefined) {
            const currentState = currentStateOrStop;

            return this.toStrings(recognizer, PredictionContext.EMPTY, currentState);
        } else {
            const stop = currentStateOrStop as PredictionContext;
            const result: java.util.List<string> = new java.util.ArrayList<string>();

            outer:
            for (let perm = 0; ; perm++) {
                let offset = 0;
                let last = true;
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                let p: PredictionContext = this;
                let stateNumber: number = currentState;
                const localBuffer: java.lang.StringBuilder = new java.lang.StringBuilder();
                localBuffer.append("[");
                while (!p.isEmpty() && p !== stop) {
                    let index = 0;
                    if (p.size() > 0) {
                        let bits = 1;
                        while ((1 << bits) < p.size()) {
                            bits++;
                        }

                        const mask: number = (1 << bits) - 1;
                        index = (perm >> offset) & mask;
                        last &&= index >= p.size() - 1;
                        if (index >= p.size()) {
                            continue outer;
                        }
                        offset += bits;
                    }

                    if (recognizer !== undefined) {
                        if (localBuffer.length > 1) {
                            // first char is '[', if more than that this isn't the first rule
                            localBuffer.append(" ");
                        }

                        const atn: ATN = recognizer.getATN();
                        const s: ATNState = atn.states.get(stateNumber);
                        const ruleName: string = recognizer.getRuleNames()[s.ruleIndex];
                        localBuffer.append(ruleName);
                    } else {
                        if (p.getReturnState(index) !== PredictionContext.EMPTY_RETURN_STATE) {
                            if (!p.isEmpty()) {
                                if (localBuffer.length > 1) {
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
                localBuffer.append("]");
                result.add(localBuffer.toString());

                if (last) {
                    break;
                }
            }

            return result.toArray(new Array<string>(0));
        }
    }
}
