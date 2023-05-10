/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LexerAction } from "./LexerAction";
import { LexerActionType } from "./LexerActionType";
import { Lexer } from "../Lexer";

import { java, S, JavaObject, MurmurHash } from "jree";

/**
 * Implements the {@code pushMode} lexer action by calling
 * {@link Lexer#pushMode} with the assigned mode.
 *
 * @author Sam Harwell
 *
 */
export class LexerPushModeAction extends JavaObject implements LexerAction {
    private readonly mode: number;

    /**
     * Constructs a new {@code pushMode} action with the specified mode value.
     *
     * @param mode The mode value to pass to {@link Lexer#pushMode}.
     */
    public constructor(mode: number) {
        super();
        this.mode = mode;
    }

    /**
     * Get the lexer mode this action should transition the lexer to.
     *
      @returns The lexer mode for this {@code pushMode} command.
     */
    public getMode = (): number => {
        return this.mode;
    };

    /**
      @returns This method returns {@link LexerActionType#PUSH_MODE}.
     */
    public getActionType = (): LexerActionType => {
        return LexerActionType.PUSH_MODE;
    };

    /**
      @returns This method returns {@code false}.
     */
    public isPositionDependent = (): boolean => {
        return false;
    };

    /**
     *
     * <p>This action is implemented by calling {@link Lexer#pushMode} with the
     * value provided by {@link #getMode}.</p>
     *
     * @param lexer tbd
     */
    public execute = (lexer: Lexer): void => {
        lexer.pushMode(this.mode);
    };

    public override hashCode = (): number => {
        let hash: number = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.getActionType());
        hash = MurmurHash.update(hash, this.mode);

        return MurmurHash.finish(hash, 2);
    };

    public override equals = (obj: unknown): boolean => {
        if (obj === this) {
            return true;
        }

        if (!(obj instanceof LexerPushModeAction)) {
            return false;
        }

        return this.mode === obj.mode;
    };

    public override toString = (): java.lang.String => {
        return java.lang.String.format(S`pushMode(%d)`, this.mode);
    };
}
