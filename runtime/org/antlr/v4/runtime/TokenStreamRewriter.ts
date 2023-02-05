/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { JavaObject,S,java } from "jree";
import { ANTLRInputStream } from "./ANTLRInputStream";
import { CommonToken } from "./CommonToken";
import { Token } from "./Token";
import { TokenStream } from "./TokenStream";
import { Interval } from "./misc/Interval";




/**
 * Useful for rewriting out a buffered input token stream after doing some
 * augmentation or other manipulations on it.
 *
 * <p>
 * You can insert stuff, replace, and delete chunks. Note that the operations
 * are done lazily--only if you convert the buffer to a {@link String} with
 * {@link TokenStream#getText()}. This is very efficient because you are not
 * moving data around all the time. As the buffer of tokens is converted to
 * strings, the {@link #getText()} method(s) scan the input token stream and
 * check to see if there is an operation at the current index. If so, the
 * operation is done and then normal {@link String} rendering continues on the
 * buffer. This is like having multiple Turing machine instruction streams
 * (programs) operating on a single input tape. :)</p>
 *
 * <p>
 * This rewriter makes no modifications to the token stream. It does not ask the
 * stream to fill itself up nor does it advance the input cursor. The token
 * stream {@link TokenStream#index()} will return the same value before and
 * after any {@link #getText()} call.</p>
 *
 * <p>
 * The rewriter only works on tokens that you have in the buffer and ignores the
 * current input cursor. If you are buffering tokens on-demand, calling
 * {@link #getText()} halfway through the input will only do rewrites for those
 * tokens in the first half of the file.</p>
 *
 * <p>
 * Since the operations are done lazily at {@link #getText}-time, operations do
 * not screw up the token index values. That is, an insert operation at token
 * index {@code i} does not change the index values for tokens
 * {@code i}+1..n-1.</p>
 *
 * <p>
 * Because operations never actually alter the buffer, you may always get the
 * original token stream back without undoing anything. Since the instructions
 * are queued up, you can easily simulate transactions and roll back any changes
 * if there is an error just by removing instructions. For example,</p>
 *
 * <pre>
 * CharStream input = new ANTLRFileStream("input");
 * TLexer lex = new TLexer(input);
 * CommonTokenStream tokens = new CommonTokenStream(lex);
 * T parser = new T(tokens);
 * TokenStreamRewriter rewriter = new TokenStreamRewriter(tokens);
 * parser.startRule();
 * </pre>
 *
 * <p>
 * Then in the rules, you can execute (assuming rewriter is visible):</p>
 *
 * <pre>
 * Token t,u;
 * ...
 * rewriter.insertAfter(t, "text to put after t");}
 * rewriter.insertAfter(u, "text after u");}
 * System.out.println(rewriter.getText());
 * </pre>
 *
 * <p>
 * You can also have multiple "instruction streams" and get multiple rewrites
 * from a single pass over the input. Just name the instruction streams and use
 * that name again when printing the buffer. This could be useful for generating
 * a C file and also its header file--all from the same buffer:</p>
 *
 * <pre>
 * rewriter.insertAfter("pass1", t, "text to put after t");}
 * rewriter.insertAfter("pass2", u, "text after u");}
 * System.out.println(rewriter.getText("pass1"));
 * System.out.println(rewriter.getText("pass2"));
 * </pre>
 *
 * <p>
 * If you don't use named rewrite streams, a "default" stream is used as the
 * first example shows.</p>
 */
export class TokenStreamRewriter extends JavaObject {
	public readonly  DEFAULT_PROGRAM_NAME:  java.lang.String | null = S`default`;
	public readonly  PROGRAM_INIT_SIZE:  number = 100;
	public readonly  MIN_TOKEN_INDEX:  number = 0;

	// Define the rewrite operation hierarchy

	public RewriteOperation = (($outer) => {
return  class RewriteOperation extends JavaObject {
		/** What index into rewrites List are we? */
		protected  instructionIndex:  number;
		/** Token buffer index. */
		protected  index:  number;
		protected  text:  java.lang.Object | null;

		protected constructor(index: number);

		protected constructor(index: number, text: java.lang.Object| null);
protected constructor(index: number, text?: java.lang.Object | null) {
if (text === undefined) {
			super();
this.index = index;
		}
 else  {
			super();
this.index = index;
			this.text = text;
		}

}

		/** Execute the rewrite operation by possibly adding to the buffer.
		 *  Return the index of the next token to operate on.
		 */
		public execute = (buf: java.lang.StringBuilder| null):  number => {
			return $outer.index;
		}

		public toString = ():  java.lang.String | null => {
			 let  opName: java.lang.String = $outer.getClass().getName();
			 let  $index: number = opName.indexOf('$');
			opName = opName.substring($index+1, opName.length());
			return S`<`+opName+S`@`+$outer.tokens.get($outer.index)+
					S`:\"`+$outer.text+S`\">`;
		}
	}
})(this);


	public InsertBeforeOp = (($outer) => {
return class InsertBeforeOp extends InsertBeforeOp.RewriteOperation {
		public constructor(index: number, text: java.lang.Object| null) {
			super(index,text);
		}

		public execute = (buf: java.lang.StringBuilder| null):  number => {
			buf.append(CommonToken.text);
			if ( $outer.tokens.get(ANTLRInputStream.index).getType()!==Token.EOF ) {
				buf.append($outer.tokens.get(ANTLRInputStream.index).getText());
			}
			return ANTLRInputStream.index+1;
		}
	}
})(this);


	/** Distinguish between insert after/before to do the "insert afters"
	 *  first and then the "insert befores" at same index. Implementation
	 *  of "insert after" is "insert before index+1".
	 */
    public InsertAfterOp = (($outer) => {
return class InsertAfterOp extends InsertAfterOp.InsertBeforeOp {
        public constructor(index: number, text: java.lang.Object| null) {
            super(index+1, text); // insert after is insert before index+1
        }
    }
})(this);


	/** I'm going to try replacing range from x..y with (y-x)+1 ReplaceOp
	 *  instructions.
	 */
	public ReplaceOp = (($outer) => {
return class ReplaceOp extends ReplaceOp.RewriteOperation {
		protected  lastIndex:  number;
		public constructor(from: number, to: number, text: java.lang.Object| null) {
			super(from,text);
			$outer.lastIndex = to;
		}
		public execute = (buf: java.lang.StringBuilder| null):  number => {
			if ( CommonToken.text!==null ) {
				buf.append(CommonToken.text);
			}
			return $outer.lastIndex+1;
		}
		public toString = ():  java.lang.String | null => {
			if ( CommonToken.text===null ) {
				return S`<DeleteOp@`+$outer.tokens.get(ANTLRInputStream.index)+
						S`..`+$outer.tokens.get($outer.lastIndex)+S`>`;
			}
			return S`<ReplaceOp@`+$outer.tokens.get(ANTLRInputStream.index)+
					S`..`+$outer.tokens.get($outer.lastIndex)+S`:\"`+CommonToken.text+S`\">`;
		}
	}
})(this);


	/** Our source stream */
	protected readonly  tokens:  TokenStream | null;

	/** You may have multiple, named streams of rewrite operations.
	 *  I'm calling these things "programs."
	 *  Maps String (name) &rarr; rewrite (List)
	 */
	protected readonly  programs:  java.util.Map<java.lang.String, java.util.List<TokenStreamRewriter.RewriteOperation>> | null;

	/** Map String (program name) &rarr; Integer index */
	protected readonly  lastRewriteTokenIndexes:  java.util.Map<java.lang.String, java.lang.Integer> | null;

	public constructor(tokens: TokenStream| null) {
		super();
this.tokens = tokens;
		this.programs = new  java.util.HashMap<java.lang.String, java.util.List<RewriteOperation>>();
		this.programs.put(TokenStreamRewriter.DEFAULT_PROGRAM_NAME,
					 new  java.util.ArrayList<RewriteOperation>(TokenStreamRewriter.PROGRAM_INIT_SIZE));
		this.lastRewriteTokenIndexes = new  java.util.HashMap<java.lang.String, java.lang.Integer>();
	}

	public readonly getTokenStream = ():  TokenStream | null => {
		return this.tokens;
	}

	public rollback(instructionIndex: number):  void;

	/** Rollback the instruction stream for a program so that
	 *  the indicated instruction (via instructionIndex) is no
	 *  longer in the stream. UNTESTED!
	 */
	public rollback(programName: java.lang.String| null, instructionIndex: number):  void;


	public rollback(instructionIndexOrProgramName: number | java.lang.String | null, instructionIndex?: number):  void {
if (typeof instructionIndexOrProgramName === "number" && instructionIndex === undefined) {
const instructionIndex = instructionIndexOrProgramName as number;
		this.rollback(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, instructionIndex);
	}
 else  {
let programName = instructionIndexOrProgramName as java.lang.String;
		 let  is: java.util.List<TokenStreamRewriter.RewriteOperation> = this.programs.get(programName);
		if ( is!==null ) {
			this.programs.put(programName, is.subList(TokenStreamRewriter.MIN_TOKEN_INDEX,instructionIndex));
		}
	}

}


	public deleteProgram():  void;

	/** Reset the program so that no instructions exist */
	public deleteProgram(programName: java.lang.String| null):  void;


	public deleteProgram(programName?: java.lang.String | null):  void {
if (programName === undefined) {
		this.deleteProgram(TokenStreamRewriter.DEFAULT_PROGRAM_NAME);
	}
 else  {
		this.rollback(programName, TokenStreamRewriter.MIN_TOKEN_INDEX);
	}

}


	public insertAfter(t: Token| null, text: java.lang.Object| null):  void;

	public insertAfter(index: number, text: java.lang.Object| null):  void;

	public insertAfter(programName: java.lang.String| null, t: Token| null, text: java.lang.Object| null):  void;

	public insertAfter(programName: java.lang.String| null, index: number, text: java.lang.Object| null):  void;


	public insertAfter(tOrIndexOrProgramName: Token | number | java.lang.String | null, textOrTOrIndex: java.lang.Object | Token | number | null, text?: java.lang.Object | null):  void {
if (tOrIndexOrProgramName instanceof Token && textOrTOrIndex instanceof java.lang.Object && text === undefined) {
const t = tOrIndexOrProgramName as Token;
const text = textOrTOrIndex as java.lang.Object;
		this.insertAfter(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, t, text);
	}
 else if (typeof tOrIndexOrProgramName === "number" && textOrTOrIndex instanceof java.lang.Object && text === undefined) {
const index = tOrIndexOrProgramName as number;
const text = textOrTOrIndex as java.lang.Object;
		this.insertAfter(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, index, text);
	}
 else if (tOrIndexOrProgramName instanceof java.lang.String && textOrTOrIndex instanceof Token && text instanceof java.lang.Object) {
const programName = tOrIndexOrProgramName as java.lang.String;
const t = textOrTOrIndex as Token;
		this.insertAfter(programName,t.getTokenIndex(), text);
	}
 else  {
let programName = tOrIndexOrProgramName as java.lang.String;
let index = textOrTOrIndex as number;
		// to insert after, just insert before next index (even if past end)
         let  op: TokenStreamRewriter.RewriteOperation = new  InsertAfterOp(index, text);
         let  rewrites: java.util.List<TokenStreamRewriter.RewriteOperation> = this.getProgram(programName);
        op.instructionIndex = rewrites.size();
        rewrites.add(op);
	}

}


	public insertBefore(t: Token| null, text: java.lang.Object| null):  void;

	public insertBefore(index: number, text: java.lang.Object| null):  void;

	public insertBefore(programName: java.lang.String| null, t: Token| null, text: java.lang.Object| null):  void;

	public insertBefore(programName: java.lang.String| null, index: number, text: java.lang.Object| null):  void;


	public insertBefore(tOrIndexOrProgramName: Token | number | java.lang.String | null, textOrTOrIndex: java.lang.Object | Token | number | null, text?: java.lang.Object | null):  void {
if (tOrIndexOrProgramName instanceof Token && textOrTOrIndex instanceof java.lang.Object && text === undefined) {
const t = tOrIndexOrProgramName as Token;
const text = textOrTOrIndex as java.lang.Object;
		this.insertBefore(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, t, text);
	}
 else if (typeof tOrIndexOrProgramName === "number" && textOrTOrIndex instanceof java.lang.Object && text === undefined) {
const index = tOrIndexOrProgramName as number;
const text = textOrTOrIndex as java.lang.Object;
		this.insertBefore(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, index, text);
	}
 else if (tOrIndexOrProgramName instanceof java.lang.String && textOrTOrIndex instanceof Token && text instanceof java.lang.Object) {
const programName = tOrIndexOrProgramName as java.lang.String;
const t = textOrTOrIndex as Token;
		this.insertBefore(programName, t.getTokenIndex(), text);
	}
 else  {
let programName = tOrIndexOrProgramName as java.lang.String;
let index = textOrTOrIndex as number;
		 let  op: TokenStreamRewriter.RewriteOperation = new  InsertBeforeOp(index,text);
		 let  rewrites: java.util.List<TokenStreamRewriter.RewriteOperation> = this.getProgram(programName);
		op.instructionIndex = rewrites.size();
		rewrites.add(op);
	}

}


	public replace(index: number, text: java.lang.Object| null):  void;

	public replace(indexT: Token| null, text: java.lang.Object| null):  void;

	public replace(from: number, to: number, text: java.lang.Object| null):  void;

	public replace(from: Token| null, to: Token| null, text: java.lang.Object| null):  void;

	public replace(programName: java.lang.String| null, from: number, to: number, text: java.lang.Object| null):  void;

	public replace(programName: java.lang.String| null, from: Token| null, to: Token| null, text: java.lang.Object| null):  void;


	public replace(indexOrIndexTOrFromOrProgramName: number | Token | java.lang.String | null, textOrToOrFrom: java.lang.Object | number | Token | null, textOrTo?: java.lang.Object | number | Token | null, text?: java.lang.Object | null):  void {
if (typeof indexOrIndexTOrFromOrProgramName === "number" && textOrToOrFrom instanceof java.lang.Object && textOrTo === undefined) {
const index = indexOrIndexTOrFromOrProgramName as number;
const text = textOrToOrFrom as java.lang.Object;
		this.replace(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, index, index, text);
	}
 else if (indexOrIndexTOrFromOrProgramName instanceof Token && textOrToOrFrom instanceof java.lang.Object && textOrTo === undefined) {
const indexT = indexOrIndexTOrFromOrProgramName as Token;
const text = textOrToOrFrom as java.lang.Object;
		this.replace(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, indexT, indexT, text);
	}
 else if (typeof indexOrIndexTOrFromOrProgramName === "number" && typeof textOrToOrFrom === "number" && textOrTo instanceof java.lang.Object && text === undefined) {
const from = indexOrIndexTOrFromOrProgramName as number;
const to = textOrToOrFrom as number;
const text = textOrTo as java.lang.Object;
		this.replace(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, from, to, text);
	}
 else if (indexOrIndexTOrFromOrProgramName instanceof Token && textOrToOrFrom instanceof Token && textOrTo instanceof java.lang.Object && text === undefined) {
const from = indexOrIndexTOrFromOrProgramName as Token;
const to = textOrToOrFrom as Token;
const text = textOrTo as java.lang.Object;
		this.replace(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, from, to, text);
	}
 else if (indexOrIndexTOrFromOrProgramName instanceof java.lang.String && typeof textOrToOrFrom === "number" && typeof textOrTo === "number" && text instanceof java.lang.Object) {
const programName = indexOrIndexTOrFromOrProgramName as java.lang.String;
const from = textOrToOrFrom as number;
const to = textOrTo as number;
		if ( from > to || from<0 || to<0 || to >= this.tokens.size() ) {
			throw new  java.lang.IllegalArgumentException(S`replace: range invalid: `+from+S`..`+to+S`(size=`+this.tokens.size()+S`)`);
		}
		 let  op: TokenStreamRewriter.RewriteOperation = new  ReplaceOp(from, to, text);
		 let  rewrites: java.util.List<TokenStreamRewriter.RewriteOperation> = this.getProgram(programName);
		op.instructionIndex = rewrites.size();
		rewrites.add(op);
	}
 else  {
let programName = indexOrIndexTOrFromOrProgramName as java.lang.String;
let from = textOrToOrFrom as Token;
let to = textOrTo as Token;
		this.replace(programName,
				from.getTokenIndex(),
				to.getTokenIndex(),
				text);
	}

}


	public delete(index: number):  void;

	public delete(indexT: Token| null):  void;

	public delete(from: number, to: number):  void;

	public delete(from: Token| null, to: Token| null):  void;

	public delete(programName: java.lang.String| null, from: number, to: number):  void;

	public delete(programName: java.lang.String| null, from: Token| null, to: Token| null):  void;


	public delete(indexOrIndexTOrFromOrProgramName: number | Token | java.lang.String | null, toOrFrom?: number | Token | null, to?: number | Token | null):  void {
if (typeof indexOrIndexTOrFromOrProgramName === "number" && toOrFrom === undefined) {
const index = indexOrIndexTOrFromOrProgramName as number;
		this.delete(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, index, index);
	}
 else if (indexOrIndexTOrFromOrProgramName instanceof Token && toOrFrom === undefined) {
const indexT = indexOrIndexTOrFromOrProgramName as Token;
		this.delete(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, indexT, indexT);
	}
 else if (typeof indexOrIndexTOrFromOrProgramName === "number" && typeof toOrFrom === "number" && to === undefined) {
const from = indexOrIndexTOrFromOrProgramName as number;
const to = toOrFrom as number;
		this.delete(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, from, to);
	}
 else if (indexOrIndexTOrFromOrProgramName instanceof Token && toOrFrom instanceof Token && to === undefined) {
const from = indexOrIndexTOrFromOrProgramName as Token;
const to = toOrFrom as Token;
		this.delete(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, from, to);
	}
 else if (indexOrIndexTOrFromOrProgramName instanceof java.lang.String && typeof toOrFrom === "number" && typeof to === "number") {
const programName = indexOrIndexTOrFromOrProgramName as java.lang.String;
const from = toOrFrom as number;
		this.replace(programName,from,to,null);
	}
 else  {
let programName = indexOrIndexTOrFromOrProgramName as java.lang.String;
let from = toOrFrom as Token;
		this.replace(programName,from,to,null);
	}

}


	public getLastRewriteTokenIndex():  number;

	protected getLastRewriteTokenIndex(programName: java.lang.String| null):  number;


	public getLastRewriteTokenIndex(programName?: java.lang.String | null):  number {
if (programName === undefined) {
		return this.getLastRewriteTokenIndex(TokenStreamRewriter.DEFAULT_PROGRAM_NAME);
	}
 else  {
		 let  I: java.lang.Integer = this.lastRewriteTokenIndexes.get(programName);
		if ( I===null ) {
			return -1;
		}
		return I;
	}

}


	protected setLastRewriteTokenIndex = (programName: java.lang.String| null, i: number):  void => {
		this.lastRewriteTokenIndexes.put(programName, i);
	}

	protected getProgram = (name: java.lang.String| null):  java.util.List<TokenStreamRewriter.RewriteOperation> | null => {
		 let  is: java.util.List<TokenStreamRewriter.RewriteOperation> = this.programs.get(name);
		if ( is===null ) {
			is = this.initializeProgram(name);
		}
		return is;
	}

	private initializeProgram = (name: java.lang.String| null):  java.util.List<TokenStreamRewriter.RewriteOperation> | null => {
		 let  is: java.util.List<TokenStreamRewriter.RewriteOperation> = new  java.util.ArrayList<RewriteOperation>(TokenStreamRewriter.PROGRAM_INIT_SIZE);
		this.programs.put(name, is);
		return is;
	}

	/** Return the text from the original tokens altered per the
	 *  instructions given to this rewriter.
 	 */
	public getText():  java.lang.String | null;

	/** Return the text from the original tokens altered per the
	 *  instructions given to this rewriter in programName.
 	 */
	public getText(programName: java.lang.String| null):  java.lang.String | null;

	/** Return the text associated with the tokens in the interval from the
	 *  original token stream but with the alterations given to this rewriter.
	 *  The interval refers to the indexes in the original token stream.
	 *  We do not alter the token stream in any way, so the indexes
	 *  and intervals are still consistent. Includes any operations done
	 *  to the first and last token in the interval. So, if you did an
	 *  insertBefore on the first token, you would get that insertion.
	 *  The same is true if you do an insertAfter the stop token.
 	 */
	public getText(interval: Interval| null):  java.lang.String | null;

	public getText(programName: java.lang.String| null, interval: Interval| null):  java.lang.String | null;


	/** Return the text from the original tokens altered per the
	 *  instructions given to this rewriter.
 	 */
	public getText(programNameOrInterval?: java.lang.String | Interval | null, interval?: Interval | null):  java.lang.String | null {
if (programNameOrInterval === undefined) {
		return this.getText(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, Interval.of(0,this.tokens.size()-1));
	}
 else if (programNameOrInterval instanceof java.lang.String && interval === undefined) {
const programName = programNameOrInterval as java.lang.String;
		return this.getText(programName, Interval.of(0,this.tokens.size()-1));
	}
 else if (programNameOrInterval instanceof Interval && interval === undefined) {
const interval = programNameOrInterval as Interval;
		return this.getText(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, interval);
	}
 else  {
let programName = programNameOrInterval as java.lang.String;
		 let  rewrites: java.util.List<TokenStreamRewriter.RewriteOperation> = this.programs.get(programName);
		 let  start: number = interval.a;
		 let  stop: number = interval.b;

		// ensure start/end are in range
		if ( stop>this.tokens.size()-1 ) {
 stop = this.tokens.size()-1;
}

		if ( start<0 ) {
 start = 0;
}


		if ( rewrites===null || rewrites.isEmpty() ) {
			return this.tokens.getText(interval); // no instructions to execute
		}
		 let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();

		// First, optimize instruction stream
		 let  indexToOp: java.util.Map<java.lang.Integer, TokenStreamRewriter.RewriteOperation> = this.reduceToSingleOperationPerIndex(rewrites);

		// Walk buffer, executing instructions and emitting tokens
		 let  i: number = start;
		while ( i <= stop && i < this.tokens.size() ) {
			 let  op: TokenStreamRewriter.RewriteOperation = indexToOp.get(i);
			indexToOp.remove(i); // remove so any left have index size-1
			 let  t: Token = this.tokens.get(i);
			if ( op===null ) {
				// no operation at that index, just dump token
				if ( t.getType()!==Token.EOF ) {
 buf.append(t.getText());
}

				i++; // move to next token
			}
			else {
				i = op.execute(buf); // execute operation and skip
			}
		}

		// include stuff after end if it's last index in buffer
		// So, if they did an insertAfter(lastValidIndex, "foo"), include
		// foo if end==lastValidIndex.
		if ( stop===this.tokens.size()-1 ) {
			// Scan any remaining operations after last token
			// should be included (they will be inserts).
			for (let op of indexToOp.values()) {
				if ( op.index >= this.tokens.size()-1 ) {
 buf.append(op.text);
}

			}
		}
		return buf.toString();
	}

}


	/** We need to combine operations and report invalid operations (like
	 *  overlapping replaces that are not completed nested). Inserts to
	 *  same index need to be combined etc...  Here are the cases:
	 *
	 *  I.i.u I.j.v								leave alone, nonoverlapping
	 *  I.i.u I.i.v								combine: Iivu
	 *
	 *  R.i-j.u R.x-y.v	| i-j in x-y			delete first R
	 *  R.i-j.u R.i-j.v							delete first R
	 *  R.i-j.u R.x-y.v	| x-y in i-j			ERROR
	 *  R.i-j.u R.x-y.v	| boundaries overlap	ERROR
	 *
	 *  Delete special case of replace (text==null):
	 *  D.i-j.u D.x-y.v	| boundaries overlap	combine to max(min)..max(right)
	 *
	 *  I.i.u R.x-y.v | i in (x+1)-y			delete I (since insert before
	 *											we're not deleting i)
	 *  I.i.u R.x-y.v | i not in (x+1)-y		leave alone, nonoverlapping
	 *  R.x-y.v I.i.u | i in x-y				ERROR
	 *  R.x-y.v I.x.u 							R.x-y.uv (combine, delete I)
	 *  R.x-y.v I.i.u | i not in x-y			leave alone, nonoverlapping
	 *
	 *  I.i.u = insert u before op @ index i
	 *  R.x-y.u = replace x-y indexed tokens with u
	 *
	 *  First we need to examine replaces. For any replace op:
	 *
	 * 		1. wipe out any insertions before op within that range.
	 *		2. Drop any replace op before that is contained completely within
	 *	 that range.
	 *		3. Throw exception upon boundary overlap with any previous replace.
	 *
	 *  Then we can deal with inserts:
	 *
	 * 		1. for any inserts to same index, combine even if not adjacent.
	 * 		2. for any prior replace with same left boundary, combine this
	 *	 insert with replace and delete this replace.
	 * 		3. throw exception if index in same range as previous replace
	 *
	 *  Don't actually delete; make op null in list. Easier to walk list.
	 *  Later we can throw as we add to index &rarr; op map.
	 *
	 *  Note that I.2 R.2-2 will wipe out I.2 even though, technically, the
	 *  inserted stuff would be before the replace range. But, if you
	 *  add tokens in front of a method body '{' and then delete the method
	 *  body, I think the stuff before the '{' you added should disappear too.
	 *
	 *  Return a map from token index to operation.
	 */
	protected reduceToSingleOperationPerIndex = (rewrites: java.util.List<TokenStreamRewriter.RewriteOperation>| null):  java.util.Map<java.lang.Integer, TokenStreamRewriter.RewriteOperation> | null => {
//		System.out.println("rewrites="+rewrites);

		// WALK REPLACES
		for ( let  i: number = 0; i < rewrites.size(); i++) {
			 let  op: TokenStreamRewriter.RewriteOperation = rewrites.get(i);
			if ( op===null ) {
 continue;
}

			if ( !(op instanceof ReplaceOp) ) {
 continue;
}

			 let  rop: TokenStreamRewriter.ReplaceOp = rewrites.get(i) as ReplaceOp;
			// Wipe prior inserts within range
			 let  inserts: java.util.List< TokenStreamRewriter.InsertBeforeOp> = this.getKindOfOps(rewrites, InsertBeforeOp.class, i);
			for (let iop of inserts) {
				if ( iop.index === rop.index ) {
					// E.g., insert before 2, delete 2..2; update replace
					// text to include insert before, kill insert
					rewrites.set(iop.instructionIndex, null);
					rop.text = iop.text.toString() + (rop.text!==null?rop.text.toString():S``);
				}
				else {
 if ( iop.index > rop.index && iop.index <= rop.lastIndex ) {
					// delete insert as it's a no-op.
					rewrites.set(iop.instructionIndex, null);
				}
}

			}
			// Drop any prior replaces contained within
			 let  prevReplaces: java.util.List< TokenStreamRewriter.ReplaceOp> = this.getKindOfOps(rewrites, ReplaceOp.class, i);
			for (let prevRop of prevReplaces) {
				if ( prevRop.index>=rop.index && prevRop.lastIndex <= rop.lastIndex ) {
					// delete replace as it's a no-op.
					rewrites.set(prevRop.instructionIndex, null);
					continue;
				}
				// throw exception unless disjoint or identical
				 let  disjoint: boolean =
					prevRop.lastIndex<rop.index || prevRop.index > rop.lastIndex;
				// Delete special case of replace (text==null):
				// D.i-j.u D.x-y.v	| boundaries overlap	combine to max(min)..max(right)
				if ( prevRop.text===null && rop.text===null && !disjoint ) {
					//System.out.println("overlapping deletes: "+prevRop+", "+rop);
					rewrites.set(prevRop.instructionIndex, null); // kill first delete
					rop.index = Math.min(prevRop.index, rop.index);
					rop.lastIndex = Math.max(prevRop.lastIndex, rop.lastIndex);
					java.lang.System.out.println(S`new rop `+rop);
				}
				else {
 if ( !disjoint ) {
					throw new  java.lang.IllegalArgumentException(S`replace op boundaries of `+rop+S` overlap with previous `+prevRop);
				}
}

			}
		}

		// WALK INSERTS
		for ( let  i: number = 0; i < rewrites.size(); i++) {
			 let  op: TokenStreamRewriter.RewriteOperation = rewrites.get(i);
			if ( op===null ) {
 continue;
}

			if ( !(op instanceof InsertBeforeOp) ) {
 continue;
}

			 let  iop: TokenStreamRewriter.InsertBeforeOp = rewrites.get(i) as InsertBeforeOp;
			// combine current insert with prior if any at same index
			 let  prevInserts: java.util.List< TokenStreamRewriter.InsertBeforeOp> = this.getKindOfOps(rewrites, InsertBeforeOp.class, i);
			for (let prevIop of prevInserts) {
				if ( prevIop.index===iop.index ) {
					if ( InsertAfterOp.class.isInstance(prevIop) ) {
						iop.text = this.catOpText(prevIop.text, iop.text);
						rewrites.set(prevIop.instructionIndex, null);
					}
					else {
 if ( InsertBeforeOp.class.isInstance(prevIop) ) { // combine objects
						// convert to strings...we're in process of toString'ing
						// whole token buffer so no lazy eval issue with any templates
						iop.text = this.catOpText(iop.text, prevIop.text);
						// delete redundant prior insert
						rewrites.set(prevIop.instructionIndex, null);
					}
}

				}
			}
			// look for replaces where iop.index is in range; error
			 let  prevReplaces: java.util.List< TokenStreamRewriter.ReplaceOp> = this.getKindOfOps(rewrites, ReplaceOp.class, i);
			for (let rop of prevReplaces) {
				if ( iop.index === rop.index ) {
					rop.text = this.catOpText(iop.text,rop.text);
					rewrites.set(i, null);	// delete current insert
					continue;
				}
				if ( iop.index >= rop.index && iop.index <= rop.lastIndex ) {
					throw new  java.lang.IllegalArgumentException(S`insert op `+iop+S` within boundaries of previous `+rop);
				}
			}
		}
		// System.out.println("rewrites after="+rewrites);
		 let  m: java.util.Map<java.lang.Integer, TokenStreamRewriter.RewriteOperation> = new  java.util.HashMap<java.lang.Integer, RewriteOperation>();
		for ( let  i: number = 0; i < rewrites.size(); i++) {
			 let  op: TokenStreamRewriter.RewriteOperation = rewrites.get(i);
			if ( op===null ) {
 continue;
}
 // ignore deleted ops
			if ( m.get(op.index)!==null ) {
				throw new  java.lang.Error(S`should only be one op per index`);
			}
			m.put(op.index, op);
		}
		//System.out.println("index to op: "+m);
		return m;
	}

	protected catOpText = (a: java.lang.Object| null, b: java.lang.Object| null):  java.lang.String | null => {
		 let  x: java.lang.String = S``;
		 let  y: java.lang.String = S``;
		if ( a!==null ) {
 x = a.toString();
}

		if ( b!==null ) {
 y = b.toString();
}

		return x+y;
	}

	/** Get all operations before an index of a particular kind */
	protected getKindOfOps =  <T extends TokenStreamRewriter.RewriteOperation>(rewrites: java.util.List< TokenStreamRewriter.RewriteOperation>| null, kind: java.lang.Class<T>| null, before: number):  java.util.List< T> | null => {
		 let  ops: java.util.List<T> = new  java.util.ArrayList<T>();
		for ( let  i: number=0; i<before && i<rewrites.size(); i++) {
			 let  op: TokenStreamRewriter.RewriteOperation = rewrites.get(i);
			if ( op===null ) {
 continue;
}
 // ignore deleted
			if ( kind.isInstance(op) ) {
				ops.add(kind.cast(op));
			}
		}
		return ops;
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TokenStreamRewriter {
	export type RewriteOperation = InstanceType<TokenStreamRewriter["RewriteOperation"]>;
	export type InsertBeforeOp = InstanceType<TokenStreamRewriter["InsertBeforeOp"]>;
	export type InsertAfterOp = InstanceType<TokenStreamRewriter["InsertAfterOp"]>;
	export type ReplaceOp = InstanceType<TokenStreamRewriter["ReplaceOp"]>;
}


