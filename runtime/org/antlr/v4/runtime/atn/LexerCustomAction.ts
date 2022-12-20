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
 * Executes a custom lexer action by calling {@link Recognizer#action} with the
 * rule and action indexes assigned to the custom action. The implementation of
 * a custom action is added to the generated code for the lexer in an override
 * of {@link Recognizer#action} when the grammar is compiled.
 *
 * <p>This class may represent embedded actions created with the <code>{...}</code>
 * syntax in ANTLR 4, as well as actions created for lexer commands where the
 * command argument could not be evaluated when the grammar was compiled.</p>
 *
 * @author Sam Harwell
 *
 */
export  class LexerCustomAction extends JavaObject implements LexerAction {
	private readonly  ruleIndex:  number;
	private readonly  actionIndex:  number;

	/**
	 * Constructs a custom lexer action with the specified rule and action
	 * indexes.
	 *
	 * @param ruleIndex The rule index to use for calls to
	 * {@link Recognizer#action}.
	 * @param actionIndex The action index to use for calls to
	 * {@link Recognizer#action}.
	 */
	public constructor(ruleIndex: number, actionIndex: number) {
		super();
this.ruleIndex = ruleIndex;
		this.actionIndex = actionIndex;
	}

	/**
	 * Gets the rule index to use for calls to {@link Recognizer#action}.
	 *
	  @returns The rule index for the custom action.
	 */
	public getRuleIndex = ():  number => {
		return this.ruleIndex;
	}

	/**
	 * Gets the action index to use for calls to {@link Recognizer#action}.
	 *
	  @returns The action index for the custom action.
	 */
	public getActionIndex = ():  number => {
		return this.actionIndex;
	}

	/**
	 *
	  @returns This method returns {@link LexerActionType#CUSTOM}.
	 */
	public getActionType = ():  LexerActionType | null => {
		return LexerActionType.CUSTOM;
	}

	/**
	 * Gets whether the lexer action is position-dependent. Position-dependent
	 * actions may have different semantics depending on the {@link CharStream}
	 * index at the time the action is executed.
	 *
	 * <p>Custom actions are position-dependent since they may represent a
	 * user-defined embedded action which makes calls to methods like
	 * {@link Lexer#getText}.</p>
	 *
	  @returns This method returns {@code true}.
	 */
	public isPositionDependent = ():  boolean => {
		return true;
	}

	/**
	 *
	 * <p>Custom actions are implemented by calling {@link Lexer#action} with the
	 * appropriate rule and action indexes.</p>
	 */
	public execute = (lexer: Lexer| null):  void => {
		lexer.action(null, this.ruleIndex, this.actionIndex);
	}

	public hashCode = ():  number => {
		let  hash: number = MurmurHash.initialize();
		hash = MurmurHash.update(hash, this.getActionType().ordinal());
		hash = MurmurHash.update(hash, this.ruleIndex);
		hash = MurmurHash.update(hash, this.actionIndex);
		return MurmurHash.finish(hash, 3);
	}

	public equals = (obj: java.lang.Object| null):  boolean => {
		if (obj === this) {
			return true;
		}
		else { if (!(obj instanceof LexerCustomAction)) {
			return false;
		}
}


		let  other: LexerCustomAction = obj as LexerCustomAction;
		return this.ruleIndex === other.ruleIndex
			&& this.actionIndex === other.actionIndex;
	}
}
