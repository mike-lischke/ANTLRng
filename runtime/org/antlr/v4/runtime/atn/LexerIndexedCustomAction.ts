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
 * This implementation of {@link LexerAction} is used for tracking input offsets
 * for position-dependent actions within a {@link LexerActionExecutor}.
 *
 * <p>This action is not serialized as part of the ATN, and is only required for
 * position-dependent lexer actions which appear at a location other than the
 * end of a rule. For more information about DFA optimizations employed for
 * lexer actions, see {@link LexerActionExecutor#append} and
 * {@link LexerActionExecutor#fixOffsetBeforeMatch}.</p>
 *
 * @author Sam Harwell
 * @since 4.2
 */
export  class LexerIndexedCustomAction implements LexerAction {
	private readonly  offset:  number;
	private readonly  action?:  LexerAction;

	/**
	 * Constructs a new indexed custom action by associating a character offset
	 * with a {@link LexerAction}.
	 *
	 * <p>Note: This class is only required for lexer actions for which
	 * {@link LexerAction#isPositionDependent} returns {@code true}.</p>
	 *
	 * @param offset The offset into the input {@link CharStream}, relative to
	 * the token start index, at which the specified lexer action should be
	 * executed.
	 * @param action The lexer action to execute at a particular offset in the
	 * input {@link CharStream}.
	 */
	public constructor(offset: number, action: LexerAction) {
		super();
this.offset = offset;
		this.action = action;
	}

	/**
	 * Gets the location in the input {@link CharStream} at which the lexer
	 * action should be executed. The value is interpreted as an offset relative
	 * to the token start index.
	 *
	 * @return The location in the input {@link CharStream} at which the lexer
	 * action should be executed.
	 */
	public getOffset = (): number => {
		return this.offset;
	}

	/**
	 * Gets the lexer action to execute.
	 *
	 * @return A {@link LexerAction} object which executes the lexer action.
	 */
	public getAction = (): LexerAction => {
		return this.action;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @return This method returns the result of calling {@link #getActionType}
	 * on the {@link LexerAction} returned by {@link #getAction}.
	 */
	public getActionType = (): LexerActionType => {
		return this.action.getActionType();
	}

	/**
	 * {@inheritDoc}
	 * @return This method returns {@code true}.
	 */
	public isPositionDependent = (): boolean => {
		return true;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>This method calls {@link #execute} on the result of {@link #getAction}
	 * using the provided {@code lexer}.</p>
	 */
	public execute = (lexer: Lexer): void => {
		// assume the input stream position was properly set by the calling code
		this.action.execute(lexer);
	}

	public hashCode = (): number => {
		let  hash: number = MurmurHash.initialize();
		hash = MurmurHash.update(hash, this.offset);
		hash = MurmurHash.update(hash, this.action);
		return MurmurHash.finish(hash, 2);
	}

	public equals = (obj: object): boolean => {
		if (obj === this) {
			return true;
		}
		else { if (!(obj instanceof LexerIndexedCustomAction)) {
			return false;
		}
}


		let  other: LexerIndexedCustomAction = obj as LexerIndexedCustomAction;
		return this.offset === other.offset
			&& this.action.equals(other.action);
	}

}
