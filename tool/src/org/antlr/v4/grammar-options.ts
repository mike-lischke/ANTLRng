/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import packageJson from "../../../../../package.json";

import { Option, program } from "commander";

export interface IToolParameters {
    // Used to store additional options that are not explicitly defined here.
    [keyof: string]: unknown;

    outputDirectory?: string,
    libDirectory?: string,
    generateATNDot?: string,
    grammarEncoding?: string,
    msgFormat?: string,
    longMessages?: boolean;
    generateListener?: boolean,
    generateVisitor?: boolean,
    generatePackage?: boolean,
    generateDependencies?: boolean,
    warningsAreErrors?: boolean,
    forceAtn?: boolean,
    log?: boolean,
}

const parseBoolean = (value: string | null): boolean => {
    if (value == null) {
        return false;
    }

    const lower = value.trim().toLowerCase();

    return lower === "true" || lower === "1" || lower === "on" || lower === "yes";
};

const parseKeyValuePair = (input: string): { key: string, value: string; } => {
    const [key, value] = input.split("=");

    return { key, value };
};

program
    .argument("grammar1 grammar2 ...", "A list of grammar files.")
    .option("-o, --output-directory <path>", "specify output directory where all output is generated")
    .option("-lib, --lib-directory <path>", "specify location of grammars, tokens files")
    .option<boolean>("-atn, --generate-atn-dot [boolean]",
        "Generate rule augmented transition network diagrams.", parseBoolean, false)
    .option("-e, --encoding", "Specify grammar file encoding; e.g., ucs-2.", "utf-8")
    .addOption(new Option("-f, ---message-format", "Specify output style for messages in antlr, gnu, vs2005.")
        .choices(["antlr", "gnu", "vs2005"]).default("antlr"))
    .option<boolean>("-lm, --long-messages [boolean]",
        "Show exception details when available for errors and warnings.", parseBoolean, false)
    .option<boolean>("-l, --listener [boolean]", "Generate parse tree listener.", parseBoolean, true)
    .option<boolean>("-v, --visitor [boolean]", "Generate parse tree visitor.", parseBoolean, false)
    .option("-p, --package", "Specify a package/namespace for the generated code.")
    .option<boolean>("-d, --dependencies", "Generate file dependencies.", parseBoolean, false)
    .option("-D, --define <key=value>", "Set/override a grammar-level option.", parseKeyValuePair)
    .option<boolean>("-w, --warnings-are-errors", "Treat warnings as errors.", parseBoolean, false)
    .option<boolean>("-f, --force-atn", "Use the ATN simulator for all predictions.", parseBoolean, false)
    .option<boolean>("--log", "Dump lots of logging info to antlr-timestamp.log.", parseBoolean, false)
    .version(`ANTLRng ${packageJson.version}`)
    .parse();

export const grammarOptions = program.opts<IToolParameters>();
