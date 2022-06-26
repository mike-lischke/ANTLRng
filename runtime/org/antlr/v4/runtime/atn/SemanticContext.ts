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



import { java } from "../../../../../../lib/java/java";
import { Recognizer } from "../Recognizer";
import { RuleContext } from "../RuleContext";
import { MurmurHash } from "../misc/MurmurHash";
import { Utils } from "../misc/Utils";




/** A tree structure used to record the semantic context in which
 *  an ATN configuration is valid.  It's either a single predicate,
 *  a conjunction {@code p1&&p2}, or a sum of products {@code p1||p2}.
 *
 *  <p>I have scoped the {@link AND}, {@link OR}, and {@link Predicate} subclasses of
 *  {@link SemanticContext} within the scope of this outer class.</p>
 */
export  class SemanticContext {
	/**
	 * The default {@link SemanticContext}, which is semantically equivalent to
	 * a predicate of the form {@code {true}?}.
	 */
    public static readonly  NONE?:  SemanticContext = new  SemanticContext.Predicate();

	/**
	 * For context independent predicates, we evaluate them without a local
	 * context (i.e., null context). That way, we can evaluate them without
	 * having to create proper rule-specific context during prediction (as
	 * opposed to the parser, which creates them naturally). In a practical
	 * sense, this avoids a cast exception from RuleContext to myruleContext.
	 *
	 * <p>For context dependent predicates, we must pass in a local context so that
	 * references such as $arg evaluate properly as _localctx.arg. We only
	 * capture context dependent predicates in the context in which we begin
	 * prediction, so we passed in the outer context here in case of context
	 * dependent predicate evaluation.</p>
	 */
    public abstract eval: (parser: Recognizer<unknown,unknown>, parserCallStack: RuleContext) => boolean;

	/**
	 * Evaluate the precedence predicates for the context and reduce the result.
	 *
	 * @param parser The parser instance.
	 * @param parserCallStack
	 * @return The simplified semantic context after precedence predicates are
	 * evaluated, which will be one of the following values.
	 * <ul>
	 * <li>{@link #NONE}: if the predicate simplifies to {@code true} after
	 * precedence predicates are evaluated.</li>
	 * <li>{@code null}: if the predicate simplifies to {@code false} after
	 * precedence predicates are evaluated.</li>
	 * <li>{@code this}: if the semantic context is not changed as a result of
	 * precedence predicate evaluation.</li>
	 * <li>A non-{@code null} {@link SemanticContext}: the new simplified
	 * semantic context after precedence predicates are evaluated.</li>
	 * </ul>
	 */
	public evalPrecedence = (parser: Recognizer<unknown,unknown>, parserCallStack: RuleContext): SemanticContext => {
		return this;
	}

    public static Predicate = class Predicate extends SemanticContext {
        public readonly  ruleIndex:  number;
       	public readonly  predIndex:  number;
       	public readonly  isCtxDependent:  boolean;  // e.g., $i ref in pred

        protected constructor();

        public constructor(ruleIndex: number, predIndex: number, isCtxDependent: boolean);
protected constructor(ruleIndex?: number, predIndex?: number, isCtxDependent?: boolean) {
if (ruleIndex === undefined) {
            super();
this.ruleIndex = -1;
            this.predIndex = -1;
            this.isCtxDependent = false;
        }
 else  {
            super();
this.ruleIndex = ruleIndex;
            this.predIndex = predIndex;
            this.isCtxDependent = isCtxDependent;
        }

}


        public eval = (parser: Recognizer<unknown,unknown>, parserCallStack: RuleContext): boolean => {
            let  localctx: RuleContext = this.isCtxDependent ? parserCallStack : undefined;
            return parser.sempred(localctx, this.ruleIndex, this.predIndex);
        }

		public hashCode = (): number => {
			let  hashCode: number = MurmurHash.initialize();
			hashCode = MurmurHash.update(hashCode, this.ruleIndex);
			hashCode = MurmurHash.update(hashCode, this.predIndex);
			hashCode = MurmurHash.update(hashCode, this.isCtxDependent ? 1 : 0);
			hashCode = MurmurHash.finish(hashCode, 3);
			return hashCode;
		}

		public equals = (obj: object): boolean => {
			if ( !(obj instanceof SemanticContext.Predicate) ) {
 return false;
}

			if ( this === obj ) {
 return true;
}

			let  p: SemanticContext.Predicate = obj as SemanticContext.Predicate;
			return this.ruleIndex === p.ruleIndex &&
				   this.predIndex === p.predIndex &&
				   this.isCtxDependent === p.isCtxDependent;
		}

		public toString = (): string => {
            return "{"+this.ruleIndex+":"+this.predIndex+"}?";
        }
    };


	public static PrecedencePredicate = class PrecedencePredicate extends SemanticContext implements java.lang.Comparable<SemanticContext.PrecedencePredicate> {
		public readonly  precedence:  number;

		protected constructor();

		public constructor(precedence: number);
protected constructor(precedence?: number) {
if (precedence === undefined) {
			super();
this.precedence = 0;
		}
 else  {
			super();
this.precedence = precedence;
		}

}


		public eval = (parser: Recognizer<unknown, unknown>, parserCallStack: RuleContext): boolean => {
			return parser.precpred(parserCallStack, this.precedence);
		}

		public evalPrecedence = (parser: Recognizer<unknown, unknown>, parserCallStack: RuleContext): SemanticContext => {
			if (parser.precpred(parserCallStack, this.precedence)) {
				return SemanticContext.NONE;
			}
			else {
				return undefined;
			}
		}

		public compareTo = (o: SemanticContext.PrecedencePredicate): number => {
			return this.precedence - o.precedence;
		}

		public hashCode = (): number => {
			let  hashCode: number = 1;
			hashCode = 31 * hashCode + this.precedence;
			return hashCode;
		}

		public equals = (obj: object): boolean => {
			if (!(obj instanceof SemanticContext.PrecedencePredicate)) {
				return false;
			}

			if (this === obj) {
				return true;
			}

			let  other: SemanticContext.PrecedencePredicate = obj as SemanticContext.PrecedencePredicate;
			return this.precedence === other.precedence;
		}

		public toString = (): string => {
			return "{"+this.precedence+">=prec}?";
		}
	};


	/**
	 * This is the base class for semantic context "operators", which operate on
	 * a collection of semantic context "operands".
	 *
	 * @since 4.3
	 */
	public static abstract Operator = class Operator extends SemanticContext {
		/**
		 * Gets the operands for the semantic context operator.
		 *
		 * @return a collection of {@link SemanticContext} operands for the
		 * operator.
		 *
		 * @since 4.3
		 */

		public abstract getOperands: () => java.util.Collection<SemanticContext>;
	};


	/**
	 * A semantic context which is true whenever none of the contained contexts
	 * is false.
	 */
    public static AND = class AND extends SemanticContext.Operator {
		public readonly  opnds?:  SemanticContext[];

		public constructor(a: SemanticContext, b: SemanticContext) {
			let  operands: Set<SemanticContext> = new  HashSet<SemanticContext>();
			if ( a instanceof AND ) {
 operands.addAll(java.util.Arrays.asList((a as AND).opnds));
}

			else { operands.add(a);
}

			if ( b instanceof AND ) {
 operands.addAll(java.util.Arrays.asList((b as AND).opnds));
}

			else { operands.add(b);
}


			let  precedencePredicates: java.util.List<SemanticContext.PrecedencePredicate> = SemanticContext.filterPrecedencePredicates(operands);
			if (!precedencePredicates.isEmpty()) {
				// interested in the transition with the lowest precedence
				let  reduced: SemanticContext.PrecedencePredicate = java.util.Collections.min(precedencePredicates);
				operands.add(reduced);
			}

			this.opnds = operands.toArray(new   Array<SemanticContext>(0));
        }

		public getOperands = (): java.util.Collection<SemanticContext> => {
			return java.util.Arrays.asList(this.opnds);
		}

		public equals = (obj: object): boolean => {
			if ( this===obj ) {
 return true;
}

			if ( !(obj instanceof AND) ) {
 return false;
}

			let  other: AND = obj as AND;
			return java.util.Arrays.equals(this.opnds, other.opnds);
		}

		public hashCode = (): number => {
			return MurmurHash.hashCode(this.opnds, new java.lang.Class(AND).hashCode());
		}

		/**
		 * {@inheritDoc}
		 *
		 * <p>
		 * The evaluation of predicates by this context is short-circuiting, but
		 * unordered.</p>
		 */
		public eval = (parser: Recognizer<unknown,unknown>, parserCallStack: RuleContext): boolean => {
			for (let opnd of this.opnds) {
				if ( !opnd.eval(parser, parserCallStack) ) {
 return false;
}

			}
			return true;
        }

		public evalPrecedence = (parser: Recognizer<unknown, unknown>, parserCallStack: RuleContext): SemanticContext => {
			let  differs: boolean = false;
			let  operands: java.util.List<SemanticContext> = new  java.util.ArrayList<SemanticContext>();
			for (let context of this.opnds) {
				let  evaluated: SemanticContext = context.evalPrecedence(parser, parserCallStack);
				differs |= (evaluated !== context);
				if (evaluated === undefined) {
					// The AND context is false if any element is false
					return undefined;
				}
				else { if (evaluated !== SemanticContext.NONE) {
					// Reduce the result by skipping true elements
					operands.add(evaluated);
				}
}

			}

			if (!differs) {
				return this;
			}

			if (operands.isEmpty()) {
				// all elements were true, so the AND context is true
				return SemanticContext.NONE;
			}

			let  result: SemanticContext = operands.get(0);
			for (let  i: number = 1; i < operands.size(); i++) {
				result = SemanticContext.and(result, operands.get(i));
			}

			return result;
		}

		public toString = (): string => {
			return Utils.join(java.util.Arrays.asList(this.opnds).iterator(), "&&");
        }
    };


	/**
	 * A semantic context which is true whenever at least one of the contained
	 * contexts is true.
	 */
    public static OR = class OR extends SemanticContext.Operator {
		public readonly  opnds?:  SemanticContext[];

		public constructor(a: SemanticContext, b: SemanticContext) {
			let  operands: Set<SemanticContext> = new  HashSet<SemanticContext>();
			if ( a instanceof OR ) {
 operands.addAll(java.util.Arrays.asList((a as OR).opnds));
}

			else { operands.add(a);
}

			if ( b instanceof OR ) {
 operands.addAll(java.util.Arrays.asList((b as OR).opnds));
}

			else { operands.add(b);
}


			let  precedencePredicates: java.util.List<SemanticContext.PrecedencePredicate> = SemanticContext.filterPrecedencePredicates(operands);
			if (!precedencePredicates.isEmpty()) {
				// interested in the transition with the highest precedence
				let  reduced: SemanticContext.PrecedencePredicate = java.util.Collections.max(precedencePredicates);
				operands.add(reduced);
			}

			this.opnds = operands.toArray(new   Array<SemanticContext>(0));
        }

		public getOperands = (): java.util.Collection<SemanticContext> => {
			return java.util.Arrays.asList(this.opnds);
		}

		public equals = (obj: object): boolean => {
			if ( this===obj ) {
 return true;
}

			if ( !(obj instanceof OR) ) {
 return false;
}

			let  other: OR = obj as OR;
			return java.util.Arrays.equals(this.opnds, other.opnds);
		}

		public hashCode = (): number => {
			return MurmurHash.hashCode(this.opnds, new java.lang.Class(OR).hashCode());
		}

		/**
		 * {@inheritDoc}
		 *
		 * <p>
		 * The evaluation of predicates by this context is short-circuiting, but
		 * unordered.</p>
		 */
		public eval = (parser: Recognizer<unknown,unknown>, parserCallStack: RuleContext): boolean => {
			for (let opnd of this.opnds) {
				if ( opnd.eval(parser, parserCallStack) ) {
 return true;
}

			}
			return false;
        }

		public evalPrecedence = (parser: Recognizer<unknown, unknown>, parserCallStack: RuleContext): SemanticContext => {
			let  differs: boolean = false;
			let  operands: java.util.List<SemanticContext> = new  java.util.ArrayList<SemanticContext>();
			for (let context of this.opnds) {
				let  evaluated: SemanticContext = context.evalPrecedence(parser, parserCallStack);
				differs |= (evaluated !== context);
				if (evaluated === SemanticContext.NONE) {
					// The OR context is true if any element is true
					return SemanticContext.NONE;
				}
				else { if (evaluated !== undefined) {
					// Reduce the result by skipping false elements
					operands.add(evaluated);
				}
}

			}

			if (!differs) {
				return this;
			}

			if (operands.isEmpty()) {
				// all elements were false, so the OR context is false
				return undefined;
			}

			let  result: SemanticContext = operands.get(0);
			for (let  i: number = 1; i < operands.size(); i++) {
				result = SemanticContext.or(result, operands.get(i));
			}

			return result;
		}

        public toString = (): string => {
			return Utils.join(java.util.Arrays.asList(this.opnds).iterator(), "||");
        }
    };


	public static and = (a: SemanticContext, b: SemanticContext): SemanticContext => {
		if ( a === undefined || a === SemanticContext.NONE ) {
 return b;
}

		if ( b === undefined || b === SemanticContext.NONE ) {
 return a;
}

		let  result: SemanticContext.AND = new  SemanticContext.AND(a, b);
		if (result.opnds.length === 1) {
			return result.opnds[0];
		}

		return result;
	}

	/**
	 *
	 *  @see ParserATNSimulator#getPredsForAmbigAlts
	 */
	public static or = (a: SemanticContext, b: SemanticContext): SemanticContext => {
		if ( a === undefined ) {
 return b;
}

		if ( b === undefined ) {
 return a;
}

		if ( a === SemanticContext.NONE || b === SemanticContext.NONE ) {
 return SemanticContext.NONE;
}

		let  result: SemanticContext.OR = new  SemanticContext.OR(a, b);
		if (result.opnds.length === 1) {
			return result.opnds[0];
		}

		return result;
	}

	private static filterPrecedencePredicates = (collection: java.util.Collection< SemanticContext>): java.util.List<SemanticContext.PrecedencePredicate> => {
		let  result: java.util.ArrayList<SemanticContext.PrecedencePredicate> = undefined;
		for (let  iterator: Iterator< SemanticContext> = collection.iterator(); iterator.hasNext(); ) {
			let  context: SemanticContext = iterator.next();
			if (context instanceof SemanticContext.PrecedencePredicate) {
				if (result === undefined) {
					result = new  java.util.ArrayList<SemanticContext.PrecedencePredicate>();
				}

				result.add(context as SemanticContext.PrecedencePredicate);
				iterator.remove();
			}
		}

		if (result === undefined) {
			return java.util.Collections.emptyList();
		}

		return result;
	}
}

namespace SemanticContext {

export type Predicate = InstanceType<typeof SemanticContext.Predicate>;

export type PrecedencePredicate = InstanceType<typeof SemanticContext.PrecedencePredicate>;

export type Operator = InstanceType<typeof SemanticContext.Operator>;

export type AND = InstanceType<typeof SemanticContext.AND>;

export type OR = InstanceType<typeof SemanticContext.OR>;
}


