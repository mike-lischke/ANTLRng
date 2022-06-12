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



import { java } from "../../../../../../lib/java/java";
import { ATN } from "./ATN";
import { ATNConfig } from "./ATNConfig";
import { ATNSimulator } from "./ATNSimulator";
import { ATNState } from "./ATNState";
import { PredictionContext } from "./PredictionContext";
import { SemanticContext } from "./SemanticContext";
import { AbstractEqualityComparator } from "../misc/AbstractEqualityComparator";
import { Array2DHashSet } from "../misc/Array2DHashSet";
import { DoubleKeyMap } from "../misc/DoubleKeyMap";




/**
 * Specialized {@link Set}{@code <}{@link ATNConfig}{@code >} that can track
 * info about the set, with support for combining similar configurations using a
 * graph-structured stack.
 */
export  class ATNConfigSet implements Set<ATNConfig> {
	/**
	 * The reason that we need this is because we don't want the hash map to use
	 * the standard hash code and equals. We need all configurations with the same
	 * {@code (s,i,_,semctx)} to be equal. Unfortunately, this key effectively doubles
	 * the number of objects associated with ATNConfigs. The other solution is to
	 * use a hash table that lets us specify the equals/hashcode operation.
	 */
	public static ConfigHashSet = class ConfigHashSet extends AbstractConfigHashSet {
		public constructor() {
			super(ConfigEqualityComparator.INSTANCE);
		}
	};


	public static readonly  ConfigEqualityComparator = class ConfigEqualityComparator extends AbstractEqualityComparator<ATNConfig> {
		public static readonly  INSTANCE?:  ConfigEqualityComparator = new  ConfigEqualityComparator();

		private constructor() {
		}

		public hashCode = (o: ATNConfig): number => {
			let  hashCode: number = 7;
			hashCode = 31 * hashCode + o.state.stateNumber;
			hashCode = 31 * hashCode + o.alt;
			hashCode = 31 * hashCode + o.semanticContext.hashCode();
	        return hashCode;
		}

		public equals = (a: ATNConfig, b: ATNConfig): boolean => {
			if ( a===b ) {
 return true;
}

			if ( a===undefined || b===undefined ) {
 return false;
}

			return a.state.stateNumber===b.state.stateNumber
				&& a.alt===b.alt
				&& a.semanticContext.equals(b.semanticContext);
		}
	};


	/** Indicates that the set of configurations is read-only. Do not
	 *  allow any code to manipulate the set; DFA states will point at
	 *  the sets and they must not change. This does not protect the other
	 *  fields; in particular, conflictingAlts is set after
	 *  we've made this readonly.
 	 */
	protected readonly:  boolean = false;

	/**
	 * All configs but hashed by (s, i, _, pi) not including context. Wiped out
	 * when we go readonly as this set becomes a DFA state.
	 */
	public configLookup?:  AbstractConfigHashSet;

	/** Track the elements as they are added to the set; supports get(i) */
	public readonly  configs?:  java.util.ArrayList<ATNConfig> = new  java.util.ArrayList<ATNConfig>(7);

	// TODO: these fields make me pretty uncomfortable but nice to pack up info together, saves recomputation
	// TODO: can we track conflicts as they are added to save scanning configs later?
	public uniqueAlt:  number;
	/** Currently this is only used when we detect SLL conflict; this does
	 *  not necessarily represent the ambiguous alternatives. In fact,
	 *  I should also point out that this seems to include predicated alternatives
	 *  that have predicates that evaluate to false. Computed in computeTargetState().
 	 */
	protected conflictingAlts?:  BitSet;

	// Used in parser and lexer. In lexer, it indicates we hit a pred
	// while computing a closure operation.  Don't make a DFA state from this.
	public hasSemanticContext:  boolean;
	public dipsIntoOuterContext:  boolean;

	/** Indicates that this configuration set is part of a full context
	 *  LL prediction. It will be used to determine how to merge $. With SLL
	 *  it's a wildcard whereas it is not for LL context merge.
	 */
	public readonly  fullCtx:  boolean;

	private cachedHashCode:  number = -1;
	public constructor();

	public constructor(fullCtx: boolean);

	public constructor(old: ATNConfigSet);
public constructor(fullCtxOrOld?: boolean | ATNConfigSet) {
const $this = (fullCtxOrOld?: boolean | ATNConfigSet): void => {
if (fullCtxOrOld === undefined) { $this(true); }
 else if (typeof fullCtxOrOld === "boolean") {
const fullCtx = fullCtxOrOld as boolean;
		this.configLookup = new  this.ConfigHashSet();
		this.fullCtx = fullCtx;
	}
 else  {
let old = fullCtxOrOld as ATNConfigSet;
		$this(old.fullCtx);
		this.addAll(old);
		this.uniqueAlt = old.uniqueAlt;
		this.conflictingAlts = old.conflictingAlts;
		this.hasSemanticContext = old.hasSemanticContext;
		this.dipsIntoOuterContext = old.dipsIntoOuterContext;
	}
};

$this(fullCtxOrOld);

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
		mergeCache: DoubleKeyMap<PredictionContext,PredictionContext,PredictionContext>): boolean;


	public add(config: ATNConfig, mergeCache?: DoubleKeyMap<PredictionContext,PredictionContext,PredictionContext>):  boolean {
if (mergeCache === undefined) {
		return this.add(config, undefined);
	}
 else 
	{
		if ( this.readonly ) {
 throw new  java.lang.IllegalStateException("This set is readonly");
}

		if ( config.semanticContext!==SemanticContext.NONE ) {
			this.hasSemanticContext = true;
		}
		if (config.getOuterContextDepth() > 0) {
			this.dipsIntoOuterContext = true;
		}
		let  existing: ATNConfig = this.configLookup.getOrAdd(config);
		if ( existing===config ) { // we added this new one
			this.cachedHashCode = -1;
			this.configs.add(config);  // track order here
			return true;
		}
		// a previous (s,i,pi,_), merge with it and save result
		let  rootIsWildcard: boolean = !this.fullCtx;
		let  merged: PredictionContext =
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


	/** Return a List holding list of configs */
    public elements = (): java.util.List<ATNConfig> => { return this.configs; }

	public getStates = (): Set<ATNState> => {
		let  states: Set<ATNState> = new  HashSet<ATNState>();
		for (let c of this.configs) {
			states.add(c.state);
		}
		return states;
	}

	/**
	 * Gets the complete set of represented alternatives for the configuration
	 * set.
	 *
	 * @return the set of represented alternatives in this configuration set
	 *
	 * @since 4.3
	 */

	public getAlts = (): BitSet => {
		let  alts: BitSet = new  BitSet();
		for (let config of this.configs) {
			alts.set(config.alt);
		}
		return alts;
	}

	public getPredicates = (): java.util.List<SemanticContext> => {
		let  preds: java.util.List<SemanticContext> = new  java.util.ArrayList<SemanticContext>();
		for (let c of this.configs) {
			if ( c.semanticContext!==SemanticContext.NONE ) {
				preds.add(c.semanticContext);
			}
		}
		return preds;
	}

	public get = (i: number): ATNConfig => { return this.configs.get(i); }

	public optimizeConfigs = (interpreter: ATNSimulator): void => {
		if ( this.readonly ) {
 throw new  java.lang.IllegalStateException("This set is readonly");
}

		if ( this.configLookup.isEmpty() ) {
 return;
}


		for (let config of this.configs) {
//			int before = PredictionContext.getAllContextNodes(config.context).size();
			config.context = interpreter.getCachedContext(config.context);
//			int after = PredictionContext.getAllContextNodes(config.context).size();
//			System.out.println("configs "+before+"->"+after);
		}
	}

	public addAll = (coll: java.util.Collection< ATNConfig>): boolean => {
		for (let c of coll) this.add(c);
		return false;
	}

	public equals = (o: object): boolean => {
		if (o === this) {
			return true;
		}
		else { if (!(o instanceof ATNConfigSet)) {
			return false;
		}
}


//		System.out.print("equals " + this + ", " + o+" = ");
		let  other: ATNConfigSet = o as ATNConfigSet;
		let  same: boolean = this.configs!==undefined &&
			this.configs.equals(other.configs) &&  // includes stack context
			this.fullCtx === other.fullCtx &&
			this.uniqueAlt === other.uniqueAlt &&
			this.conflictingAlts === other.conflictingAlts &&
			this.hasSemanticContext === other.hasSemanticContext &&
			this.dipsIntoOuterContext === other.dipsIntoOuterContext;

//		System.out.println(same);
		return same;
	}

	public hashCode = (): number => {
		if (this.isReadonly()) {
			if (this.cachedHashCode === -1) {
				this.cachedHashCode = this.configs.hashCode();
			}

			return this.cachedHashCode;
		}

		return this.configs.hashCode();
	}

	public size = (): number => {
		return this.configs.size();
	}

	public isEmpty = (): boolean => {
		return this.configs.isEmpty();
	}

	public contains = (o: object): boolean => {
		if (this.configLookup === undefined) {
			throw new  java.lang.UnsupportedOperationException("This method is not implemented for readonly sets.");
		}

		return this.configLookup.contains(o);
	}

	public containsFast = (obj: ATNConfig): boolean => {
		if (this.configLookup === undefined) {
			throw new  java.lang.UnsupportedOperationException("This method is not implemented for readonly sets.");
		}

		return this.configLookup.containsFast(obj);
	}

	public iterator = (): Iterator<ATNConfig> => {
		return this.configs.iterator();
	}

	public clear = (): void => {
		if ( this.readonly ) {
 throw new  java.lang.IllegalStateException("This set is readonly");
}

		this.configs.clear();
		this.cachedHashCode = -1;
		this.configLookup.clear();
	}

	public isReadonly = (): boolean => {
		return this.readonly;
	}

	public setReadonly = (readonly: boolean): void => {
		this.readonly = readonly;
		this.configLookup = undefined; // can't mod, no need for lookup cache
	}

	public toString = (): string => {
		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		buf.append(this.elements().toString());
		if ( this.hasSemanticContext ) {
 buf.append(",hasSemanticContext=").append(this.hasSemanticContext);
}

		if ( this.uniqueAlt!==ATN.INVALID_ALT_NUMBER ) {
 buf.append(",uniqueAlt=").append(this.uniqueAlt);
}

		if ( this.conflictingAlts!==undefined ) {
 buf.append(",conflictingAlts=").append(this.conflictingAlts);
}

		if ( this.dipsIntoOuterContext ) {
 buf.append(",dipsIntoOuterContext");
}

		return buf.toString();
	}

	// satisfy interface

	public toArray(): ATNConfig[];

	public toArray <T>(a: T[]): T[];


	// satisfy interface

	public toArray(a?: T[]):  ATNConfig[] |  T[] {
if (a === undefined) {
		return this.configLookup.toArray();
	}
 else  {
		return this.configLookup.toArray(a);
	}

}


	public remove = (o: object): boolean => {
		throw new  java.lang.UnsupportedOperationException();
	}

	public containsAll = (c: java.util.Collection<unknown>): boolean => {
		throw new  java.lang.UnsupportedOperationException();
	}

	public retainAll = (c: java.util.Collection<unknown>): boolean => {
		throw new  java.lang.UnsupportedOperationException();
	}

	public removeAll = (c: java.util.Collection<unknown>): boolean => {
		throw new  java.lang.UnsupportedOperationException();
	}

	public static abstract AbstractConfigHashSet = class AbstractConfigHashSet extends Array2DHashSet<ATNConfig> {

		public constructor(comparator: AbstractEqualityComparator< ATNConfig>);

		public constructor(comparator: AbstractEqualityComparator< ATNConfig>, initialCapacity: number, initialBucketCapacity: number);
public constructor(comparator: AbstractEqualityComparator< ATNConfig>, initialCapacity?: number, initialBucketCapacity?: number) {
const $this = (comparator: AbstractEqualityComparator< ATNConfig>, initialCapacity?: number, initialBucketCapacity?: number): void => {
if (initialCapacity === undefined) {
			$this(comparator, 16, 2);
		}
 else  {
			super(comparator, initialCapacity, initialBucketCapacity);
		}
};

$this(comparator, initialCapacity, initialBucketCapacity);

}


		protected readonly  asElementType = (o: object): ATNConfig => {
			if (!(o instanceof ATNConfig)) {
				return undefined;
			}

			return o as ATNConfig;
		}

		protected readonly  createBuckets = (capacity: number): ATNConfig[][] => {
			return new   Array<ATNConfig>(capacity)[];
		}

		protected readonly  createBucket = (capacity: number): ATNConfig[] => {
			return new   Array<ATNConfig>(capacity);
		}

	};

}

namespace ATNConfigSet {

export type ConfigHashSet = InstanceType<typeof ATNConfigSet["ConfigHashSet"]>;

export type ConfigEqualityComparator = InstanceType<typeof ATNConfigSet["ConfigEqualityComparator"]>;

export type AbstractConfigHashSet = InstanceType<typeof ATNConfigSet["AbstractConfigHashSet"]>;
}


