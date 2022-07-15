/* java2ts: keep */

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

import { java } from "../../../../../../lib/java/java";
import { Vocabulary } from "../Vocabulary";
import { VocabularyImpl } from "../VocabularyImpl";
import { ATN } from "../atn/ATN";
import { ATNDeserializer } from "../atn/ATNDeserializer";

import { AutoCloser } from "../../../../../../lib/AutoCloser";

// A class to read plain text interpreter data produced by ANTLR.
export class InterpreterDataReader {

    public static InterpreterData = class InterpreterData {
        public atn?: ATN;
        public vocabulary?: Vocabulary;
        public ruleNames?: java.util.List<string>;
        public channels?: java.util.List<string>; // Only valid for lexer grammars.
        public modes?: java.util.List<string>; // ditto
    };

    /**
     * The structure of the data file is very simple. Everything is line based with empty lines
     * separating the different parts. For lexers the layout is:
     * token literal names:
     * ...
     *
     * token symbolic names:
     * ...
     *
     * rule names:
     * ...
     *
     * channel names:
     * ...
     *
     * mode names:
     * ...
     *
     * atn:
     * <a single line with comma separated int values> enclosed in a pair of squared brackets.
     *
     * Data for a parser does not contain channel and mode names.
     *
     * @param fileName tbd
     *
     * @returns tbd
     */
    public static parseFile = (fileName: string): InterpreterDataReader.InterpreterData => {
        const result: InterpreterDataReader.InterpreterData = new InterpreterDataReader.InterpreterData();
        result.ruleNames = new java.util.ArrayList<string>();

        const closeables = new AutoCloser();
        try {
            const br = new java.io.BufferedReader(new java.io.FileReader(fileName));
            closeables.add(br);

            let line: string;

            const literalNames = new java.util.ArrayList<string>();
            const symbolicNames = new java.util.ArrayList<string>();

            line = br.readLine();
            if (!(line === "token literal names:")) {
                throw new java.lang.RuntimeException("Unexpected data entry");
            }

            while ((line = br.readLine()) !== undefined) {
                if (line.length === 0) {
                    break;
                }

                literalNames.add(line === "null" ? "" : line);
            }

            line = br.readLine();
            if (!(line === "token symbolic names:")) {
                throw new java.lang.RuntimeException("Unexpected data entry");
            }

            while ((line = br.readLine()) !== undefined) {
                if (line.length === 0) {
                    break;
                }

                symbolicNames.add(line === "null" ? "" : line);
            }

            result.vocabulary = new VocabularyImpl(literalNames.toArray(), symbolicNames.toArray());

            line = br.readLine();
            if (!(line === "rule names:")) {
                throw new java.lang.RuntimeException("Unexpected data entry");
            }

            while ((line = br.readLine()) !== undefined) {
                if (line.length === 0) {
                    break;
                }

                result.ruleNames.add(line);
            }

            line = br.readLine();
            if (line === "channel names:") { // Additional lexer data.
                result.channels = new java.util.ArrayList<string>();
                while ((line = br.readLine()) !== undefined) {
                    if (line.length === 0) {
                        break;
                    }

                    result.channels.add(line);
                }

                line = br.readLine();
                if (!(line === "mode names:")) {
                    throw new java.lang.RuntimeException("Unexpected data entry");
                }

                result.modes = new java.util.ArrayList<string>();
                while ((line = br.readLine()) !== undefined) {
                    if (line.length === 0) {
                        break;
                    }

                    result.modes.add(line);
                }
            }

            line = br.readLine();
            if (!(line === "atn:")) {
                throw new java.lang.RuntimeException("Unexpected data entry");
            }

            line = br.readLine();
            const elements: string[] = line.substring(1, line.length - 1).split(",");
            const serializedATN: number[] = new Array<number>(elements.length);

            for (let i = 0; i < elements.length; ++(i)) { // ignore [...] on ends
                serializedATN[i] = java.lang.Integer.parseInt(elements[i].trim());
            }

            const deserializer: ATNDeserializer = new ATNDeserializer();
            result.atn = deserializer.deserialize(serializedATN);
        } catch (e: unknown) {
            // We just swallow the error and return empty objects instead.
        } finally {
            closeables.close();
        }

        return result;
    };

}

namespace InterpreterDataReader {
    export type InterpreterData = InstanceType<typeof InterpreterDataReader.InterpreterData>;
}

