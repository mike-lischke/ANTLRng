/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ANTLRToolListener } from "./ANTLRToolListener.js";
import { ANTLRMessage } from "./ANTLRMessage.js";
import { Tool } from "../Tool.js";



/** */
export  class DefaultToolListener implements ANTLRToolListener {
	public  tool:  Tool;

	public  constructor(tool: Tool) { this.tool = tool; }

	@Override
public  info(msg: string):  void {
		if (this.tool.errMgr.formatWantsSingleLineMessage()) {
			msg = msg.replace('\n', ' ');
		}
		System.out.println(msg);
	}

	@Override
public  error(msg: ANTLRMessage):  void {
		let  msgST = this.tool.errMgr.getMessageTemplate(msg);
		let  outputMsg = msgST.render();
		if (this.tool.errMgr.formatWantsSingleLineMessage()) {
			outputMsg = outputMsg.replace('\n', ' ');
		}
		System.err.println(outputMsg);
	}

	@Override
public  warning(msg: ANTLRMessage):  void {
		let  msgST = this.tool.errMgr.getMessageTemplate(msg);
		let  outputMsg = msgST.render();
		if (this.tool.errMgr.formatWantsSingleLineMessage()) {
			outputMsg = outputMsg.replace('\n', ' ');
		}
		System.err.println(outputMsg);
	}
}
