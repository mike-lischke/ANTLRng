/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { java } from "../../../../../../lib/java/java";
import { Recognizer } from "../Recognizer";
import { RuleContext } from "../RuleContext";

import { JavaObject } from "../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../lib/templates";
import { MurmurHash } from "../../../../../../lib/MurmurHash";
import { ATNSimulator } from "./ATNSimulator";
import { Token } from "../Token";

/**
 * A tree structure used to record the semantic context in which
 *  an ATN configuration is valid.  It's either a single predicate,
 *  a conjunction {@code p1&&p2}, or a sum of products {@code p1||p2}.
 *
 *  <p>I have scoped the {@link AND}, {@link OR}, and {@link Predicate} subclasses of
 *  {@link SemanticContext} within the scope of this outer class.</p>
 */
export abstract class SemanticContext extends JavaObject {
    public static Empty = class Empty extends SemanticContext {
        /**
         * The default {@link SemanticContext}, which is semantically equivalent to
         * a predicate of the form {@code {true}?}.
         */
        public static readonly Instance = new SemanticContext.Empty();

        public eval = <S extends Token, T extends ATNSimulator>(_parser: Recognizer<S, T>,
            _parserCallStack: RuleContext): boolean => {
            return false;
        };
    };

    public static Predicate = class Predicate extends SemanticContext {
        public readonly ruleIndex: number;
        public readonly predIndex: number;
        public readonly isCtxDependent: boolean;  // e.g., $i ref in pred

        public constructor();
        public constructor(ruleIndex: number, predIndex: number, isCtxDependent: boolean);
        public constructor(ruleIndex?: number, predIndex?: number, isCtxDependent?: boolean) {
            super();
            this.ruleIndex = ruleIndex ?? -1;
            this.predIndex = predIndex ?? -1;
            this.isCtxDependent = isCtxDependent ?? false;
        }

        public eval = <S extends Token, T extends ATNSimulator>(parser: Recognizer<S, T>,
            parserCallStack: RuleContext): boolean => {
            const localctx = this.isCtxDependent ? parserCallStack : null;

            return parser.sempred(localctx, this.ruleIndex, this.predIndex);
        };

        public hashCode = (): number => {
            let hashCode: number = MurmurHash.initialize();
            hashCode = MurmurHash.update(hashCode, this.ruleIndex);
            hashCode = MurmurHash.update(hashCode, this.predIndex);
            hashCode = MurmurHash.update(hashCode, this.isCtxDependent ? 1 : 0);
            hashCode = MurmurHash.finish(hashCode, 3);

            return hashCode;
        };

        public equals = (obj: unknown): boolean => {
            if (this === obj) {
                return true;
            }

            if (!(obj instanceof SemanticContext.Predicate)) {
                return false;
            }

            return this.ruleIndex === obj.ruleIndex &&
                this.predIndex === obj.predIndex &&
                this.isCtxDependent === obj.isCtxDependent;
        };

        public toString = (): java.lang.String => {
            return S`{${this.ruleIndex}:${this.predIndex}}?`;
        };
    };

    public static PrecedencePredicate = class PrecedencePredicate extends SemanticContext
        implements java.lang.Comparable<PrecedencePredicate> {
        public readonly precedence: number;

        public constructor(precedence?: number) {
            super();
            this.precedence = precedence ?? 0;
        }

        public eval = <S extends Token, T extends ATNSimulator>(parser: Recognizer<S, T>,
            parserCallStack: RuleContext): boolean => {
            return parser.precpred(parserCallStack, this.precedence);
        };

        public evalPrecedence = <S extends Token, T extends ATNSimulator>(parser: Recognizer<S, T>,
            parserCallStack: RuleContext): SemanticContext | null => {
            if (parser.precpred(parserCallStack, this.precedence)) {
                return SemanticContext.Empty.Instance;
            } else {
                return null;
            }
        };

        public compareTo = (o: PrecedencePredicate): number => {
            return this.precedence - o.precedence;
        };

        public hashCode = (): number => {
            let hashCode = 1;
            hashCode = 31 * hashCode + this.precedence;

            return hashCode;
        };

        public equals = (obj: java.lang.Object | null): boolean => {
            if (!(obj instanceof SemanticContext.PrecedencePredicate)) {
                return false;
            }

            if (this === obj) {
                return true;
            }

            const other: SemanticContext.PrecedencePredicate = obj;

            return this.precedence === other.precedence;
        };

        public toString = (): java.lang.String => {
            return S`{${this.precedence}>=prec}?`;
        };
    };

    /**
     * This is the base class for semantic context "operators", which operate on
     * a collection of semantic context "operands".
     */
    public static Operator = class Operator extends SemanticContext {
        /**
         * Gets the operands for the semantic context operator.
         *
          @returns a collection of {@link SemanticContext} operands for the
         * operator.
         */
        public getOperands(): java.util.Collection<SemanticContext> | null {
            return null;
        }

        public eval = <S extends Token, T extends ATNSimulator>(_parser: Recognizer<S, T>,
            _parserCallStack: RuleContext): boolean => {
            return false;
        };
    };

    /**
     * A semantic context which is true whenever none of the contained contexts
     * is false.
     */
    public static AND = class AND extends SemanticContext.Operator {
        public readonly opnds: SemanticContext[];

        public constructor(a: SemanticContext, b: SemanticContext) {
            super();

            const operands = new java.util.HashSet<SemanticContext>();
            if (a instanceof AND) {
                operands.addAll(java.util.Arrays.asList((a).opnds));
            } else {
                operands.add(a);
            }

            if (b instanceof AND) {
                operands.addAll(java.util.Arrays.asList((b).opnds));
            } else {
                operands.add(b);
            }

            const precedencePredicates = SemanticContext.filterPrecedencePredicates(operands);
            if (!precedencePredicates.isEmpty()) {
                // interested in the transition with the lowest precedence
                const reduced = java.util.Collections.min<SemanticContext.PrecedencePredicate>(precedencePredicates);
                operands.add(reduced!);
            }

            this.opnds = operands.toArray(new Array<SemanticContext>(0));
        }

        public getOperands = (): java.util.Collection<SemanticContext> => {
            return java.util.Arrays.asList(this.opnds);
        };

        public equals = (obj: java.lang.Object | null): boolean => {
            if (this === obj) {
                return true;
            }

            if (!(obj instanceof AND)) {
                return false;
            }

            const other: AND = obj;

            return java.util.Arrays.equals(this.opnds, other.opnds);
        };

        public hashCode = (): number => {
            return MurmurHash.hashCode(this.opnds, AND.class.hashCode());
        };

        /**
         * The evaluation of predicates by this context is short-circuiting, but
         * unordered.
         *
         * @param parser tbd
         * @param parserCallStack tbd
         *
         * @returns tbd
         */
        public eval = <S extends Token, T extends ATNSimulator>(parser: Recognizer<S, T>,
            parserCallStack: RuleContext): boolean => {
            for (const opnd of this.opnds) {
                if (!opnd.eval(parser, parserCallStack)) {
                    return false;
                }
            }

            return true;
        };

        public evalPrecedence = <S extends Token, T extends ATNSimulator>(parser: Recognizer<S, T>,
            parserCallStack: RuleContext): SemanticContext | null => {
            let differs = false;
            const operands = new java.util.ArrayList<SemanticContext>();
            for (const context of this.opnds) {
                const evaluated = context.evalPrecedence(parser, parserCallStack);
                differs ||= (evaluated !== context);
                if (evaluated === null) {
                    // The AND context is false if any element is false
                    return null;
                } else {
                    if (evaluated !== SemanticContext.Empty.Instance) {
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
                return SemanticContext.Empty.Instance;
            }

            let result: SemanticContext | null = operands.get(0);
            for (let i = 1; i < operands.size(); i++) {
                result = SemanticContext.and(result, operands.get(i));
            }

            return result;
        };

        public toString = (): java.lang.String => {
            return S`${this.opnds.join("&&")}`;
        };
    };

    /**
     * A semantic context which is true whenever at least one of the contained
     * contexts is true.
     */
    public static OR = class OR extends SemanticContext.Operator {
        public readonly opnds: SemanticContext[];

        public constructor(a: SemanticContext, b: SemanticContext) {
            super();

            const operands = new java.util.HashSet<SemanticContext>();
            if (a instanceof OR) {
                operands.addAll(java.util.Arrays.asList((a).opnds));
            } else {
                operands.add(a);
            }

            if (b instanceof OR) {
                operands.addAll(java.util.Arrays.asList((b).opnds));
            } else {
                operands.add(b);
            }

            const precedencePredicates = SemanticContext.filterPrecedencePredicates(operands);
            if (!precedencePredicates.isEmpty()) {
                // interested in the transition with the highest precedence
                const reduced = java.util.Collections.max<SemanticContext.PrecedencePredicate>(precedencePredicates);
                operands.add(reduced!);
            }

            this.opnds = operands.toArray(new Array<SemanticContext>(0));
        }

        public getOperands = (): java.util.Collection<SemanticContext> | null => {
            return java.util.Arrays.asList(this.opnds);
        };

        public equals = (obj: java.lang.Object | null): boolean => {
            if (this === obj) {
                return true;
            }

            if (!(obj instanceof OR)) {
                return false;
            }

            const other: OR = obj;

            return java.util.Arrays.equals(this.opnds, other.opnds);
        };

        public hashCode = (): number => {
            return MurmurHash.hashCode(this.opnds, OR.class.hashCode());
        };

        /**
         * The evaluation of predicates by this context is short-circuiting, but
         * unordered.
         *
         * @param parser tbd
         * @param parserCallStack tbd
         *
         * @returns tbd
         */
        public eval = <S extends Token, T extends ATNSimulator>(parser: Recognizer<S, T>,
            parserCallStack: RuleContext): boolean => {
            for (const opnd of this.opnds) {
                if (opnd.eval(parser, parserCallStack)) {
                    return true;
                }
            }

            return false;
        };

        public evalPrecedence = <S extends Token, T extends ATNSimulator>(parser: Recognizer<S, T>,
            parserCallStack: RuleContext): SemanticContext | null => {
            let differs = false;
            const operands = new java.util.ArrayList<SemanticContext>();

            for (const context of this.opnds) {
                const evaluated = context.evalPrecedence(parser, parserCallStack);
                differs ||= (evaluated !== context);
                if (evaluated === SemanticContext.Empty.Instance) {
                    // The OR context is true if any element is true
                    return SemanticContext.Empty.Instance;
                } else {
                    if (evaluated !== null) {
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
                return null;
            }

            let result: SemanticContext | null = operands.get(0);
            for (let i = 1; i < operands.size(); i++) {
                result = SemanticContext.or(result, operands.get(i));
            }

            return result;
        };

        public toString = (): java.lang.String => {
            return S`${this.opnds.join("||")}`;
        };
    };

    /**
     * For context independent predicates, we evaluate them without a local
     * context (i.e., null context). That way, we can evaluate them without
     * having to create proper rule-specific context during prediction (as
     * opposed to the parser, which creates them naturally). In a practical
     * sense, this avoids a cast exception from RuleContext to myRuleContext.
     *
     * <p>For context dependent predicates, we must pass in a local context so that
     * references such as $arg evaluate properly as _localctx.arg. We only
     * capture context dependent predicates in the context in which we begin
     * prediction, so we passed in the outer context here in case of context
     * dependent predicate evaluation.</p>
     */
    public abstract eval: <S extends Token, T extends ATNSimulator>(parser: Recognizer<S, T>,
        parserCallStack: RuleContext) => boolean;

    public static and = (a: SemanticContext | null, b: SemanticContext | null): SemanticContext => {
        // Both a and b can be null, but not at the same time.
        if (a === null || a === SemanticContext.Empty.Instance) {
            return b!;
        }

        if (b === null || b === SemanticContext.Empty.Instance) {
            return a;
        }

        const result: SemanticContext.AND = new SemanticContext.AND(a, b);
        if (result.opnds.length === 1) {
            return result.opnds[0];
        }

        return result;
    };

    /**
     * @param a tbd
     * @param b tbd
     *  @see ParserATNSimulator#getPredsForAmbigAlts
     *
     * @returns tbd
     */
    public static or = (a: SemanticContext | null, b: SemanticContext | null): SemanticContext => {
        if (a === null) {
            return b!;
        }

        if (b === null) {
            return a;
        }

        if (a === SemanticContext.Empty.Instance || b === SemanticContext.Empty.Instance) {
            return SemanticContext.Empty.Instance;
        }

        const result = new SemanticContext.OR(a, b);
        if (result.opnds.length === 1) {
            return result.opnds[0];
        }

        return result;
    };

    private static filterPrecedencePredicates =
        (collection: java.util.Collection<SemanticContext>): java.util.List<SemanticContext.PrecedencePredicate> => {
            let result: java.util.ArrayList<SemanticContext.PrecedencePredicate> | null = null;
            for (let iterator = collection.iterator(); iterator.hasNext();) {
                const context = iterator.next();
                if (context instanceof SemanticContext.PrecedencePredicate) {
                    if (result === null) {
                        result = new java.util.ArrayList<SemanticContext.PrecedencePredicate>();
                    }

                    result.add(context);
                    iterator.remove();
                }
            }

            if (result === null) {
                return java.util.Collections.emptyList();
            }

            return result;
        };

    /**
     * Evaluate the precedence predicates for the context and reduce the result.
     *
     * @param _parser The parser instance.
     * @param _parserCallStack tbd
      @returns The simplified semantic context after precedence predicates are
     * evaluated, which will be one of the following values.
     * <ul>
     * <li>{@link Empty#Instance}: if the predicate simplifies to {@code true} after
     * precedence predicates are evaluated.</li>
     * <li>{@code null}: if the predicate simplifies to {@code false} after
     * precedence predicates are evaluated.</li>
     * <li>{@code this}: if the semantic context is not changed as a result of
     * precedence predicate evaluation.</li>
     * <li>A non-{@code null} {@link SemanticContext}: the new simplified
     * semantic context after precedence predicates are evaluated.</li>
     * </ul>
     */
    public evalPrecedence = <S extends Token, T extends ATNSimulator>(_parser: Recognizer<S, T>,
        _parserCallStack: RuleContext): SemanticContext | null => {
        return this;
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace SemanticContext {
    export type Empty = InstanceType<typeof SemanticContext.Empty>;
    export type Predicate = InstanceType<typeof SemanticContext.Predicate>;
    export type PrecedencePredicate = InstanceType<typeof SemanticContext.PrecedencePredicate>;
    export type Operator = InstanceType<typeof SemanticContext.Operator>;
    export type AND = InstanceType<typeof SemanticContext.AND>;
    export type OR = InstanceType<typeof SemanticContext.OR>;
}
