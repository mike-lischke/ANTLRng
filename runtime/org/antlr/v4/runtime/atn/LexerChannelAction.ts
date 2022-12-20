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
import { MurmurHash } from "../misc/MurmurHash";


import { JavaObject } from "../../../../../../lib/java/lang/Object";


/**
 * Implements the {@code channel} lexer action by calling
 * {@link Lexer#setChannel} with the assigned channel.
 *
 * @author Sam Harwell
 *
 */
export  class LexerChannelAction extends JavaObject implements LexerAction {
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
	  @returns The channel to use for the {@link Token} created by the lexer.
	 */
	public getChannel = ():  number => {
		return this.channel;
	}

	/**
	  @returns This method returns {@link LexerActionType#CHANNEL}.
	 */
	public getActionType = ():  LexerActionType | null => {
		return LexerActionType.CHANNEL;
	}

	/**
	  @returns This method returns {@code false}.
	 */
	public isPositionDependent = ():  boolean => {
		return false;
	}

	/**
	 *
	 * <p>This action is implemented by calling {@link Lexer#setChannel} with the
	 * value provided by {@link #getChannel}.</p>
	 */
	public execute = (lexer: Lexer| null):  void => {
		lexer.setChannel(this.channel);
	}

	public hashCode = ():  number => {
		let  hash: number = MurmurHash.initialize();
		hash = MurmurHash.update(hash, this.getActionType().ordinal());
		hash = MurmurHash.update(hash, this.channel);
		return MurmurHash.finish(hash, 2);
	}

	public equals = (obj: java.lang.Object| null):  boolean => {
		if (obj === this) {
			return true;
		}
		else { if (!(obj instanceof LexerChannelAction)) {
			return false;
		}
}


		return this.channel === (obj as LexerChannelAction).channel;
	}

	public toString = ():  java.lang.String | null => {
		return java.lang.String.format("channel(%d)", this.channel);
	}
}
