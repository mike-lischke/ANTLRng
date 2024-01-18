/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject } from "jree";
import { Vocabulary, VocabularyImpl, ATN, ATNDeserializer, ATNSerializer, IntegerList, InterpreterDataReader } from "antlr4ng";

type String = java.lang.String;
const String = java.lang.String;
type Path = java.nio.file.Path;
type Files = java.nio.file.Files;
const Files = java.nio.file.Files;
type StandardCharsets = java.nio.charset.StandardCharsets;
const StandardCharsets = java.nio.charset.StandardCharsets;
type Field = java.lang.reflect.Field;
const Field = java.lang.reflect.Field;
type List<E> = java.util.List<E>;
type Class<T> = java.lang.Class<T>;
const Class = java.lang.Class;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;

import { Test, Override } from "../../decorators.js";


/** This file represents a simple sanity checks on the parsing of the .interp file
 *  available to the Java runtime for interpreting rather than compiling and executing parsers.
 */
export class TestInterpreterDataReader extends JavaObject {
    @Test
    public testParseFile(): void {
        let g = new Grammar(
            "grammar Calc;\n" +
            "s :  expr EOF\n" +
            "  ;\n" +
            "expr\n" +
            "  :  INT            # number\n" +
            "  |  expr (MUL | DIV) expr  # multiply\n" +
            "  |  expr (ADD | SUB) expr  # add\n" +
            "  ;\n" +
            "\n" +
            "INT : [0-9]+;\n" +
            "MUL : '*';\n" +
            "DIV : '/';\n" +
            "ADD : '+';\n" +
            "SUB : '-';\n" +
            "WS : [ \\t]+ -> channel(HIDDEN);");
        let interpString = Tool.generateInterpreterData(g);
        let interpFile = Files.createTempFile(null, null);
        Files.write(interpFile, interpString.getBytes(StandardCharsets.UTF_8));

        let interpreterData = InterpreterDataReader.parseFile(interpFile.toString());
        let atnField = interpreterData.getClass().getDeclaredField("atn");
        let vocabularyField = interpreterData.getClass().getDeclaredField("vocabulary");
        let ruleNamesField = interpreterData.getClass().getDeclaredField("ruleNames");
        let channelsField = interpreterData.getClass().getDeclaredField("channels");
        let modesField = interpreterData.getClass().getDeclaredField("modes");

        atnField.setAccessible(true);
        vocabularyField.setAccessible(true);
        ruleNamesField.setAccessible(true);
        channelsField.setAccessible(true);
        modesField.setAccessible(true);

        let atn = atnField.get(interpreterData) as ATN;
        let vocabulary = vocabularyField.get(interpreterData) as Vocabulary;
        let literalNames = (vocabulary as VocabularyImpl).getLiteralNames();
        let symbolicNames = (vocabulary as VocabularyImpl).getSymbolicNames();
        let ruleNames = this.castList(ruleNamesField.get(interpreterData), String.class);
        let channels = this.castList(channelsField.get(interpreterData), String.class);
        let modes = this.castList(modesField.get(interpreterData), String.class);

        assertEquals(6, vocabulary.getMaxTokenType());
        assertArrayEquals(["s", "expr"], ruleNames.toArray());
        assertArrayEquals(["", "", "'*'", "'/'", "'+'", "'-'", ""], literalNames);
        assertArrayEquals(["", "INT", "MUL", "DIV", "ADD", "SUB", "WS"], symbolicNames);
        assertNull(channels);
        assertNull(modes);

        let serialized = ATNSerializer.getSerialized(atn);
        assertEquals(ATNDeserializer.SERIALIZED_VERSION, serialized.get(0));
    }

    private castList<T>(obj: java.lang.Object, clazz: Class<T>): List<T> {
        let result = new ArrayList<T>();
        if (obj instanceof List<unknown>) {
            for (let o of obj as List<unknown>) {
                result.add(clazz.cast(o));
            }
            return result;
        }
        return null;
    }
}
