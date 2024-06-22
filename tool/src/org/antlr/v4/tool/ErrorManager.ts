/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { ErrorBuffer, STGroup, STGroupFile } from "stringtemplate4ts";

import type { RecognitionException, Token } from "antlr4ng";
import { basename } from "path";
import { existsSync } from "fs";

import type { IST } from "stringtemplate4ts/dist/compiler/common.js";
import { Tool } from "../Tool.js";
import { ANTLRMessage } from "./ANTLRMessage.js";
import { ErrorSeverity } from "./ErrorSeverity.js";
import { ErrorType } from "./ErrorType.js";
import { GrammarSemanticsMessage } from "./GrammarSemanticsMessage.js";
import { GrammarSyntaxMessage } from "./GrammarSyntaxMessage.js";
import { LeftRecursionCyclesMessage } from "./LeftRecursionCyclesMessage.js";
import { Rule } from "./Rule.js";
import { ToolMessage } from "./ToolMessage.js";

export class ErrorManager {

    public static readonly FORMATS_DIR = "org/antlr/v4/tool/templates/messages/formats/";
    private static readonly loadedFormats = new Map<string, STGroupFile>();

    public tool: Tool;
    public errors: number;
    public warnings: number;

    /** All errors that have been generated */
    public errorTypes = new Set<ErrorType>();

    /** The group of templates that represent the current message format. */
    protected format: STGroup;

    protected formatName: string;

    protected initSTListener = new ErrorBuffer();

    public constructor(tool: Tool) {
        this.tool = tool;
    }

    public static fatalInternalError(error: string, e: Error): void {
        ErrorManager.internalError(error, e);
        throw new Error(error, { cause: e });
    }

    public static internalError(error: string, e?: Error): void {
        if (e) {
            const location = ErrorManager.getLastNonErrorManagerCodeLocation(e);
            ErrorManager.internalError("Exception " + e + "@" + location + ": " + error);
        } else {
            const location = ErrorManager.getLastNonErrorManagerCodeLocation(new Error());
            const msg = location + ": " + error;
            console.error("internal error: " + msg);
        }
    }

    public static panic(msg?: string): never {
        if (msg) {
            ErrorManager.rawError(msg);
        }

        throw new Error("ANTLR ErrorManager panic");
    }

    /**
     * If there are errors during ErrorManager init, we have no choice but to go to System.err.
     */
    protected static rawError(msg: string, e?: Error): void {
        if (e) {
            ErrorManager.rawError(msg);
            console.error(e.stack);
        } else {
            console.error(msg);
        }
    }

    /** @returns The first non ErrorManager code location for generating messages. */
    private static getLastNonErrorManagerCodeLocation(e: Error): string {
        const stack = e.stack!.split("\n");
        let entry = "";
        for (entry of stack) {
            if (!entry.includes("ErrorManager")) {
                break;
            }
        }

        return entry;
    }

    public resetErrorState(): void {
        this.errors = 0;
        this.warnings = 0;
    }

    public getMessageTemplate(msg: ANTLRMessage): IST | null {
        const longMessages = Tool.getOptionValue<boolean>("longMessages");
        const messageST = msg.getMessageTemplate(longMessages ?? false);
        const locationST = this.getLocationFormat();
        const reportST = this.getReportFormat(msg.getErrorType().severity);
        const messageFormatST = this.getMessageFormat();

        let locationValid = false;
        if (msg.line !== -1) {
            locationST.add("line", msg.line);
            locationValid = true;
        }

        if (msg.charPosition !== -1) {
            locationST.add("column", msg.charPosition);
            locationValid = true;
        }

        if (msg.fileName !== null) {
            let displayFileName = msg.fileName;
            if (this.formatName === "antlr") {
                // Don't show path to file in messages in ANTLR format, they're too long.
                displayFileName = basename(msg.fileName);
            } else {
                // For other message formats, use the full filename in the
                // message. This assumes that these formats are intended to
                // be parsed by IDEs, and so they need the full path to
                // resolve correctly.
            }
            locationST.add("file", displayFileName);
            locationValid = true;
        }

        messageFormatST.add("id", msg.getErrorType().code);
        messageFormatST.add("text", messageST);

        if (locationValid) {
            reportST?.add("location", locationST);
        }

        reportST?.add("message", messageFormatST);

        return reportST;
    }

    /**
     * Return a StringTemplate that refers to the current format used for
     * emitting messages.
     */
    public getLocationFormat(): IST {
        return this.format.getInstanceOf("location")!;
    }

    public getReportFormat(severity: ErrorSeverity): IST | null {
        const st = this.format.getInstanceOf("report");
        st?.add("type", severity.toString());

        return st;
    }

    public getMessageFormat(): IST {
        return this.format.getInstanceOf("message")!;
    }

    public formatWantsSingleLineMessage(): boolean {
        return this.format.getInstanceOf("wantsSingleLineMessage")?.render() === "true" ?? false;
    }

    public info(msg: string): void {
        this.tool.info(msg);
    }

    public syntaxError(errorType: ErrorType, fileName: string, token: Token, antlrException: RecognitionException,
        ...args: Object[]): void {
        const msg = new GrammarSyntaxMessage(errorType, fileName, token, antlrException, args);
        this.emit(errorType, msg);
    }

    /**
     * Raise a predefined message with some number of parameters for the StringTemplate but for which there
     * is no location information possible.
     *
     * @param errorType The Message Descriptor
     * @param args The arguments to pass to the StringTemplate
     */
    public toolError(errorType: ErrorType, ...args: unknown[]): void;
    public toolError(errorType: ErrorType, e: Error, ...args: unknown[]): void;
    public toolError(...allArgs: unknown[]): void {
        let msg: ToolMessage;

        if (allArgs.length < 1) {
            throw new Error("Invalid number of arguments");
        }

        const errorType = allArgs[0] as ErrorType;

        if (allArgs.length > 1) {
            const [errorType, e, args] = allArgs as [ErrorType, Error, unknown[]];
            msg = new ToolMessage(errorType, e, args);
        } else {
            msg = new ToolMessage(allArgs[0] as ErrorType);
        }

        this.emit(errorType, msg);
    }

    public grammarError(errorType: ErrorType, fileName: string, token: Token | null, ...args: unknown[]): void {
        const msg = new GrammarSemanticsMessage(errorType, fileName, token, args);
        this.emit(errorType, msg);
    }

    public leftRecursionCycles(fileName: string, cycles: Rule[][]): void {
        this.errors++;
        const msg = new LeftRecursionCyclesMessage(fileName, cycles);
        this.tool.error(msg);
    }

    public getNumErrors(): number {
        return this.errors;
    }

    // S U P P O R T  C O D E

    public emit(errorType: ErrorType, msg: ANTLRMessage): void {
        switch (errorType.severity) {
            case ErrorSeverity.WarningOneOff: {
                if (this.errorTypes.has(errorType)) {
                    break;
                }

                // [fall-through]
            }

            case ErrorSeverity.Warning: {
                this.warnings++;
                this.tool.warning(msg);

                break;
            }

            case ErrorSeverity.ErrorOneOff: {
                if (this.errorTypes.has(errorType)) {
                    break;
                }

                // [fall-through]
            }

            case ErrorSeverity.Error: {
                this.errors++;
                this.tool.error(msg);
                break;
            }

            default:
        }

        this.errorTypes.add(errorType);
    }

    /**
     * The format gets reset either from the Tool if the user supplied a command line option to that effect.
     * Otherwise we just use the default "antlr".
     */
    public setFormat(formatName: string): void {
        let loadedFormat = ErrorManager.loadedFormats.get(formatName);
        if (!loadedFormat) {
            const fileName = ErrorManager.FORMATS_DIR + formatName + STGroup.GROUP_FILE_EXTENSION;
            if (!existsSync(fileName)) {
                if (formatName === "antlr") {
                    ErrorManager.rawError("Cannot find ANTLR messages format file " + fileName);
                    ErrorManager.panic();
                }

                this.setFormat("antlr"); // recurse on this rule, trying the default message format
            }

            loadedFormat = new STGroupFile(fileName, "UTF-8", "<", ">");
            loadedFormat.load();

            ErrorManager.loadedFormats.set(formatName, loadedFormat);
        }

        this.formatName = formatName;
        this.format = loadedFormat;

        if (this.initSTListener.size > 0) {
            ErrorManager.rawError("Can't load messages format file:\n" + this.initSTListener.toString());
            ErrorManager.panic();
        }

        const formatOK = this.verifyFormat();
        if (!formatOK && formatName === "antlr") {
            ErrorManager.rawError("ANTLR messages format file " + formatName + ".stg incomplete");
            ErrorManager.panic();
        } else {
            if (!formatOK) {
                this.setFormat("antlr"); // recurse on this rule, trying the default message format
            }
        }

    }

    /** Verify the message format template group */
    protected verifyFormat(): boolean {
        let ok = true;
        if (!this.format.isDefined("location")) {
            console.error("Format template 'location' not found in " + this.formatName);
            ok = false;
        }

        if (!this.format.isDefined("message")) {
            console.error("Format template 'message' not found in " + this.formatName);
            ok = false;
        }

        if (!this.format.isDefined("report")) {
            console.error("Format template 'report' not found in " + this.formatName);
            ok = false;
        }

        return ok;
    }
}
