/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject, type int, type char } from "jree";

type Runnable = java.lang.Runnable;
type StringBuilder = java.lang.StringBuilder;
const StringBuilder = java.lang.StringBuilder;
type BufferedReader = java.io.BufferedReader;
const BufferedReader = java.io.BufferedReader;
type Thread = java.lang.Thread;
const Thread = java.lang.Thread;
type InputStream = java.io.InputStream;
const InputStream = java.io.InputStream;
type InputStreamReader = java.io.InputStreamReader;
const InputStreamReader = java.io.InputStreamReader;
type StandardCharsets = java.nio.charset.StandardCharsets;
const StandardCharsets = java.nio.charset.StandardCharsets;
type IOException = java.io.IOException;
const IOException = java.io.IOException;
type System = java.lang.System;
const System = java.lang.System;
type String = java.lang.String;
const String = java.lang.String;

import { Test, Override } from "../../../../../../decorators.js";


export  class StreamReader extends JavaObject implements Runnable {
	private readonly  buffer = new  StringBuilder();
	private readonly  in;
	private readonly  worker;

	public  constructor(in: InputStream) {
		super();
this.in = new  BufferedReader(new  InputStreamReader(in, StandardCharsets.UTF_8) );
		this.worker = new  Thread(this);
	}

	public  start():  void {
		this.worker.start();
	}

	@Override
public  run():  void {
		try {
			while (true) {
				let  c = this.in.read();
				if (c === -1) {
					break;
				}
				if (c === '\r') {
					continue;
				}
				this.buffer.append( c as char);
			}
		} catch (ioe) {
if (ioe instanceof IOException) {
			System.err.println("can't read output from process");
		} else {
	throw ioe;
	}
}
	}

	/** wait for the thread to finish */
	public  join():  void {
		this.worker.join();
	}

	@Override
public override  toString():  String {
		return this.buffer.toString();
	}
}
