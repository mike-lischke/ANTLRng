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

import { java } from "../../../../../../lib/java/java";

import { ATN } from "./ATN";
import { ATNConfig } from "./ATNConfig";
import { ATNSimulator } from "./ATNSimulator";
import { ATNState } from "./ATNState";
import { PredictionContext } from "./PredictionContext";
import { SemanticContext } from "./SemanticContext";
import { EqualityComparator } from "../misc/EqualityComparator";
import { Array2DHashSet } from "../misc/Array2DHashSet";
import { DoubleKeyMap } from "../misc/DoubleKeyMap";
import { BitSet } from "../support";

/**
 * Specialized {@link Set}{@code <}{@link ATNConfig}{@code >} that can track
 * info about the set, with support for combining similar configurations using a
 * graph-structured stack.
 */
export class ATNConfigSet extends java.util.HashSet<ATNConfig> {
    /**
     * Indicates that the set of configurations is read-only. Do not
     *  allow any code to manipulate the set; DFA states will point at
     *  the sets and they must not change. This does not protect the other
     *  fields; in particular, conflictingAlts is set after
     *  we've made this readonly.
     */
    protected readonly = false;

    /**
     * All configs but hashed by (s, i, _, pi) not including context. Wiped out
     * when we go readonly as this set becomes a DFA state.
     */
    public configLookup?: ATNConfigSet.AbstractConfigHashSet;

    /** Track the elements as they are added to the set; supports get(i) */
    public readonly configs?: java.util.ArrayList<ATNConfig> = new java.util.ArrayList<ATNConfig>(7);

    // TODO: these fields make me pretty uncomfortable but nice to pack up info together, saves recomputation
    // TODO: can we track conflicts as they are added to save scanning configs later?
    public uniqueAlt: number;
    /**
     * Currently this is only used when we detect SLL conflict; this does
     *  not necessarily represent the ambiguous alternatives. In fact,
     *  I should also point out that this seems to include predicated alternatives
     *  that have predicates that evaluate to false. Computed in computeTargetState().
     */
    protected conflictingAlts?: BitSet;

    // Used in parser and lexer. In lexer, it indicates we hit a pred
    // while computing a closure operation.  Don't make a DFA state from this.
    public hasSemanticContext: boolean;
    public dipsIntoOuterContext: boolean;

    /**
     * Indicates that this configuration set is part of a full context
     *  LL prediction. It will be used to determine how to merge $. With SLL
     *  it's a wildcard whereas it is not for LL context merge.
     */
    public readonly fullCtx: boolean;

    private cachedHashCode = -1;

    public constructor();
    public constructor(fullCtx: boolean);
    public constructor(old: ATNConfigSet);
    public constructor(fullCtxOrOld?: boolean | ATNConfigSet) {
        super();

        if (fullCtxOrOld === undefined) {
            fullCtxOrOld = true;
        }

        this.configLookup = new ATNConfigSet.ConfigHashSet();
        if (typeof fullCtxOrOld === "boolean") {
            this.fullCtx = fullCtxOrOld;
        } else {
            this.fullCtx = fullCtxOrOld.fullCtx;

            const old = fullCtxOrOld;
            this.addAll(old);
            this.uniqueAlt = old.uniqueAlt;
            this.conflictingAlts = old.conflictingAlts;
            this.hasSemanticContext = old.hasSemanticContext;
            this.dipsIntoOuterContext = old.dipsIntoOuterContext;
        }
    }

    public add(config: ATNConfig): boolean;
    /**
     * Adding a new config means merging contexts with existing configs for
     * {@code (s, i, pi, _)}, where {@code s} is the
     * {@link ATNConfig#state}, {@code i} is the {@link ATNConfig#alt}, and
     * {@code pi} is the {@link ATNConfig#semanticContext}. We use
     * {@code (s,i,pi)} as key.
     *
     * <p>This method updates {@link #dipsIntoOuterContext} and
     * {@link #hasSemanticContext} when necessary.</p>
     */
    public add(
        config: ATNConfig,
        mergeCache: DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext>): boolean;

    public add(config: ATNConfig, mergeCache?: DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext>): boolean {
        if (mergeCache === undefined) {
            return this.add(config, undefined);
        } else {
            if (this.readonly) {
                throw new java.lang.IllegalStateException("This set is readonly");
            }

            if (config.semanticContext !== SemanticContext.NONE) {
                this.hasSemanticContext = true;
            }
            if (config.getOuterContextDepth() > 0) {
                this.dipsIntoOuterContext = true;
            }
            const existing: ATNConfig = this.configLookup.getOrAdd(config);
            if (existing === config) { // we added this new one
                this.cachedHashCode = -1;
                this.configs.add(config);  // track order here

                return true;
            }
            // a previous (s,i,pi,_), merge with it and save result
            const rootIsWildcard = !this.fullCtx;
            const merged: PredictionContext =
                PredictionContext.merge(existing.context, config.context, rootIsWildcard, mergeCache);
            // no need to check for existing.context, config.context in cache
            // since only way to create new graphs is "call rule" and here. We
            // cache at both places.
            existing.reachesIntoOuterContext =
                Math.max(existing.reachesIntoOuterContext, config.reachesIntoOuterContext);

            // make sure to preserve the precedence filter suppression during the merge
            if (config.isPrecedenceFilterSuppressed()) {
                existing.setPrecedenceFilterSuppressed(true);
            }

            existing.context = merged; // replace context; no need to alt mapping

            return true;
        }

    }

    /** @returns a list holding list of configs */
    public elements = (): java.util.List<ATNConfig> => {
        return this.configs;
    };

    public getStates = (): java.util.HashSet<ATNState> => {
        const states = new java.util.HashSet<ATNState>();
        for (const c of this.configs) {
            states.add(c.state);
        }

        return states;
    };

    /**
     * Gets the complete set of represented alternatives for the configuration
     * set.
     *
     * @returns the set of represented alternatives in this configuration set
     */
    public getAlts = (): BitSet => {
        const alts: BitSet = new BitSet();
        for (const config of this.configs) {
            alts.set(config.alt);
        }

        return alts;
    };

    public getPredicates = (): java.util.List<SemanticContext> => {
        const preds: java.util.List<SemanticContext> = new java.util.ArrayList<SemanticContext>();
        for (const c of this.configs) {
            if (c.semanticContext !== SemanticContext.NONE) {
                preds.add(c.semanticContext);
            }
        }

        return preds;
    };

    public get = (i: number): ATNConfig => {
        return this.configs.get(i);
    };

    public optimizeConfigs = (interpreter: ATNSimulator): void => {
        if (this.readonly) {
            throw new java.lang.IllegalStateException("This set is readonly");
        }

        if (this.configLookup.isEmpty()) {
            return;
        }

        for (const config of this.configs) {
            //			int before = PredictionContext.getAllContextNodes(config.context).size();
            config.context = interpreter.getCachedContext(config.context);
            //			int after = PredictionContext.getAllContextNodes(config.context).size();
            //			System.out.println("configs "+before+"->"+after);
        }
    };

    public addAll = (coll: java.util.Collection<ATNConfig>): boolean => {
        for (const c of coll) {
            this.add(c);
        }

        return false;
    };

    public equals = (o: object): boolean => {
        if (o === this) {
            return true;
        } else {
            if (!(o instanceof ATNConfigSet)) {
                return false;
            }
        }

        //		System.out.print("equals " + this + ", " + o+" = ");
        const other: ATNConfigSet = o;
        const same: boolean = this.configs !== undefined &&
            this.configs.equals(other.configs) &&  // includes stack context
            this.fullCtx === other.fullCtx &&
            this.uniqueAlt === other.uniqueAlt &&
            this.conflictingAlts === other.conflictingAlts &&
            this.hasSemanticContext === other.hasSemanticContext &&
            this.dipsIntoOuterContext === other.dipsIntoOuterContext;

        //		System.out.println(same);
        return same;
    };

    public hashCode = (): number => {
        if (this.isReadonly()) {
            if (this.cachedHashCode === -1) {
                this.cachedHashCode = this.configs.hashCode();
            }

            return this.cachedHashCode;
        }

        return this.configs.hashCode();
    };

    public size = (): number => {
        return this.configs.size();
    };

    public isEmpty = (): boolean => {
        return this.configs.isEmpty();
    };

    public contains = (o: object): boolean => {
        if (this.configLookup === undefined) {
            throw new java.lang.UnsupportedOperationException("This method is not implemented for readonly sets.");
        }

        return this.configLookup.contains(o);
    };

    public containsFast = (obj: ATNConfig): boolean => {
        if (this.configLookup === undefined) {
            throw new java.lang.UnsupportedOperationException("This method is not implemented for readonly sets.");
        }

        return this.configLookup.containsFast(obj);
    };

    public iterator = (): Iterator<ATNConfig> => {
        return this.configs.iterator();
    };

    public clear = (): void => {
        if (this.readonly) {
            throw new java.lang.IllegalStateException("This set is readonly");
        }

        this.configs.clear();
        this.cachedHashCode = -1;
        this.configLookup.clear();
    };

    public isReadonly = (): boolean => {
        return this.readonly;
    };

    public setReadonly = (readonly: boolean): void => {
        this.readonly = readonly;
        this.configLookup = undefined; // can't mod, no need for lookup cache
    };

    public toString = (): string => {
        const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
        buf.append(this.elements().toString());
        if (this.hasSemanticContext) {
            buf.append(",hasSemanticContext=").append(this.hasSemanticContext);
        }

        if (this.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
            buf.append(",uniqueAlt=").append(this.uniqueAlt);
        }

        if (this.conflictingAlts !== undefined) {
            buf.append(",conflictingAlts=").append(this.conflictingAlts);
        }

        if (this.dipsIntoOuterContext) {
            buf.append(",dipsIntoOuterContext");
        }

        return buf.toString();
    };

    // satisfy interface

    public toArray(): ATNConfig[];
    public toArray<T extends ATNConfig>(a: T[]): T[];
    public toArray<T extends ATNConfig>(a?: T[]): ATNConfig[] | T[] {
        if (a === undefined) {
            return this.configLookup.toArray();
        } else {
            return this.configLookup.toArray(a);
        }

    }

    public remove = (_o: object): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    public containsAll = (_c: java.util.Collection<unknown>): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    public retainAll = (_c: java.util.Collection<unknown>): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    public removeAll = (_c: java.util.Collection<unknown>): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };
}

export namespace ATNConfigSet {
    export class AbstractConfigHashSet extends Array2DHashSet<ATNConfig> {

        public constructor(comparator: EqualityComparator<ATNConfig>);
        public constructor(comparator: EqualityComparator<ATNConfig>, initialCapacity: number, initialBucketCapacity: number);
        public constructor(comparator: EqualityComparator<ATNConfig>, initialCapacity?: number, initialBucketCapacity?: number) {
            super(comparator, initialCapacity ?? 16, initialBucketCapacity ?? 2);
        }

        protected readonly asElementType = (o: unknown): ATNConfig => {
            if (!(o instanceof ATNConfig)) {
                return undefined;
            }

            return o;
        };

        protected readonly createBuckets = (capacity: number): ATNConfig[][] => {
            return new Array<ATNConfig[]>(capacity);
        };

        protected readonly createBucket = (capacity: number): ATNConfig[] => {
            return new Array<ATNConfig>(capacity);
        };

    }

    /**
     * The reason that we need this is because we don't want the hash map to use
     * the standard hash code and equals. We need all configurations with the same
     * {@code (s,i,_,semctx)} to be equal. Unfortunately, this key effectively doubles
     * the number of objects associated with ATNConfigs. The other solution is to
     * use a hash table that lets us specify the equals/hashCode operation.
     */
    export class ConfigHashSet extends AbstractConfigHashSet {
        public constructor() {
            super(ATNConfigSet.ConfigEqualityComparator.INSTANCE);
        }
    }

    export class ConfigEqualityComparator extends EqualityComparator<ATNConfig> {
        public static readonly INSTANCE = new ConfigEqualityComparator();

        public hashCode = (o: ATNConfig): number => {
            let hashCode = 7;
            hashCode = 31 * hashCode + o.state.stateNumber;
            hashCode = 31 * hashCode + o.alt;
            hashCode = 31 * hashCode + o.semanticContext.hashCode();

            return hashCode;
        };

        public equals = (a: ATNConfig, b: ATNConfig): boolean => {
            if (a === b) {
                return true;
            }

            if (a === undefined || b === undefined) {
                return false;
            }

            return a.state.stateNumber === b.state.stateNumber
                && a.alt === b.alt
                && a.semanticContext.equals(b.semanticContext);
        };
    }

}

