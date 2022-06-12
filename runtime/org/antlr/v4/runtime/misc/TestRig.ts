/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { java } from "../../../../../../lib/java/java";




/** A proxy for the real org.antlr.v4.gui.TestRig that we moved to tool
 *  artifact from runtime.
 *
 *  @deprecated
 *  @since 4.5.1
 */
export  class TestRig {
	public static main = (args: string[]): void => {
		try {
			let  testRigClass: java.lang.Class<unknown> = java.lang.Class.forName("org.antlr.v4.gui.TestRig");
			java.lang.System.err.println("Warning: TestRig moved to org.antlr.v4.gui.TestRig; calling automatically");
			try {
				let  mainMethod: Method = testRigClass.getMethod("main", new java.lang.Class(string[]));
				mainMethod.invoke(undefined, args as object);
			}
			catch ([object Object]nsme: unknown) {
				java.lang.System.err.println("Problems calling org.antlr.v4.gui.TestRig.main(args)");
			}
		}
		catch (ClassNotFoundExceptioncnfe: unknown) {
			java.lang.System.err.println("Use of TestRig now requires the use of the tool jar, antlr-4.X-complete.jar");
			java.lang.System.err.println("Maven users need group ID org.antlr and artifact ID antlr4");
		}
	}
}
