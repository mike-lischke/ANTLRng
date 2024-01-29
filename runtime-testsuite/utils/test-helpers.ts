/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

export const runTestAndCaptureOutput = (method: (params: string[]) => void,
    params: string[]): [string, string] => {

    // Save certain original console and process output functions.
    const originalLog = console.log;
    const originalError = console.error;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalStdoutWrite = process.stdout.write;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalStderrWrite = process.stderr.write;

    let output = "";
    let errors = "";

    // Replace the console.log and the write functions with our own.
    global.console.log = (message?: unknown, ...optionalParams: unknown[]): void => {
        output += message + optionalParams.join(" ") + "\n";
    };

    global.console.error = (message?: unknown, ...optionalParams: unknown[]): void => {
        errors += message + optionalParams.join(" ") + "\n";
    };

    process.stdout.write = (message: string): boolean => {
        output += message;

        return true;
    };

    process.stderr.write = (message: string): boolean => {
        errors += message;

        return true;
    };

    try {
        method(params);
    } catch (error) {
        errors += error;
    }

    // Restore the original console.log and process.stdout.write functions.
    console.log = originalLog;
    console.error = originalError;
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;

    return [output, errors];
};
