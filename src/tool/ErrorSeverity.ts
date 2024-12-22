/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export const enum ErrorSeverity {
    Info,
    Warning,
    WarningOneOff,
    Error,
    ErrorOneOff,
    Fatal,
}

export const severityMap = new Map<ErrorSeverity, string>([
    [ErrorSeverity.Info, "info"],
    [ErrorSeverity.Warning, "warning"],
    [ErrorSeverity.WarningOneOff, "warning"],
    [ErrorSeverity.Error, "error"],
    [ErrorSeverity.ErrorOneOff, "error"],
    [ErrorSeverity.Fatal, "fatal"],
]);
