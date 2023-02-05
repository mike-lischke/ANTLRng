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
 * Implements the {@code type} lexer action by calling {@link Lexer#setType}
 * with the assigned type.
 *
 * @author Sam Harwell
 *
 */
export class LexerTypeAction extends JavaObject implements LexerAction {
    private readonly type: number;

    /**
     * Constructs a new {@code type} action with the specified token type value.
     *
     * @param type The type to assign to the token using {@link Lexer#setType}.
     */
    public constructor(type: number) {
        super();
        this.type = type;
    }

    /**
     * Gets the type to assign to a token created by the lexer.
     *
      @returns The type to assign to a token created by the lexer.
     */
    public getType = (): number => {
        return this.type;
    };

    /**
      @returns This method returns {@link LexerActionType#TYPE}.
     */
    public getActionType = (): LexerActionType => {
        return LexerActionType.TYPE;
    };

    /**
      @returns This method returns {@code false}.
     */
    public isPositionDependent = (): boolean => {
        return false;
    };

    /**
     *
     * <p>This action is implemented by calling {@link Lexer#setType} with the
     * value provided by {@link #getType}.</p>
     *
     * @param lexer tbd
     */
    public execute = (lexer: Lexer): void => {
        lexer.setType(this.type);
    };

    public hashCode = (): number => {
        let hash: number = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.getActionType());
        hash = MurmurHash.update(hash, this.type);

        return MurmurHash.finish(hash, 2);
    };

    public equals = (obj: unknown): boolean => {
        if (obj === this) {
            return true;
        }

        if (!(obj instanceof LexerTypeAction)) {
            return false;
        }

        return this.type === obj.type;
    };

    public toString = (): java.lang.String => {
        return java.lang.String.format(S`type(%d)`, this.type);
    };
}
