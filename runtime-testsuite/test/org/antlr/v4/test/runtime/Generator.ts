/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject, type int, S } from "jree";
import { FileUtils } from "./FileUtils";
import { ErrorQueue } from "./ErrorQueue";

type String = java.lang.String;
const String = java.lang.String;
type List<E> = java.util.List<E>;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
type Collections = java.util.Collections;
const Collections = java.util.Collections;
type File = java.io.File;
const File = java.io.File;

import { Test, Override } from "../../../../../../decorators.js";


export  class Generator extends JavaObject {

	/** Run ANTLR on stuff in workdir and error queue back */
	public static  antlrOnString(workdir: String,
										   targetName: String,
										   grammarFileName: String,
										   defaultListener: boolean,...
										   extraOptions: String[]):  ErrorQueue;
	/** Write a grammar to tmpdir and run antlr */
	public static  antlrOnString(workdir: String,
										   targetName: String,
										   grammarFileName: String,
										   grammarStr: String,
										   defaultListener: boolean,...
										   extraOptions: String[]):  ErrorQueue;
public static antlrOnString(...args: unknown[]):  ErrorQueue {
		switch (args.length) {
			case 5: {
				const [workdir, targetName, grammarFileName, defaultListener, extraOptions] = args as [String, String, String, boolean, String[]];


		 let  options = new  ArrayList();
		Collections.addAll(options, extraOptions);
		if ( targetName!==null ) {
			options.add("-Dlanguage="+targetName);
		}
		if ( !options.contains("-o") ) {
			options.add("-o");
			options.add(workdir);
		}
		if ( !options.contains("-lib") ) {
			options.add("-lib");
			options.add(workdir);
		}
		if ( !options.contains("-encoding") ) {
			options.add("-encoding");
			options.add("UTF-8");
		}
		options.add(new  File(workdir,grammarFileName).toString());

		 let  optionsA = new  Array<String>(options.size());
		options.toArray(optionsA);
		let  antlr = new  Tool(optionsA);
		let  equeue = new  ErrorQueue(antlr);
		antlr.addListener(equeue);
		if (defaultListener) {
			antlr.addListener(new  DefaultToolListener(antlr));
		}
		antlr.processGrammarsOnCommandLine();

		let  errors = new  ArrayList();

		if ( !defaultListener && !equeue.errors.isEmpty() ) {
			for (let  i = 0; i < equeue.errors.size(); i++) {
				let  msg = equeue.errors.get(i);
				let  msgST = antlr.errMgr.getMessageTemplate(msg);
				errors.add(msgST.render());
			}
		}
		if ( !defaultListener && !equeue.warnings.isEmpty() ) {
			for (let  i = 0; i < equeue.warnings.size(); i++) {
				let  msg = equeue.warnings.get(i);
				// antlrToolErrors.append(msg); warnings are hushed
			}
		}

		return equeue;
	

				break;
			}

			case 6: {
				const [workdir, targetName, grammarFileName, grammarStr, defaultListener, extraOptions] = args as [String, String, String, String, boolean, String[]];


		FileUtils.mkdir(workdir);
		FileUtils.writeFile(workdir, grammarFileName, grammarStr);
		return Generator.antlrOnString(workdir, targetName, grammarFileName, defaultListener, extraOptions);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}

}
