/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject, S } from "jree";




/** A proxy for the real org.antlr.v4.gui.TestRig that we moved to tool
 *  artifact from runtime.
 *
 *  @deprecated
 *  @since 4.5.1
 */
export  class TestRig extends JavaObject {
	public static main = (args: java.lang.String[]| null):  void => {
		try {
			let  testRigClass: java.lang.Class<unknown> = java.lang.Class.forName(S`org.antlr.v4.gui.TestRig`);
			java.lang.System.err.println(S`Warning: TestRig moved to org.antlr.v4.gui.TestRig; calling automatically`);
			try {
				let  mainMethod: Method = testRigClass.getMethod(S`main`, java.lang.String[].class);
				mainMethod.invoke(null, args as java.lang.Object);
			} catch (nsme) {
if (nsme instanceof java.lang.Exception) {
				java.lang.System.err.println(S`Problems calling org.antlr.v4.gui.TestRig.main(args)`);
			} else {
	throw nsme;
	}
}
		} catch (cnfe) {
if (cnfe instanceof ClassNotFoundException) {
			java.lang.System.err.println(S`Use of TestRig now requires the use of the tool jar, antlr-4.X-complete.jar`);
			java.lang.System.err.println(S`Maven users need group ID org.antlr and artifact ID antlr4`);
		} else {
	throw cnfe;
	}
}
	}
}
