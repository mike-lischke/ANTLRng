/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../../lib/java/java";

import { LexerAction } from "./LexerAction";
import { LexerActionType } from "./LexerActionType";
import { Lexer } from "../Lexer";

import { JavaObject } from "../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../lib/templates";
import { MurmurHash } from "../../../../../../lib/MurmurHash";

/**
 * Implements the {@code channel} lexer action by calling
 * {@link Lexer#setChannel} with the assigned channel.
 *
 * @author Sam Harwell
 *
 */
export class LexerChannelAction extends JavaObject implements LexerAction {
    private readonly channel: number;

    /**
     * Constructs a new {@code channel} action with the specified channel value.
     *
     * @param channel The channel value to pass to {@link Lexer#setChannel}.
     */
    public constructor(channel: number) {
        super();
        this.channel = channel;
    }

    /**
     * Gets the channel to use for the {@link Token} created by the lexer.
     *
      @returns The channel to use for the {@link Token} created by the lexer.
     */
    public getChannel = (): number => {
        return this.channel;
    };

    /**
      @returns This method returns {@link LexerActionType#CHANNEL}.
     */
    public getActionType = (): LexerActionType => {
        return LexerActionType.CHANNEL;
    };

    /**
      @returns This method returns {@code false}.
     */
    public isPositionDependent = (): boolean => {
        return false;
    };

    /**
     *
     * <p>This action is implemented by calling {@link Lexer#setChannel} with the
     * value provided by {@link #getChannel}.</p>
     *
     * @param lexer tbd
     */
    public execute = (lexer: Lexer): void => {
        lexer.setChannel(this.channel);
    };

    public hashCode = (): number => {
        let hash: number = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.getActionType());
        hash = MurmurHash.update(hash, this.channel);

        return MurmurHash.finish(hash, 2);
    };

    public equals = (obj: unknown): boolean => {
        if (obj === this) {
            return true;
        }

        if (!(obj instanceof LexerChannelAction)) {
            return false;
        }

        return this.channel === obj.channel;
    };

    public toString = (): java.lang.String => {
        return java.lang.String.format(S`channel(%d)`, this.channel);
    };
}
