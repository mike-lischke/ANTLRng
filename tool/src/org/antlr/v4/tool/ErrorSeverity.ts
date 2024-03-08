/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

export class ErrorSeverity extends Enum<ErrorSeverity> {
    public static readonly INFO: ErrorSeverity = new class extends ErrorSeverity {
}    ("info",S`INFO`, 0);
	public static readonly WARNING: ErrorSeverity = new class extends ErrorSeverity {
} ("warning",S`WARNING`, 1);
	public static readonly WARNING_ONE_OFF: ErrorSeverity = new class extends ErrorSeverity {
} ("warning",S`WARNING_ONE_OFF`, 2);
	public static readonly ERROR: ErrorSeverity = new class extends ErrorSeverity {
}   ("error",S`ERROR`, 3);
	public static readonly ERROR_ONE_OFF: ErrorSeverity = new class extends ErrorSeverity {
}   ("error",S`ERROR_ONE_OFF`, 4);
    public static readonly FATAL: ErrorSeverity = new class extends ErrorSeverity {
}   ("fatal",S`FATAL`, 5),  // TODO: add fatal for which phase? sync with ErrorManager
    ;

    /**
     * The text version of the ENUM value, used for display purposes
     */
    private readonly  text:  string;

    /**
     * Standard constructor to build an instance of the Enum entries
     *
     * @param text The human readable string representing the severity level
     */
    private  constructor(text: string, $name$: java.lang.String, $index$: number) { this.text = text; }

    /**
     * Standard getter method for the text that should be displayed in order to
     * represent the severity to humans and product modelers.
     *
     * @return The human readable string representing the severity level
     */
    public  getText():  string { return this.text; }
}

