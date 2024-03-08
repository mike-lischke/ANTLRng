/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ToolMessage } from "./ToolMessage.js";
import { Rule } from "./Rule.js";
import { LeftRecursionCyclesMessage } from "./LeftRecursionCyclesMessage.js";
import { GrammarSyntaxMessage } from "./GrammarSyntaxMessage.js";
import { GrammarSemanticsMessage } from "./GrammarSemanticsMessage.js";
import { ErrorType } from "./ErrorType.js";
import { ErrorSeverity } from "./ErrorSeverity.js";
import { ANTLRMessage } from "./ANTLRMessage.js";
import { Tool } from "../Tool.js";
import { HashMap } from "antlr4ng";



export  class ErrorManager {

	public static readonly  FORMATS_DIR = "org/antlr/v4/tool/templates/messages/formats/";
	private static readonly  loadedFormats = new  HashMap();

	public  tool:  Tool;
	public  errors:  number;
	public  warnings:  number;

	/** All errors that have been generated */
	public  errorTypes = java.util.EnumSet.noneOf(ErrorType.class);

    /** The group of templates that represent the current message format. */
    protected  format: STGroup;

    protected  formatName: string;

    protected  initSTListener = new  ErrorBuffer();

	public  constructor(tool: Tool) {
		this.tool = tool;
	}

	public static  fatalInternalError(error: string, e: Throwable):  void {
		ErrorManager.internalError(error, e);
		throw new  RuntimeException(error, e);
	}

    public static  internalError(error: string):  void;

	public static  internalError(error: string, e: Throwable):  void;
public static internalError(...args: unknown[]):  void {
		switch (args.length) {
			case 1: {
				const [error] = args as [string];


        let  location =
            ErrorManager.getLastNonErrorManagerCodeLocation(new  Exception());
        let  msg = location+": "+error;
        System.err.println("internal error: "+msg);
    

				break;
			}

			case 2: {
				const [error, e] = args as [string, Throwable];


        let  location = ErrorManager.getLastNonErrorManagerCodeLocation(e);
		ErrorManager.internalError("Exception "+e+"@"+location+": "+error);
    

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


    public static  panic():  void;

	public static  panic(msg: string):  void;
public static panic(...args: unknown[]):  void {
		switch (args.length) {
			case 0: {

        // can't call tool.panic since there may be multiple tools; just
        // one error manager
        throw new  Error("ANTLR ErrorManager panic");
    

				break;
			}

			case 1: {
				const [msg] = args as [string];


		ErrorManager.rawError(msg);
		this.panic();
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


    /** If there are errors during ErrorManager init, we have no choice
     *  but to go to System.err.
     */
    protected static  rawError(msg: string):  void;

    protected static  rawError(msg: string, e: Throwable):  void;
protected static rawError(...args: unknown[]):  void {
		switch (args.length) {
			case 1: {
				const [msg] = args as [string];


        System.err.println(msg);
    

				break;
			}

			case 2: {
				const [msg, e] = args as [string, Throwable];


        ErrorManager.rawError(msg);
        e.printStackTrace(System.err);
    

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


    /** Return first non ErrorManager code location for generating messages */
    private static  getLastNonErrorManagerCodeLocation(e: Throwable):  StackTraceElement {
        let  stack = e.getStackTrace();
        let  i = 0;
        for (; i < stack.length; i++) {
            let  t = stack[i];
            if (!t.toString().contains("ErrorManager")) {
                break;
            }
        }
        let  location = stack[i];
        return location;
    }

	public  resetErrorState():  void {
		this.errors = 0;
		this.warnings = 0;
	}

	public  getMessageTemplate(msg: ANTLRMessage):  ST {
		let  messageST = msg.getMessageTemplate(this.tool.longMessages);
		let  locationST = this.getLocationFormat();
		let  reportST = this.getReportFormat(msg.getErrorType().severity);
		let  messageFormatST = this.getMessageFormat();

		let  locationValid = false;
		if (msg.line !== -1) {
			locationST.add("line", msg.line);
			locationValid = true;
		}
		if (msg.charPosition !== -1) {
			locationST.add("column", msg.charPosition);
			locationValid = true;
		}
		if (msg.fileName !== null) {
			let  displayFileName = msg.fileName;
			if (this.formatName.equals("antlr")) {
				// Don't show path to file in messages in ANTLR format;
				// they're too long.
				let  f = new  File(msg.fileName);
				if ( f.exists() ) {
					displayFileName = f.getName();
				}
			}
			else {
				// For other message formats, use the full filename in the
				// message.  This assumes that these formats are intended to
				// be parsed by IDEs, and so they need the full path to
				// resolve correctly.
			}
			locationST.add("file", displayFileName);
			locationValid = true;
		}

		messageFormatST.add("id", msg.getErrorType().code);
		messageFormatST.add("text", messageST);

		if (locationValid) {
 reportST.add("location", locationST);
}

		reportST.add("message", messageFormatST);
		//((DebugST)reportST).inspect();
//		reportST.impl.dump();
		return reportST;
	}

    /** Return a StringTemplate that refers to the current format used for
     * emitting messages.
     */
    public  getLocationFormat():  ST {
        return this.format.getInstanceOf("location");
    }

    public  getReportFormat(severity: ErrorSeverity):  ST {
        let  st = this.format.getInstanceOf("report");
        st.add("type", severity.getText());
        return st;
    }

    public  getMessageFormat():  ST {
        return this.format.getInstanceOf("message");
    }
    public  formatWantsSingleLineMessage():  boolean {
        return this.format.getInstanceOf("wantsSingleLineMessage").render().equals("true");
    }

	public  info(msg: string):  void { this.tool.info(msg); }

	public  syntaxError(etype: ErrorType,
								   fileName: string,
								   token: org.antlr.runtime.Token,
								   antlrException: org.antlr.runtime.RecognitionException,...
								   args: Object[]):  void
	{
		let  msg = new  GrammarSyntaxMessage(etype,fileName,token,antlrException,Rule.args);
		this.emit(etype, msg);
	}

    /**
     * Raise a predefined message with some number of parameters for the StringTemplate but for which there
     * is no location information possible.
     * @param errorType The Message Descriptor
     * @param args The arguments to pass to the StringTemplate
     */
	public  toolError(errorType: ErrorType,... args: Object[]):  void;

	public  toolError(errorType: ErrorType, e: Throwable,... args: Object[]):  void;
public toolError(...args: unknown[]):  void {
		switch (args.length) {
			case 2: {
				const [errorType, args] = args as [ErrorType, Object[]];


		this.toolError(errorType, null, Rule.args);
	

				break;
			}

			case 3: {
				const [errorType, e, args] = args as [ErrorType, Throwable, Object[]];


		let  msg = new  ToolMessage(errorType, e, Rule.args);
		this.emit(errorType, msg);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


    public  grammarError(etype: ErrorType,
							 fileName: string,
							 token: org.antlr.runtime.Token,...
							 args: Object[]):  void
	{
        let  msg = new  GrammarSemanticsMessage(etype,fileName,token,Rule.args);
		this.emit(etype, msg);

	}

	public  leftRecursionCycles(fileName: string, cycles: java.util.Collection< java.util.Collection<Rule>>):  void {
		this.errors++;
		let  msg = new  LeftRecursionCyclesMessage(fileName, cycles);
		this.tool.error(msg);
	}

    public  getNumErrors():  number {
        return this.errors;
    }

    // S U P P O R T  C O D E

	@SuppressWarnings("fallthrough")
public  emit(etype: ErrorType, msg: ANTLRMessage):  void {
		switch ( etype.severity ) {
			case ErrorSeverity.WARNING_ONE_OFF:{
				if ( this.errorTypes.contains(etype) ) {
 break;
}

}

				// fall thru
			case java.util.logging.Level.WARNING:{
				this.warnings++;
				this.tool.warning(msg);
				break;
}

			case ErrorSeverity.ERROR_ONE_OFF:{
				if ( this.errorTypes.contains(etype) ) {
 break;
}

}

				// fall thru
			case java.util.jar.Pack200.Packer.ERROR:{
				this.errors++;
				this.tool.error(msg);
				break;
}

      default:{
        break;
}

		}
		this.errorTypes.add(etype);
	}

    /** The format gets reset either from the Tool if the user supplied a command line option to that effect
     *  Otherwise we just use the default "antlr".
     */
    public  setFormat(formatName: string):  void {
		let  loadedFormat: STGroupFile;

		/* synchronized (loadedFormats) { */
			loadedFormat = ErrorManager.loadedFormats.get(formatName);
			if (loadedFormat === null) {
				let  fileName = ErrorManager.FORMATS_DIR + formatName + STGroup.GROUP_FILE_EXTENSION;
				let  cl = Thread.currentThread().getContextClassLoader();
				let  url = cl.getResource(fileName);
				if (url === null) {
					cl = ErrorManager.class.getClassLoader();
					url = cl.getResource(fileName);
				}
				if (url === null && formatName.equals("antlr")) {
					ErrorManager.rawError("ANTLR installation corrupted; cannot find ANTLR messages format file " + fileName);
					this.panic();
				}
				else {
 if (url === null) {
					ErrorManager.rawError("no such message format file " + fileName + " retrying with default ANTLR format");
					this.setFormat("antlr"); // recurse on this rule, trying the default message format
					return;
				}
}

				loadedFormat = new  STGroupFile(url, "UTF-8", '<', '>');
				loadedFormat.load();

				ErrorManager.loadedFormats.put(formatName, loadedFormat);
			}
		/* } */ 

		this.formatName = formatName;
		this.format = loadedFormat;

		if (!this.initSTListener.errors.isEmpty()) {
			ErrorManager.rawError("ANTLR installation corrupted; can't load messages format file:\n" +
					this.initSTListener.toString());
			this.panic();
		}

		let  formatOK = this.verifyFormat();
		if (!formatOK && formatName.equals("antlr")) {
			ErrorManager.rawError("ANTLR installation corrupted; ANTLR messages format file " + formatName + ".stg incomplete");
			this.panic();
		}
		else {
 if (!formatOK) {
			this.setFormat("antlr"); // recurse on this rule, trying the default message format
		}
}

	}

    /** Verify the message format template group */
    protected  verifyFormat():  boolean {
        let  ok = true;
        if (!this.format.isDefined("location")) {
            System.err.println("Format template 'location' not found in " + this.formatName);
            ok = false;
        }
        if (!this.format.isDefined("message")) {
            System.err.println("Format template 'message' not found in " + this.formatName);
            ok = false;
        }
        if (!this.format.isDefined("report")) {
            System.err.println("Format template 'report' not found in " + this.formatName);
            ok = false;
        }
        return ok;
    }
}
