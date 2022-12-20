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
 * Implements the {@code skip} lexer action by calling {@link Lexer#skip}.
 *
 * <p>The {@code skip} command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link #INSTANCE}.</p>
 *
 * @author Sam Harwell
 *
 */
export  class LexerSkipAction extends JavaObject implements LexerAction {
	/**
	 * Provides a singleton instance of this parameterless lexer action.
	 */
	public static readonly  INSTANCE:  LexerSkipAction | null = new  LexerSkipAction();

	/**
	 * Constructs the singleton instance of the lexer {@code skip} command.
	 */
	private constructor() {
	super();
}

	/**
	  @returns This method returns {@link LexerActionType#SKIP}.
	 */
	public getActionType = ():  LexerActionType | null => {
		return LexerActionType.SKIP;
	}

	/**
	  @returns This method returns {@code false}.
	 */
	public isPositionDependent = ():  boolean => {
		return false;
	}

	/**
	 *
	 * <p>This action is implemented by calling {@link Lexer#skip}.</p>
	 */
	public execute = (lexer: Lexer| null):  void => {
		lexer.skip();
	}

	public hashCode = ():  number => {
		let  hash: number = MurmurHash.initialize();
		hash = MurmurHash.update(hash, this.getActionType().ordinal());
		return MurmurHash.finish(hash, 1);
	}

	public equals = (obj: java.lang.Object| null):  boolean => {
		return obj === this;
	}

	public toString = ():  java.lang.String | null => {
		return "skip";
	}
}
