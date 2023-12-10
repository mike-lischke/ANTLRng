/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java, JavaObject, type int, S } from "jree";
import { Utils } from "antlr4ng";

type List<E> = java.util.List<E>;
type String = java.lang.String;
const String = java.lang.String;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
type IllegalStateException = java.lang.IllegalStateException;
const IllegalStateException = java.lang.IllegalStateException;
type StringBuilder = java.lang.StringBuilder;
const StringBuilder = java.lang.StringBuilder;

import { Test, Override } from "../../../../../../decorators.js";


export  class ErrorQueue extends JavaObject implements ANTLRToolListener {
	public readonly  tool;
	public readonly  infos = new  ArrayList<String>();
	public readonly  errors = new  ArrayList<ANTLRMessage>();
	public readonly  warnings = new  ArrayList<ANTLRMessage>();
	public readonly  all = new  ArrayList<ANTLRMessage>();

	public  constructor();

	public  constructor(tool: Tool);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 0: {

		this(null);
	

				break;
			}

			case 1: {
				const [tool] = args as [Tool];


		super();
this.tool = tool;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public  info(msg: String):  void {
		this.infos.add(msg);
	}

	@Override
public  error(msg: ANTLRMessage):  void;

	public  error(msg: ToolMessage):  void;
public error(...args: unknown[]):  void {
		switch (args.length) {
			case 1: {
				const [msg] = args as [ANTLRMessage];


		this.errors.add(msg);
        this.all.add(msg);
	

				break;
			}

			case 1: {
				const [msg] = args as [ToolMessage];


		this.errors.add(msg);
		this.all.add(msg);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public  warning(msg: ANTLRMessage):  void {
		this.warnings.add(msg);
        this.all.add(msg);
	}

	public  size():  int {
		return this.all.size() + this.infos.size();
	}

	@Override
public override  toString():  String;

	public override  toString(rendered: boolean):  String;
public override toString(...args: unknown[]):  String {
		switch (args.length) {
			case 0: {

		return this.toString(false);
	

				break;
			}

			case 1: {
				const [rendered] = args as [boolean];


		if (!rendered) {
			return Utils.join(this.all.iterator(), "\n");
		}

		if (this.tool === null) {
			throw new  IllegalStateException(String.format("No %s instance is available.", Tool.class.getName()));
		}

		let  buf = new  StringBuilder();
		for (let m of this.all) {
			let  st = this.tool.errMgr.getMessageTemplate(m);
			buf.append(st.render());
			buf.append("\n");
		}

		return buf.toString();
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


}

