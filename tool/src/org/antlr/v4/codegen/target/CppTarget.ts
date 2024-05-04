/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { CodeGenerator } from "../CodeGenerator.js";
import { Target } from "../Target.js";
import { HashMap, HashSet } from "antlr4ng";

export  class CppTarget extends Target {
    protected static readonly  targetCharValueEscape:  Map<Character, string>;

    protected static readonly  reservedWords =  new  HashSet(java.util.Arrays.asList(
        "alignas", "alignof", "and", "and_eq", "asm", "auto", "bitand",
        "bitor", "bool", "break", "case", "catch", "char", "char16_t",
        "char32_t", "class", "compl", "concept", "const", "constexpr",
        "const_cast", "continue", "decltype", "default", "delete", "do",
        "double", "dynamic_cast", "else", "enum", "explicit", "export",
        "extern", "false", "float", "for", "friend", "goto", "if",
        "inline", "int", "long", "mutable", "namespace", "new",
        "noexcept", "not", "not_eq", "nullptr", "NULL", "operator", "or",
        "or_eq", "private", "protected", "public", "register",
        "reinterpret_cast", "requires", "return", "short", "signed",
        "sizeof", "static", "static_assert", "static_cast", "struct",
        "switch", "template", "this", "thread_local", "throw", "true",
        "try", "typedef", "typeid", "typename", "union", "unsigned",
        "using", "virtual", "void", "volatile", "wchar_t", "while",
        "xor", "xor_eq",

        "rule", "parserRule",
    ));

    public  constructor(gen: CodeGenerator) {
        super(gen);
    }

    @Override
    public override  getTargetCharValueEscape():  Map<Character, string> {
        return CppTarget.targetCharValueEscape;
    }

    public override  needsHeader():  boolean { return true; }

    @Override
    public override  getRecognizerFileName(header: boolean):  string {
        const  extST = this.getTemplates().getInstanceOf(header ? "headerFileExtension" : "codeFileExtension");
        const  recognizerName = this.gen.g.getRecognizerName();

        return recognizerName+extST.render();
    }

    @Override
    public override  getListenerFileName(header: boolean):  string {
		/* assert gen.g.name != null; */
        const  extST = this.getTemplates().getInstanceOf(header ? "headerFileExtension" : "codeFileExtension");
        const  listenerName = this.gen.g.name + "Listener";

        return listenerName+extST.render();
    }

    @Override
    public override  getVisitorFileName(header: boolean):  string {
		/* assert gen.g.name != null; */
        const  extST = this.getTemplates().getInstanceOf(header ? "headerFileExtension" : "codeFileExtension");
        const  listenerName = this.gen.g.name + "Visitor";

        return listenerName+extST.render();
    }

    @Override
    public override  getBaseListenerFileName(header: boolean):  string {
		/* assert gen.g.name != null; */
        const  extST = this.getTemplates().getInstanceOf(header ? "headerFileExtension" : "codeFileExtension");
        const  listenerName = this.gen.g.name + "BaseListener";

        return listenerName+extST.render();
    }

    @Override
    public override  getBaseVisitorFileName(header: boolean):  string {
		/* assert gen.g.name != null; */
        const  extST = this.getTemplates().getInstanceOf(header ? "headerFileExtension" : "codeFileExtension");
        const  listenerName = this.gen.g.name + "BaseVisitor";

        return listenerName+extST.render();
    }

    @Override
    protected override  getReservedWords():  java.util.Set<string> {
        return CppTarget.reservedWords;
    }

    @Override
    protected override  shouldUseUnicodeEscapeForCodePointInDoubleQuotedString(codePoint: number):  boolean {
        if (codePoint === "?") {
			// in addition to the default escaped code points, also escape ? to prevent trigraphs
			// ideally, we would escape ? with \?, but escaping as unicode \u003F works as well
            return true;
        }
        else {
            return super.shouldUseUnicodeEscapeForCodePointInDoubleQuotedString(codePoint);
        }
    }
	 static {
		// https://stackoverflow.com/a/10220539/1046374
        const  map = new  HashMap();
        CppTarget.addEscapedChar(map, Number(0x0007), "a");
        CppTarget.addEscapedChar(map, Number(0x0008), "b");
        CppTarget.addEscapedChar(map, "\t", "t");
        CppTarget.addEscapedChar(map, "\n", "n");
        CppTarget.addEscapedChar(map, Number(0x000B), "v");
        CppTarget.addEscapedChar(map, "\f", "f");
        CppTarget.addEscapedChar(map, "\r", "r");
        CppTarget.addEscapedChar(map, Number(0x001B), "e");
        CppTarget.addEscapedChar(map, '\"');
        CppTarget.addEscapedChar(map, "'");
        CppTarget.addEscapedChar(map, "?");
        CppTarget.addEscapedChar(map, "\\");
        CppTarget.targetCharValueEscape = map;
    }
}
