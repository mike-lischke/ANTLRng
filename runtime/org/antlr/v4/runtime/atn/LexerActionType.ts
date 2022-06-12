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



export 

/**
 * Represents the serialization type of a {@link LexerAction}.
 *
 * @author Sam Harwell
 * @since 4.2
 */
export  enum LexerActionType {
	/**
	 * The type of a {@link LexerChannelAction} action.
	 */
	CHANNEL,
	/**
	 * The type of a {@link LexerCustomAction} action.
	 */
	CUSTOM,
	/**
	 * The type of a {@link LexerModeAction} action.
	 */
	MODE,
	/**
	 * The type of a {@link LexerMoreAction} action.
	 */
	MORE,
	/**
	 * The type of a {@link LexerPopModeAction} action.
	 */
	POP_MODE,
	/**
	 * The type of a {@link LexerPushModeAction} action.
	 */
	PUSH_MODE,
	/**
	 * The type of a {@link LexerSkipAction} action.
	 */
	SKIP,
	/**
	 * The type of a {@link LexerTypeAction} action.
	 */
	TYPE,
}
