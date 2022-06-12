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



import { LexerAction } from "./LexerAction";
import { LexerActionType } from "./LexerActionType";
import { Lexer } from "../Lexer";
import { MurmurHash } from "../misc/MurmurHash";




/**
 * Implements the {@code channel} lexer action by calling
 * {@link Lexer#setChannel} with the assigned channel.
 *
 * @author Sam Harwell
 * @since 4.2
 */
export  class LexerChannelAction extends  LexerAction {
	private readonly  channel:  number;

	/**
	 * Constructs a new {@code channel} action with the specified channel value.
	 * @param channel The channel value to pass to {@link Lexer#setChannel}.
	 */
	public constructor(channel: number) {
		super();
this.channel = channel;
	}

	/**
	 * Gets the channel to use for the {@link Token} created by the lexer.
	 *
	 * @return The channel to use for the {@link Token} created by the lexer.
	 */
	public getChannel = (): number => {
		return this.channel;
	}

	/**
	 * {@inheritDoc}
	 * @return This method returns {@link LexerActionType#CHANNEL}.
	 */
	public getActionType = (): LexerActionType => {
		return LexerActionType.CHANNEL;
	}

	/**
	 * {@inheritDoc}
	 * @return This method returns {@code false}.
	 */
	public isPositionDependent = (): boolean => {
		return false;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>This action is implemented by calling {@link Lexer#setChannel} with the
	 * value provided by {@link #getChannel}.</p>
	 */
	public execute = (lexer: Lexer): void => {
		lexer.setChannel(this.channel);
	}

	public hashCode = (): number => {
		let  hash: number = MurmurHash.initialize();
		hash = MurmurHash.update(hash, this.getActionType().ordinal());
		hash = MurmurHash.update(hash, this.channel);
		return MurmurHash.finish(hash, 2);
	}

	public equals = (obj: object): boolean => {
		if (obj === this) {
			return true;
		}
		else { if (!(obj instanceof LexerChannelAction)) {
			return false;
		}
}


		return this.channel === (obj as LexerChannelAction).channel;
	}

	public toString = (): string => {
		return string.format("channel(%d)", this.channel);
	}
}
