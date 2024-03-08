/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { RangeBorderCharactersData } from "./RangeBorderCharactersData.js";
import { ParserATNFactory } from "./ParserATNFactory.js";
import { CharactersDataCheckStatus } from "./CharactersDataCheckStatus.js";
import { ATNOptimizer } from "./ATNOptimizer.js";
import { ATNFactory } from "./ATNFactory.js";
import { CodeGenerator } from "../codegen/CodeGenerator.js";
import { CharSupport } from "../misc/CharSupport.js";
import { EscapeSequenceParsing } from "../misc/EscapeSequenceParsing.js";
import { Lexer, Transition, TokensStartState, SetTransition, RuleStartState, NotSetTransition, LexerTypeAction, LexerSkipAction, LexerPushModeAction, LexerPopModeAction, LexerMoreAction, LexerModeAction, LexerCustomAction, LexerChannelAction, LexerAction, CodePointTransitions, AtomTransition, ActionTransition, ATNState, ATN, Interval, IntervalSet, HashMap } from "antlr4ng";
import { ErrorType } from "../tool/ErrorType.js";
import { LexerGrammar } from "../tool/LexerGrammar.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { RangeAST } from "../tool/ast/RangeAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";



export  class LexerATNFactory extends ParserATNFactory {

	/**
	 * Provides a map of names of predefined constants which are likely to
	 * appear as the argument for lexer commands. These names would be resolved
	 * by the Java compiler for lexer commands that are translated to embedded
	 * actions, but are required during code generation for creating
	 * {@link LexerAction} instances that are usable by a lexer interpreter.
	 */
	public static readonly  COMMON_CONSTANTS = new  HashMap<string, number>();

	public static CharSetParseState =  class CharSetParseState {

		public static readonly  NONE = new  CharSetParseState(LexerATNFactory.CharSetParseState.Mode.NONE, false, -1, IntervalSet.EMPTY_SET);
		public static readonly  ERROR = new  CharSetParseState(LexerATNFactory.CharSetParseState.Mode.ERROR, false, -1, IntervalSet.EMPTY_SET);

		public readonly  mode:  LexerATNFactory.CharSetParseState.Mode;
		public readonly  inRange:  boolean;
		public readonly  prevCodePoint:  number;
		public readonly  prevProperty:  IntervalSet;

		public  constructor(
				mode: LexerATNFactory.CharSetParseState.Mode,
				inRange: boolean,
				prevCodePoint: number,
				prevProperty: IntervalSet) {
			this.mode = mode;
			this.inRange = inRange;
			this.prevCodePoint = prevCodePoint;
			this.prevProperty = prevProperty;
		}

		@Override
public override  toString():  string {
			return string.format(
					"%s mode=%s inRange=%s prevCodePoint=%d prevProperty=%s",
					super.toString(),
					this.mode,
					this.inRange,
					this.prevCodePoint,
					this.prevProperty);
		}

		@Override
public override  equals(other: Object):  boolean {
			if (!(other instanceof CharSetParseState)) {
				return false;
			}
			let  that =  other as CharSetParseState;
			if (this === that) {
				return true;
			}
			return Objects.equals(this.mode, that.mode) &&
				Objects.equals(this.inRange, that.inRange) &&
				Objects.equals(this.prevCodePoint, that.prevCodePoint) &&
				Objects.equals(this.prevProperty, that.prevProperty);
		}

		@Override
public override  hashCode():  number {
			return Objects.hash(this.mode, this.inRange, this.prevCodePoint, this.prevProperty);
		}
		protected static  Mode = class Mode extends Enum<Mode> {
			public static readonly NONE: Mode = new class extends Mode {
}(S`NONE`, 0);
			public static readonly ERROR: Mode = new class extends Mode {
}(S`ERROR`, 1);
			public static readonly PREV_CODE_POINT: Mode = new class extends Mode {
}(S`PREV_CODE_POINT`, 2);
			public static readonly PREV_PROPERTY: Mode = new class extends Mode {
}(S`PREV_PROPERTY`, 3)
		};

	};

	public  codegenTemplates:  STGroup;

	/**
	 * Maps from an action index to a {@link LexerAction} object.
	 */
	protected  indexToActionMap = new  HashMap<number, LexerAction>();
	/**
	 * Maps from a {@link LexerAction} object to the action index.
	 */
	protected  actionToIndexMap = new  HashMap<LexerAction, number>();

	private readonly  ruleCommands = new  Array<string>();

	public  constructor(g: LexerGrammar);

	public  constructor(g: LexerGrammar, codeGenerator: CodeGenerator);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [g] = args as [LexerGrammar];


		this(g, null);
	

				break;
			}

			case 2: {
				const [g, codeGenerator] = args as [LexerGrammar, CodeGenerator];


		super(g);
		// use codegen to get correct language templates for lexer commands
		this.codegenTemplates = (codeGenerator === null ? CodeGenerator.create(g) : codeGenerator).getTemplates();
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public static  getCommonConstants():  Set<string> {
		return LexerATNFactory.COMMON_CONSTANTS.keySet();
	}

	@Override
public override  createATN():  ATN {
		// BUILD ALL START STATES (ONE PER MODE)
		let  modes = ( this.g as LexerGrammar).modes.keySet();
		for (let modeName of modes) {
			// create s0, start state; implied Tokens rule node
			let  startState =
				this.newState(TokensStartState.class, null);
			this.atn.modeNameToStartState.put(modeName, startState);
			this.atn.modeToStartState.add(startState);
			this.atn.defineDecisionState(startState);
		}

		// INIT ACTION, RULE->TOKEN_TYPE MAP
		this.atn.ruleToTokenType = new  Int32Array(this.g.rules.size());
		for (let r of this.g.rules.values()) {
			this.atn.ruleToTokenType[r.index] = this.g.getTokenType(r.name);
		}

		// CREATE ATN FOR EACH RULE
		this._createATN(this.g.rules.values());

		this.atn.lexerActions = new  Array<LexerAction>(this.indexToActionMap.size());
		for (let entry of this.indexToActionMap.entrySet()) {
			this.atn.lexerActions[entry.getKey()] = entry.getValue();
		}

		// LINK MODE START STATE TO EACH TOKEN RULE
		for (let modeName of modes) {
			let  rules = (this.g as LexerGrammar).modes.get(modeName);
			let  startState = this.atn.modeNameToStartState.get(modeName);
			for (let r of rules) {
				if ( !r.isFragment() ) {
					let  s = this.atn.ruleToStartState[r.index];
					this.epsilon(startState, s);
				}
			}
		}

		ATNOptimizer.optimize(this.g, this.atn);
		this.checkEpsilonClosure();
		return this.atn;
	}

	@Override
public override  rule(ruleAST: GrammarAST, name: string, blk: ATNFactory.Handle):  ATNFactory.Handle {
		this.ruleCommands.clear();
		return super.rule(ruleAST, name, blk);
	}

	@Override
public override  action(action: ActionAST):  ATNFactory.Handle;

	@Override
public override  action(action: string):  ATNFactory.Handle;

	protected override  action(node: GrammarAST, lexerAction: LexerAction):  ATNFactory.Handle;
public override action(...args: unknown[]):  ATNFactory.Handle {
		switch (args.length) {
			case 1: {
				const [action] = args as [ActionAST];


		let  ruleIndex = this.currentRule.index;
		let  actionIndex = this.g.lexerActions.get(action);
		let  lexerAction = new  LexerCustomAction(ruleIndex, actionIndex);
		return action(action, lexerAction);
	

				break;
			}

			case 1: {
				const [action] = args as [string];


		if (action.trim().isEmpty()) {
			let  left = this.newState(null);
			let  right = this.newState(null);
			this.epsilon(left, right);
			return new  ATNFactory.Handle(left, right);
		}

		// define action AST for this rule as if we had found in grammar
        let  ast =	new  ActionAST(new  CommonToken(ANTLRParser.ACTION, action));
		this.currentRule.defineActionInAlt(this.currentOuterAlt, ast);
		return action(ast);
	

				break;
			}

			case 2: {
				const [node, lexerAction] = args as [GrammarAST, LexerAction];


		let  left = this.newState(node);
		let  right = this.newState(node);
		let  isCtxDependent = false;
		let  lexerActionIndex = this.getLexerActionIndex(lexerAction);
		let  a =
			new  ActionTransition(right, this.currentRule.index, lexerActionIndex, isCtxDependent);
		left.addTransition(a);
		node.atnState = left;
		let  h = new  ATNFactory.Handle(left, right);
		return h;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public override  lexerAltCommands(alt: ATNFactory.Handle, cmds: ATNFactory.Handle):  ATNFactory.Handle {
		let  h = new  ATNFactory.Handle(alt.left, cmds.right);
		this.epsilon(alt.right, cmds.left);
		return h;
	}

	@Override
public override  lexerCallCommand(ID: GrammarAST, arg: GrammarAST):  ATNFactory.Handle {
		return this.lexerCallCommandOrCommand(ID, arg);
	}

	@Override
public override  lexerCommand(ID: GrammarAST):  ATNFactory.Handle {
		return this.lexerCallCommandOrCommand(ID, null);
	}

	@Override
public override  range(a: GrammarAST, b: GrammarAST):  ATNFactory.Handle {
		let  left = this.newState(a);
		let  right = this.newState(b);
		let  t1 = CharSupport.getCharValueFromGrammarCharLiteral(a.getText());
		let  t2 = CharSupport.getCharValueFromGrammarCharLiteral(b.getText());
		if (this.checkRange(a, b, t1, t2)) {
			left.addTransition(this.createTransition(right, t1, t2, a));
		}
		a.atnState = left;
		b.atnState = left;
		return new  ATNFactory.Handle(left, right);
	}

	@Override
public override  set(associatedAST: GrammarAST, alts: Array<GrammarAST>, invert: boolean):  ATNFactory.Handle {
		let  left = this.newState(associatedAST);
		let  right = this.newState(associatedAST);
		let  set = new  IntervalSet();
		for (let t of alts) {
			if ( t.getType()===ANTLRParser.RANGE ) {
				let  a = CharSupport.getCharValueFromGrammarCharLiteral(t.getChild(0).getText());
				let  b = CharSupport.getCharValueFromGrammarCharLiteral(t.getChild(1).getText());
				if (this.checkRange(t.getChild(0) as GrammarAST, t.getChild(1) as GrammarAST, a, b)) {
					this.checkRangeAndAddToSet(associatedAST, t, set, a, b, this.currentRule.caseInsensitive, null);
				}
			}
			else {
 if ( t.getType()===ANTLRParser.LEXER_CHAR_SET ) {
				set.addAll(this.getSetFromCharSetLiteral(t));
			}
			else {
 if ( t.getType()===ANTLRParser.STRING_LITERAL ) {
				let  c = CharSupport.getCharValueFromGrammarCharLiteral(t.getText());
				if ( c !== -1 ) {
					this.checkCharAndAddToSet(associatedAST, set, c);
				}
				else {
					this.g.tool.errMgr.grammarError(ErrorType.INVALID_LITERAL_IN_LEXER_SET,
											   this.g.fileName, t.getToken(), t.getText());
				}
			}
			else {
 if ( t.getType()===ANTLRParser.TOKEN_REF ) {
				this.g.tool.errMgr.grammarError(ErrorType.UNSUPPORTED_REFERENCE_IN_LEXER_SET,
										   this.g.fileName, t.getToken(), t.getText());
			}
}

}

}

		}
		if ( invert ) {
			left.addTransition(new  NotSetTransition(right, set));
		}
		else {
			let  transition: Transition;
			if (set.getIntervals().size() === 1) {
				let  interval = set.getIntervals().get(0);
				transition = CodePointTransitions.createWithCodePointRange(right, interval.a, interval.b);
			}
			else {
				transition = new  SetTransition(right, set);
			}

			left.addTransition(transition);
		}
		associatedAST.atnState = left;
		return new  ATNFactory.Handle(left, right);
	}

	/** For a lexer, a string is a sequence of char to match.  That is,
	 *  "fog" is treated as 'f' 'o' 'g' not as a single transition in
	 *  the DFA.  Machine== o-'f'-&gt;o-'o'-&gt;o-'g'-&gt;o and has n+1 states
	 *  for n characters.
	 *  if "caseInsensitive" option is enabled, "fog" will be treated as
	 *  o-('f'|'F') -> o-('o'|'O') -> o-('g'|'G')
	 */
	@Override
public override  stringLiteral(stringLiteralAST: TerminalAST):  ATNFactory.Handle {
		let  chars = stringLiteralAST.getText();
		let  left = this.newState(stringLiteralAST);
		let  right: ATNState;
		let  s = CharSupport.getStringFromGrammarStringLiteral(chars);
		if (s === null) {
			// the lexer will already have given an error
			return new  ATNFactory.Handle(left, left);
		}

		let  n = s.length();
		let  prev = left;
		right = null;
		for (let  i = 0; i < n; ) {
			right = this.newState(stringLiteralAST);
			let  codePoint = s.codePointAt(i);
			prev.addTransition(this.createTransition(right, codePoint, codePoint, stringLiteralAST));
			prev = right;
			i += Character.charCount(codePoint);
		}
		stringLiteralAST.atnState = left;
		return new  ATNFactory.Handle(left, right);
	}

	/** [Aa\t \u1234a-z\]\p{Letter}\-] char sets */
	@Override
public override  charSetLiteral(charSetAST: GrammarAST):  ATNFactory.Handle {
		let  left = this.newState(charSetAST);
		let  right = this.newState(charSetAST);
		let  set = this.getSetFromCharSetLiteral(charSetAST);

		left.addTransition(new  SetTransition(right, set));
		charSetAST.atnState = left;
		return new  ATNFactory.Handle(left, right);
	}

	public  getSetFromCharSetLiteral(charSetAST: GrammarAST):  IntervalSet {
		let  chars = charSetAST.getText();
		chars = chars.substring(1, chars.length() - 1);
		let  set = new  IntervalSet();
		let  state = LexerATNFactory.CharSetParseState.NONE;

		let  n = chars.length();
		for (let  i = 0; i < n; ) {
			if (state.mode === LexerATNFactory.CharSetParseState.Mode.ERROR) {
				return new  IntervalSet();
			}
			let  c = chars.codePointAt(i);
			let  offset = Character.charCount(c);
			if (c === '\\') {
				let  escapeParseResult =
					EscapeSequenceParsing.parseEscape(chars, i);
				switch (escapeParseResult.type) {
					case EscapeSequenceParsing.Result.Type.INVALID:{
						let  invalid = chars.substring(escapeParseResult.startOffset,
						                                 escapeParseResult.startOffset+escapeParseResult.parseLength);
						this.g.tool.errMgr.grammarError(ErrorType.INVALID_ESCAPE_SEQUENCE,
						                           this.g.fileName, charSetAST.getToken(), invalid);
						state = LexerATNFactory.CharSetParseState.ERROR;
						break;
}

					case EscapeSequenceParsing.Result.Type.CODE_POINT:{
						state = this.applyPrevStateAndMoveToCodePoint(charSetAST, set, state, escapeParseResult.codePoint);
						break;
}

					case EscapeSequenceParsing.Result.Type.PROPERTY:{
						state = this.applyPrevStateAndMoveToProperty(charSetAST, set, state, escapeParseResult.propertyIntervalSet);
						break;
}


default:

				}
				offset = escapeParseResult.parseLength;
			}
			else {
 if (c === '-' && !state.inRange && i !== 0 && i !== n - 1 && state.mode !== LexerATNFactory.CharSetParseState.Mode.NONE) {
				if (state.mode === LexerATNFactory.CharSetParseState.Mode.PREV_PROPERTY) {
					this.g.tool.errMgr.grammarError(ErrorType.UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE,
							this.g.fileName, charSetAST.getToken(), charSetAST.getText());
					state = LexerATNFactory.CharSetParseState.ERROR;
				}
				else {
					state = new  LexerATNFactory.CharSetParseState(state.mode, true, state.prevCodePoint, state.prevProperty);
				}
			}
			else {
				state = this.applyPrevStateAndMoveToCodePoint(charSetAST, set, state, c);
			}
}

			i += offset;
		}
		if (state.mode === LexerATNFactory.CharSetParseState.Mode.ERROR) {
			return new  IntervalSet();
		}
		// Whether or not we were in a range, we'll add the last code point found to the set.
		this.applyPrevState(charSetAST, set, state);

		if (set.isNil()) {
			this.g.tool.errMgr.grammarError(ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED, this.g.fileName, charSetAST.getToken(), "[]");
		}

		return set;
	}

	@Override
public override  tokenRef(node: TerminalAST):  ATNFactory.Handle {
		// Ref to EOF in lexer yields char transition on -1
		if (node.getText().equals("EOF") ) {
			let  left = this.newState(node);
			let  right = this.newState(node);
			left.addTransition(new  AtomTransition(right, java.util.stream.IntStream.EOF));
			return new  ATNFactory.Handle(left, right);
		}
		return this._ruleRef(node);
	}

	protected  getLexerActionIndex(lexerAction: LexerAction):  number {
		let  lexerActionIndex = this.actionToIndexMap.get(lexerAction);
		if (lexerActionIndex === null) {
			lexerActionIndex = this.actionToIndexMap.size();
			this.actionToIndexMap.put(lexerAction, lexerActionIndex);
			this.indexToActionMap.put(lexerActionIndex, lexerAction);
		}

		return lexerActionIndex;
	}

	protected  checkRange(leftNode: GrammarAST, rightNode: GrammarAST, leftValue: number, rightValue: number):  boolean {
		let  result = true;
		if (leftValue === -1) {
			result = false;
			this.g.tool.errMgr.grammarError(ErrorType.INVALID_LITERAL_IN_LEXER_SET,
					this.g.fileName, leftNode.getToken(), leftNode.getText());
		}
		if (rightValue === -1) {
			result = false;
			this.g.tool.errMgr.grammarError(ErrorType.INVALID_LITERAL_IN_LEXER_SET,
					this.g.fileName, rightNode.getToken(), rightNode.getText());
		}
		if (!result) {
 return false;
}


		if (rightValue < leftValue) {
			this.g.tool.errMgr.grammarError(ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED,
					this.g.fileName, leftNode.parent.getToken(), leftNode.getText() + ".." + rightNode.getText());
			return false;
		}
		return true;
	}

	private  lexerCallCommandOrCommand(ID: GrammarAST, arg: GrammarAST):  ATNFactory.Handle {
		let  lexerAction = this.createLexerAction(ID, arg);
		if (lexerAction !== null) {
			return this.action(ID, lexerAction);
		}

		// fall back to standard action generation for the command
		let  cmdST = this.codegenTemplates.getInstanceOf("Lexer" +
				CharSupport.capitalize(ID.getText())+
				"Command");
		if (cmdST === null) {
			this.g.tool.errMgr.grammarError(ErrorType.INVALID_LEXER_COMMAND, this.g.fileName, ID.token, ID.getText());
			return this.epsilon(ID);
		}

		let  callCommand = arg !== null;
		let  containsArg = cmdST.impl.formalArguments !== null && cmdST.impl.formalArguments.containsKey("arg");
		if (callCommand !== containsArg) {
			let  errorType = callCommand ? ErrorType.UNWANTED_LEXER_COMMAND_ARGUMENT : ErrorType.MISSING_LEXER_COMMAND_ARGUMENT;
			this.g.tool.errMgr.grammarError(errorType, this.g.fileName, ID.token, ID.getText());
			return this.epsilon(ID);
		}

		if (callCommand) {
			cmdST.add("arg", arg.getText());
			cmdST.add("grammar", arg.g);
		}

		return this.action(cmdST.render());
	}

	private  applyPrevStateAndMoveToCodePoint(
			charSetAST: GrammarAST,
			set: IntervalSet,
			state: LexerATNFactory.CharSetParseState,
			codePoint: number):  LexerATNFactory.CharSetParseState {
		if (state.inRange) {
			if (state.prevCodePoint > codePoint) {
				this.g.tool.errMgr.grammarError(
						ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED,
						this.g.fileName,
						charSetAST.getToken(),
						CharSupport.getRangeEscapedString(state.prevCodePoint, codePoint));
			}
			this.checkRangeAndAddToSet(charSetAST, set, state.prevCodePoint, codePoint);
			state = LexerATNFactory.CharSetParseState.NONE;
		}
		else {
			this.applyPrevState(charSetAST, set, state);
			state = new  LexerATNFactory.CharSetParseState(
					LexerATNFactory.CharSetParseState.Mode.PREV_CODE_POINT,
					false,
					codePoint,
					IntervalSet.EMPTY_SET);
		}
		return state;
	}

	private  applyPrevStateAndMoveToProperty(
			charSetAST: GrammarAST,
			set: IntervalSet,
			state: LexerATNFactory.CharSetParseState,
			property: IntervalSet):  LexerATNFactory.CharSetParseState {
		if (state.inRange) {
			this.g.tool.errMgr.grammarError(ErrorType.UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE,
						   this.g.fileName, charSetAST.getToken(), charSetAST.getText());
			return LexerATNFactory.CharSetParseState.ERROR;
		}
		else {
			this.applyPrevState(charSetAST, set, state);
			state = new  LexerATNFactory.CharSetParseState(
					LexerATNFactory.CharSetParseState.Mode.PREV_PROPERTY,
					false,
					-1,
					property);
		}
		return state;
	}

	private  applyPrevState(charSetAST: GrammarAST, set: IntervalSet, state: LexerATNFactory.CharSetParseState):  void {
		switch (state.mode) {
			case NONE:
			case java.util.jar.Pack200.Packer.ERROR:{
				break;
}

			case PREV_CODE_POINT:{
				this.checkCharAndAddToSet(charSetAST, set, state.prevCodePoint);
				break;
}

			case PREV_PROPERTY:{
				set.addAll(state.prevProperty);
				break;
}


default:

		}
	}

	private  checkCharAndAddToSet(ast: GrammarAST, set: IntervalSet, c: number):  void {
		this.checkRangeAndAddToSet(ast, ast, set, c, c, this.currentRule.caseInsensitive, null);
	}

	private  checkRangeAndAddToSet(mainAst: GrammarAST, set: IntervalSet, a: number, b: number):  void;

	private  checkRangeAndAddToSet(rootAst: GrammarAST, ast: GrammarAST, set: IntervalSet, a: number, b: number, caseInsensitive: boolean, previousStatus: CharactersDataCheckStatus):  CharactersDataCheckStatus;
private checkRangeAndAddToSet(...args: unknown[]):  void |  CharactersDataCheckStatus {
		switch (args.length) {
			case 4: {
				const [mainAst, set, a, b] = args as [GrammarAST, IntervalSet, number, number];


		this.checkRangeAndAddToSet(mainAst, mainAst, set, a, b, this.currentRule.caseInsensitive, null);
	

				break;
			}

			case 7: {
				const [rootAst, ast, set, a, b, caseInsensitive, previousStatus] = args as [GrammarAST, GrammarAST, IntervalSet, number, number, boolean, CharactersDataCheckStatus];


		let  status: CharactersDataCheckStatus;
		let  charactersData = RangeBorderCharactersData.getAndCheckCharactersData(a, b, this.g, ast,
				previousStatus === null || !previousStatus.notImpliedCharacters);
		if (caseInsensitive) {
			status = new  CharactersDataCheckStatus(false, charactersData.mixOfLowerAndUpperCharCase);
			if (charactersData.isSingleRange()) {
				status = this.checkRangeAndAddToSet(rootAst, ast, set, a, b, false, status);
			}
			else {
				status = this.checkRangeAndAddToSet(rootAst, ast, set, charactersData.lowerFrom, charactersData.lowerTo, false, status);
				// Don't report similar warning twice
				status = this.checkRangeAndAddToSet(rootAst, ast, set, charactersData.upperFrom, charactersData.upperTo, false, status);
			}
		}
		else {
			let  charactersCollision = previousStatus !== null && previousStatus.collision;
			if (!charactersCollision) {
				for (let  i = a; i <= b; i++) {
					if (set.contains(i)) {
						let  setText: string;
						if (rootAst.getChildren() === null) {
							setText = rootAst.getText();
						}
						else {
							let  sb = new  StringBuilder();
							for (let child of rootAst.getChildren()) {
								if (child instanceof RangeAST) {
									sb.append(( child as RangeAST).getChild(0).getText());
									sb.append("..");
									sb.append(( child as RangeAST).getChild(1).getText());
								}
								else {
									sb.append(( child as GrammarAST).getText());
								}
								sb.append(" | ");
							}
							sb.replace(sb.length() - 3, sb.length(), "");
							setText = sb.toString();
						}
						let  charsString = a === b ? string.valueOf(Number(a)) : Number( a) + "-" + Number( b);
						this.g.tool.errMgr.grammarError(ErrorType.CHARACTERS_COLLISION_IN_SET, this.g.fileName, ast.getToken(),
								charsString, setText);
						charactersCollision = true;
						break;
					}
				}
			}
			status = new  CharactersDataCheckStatus(charactersCollision, charactersData.mixOfLowerAndUpperCharCase);
			set.add(a, b);
		}
		return status;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	private  createTransition(target: ATNState, from: number, to: number, tree: CommonTree):  Transition {
		let  charactersData = RangeBorderCharactersData.getAndCheckCharactersData(from, to, this.g, tree, true);
		if (this.currentRule.caseInsensitive) {
			if (charactersData.isSingleRange()) {
				return CodePointTransitions.createWithCodePointRange(target, from, to);
			}
			else {
				let  intervalSet = new  IntervalSet();
				intervalSet.add(charactersData.lowerFrom, charactersData.lowerTo);
				intervalSet.add(charactersData.upperFrom, charactersData.upperTo);
				return new  SetTransition(target, intervalSet);
			}
		}
		else {
			return CodePointTransitions.createWithCodePointRange(target, from, to);
		}
	}

	private  createLexerAction(ID: GrammarAST, arg: GrammarAST):  LexerAction {
		let  command = ID.getText();
		this.checkCommands(command, ID.getToken());

		if ("skip".equals(command) && arg === null) {
			return LexerSkipAction.INSTANCE;
		}
		else {
 if ("more".equals(command) && arg === null) {
			return LexerMoreAction.INSTANCE;
		}
		else {
 if ("popMode".equals(command) && arg === null) {
			return LexerPopModeAction.INSTANCE;
		}
		else {
 if ("mode".equals(command) && arg !== null) {
			let  modeName = arg.getText();
			let  mode = this.getModeConstantValue(modeName, arg.getToken());
			if (mode === null) {
				return null;
			}

			return new  LexerModeAction(mode);
		}
		else {
 if ("pushMode".equals(command) && arg !== null) {
			let  modeName = arg.getText();
			let  mode = this.getModeConstantValue(modeName, arg.getToken());
			if (mode === null) {
				return null;
			}

			return new  LexerPushModeAction(mode);
		}
		else {
 if ("type".equals(command) && arg !== null) {
			let  typeName = arg.getText();
			let  type = this.getTokenConstantValue(typeName, arg.getToken());
			if (type === null) {
				return null;
			}

			return new  LexerTypeAction(type);
		}
		else {
 if ("channel".equals(command) && arg !== null) {
			let  channelName = arg.getText();
			let  channel = this.getChannelConstantValue(channelName, arg.getToken());
			if (channel === null) {
				return null;
			}

			return new  LexerChannelAction(channel);
		}
		else {
			return null;
		}
}

}

}

}

}

}

	}

	private  checkCommands(command: string, commandToken: Token):  void {
		// Command combinations list: https://github.com/antlr/antlr4/issues/1388#issuecomment-263344701
		if (!command.equals("pushMode") && !command.equals("popMode")) {
			if (this.ruleCommands.contains(command)) {
				this.g.tool.errMgr.grammarError(ErrorType.DUPLICATED_COMMAND, this.g.fileName, commandToken, command);
			}

			let  firstCommand = null;

			if (command.equals("skip")) {
				if (this.ruleCommands.contains("more")) {
					firstCommand = "more";
				}
				else {
 if (this.ruleCommands.contains("type")) {
					firstCommand = "type";
				}
				else {
 if (this.ruleCommands.contains("channel")) {
					firstCommand = "channel";
				}
}

}

			}
			else {
 if (command.equals("more")) {
				if (this.ruleCommands.contains("skip")) {
					firstCommand = "skip";
				}
				else {
 if (this.ruleCommands.contains("type")) {
					firstCommand = "type";
				}
				else {
 if (this.ruleCommands.contains("channel")) {
					firstCommand = "channel";
				}
}

}

			}
			else {
 if (command.equals("type") || command.equals("channel")) {
				if (this.ruleCommands.contains("more")) {
					firstCommand = "more";
				}
				else {
 if (this.ruleCommands.contains("skip")) {
					firstCommand = "skip";
				}
}

			}
}

}


			if (firstCommand !== null) {
				this.g.tool.errMgr.grammarError(ErrorType.INCOMPATIBLE_COMMANDS, this.g.fileName, commandToken, firstCommand, command);
			}
		}

		this.ruleCommands.add(command);
	}

	private  getModeConstantValue(modeName: string, token: Token):  number {
		if (modeName === null) {
			return null;
		}

		if (modeName.equals("DEFAULT_MODE")) {
			return Lexer.DEFAULT_MODE;
		}
		if (LexerATNFactory.COMMON_CONSTANTS.containsKey(modeName)) {
			this.g.tool.errMgr.grammarError(ErrorType.MODE_CONFLICTS_WITH_COMMON_CONSTANTS, this.g.fileName, token, token.getText());
			return null;
		}

		let  modeNames = new  Array<string>((this.g as LexerGrammar).modes.keySet());
		let  mode = modeNames.indexOf(modeName);
		if (mode >= 0) {
			return mode;
		}

		try {
			return number.parseInt(modeName);
		} catch (ex) {
if (ex instanceof NumberFormatException) {
			this.g.tool.errMgr.grammarError(ErrorType.CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_MODE_NAME, this.g.fileName, token, token.getText());
			return null;
		} else {
	throw ex;
	}
}
	}

	private  getTokenConstantValue(tokenName: string, token: Token):  number {
		if (tokenName === null) {
			return null;
		}

		if (tokenName.equals("EOF")) {
			return Lexer.EOF;
		}
		if (LexerATNFactory.COMMON_CONSTANTS.containsKey(tokenName)) {
			this.g.tool.errMgr.grammarError(ErrorType.TOKEN_CONFLICTS_WITH_COMMON_CONSTANTS, this.g.fileName, token, token.getText());
			return null;
		}

		let  tokenType = this.g.getTokenType(tokenName);
		if (tokenType !== org.antlr.v4.runtime.Token.INVALID_TYPE) {
			return tokenType;
		}

		try {
			return number.parseInt(tokenName);
		} catch (ex) {
if (ex instanceof NumberFormatException) {
			this.g.tool.errMgr.grammarError(ErrorType.CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_TOKEN_NAME, this.g.fileName, token, token.getText());
			return null;
		} else {
	throw ex;
	}
}
	}

	private  getChannelConstantValue(channelName: string, token: Token):  number {
		if (channelName === null) {
			return null;
		}

		if (channelName.equals("HIDDEN")) {
			return Lexer.HIDDEN;
		}
		if (channelName.equals("DEFAULT_TOKEN_CHANNEL")) {
			return Lexer.DEFAULT_TOKEN_CHANNEL;
		}
		if (LexerATNFactory.COMMON_CONSTANTS.containsKey(channelName)) {
			this.g.tool.errMgr.grammarError(ErrorType.CHANNEL_CONFLICTS_WITH_COMMON_CONSTANTS, this.g.fileName, token, token.getText());
			return null;
		}

		let  channelValue = this.g.getChannelValue(channelName);
		if (channelValue >= org.antlr.v4.runtime.Token.MIN_USER_CHANNEL_VALUE) {
			return channelValue;
		}

		try {
			return number.parseInt(channelName);
		} catch (ex) {
if (ex instanceof NumberFormatException) {
			this.g.tool.errMgr.grammarError(ErrorType.CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_CHANNEL_NAME, this.g.fileName, token, token.getText());
			return null;
		} else {
	throw ex;
	}
}
	}
	 static {
		LexerATNFactory.COMMON_CONSTANTS.put("HIDDEN", Lexer.HIDDEN);
		LexerATNFactory.COMMON_CONSTANTS.put("DEFAULT_TOKEN_CHANNEL", Lexer.DEFAULT_TOKEN_CHANNEL);
		LexerATNFactory.COMMON_CONSTANTS.put("DEFAULT_MODE", Lexer.DEFAULT_MODE);
		LexerATNFactory.COMMON_CONSTANTS.put("SKIP", Lexer.SKIP);
		LexerATNFactory.COMMON_CONSTANTS.put("MORE", Lexer.MORE);
		LexerATNFactory.COMMON_CONSTANTS.put("EOF", Lexer.EOF);
		LexerATNFactory.COMMON_CONSTANTS.put("MAX_CHAR_VALUE", Lexer.MAX_CHAR_VALUE);
		LexerATNFactory.COMMON_CONSTANTS.put("MIN_CHAR_VALUE", Lexer.MIN_CHAR_VALUE);
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace LexerATNFactory {
	export type CharSetParseState = InstanceType<typeof LexerATNFactory.CharSetParseState>;


// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
namespace CharSetParseState {
	export type Mode = InstanceType<typeof CharSetParseState.Mode>;
}

}


