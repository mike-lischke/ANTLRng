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
 * Implements the {@code type} lexer action by calling {@link Lexer#setType}
 * with the assigned type.
 *
 * @author Sam Harwell
 * @since 4.2
 */
export  class LexerTypeAction extends  LexerAction {
	private readonly  type:  number;

	/**
	 * Constructs a new {@code type} action with the specified token type value.
	 * @param type The type to assign to the token using {@link Lexer#setType}.
	 */
	public constructor(type: number) {
		super();
this.type = type;
	}

	/**
	 * Gets the type to assign to a token created by the lexer.
	 * @return The type to assign to a token created by the lexer.
	 */
	public getType = (): number => {
		return this.type;
	}

	/**
	 * {@inheritDoc}
	 * @return This method returns {@link LexerActionType#TYPE}.
	 */
	public getActionType = (): LexerActionType => {
		return LexerActionType.TYPE;
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
	 * <p>This action is implemented by calling {@link Lexer#setType} with the
	 * value provided by {@link #getType}.</p>
	 */
	public execute = (lexer: Lexer): void => {
		lexer.setType(this.type);
	}

	public hashCode = (): number => {
		let  hash: number = MurmurHash.initialize();
		hash = MurmurHash.update(hash, this.getActionType().ordinal());
		hash = MurmurHash.update(hash, this.type);
		return MurmurHash.finish(hash, 2);
	}

	public equals = (obj: object): boolean => {
		if (obj === this) {
			return true;
		}
		else { if (!(obj instanceof LexerTypeAction)) {
			return false;
		}
}


		return this.type === (obj as LexerTypeAction).type;
	}

	public toString = (): string => {
		return string.format("type(%d)", this.type);
	}
}
