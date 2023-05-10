/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable max-classes-per-file */

import { java, S } from "jree";

import { ATN } from "./ATN";
import { ATNConfig } from "./ATNConfig";
import { ATNSimulator } from "./ATNSimulator";
import { ATNState } from "./ATNState";
import { PredictionContext } from "./PredictionContext";
import { SemanticContext } from "./SemanticContext";
import { Array2DHashSet, DoubleKeyMap, EqualityComparator } from "../misc";

/**
 * Specialized {@link Set}{@code <}{@link ATNConfig}{@code >} that can track
 * info about the set, with support for combining similar configurations using a
 * graph-structured stack.
 */
export class ATNConfigSet extends java.util.Set<ATNConfig | null> {
    public static readonly ConfigEqualityComparator =
        class ConfigEqualityComparator implements EqualityComparator<ATNConfig> {
            public static readonly INSTANCE = new ConfigEqualityComparator();

            public hashCode = (o: ATNConfig): number => {
                let hashCode = 7;
                hashCode = 31 * hashCode + o.state.stateNumber;
                hashCode = 31 * hashCode + o.alt;
                hashCode = 31 * hashCode + o.semanticContext.hashCode();

                return hashCode;
            };

            public equals = (a: ATNConfig | null, b: ATNConfig | null): boolean => {
                if (a === b) {
                    return true;
                }

                if (!a || !b) {
                    return false;
                }

                return a.state.stateNumber === b.state.stateNumber
                    && a.alt === b.alt
                    && a.semanticContext.equals(b.semanticContext);
            };
        };

    /**
     * All configs but hashed by (s, i, _, pi) not including context. Wiped out
     * when we go readonly as this set becomes a DFA state.
     */
    public configLookup: ATNConfigSet.AbstractConfigHashSet | null;

    /** Track the elements as they are added to the set; supports get(i) */
    public readonly configs = new java.util.ArrayList<ATNConfig>(7);

    // TODO: these fields make me pretty uncomfortable but nice to pack up info together, saves recomputation
    // TODO: can we track conflicts as they are added to save scanning configs later?
    public uniqueAlt = 0;

    // Used in parser and lexer. In lexer, it indicates we hit a pred
    // while computing a closure operation.  Don't make a DFA state from this.
    public hasSemanticContext = false;
    public dipsIntoOuterContext = false;

    /**
     * Indicates that this configuration set is part of a full context
     *  LL prediction. It will be used to determine how to merge $. With SLL
     *  it's a wildcard whereas it is not for LL context merge.
     */
    public readonly fullCtx: boolean;

    /**
     * Currently this is only used when we detect SLL conflict; this does
     *  not necessarily represent the ambiguous alternatives. In fact,
     *  I should also point out that this seems to include predicated alternatives
     *  that have predicates that evaluate to false. Computed in computeTargetState().
     */
    public conflictingAlts: java.util.BitSet | null = null;

    /**
     * Indicates that the set of configurations is read-only. Do not
     *  allow any code to manipulate the set; DFA states will point at
     *  the sets and they must not change. This does not protect the other
     *  fields; in particular, conflictingAlts is set after
     *  we've made this readonly.
     */
    protected readonly = false;

    private cachedHashCode = -1;

    public constructor(fullCtx?: boolean);
    public constructor(old: ATNConfigSet);
    public constructor(fullCtxOrOld?: boolean | ATNConfigSet) {
        super();

        this.configLookup = new ATNConfigSet.ConfigHashSet();
        if (fullCtxOrOld === undefined || typeof fullCtxOrOld === "boolean") {
            this.fullCtx = fullCtxOrOld ?? true;
        } else {
            const old = fullCtxOrOld;
            this.fullCtx = old.fullCtx;
            this.addAll(old);
            this.uniqueAlt = old.uniqueAlt;
            this.conflictingAlts = old.conflictingAlts;
            this.hasSemanticContext = old.hasSemanticContext;
            this.dipsIntoOuterContext = old.dipsIntoOuterContext;
        }
    }

    /**
     * Adding a new config means merging contexts with existing configs for
     * {@code (s, i, pi, _)}, where {@code s} is the
     * {@link ATNConfig#state}, {@code i} is the {@link ATNConfig#alt}, and
     * {@code pi} is the {@link ATNConfig#semanticContext}. We use
     * {@code (s,i,pi)} as key.
     *
     * <p>This method updates {@link #dipsIntoOuterContext} and
     * {@link #hasSemanticContext} when necessary.</p>
     *
     * @param config tbd
     * @param mergeCache tbd
     *
     * @returns tbd
     */
    public override add(config: ATNConfig,
        mergeCache?: DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext> | null): boolean {
        if (this.readonly || this.configLookup === null) {
            throw new java.lang.IllegalStateException(S`This set is readonly`);
        }

        if (config.semanticContext !== SemanticContext.Empty) {
            this.hasSemanticContext = true;
        }

        if (config.getOuterContextDepth() > 0) {
            this.dipsIntoOuterContext = true;
        }

        const existing = this.configLookup.getOrAdd(config);
        if (existing === config) { // we added this new one
            this.cachedHashCode = -1;
            this.configs.add(config);  // track order here

            return true;
        }

        // a previous (s,i,pi,_), merge with it and save result
        const rootIsWildcard = !this.fullCtx;
        const merged = PredictionContext.merge(existing.context, config.context, rootIsWildcard, mergeCache ?? null);
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

    /** @returns a List holding list of configs */
    public elements = (): java.util.List<ATNConfig> => {
        return this.configs;
    };

    public getStates = (): java.util.Set<ATNState> => {
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
      @returns the set of represented alternatives in this configuration set
     */
    public getAlts = (): java.util.BitSet => {
        const alts = new java.util.BitSet();
        for (const config of this.configs) {
            alts.set(config.alt);
        }

        return alts;
    };

    public getPredicates = (): java.util.List<SemanticContext> | null => {
        const preds: java.util.List<SemanticContext> = new java.util.ArrayList<SemanticContext>();
        for (const c of this.configs) {
            if (c.semanticContext !== SemanticContext.Empty) {
                preds.add(c.semanticContext);
            }
        }

        return preds;
    };

    public get = (i: number): ATNConfig => {
        return this.configs.get(i);
    };

    public optimizeConfigs = (interpreter: ATNSimulator): void => {
        if (this.readonly || this.configLookup === null) {
            throw new java.lang.IllegalStateException(S`This set is readonly`);
        }

        if (this.configLookup.isEmpty()) {
            return;
        }

        for (const config of this.configs) {
            config.context = interpreter.getCachedContext(config.context);
        }
    };

    public override addAll = (coll: Omit<java.util.Collection<ATNConfig | null>, "add">): boolean => {
        for (const c of coll) {
            this.add(c!, null);
        }

        return false;
    };

    public override equals = (other: unknown): boolean => {
        if (other === this) {
            return true;
        }

        if (other === null || !(other instanceof ATNConfigSet)) {
            return false;
        }

        const same = this.configs !== null &&
            this.configs.equals(other.configs) &&  // includes stack context
            this.fullCtx === other.fullCtx &&
            this.uniqueAlt === other.uniqueAlt &&
            this.conflictingAlts === other.conflictingAlts &&
            this.hasSemanticContext === other.hasSemanticContext &&
            this.dipsIntoOuterContext === other.dipsIntoOuterContext;

        return same;
    };

    public override hashCode = (): number => {
        if (this.isReadonly()) {
            if (this.cachedHashCode === -1) {
                this.cachedHashCode = this.configs.hashCode();
            }

            return this.cachedHashCode;
        }

        return this.configs.hashCode();
    };

    public override size = (): number => {
        return this.configs.size();
    };

    public override isEmpty = (): boolean => {
        return this.configs.isEmpty();
    };

    public override contains = (o: ATNConfig): boolean => {
        if (this.configLookup === null) {
            throw new java.lang.UnsupportedOperationException(S`This method is not implemented for readonly sets.`);
        }

        return this.configLookup.contains(o);
    };

    public containsFast = (obj: ATNConfig): boolean => {
        if (this.configLookup === null) {
            throw new java.lang.UnsupportedOperationException(S`This method is not implemented for readonly sets.`);
        }

        return this.configLookup.containsFast(obj);
    };

    public override iterator = (): java.util.Iterator<ATNConfig> => {
        return this.configs.iterator();
    };

    public *[Symbol.iterator](): IterableIterator<ATNConfig> {
        yield* this.configs;
    }

    public override clear = (): void => {
        if (this.readonly || this.configLookup === null) {
            throw new java.lang.IllegalStateException(S`This set is readonly`);
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
        this.configLookup = null; // can't mod, no need for lookup cache
    };

    public override toString = (): java.lang.String => {
        const buf = new java.lang.StringBuilder();
        buf.append(this.elements().toString() ?? S``);
        if (this.hasSemanticContext) {
            buf.append(S`,hasSemanticContext=`).append(this.hasSemanticContext);
        }

        if (this.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
            buf.append(S`,uniqueAlt=`).append(this.uniqueAlt);
        }

        if (this.conflictingAlts) {
            buf.append(S`,conflictingAlts=`).append(this.conflictingAlts);
        }

        if (this.dipsIntoOuterContext) {
            buf.append(S`,dipsIntoOuterContext`);
        }

        return buf.toString();
    };

    public override toArray(): Array<ATNConfig | null>;
    public override toArray<T extends ATNConfig>(a: T[]): T[];
    public override toArray<T extends ATNConfig>(a?: T[]): Array<ATNConfig | null> | T[] | null {
        if (a === undefined) {
            return this.configLookup?.toArray() ?? null;
        }

        return this.configLookup?.toArray(a) ?? null;
    }

    public override remove = (_o: java.lang.Object): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    public override containsAll = (_c: java.util.Collection<ATNConfig>): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    public override retainAll = (_c: java.util.Collection<ATNConfig>): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    public override removeAll = (_c: java.util.Collection<ATNConfig>): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace ATNConfigSet {
    export type ConfigEqualityComparator = InstanceType<typeof ATNConfigSet.ConfigEqualityComparator>;

    export class AbstractConfigHashSet extends Array2DHashSet<ATNConfig> {
        public constructor(comparator: EqualityComparator<ATNConfig>);
        public constructor(comparator: EqualityComparator<ATNConfig>, initialCapacity: number,
            initialBucketCapacity: number);
        public constructor(comparator: EqualityComparator<ATNConfig>, initialCapacity?: number,
            initialBucketCapacity?: number) {
            super(comparator, initialCapacity ?? 16, initialBucketCapacity ?? 2);
        }

        public override readonly asElementType = (o: unknown): ATNConfig | null => {
            if (!(o instanceof ATNConfig)) {
                return null;
            }

            return o;
        };

        public override readonly createBuckets = (capacity: number): Array<Array<ATNConfig | null> | null> => {
            const result = new Array<Array<ATNConfig | null> | null>(capacity);
            result.fill(null);

            return result;
        };

        public override readonly createBucket = (capacity: number): Array<ATNConfig | null> => {
            const result = new Array<ATNConfig | null>(capacity);
            result.fill(null);

            return result;
        };
    }

    /**
     * The reason that we need this is because we don't want the hash map to use
     * the standard hash code and equals. We need all configurations with the same
     * {@code (s,i,_,semctx)} to be equal. Unfortunately, this key effectively doubles
     * the number of objects associated with ATNConfigs. The other solution is to
     * use a hash table that lets us specify the equals/hash code operation.
     */
    export class ConfigHashSet extends ATNConfigSet.AbstractConfigHashSet {
        public constructor() {
            super(ATNConfigSet.ConfigEqualityComparator.INSTANCE);
        }
    }

}
