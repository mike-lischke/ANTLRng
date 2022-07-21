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
import { ATNState } from "./ATNState";
import { PredictionContext } from "./PredictionContext";
import { SemanticContext } from "./SemanticContext";
import { Recognizer } from "../Recognizer";
import { MurmurHash } from "../misc/MurmurHash";

/**
 * A tuple: (ATN state, predicted alt, syntactic, semantic context).
 *  The syntactic context is a graph-structured stack node whose
 *  path(s) to the root is the rule invocation(s)
 *  chain used to arrive at the state.  The semantic context is
 *  the tree of semantic predicates encountered before reaching
 *  an ATN state.
 */
export class ATNConfig {
    /**
     * This field stores the bit mask for implementing the
     * {@link #isPrecedenceFilterSuppressed} property as a bit within the
     * existing {@link #reachesIntoOuterContext} field.
     */
    private static readonly SUPPRESS_PRECEDENCE_FILTER: number = 0x40000000;

    /** The ATN state associated with this configuration */
    public readonly state?: ATNState;

    /** What alt (or lexer rule) is predicted by this configuration */
    public readonly alt: number;

    /**
     * The stack of invoking states leading to the rule/states associated
     *  with this config.  We track only those contexts pushed during
     *  execution of the ATN simulator.
     */
    public context?: PredictionContext;

    /**
     * We cannot execute predicates dependent upon local context unless
     * we know for sure we are in the correct context. Because there is
     * no way to do this efficiently, we simply cannot evaluate
     * dependent predicates unless we are in the rule that initially
     * invokes the ATN simulator.
     *
     * <p>
     * closure() tracks the depth of how far we dip into the outer context:
     * depth &gt; 0.  Note that it may not be totally accurate depth since I
     * don't ever decrement. TODO: make it a boolean then</p>
     *
     * <p>
     * For memory efficiency, the {@link #isPrecedenceFilterSuppressed} method
     * is also backed by this field. Since the field is publicly accessible, the
     * highest bit which would not cause the value to become negative is used to
     * store this field. This choice minimizes the risk that code which only
     * compares this value to 0 would be affected by the new purpose of the
     * flag. It also ensures the performance of the existing {@link ATNConfig}
     * constructors as well as certain operations like
     * {@link ATNConfigSet#add(ATNConfig, DoubleKeyMap)} method are
     * <em>completely</em> unaffected by the change.</p>
     */
    public reachesIntoOuterContext: number;

    public readonly semanticContext?: SemanticContext;

    public constructor(old: ATNConfig);

    public constructor(c: ATNConfig, state: ATNState);

    public constructor(c: ATNConfig,
        semanticContext: SemanticContext);

    public constructor(state: ATNState,
        alt: number,
        context: PredictionContext);

    public constructor(c: ATNConfig, state: ATNState,
        semanticContext: SemanticContext);

    public constructor(c: ATNConfig, state: ATNState,
        context: PredictionContext);

    public constructor(state: ATNState,
        alt: number,
        context: PredictionContext,
        semanticContext: SemanticContext);

    public constructor(c: ATNConfig, state: ATNState,
        context: PredictionContext,
        semanticContext: SemanticContext);
    public constructor(oldOrCOrState: ATNConfig | ATNState, stateOrSemanticContextOrAlt?: ATNState | SemanticContext | number, contextOrSemanticContext?: PredictionContext | SemanticContext, semanticContext?: SemanticContext) {
        const $this = (oldOrCOrState: ATNConfig | ATNState, stateOrSemanticContextOrAlt?: ATNState | SemanticContext | number, contextOrSemanticContext?: PredictionContext | SemanticContext, semanticContext?: SemanticContext): void => {
            if (oldOrCOrState instanceof ATNConfig && stateOrSemanticContextOrAlt === undefined) {
                const old = oldOrCOrState; // dup

                // @ts-expect-error
                this.state = old.state;
                // @ts-expect-error
                this.alt = old.alt;
                this.context = old.context;
                // @ts-expect-error
                this.semanticContext = old.semanticContext;
                this.reachesIntoOuterContext = old.reachesIntoOuterContext;
            } else if (oldOrCOrState instanceof ATNConfig && stateOrSemanticContextOrAlt instanceof ATNState && contextOrSemanticContext === undefined) {
                const c = oldOrCOrState;
                const state = stateOrSemanticContextOrAlt;
                $this(c, state, c.context, c.semanticContext);
            } else if (oldOrCOrState instanceof ATNConfig && stateOrSemanticContextOrAlt instanceof SemanticContext && contextOrSemanticContext === undefined) {
                const c = oldOrCOrState;
                const semanticContext = stateOrSemanticContextOrAlt;
                $this(c, c.state, c.context, semanticContext);
            } else if (oldOrCOrState instanceof ATNState && typeof stateOrSemanticContextOrAlt === "number" && contextOrSemanticContext instanceof PredictionContext && semanticContext === undefined) {
                const state = oldOrCOrState;
                const alt = stateOrSemanticContextOrAlt;
                const context = contextOrSemanticContext;
                $this(state, alt, context, SemanticContext.NONE);
            } else if (oldOrCOrState instanceof ATNConfig && stateOrSemanticContextOrAlt instanceof ATNState && contextOrSemanticContext instanceof SemanticContext && semanticContext === undefined) {
                const c = oldOrCOrState;
                const state = stateOrSemanticContextOrAlt;
                const semanticContext = contextOrSemanticContext;
                $this(c, state, c.context, semanticContext);
            } else if (oldOrCOrState instanceof ATNConfig && stateOrSemanticContextOrAlt instanceof ATNState && contextOrSemanticContext instanceof PredictionContext && semanticContext === undefined) {
                const c = oldOrCOrState;
                const state = stateOrSemanticContextOrAlt;
                const context = contextOrSemanticContext;
                $this(c, state, context, c.semanticContext);
            } else if (oldOrCOrState instanceof ATNState && typeof stateOrSemanticContextOrAlt === "number" && contextOrSemanticContext instanceof PredictionContext && semanticContext instanceof SemanticContext) {
                const state = oldOrCOrState;
                const alt = stateOrSemanticContextOrAlt;
                const context = contextOrSemanticContext;
                // @ts-expect-error
                this.state = state;
                // @ts-expect-error
                this.alt = alt;
                this.context = context;
                // @ts-expect-error
                this.semanticContext = semanticContext;
            } else {
                const c = oldOrCOrState as ATNConfig;
                const state = stateOrSemanticContextOrAlt as ATNState;
                const context = contextOrSemanticContext as PredictionContext;
                // @ts-expect-error
                this.state = state;
                // @ts-expect-error
                this.alt = c.alt;
                this.context = context;
                // @ts-expect-error
                this.semanticContext = semanticContext;
                this.reachesIntoOuterContext = c.reachesIntoOuterContext;
            }
        };

        $this(oldOrCOrState, stateOrSemanticContextOrAlt, contextOrSemanticContext, semanticContext);

    }

    /**
     * This method gets the value of the {@link #reachesIntoOuterContext} field
     * as it existed prior to the introduction of the
     * {@link #isPrecedenceFilterSuppressed} method.
     *
     * @returns tbd
     */
    public readonly getOuterContextDepth = (): number => {
        return this.reachesIntoOuterContext & ~ATNConfig.SUPPRESS_PRECEDENCE_FILTER;
    };

    public readonly isPrecedenceFilterSuppressed = (): boolean => {
        return (this.reachesIntoOuterContext & ATNConfig.SUPPRESS_PRECEDENCE_FILTER) !== 0;
    };

    public readonly setPrecedenceFilterSuppressed = (value: boolean): void => {
        if (value) {
            this.reachesIntoOuterContext |= 0x40000000;
        } else {
            this.reachesIntoOuterContext &= ~ATNConfig.SUPPRESS_PRECEDENCE_FILTER;
        }
    };

    /**
     * An ATN configuration is equal to another if both have
     *  the same state, they predict the same alternative, and
     *  syntactic/semantic contexts are the same.
     */
    public equals(o: object): boolean;

    public equals(other: ATNConfig): boolean;

    /**
     * An ATN configuration is equal to another if both have
     *  the same state, they predict the same alternative, and
     *  syntactic/semantic contexts are the same.
     *
     * @param oOrOther tbd
     *
     * @returns tbd
     */
    public equals(oOrOther: object | ATNConfig): boolean {
        if (typeof oOrOther === "object") {
            const o = oOrOther as object;
            if (!(o instanceof ATNConfig)) {
                return false;
            }

            return this.equals(o);
        } else {
            const other = oOrOther as ATNConfig;
            if (this === other) {
                return true;
            } else {
                if (other === undefined) {
                    return false;
                }
            }

            return this.state.stateNumber === other.state.stateNumber
                && this.alt === other.alt
                && (this.context === other.context || (this.context !== undefined && this.context.equals(other.context)))
                && this.semanticContext.equals(other.semanticContext)
                && this.isPrecedenceFilterSuppressed() === other.isPrecedenceFilterSuppressed();
        }

    }

    public hashCode = (): number => {
        let hashCode: number = MurmurHash.initialize(7);
        hashCode = MurmurHash.update(hashCode, this.state.stateNumber);
        hashCode = MurmurHash.update(hashCode, this.alt);
        hashCode = MurmurHash.update(hashCode, this.context);
        hashCode = MurmurHash.update(hashCode, this.semanticContext);
        hashCode = MurmurHash.finish(hashCode, 4);

        return hashCode;
    };

    public toString(): string;

    public toString(recog: Recognizer<unknown, unknown>, showAlt: boolean): string;

    public toString(recog?: Recognizer<unknown, unknown>, showAlt?: boolean): string {
        if (recog === undefined) {
            return this.toString(undefined, true);
        } else {
            const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
            //		if ( state.ruleIndex>=0 ) {
            //			if ( recog!=null ) buf.append(recog.getRuleNames()[state.ruleIndex]+":");
            //			else buf.append(state.ruleIndex+":");
            //		}
            buf.append("(");
            buf.append(this.state);
            if (showAlt) {
                buf.append(",");
                buf.append(this.alt);
            }
            if (this.context !== undefined) {
                buf.append(",[");
                buf.append(this.context.toString());
                buf.append("]");
            }
            if (this.semanticContext !== undefined && this.semanticContext !== SemanticContext.NONE) {
                buf.append(",");
                buf.append(this.semanticContext);
            }
            if (this.getOuterContextDepth() > 0) {
                buf.append(",up=").append(this.getOuterContextDepth());
            }
            buf.append(")");

            return buf.toString();
        }

    }

}
