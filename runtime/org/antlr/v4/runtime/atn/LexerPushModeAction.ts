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




/**
 * Implements the {@code pushMode} lexer action by calling
 * {@link Lexer#pushMode} with the assigned mode.
 *
 * @author Sam Harwell
 * @since 4.2
 */
export  class LexerPushModeAction implements LexerAction {
	private readonly  mode:  number;

	/**
	 * Constructs a new {@code pushMode} action with the specified mode value.
	 * @param mode The mode value to pass to {@link Lexer#pushMode}.
	 */
	public constructor(mode: number) {
		super();
this.mode = mode;
	}

	/**
	 * Get the lexer mode this action should transition the lexer to.
	 *
	 * @return The lexer mode for this {@code pushMode} command.
	 */
	public getMode = (): number => {
		return this.mode;
	}

	/**
	 * {@inheritDoc}
	 * @return This method returns {@link LexerActionType#PUSH_MODE}.
	 */
	public getActionType = (): LexerActionType => {
		return LexerActionType.PUSH_MODE;
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
	 * <p>This action is implemented by calling {@link Lexer#pushMode} with the
	 * value provided by {@link #getMode}.</p>
	 */
	public execute = (lexer: Lexer): void => {
		lexer.pushMode(this.mode);
	}

	public hashCode = (): number => {
		let  hash: number = MurmurHash.initialize();
		hash = MurmurHash.update(hash, this.getActionType().ordinal());
		hash = MurmurHash.update(hash, this.mode);
		return MurmurHash.finish(hash, 2);
	}

	public equals = (obj: object): boolean => {
		if (obj === this) {
			return true;
		}
		else { if (!(obj instanceof LexerPushModeAction)) {
			return false;
		}
}


		return this.mode === (obj as LexerPushModeAction).mode;
	}

	public toString = (): string => {
		return java.lang.StringBuilder.format("pushMode(%d)", this.mode);
	}
}
