/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Tool } from "../Tool.js";
import { CodeGenerator } from "../codegen/CodeGenerator.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { LinkedHashMap as HashMap } from "antlr4ng";

/** */
export class TokenVocabParser {
    protected readonly g: Grammar;

    public constructor(g: Grammar) {
        this.g = g;
    }

    /** Load a vocab file {@code <vocabName>.tokens} and return mapping. */
    public load(): Map<string, number> {
        const tokens = new LinkedHashMap<string, number>();
        let maxTokenType = -1;
        const fullFile = this.getImportedVocabFile();
        let fis = null;
        let br = null;
        const tool = this.g.tool;
        const vocabName = this.g.getOptionString("tokenVocab");
        try {
            const tokenDefPattern = Pattern.compile("([^\n]+?)[ \\t]*?=[ \\t]*?([0-9]+)");
            fis = new FileInputStream(fullFile);
            let isr: InputStreamReader;
            if (tool.grammarEncoding !== null) {
                isr = new InputStreamReader(fis, tool.grammarEncoding);
            }
            else {
                isr = new InputStreamReader(fis);
            }

            br = new BufferedReader(isr);
            let tokenDef = br.readLine();
            let lineNum = 1;
            while (tokenDef !== null) {
                const matcher = tokenDefPattern.matcher(tokenDef);
                if (matcher.find()) {
                    const tokenID = matcher.group(1);
                    const tokenTypeS = matcher.group(2);
                    let tokenType: number;
                    try {
                        tokenType = number.valueOf(tokenTypeS);
                    } catch (nfe) {
                        if (nfe instanceof NumberFormatException) {
                            tool.errMgr.toolError(ErrorType.TOKENS_FILE_SYNTAX_ERROR,
                                vocabName + CodeGenerator.VOCAB_FILE_EXTENSION,
                                " bad token type: " + tokenTypeS,
                                lineNum);
                            tokenType = Token.INVALID_TOKEN_TYPE;
                        } else {
                            throw nfe;
                        }
                    }
                    tool.logInfo("grammar", "import " + tokenID + "=" + tokenType);
                    tokens.put(tokenID, tokenType);
                    maxTokenType = Math.max(maxTokenType, tokenType);
                    lineNum++;
                }
                else {
                    if (tokenDef.length() > 0) { // ignore blank lines
                        tool.errMgr.toolError(ErrorType.TOKENS_FILE_SYNTAX_ERROR,
                            vocabName + CodeGenerator.VOCAB_FILE_EXTENSION,
                            " bad token def: " + tokenDef,
                            lineNum);
                    }
                }
                tokenDef = br.readLine();
            }
        } catch (fnfeOrE) {
            if (fnfeOrE instanceof FileNotFoundException) {
                const fnfe = fnfeOrE;
                const inTree = this.g.ast.getOptionAST("tokenVocab");
                const inTreeValue = inTree.getToken().getText();
                if (vocabName.equals(inTreeValue)) {
                    tool.errMgr.grammarError(ErrorType.CANNOT_FIND_TOKENS_FILE_REFD_IN_GRAMMAR,
                        this.g.fileName,
                        inTree.getToken(),
                        fullFile);
                }
                else { // must be from -D option on cmd-line not token in tree
                    tool.errMgr.toolError(ErrorType.CANNOT_FIND_TOKENS_FILE_GIVEN_ON_CMDLINE,
                        fullFile,
                        this.g.name);
                }
            } else if (fnfeOrE instanceof Exception) {
                const e = fnfeOrE;
                tool.errMgr.toolError(ErrorType.ERROR_READING_TOKENS_FILE,
                    e,
                    fullFile,
                    e.getMessage());
            } else {
                throw fnfeOrE;
            }
        }
        finally {
            try {
                if (br !== null) {
                    br.close();
                }

            } catch (ioe) {
                if (ioe instanceof IOException) {
                    tool.errMgr.toolError(ErrorType.ERROR_READING_TOKENS_FILE,
                        ioe,
                        fullFile,
                        ioe.getMessage());
                } else {
                    throw ioe;
                }
            }
        }

        return tokens;
    }

    /**
     * Return a File descriptor for vocab file.  Look in library or
     *  in -o output path.  antlr -o foo T.g4 U.g4 where U needs T.tokens
     *  won't work unless we look in foo too. If we do not find the
     *  file in the lib directory then must assume that the .tokens file
     *  is going to be generated as part of this build and we have defined
     *  .tokens files so that they ALWAYS are generated in the base output
     *  directory, which means the current directory for the command line tool if there
     *  was no output directory specified.
     */
    public getImportedVocabFile(): File {
        const vocabName = this.g.getOptionString("tokenVocab");
        let f = new File(this.g.tool.libDirectory,
            File.separator +
            vocabName +
            CodeGenerator.VOCAB_FILE_EXTENSION);
        if (f.exists()) {
            return f;
        }

        // We did not find the vocab file in the lib directory, so we need
        // to look for it in the output directory which is where .tokens
        // files are generated (in the base, not relative to the input
        // location.)
        f = new File(this.g.tool.outputDirectory, vocabName + CodeGenerator.VOCAB_FILE_EXTENSION);
        if (f.exists()) {
            return f;
        }

        // Still not found? Use the grammar's subfolder then.
        let fileDirectory: string;

        if (this.g.fileName.lastIndexOf(File.separatorChar) === -1) {
            // No path is included in the file name, so make the file
            // directory the same as the parent grammar (which might still be just ""
            // but when it is not, we will write the file in the correct place.
            fileDirectory = ".";
        }
        else {
            fileDirectory = this.g.fileName.substring(0, this.g.fileName.lastIndexOf(File.separatorChar));
        }

        return new File(fileDirectory, vocabName + CodeGenerator.VOCAB_FILE_EXTENSION);
    }
}
