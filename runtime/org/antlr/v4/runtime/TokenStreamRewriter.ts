/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, S } from "jree";
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
    public static readonly DEFAULT_PROGRAM_NAME = S`default`;
    public static readonly PROGRAM_INIT_SIZE: number = 100;
    public static readonly MIN_TOKEN_INDEX: number = 0;

    // Define the rewrite operation hierarchy

    private RewriteOperation = (($outer) => {
        return class RewriteOperation extends JavaObject {
            /** What index into rewrites List are we? */
            public instructionIndex = 0;

            /** Token buffer index. */
            public index: number;
            public text: java.lang.String | null = null;

            public constructor(index: number);
            public constructor(index: number, text: java.lang.String | null);
            public constructor(...args: unknown[]) {
                super();
                switch (args.length) {
                    case 1: {
                        const [index] = args as [number];

                        this.index = index;

                        break;
                    }

                    case 2: {
                        const [index, text] = args as [number, java.lang.String];

                        this.index = index;
                        this.text = text;

                        break;
                    }

                    default: {
                        throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
                    }
                }
            }

            /**
             * Execute the rewrite operation by possibly adding to the buffer.
             *  Return the index of the next token to operate on.
             *
             * @param buf unused
             *
             * @returns the index of the next token to operate on.
             */
            public execute = (buf: java.lang.StringBuilder): number => {
                return this.index;
            };

            public override toString = (): java.lang.String => {
                let opName = this.getClass().getName();
                const $index = opName.indexOf("$");
                opName = opName.substring($index + 1, opName.length);

                return S`<${opName}@${$outer.tokens.get(this.index)}:"${this.text}">`;
            };
        };
    })(this);

    private InsertBeforeOp = (($outer) => {
        return class InsertBeforeOp extends $outer.RewriteOperation {
            public constructor(index: number, text: java.lang.String | null) {
                super(index, text);
            }

            public override execute = (buf: java.lang.StringBuilder): number => {
                buf.append(this.text);
                if ($outer.tokens.get(this.index)!.getType() !== Token.EOF) {
                    buf.append($outer.tokens.get(this.index)!.getText());
                }

                return this.index + 1;
            };
        };
    })(this);

    /**
     * Distinguish between insert after/before to do the "insert afters"
     *  first and then the "insert before" at same index. Implementation
     *  of "insert after" is "insert before index+1".
     */
    private InsertAfterOp = (($outer) => {
        return class InsertAfterOp extends $outer.InsertBeforeOp {
            public constructor(index: number, text: java.lang.String | null) {
                super(index + 1, text); // insert after is insert before index+1
            }
        };
    })(this);

    /**
     * I'm going to try replacing range from x..y with (y-x)+1 ReplaceOp
     *  instructions.
     */
    private ReplaceOp = (($outer) => {
        return class ReplaceOp extends $outer.RewriteOperation {
            public lastIndex: number;

            public constructor(from: number, to: number, text: java.lang.String | null) {
                super(from, text);
                this.lastIndex = to;
            }

            public override execute = (buf: java.lang.StringBuilder): number => {
                if (this.text !== null) {
                    buf.append(this.text);
                }

                return this.lastIndex + 1;
            };

            public override toString = (): java.lang.String => {
                if (this.text === null) {
                    return S`<DeleteOp@${$outer.tokens.get(this.index)}..${$outer.tokens.get(this.lastIndex)}>`;
                }

                const result = `<ReplaceOp@${$outer.tokens.get(this.index)}..${$outer.tokens.get(this.lastIndex)}:` +
                    `"${this.text}">`;

                return S`${result}`;
            };
        };
    })(this);

    /** Our source stream */
    protected readonly tokens: TokenStream;

    /**
     * You may have multiple, named streams of rewrite operations.
     *  I'm calling these things "programs."
     *  Maps String (name) &rarr; rewrite (List)
     */
    // eslint-disable-next-line max-len
    protected readonly programs: java.util.Map<java.lang.String, java.util.List<TokenStreamRewriter.RewriteOperation | null>>;

    /** Map String (program name) &rarr; Integer index */
    protected readonly lastRewriteTokenIndexes: java.util.Map<java.lang.String, number>;

    public constructor(tokens: TokenStream) {
        super();
        this.tokens = tokens;
        this.programs = new java.util.HashMap();
        this.programs.put(TokenStreamRewriter.DEFAULT_PROGRAM_NAME,
            new java.util.ArrayList<TokenStreamRewriter.RewriteOperation | null>(
                TokenStreamRewriter.PROGRAM_INIT_SIZE));
        this.lastRewriteTokenIndexes = new java.util.HashMap<java.lang.String, number>();
    }

    public readonly getTokenStream = (): TokenStream => {
        return this.tokens;
    };

    public rollback(instructionIndex: number): void;

    /**
     * Rollback the instruction stream for a program so that
     *  the indicated instruction (via instructionIndex) is no
     *  longer in the stream. UNTESTED!
     */
    public rollback(programName: java.lang.String | null, instructionIndex: number): void;
    public rollback(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const [instructionIndex] = args as [number];
                this.rollback(TokenStreamRewriter.DEFAULT_PROGRAM_NAME, instructionIndex);

                break;
            }

            case 2: {
                const [programName, instructionIndex] = args as [java.lang.String, number];
                const is = this.programs.get(programName);
                if (is !== null) {
                    this.programs.put(programName, is.subList(TokenStreamRewriter.MIN_TOKEN_INDEX, instructionIndex));
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public deleteProgram(): void;

    /** Reset the program so that no instructions exist */
    public deleteProgram(programName: java.lang.String | null): void;
    public deleteProgram(...args: unknown[]): void {
        switch (args.length) {
            case 0: {
                this.deleteProgram(TokenStreamRewriter.DEFAULT_PROGRAM_NAME);

                break;
            }

            case 1: {
                const [programName] = args as [java.lang.String];
                this.rollback(programName, TokenStreamRewriter.MIN_TOKEN_INDEX);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public insertAfter(t: Token, text: java.lang.String): void;
    public insertAfter(index: number, text: java.lang.String): void;
    public insertAfter(programName: java.lang.String, t: Token, text: java.lang.String): void;
    public insertAfter(programName: java.lang.String, index: number, text: java.lang.String): void;
    public insertAfter(...args: unknown[]): void {
        let programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME;
        let index: number;
        let text: java.lang.String;

        switch (args.length) {
            case 2: {
                let t;
                if (typeof args[0] !== "number") {
                    [t, text] = args as [Token, java.lang.String];
                    index = t.getTokenIndex();
                } else {
                    [index, text] = args as [number, java.lang.String];
                }
                break;
            }

            case 3: {
                if (typeof args[1] !== "number") {
                    let t;
                    [programName, t, text] = args as [java.lang.String, Token, java.lang.String];
                    index = t.getTokenIndex();
                } else {
                    [programName, index, text] = args as [java.lang.String, number, java.lang.String];
                }
                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }

        }

        // to insert after, just insert before next index (even if past end)
        const op = new this.InsertAfterOp(index, text);
        const rewrites = this.getProgram(programName);
        op.instructionIndex = rewrites.size();
        rewrites.add(op);
    }

    public insertBefore(t: Token, text: java.lang.String): void;
    public insertBefore(index: number, text: java.lang.String): void;
    public insertBefore(programName: java.lang.String, t: Token, text: java.lang.String): void;
    public insertBefore(programName: java.lang.String, index: number, text: java.lang.String): void;
    public insertBefore(...args: unknown[]): void {
        let programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME;
        let index: number;
        let text: java.lang.String;

        switch (args.length) {
            case 2: {
                if (typeof args[0] !== "number") {
                    let t;
                    [t, text] = args as [Token, java.lang.String];
                    index = t.getTokenIndex();
                } else {
                    [index, text] = args as [number, java.lang.String];
                }

                break;
            }

            case 3: {
                if (typeof args[1] !== "number") {
                    let t;
                    [programName, t, text] = args as [java.lang.String, Token, java.lang.String];
                    index = t.getTokenIndex();
                } else {
                    [programName, index, text] = args as [java.lang.String, number, java.lang.String];
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }

        const op = new this.InsertBeforeOp(index, text);
        const rewrites = this.getProgram(programName);
        op.instructionIndex = rewrites.size();
        rewrites.add(op);
    }

    public replace(index: number, text: java.lang.String | null): void;
    public replace(indexT: Token, text: java.lang.String | null): void;
    public replace(from: number, to: number, text: java.lang.String | null): void;
    public replace(from: Token, to: Token, text: java.lang.String | null): void;
    public replace(programName: java.lang.String, from: number, to: number, text: java.lang.String | null): void;
    public replace(programName: java.lang.String, from: Token, to: Token, text: java.lang.String | null): void;
    public replace(...args: unknown[]): void {
        let programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME;
        let from: number;
        let to: number;
        let text: java.lang.String;

        switch (args.length) {
            case 2: {
                if (typeof args[0] !== "number") {
                    let t;
                    [t, text] = args as [Token, java.lang.String];
                    to = t.getTokenIndex();
                    from = to;
                } else {
                    [to, text] = args as [number, java.lang.String];
                    from = to;
                }

                break;
            }

            case 3: {
                if (typeof args[0] !== "number") {
                    let t1;
                    let t2;
                    [t1, t2, text] = args as [Token, Token, java.lang.String];
                    from = t1.getTokenIndex();
                    to = t2.getTokenIndex();
                } else {
                    [from, to, text] = args as [number, number, java.lang.String];
                }

                break;
            }

            case 4: {
                if (typeof args[1] !== "number") {
                    let t1;
                    let t2;
                    [programName, t1, t2, text] = args as [java.lang.String, Token, Token, java.lang.String];
                    from = t1.getTokenIndex();
                    to = t2.getTokenIndex();
                } else {
                    [programName, from, to, text] = args as [java.lang.String, number, number, java.lang.String];
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }

        if (from > to || from < 0 || to < 0 || to >= this.tokens.size()) {
            const message = `replace: range invalid: ${from}..${to}(size=${this.tokens.size()})`;
            throw new java.lang.IllegalArgumentException(S`${message}`);
        }

        const op = new this.ReplaceOp(from, to, text);
        const rewrites = this.getProgram(programName);
        op.instructionIndex = rewrites.size();
        rewrites.add(op);
    }

    public delete(index: number): void;
    public delete(indexT: Token): void;
    public delete(from: number, to: number): void;
    public delete(from: Token, to: Token): void;
    public delete(programName: java.lang.String, from: number, to: number): void;
    public delete(programName: java.lang.String, from: Token, to: Token): void;
    public delete(...args: unknown[]): void {
        let programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME;
        let from: number;
        let to: number;

        switch (args.length) {
            case 1: {
                if (typeof args[0] !== "number") {
                    from = (args[0] as Token).getTokenIndex();
                    to = from;
                } else {
                    const [index] = args as [number];
                    from = index;
                    to = index;
                }
                break;
            }

            case 2: {
                if (typeof args[0] !== "number") {
                    const [fromT, toT] = args as [Token, Token];
                    from = fromT.getTokenIndex();
                    to = toT.getTokenIndex();
                } else {
                    [from, to] = args as [number, number];
                }

                break;
            }

            case 3: {
                if (typeof args[1] === "number") {
                    [programName, from, to] = args as [java.lang.String, number, number];
                } else {
                    let fromT;
                    let toT;
                    [programName, fromT, toT] = args as [java.lang.String, Token, Token];
                    from = fromT.getTokenIndex();
                    to = toT.getTokenIndex();
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }

        this.replace(programName, from, to, null);
    }

    public getLastRewriteTokenIndex(): number;
    public getLastRewriteTokenIndex(programName: java.lang.String): number;
    public getLastRewriteTokenIndex(...args: unknown[]): number {
        const name = args.length === 0 ? TokenStreamRewriter.DEFAULT_PROGRAM_NAME : args[0] as java.lang.String;
        const i = this.lastRewriteTokenIndexes.get(name);

        return i ?? -1;
    }

    /**
     * Return the text from the original tokens altered per the
     *  instructions given to this rewriter.
     */
    public getText(): java.lang.String;
    /**
     * Return the text from the original tokens altered per the
     *  instructions given to this rewriter in programName.
     */
    public getText(programName: java.lang.String): java.lang.String;
    /**
     * Return the text associated with the tokens in the interval from the
     *  original token stream but with the alterations given to this rewriter.
     *  The interval refers to the indexes in the original token stream.
     *  We do not alter the token stream in any way, so the indexes
     *  and intervals are still consistent. Includes any operations done
     *  to the first and last token in the interval. So, if you did an
     *  insertBefore on the first token, you would get that insertion.
     *  The same is true if you do an insertAfter the stop token.
     */
    public getText(interval: Interval): java.lang.String;
    public getText(programName: java.lang.String, interval: Interval): java.lang.String;
    public getText(...args: unknown[]): java.lang.String {
        let programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME;
        let interval: Interval;

        switch (args.length) {
            case 0: {
                interval = Interval.of(0, this.tokens.size() - 1);

                break;
            }

            case 1: {
                if (args[0] instanceof java.lang.String) {
                    [programName] = args as [java.lang.String];
                    interval = Interval.of(0, this.tokens.size() - 1);
                } else {
                    [interval] = args as [Interval];
                }

                break;
            }

            case 2: {
                [programName, interval] = args as [java.lang.String, Interval];

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }

        const rewrites = this.programs.get(programName);
        let start = interval.a;
        let stop = interval.b;

        // ensure start/end are in range
        if (stop > this.tokens.size() - 1) {
            stop = this.tokens.size() - 1;
        }

        if (start < 0) {
            start = 0;
        }

        if (rewrites === null || rewrites.isEmpty()) {
            return this.tokens.getText(interval); // no instructions to execute
        }
        const buf = new java.lang.StringBuilder();

        // First, optimize instruction stream
        const indexToOp = this.reduceToSingleOperationPerIndex(rewrites);

        // Walk buffer, executing instructions and emitting tokens
        let i = start;
        while (i <= stop && i < this.tokens.size()) {
            const op = indexToOp.get(i);
            indexToOp.remove(i); // remove so any left have index size-1
            const t = this.tokens.get(i)!;
            if (op === null) {
                // no operation at that index, just dump token
                if (t.getType() !== Token.EOF) {
                    buf.append(t.getText());
                }

                i++; // move to next token
            } else {
                i = op.execute(buf); // execute operation and skip
            }
        }

        // include stuff after end if it's last index in buffer
        // So, if they did an insertAfter(lastValidIndex, "foo"), include
        // foo if end==lastValidIndex.
        if (stop === this.tokens.size() - 1) {
            // Scan any remaining operations after last token
            // should be included (they will be inserts).
            for (const op of indexToOp.values()) {
                if (op.index >= this.tokens.size() - 1) {
                    buf.append(op.text);
                }

            }
        }

        return buf.toString();
    }

    protected setLastRewriteTokenIndex = (programName: java.lang.String, i: number): void => {
        this.lastRewriteTokenIndexes.put(programName, i);
    };

    protected getProgram = (name: java.lang.String): java.util.List<TokenStreamRewriter.RewriteOperation | null> => {
        let is = this.programs.get(name);
        if (is === null) {
            is = this.initializeProgram(name);
        }

        return is;
    };

    /**
     * We need to combine operations and report invalid operations (like
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
     *  I.i.u R.x-y.v | i not in (x+1)-y		leave alone, non overlapping
     *  R.x-y.v I.i.u | i in x-y				ERROR
     *  R.x-y.v I.x.u 							R.x-y.uv (combine, delete I)
     *  R.x-y.v I.i.u | i not in x-y			leave alone, non overlapping
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
     *
     * @param rewrites The list of rewrite operations to perform.
     *
     * @returns A map from token index to operation.
     */
    protected reduceToSingleOperationPerIndex = (
        // eslint-disable-next-line max-len
        rewrites: java.util.List<TokenStreamRewriter.RewriteOperation | null>): java.util.Map<number, TokenStreamRewriter.RewriteOperation> => {
        // WALK REPLACES
        for (let i = 0; i < rewrites.size(); i++) {
            const rop = rewrites.get(i);
            if (rop === null) {
                continue;
            }

            if (!(rop instanceof this.ReplaceOp)) {
                continue;
            }

            // Wipe prior inserts within range
            const inserts = this.getKindOfOps(rewrites, this.InsertBeforeOp, i);
            for (const iop of inserts) {
                if (iop.index === rop.index) {
                    // E.g., insert before 2, delete 2..2; update replace
                    // text to include insert before, kill insert
                    rewrites.set(iop.instructionIndex, null);
                    rop.text = S`${iop.text!}${(rop.text ?? "")}`;
                } else {
                    if (iop.index > rop.index && iop.index <= rop.lastIndex) {
                        // delete insert as it's a no-op.
                        rewrites.set(iop.instructionIndex, null);
                    }
                }

            }

            // Drop any prior replaces contained within
            const prevReplaces = this.getKindOfOps(rewrites, this.ReplaceOp, i);
            for (const prevRop of prevReplaces) {
                if (prevRop.index >= rop.index && prevRop.lastIndex <= rop.lastIndex) {
                    // delete replace as it's a no-op.
                    rewrites.set(prevRop.instructionIndex, null);
                    continue;
                }

                // throw exception unless disjoint or identical
                const disjoint = prevRop.lastIndex < rop.index || prevRop.index > rop.lastIndex;

                // Delete special case of replace (text==null):
                // D.i-j.u D.x-y.v	| boundaries overlap	combine to max(min)..max(right)
                if (prevRop.text === null && rop.text === null && !disjoint) {
                    rewrites.set(prevRop.instructionIndex, null); // kill first delete
                    rop.index = Math.min(prevRop.index, rop.index);
                    rop.lastIndex = Math.max(prevRop.lastIndex, rop.lastIndex);
                    java.lang.System.out.println(S`new rop ${rop}`);
                } else {
                    if (!disjoint) {
                        const message = `replace op boundaries of ${rop} overlap with previous ${prevRop}`;
                        throw new java.lang.IllegalArgumentException(S`${message}`);
                    }
                }

            }
        }

        // WALK INSERTS
        for (let i = 0; i < rewrites.size(); i++) {
            const iop = rewrites.get(i);
            if (iop === null) {
                continue;
            }

            if (!(iop instanceof this.InsertBeforeOp)) {
                continue;
            }

            // combine current insert with prior if any at same index
            const prevInserts = this.getKindOfOps(rewrites, this.InsertBeforeOp, i);
            for (const prevIop of prevInserts) {
                if (prevIop.index === iop.index) {
                    if (prevIop instanceof this.InsertAfterOp) {
                        iop.text = this.catOpText(prevIop.text, iop.text);
                        rewrites.set(prevIop.instructionIndex, null);
                    } else {
                        if (prevIop instanceof this.InsertBeforeOp) { // combine objects
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
            const prevReplaces = this.getKindOfOps(rewrites, this.ReplaceOp, i);
            for (const rop of prevReplaces) {
                if (iop.index === rop.index) {
                    rop.text = this.catOpText(iop.text, rop.text);
                    rewrites.set(i, null);	// delete current insert
                    continue;
                }

                if (iop.index >= rop.index && iop.index <= rop.lastIndex) {
                    throw new java.lang.IllegalArgumentException(
                        S`insert op ${iop} within boundaries of previous ${rop}`);
                }
            }
        }

        const m = new java.util.HashMap<number, TokenStreamRewriter.RewriteOperation>();
        for (let i = 0; i < rewrites.size(); i++) {
            const op = rewrites.get(i);
            if (op === null) {
                continue;
            }

            // ignore deleted ops
            if (m.get(op.index) !== null) {
                throw new java.lang.Error(S`should only be one op per index`);
            }
            m.put(op.index, op);
        }

        return m;
    };

    protected catOpText = (a: java.lang.String | null, b: java.lang.String | null): java.lang.String => {
        return S`${a ?? ""}${b ?? ""}`;
    };

    /**
     * Get all operations before an index of a particular kind
     *
     * @param rewrites The list of operations.
     * @param kind The operation kind to return.
     * @param before The index of the last operation to return.
     *
     * @returns A list of operations.
     */
    private getKindOfOps = <T extends TokenStreamRewriter.RewriteOperation>(
        rewrites: java.util.List<TokenStreamRewriter.RewriteOperation | null>,
        kind: new (...args: never[]) => T, before: number): java.util.List<T> => {
        const ops = new java.util.ArrayList<T>();
        for (let i = 0; i < before && i < rewrites.size(); i++) {
            const op = rewrites.get(i);
            if (op === null) {
                continue;
            }

            // ignore deleted
            if (op instanceof kind) {
                ops.add(op);
            }
        }

        return ops;
    };

    private initializeProgram = (
        name: java.lang.String): java.util.List<TokenStreamRewriter.RewriteOperation | null> => {
        const is =
            new java.util.ArrayList<TokenStreamRewriter.RewriteOperation | null>(TokenStreamRewriter.PROGRAM_INIT_SIZE);
        this.programs.put(name, is);

        return is;
    };
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TokenStreamRewriter {
    export type RewriteOperation = InstanceType<TokenStreamRewriter["RewriteOperation"]>;
    export type InsertBeforeOp = InstanceType<TokenStreamRewriter["InsertBeforeOp"]>;
    export type InsertAfterOp = InstanceType<TokenStreamRewriter["InsertAfterOp"]>;
    export type ReplaceOp = InstanceType<TokenStreamRewriter["ReplaceOp"]>;
}
