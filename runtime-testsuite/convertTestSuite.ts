/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import * as path from "path";

import {
    IConverterConfiguration, JavaToTypescriptConverter, PackageSource, PackageSourceManager,
} from "java2typescript";
import { ClassSymbol, Modifier, NamespaceSymbol, RoutineSymbol, SymbolTable } from "antlr4-c3";

/** Member sorting identifiers as used in the project's eslint configuration. */
const memberOrderOptions = {
    default: [
        "signature",
        "public-static-field",
        "protected-static-field",
        "private-static-field",
        "public-decorated-field",
        "protected-decorated-field",
        "private-decorated-field",
        "public-instance-field",
        "protected-instance-field",
        "private-instance-field",
        "public-abstract-field",
        "protected-abstract-field",
        "public-field",
        "protected-field",
        "private-field",
        "static-field",
        "instance-field",
        "abstract-field",
        "decorated-field",
        "field",
        "public-constructor",
        "protected-constructor",
        "private-constructor",
        "constructor",
        "public-static-method",
        "protected-static-method",
        "private-static-method",
        "public-decorated-method",
        "protected-decorated-method",
        "private-decorated-method",
        "public-instance-method",
        "protected-instance-method",
        "private-instance-method",
        "public-abstract-method",
        "protected-abstract-method",
    ],
};

class TestNGSource extends PackageSource {
    protected override createSymbolTable(): SymbolTable {
        const symbolTable = new SymbolTable("TestNG", { allowDuplicateSymbols: false });

        const testng = symbolTable.addNewNamespaceFromPathSync(undefined, "org.testng");
        const assert = symbolTable.addNewSymbolOfType(ClassSymbol, testng, "Assert", [], []);
        let routine = symbolTable.addNewSymbolOfType(RoutineSymbol, assert, "assertEquals");
        routine.modifiers.add(Modifier.Static);
        routine = symbolTable.addNewSymbolOfType(RoutineSymbol, assert, "assertNotEquals");
        routine.modifiers.add(Modifier.Static);
        routine = symbolTable.addNewSymbolOfType(RoutineSymbol, assert, "assertTrue");
        routine.modifiers.add(Modifier.Static);
        routine = symbolTable.addNewSymbolOfType(RoutineSymbol, assert, "assertFalse");
        routine.modifiers.add(Modifier.Static);

        const annotations = symbolTable.addNewSymbolOfType(NamespaceSymbol, testng, "annotations");
        symbolTable.addNewSymbolOfType(RoutineSymbol, annotations, "Test");
        symbolTable.addNewSymbolOfType(RoutineSymbol, annotations, "DataProvider");

        return symbolTable;
    }

    protected override get importOverride(): string | undefined {
        return "org";
    }
}

let annotationSource: TestNGSource;

const importResolver = (packageId: string): PackageSource | undefined => {
    if (packageId.startsWith("org.testng")) {
        if (!annotationSource) {
            // Create the package source on demand, so we don't try to access internal stuff before the
            // package manager is fully initialized.
            annotationSource = new TestNGSource("org.testng", "", "../../../../org/org");
        }

        return annotationSource;
    }

    return PackageSourceManager.emptySource(packageId);
};

/**
 * Files and folders of the JDK test suite that should be converted. Included here are only those tests for classes
 * we currently have in the JREE (white list). The rest is ignored for now.
 * However, some of the tests included via folders cannot be executed as they require additional classes that are not
 * part of the JREE. These are listed in the exclude list.
 */
const include: string[] = [
    "io/BufferedReader/",
    "io/NegativeInitSize.java",
    "io/Unicode.java",
    "util/AbstractList",
    "util/ArrayList",
    "util/List",
    "util/Collection/testlibrary",
    "util/HashMap",
    "util/HashSet",
    "util/Iterator",
];

const convertJDKLangTests = async () => {
    const antlrToolOptions: IConverterConfiguration = {
        packageRoot: path.resolve(process.cwd(), "../jdk/test/jdk/java/"),
        javaLib: "../../../src",
        //include,
        include: ["/IteratorDefaults.java"],
        exclude: [ // Contains only files that were included above.
            "io/BufferedReader/Lines.java", // Requires stream + lambda support.
            "io/BufferedReader/ReadLineSync.java", // Requires thread support.
            "io/BufferedReader/SkipNegativeInitSize.java", // Requires CharArrayReader
            "io/BufferedReader/SkipNegative.java", // Requires CharArrayReader
            "io/SkipNegativeInitSize.java", // Requires ByteArrayInputStream and others.
            "io/NegativeInitSize.java", // Requires CharArrayReader and others.

            "util/ArrayList/ArrayManagement.java", // Requires reflection.
            "util/ArrayList/Bug6533203.java", // Requires thread support.
            "util/ArrayList/IteratorMicroBenchmark.java", // Requires concurrent + ref support.
            "util/ArrayList/RangeCheckMicroBenchmark.java", // Requires stream support.
            "util/HashMap/KeySetRemove.java", // Uses TreeMap too.
            "util/HashMap/PutNullKey.java", // Uses IntStream.
            "util/HashSet/Serialization.java", // Requires serialization support.
        ],
        outputPath: "../jree/tests/jdk/java/",
        options: {
            importResolver,
            convertAnnotations: true,
            sourceMappings: [
            ],
            preferArrowFunctions: false,
            autoAddBraces: true,
            addIndexFiles: false,
            addNullUnionType: false,
            suppressTypeWithInitializer: true,
            wrapStringLiterals: false,
            memberOrderOptions,
            prefix: `
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */
`,
            useUnqualifiedTypes: true,
        },
        sourceReplace: new Map([
        ]),
        debug: {
            pathForPosition: {
                //filePattern: "XXX",
                position: {
                    row: 49,
                    column: 5,
                },
            },
        },

    };

    const converter = new JavaToTypescriptConverter(antlrToolOptions);
    await converter.startConversion();
};

await convertJDKLangTests();
