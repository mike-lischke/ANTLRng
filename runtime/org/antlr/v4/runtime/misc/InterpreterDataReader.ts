/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, closeResources, handleResourceError, throwResourceError, S } from "jree";
import { Vocabulary } from "../Vocabulary";
import { VocabularyImpl } from "../VocabularyImpl";
import { ATN } from "../atn/ATN";
import { ATNDeserializer } from "../atn/ATNDeserializer";

/** A class to read plain text interpreter data produced by ANTLR. */
export class InterpreterDataReader extends JavaObject {

    public static InterpreterData = class InterpreterData extends JavaObject {
        public atn: ATN | null = null;
        public vocabulary: Vocabulary | null = null;
        public ruleNames: java.util.List<java.lang.String> | null = null;
        public channels: java.util.List<java.lang.String> | null = null; // Only valid for lexer grammars.
        public modes: java.util.List<java.lang.String> | null = null; // ditto
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
    public static parseFile = (fileName: java.lang.String): InterpreterDataReader.InterpreterData => {
        const result = new InterpreterDataReader.InterpreterData();
        result.ruleNames = new java.util.ArrayList<java.lang.String>();

        try {
            // This holds the final error to throw (if any).
            let error: java.lang.Throwable | undefined;

            const br = new java.io.BufferedReader(new java.io.FileReader(fileName));
            try {
                try {
                    let line: java.lang.String;
                    const literalNames = new java.util.ArrayList<java.lang.String>();
                    const symbolicNames = new java.util.ArrayList<java.lang.String>();

                    line = br.readLine();
                    if (!line.equals(S`token literal names:`)) {
                        throw new java.lang.RuntimeException(S`Unexpected data entry`);
                    }

                    while ((line = br.readLine()) !== null) {
                        if (line.isEmpty()) {
                            break;
                        }
                        literalNames.add(line.equals(S`null`) ? S`` : line);
                    }

                    line = br.readLine();
                    if (!line.equals(S`token symbolic names:`)) {
                        throw new java.lang.RuntimeException(S`Unexpected data entry`);
                    }

                    while ((line = br.readLine()) !== null) {
                        if (line.isEmpty()) {
                            break;
                        }
                        symbolicNames.add(line.equals(S`null`) ? S`` : line);
                    }

                    result.vocabulary = new VocabularyImpl(literalNames.toArray(),
                        symbolicNames.toArray(new Array<java.lang.String>(0)));

                    line = br.readLine();
                    if (!line.equals(S`rule names:`)) {
                        throw new java.lang.RuntimeException(S`Unexpected data entry`);
                    }

                    while ((line = br.readLine()) !== null) {
                        if (line.isEmpty()) {
                            break;
                        }
                        result.ruleNames.add(line);
                    }

                    line = br.readLine();
                    if (line.equals(S`channel names:`)) { // Additional lexer data.
                        result.channels = new java.util.ArrayList<java.lang.String>();
                        while ((line = br.readLine()) !== null) {
                            if (line.isEmpty()) {
                                break;
                            }
                            result.channels.add(line);
                        }

                        line = br.readLine();
                        if (!line.equals(S`mode names:`)) {
                            throw new java.lang.RuntimeException(S`Unexpected data entry`);
                        }

                        result.modes = new java.util.ArrayList<java.lang.String>();
                        while ((line = br.readLine()) !== null) {
                            if (line.isEmpty()) {
                                break;
                            }
                            result.modes.add(line);
                        }
                    }

                    line = br.readLine();
                    if (!line.equals(S`atn:`)) {
                        throw new java.lang.RuntimeException(S`Unexpected data entry`);
                    }

                    line = br.readLine();
                    const elements: java.lang.String[] = line.substring(1, line.length() - 1).split(S`,`);
                    const serializedATN = new Int32Array(elements.length);

                    for (let i = 0; i < elements.length; ++i) { // ignore [...] on ends
                        serializedATN[i] = java.lang.Integer.parseInt(elements[i].trim());
                    }

                    const deserializer = new ATNDeserializer();
                    result.atn = deserializer.deserialize(serializedATN);
                } finally {
                    error = closeResources([br]);
                }
            } catch (e) {
                error = handleResourceError(e, error);
            } finally {
                throwResourceError(error);
            }
        } catch (e) {
            if (e instanceof java.io.IOException) {
                // We just swallow the error and return empty objects instead.
            } else {
                throw e;
            }
        }

        return result;
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace InterpreterDataReader {
    export type InterpreterData = InstanceType<typeof InterpreterDataReader.InterpreterData>;
}
