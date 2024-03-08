/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ErrorSeverity } from "./ErrorSeverity.js";
import { Tool } from "../Tool.js";

export class ErrorType extends Enum<ErrorType> {
	/*
	 * Tool errors
	 */

	/**
	 * Compiler Error 1.
	 *
	 * <p>cannot write file <em>filename</em>: <em>reason</em></p>
	 */
	public static readonly CANNOT_WRITE_FILE: ErrorType = new class extends ErrorType {
}(1, "cannot write file <arg>: <arg2>", ErrorSeverity.ERROR,S`CANNOT_WRITE_FILE`, 0);
	/**
	 * Compiler Error 2.
	 *
	 * <p>unknown command-line option <em>option</em></p>
	 */
	public static readonly INVALID_CMDLINE_ARG: ErrorType = new class extends ErrorType {
}(2, "unknown command-line option <arg>", ErrorSeverity.ERROR,S`INVALID_CMDLINE_ARG`, 1);
	/**
	 * Compiler Error 3.
	 *
	 * <p>cannot find tokens file <em>filename</em></p>
	 */
	public static readonly CANNOT_FIND_TOKENS_FILE_GIVEN_ON_CMDLINE: ErrorType = new class extends ErrorType {
}(3, "cannot find tokens file <arg> given for <arg2>", ErrorSeverity.ERROR,S`CANNOT_FIND_TOKENS_FILE_GIVEN_ON_CMDLINE`, 2);
	/**
	 * Compiler Error 4.
	 *
	 * <p>cannot find tokens file <em>filename</em>: <em>reason</em></p>
	 */
	public static readonly ERROR_READING_TOKENS_FILE: ErrorType = new class extends ErrorType {
}(4, "error reading tokens file <arg>: <arg2>", ErrorSeverity.ERROR,S`ERROR_READING_TOKENS_FILE`, 3);
	/**
	 * Compiler Error 5.
	 *
	 * <p>directory not found: <em>directory</em></p>
	 */
	public static readonly DIR_NOT_FOUND: ErrorType = new class extends ErrorType {
}(5, "directory not found: <arg>", ErrorSeverity.ERROR,S`DIR_NOT_FOUND`, 4);
	/**
	 * Compiler Error 6.
	 *
	 * <p>output directory is a file: <em>filename</em></p>
	 */
	public static readonly OUTPUT_DIR_IS_FILE: ErrorType = new class extends ErrorType {
}(6, "output directory is a file: <arg>", ErrorSeverity.ERROR,S`OUTPUT_DIR_IS_FILE`, 5);
	/**
	 * Compiler Error 7.
	 *
	 * <p>cannot find or open file: <em>filename</em></p>
	 */
	public static readonly CANNOT_OPEN_FILE: ErrorType = new class extends ErrorType {
}(7, "cannot find or open file: <arg><if(exception&&verbose)>; reason: <exception><endif>", ErrorSeverity.ERROR,S`CANNOT_OPEN_FILE`, 6);
	/**
	 * Compiler Error 8.
	 *
	 * <p>
	 * grammar name <em>name</em> and file name <em>filename</em> differ</p>
	 */
	public static readonly FILE_AND_GRAMMAR_NAME_DIFFER: ErrorType = new class extends ErrorType {
}(8, "grammar name <arg> and file name <arg2> differ", ErrorSeverity.ERROR,S`FILE_AND_GRAMMAR_NAME_DIFFER`, 7);
	/**
	 * Compiler Error 9.
	 *
	 * <p>invalid {@code -Dname=value} syntax: <em>syntax</em></p>
	 */
	public static readonly BAD_OPTION_SET_SYNTAX: ErrorType = new class extends ErrorType {
}(9, "invalid -Dname=value syntax: <arg>", ErrorSeverity.ERROR,S`BAD_OPTION_SET_SYNTAX`, 8);
	/**
	 * Compiler Error 10.
	 *
	 * <p>warning treated as error</p>
	 */
	public static readonly WARNING_TREATED_AS_ERROR: ErrorType = new class extends ErrorType {
}(10, "warning treated as error", ErrorSeverity.ERROR_ONE_OFF,S`WARNING_TREATED_AS_ERROR`, 9);
	/**
	 * Compiler Error 11.
	 *
	 * <p>cannot find tokens file <em>filename</em>: <em>reason</em></p>
	 */
	public static readonly ERROR_READING_IMPORTED_GRAMMAR: ErrorType = new class extends ErrorType {
}(11, "error reading imported grammar <arg> referenced in <arg2>", ErrorSeverity.ERROR,S`ERROR_READING_IMPORTED_GRAMMAR`, 10);

	/**
	 * Compiler Error 20.
	 *
	 * <p>internal error: <em>message</em></p>
	 */
	public static readonly INTERNAL_ERROR: ErrorType = new class extends ErrorType {
}(20, "internal error: <arg> <arg2><if(exception&&verbose)>: <exception>" +
				   "<stackTrace; separator=\"\\n\"><endif>", ErrorSeverity.ERROR,S`INTERNAL_ERROR`, 11);
	/**
	 * Compiler Error 21.
	 *
	 * <p>.tokens file syntax error <em>filename</em>: <em>message</em></p>
	 */
	public static readonly TOKENS_FILE_SYNTAX_ERROR: ErrorType = new class extends ErrorType {
}(21, ".tokens file syntax error <arg>:<arg2>", ErrorSeverity.ERROR,S`TOKENS_FILE_SYNTAX_ERROR`, 12);
	/**
	 * Compiler Warning 22.
	 *
	 * <p>template error: <em>message</em></p>
	 */
	public static readonly STRING_TEMPLATE_WARNING: ErrorType = new class extends ErrorType {
}(22, "template error: <arg> <arg2><if(exception&&verbose)>: <exception>" +
				   "<stackTrace; separator=\"\\n\"><endif>", ErrorSeverity.WARNING,S`STRING_TEMPLATE_WARNING`, 13);

	/*
	 * Code generation errors
	 */

	/**
	 * Compiler Error 30.
	 *
	 * <p>can't find code generation templates: <em>group</em></p>
	 */
	public static readonly MISSING_CODE_GEN_TEMPLATES: ErrorType = new class extends ErrorType {
}(30, "can't find code generation templates: <arg>", ErrorSeverity.ERROR,S`MISSING_CODE_GEN_TEMPLATES`, 14);
	/**
	 * Compiler Error 31.
	 *
	 * <p>
	 * ANTLR cannot generate <em>language</em> code as of version
	 * <em>version</em></p>
	 */
	public static readonly CANNOT_CREATE_TARGET_GENERATOR: ErrorType = new class extends ErrorType {
}(31, "ANTLR cannot generate <arg> code as of version "+ Tool.VERSION, ErrorSeverity.ERROR_ONE_OFF,S`CANNOT_CREATE_TARGET_GENERATOR`, 15);
	/**
	 * Compiler Error 32.
	 *
	 * <p>
	 * code generation template <em>template</em> has missing, misnamed, or
	 * incomplete arg list; missing <em>field</em></p>
	 */
	public static readonly CODE_TEMPLATE_ARG_ISSUE: ErrorType = new class extends ErrorType {
}(32, "code generation template <arg> has missing, misnamed, or incomplete arg list; missing <arg2>", ErrorSeverity.ERROR,S`CODE_TEMPLATE_ARG_ISSUE`, 16);
	/**
	 * Compiler Error 33.
	 *
	 * <p>missing code generation template <em>template</em></p>
	 */
	public static readonly CODE_GEN_TEMPLATES_INCOMPLETE: ErrorType = new class extends ErrorType {
}(33, "missing code generation template <arg>", ErrorSeverity.ERROR,S`CODE_GEN_TEMPLATES_INCOMPLETE`, 17);
	/**
	 * Compiler Error 34.
	 *
	 * <p>
	 * no mapping to template name for output model class <em>class</em></p>
	 */
	public static readonly NO_MODEL_TO_TEMPLATE_MAPPING: ErrorType = new class extends ErrorType {
}(34, "no mapping to template name for output model class <arg>", ErrorSeverity.ERROR,S`NO_MODEL_TO_TEMPLATE_MAPPING`, 18);
    /**
   	 * Compiler Error 35.
   	 *
   	 * <p>templates/target and tool aren't compatible</p>
   	 */
   	public static readonly INCOMPATIBLE_TOOL_AND_TEMPLATES: ErrorType = new class extends ErrorType {
}(35, "<arg3> code generation target requires ANTLR <arg2>; it can't be loaded by the current ANTLR <arg>", ErrorSeverity.ERROR,S`INCOMPATIBLE_TOOL_AND_TEMPLATES`, 19);

	/*
	 * Grammar errors
	 */

	/**
	 * Compiler Error 50.
	 *
	 * <p>syntax error: <em>message</em></p>
	 */
	public static readonly SYNTAX_ERROR: ErrorType = new class extends ErrorType {
}(50, "syntax error: <arg>", ErrorSeverity.ERROR,S`SYNTAX_ERROR`, 20);
	/**
	 * Compiler Error 51.
	 *
	 * <p>rule <em>rule</em> redefinition; previous at line <em>line</em></p>
	 */
	public static readonly RULE_REDEFINITION: ErrorType = new class extends ErrorType {
}(51, "rule <arg> redefinition; previous at line <arg2>", ErrorSeverity.ERROR,S`RULE_REDEFINITION`, 21);
	/**
	 * Compiler Error 52.
	 *
	 * <p>lexer rule <em>rule</em> not allowed in parser</p>
	 */
	public static readonly LEXER_RULES_NOT_ALLOWED: ErrorType = new class extends ErrorType {
}(52, "lexer rule <arg> not allowed in parser", ErrorSeverity.ERROR,S`LEXER_RULES_NOT_ALLOWED`, 22);
	/**
	 * Compiler Error 53.
	 *
	 * <p>parser rule <em>rule</em> not allowed in lexer</p>
	 */
	public static readonly PARSER_RULES_NOT_ALLOWED: ErrorType = new class extends ErrorType {
}(53, "parser rule <arg> not allowed in lexer", ErrorSeverity.ERROR,S`PARSER_RULES_NOT_ALLOWED`, 23);
	/**
	 * Compiler Error 54.
	 *
	 * <p>
	 * repeated grammar prequel spec ({@code options}, {@code tokens}, or
	 * {@code import}); please merge</p>
	 */
    public static readonly REPEATED_PREQUEL: ErrorType = new class extends ErrorType {
}(54, "repeated grammar prequel spec (options, tokens, or import); please merge", ErrorSeverity.ERROR,S`REPEATED_PREQUEL`, 24);
	/**
	 * Compiler Error 56.
	 *
	 * <p>reference to undefined rule: <em>rule</em></p>
	 *
	 * @see #PARSER_RULE_REF_IN_LEXER_RULE
	 */
	public static readonly UNDEFINED_RULE_REF: ErrorType = new class extends ErrorType {
}(56, "reference to undefined rule: <arg>", ErrorSeverity.ERROR,S`UNDEFINED_RULE_REF`, 25);
	/**
	 * Compiler Error 57.
	 *
	 * <p>
	 * reference to undefined rule <em>rule</em> in non-local ref
	 * <em>reference</em></p>
	 */
	public static readonly UNDEFINED_RULE_IN_NONLOCAL_REF: ErrorType = new class extends ErrorType {
}(57, "reference to undefined rule <arg> in non-local ref <arg3>", ErrorSeverity.ERROR,S`UNDEFINED_RULE_IN_NONLOCAL_REF`, 26);
	/**
	 * Compiler Error 60.
	 *
	 * <p>token names must start with an uppercase letter: <em>name</em></p>
	 */
    public static readonly TOKEN_NAMES_MUST_START_UPPER: ErrorType = new class extends ErrorType {
}(60, "token names must start with an uppercase letter: <arg>", ErrorSeverity.ERROR,S`TOKEN_NAMES_MUST_START_UPPER`, 27);
	/**
	 * Compiler Error 63.
	 *
	 * <p>
	 * unknown attribute reference <em>attribute</em> in
	 * <em>expression</em></p>
	 */
	public static readonly UNKNOWN_SIMPLE_ATTRIBUTE: ErrorType = new class extends ErrorType {
}(63, "unknown attribute reference <arg> in <arg2>", ErrorSeverity.ERROR,S`UNKNOWN_SIMPLE_ATTRIBUTE`, 28);
	/**
	 * Compiler Error 64.
	 *
	 * <p>
	 * parameter <em>parameter</em> of rule <em>rule</em> is not accessible
	 * in this scope: <em>expression</em></p>
	 */
	public static readonly INVALID_RULE_PARAMETER_REF: ErrorType = new class extends ErrorType {
}(64, "parameter <arg> of rule <arg2> is not accessible in this scope: <arg3>", ErrorSeverity.ERROR,S`INVALID_RULE_PARAMETER_REF`, 29);
	/**
	 * Compiler Error 65.
	 *
	 * <p>
	 * unknown attribute <em>attribute</em> for rule <em>rule</em> in
	 * <em>expression</em></p>
	 */
	public static readonly UNKNOWN_RULE_ATTRIBUTE: ErrorType = new class extends ErrorType {
}(65, "unknown attribute <arg> for rule <arg2> in <arg3>", ErrorSeverity.ERROR,S`UNKNOWN_RULE_ATTRIBUTE`, 30);
	/**
	 * Compiler Error 66.
	 *
	 * <p>
	 * attribute <em>attribute</em> isn't a valid property in
	 * <em>expression</em></p>
	 */
    public static readonly UNKNOWN_ATTRIBUTE_IN_SCOPE: ErrorType = new class extends ErrorType {
}(66, "attribute <arg> isn't a valid property in <arg2>", ErrorSeverity.ERROR,S`UNKNOWN_ATTRIBUTE_IN_SCOPE`, 31);
	/**
	 * Compiler Error 67.
	 *
	 * <p>
	 * missing attribute access on rule reference <em>rule</em> in
	 * <em>expression</em></p>
	 */
	public static readonly ISOLATED_RULE_REF: ErrorType = new class extends ErrorType {
}(67, "missing attribute access on rule reference <arg> in <arg2>", ErrorSeverity.ERROR,S`ISOLATED_RULE_REF`, 32);
	/**
	 * Compiler Error 69.
	 *
	 * <p>label <em>label</em> conflicts with rule with same name</p>
	 */
	public static readonly LABEL_CONFLICTS_WITH_RULE: ErrorType = new class extends ErrorType {
}(69, "label <arg> conflicts with rule with same name", ErrorSeverity.ERROR,S`LABEL_CONFLICTS_WITH_RULE`, 33);
	/**
	 * Compiler Error 70.
	 *
	 * <p>label <em>label</em> conflicts with token with same name</p>
	 */
	public static readonly LABEL_CONFLICTS_WITH_TOKEN: ErrorType = new class extends ErrorType {
}(70, "label <arg> conflicts with token with same name", ErrorSeverity.ERROR,S`LABEL_CONFLICTS_WITH_TOKEN`, 34);
	/**
	 * Compiler Error 72.
	 *
	 * <p>label <em>label</em> conflicts with parameter with same name</p>
	 */
	public static readonly LABEL_CONFLICTS_WITH_ARG: ErrorType = new class extends ErrorType {
}(72, "label <arg> conflicts with parameter with same name", ErrorSeverity.ERROR,S`LABEL_CONFLICTS_WITH_ARG`, 35);
	/**
	 * Compiler Error 73.
	 *
	 * <p>label <em>label</em> conflicts with return value with same name</p>
	 */
	public static readonly LABEL_CONFLICTS_WITH_RETVAL: ErrorType = new class extends ErrorType {
}(73, "label <arg> conflicts with return value with same name", ErrorSeverity.ERROR,S`LABEL_CONFLICTS_WITH_RETVAL`, 36);
	/**
	 * Compiler Error 74.
	 *
	 * <p>label <em>label</em> conflicts with local with same name</p>
	 */
	public static readonly LABEL_CONFLICTS_WITH_LOCAL: ErrorType = new class extends ErrorType {
}(74, "label <arg> conflicts with local with same name", ErrorSeverity.ERROR,S`LABEL_CONFLICTS_WITH_LOCAL`, 37);
	/**
	 * Compiler Error 75.
	 *
	 * <p>
	 * label <em>label</em> type mismatch with previous definition:
	 * <em>message</em></p>
	 */
	public static readonly LABEL_TYPE_CONFLICT: ErrorType = new class extends ErrorType {
}(75, "label <arg> type mismatch with previous definition: <arg2>", ErrorSeverity.ERROR,S`LABEL_TYPE_CONFLICT`, 38);
	/**
	 * Compiler Error 76.
	 *
	 * <p>
	 * return value <em>name</em> conflicts with parameter with same name</p>
	 */
	public static readonly RETVAL_CONFLICTS_WITH_ARG: ErrorType = new class extends ErrorType {
}(76, "return value <arg> conflicts with parameter with same name", ErrorSeverity.ERROR,S`RETVAL_CONFLICTS_WITH_ARG`, 39);
	/**
	 * Compiler Error 79.
	 *
	 * <p>missing argument(s) on rule reference: <em>rule</em></p>
	 */
	public static readonly MISSING_RULE_ARGS: ErrorType = new class extends ErrorType {
}(79, "missing argument(s) on rule reference: <arg>", ErrorSeverity.ERROR,S`MISSING_RULE_ARGS`, 40);
	/**
	 * Compiler Error 80.
	 *
	 * <p>rule <em>rule</em> has no defined parameters</p>
	 */
	public static readonly RULE_HAS_NO_ARGS: ErrorType = new class extends ErrorType {
}(80, "rule <arg> has no defined parameters", ErrorSeverity.ERROR,S`RULE_HAS_NO_ARGS`, 41);
	/**
	 * Compiler Warning 83.
	 *
	 * <p>unsupported option <em>option</em></p>
	 */
	public static readonly ILLEGAL_OPTION: ErrorType = new class extends ErrorType {
}(83, "unsupported option <arg>", ErrorSeverity.WARNING,S`ILLEGAL_OPTION`, 42);
	/**
	 * Compiler Warning 84.
	 *
	 * <p>unsupported option value <em>name</em>=<em>value</em></p>
	 */
	public static readonly ILLEGAL_OPTION_VALUE: ErrorType = new class extends ErrorType {
}(84, "unsupported option value <arg>=<arg2>", ErrorSeverity.WARNING,S`ILLEGAL_OPTION_VALUE`, 43);
	/**
	 * Compiler Error 94.
	 *
	 * <p>redefinition of <em>action</em> action</p>
	 */
    public static readonly ACTION_REDEFINITION: ErrorType = new class extends ErrorType {
}(94, "redefinition of <arg> action", ErrorSeverity.ERROR,S`ACTION_REDEFINITION`, 44);
	/**
	 * Compiler Error 99.
	 *
	 * <p>This error may take any of the following forms.</p>
	 *
	 * <ul>
	 * <li>grammar <em>grammar</em> has no rules</li>
	 * <li>implicitly generated grammar <em>grammar</em> has no rules</li>
	 * </ul>
	 */
	public static readonly NO_RULES: ErrorType = new class extends ErrorType {
}(99, "<if(arg2.implicitLexerOwner)>implicitly generated <endif>grammar <arg> has no rules", ErrorSeverity.ERROR,S`NO_RULES`, 45);
	/**
	 * Compiler Error 105.
	 *
	 * <p>
	 * reference to undefined grammar in rule reference:
	 * <em>grammar</em>.<em>rule</em></p>
	 */
	public static readonly NO_SUCH_GRAMMAR_SCOPE: ErrorType = new class extends ErrorType {
}(105, "reference to undefined grammar in rule reference: <arg>.<arg2>", ErrorSeverity.ERROR,S`NO_SUCH_GRAMMAR_SCOPE`, 46);
	/**
	 * Compiler Error 106.
	 *
	 * <p>rule <em>rule</em> is not defined in grammar <em>grammar</em></p>
	 */
	public static readonly NO_SUCH_RULE_IN_SCOPE: ErrorType = new class extends ErrorType {
}(106, "rule <arg2> is not defined in grammar <arg>", ErrorSeverity.ERROR,S`NO_SUCH_RULE_IN_SCOPE`, 47);
	/**
	 * Compiler Warning 108.
	 *
	 * <p>token name <em>Token</em> is already defined</p>
	 */
	public static readonly TOKEN_NAME_REASSIGNMENT: ErrorType = new class extends ErrorType {
}(108, "token name <arg> is already defined", ErrorSeverity.WARNING,S`TOKEN_NAME_REASSIGNMENT`, 48);
	/**
	 * Compiler Warning 109.
	 *
	 * <p>options ignored in imported grammar <em>grammar</em></p>
	 */
	public static readonly OPTIONS_IN_DELEGATE: ErrorType = new class extends ErrorType {
}(109, "options ignored in imported grammar <arg>", ErrorSeverity.WARNING,S`OPTIONS_IN_DELEGATE`, 49);
	/**
	 * Compiler Error 110.
	 *
	 * <p>
	 * can't find or load grammar <em>grammar</em> from
	 * <em>filename</em></p>
	 */
	public static readonly CANNOT_FIND_IMPORTED_GRAMMAR: ErrorType = new class extends ErrorType {
}(110, "can't find or load grammar <arg>", ErrorSeverity.ERROR,S`CANNOT_FIND_IMPORTED_GRAMMAR`, 50);
	/**
	 * Compiler Error 111.
	 *
	 * <p>
	 * <em>grammartype</em> grammar <em>grammar1</em> cannot import
	 * <em>grammartype</em> grammar <em>grammar2</em></p>
	 */
	public static readonly INVALID_IMPORT: ErrorType = new class extends ErrorType {
}(111, "<arg.typeString> grammar <arg.name> cannot import <arg2.typeString> grammar <arg2.name>", ErrorSeverity.ERROR,S`INVALID_IMPORT`, 51);
	/**
	 * Compiler Error 113.
	 *
	 * <p>
	 * <em>grammartype</em> grammar <em>grammar1</em> and imported
	 * <em>grammartype</em> grammar <em>grammar2</em> both generate
	 * <em>recognizer</em></p>
	 */
	public static readonly IMPORT_NAME_CLASH: ErrorType = new class extends ErrorType {
}(113, "<arg.typeString> grammar <arg.name> and imported <arg2.typeString> grammar <arg2.name> both generate <arg2.recognizerName>", ErrorSeverity.ERROR,S`IMPORT_NAME_CLASH`, 52);
	/**
	 * Compiler Error 114.
	 *
	 * <p>cannot find tokens file <em>filename</em></p>
	 */
	public static readonly CANNOT_FIND_TOKENS_FILE_REFD_IN_GRAMMAR: ErrorType = new class extends ErrorType {
}(114, "cannot find tokens file <arg>", ErrorSeverity.ERROR,S`CANNOT_FIND_TOKENS_FILE_REFD_IN_GRAMMAR`, 53);
	/**
	 * Compiler Warning 118.
	 *
	 * <p>
	 * all operators of alt <em>alt</em> of left-recursive rule must have same
	 * associativity</p>
	 *
	 * @deprecated This warning is no longer applicable with the current syntax for specifying associativity.
	 */
	/* @Deprecated */
	public static readonly ALL_OPS_NEED_SAME_ASSOC: ErrorType = new class extends ErrorType {
}(118, "all operators of alt <arg> of left-recursive rule must have same associativity", ErrorSeverity.WARNING,S`ALL_OPS_NEED_SAME_ASSOC`, 54);
	/**
	 * Compiler Error 119.
	 *
	 * <p>
	 * The following sets of rules are mutually left-recursive
	 * <em>[rules]</em></p>
	 */
	public static readonly LEFT_RECURSION_CYCLES: ErrorType = new class extends ErrorType {
}(119, "The following sets of rules are mutually left-recursive <arg:{c| [<c:{r|<r.name>}; separator=\", \">]}; separator=\" and \">", ErrorSeverity.ERROR,S`LEFT_RECURSION_CYCLES`, 55);
	/**
	 * Compiler Error 120.
	 *
	 * <p>lexical modes are only allowed in lexer grammars</p>
	 */
	public static readonly MODE_NOT_IN_LEXER: ErrorType = new class extends ErrorType {
}(120, "lexical modes are only allowed in lexer grammars", ErrorSeverity.ERROR,S`MODE_NOT_IN_LEXER`, 56);
	/**
	 * Compiler Error 121.
	 *
	 * <p>cannot find an attribute name in attribute declaration</p>
	 */
	public static readonly CANNOT_FIND_ATTRIBUTE_NAME_IN_DECL: ErrorType = new class extends ErrorType {
}(121, "cannot find an attribute name in attribute declaration", ErrorSeverity.ERROR,S`CANNOT_FIND_ATTRIBUTE_NAME_IN_DECL`, 57);
	/**
	 * Compiler Error 122.
	 *
	 * <p>rule <em>rule</em>: must label all alternatives or none</p>
	 */
	public static readonly RULE_WITH_TOO_FEW_ALT_LABELS: ErrorType = new class extends ErrorType {
}(122, "rule <arg>: must label all alternatives or none", ErrorSeverity.ERROR,S`RULE_WITH_TOO_FEW_ALT_LABELS`, 58);
	/**
	 * Compiler Error 123.
	 *
	 * <p>
	 * rule alt label <em>label</em> redefined in rule <em>rule1</em>,
	 * originally in rule <em>rule2</em></p>
	 */
	public static readonly ALT_LABEL_REDEF: ErrorType = new class extends ErrorType {
}(123, "rule alt label <arg> redefined in rule <arg2>, originally in rule <arg3>", ErrorSeverity.ERROR,S`ALT_LABEL_REDEF`, 59);
	/**
	 * Compiler Error 124.
	 *
	 * <p>
	 * rule alt label <em>label</em> conflicts with rule <em>rule</em></p>
	 */
	public static readonly ALT_LABEL_CONFLICTS_WITH_RULE: ErrorType = new class extends ErrorType {
}(124, "rule alt label <arg> conflicts with rule <arg2>", ErrorSeverity.ERROR,S`ALT_LABEL_CONFLICTS_WITH_RULE`, 60);
	/**
	 * Compiler Warning 125.
	 *
	 * <p>implicit definition of token <em>Token</em> in parser</p>
	 */
	public static readonly IMPLICIT_TOKEN_DEFINITION: ErrorType = new class extends ErrorType {
}(125, "implicit definition of token <arg> in parser", ErrorSeverity.WARNING,S`IMPLICIT_TOKEN_DEFINITION`, 61);
	/**
	 * Compiler Error 126.
	 *
	 * <p>
	 * cannot create implicit token for string literal in non-combined grammar:
	 * <em>literal</em></p>
	 */
	public static readonly IMPLICIT_STRING_DEFINITION: ErrorType = new class extends ErrorType {
}(126, "cannot create implicit token for string literal in non-combined grammar: <arg>", ErrorSeverity.ERROR,S`IMPLICIT_STRING_DEFINITION`, 62);
	/**
	 * Compiler Error 128.
	 *
	 * <p>
	 * attribute references not allowed in lexer actions:
	 * <em>expression</em></p>
	 */
	public static readonly ATTRIBUTE_IN_LEXER_ACTION: ErrorType = new class extends ErrorType {
}(128, "attribute references not allowed in lexer actions: $<arg>", ErrorSeverity.ERROR,S`ATTRIBUTE_IN_LEXER_ACTION`, 63);
	/**
	 * Compiler Error 130.
	 *
	 * <p>label <em>label</em> assigned to a block which is not a set</p>
	 */
	public static readonly LABEL_BLOCK_NOT_A_SET: ErrorType = new class extends ErrorType {
}(130, "label <arg> assigned to a block which is not a set", ErrorSeverity.ERROR,S`LABEL_BLOCK_NOT_A_SET`, 64);
	/**
	 * Compiler Warning 131.
	 *
	 * <p>This warning may take any of the following forms.</p>
	 *
	 * <ul>
	 * <li>greedy block {@code ()*} contains wildcard; the non-greedy syntax {@code ()*?} may be preferred</li>
	 * <li>greedy block {@code ()+} contains wildcard; the non-greedy syntax {@code ()+?} may be preferred</li>
	 * </ul>
	 */
	public static readonly EXPECTED_NON_GREEDY_WILDCARD_BLOCK: ErrorType = new class extends ErrorType {
}(131, "greedy block ()<arg> contains wildcard; the non-greedy syntax ()<arg>? may be preferred", ErrorSeverity.WARNING,S`EXPECTED_NON_GREEDY_WILDCARD_BLOCK`, 65);
	/**
	 * Compiler Error 132.
	 *
	 * <p>
	 * action in lexer rule <em>rule</em> must be last element of single
	 * outermost alt</p>
	 *
	 * @deprecated This error is no longer issued by ANTLR 4.2.
	 */
	/* @Deprecated */
	public static readonly LEXER_ACTION_PLACEMENT_ISSUE: ErrorType = new class extends ErrorType {
}(132, "action in lexer rule <arg> must be last element of single outermost alt", ErrorSeverity.ERROR,S`LEXER_ACTION_PLACEMENT_ISSUE`, 66);
	/**
	 * Compiler Error 133.
	 *
	 * <p>
	 * {@code ->command} in lexer rule <em>rule</em> must be last element of
	 * single outermost alt</p>
	 */
	public static readonly LEXER_COMMAND_PLACEMENT_ISSUE: ErrorType = new class extends ErrorType {
}(133, "->command in lexer rule <arg> must be last element of single outermost alt", ErrorSeverity.ERROR,S`LEXER_COMMAND_PLACEMENT_ISSUE`, 67);
	/**
	 * Compiler Error 134.
	 *
	 * <p>
	 * symbol <em>symbol</em> conflicts with generated code in target language
	 * or runtime</p>
	 */
	/* @Deprecated */
	public static readonly USE_OF_BAD_WORD: ErrorType = new class extends ErrorType {
}(134, "symbol <arg> conflicts with generated code in target language or runtime", ErrorSeverity.ERROR,S`USE_OF_BAD_WORD`, 68);
	/**
	 * Compiler Error 183.
	 *
	 * <p>rule reference <em>rule</em> is not currently supported in a set</p>
	 */
	public static readonly UNSUPPORTED_REFERENCE_IN_LEXER_SET: ErrorType = new class extends ErrorType {
}(183, "rule reference <arg> is not currently supported in a set", ErrorSeverity.ERROR,S`UNSUPPORTED_REFERENCE_IN_LEXER_SET`, 69);
	/**
	 * Compiler Error 135.
	 *
	 * <p>cannot assign a value to list label <em>label</em></p>
	 */
	public static readonly ASSIGNMENT_TO_LIST_LABEL: ErrorType = new class extends ErrorType {
}(135, "cannot assign a value to list label <arg>", ErrorSeverity.ERROR,S`ASSIGNMENT_TO_LIST_LABEL`, 70);
	/**
	 * Compiler Error 136.
	 *
	 * <p>return value <em>name</em> conflicts with rule with same name</p>
	 */
	public static readonly RETVAL_CONFLICTS_WITH_RULE: ErrorType = new class extends ErrorType {
}(136, "return value <arg> conflicts with rule with same name", ErrorSeverity.ERROR,S`RETVAL_CONFLICTS_WITH_RULE`, 71);
	/**
	 * Compiler Error 137.
	 *
	 * <p>return value <em>name</em> conflicts with token with same name</p>
	 */
	public static readonly RETVAL_CONFLICTS_WITH_TOKEN: ErrorType = new class extends ErrorType {
}(137, "return value <arg> conflicts with token with same name", ErrorSeverity.ERROR,S`RETVAL_CONFLICTS_WITH_TOKEN`, 72);
	/**
	 * Compiler Error 138.
	 *
	 * <p>parameter <em>parameter</em> conflicts with rule with same name</p>
	 */
	public static readonly ARG_CONFLICTS_WITH_RULE: ErrorType = new class extends ErrorType {
}(138, "parameter <arg> conflicts with rule with same name", ErrorSeverity.ERROR,S`ARG_CONFLICTS_WITH_RULE`, 73);
	/**
	 * Compiler Error 139.
	 *
	 * <p>parameter <em>parameter</em> conflicts with token with same name</p>
	 */
	public static readonly ARG_CONFLICTS_WITH_TOKEN: ErrorType = new class extends ErrorType {
}(139, "parameter <arg> conflicts with token with same name", ErrorSeverity.ERROR,S`ARG_CONFLICTS_WITH_TOKEN`, 74);
	/**
	 * Compiler Error 140.
	 *
	 * <p>local <em>local</em> conflicts with rule with same name</p>
	 */
	public static readonly LOCAL_CONFLICTS_WITH_RULE: ErrorType = new class extends ErrorType {
}(140, "local <arg> conflicts with rule with same name", ErrorSeverity.ERROR,S`LOCAL_CONFLICTS_WITH_RULE`, 75);
	/**
	 * Compiler Error 141.
	 *
	 * <p>local <em>local</em> conflicts with rule token same name</p>
	 */
	public static readonly LOCAL_CONFLICTS_WITH_TOKEN: ErrorType = new class extends ErrorType {
}(141, "local <arg> conflicts with rule token same name", ErrorSeverity.ERROR,S`LOCAL_CONFLICTS_WITH_TOKEN`, 76);
	/**
	 * Compiler Error 142.
	 *
	 * <p>local <em>local</em> conflicts with parameter with same name</p>
	 */
	public static readonly LOCAL_CONFLICTS_WITH_ARG: ErrorType = new class extends ErrorType {
}(142, "local <arg> conflicts with parameter with same name", ErrorSeverity.ERROR,S`LOCAL_CONFLICTS_WITH_ARG`, 77);
	/**
	 * Compiler Error 143.
	 *
	 * <p>local <em>local</em> conflicts with return value with same name</p>
	 */
	public static readonly LOCAL_CONFLICTS_WITH_RETVAL: ErrorType = new class extends ErrorType {
}(143, "local <arg> conflicts with return value with same name", ErrorSeverity.ERROR,S`LOCAL_CONFLICTS_WITH_RETVAL`, 78);
	/**
	 * Compiler Error 144.
	 *
	 * <p>
	 * multi-character literals are not allowed in lexer sets:
	 * <em>literal</em></p>
	 */
	public static readonly INVALID_LITERAL_IN_LEXER_SET: ErrorType = new class extends ErrorType {
}(144, "multi-character literals are not allowed in lexer sets: <arg>", ErrorSeverity.ERROR,S`INVALID_LITERAL_IN_LEXER_SET`, 79);
	/**
	 * Compiler Error 145.
	 *
	 * <p>
	 * lexer mode <em>mode</em> must contain at least one non-fragment
	 * rule</p>
	 *
	 * <p>
	 * Every lexer mode must contain at least one rule which is not declared
	 * with the {@code fragment} modifier.</p>
	 */
	public static readonly MODE_WITHOUT_RULES: ErrorType = new class extends ErrorType {
}(145, "lexer mode <arg> must contain at least one non-fragment rule", ErrorSeverity.ERROR,S`MODE_WITHOUT_RULES`, 80);
	/**
	 * Compiler Warning 146.
	 *
	 * <p>non-fragment lexer rule <em>rule</em> can match the empty string</p>
	 *
	 * <p>All non-fragment lexer rules must match at least one character.</p>
	 *
	 * <p>The following example shows this error.</p>
	 *
	 * <pre>
	 * Whitespace : [ \t]+;  // ok
	 * Whitespace : [ \t];   // ok
	 *
	 * fragment WS : [ \t]*; // ok
	 *
	 * Whitespace : [ \t]*;  // error 146
	 * </pre>
	 */
	public static readonly EPSILON_TOKEN: ErrorType = new class extends ErrorType {
}(146, "non-fragment lexer rule <arg> can match the empty string", ErrorSeverity.WARNING,S`EPSILON_TOKEN`, 81);
	/**
	 * Compiler Error 147.
	 *
	 * <p>
	 * left recursive rule <em>rule</em> must contain an alternative which is
	 * not left recursive</p>
	 *
	 * <p>Left-recursive rules must contain at least one alternative which is not
	 * left recursive.</p>
	 *
	 * <p>The following rule produces this error.</p>
	 *
	 * <pre>
	 * // error 147:
	 * a : a ID
	 *   | a INT
	 *   ;
	 * </pre>
	 */
	public static readonly NO_NON_LR_ALTS: ErrorType = new class extends ErrorType {
}(147, "left recursive rule <arg> must contain an alternative which is not left recursive", ErrorSeverity.ERROR,S`NO_NON_LR_ALTS`, 82);
	/**
	 * Compiler Error 148.
	 *
	 * <p>
	 * left recursive rule <em>rule</em> contains a left recursive alternative
	 * which can be followed by the empty string</p>
	 *
	 * <p>In left-recursive rules, all left-recursive alternatives must match at
	 * least one symbol following the recursive rule invocation.</p>
	 *
	 * <p>The following rule produces this error.</p>
	 *
	 * <pre>
	 * a : ID    // ok        (alternative is not left recursive)
	 *   | a INT // ok        (a must be follow by INT)
	 *   | a ID? // error 148 (the ID following a is optional)
	 *   ;
	 * </pre>
	 */
	public static readonly EPSILON_LR_FOLLOW: ErrorType = new class extends ErrorType {
}(148, "left recursive rule <arg> contains a left recursive alternative which can be followed by the empty string", ErrorSeverity.ERROR,S`EPSILON_LR_FOLLOW`, 83);
	/**
	 * Compiler Error 149.
	 *
	 * <p>
	 * lexer command <em>command</em> does not exist or is not supported by
	 * the current target</p>
	 *
	 * <p>Each lexer command requires an explicit implementation in the target
	 * templates. This error indicates that the command was incorrectly written
	 * or is not supported by the current target.</p>
	 *
	 * <p>The following rule produces this error.</p>
	 *
	 * <pre>
	 * X : 'foo' -&gt; type(Foo);  // ok
	 * Y : 'foo' -&gt; token(Foo); // error 149 (token is not a supported lexer command)
	 * </pre>
	 *
	 * @since 4.1
	 */
	public static readonly INVALID_LEXER_COMMAND: ErrorType = new class extends ErrorType {
}(149, "lexer command <arg> does not exist or is not supported by the current target", ErrorSeverity.ERROR,S`INVALID_LEXER_COMMAND`, 84);
	/**
	 * Compiler Error 150.
	 *
	 * <p>missing argument for lexer command <em>command</em></p>
	 *
	 * <p>Some lexer commands require an argument.</p>
	 *
	 * <p>The following rule produces this error.</p>
	 *
	 * <pre>
	 * X : 'foo' -&gt; type(Foo); // ok
	 * Y : 'foo' -&gt; type;      // error 150 (the type command requires an argument)
	 * </pre>
	 *
	 * @since 4.1
	 */
	public static readonly MISSING_LEXER_COMMAND_ARGUMENT: ErrorType = new class extends ErrorType {
}(150, "missing argument for lexer command <arg>", ErrorSeverity.ERROR,S`MISSING_LEXER_COMMAND_ARGUMENT`, 85);
	/**
	 * Compiler Error 151.
	 *
	 * <p>lexer command <em>command</em> does not take any arguments</p>
	 *
	 * <p>A lexer command which does not take parameters was invoked with an
	 * argument.</p>
	 *
	 * <p>The following rule produces this error.</p>
	 *
	 * <pre>
	 * X : 'foo' -&gt; popMode;    // ok
	 * Y : 'foo' -&gt; popMode(A); // error 151 (the popMode command does not take an argument)
	 * </pre>
	 *
	 * @since 4.1
	 */
	public static readonly UNWANTED_LEXER_COMMAND_ARGUMENT: ErrorType = new class extends ErrorType {
}(151, "lexer command <arg> does not take any arguments", ErrorSeverity.ERROR,S`UNWANTED_LEXER_COMMAND_ARGUMENT`, 86);
	/**
	 * Compiler Error 152.
	 *
	 * <p>unterminated string literal</p>
	 *
	 * <p>The grammar contains an unterminated string literal.</p>
	 *
	 * <p>The following rule produces this error.</p>
	 *
	 * <pre>
	 * x : 'x'; // ok
	 * y : 'y';  // error 152
	 * </pre>
	 *
	 * @since 4.1
	 */
	public static readonly UNTERMINATED_STRING_LITERAL: ErrorType = new class extends ErrorType {
}(152, "unterminated string literal", ErrorSeverity.ERROR,S`UNTERMINATED_STRING_LITERAL`, 87);
	/**
	 * Compiler Error 153.
	 *
	 * <p>
	 * rule <em>rule</em> contains a closure with at least one alternative
	 * that can match an empty string</p>
	 *
	 * <p>A rule contains a closure ({@code (...)*}) or positive closure
	 * ({@code (...)+}) around an empty alternative.</p>
	 *
	 * <p>The following rule produces this error.</p>
	 *
	 * <pre>
	 * x  : ;
	 * y  : x+;                                // error 153
	 * z1 : ('foo' | 'bar'? 'bar2'?)*;         // error 153
	 * z2 : ('foo' | 'bar' 'bar2'? | 'bar2')*; // ok
	 * </pre>
	 *
	 * @since 4.1
	 */
	public static readonly EPSILON_CLOSURE: ErrorType = new class extends ErrorType {
}(153, "rule <arg> contains a closure with at least one alternative that can match an empty string", ErrorSeverity.ERROR,S`EPSILON_CLOSURE`, 88);
	/**
	 * Compiler Warning 154.
	 *
	 * <p>
	 * rule <em>rule</em> contains an optional block with at least one
	 * alternative that can match an empty string</p>
	 *
	 * <p>A rule contains an optional block ({@code (...)?}) around an empty
	 * alternative.</p>
	 *
	 * <p>The following rule produces this warning.</p>
	 *
	 * <pre>
	 * x  : ;
	 * y  : x?;                                // warning 154
	 * z1 : ('foo' | 'bar'? 'bar2'?)?;         // warning 154
	 * z2 : ('foo' | 'bar' 'bar2'? | 'bar2')?; // ok
	 * </pre>
	 *
	 * @since 4.1
	 */
	public static readonly EPSILON_OPTIONAL: ErrorType = new class extends ErrorType {
}(154, "rule <arg> contains an optional block with at least one alternative that can match an empty string", ErrorSeverity.WARNING,S`EPSILON_OPTIONAL`, 89);
	/**
	 * Compiler Warning 155.
	 *
	 * <p>
	 * rule <em>rule</em> contains a lexer command with an unrecognized
	 * constant value; lexer interpreters may produce incorrect output</p>
	 *
	 * <p>A lexer rule contains a standard lexer command, but the constant value
	 * argument for the command is an unrecognized string. As a result, the
	 * lexer command will be translated as a custom lexer action, preventing the
	 * command from executing in some interpreted modes. The output of the lexer
	 * interpreter may not match the output of the generated lexer.</p>
	 *
	 * <p>The following rule produces this warning.</p>
	 *
	 * <pre>
	 * &#064;members {
	 * public static final int CUSTOM = HIDDEN + 1;
	 * }
	 *
	 * X : 'foo' -&gt; channel(HIDDEN);           // ok
	 * Y : 'bar' -&gt; channel(CUSTOM);           // warning 155
	 * </pre>
	 *
	 * @since 4.2
	 */
	public static readonly UNKNOWN_LEXER_CONSTANT: ErrorType = new class extends ErrorType {
}(155, "rule <arg> contains a lexer command with an unrecognized constant value; lexer interpreters may produce incorrect output", ErrorSeverity.WARNING,S`UNKNOWN_LEXER_CONSTANT`, 90);
	/**
	 * Compiler Error 156.
	 *
	 * <p>invalid escape sequence</p>
	 *
	 * <p>The grammar contains a string literal with an invalid escape sequence.</p>
	 *
	 * <p>The following rule produces this error.</p>
	 *
	 * <pre>
	 * x : 'x';  // ok
	 * y : '\u005Cu'; // error 156
	 * </pre>
	 *
	 * @since 4.2.1
	 */
	public static readonly INVALID_ESCAPE_SEQUENCE: ErrorType = new class extends ErrorType {
}(156, "invalid escape sequence <arg>", ErrorSeverity.ERROR,S`INVALID_ESCAPE_SEQUENCE`, 91);
	/**
	 * Compiler Warning 157.
	 *
	 * <p>rule <em>rule</em> contains an assoc element option in an
	 * unrecognized location</p>
	 *
	 * <p>
	 * In ANTLR 4.2, the position of the {@code assoc} element option was moved
	 * from the operator terminal(s) to the alternative itself. This warning is
	 * reported when an {@code assoc} element option is specified on a grammar
	 * element that is not recognized by the current version of ANTLR, and as a
	 * result will simply be ignored.
	 * </p>
	 *
	 * <p>The following rule produces this warning.</p>
	 *
	 * <pre>
	 * x : 'x'
	 *   | x '+'&lt;assoc=right&gt; x   // warning 157
	 *   |&lt;assoc=right&gt; x * x   // ok
	 *   ;
	 * </pre>
	 *
	 * @since 4.2.1
	 */
	public static readonly UNRECOGNIZED_ASSOC_OPTION: ErrorType = new class extends ErrorType {
}(157, "rule <arg> contains an assoc terminal option in an unrecognized location", ErrorSeverity.WARNING,S`UNRECOGNIZED_ASSOC_OPTION`, 92);
	/**
	 * Compiler Warning 158.
	 *
	 * <p>fragment rule <em>rule</em> contains an action or command which can
	 * never be executed</p>
	 *
	 * <p>A lexer rule which is marked with the {@code fragment} modifier
	 * contains an embedded action or lexer command. ANTLR lexers only execute
	 * commands and embedded actions located in the top-level matched rule.
	 * Since fragment rules can never be the top-level rule matched by a lexer,
	 * actions or commands placed in these rules can never be executed during
	 * the lexing process.</p>
	 *
	 * <p>The following rule produces this warning.</p>
	 *
	 * <pre>
	 * X1 : 'x' -&gt; more    // ok
	 *    ;
	 * Y1 : 'x' {more();}  // ok
	 *    ;
	 * fragment
	 * X2 : 'x' -&gt; more    // warning 158
	 *    ;
	 * fragment
	 * Y2 : 'x' {more();}  // warning 158
	 *    ;
	 * </pre>
	 *
	 * @since 4.2.1
	 */
	public static readonly FRAGMENT_ACTION_IGNORED: ErrorType = new class extends ErrorType {
}(158, "fragment rule <arg> contains an action or command which can never be executed", ErrorSeverity.WARNING,S`FRAGMENT_ACTION_IGNORED`, 93);
	/**
	 * Compiler Error 159.
	 *
	 * <p>cannot declare a rule with reserved name <em>rule</em></p>
	 *
	 * <p>A rule was declared with a reserved name.</p>
	 *
	 * <p>The following rule produces this error.</p>
	 *
	 * <pre>
	 * EOF :  ' '   // error 159 (EOF is a reserved name)
	 *     ;
	 * </pre>
	 *
	 * @since 4.2.1
	 */
	public static readonly RESERVED_RULE_NAME: ErrorType = new class extends ErrorType {
}(159, "cannot declare a rule with reserved name <arg>", ErrorSeverity.ERROR,S`RESERVED_RULE_NAME`, 94);
	/**
	 * Compiler Error 160.
	 *
	 * <p>reference to parser rule <em>rule</em> in lexer rule <em>name</em></p>
	 *
	 * @see #UNDEFINED_RULE_REF
	 */
	public static readonly PARSER_RULE_REF_IN_LEXER_RULE: ErrorType = new class extends ErrorType {
}(160, "reference to parser rule <arg> in lexer rule <arg2>", ErrorSeverity.ERROR,S`PARSER_RULE_REF_IN_LEXER_RULE`, 95);
	/**
	 * Compiler Error 161.
	 *
	 * <p>channel <em>name</em> conflicts with token with same name</p>
	 */
	public static readonly CHANNEL_CONFLICTS_WITH_TOKEN: ErrorType = new class extends ErrorType {
}(161, "channel <arg> conflicts with token with same name", ErrorSeverity.ERROR,S`CHANNEL_CONFLICTS_WITH_TOKEN`, 96);
	/**
	 * Compiler Error 162.
	 *
	 * <p>channel <em>name</em> conflicts with mode with same name</p>
	 */
	public static readonly CHANNEL_CONFLICTS_WITH_MODE: ErrorType = new class extends ErrorType {
}(162, "channel <arg> conflicts with mode with same name", ErrorSeverity.ERROR,S`CHANNEL_CONFLICTS_WITH_MODE`, 97);
	/**
	 * Compiler Error 163.
	 *
	 * <p>custom channels are not supported in parser grammars</p>
	 */
	public static readonly CHANNELS_BLOCK_IN_PARSER_GRAMMAR: ErrorType = new class extends ErrorType {
}(163, "custom channels are not supported in parser grammars", ErrorSeverity.ERROR,S`CHANNELS_BLOCK_IN_PARSER_GRAMMAR`, 98);
	/**
	 * Compiler Error 164.
	 *
	 * <p>custom channels are not supported in combined grammars</p>
	 */
	public static readonly CHANNELS_BLOCK_IN_COMBINED_GRAMMAR: ErrorType = new class extends ErrorType {
}(164, "custom channels are not supported in combined grammars", ErrorSeverity.ERROR,S`CHANNELS_BLOCK_IN_COMBINED_GRAMMAR`, 99);

	public static readonly NONCONFORMING_LR_RULE: ErrorType = new class extends ErrorType {
}(169, "rule <arg> is left recursive but doesn't conform to a pattern ANTLR can handle", ErrorSeverity.ERROR,S`NONCONFORMING_LR_RULE`, 100);
	/**
	 * Compiler Error 170.
	 *
	 * <pre>
	 * mode M1;
	 * A1: 'a'; // ok
	 * mode M2;
	 * A2: 'a'; // ok
	 * M1: 'b'; // error 170
	 * </pre>
	 *
	 * <p>mode <em>name</em> conflicts with token with same name</p>
	 */
	public static readonly MODE_CONFLICTS_WITH_TOKEN: ErrorType = new class extends ErrorType {
}(170, "mode <arg> conflicts with token with same name", ErrorSeverity.ERROR,S`MODE_CONFLICTS_WITH_TOKEN`, 101);
	/**
	 * Compiler Error 171.
	 *
	 * <p>can not use or declare token with reserved name</p>
	 *
	 * <p>Reserved names: HIDDEN, DEFAULT_TOKEN_CHANNEL, SKIP, MORE, MAX_CHAR_VALUE, MIN_CHAR_VALUE.
	 *
	 * <p>Can be used but cannot be declared: EOF</p>
	 */
	public static readonly TOKEN_CONFLICTS_WITH_COMMON_CONSTANTS: ErrorType = new class extends ErrorType {
}(171, "cannot use or declare token with reserved name <arg>", ErrorSeverity.ERROR,S`TOKEN_CONFLICTS_WITH_COMMON_CONSTANTS`, 102);
	/**
	 * Compiler Error 172.
	 *
	 * <p>can not use or declare channel with reserved name</p>
	 *
	 * <p>Reserved names: DEFAULT_MODE, SKIP, MORE, EOF, MAX_CHAR_VALUE, MIN_CHAR_VALUE.
	 *
	 * <p>Can be used but cannot be declared: HIDDEN, DEFAULT_TOKEN_CHANNEL</p>
	 */
	public static readonly CHANNEL_CONFLICTS_WITH_COMMON_CONSTANTS: ErrorType = new class extends ErrorType {
}(172, "cannot use or declare channel with reserved name <arg>", ErrorSeverity.ERROR,S`CHANNEL_CONFLICTS_WITH_COMMON_CONSTANTS`, 103);
	/**
	 * Compiler Error 173.
	 *
	 * <p>can not use or declare mode with reserved name</p>
	 *
	 * <p>Reserved names: HIDDEN, DEFAULT_TOKEN_CHANNEL, SKIP, MORE, MAX_CHAR_VALUE, MIN_CHAR_VALUE.
	 *
	 * <p>Can be used and cannot declared: DEFAULT_MODE</p>
	 */
	public static readonly MODE_CONFLICTS_WITH_COMMON_CONSTANTS: ErrorType = new class extends ErrorType {
}(173, "cannot use or declare mode with reserved name <arg>", ErrorSeverity.ERROR,S`MODE_CONFLICTS_WITH_COMMON_CONSTANTS`, 104);
	/**
	 * Compiler Error 174.
	 *
	 * <p>empty strings and sets not allowed</p>
	 *
	 * <pre>
	 * A: '''test''';
	 * B: '';
	 * C: 'test' '';
	 * D: [];
	 * E: [f-a];
	 * </pre>
	 */
	public static readonly EMPTY_STRINGS_AND_SETS_NOT_ALLOWED: ErrorType = new class extends ErrorType {
}(174, "string literals and sets cannot be empty: <arg>", ErrorSeverity.ERROR,S`EMPTY_STRINGS_AND_SETS_NOT_ALLOWED`, 105);
	/**
	 * Compiler Error 175.
	 *
	 * <p><em>name</em> is not a recognized token name</p>
	 *
	 * <pre>TOKEN: 'a' -> type(CHANNEL1); // error 175</pre>
	 */
	public static readonly CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_TOKEN_NAME: ErrorType = new class extends ErrorType {
}(175, "<arg> is not a recognized token name", ErrorSeverity.ERROR,S`CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_TOKEN_NAME`, 106);
	/**
	 * Compiler Error 176.
	 *
	 * <p><em>name</em>is not a recognized mode name</p>
	 *
	 * <pre>TOKEN: 'a' -> mode(MODE1); // error 176</pre>
	 */
	public static readonly CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_MODE_NAME: ErrorType = new class extends ErrorType {
}(176, "<arg> is not a recognized mode name", ErrorSeverity.ERROR,S`CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_MODE_NAME`, 107);
	/**
	 * Compiler Error 177.
	 *
	 * <p><em>name</em> is not a recognized channel name</p>
	 *
	 * <pre>TOKEN: 'a' -> channel(TOKEN1); // error 177</pre>
	 */
	public static readonly CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_CHANNEL_NAME: ErrorType = new class extends ErrorType {
}(177, "<arg> is not a recognized channel name", ErrorSeverity.ERROR,S`CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_CHANNEL_NAME`, 108);
	/*
	* Compiler Warning 178.
	*
	* <p>lexer rule has a duplicated commands</p>
	*
	* <p>TOKEN: 'asdf' -> mode(MODE1), mode(MODE2);</p>
	* */
	public static readonly DUPLICATED_COMMAND: ErrorType = new class extends ErrorType {
}(178, "duplicated command <arg>", ErrorSeverity.WARNING,S`DUPLICATED_COMMAND`, 109);
	/*
	* Compiler Waring 179.
	*
	* <p>incompatible commands <em>command1</em> and <em>command2</em></p>
	*
	* <p>T00: 'a00' -> skip, more;</p>
	 */
	public static readonly INCOMPATIBLE_COMMANDS: ErrorType = new class extends ErrorType {
}(179, "incompatible commands <arg> and <arg2>", ErrorSeverity.WARNING,S`INCOMPATIBLE_COMMANDS`, 110);
	/**
	 * Compiler Warning 180.
	 *
	 * <p>chars "a-f" used multiple times in set [a-fc-m]</p>
	 *
	 * <pre>
	 * A:    [aa-z];   // warning
	 * B:    [a-fc-m]; // warning
	 * </pre>
	 *
	 * TODO: Does not work with fragment rules.
	 */
	public static readonly CHARACTERS_COLLISION_IN_SET: ErrorType = new class extends ErrorType {
}(180, "chars <arg> used multiple times in set <arg2>", ErrorSeverity.WARNING,S`CHARACTERS_COLLISION_IN_SET`, 111);

	/**
	 * Compiler Warning 181
	 *
	 * <p>The token range operator makes no sense in the parser as token types
	 * are not ordered (except in implementation).
	 * </p>
	 *
	 * <pre>
	 * grammar T;
	 * a : 'A'..'Z' ;
	 * </pre>
	 *
	 */
	public static readonly TOKEN_RANGE_IN_PARSER: ErrorType = new class extends ErrorType {
}(181, "token ranges not allowed in parser: <arg>..<arg2>", ErrorSeverity.ERROR,S`TOKEN_RANGE_IN_PARSER`, 112);

	/**
	 * Compiler Error 182.
	 *
	 * <p>Unicode properties cannot be part of a lexer charset range</p>
	 *
	 * <pre>
	 * A: [\\p{Letter}-\\p{Number}];
	 * </pre>
	 */
	public static readonly UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE: ErrorType = new class extends ErrorType {
}(
			182,
			"unicode property escapes not allowed in lexer charset range: <arg>",
			ErrorSeverity.ERROR,S`UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE`, 113);

	/**
	 * Compiler Warning 184.
	 *
	 * <p>The token value overlapped by another token or self</p>
	 *
	 * <pre>
	 * TOKEN1: 'value';
	 * TOKEN2: 'value'; // warning
	 * </pre>
	 */
	public static readonly TOKEN_UNREACHABLE: ErrorType = new class extends ErrorType {
}(
			184,
			"One of the token <arg> values unreachable. <arg2> is always overlapped by token <arg3>",
			ErrorSeverity.WARNING,S`TOKEN_UNREACHABLE`, 114);

	/**
	 * <p>Range probably contains not implied characters. Both bounds should be defined in lower or UPPER case
	 * For instance, the range [A-z] (ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxy)
	 * probably contains not implied characters: [\]^_`
	 *
	 * Use the following definition: [A-Za-z]
	 * If the characters are implied, include them explicitly: [A-Za-z[\\\]^_`]
	 * </p>
	 *
	 * <pre>
	 * TOKEN: [A-z]; // warning
	 * </pre>
	 */
	public static readonly RANGE_PROBABLY_CONTAINS_NOT_IMPLIED_CHARACTERS: ErrorType = new class extends ErrorType {
}(
			185,
			"Range <arg>..<arg2> probably contains not implied characters <arg3>. Both bounds should be defined in lower or UPPER case",
			ErrorSeverity.WARNING
	,S`RANGE_PROBABLY_CONTAINS_NOT_IMPLIED_CHARACTERS`, 115);

	/**
	 * <p>
	 * rule <em>rule</em> contains a closure with at least one alternative
	 * that can match EOF</p>
	 *
	 * <p>A rule contains a closure ({@code (...)*}) or positive closure
	 * ({@code (...)+}) around EOF.</p>
	 *
	 * <p>The following rule produces this error.</p>
	 *
	 * <pre>
	 * x : EOF*;         // error
	 * y : EOF+;         // error
	 * z : EOF;         // ok
	 * </pre>
	 */
	public static readonly EOF_CLOSURE: ErrorType = new class extends ErrorType {
}(
			186,
			"rule <arg> contains a closure with at least one alternative that can match EOF",
			ErrorSeverity.ERROR
	,S`EOF_CLOSURE`, 116);

	/**
	 * <p>Redundant caseInsensitive lexer rule option</p>
	 *
	 * <pre>
	 * options { caseInsensitive=true; }
	 * TOKEN options { caseInsensitive=true; } : [a-z]+ -> caseInsensitive(true); // warning
	 * </pre>
	 */
	public static readonly REDUNDANT_CASE_INSENSITIVE_LEXER_RULE_OPTION: ErrorType = new class extends ErrorType {
}(
			187,
			"caseInsensitive lexer rule option is redundant because its value equals to global value (<arg>)",
			ErrorSeverity.WARNING
	,S`REDUNDANT_CASE_INSENSITIVE_LEXER_RULE_OPTION`, 117);

	/*
	 * Backward incompatibility errors
	 */

	/**
	 * Compiler Error 200.
	 *
	 * <p>tree grammars are not supported in ANTLR 4</p>
	 *
	 * <p>
	 * This error message is provided as a compatibility notice for users
	 * migrating from ANTLR 3. ANTLR 4 does not support tree grammars, but
	 * instead offers automatically generated parse tree listeners and visitors
	 * as a more maintainable alternative.</p>
	 */
	/* @Deprecated */
	public static readonly V3_TREE_GRAMMAR: ErrorType = new class extends ErrorType {
}(200, "tree grammars are not supported in ANTLR 4", ErrorSeverity.ERROR,S`V3_TREE_GRAMMAR`, 118);
	/**
	 * Compiler Warning 201.
	 *
	 * <p>
	 * labels in lexer rules are not supported in ANTLR 4; actions cannot
	 * reference elements of lexical rules but you can use
	 * {@link Lexer#getText()} to get the entire text matched for the rule</p>
	 *
	 * <p>
	 * ANTLR 4 uses a DFA for recognition of entire tokens, resulting in faster
	 * and smaller lexers than ANTLR 3 produced. As a result, sub-rules
	 * referenced within lexer rules are not tracked independently, and cannot
	 * be assigned to labels.</p>
	 */
	/* @Deprecated */
	public static readonly V3_LEXER_LABEL: ErrorType = new class extends ErrorType {
}(201, "labels in lexer rules are not supported in ANTLR 4; " +
		"actions cannot reference elements of lexical rules but you can use " +
		"getText() to get the entire text matched for the rule", ErrorSeverity.WARNING,S`V3_LEXER_LABEL`, 119);
	/**
	 * Compiler Warning 202.
	 *
	 * <p>
	 * {@code tokens {A; B;}} syntax is now {@code tokens {A, B}} in ANTLR
	 * 4</p>
	 *
	 * <p>
	 * ANTLR 4 uses comma-separated token declarations in the {@code tokens{}}
	 * block. This warning appears when the tokens block is written using the
	 * ANTLR 3 syntax of semicolon-terminated token declarations.</p>
	 *
	 * <p>
	 * <strong>NOTE:</strong> ANTLR 4 does not allow a trailing comma to appear following the
	 * last token declared in the {@code tokens{}} block.</p>
	 */
	/* @Deprecated */
	public static readonly V3_TOKENS_SYNTAX: ErrorType = new class extends ErrorType {
}(202, "tokens {A; B;} syntax is now tokens {A, B} in ANTLR 4", ErrorSeverity.WARNING,S`V3_TOKENS_SYNTAX`, 120);
	/**
	 * Compiler Error 203.
	 *
	 * <p>
	 * assignments in {@code tokens{}} are not supported in ANTLR 4; use lexical
	 * rule <em>TokenName</em> : <em>LiteralValue</em>; instead</p>
	 *
	 * <p>
	 * ANTLR 3 allowed literal tokens to be declared and assigned a value within
	 * the {@code tokens{}} block. ANTLR 4 no longer offers this syntax. When
	 * migrating a grammar from ANTLR 3 to ANTLR 4, any tokens with a literal
	 * value declared in the {@code tokens{}} block should be converted to
	 * standard lexer rules.</p>
	 */
	/* @Deprecated */
	public static readonly V3_ASSIGN_IN_TOKENS: ErrorType = new class extends ErrorType {
}(203, "assignments in tokens{} are not supported in ANTLR 4; use lexical rule <arg> : <arg2>; instead", ErrorSeverity.ERROR,S`V3_ASSIGN_IN_TOKENS`, 121);
	/**
	 * Compiler Warning 204.
	 *
	 * <p>
	 * {@code {...}?=>} explicitly gated semantic predicates are deprecated in
	 * ANTLR 4; use {@code {...}?} instead</p>
	 *
	 * <p>
	 * ANTLR 4 treats semantic predicates consistently in a manner similar to
	 * gated semantic predicates in ANTLR 3. When migrating a grammar from ANTLR
	 * 3 to ANTLR 4, all uses of the gated semantic predicate syntax can be
	 * safely converted to the standard semantic predicated syntax, which is the
	 * only form used by ANTLR 4.</p>
	 */
	/* @Deprecated */
	public static readonly V3_GATED_SEMPRED: ErrorType = new class extends ErrorType {
}(204, "{...}?=> explicitly gated semantic predicates are deprecated in ANTLR 4; use {...}? instead", ErrorSeverity.WARNING,S`V3_GATED_SEMPRED`, 122);
	/**
	 * Compiler Error 205.
	 *
	 * <p>{@code (...)=>} syntactic predicates are not supported in ANTLR 4</p>
	 *
	 * <p>
	 * ANTLR 4's improved lookahead algorithms do not require the use of
	 * syntactic predicates to disambiguate long lookahead sequences. The
	 * syntactic predicates should be removed when migrating a grammar from
	 * ANTLR 3 to ANTLR 4.</p>
	 */
	/* @Deprecated */
	public static readonly V3_SYNPRED: ErrorType = new class extends ErrorType {
}(205, "(...)=> syntactic predicates are not supported in ANTLR 4", ErrorSeverity.ERROR,S`V3_SYNPRED`, 123),

    // Dependency sorting errors

    /* t1.g4 -> t2.g4 -> t3.g4 ->t1.g4 */
    //CIRCULAR_DEPENDENCY(200, "your grammars contain a circular dependency and cannot be sorted into a valid build order", ErrorSeverity.ERROR),
	;

	/**
	 * The error or warning message, in StringTemplate 4 format using {@code <}
	 * and {@code >} as the delimiters. Arguments for the message may be
	 * referenced using the following names:
	 *
	 * <ul>
	 * <li>{@code arg}: The first template argument</li>
	 * <li>{@code arg2}: The second template argument</li>
	 * <li>{@code arg3}: The third template argument</li>
	 * <li>{@code verbose}: {@code true} if verbose messages were requested; otherwise, {@code false}</li>
	 * <li>{@code exception}: The exception which resulted in the error, if any.</li>
	 * <li>{@code stackTrace}: The stack trace for the exception, when available.</li>
	 * </ul>
	 */
	public readonly  msg:  string;
	/**
	 * The error or warning number.
	 *
	 * <p>The code should be unique, and following its
	 * use in a release should not be altered or reassigned.</p>
	 */
    public readonly  code:  number;
	/**
	 * The error severity.
	 */
    public readonly  severity:  ErrorSeverity;

	/**
	 * Constructs a new {@link ErrorType} with the specified code, message, and
	 * severity.
	 *
	 * @param code The unique error number.
	 * @param msg The error message template.
	 * @param severity The error severity.
	 */
	protected constructor(code: number, msg: string, severity: ErrorSeverity, $name$: java.lang.String, $index$: number) {
        this.code = code;
		this.msg = msg;
        this.severity = severity;
	}
}
