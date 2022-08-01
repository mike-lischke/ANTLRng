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

import { LexerAction } from "./LexerAction";
import { LexerActionType } from "./LexerActionType";
import { Lexer } from "../Lexer";
import { MurmurHash } from "../../../../../../lib/MurmurHash";

/**
 * Implements the {@code popMode} lexer action by calling {@link Lexer#popMode}.
 *
 * <p>The {@code popMode} command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link #INSTANCE}.</p>
 *
 * @author Sam Harwell
 * @since 4.2
 */
export class LexerPopModeAction implements LexerAction {
    /**
     * Provides a singleton instance of this parameterless lexer action.
     */
    public static readonly INSTANCE?: LexerPopModeAction = new LexerPopModeAction();

    /**
     * Constructs the singleton instance of the lexer {@code popMode} command.
     */
    private constructor() {
        super();
    }

    /**
     * {@inheritDoc}
     *
     * @return This method returns {@link LexerActionType#POP_MODE}.
     */
    public getActionType = (): LexerActionType => {
        return LexerActionType.POP_MODE;
    };

    /**
     * {@inheritDoc}
     *
     * @return This method returns {@code false}.
     */
    public isPositionDependent = (): boolean => {
        return false;
    };

    /**
     * {@inheritDoc}
     *
     * <p>This action is implemented by calling {@link Lexer#popMode}.</p>
     *
     * @param lexer
     */
    public execute = (lexer: Lexer): void => {
        lexer.popMode();
    };

    public hashCode = (): number => {
        let hash: number = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.getActionType().ordinal());

        return MurmurHash.finish(hash, 1);
    };

    public equals = (obj: object): boolean => {
        return obj === this;
    };

    public toString = (): string => {
        return "popMode";
    };
}
