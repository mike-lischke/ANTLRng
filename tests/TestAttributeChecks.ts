/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





/** */
export  class TestAttributeChecks {
    protected  attributeTemplate =
        "parser grammar A;\n"+
        "@members {<members>}\n" +
		"tokens{ID}\n" +
        "a[int x] returns [int y]\n" +
        "@init {<init>}\n" +
        "    :   id=ID ids+=ID lab=b[34] labs+=b[34] {\n" +
		"		 <inline>\n" +
		"		 }\n" +
		"		 c\n" +
        "    ;\n" +
        "    finally {<finally>}\n" +
        "b[int d] returns [int e]\n" +
        "    :   {<inline2>}\n" +
        "    ;\n" +
        "c   :   ;\n";

    protected  membersChecks = [
	    "$a",			"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:2:11: unknown attribute reference a in $a\n",
        "$a.y",			"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:2:11: unknown attribute reference a in $a.y\n",
    ];

    protected  initChecks = [
		"$text",		"",
		"$start",		"",
		"$x = $y",		"",
		"$y = $x",		"",
		"$lab.e",		"",
		"$ids",			"",
		"$labs",		"",

		"$c",			"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:5:8: unknown attribute reference c in $c\n",
		"$a.q",			"error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:5:10: unknown attribute q for rule a in $a.q\n",
    ];

	protected  inlineChecks = [
		"$text",		"",
		"$start",		"",
		"$x = $y",		"",
		"$y = $x",		"",
		"$y.b = 3;",	"",
		"$ctx.x = $ctx.y",	"",
		"$lab.e",		"",
		"$lab.text",	"",
		"$b.e",			"",
		"$c.text",      "",
		"$ID",			"",
		"$ID.text",		"",
		"$id",			"",
		"$id.text",		"",
		"$ids",			"",
		"$labs",		"",
	];

	protected  bad_inlineChecks = [
		"$lab",			"error(" + ErrorType.ISOLATED_RULE_REF.code + "): A.g4:7:4: missing attribute access on rule reference lab in $lab\n",
		"$q",           "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference q in $q\n",
		"$q.y",         "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference q in $q.y\n",
		"$q = 3",       "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference q in $q\n",
		"$q = 3;",      "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference q in $q = 3;\n",
		"$q.y = 3;",    "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference q in $q.y\n",
		"$q = $blort;", "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference q in $q = $blort;\n" +
						"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:9: unknown attribute reference blort in $blort\n",
		"$a.ick",       "error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:7:6: unknown attribute ick for rule a in $a.ick\n",
		"$a.ick = 3;",  "error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:7:6: unknown attribute ick for rule a in $a.ick\n",
		"$b.d",         "error(" + ErrorType.INVALID_RULE_PARAMETER_REF.code + "): A.g4:7:6: parameter d of rule b is not accessible in this scope: $b.d\n",  // cant see rule refs arg
		"$d.text",      "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference d in $d.text\n", // valid rule, but no ref
		"$lab.d",		"error(" + ErrorType.INVALID_RULE_PARAMETER_REF.code + "): A.g4:7:8: parameter d of rule b is not accessible in this scope: $lab.d\n",
		"$ids = null;",	"error(" + ErrorType.ASSIGNMENT_TO_LIST_LABEL.code + "): A.g4:7:4: cannot assign a value to list label ids\n",
		"$labs = null;","error(" + ErrorType.ASSIGNMENT_TO_LIST_LABEL.code + "): A.g4:7:4: cannot assign a value to list label labs\n",
	];

	protected  finallyChecks = [
		"$text",		"",
		"$start",		"",
		"$x = $y",		"",
		"$y = $x",		"",
		"$lab.e",		"",
		"$lab.text",	"",
		"$id",			"",
		"$id.text",		"",
		"$ids",			"",
		"$labs",		"",

		"$lab",			"error(" + ErrorType.ISOLATED_RULE_REF.code + "): A.g4:10:14: missing attribute access on rule reference lab in $lab\n",
		"$q",           "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference q in $q\n",
		"$q.y",         "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference q in $q.y\n",
		"$q = 3",       "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference q in $q\n",
		"$q = 3;",      "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference q in $q = 3;\n",
		"$q.y = 3;",    "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference q in $q.y\n",
		"$q = $blort;", "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference q in $q = $blort;\n" +
						"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:19: unknown attribute reference blort in $blort\n",
		"$a.ick",       "error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:10:16: unknown attribute ick for rule a in $a.ick\n",
		"$a.ick = 3;",  "error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:10:16: unknown attribute ick for rule a in $a.ick\n",
		"$b.e",			"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference b in $b.e\n", // cant see rule refs outside alts
		"$b.d",         "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference b in $b.d\n",
		"$c.text",      "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference c in $c.text\n",
		"$lab.d",		"error(" + ErrorType.INVALID_RULE_PARAMETER_REF.code + "): A.g4:10:18: parameter d of rule b is not accessible in this scope: $lab.d\n",
	];

	protected  dynMembersChecks = [
		"$S",			"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:2:11: unknown attribute reference S in $S\n",
		"$S::i",		"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:2:11: reference to undefined rule S in non-local ref $S::i\n",
		"$S::i=$S::i",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:2:11: reference to undefined rule S in non-local ref $S::i\n" +
						"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:2:17: reference to undefined rule S in non-local ref $S::i\n",

		"$b::f",		"error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:2:14: unknown attribute f for rule b in $b::f\n",
		"$S::j",		"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:2:11: reference to undefined rule S in non-local ref $S::j\n",
		"$S::j = 3;",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:2:11: reference to undefined rule S in non-local ref $S::j = 3;\n",
		"$S::j = $S::k;",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:2:11: reference to undefined rule S in non-local ref $S::j = $S::k;\n",
	];

	protected  dynInitChecks = [
		"$a",			"error(" + ErrorType.ISOLATED_RULE_REF.code + "): A.g4:5:8: missing attribute access on rule reference a in $a\n",
		"$b",			"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:5:8: unknown attribute reference b in $b\n",
		"$lab",			"error(" + ErrorType.ISOLATED_RULE_REF.code + "): A.g4:5:8: missing attribute access on rule reference lab in $lab\n",
		"$b::f",		"error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:5:11: unknown attribute f for rule b in $b::f\n",
		"$S::i",		"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:5:8: reference to undefined rule S in non-local ref $S::i\n",
		"$S::i=$S::i",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:5:8: reference to undefined rule S in non-local ref $S::i\n" +
						"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:5:14: reference to undefined rule S in non-local ref $S::i\n",
		"$a::z",		"error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:5:11: unknown attribute z for rule a in $a::z\n",
		"$S",			"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:5:8: unknown attribute reference S in $S\n",

		"$S::j",		"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:5:8: reference to undefined rule S in non-local ref $S::j\n",
		"$S::j = 3;",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:5:8: reference to undefined rule S in non-local ref $S::j = 3;\n",
		"$S::j = $S::k;",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:5:8: reference to undefined rule S in non-local ref $S::j = $S::k;\n",
	];

	protected  dynInlineChecks = [
		"$a",			"error(" + ErrorType.ISOLATED_RULE_REF.code + "): A.g4:7:4: missing attribute access on rule reference a in $a\n",
		"$b",			"error(" + ErrorType.ISOLATED_RULE_REF.code + "): A.g4:7:4: missing attribute access on rule reference b in $b\n",
		"$lab",			"error(" + ErrorType.ISOLATED_RULE_REF.code + "): A.g4:7:4: missing attribute access on rule reference lab in $lab\n",
		"$b::f",		"error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:7:7: unknown attribute f for rule b in $b::f\n",
		"$S::i",		"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:7:4: reference to undefined rule S in non-local ref $S::i\n",
		"$S::i=$S::i",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:7:4: reference to undefined rule S in non-local ref $S::i\n" +
						"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:7:10: reference to undefined rule S in non-local ref $S::i\n",
		"$a::z",		"error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:7:7: unknown attribute z for rule a in $a::z\n",

		"$S::j",			"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:7:4: reference to undefined rule S in non-local ref $S::j\n",
		"$S::j = 3;",		"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:7:4: reference to undefined rule S in non-local ref $S::j = 3;\n",
		"$S::j = $S::k;",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:7:4: reference to undefined rule S in non-local ref $S::j = $S::k;\n",
		"$Q[-1]::y",        "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference Q in $Q\n",
		"$Q[-i]::y",        "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference Q in $Q\n",
		"$Q[i]::y",    		"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference Q in $Q\n",
		"$Q[0]::y",    		"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference Q in $Q\n",
		"$Q[-1]::y = 23;",  "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference Q in $Q\n",
		"$Q[-i]::y = 23;",  "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference Q in $Q\n",
		"$Q[i]::y = 23;",   "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference Q in $Q\n",
		"$Q[0]::y = 23;",   "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference Q in $Q\n",
		"$S[-1]::y",        "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference S in $S\n",
		"$S[-i]::y",        "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference S in $S\n",
		"$S[i]::y",     	"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference S in $S\n",
		"$S[0]::y",     	"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference S in $S\n",
		"$S[-1]::y = 23;",  "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference S in $S\n",
		"$S[-i]::y = 23;",  "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference S in $S\n",
		"$S[i]::y = 23;",   "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference S in $S\n",
		"$S[0]::y = 23;",   "error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference S in $S\n",
		"$S[$S::y]::i",		"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:7:4: unknown attribute reference S in $S\n" +
							"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:7:7: reference to undefined rule S in non-local ref $S::y\n"
	];

	protected  dynFinallyChecks = [
		"$a",			"error(" + ErrorType.ISOLATED_RULE_REF.code + "): A.g4:10:14: missing attribute access on rule reference a in $a\n",
		"$b",			"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference b in $b\n",
		"$lab",			"error(" + ErrorType.ISOLATED_RULE_REF.code + "): A.g4:10:14: missing attribute access on rule reference lab in $lab\n",
		"$b::f",		"error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:10:17: unknown attribute f for rule b in $b::f\n",
		"$S",			"error(" + ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE.code + "): A.g4:10:14: unknown attribute reference S in $S\n",
		"$S::i",		"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:10:14: reference to undefined rule S in non-local ref $S::i\n",
		"$S::i=$S::i",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:10:14: reference to undefined rule S in non-local ref $S::i\n" +
						"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:10:20: reference to undefined rule S in non-local ref $S::i\n",
		"$a::z",		"error(" + ErrorType.UNKNOWN_RULE_ATTRIBUTE.code + "): A.g4:10:17: unknown attribute z for rule a in $a::z\n",

		"$S::j",		"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:10:14: reference to undefined rule S in non-local ref $S::j\n",
		"$S::j = 3;",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:10:14: reference to undefined rule S in non-local ref $S::j = 3;\n",
		"$S::j = $S::k;",	"error(" + ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF.code + "): A.g4:10:14: reference to undefined rule S in non-local ref $S::j = $S::k;\n",
	];

	private static  testActions(location: string, pairs: string[], template: string):  void {
		for (let  i = 0; i < pairs.length; i += 2) {
			let  action = pairs[i];
			let  expected = pairs[i + 1];
			let  g = new  STGroup('<', '>');
			g.setListener(new  ErrorBuffer()); // hush warnings
			let  st = new  ST(g, template);
			st.add(location, action);
			let  grammar = st.render();
			testErrors( [grammar, expected], false);
		}
	}

    @Test
public  testMembersActions():  void {
        TestAttributeChecks.testActions("members", this.membersChecks, this.attributeTemplate);
    }

    @Test
public  testDynamicMembersActions():  void {
        TestAttributeChecks.testActions("members", this.dynMembersChecks, this.attributeTemplate);
    }

    @Test
public  testInitActions():  void {
        TestAttributeChecks.testActions("init", this.initChecks, this.attributeTemplate);
    }

    @Test
public  testDynamicInitActions():  void {
        TestAttributeChecks.testActions("init", this.dynInitChecks, this.attributeTemplate);
    }

	@Test
public  testInlineActions():  void {
		TestAttributeChecks.testActions("inline", this.inlineChecks, this.attributeTemplate);
	}

	@Test
public  testDynamicInlineActions():  void {
		TestAttributeChecks.testActions("inline", this.dynInlineChecks, this.attributeTemplate);
	}

	@Test
public  testBadInlineActions():  void {
		TestAttributeChecks.testActions("inline", this.bad_inlineChecks, this.attributeTemplate);
	}

	@Test
public  testFinallyActions():  void {
		TestAttributeChecks.testActions("finally", this.finallyChecks, this.attributeTemplate);
	}

	@Test
public  testDynamicFinallyActions():  void {
		TestAttributeChecks.testActions("finally", this.dynFinallyChecks, this.attributeTemplate);
	}

	@Test
public  testTokenRef():  void {
		let  grammar =
			"parser grammar S;\n" +
			"tokens{ID}\n" +
			"a : x=ID {Token t = $x; t = $ID;} ;\n";
		let  expected =
			"";
		testErrors( [grammar, expected], false);
	}
}
