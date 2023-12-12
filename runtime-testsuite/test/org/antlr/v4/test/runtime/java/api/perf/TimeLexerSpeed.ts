/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject, type int, type long, closeResources, handleResourceError, throwResourceError, type double, S } from "jree";
import { ANTLRFileStream, ANTLRInputStream, CharStream, CharStreams, CommonTokenStream, Lexer } from "antlr4ng";

type String = java.lang.String;
const String = java.lang.String;
type List<E> = java.util.List<E>;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
type RuntimeMXBean = java.lang.management.RuntimeMXBean;
type ManagementFactory = java.lang.management.ManagementFactory;
const ManagementFactory = java.lang.management.ManagementFactory;
type System = java.lang.System;
const System = java.lang.System;
type URL = java.net.URL;
const URL = java.net.URL;
type File = java.io.File;
const File = java.io.File;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type ClassLoader = java.lang.ClassLoader;
const ClassLoader = java.lang.ClassLoader;
type InputStream = java.io.InputStream;
const InputStream = java.io.InputStream;
type InputStreamReader = java.io.InputStreamReader;
const InputStreamReader = java.io.InputStreamReader;
type StandardCharsets = java.nio.charset.StandardCharsets;
const StandardCharsets = java.nio.charset.StandardCharsets;
type BufferedReader = java.io.BufferedReader;
const BufferedReader = java.io.BufferedReader;
type URLConnection = java.net.URLConnection;
const URLConnection = java.net.URLConnection;
type Arrays = java.util.Arrays;
const Arrays = java.util.Arrays;
type Long = java.lang.Long;
const Long = java.lang.Long;
type Math = java.lang.Math;
const Math = java.lang.Math;
type Path = java.nio.file.Path;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;

import { Test, Override } from "../../../../../../../../../decorators.js";


/** Test how fast we can lex Java and some unicode graphemes using old and
 *  new unicode stream mechanism. It also tests load time for unicode code points beyond 0xFFFF.
 *
 *  Sample output on Linux with Intel Xeon E5-2600 @ 2.20 GHz (us == microseconds, 1/1000 of a millisecond):
 *
Java VM args:
Warming up Java compiler....
    load_legacy_java_utf8 average time   273us size 132266b over 3500 loads of 29038 symbols from Parser.java
    load_legacy_java_utf8 average time   299us size 128386b over 3500 loads of 13379 symbols from udhr_hin.txt
            load_new_utf8 average time   535us size 284788b over 3500 loads of 29038 symbols from Parser.java
            load_new_utf8 average time   439us size 153150b over 3500 loads of 13379 symbols from udhr_hin.txt

     lex_legacy_java_utf8 average time   624us over 2000 runs of 29038 symbols
     lex_legacy_java_utf8 average time  1530us over 2000 runs of 29038 symbols DFA cleared
        lex_new_java_utf8 average time   672us over 2000 runs of 29038 symbols
        lex_new_java_utf8 average time  1671us over 2000 runs of 29038 symbols DFA cleared

 lex_legacy_grapheme_utf8 average time 11942us over  400 runs of  6614 symbols from udhr_kor.txt
 lex_legacy_grapheme_utf8 average time 12075us over  400 runs of  6614 symbols from udhr_kor.txt DFA cleared
 lex_legacy_grapheme_utf8 average time 10040us over  400 runs of 13379 symbols from udhr_hin.txt
 lex_legacy_grapheme_utf8 average time 10221us over  400 runs of 13379 symbols from udhr_hin.txt DFA cleared
 *
 *  Sample output on OS X with 4 GHz Intel Core i7 (us == microseconds, 1/1000 of a millisecond):
 *
 Java VM args: -Xms2G -Xmx8g
 Warming up Java compiler....
 load_legacy_java_ascii_file average time    53us size  58384b over 3500 loads of 29038 symbols from Parser.java
 load_legacy_java_ascii_file average time    27us size  15568b over 3500 loads of  7625 symbols from RuleContext.java
      load_legacy_java_ascii average time    53us size  65584b over 3500 loads of 29038 symbols from Parser.java
      load_legacy_java_ascii average time    13us size  32816b over 3500 loads of  7625 symbols from RuleContext.java
       load_legacy_java_utf8 average time    54us size  65584b over 3500 loads of 29038 symbols from Parser.java
       load_legacy_java_utf8 average time   118us size  32816b over 3500 loads of 13379 symbols from udhr_hin.txt
               load_new_utf8 average time   232us size 131232b over 3500 loads of 29038 symbols from Parser.java
               load_new_utf8 average time    69us size  32928b over 3500 loads of  7625 symbols from RuleContext.java
               load_new_utf8 average time   210us size  65696b over 3500 loads of 13379 symbols from udhr_hin.txt

        lex_legacy_java_utf8 average time   342us over 2000 runs of 29038 symbols
        lex_legacy_java_utf8 average time   890us over 2000 runs of 29038 symbols DFA cleared
           lex_new_java_utf8 average time   439us over 2000 runs of 29038 symbols
           lex_new_java_utf8 average time   969us over 2000 runs of 29038 symbols DFA cleared

    lex_legacy_grapheme_utf8 average time  3971us over  400 runs of  6614 symbols from udhr_kor.txt
    lex_legacy_grapheme_utf8 average time  4084us over  400 runs of  6614 symbols from udhr_kor.txt DFA cleared
    lex_legacy_grapheme_utf8 average time  7542us over  400 runs of 13379 symbols from udhr_hin.txt
    lex_legacy_grapheme_utf8 average time  7666us over  400 runs of 13379 symbols from udhr_hin.txt DFA cleared
       lex_new_grapheme_utf8 average time  4034us over  400 runs of  6614 symbols from udhr_kor.txt
       lex_new_grapheme_utf8 average time  4173us over  400 runs of  6614 symbols from udhr_kor.txt DFA cleared
       lex_new_grapheme_utf8 average time  7680us over  400 runs of 13379 symbols from udhr_hin.txt
       lex_new_grapheme_utf8 average time  7946us over  400 runs of 13379 symbols from udhr_hin.txt DFA cleared
       lex_new_grapheme_utf8 average time    70us over  400 runs of    85 symbols from emoji.txt
       lex_new_grapheme_utf8 average time    82us over  400 runs of    85 symbols from emoji.txt DFA cleared
 *
 *  I dump footprint now too (this is 64-bit HotSpot VM):
 *
 Parser.java (29038 char): org.antlr.v4.runtime.ANTLRFileStream@6b8e0782d footprint:
      COUNT       AVG       SUM   DESCRIPTION
          2     29164     58328   [C
          1        24        24   java.lang.String
          1        32        32   org.antlr.v4.runtime.ANTLRFileStream
          4               58384   (total)

 RuleContext.java (7625 char): org.antlr.v4.runtime.ANTLRFileStream@76fb7505d footprint:
      COUNT       AVG       SUM   DESCRIPTION
          2      7756     15512   [C
          1        24        24   java.lang.String
          1        32        32   org.antlr.v4.runtime.ANTLRFileStream
          4               15568   (total)

 Parser.java (29038 char): org.antlr.v4.runtime.ANTLRInputStream@1fc1cb1d footprint:
      COUNT       AVG       SUM   DESCRIPTION
          1     65552     65552   [C
          1        32        32   org.antlr.v4.runtime.ANTLRInputStream
          2               65584   (total)

 RuleContext.java (7625 char): org.antlr.v4.runtime.ANTLRInputStream@2c6aa25dd footprint:
      COUNT       AVG       SUM   DESCRIPTION
          1     32784     32784   [C
          1        32        32   org.antlr.v4.runtime.ANTLRInputStream
          2               32816   (total)

 Parser.java (29038 char): org.antlr.v4.runtime.ANTLRInputStream@3d08db0bd footprint:
      COUNT       AVG       SUM   DESCRIPTION
          1     65552     65552   [C
          1        32        32   org.antlr.v4.runtime.ANTLRInputStream
          2               65584   (total)

 udhr_hin.txt (13379 char): org.antlr.v4.runtime.ANTLRInputStream@486dc6f3d footprint:
      COUNT       AVG       SUM   DESCRIPTION
          1     32784     32784   [C
          1        32        32   org.antlr.v4.runtime.ANTLRInputStream
          2               32816   (total)

 Parser.java (29038 char): org.antlr.v4.runtime.CodePointCharStream@798fe5a1d footprint:
      COUNT       AVG       SUM   DESCRIPTION
          1        40        40   [C
          1    131088    131088   [I
          1        24        24   java.lang.String
          1        48        48   java.nio.HeapIntBuffer
          1        32        32   org.antlr.v4.runtime.CodePointCharStream
          5              131232   (total)

 RuleContext.java (7625 char): org.antlr.v4.runtime.CodePointCharStream@29cf5a20d footprint:
      COUNT       AVG       SUM   DESCRIPTION
          1        40        40   [C
          1     32784     32784   [I
          1        24        24   java.lang.String
          1        48        48   java.nio.HeapIntBuffer
          1        32        32   org.antlr.v4.runtime.CodePointCharStream
          5               32928   (total)

 udhr_hin.txt (13379 char): org.antlr.v4.runtime.CodePointCharStream@1adb8a22d footprint:
      COUNT       AVG       SUM   DESCRIPTION
          1        40        40   [C
          1     65552     65552   [I
          1        24        24   java.lang.String
          1        48        48   java.nio.HeapIntBuffer
          1        32        32   org.antlr.v4.runtime.CodePointCharStream
          5               65696   (total)
 *
 *  The "DFA cleared" indicates that the lexer was returned to initial conditions
 *  before the tokenizing of each file.	 As the ALL(*) lexer encounters new input,
 *  it records how it tokenized the chars. The next time it sees that input,
 *  it will more quickly recognize the token.
 *
 *  Lexing times have the top 20% stripped off before doing the average
 *  to account for issues with the garbage collection and compilation pauses;
 *  other OS tasks could also pop in randomly.
 *
 *  Load times are too fast to measure with a microsecond clock using an SSD
 *  so the average load time is computed as the overall time to load
 *  n times divided by n (rather then summing up the individual times).
 *
 *  @since 4.7
 */
export  class TimeLexerSpeed extends JavaObject { // don't call it Test else it'll run during "mvn test"
	public static readonly  Parser_java_file = "Java/src/org/antlr/v4/runtime/Parser.java";
	public static readonly  RuleContext_java_file = "Java/src/org/antlr/v4/runtime/RuleContext.java";
	public static readonly  PerfDir = "org/antlr/v4/test/runtime/java/api/perf";

	public  output = true;

	public  streamFootprints = new  ArrayList();

	public static  main(args: String[]):  void {
		let  runtimeMxBean = ManagementFactory.getRuntimeMXBean();
		let  vmArgs = runtimeMxBean.getInputArguments();
		System.out.print("Java VM args: ");
		for (let vmArg of vmArgs) {
			if ( !vmArg.startsWith("-D") ) {
				System.out.print(vmArg+" ");
			}
		}
		System.out.println();
//		System.out.println(VM.current().details());

		let  tests = new  TimeLexerSpeed();

		tests.compilerWarmUp(100);

		let  n = 3500;
		tests.load_legacy_java_ascii_file(TimeLexerSpeed.Parser_java_file, n);
		tests.load_legacy_java_ascii_file(TimeLexerSpeed.RuleContext_java_file, n);
		tests.load_legacy_java_ascii(TimeLexerSpeed.Parser_java_file, n);
		tests.load_legacy_java_ascii(TimeLexerSpeed.RuleContext_java_file, n);
		tests.load_legacy_java_utf8(TimeLexerSpeed.Parser_java_file, n);
		tests.load_legacy_java_utf8(TimeLexerSpeed.PerfDir+"/udhr_hin.txt", n);
		tests.load_new_utf8(TimeLexerSpeed.Parser_java_file, n);
		tests.load_new_utf8(TimeLexerSpeed.RuleContext_java_file, n);
		tests.load_new_utf8(TimeLexerSpeed.PerfDir+"/udhr_hin.txt", n);
		System.out.println();

		n = 2000;
		tests.lex_legacy_java_utf8(n, false);
		tests.lex_legacy_java_utf8(n, true);
		tests.lex_new_java_utf8(n, false);
		tests.lex_new_java_utf8(n, true);
		System.out.println();

		n = 400;
		tests.lex_legacy_grapheme_utf8("udhr_kor.txt", n, false);
		tests.lex_legacy_grapheme_utf8("udhr_kor.txt", n, true);
		tests.lex_legacy_grapheme_utf8("udhr_hin.txt", n, false);
		tests.lex_legacy_grapheme_utf8("udhr_hin.txt", n, true);
		// legacy can't handle the emoji (32 bit stuff)

		tests.lex_new_grapheme_utf8("udhr_kor.txt", n, false);
		tests.lex_new_grapheme_utf8("udhr_kor.txt", n, true);
		tests.lex_new_grapheme_utf8("udhr_hin.txt", n, false);
		tests.lex_new_grapheme_utf8("udhr_hin.txt", n, true);
		tests.lex_new_grapheme_utf8("emoji.txt", n, false);
		tests.lex_new_grapheme_utf8("emoji.txt", n, true);

		for (let streamFootprint of tests.streamFootprints) {
			System.out.print(streamFootprint);
		}
	}

	public static  basename(fullyQualifiedFileName: String):  String;

	public static  basename(path: Path):  String;
public static basename(...args: unknown[]):  String {
		switch (args.length) {
			case 1: {
				const [fullyQualifiedFileName] = args as [String];


		let  path = Paths.get(fullyQualifiedFileName);
		return TimeLexerSpeed.basename(path);
	

				break;
			}

			case 1: {
				const [path] = args as [Path];


		return path.getName(path.getNameCount()-1).toString();
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public static  dirname(fullyQualifiedFileName: String):  String;

	public static  dirname(path: Path):  String;
public static dirname(...args: unknown[]):  String {
		switch (args.length) {
			case 1: {
				const [fullyQualifiedFileName] = args as [String];


		let  path = Paths.get(fullyQualifiedFileName);
		return TimeLexerSpeed.dirname(path);
	

				break;
			}

			case 1: {
				const [path] = args as [Path];


		return path.getName(0).toString();
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public static  getResourceSize(loader: ClassLoader, resourceName: String):  long {
		let  uc = null;
		try {
			// Sadly, URLConnection is not AutoCloseable, but it leaks resources if
			// we don't close its stream.
			uc = loader.getResource(resourceName).openConnection();
			return uc.getContentLengthLong();
		} finally {
			if (uc !== null) {
				uc.getInputStream().close();
			}
		}
	}

	public  compilerWarmUp(n: int):  void {
		System.out.print("Warming up Java compiler");
		this.output = false;
		this.lex_new_java_utf8(n, false);
		System.out.print('.');
		this.lex_legacy_java_utf8(n, false);
		System.out.print('.');
		System.out.print('.');
		this.lex_legacy_grapheme_utf8("udhr_hin.txt", n, false);
		System.out.print('.');
		this.lex_new_grapheme_utf8("udhr_hin.txt", n, false);
		System.out.println();
		this.output = true;
	}

	public  load_legacy_java_ascii_file(resourceName: String, n: int):  void {
		let  sampleJavaFile = TimeLexerSpeed.class.getClassLoader().getResource(resourceName);
		if ( sampleJavaFile===null ) {
			System.err.println("Can't run load_legacy_java_ascii_file from jar (or can't find "+resourceName+")");
			return; // cannot find resource
		}
		if ( !new  File(sampleJavaFile.getFile()).exists() ) {
			System.err.println("Can't run load_legacy_java_ascii_file from jar (or can't find "+resourceName+")");
			return;
		}
		let  start = System.nanoTime();
		let  input = new  Array<CharStream>(n); // keep refs around so we can average memory
		for (let  i = 0; i<n; i++) {
			input[i] = new  ANTLRFileStream(sampleJavaFile.getFile());
		}
		let  stop = System.nanoTime();
		let  tus = (stop-start)/1000;
		let  size = input[0].size();
		let  currentMethodName = new  Exception().getStackTrace()[0].getMethodName();
		let  olayout = GraphLayout.parseInstance( input[0] as java.lang.Object);
		let  streamSize = olayout.totalSize();
		this.streamFootprints.add(TimeLexerSpeed.basename(resourceName)+" ("+size+" char): "+olayout.toFootprint());
		if ( this.output ) {
 System.out.printf("%27s average time %5dus size %6db over %4d loads of %5d symbols from %s\n",
		                                currentMethodName,
		                                tus/n,
		                                streamSize,
		                                n,
		                                size,
		                                TimeLexerSpeed.basename(resourceName));
}

	}

	public  load_legacy_java_ascii(resourceName: String, n: int):  void {
		let  input = new  Array<CharStream>(n); // keep refs around so we can average memory
		let  loader = TimeLexerSpeed.class.getClassLoader();
		let  streams = new  Array<InputStream>(n);
		for (let  i = 0; i<n; i++) {
			streams[i] = loader.getResourceAsStream(resourceName);
		}
		let  start = System.nanoTime(); // track only time to suck data out of stream
		for (let  i = 0; i<n; i++) {
			 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const is: InputStream  = streams[i]
try {
	try  {
				input[i] = new  ANTLRInputStream(CharStreams.fromStream.is);
			}
	finally {
	error = closeResources([is]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

		}
		let  stop = System.nanoTime();
		let  tus = (stop-start)/1000;
		let  size = input[0].size();
		let  streamSize = GraphLayout.parseInstance(input[0] as java.lang.Object).totalSize();
		this.streamFootprints.add(TimeLexerSpeed.basename(resourceName)+" ("+size+" char): "+GraphLayout.parseInstance(input[0] as java.lang.Object).toFootprint());
		let  currentMethodName = new  Exception().getStackTrace()[0].getMethodName();
		if ( this.output ) {
 System.out.printf("%27s average time %5dus size %6db over %4d loads of %5d symbols from %s\n",
		                                currentMethodName,
		                                tus/n,
		                                streamSize,
		                                n,
		                                size,
		                                TimeLexerSpeed.basename(resourceName));
}

	}

	public  load_legacy_java_utf8(resourceName: String, n: int):  void {
		let  input = new  Array<CharStream>(n); // keep refs around so we can average memory
		let  loader = TimeLexerSpeed.class.getClassLoader();
		let  streams = new  Array<InputStream>(n);
		for (let  i = 0; i<n; i++) {
			streams[i] = loader.getResourceAsStream(resourceName);
		}
		let  start = System.nanoTime(); // track only time to suck data out of stream
		for (let  i = 0; i<n; i++) {
			 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const is: InputStream  = streams[i];
			     const isr: InputStreamReader  = new  InputStreamReader(CharStreams.fromStream.is, StandardCharsets.UTF_8);
			     const br: BufferedReader  = new  BufferedReader(isr)
try {
	try  {
				input[i] = new  ANTLRInputStream(br);
			}
	finally {
	error = closeResources([is, isr, br]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

		}
		let  stop = System.nanoTime();
		let  tus = (stop-start)/1000;
		let  size = input[0].size();
		let  streamSize = GraphLayout.parseInstance(input[0] as java.lang.Object).totalSize();
		this.streamFootprints.add(TimeLexerSpeed.basename(resourceName)+" ("+size+" char): "+GraphLayout.parseInstance(input[0] as java.lang.Object).toFootprint());
		let  currentMethodName = new  Exception().getStackTrace()[0].getMethodName();
		if ( this.output ) {
 System.out.printf("%27s average time %5dus size %6db over %4d loads of %5d symbols from %s\n",
		                                currentMethodName,
		                                tus/n,
		                                streamSize,
		                                n,
		                                size,
		                                TimeLexerSpeed.basename(resourceName));
}

	}

	public  load_new_utf8(resourceName: String, n: int):  void {
		let  input = new  Array<CharStream>(n); // keep refs around so we can average memory
		let  loader = TimeLexerSpeed.class.getClassLoader();
		let  streams = new  Array<InputStream>(n);
		for (let  i = 0; i<n; i++) {
			streams[i] = loader.getResourceAsStream(resourceName);
		}
		let  uc = null;
		let  streamLength = TimeLexerSpeed.getResourceSize(loader, resourceName);
		let  start = System.nanoTime(); // track only time to suck data out of stream
		for (let  i = 0; i<n; i++) {
			 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const is: InputStream  = streams[i]
try {
	try  {
				input[i] = CharStreams.fromStream(CharStreams.fromStream.is, StandardCharsets.UTF_8, streamLength);
			}
	finally {
	error = closeResources([is]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

		}
		let  stop = System.nanoTime();
		let  tus = (stop-start)/1000;
		let  size = input[0].size();
		let  streamSize = GraphLayout.parseInstance(input[0] as java.lang.Object).totalSize();
		this.streamFootprints.add(TimeLexerSpeed.basename(resourceName)+" ("+size+" char): "+GraphLayout.parseInstance(input[0] as java.lang.Object).toFootprint());
		let  currentMethodName = new  Exception().getStackTrace()[0].getMethodName();
		if ( this.output ) {
 System.out.printf("%27s average time %5dus size %6db over %4d loads of %5d symbols from %s\n",
						currentMethodName,
						tus/n,
						streamSize,
						n,
						size,
						TimeLexerSpeed.basename(resourceName));
}

	}

	public  lex_legacy_java_utf8(n: int, clearLexerDFACache: boolean):  void {
		 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const is: InputStream  = TimeLexerSpeed.class.getClassLoader().getResourceAsStream(TimeLexerSpeed.Parser_java_file);
		     const isr: InputStreamReader  = new  InputStreamReader(CharStreams.fromStream.is, StandardCharsets.UTF_8);
		     const br: BufferedReader  = new  BufferedReader(isr)
try {
	try  {
			let  input = new  ANTLRInputStream(br);
			let  lexer = new  JavaLexer(input);
			let  avg = this.tokenize(lexer, n, clearLexerDFACache);
			let  currentMethodName = new  Exception().getStackTrace()[0].getMethodName();
			if ( this.output ) {
 System.out.printf("%27s average time %5dus over %4d runs of %5d symbols%s\n",
							currentMethodName,
							avg as int,
							n,
							input.size(),
							clearLexerDFACache ? " DFA cleared" : "");
}

		}
	finally {
	error = closeResources([is, isr, br]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	public  lex_new_java_utf8(n: int, clearLexerDFACache: boolean):  void {
		let  loader = TimeLexerSpeed.class.getClassLoader();
		 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const is: InputStream  = loader.getResourceAsStream(TimeLexerSpeed.Parser_java_file)
try {
	try  {
			let  size = TimeLexerSpeed.getResourceSize(loader, TimeLexerSpeed.Parser_java_file);
			let  input = CharStreams.fromStream(CharStreams.fromStream.is, StandardCharsets.UTF_8, size);
			let  lexer = new  JavaLexer(input);
			let  avg = this.tokenize(lexer, n, clearLexerDFACache);
			let  currentMethodName = new  Exception().getStackTrace()[0].getMethodName();
			if ( this.output ) {
 System.out.printf("%27s average time %5dus over %4d runs of %5d symbols%s\n",
							currentMethodName,
							avg as int,
							n,
							input.size(),
							clearLexerDFACache ? " DFA cleared" : "");
}

		}
	finally {
	error = closeResources([is]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	public  lex_legacy_grapheme_utf8(fileName: String, n: int, clearLexerDFACache: boolean):  void {
		 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const is: InputStream  = TimeLexerSpeed.class.getClassLoader().getResourceAsStream(TimeLexerSpeed.PerfDir+"/"+fileName);
		     const isr: InputStreamReader  = new  InputStreamReader(CharStreams.fromStream.is, StandardCharsets.UTF_8);
		     const br: BufferedReader  = new  BufferedReader(isr)
try {
	try  {
			let  input = new  ANTLRInputStream(br);
			let  lexer = new  graphemesLexer(input);
			let  avg = this.tokenize(lexer, n, clearLexerDFACache);
			let  currentMethodName = new  Exception().getStackTrace()[0].getMethodName();
			if ( this.output ) {
 System.out.printf("%27s average time %5dus over %4d runs of %5d symbols from %s%s\n",
							currentMethodName,
							avg as int,
							n,
							input.size(),
							fileName,
							clearLexerDFACache ? " DFA cleared" : "");
}

		}
	finally {
	error = closeResources([is, isr, br]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	public  lex_new_grapheme_utf8(fileName: String, n: int, clearLexerDFACache: boolean):  void {
		let  resourceName = TimeLexerSpeed.PerfDir+"/"+fileName;
		let  loader = TimeLexerSpeed.class.getClassLoader();
		 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const is: InputStream  = loader.getResourceAsStream(resourceName)
try {
	try  {
			let  size = TimeLexerSpeed.getResourceSize(loader, resourceName);
			let  input = CharStreams.fromStream(CharStreams.fromStream.is, StandardCharsets.UTF_8, size);
			let  lexer = new  graphemesLexer(input);
			let  avg = this.tokenize(lexer, n, clearLexerDFACache);
			let  currentMethodName = new  Exception().getStackTrace()[0].getMethodName();
			if ( this.output ) {
 System.out.printf("%27s average time %5dus over %4d runs of %5d symbols from %s%s\n",
							currentMethodName,
							avg as int,
							n,
							input.size(),
							fileName,
							clearLexerDFACache ? " DFA cleared" : "");
}

		}
	finally {
	error = closeResources([is]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	public  tokenize(lexer: Lexer, n: int, clearLexerDFACache: boolean):  double {
		// always wipe the DFA before we begin tests so previous tests
		// don't affect this run!
		lexer.getInterpreter().clearDFA();
		let  times = new  BigInt64Array(n);
		for (let  i = 0; i<n; i++) {
			lexer.reset();
			if ( clearLexerDFACache ) {
				lexer.getInterpreter().clearDFA();
			}
			let  start = System.nanoTime();
			let  tokens = new  CommonTokenStream(lexer);
			tokens.fill(); // lex whole file.
//			int size = lexer.getInputStream().size();
			let  stop = System.nanoTime();
			times[i] = (stop-start)/1000;
//			if ( output ) System.out.printf("Tokenized %d char in %dus\n", size, times[i]);
		}
		Arrays.sort(times);
		times = Arrays.copyOfRange(times, 0, times.length-(n*.2) as int); // drop highest 20% of times
		return this.avg(times);
	}

	public  avg(values: BigInt64Array):  double {
		let  sum = 0.0;
		for (let v of values) {
			sum += v;
		}
		return sum / values.length;
	}

	public  std(mean: double, values: List<Long>):  double { // unbiased std dev
		let  sum = 0.0;
		for (let v of values) {
			sum += (v-mean)*(v-mean);
		}
		return Math.sqrt(sum / (values.size() - 1));
	}
}
