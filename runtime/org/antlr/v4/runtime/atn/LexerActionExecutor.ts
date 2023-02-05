/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, MurmurHash } from "jree";
import { LexerAction } from "./LexerAction";
import { LexerIndexedCustomAction } from "./LexerIndexedCustomAction";
import { CharStream } from "../CharStream";
import { Lexer } from "../Lexer";

/**
 * Represents an executor for a sequence of lexer actions which traversed during
 * the matching operation of a lexer rule (token).
 *
 * <p>The executor tracks position information for position-dependent lexer actions
 * efficiently, ensuring that actions appearing only at the end of the rule do
 * not cause bloating of the {@link DFA} created for the lexer.</p>
 *
 * @author Sam Harwell
 *
 */
export class LexerActionExecutor extends JavaObject {

    private readonly lexerActions: LexerAction[];

    /**
     * Caches the result of {@link #hashCode} since the hash code is an element
     * of the performance-critical {@link LexerATNConfig#hashCode} operation.
     */
    #hashCode: number;

    /**
     * Constructs an executor for a sequence of {@link LexerAction} actions.
     *
     * @param lexerActions The lexer actions to execute.
     */
    public constructor(lexerActions: LexerAction[]) {
        super();
        this.lexerActions = lexerActions;

        let hash = MurmurHash.initialize();
        for (const lexerAction of lexerActions) {
            hash = MurmurHash.update(hash, lexerAction);
        }

        this.#hashCode = MurmurHash.finish(hash, lexerActions.length);
    }

    /**
     * Creates a {@link LexerActionExecutor} which executes the actions for
     * the input {@code lexerActionExecutor} followed by a specified
     * {@code lexerAction}.
     *
     * @param lexerActionExecutor The executor for actions already traversed by
     * the lexer while matching a token within a particular
     * {@link LexerATNConfig}. If this is {@code null}, the method behaves as
     * though it were an empty executor.
     * @param lexerAction The lexer action to execute after the actions
     * specified in {@code lexerActionExecutor}.
     *
      @returns A {@link LexerActionExecutor} for executing the combine actions
     * of {@code lexerActionExecutor} and {@code lexerAction}.
     */
    public static append = (lexerActionExecutor: LexerActionExecutor | null,
        lexerAction: LexerAction): LexerActionExecutor => {
        if (lexerActionExecutor === null) {
            return new LexerActionExecutor([lexerAction]);
        }

        const lexerActions = lexerActionExecutor.lexerActions?.slice();
        lexerActions.push(lexerAction);

        return new LexerActionExecutor(lexerActions);
    };

    /**
     * Creates a {@link LexerActionExecutor} which encodes the current offset
     * for position-dependent lexer actions.
     *
     * <p>Normally, when the executor encounters lexer actions where
     * {@link LexerAction#isPositionDependent} returns {@code true}, it calls
     * {@link IntStream#seek} on the input {@link CharStream} to set the input
     * position to the <em>end</em> of the current token. This behavior provides
     * for efficient DFA representation of lexer actions which appear at the end
     * of a lexer rule, even when the lexer rule matches a variable number of
     * characters.</p>
     *
     * <p>Prior to traversing a match transition in the ATN, the current offset
     * from the token start index is assigned to all position-dependent lexer
     * actions which have not already been assigned a fixed offset. By storing
     * the offsets relative to the token start index, the DFA representation of
     * lexer actions which appear in the middle of tokens remains efficient due
     * to sharing among tokens of the same length, regardless of their absolute
     * position in the input stream.</p>
     *
     * <p>If the current executor already has offsets assigned to all
     * position-dependent lexer actions, the method returns {@code this}.</p>
     *
     * @param offset The current offset to assign to all position-dependent
     * lexer actions which do not already have offsets assigned.
     *
      @returns A {@link LexerActionExecutor} which stores input stream offsets
     * for all position-dependent lexer actions.
     */
    public fixOffsetBeforeMatch = (offset: number): LexerActionExecutor => {
        let updatedLexerActions: LexerAction[] | null = null;
        for (let i = 0; i < this.lexerActions.length; i++) {
            if (this.lexerActions[i].isPositionDependent()
                && !(this.lexerActions[i] instanceof LexerIndexedCustomAction)) {
                if (updatedLexerActions === null) {
                    updatedLexerActions = this.lexerActions.slice();
                }

                updatedLexerActions[i] = new LexerIndexedCustomAction(offset, this.lexerActions[i]);
            }
        }

        if (updatedLexerActions === null) {
            return this;
        }

        return new LexerActionExecutor(updatedLexerActions);
    };

    /**
     * Gets the lexer actions to be executed by this executor.
     *
      @returns The lexer actions to be executed by this executor.
     */
    public getLexerActions = (): LexerAction[] | null => {
        return this.lexerActions;
    };

    /**
     * Execute the actions encapsulated by this executor within the context of a
     * particular {@link Lexer}.
     *
     * <p>This method calls {@link IntStream#seek} to set the position of the
     * {@code input} {@link CharStream} prior to calling
     * {@link LexerAction#execute} on a position-dependent action. Before the
     * method returns, the input position will be restored to the same position
     * it was in when the method was invoked.</p>
     *
     * @param lexer The lexer instance.
     * @param input The input stream which is the source for the current token.
     * When this method is called, the current {@link IntStream#index} for
     * {@code input} should be the start of the following token, i.e. 1
     * character past the end of the current token.
     * @param startIndex The token start index. This value may be passed to
     * {@link IntStream#seek} to set the {@code input} position to the beginning
     * of the token.
     */
    public execute = (lexer: Lexer, input: CharStream, startIndex: number): void => {
        let requiresSeek = false;
        const stopIndex: number = input.index();
        try {
            for (let lexerAction of this.lexerActions) {
                if (lexerAction instanceof LexerIndexedCustomAction) {
                    const offset = lexerAction.getOffset();
                    input.seek(startIndex + offset);
                    lexerAction = lexerAction.getAction();
                    requiresSeek = (startIndex + offset) !== stopIndex;
                } else {
                    if (lexerAction.isPositionDependent()) {
                        input.seek(stopIndex);
                        requiresSeek = false;
                    }
                }

                lexerAction.execute(lexer);
            }
        } finally {
            if (requiresSeek) {
                input.seek(stopIndex);
            }
        }
    };

    public hashCode = (): number => {
        return this.#hashCode;
    };

    public equals = (obj: java.lang.Object | null): boolean => {
        if (obj === this) {
            return true;
        } else {
            if (!(obj instanceof LexerActionExecutor)) {
                return false;
            }
        }

        const other: LexerActionExecutor = obj;

        return this.hashCode === other.hashCode
            && java.util.Arrays.equals(this.lexerActions, other.lexerActions);
    };
}
