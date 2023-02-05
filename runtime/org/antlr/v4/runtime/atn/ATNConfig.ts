/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S, JavaObject, MurmurHash } from "jree";

import { ATNState } from "./ATNState";
import { PredictionContext } from "./PredictionContext";
import { SemanticContext } from "./SemanticContext";

/**
 * A tuple: (ATN state, predicted alt, syntactic, semantic context).
 *  The syntactic context is a graph-structured stack node whose
 *  path(s) to the root is the rule invocation(s)
 *  chain used to arrive at the state.  The semantic context is
 *  the tree of semantic predicates encountered before reaching
 *  an ATN state.
 */
export class ATNConfig extends JavaObject {
    /**
     * This field stores the bit mask for implementing the
     * {@link #isPrecedenceFilterSuppressed} property as a bit within the
     * existing {@link #reachesIntoOuterContext} field.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly SUPPRESS_PRECEDENCE_FILTER: number = 0x40000000;

    /** The ATN state associated with this configuration */
    public readonly state: ATNState;

    /** What alt (or lexer rule) is predicted by this configuration */
    public readonly alt: number;

    /**
     * The stack of invoking states leading to the rule/states associated
     *  with this config.  We track only those contexts pushed during
     *  execution of the ATN simulator.
     */
    public context: PredictionContext;

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
    public reachesIntoOuterContext = 0;

    public readonly semanticContext: SemanticContext;

    public constructor(c: ATNConfig, semanticContext?: SemanticContext);
    public constructor(c: ATNConfig, state: ATNState, semanticContext?: SemanticContext);
    public constructor(c: ATNConfig, state: ATNState, context: PredictionContext | null,
        semanticContext?: SemanticContext);
    public constructor(state: ATNState, alt: number, context: PredictionContext | null,
        semanticContext?: SemanticContext);
    public constructor(cOrState: ATNConfig | ATNState,
        semanticContextOrStateOrAlt?: ATNState | SemanticContext | number,
        semanticContextOrContext?: PredictionContext | SemanticContext | null, semanticContext?: SemanticContext) {
        super();
        if (cOrState instanceof ATNConfig && semanticContextOrStateOrAlt === undefined) { // dup
            this.state = cOrState.state;
            this.alt = cOrState.alt;
            this.context = cOrState.context;
            this.semanticContext = cOrState.semanticContext;
            this.reachesIntoOuterContext = cOrState.reachesIntoOuterContext;
        } else if (cOrState instanceof ATNState) {
            this.state = cOrState;
            this.alt = semanticContextOrStateOrAlt as number;
            this.context = semanticContextOrContext as PredictionContext;
            this.semanticContext = semanticContext ?? SemanticContext.Empty.Instance;
        } else {
            this.alt = cOrState.alt;
            this.reachesIntoOuterContext = cOrState.reachesIntoOuterContext;
            if (semanticContextOrStateOrAlt instanceof ATNState) {
                this.state = semanticContextOrStateOrAlt;

                if (semanticContextOrContext instanceof SemanticContext) {
                    this.semanticContext = semanticContextOrContext;
                    this.context = cOrState.context;
                } else {
                    this.semanticContext = cOrState.semanticContext;
                    this.context = semanticContextOrContext ?? cOrState.context;
                }
            } else {
                this.state = cOrState.state;
                this.context = cOrState.context;
                this.semanticContext = semanticContextOrStateOrAlt as SemanticContext;
            }
        }
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
     *
     * @param other tbd
     *
     * @returns tbd
     */
    public equals(other: unknown): boolean {
        if (this === other) {
            return true;
        }

        if (other === null || !(other instanceof ATNConfig)) {
            return false;
        }

        return this.state.stateNumber === other.state.stateNumber
            && this.alt === other.alt
            && java.util.Objects.equals(this.context, other.context)
            && java.util.Objects.equals(this.semanticContext, other.semanticContext)
            && this.isPrecedenceFilterSuppressed() === other.isPrecedenceFilterSuppressed();
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

    public toString(showAlt = true): java.lang.String {
        const buf = new java.lang.StringBuilder();
        buf.append(S`(`);
        buf.append(this.state);
        if (showAlt) {
            buf.append(S`,`);
            buf.append(this.alt);
        }

        buf.append(S`, [`);
        buf.append(this.context.toString());
        buf.append(S`]`);

        if (this.semanticContext !== null && this.semanticContext !== SemanticContext.Empty.Instance) {
            buf.append(S`,`);
            buf.append(this.semanticContext);
        }

        if (this.getOuterContextDepth() > 0) {
            buf.append(S`,up=`).append(this.getOuterContextDepth());
        }

        buf.append(S`)`);

        return buf.toString();
    }
}
