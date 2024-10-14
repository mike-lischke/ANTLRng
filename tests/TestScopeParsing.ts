/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { LinkedHashMap as HashMap } from "antlr4ng";



export class TestScopeParsing {

    public static Parameter = class Parameter {
        public readonly input: string;
        public readonly output: string;

        public constructor(input: string, output: string) {
            this.input = input;
            this.output = output;
        }


        public override  toString(): string {
            return this.input;
        }
    };

    protected static readonly argPairs = [
        "", "",
        " ", "",
        "int i", "i:int",
        "int[] i, int j[]", "i:int[], j:int []",
        "Map<A,B>[] i, int j[]", "i:Map<A,B>[], j:int []",
        "Map<A,List<B>>[] i", "i:Map<A,List<B>>[]",
        "int i = 34+a[3], int j[] = new int[34]",
        "i:int=34+a[3], j:int []=new int[34]",
        "char *[3] foo = {1,2,3}", "foo:char *[3]={1,2,3}", // not valid C really, C is "type name" however so this is cool (this was broken in 4.5 anyway)
        "String[] headers", "headers:String[]",

        // C++
        "std::vector<std::string> x", "x:std::vector<std::string>", // yuck. Don't choose :: as the : of a declaration

        // python/ruby style
        "i", "i",
        "i,j", "i, j",
        "i\t,j, k", "i, j, k",

        // swift style
        "x: int", "x:int",
        "x :int", "x:int",
        "x:int", "x:int",
        "x:int=3", "x:int=3",
        "r:Rectangle=Rectangle(fromLength: 6, fromBreadth: 12)", "r:Rectangle=Rectangle(fromLength: 6, fromBreadth: 12)",
        "p:pointer to int", "p:pointer to int",
        "a: array[3] of int", "a:array[3] of int",
        "a \t:\tfunc(array[3] of int)", "a:func(array[3] of int)",
        "x:int, y:float", "x:int, y:float",
        "x:T?, f:func(array[3] of int), y:int", "x:T?, f:func(array[3] of int), y:int",

        // go is postfix type notation like "x int" but must use either "int x" or "x:int" in [...] actions
        "float64 x = 3", "x:float64=3",
        "map[string]int x", "x:map[string]int",
    ];

    private static getAllTestDescriptors(): Collection<TestScopeParsing.Parameter> {
        let tests = new Array();
        for (let i = 0; i < TestScopeParsing.argPairs.length; i += 2) {
            let arg = TestScopeParsing.argPairs[i];
            let output = TestScopeParsing.argPairs[i + 1];
            tests.add(new TestScopeParsing.Parameter(arg, output));
        }
        return tests;
    }

    @ParameterizedTest
    @ParameterizedTest

    @MethodSource("getAllTestDescriptors")
    public testArgs(parameter: TestScopeParsing.Parameter): void {
        let dummy = new Grammar("grammar T; a:'a';");

        let attributes = ScopeParser.parseTypedArgList(null, parameter.input, dummy).attributes;
        let out = new Array();
        for (let arg of attributes.keySet()) {
            let attr = attributes.get(arg);
            out.add(attr.toString());
        }
        let actual = Utils.join(out.toArray(), ", ");
        assertEquals(parameter.output, actual);
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TestScopeParsing {
    export type Parameter = InstanceType<typeof TestScopeParsing.Parameter>;
}
