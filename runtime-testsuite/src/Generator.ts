/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import path from "path";

import { FileUtils } from "./FileUtils.js";
import { ErrorQueue } from "./ErrorQueue.js";
import { DefaultToolListener, Tool } from "../temp.js";

export class Generator {

    /** Run ANTLR on stuff in workdir and error queue back */
    public static antlrOnString(workdir: string,
        targetName: string | null,
        grammarFileName: string,
        defaultListener: boolean, extraOptions: string[]): ErrorQueue;
    /** Write a grammar to tmpdir and run antlr */
    public static antlrOnString(workdir: string,
        targetName: string | null,
        grammarFileName: string,
        grammarStr: string,
        defaultListener: boolean, extraOptions: string[]): ErrorQueue;
    public static antlrOnString(...args: unknown[]): ErrorQueue {
        switch (args.length) {
            case 5: {
                const [workdir, targetName, grammarFileName, defaultListener, extraOptions] =
                    args as [string, string | null, string, boolean, string[]];

                const options = [...extraOptions];
                if (targetName !== null) {
                    options.push("-Dlanguage=" + targetName);
                }

                if (!options.includes("-o")) {
                    options.push("-o");
                    options.push(workdir);
                }

                if (!options.includes("-lib")) {
                    options.push("-lib");
                    options.push(workdir);
                }
                if (!options.includes("-encoding")) {
                    options.push("-encoding");
                    options.push("UTF-8");
                }
                options.push(path.join(workdir, grammarFileName));

                const antlr = new Tool(options);
                const errorQueue = new ErrorQueue(antlr);
                antlr.addListener(errorQueue);
                if (defaultListener) {
                    antlr.addListener(new DefaultToolListener(antlr));
                }
                antlr.processGrammarsOnCommandLine();

                const errors: string[] = [];

                if (!defaultListener && errorQueue.errors.length > 0) {
                    for (const msg of errorQueue.errors) {
                        const msgST = antlr.errMgr.getMessageTemplate(msg);
                        errors.push(msgST!.render());
                    }
                }

                /*if (!defaultListener && errorQueue.warnings.length > 0) {
                    for (let i = 0; i < errorQueue.warnings.length; i++) {
                        const msg = errorQueue.warnings[i];
                        // antlrToolErrors.append(msg); warnings are hushed
                    }
                }*/

                return errorQueue;
            }

            case 6: {
                const [workdir, targetName, grammarFileName, grammarStr, defaultListener, extraOptions] =
                    args as [string, string, string, string, boolean, string[]];

                FileUtils.mkdir(workdir);
                FileUtils.writeFile(workdir, grammarFileName, grammarStr);

                return Generator.antlrOnString(workdir, targetName, grammarFileName, defaultListener, extraOptions);
            }

            default: {
                throw new Error("Invalid number of arguments");
            }
        }
    }

}
