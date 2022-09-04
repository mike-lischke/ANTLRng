/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable jsdoc/require-returns-check, @typescript-eslint/no-unused-vars */

import { NotImplementedError } from "../../../NotImplementedError";
import { Comparable } from "../../lang";
import { Locale } from "../../util";
import { ByteBuffer } from "../ByteBuffer";
import { CharBuffer } from "../CharBuffer";

/**
 * A simplified charset implementation without provider support. Instead there's a fixed set of supported encodings
 * provided by the Node.js Buffer API, which supports all Java standard charsets, except UTF-16LE.
 */
export class Charset implements Comparable<Charset> {
    public static readonly defaultCharset: Charset;

    // Supported encoding names + their aliases.
    private static readonly supportedEncodings = new Map<string, Set<string>>([
        ["ascii", new Set(["us-ascii", "iso646-us"])],
        ["latin1", new Set(["iso-8859-1", "iso-latin-1"])],
        ["utf-8", new Set(["utf8"])],
        ["utf16le", new Set(["utf-16le"])],
        ["utf16", new Set(["ucs2", "ucs-2"])],
        ["base64", new Set()],
        ["base64url", new Set()],
        ["binary", new Set()],
        ["hex", new Set()],
    ]);

    private alternatives: Set<string>;

    protected constructor(private canonicalName: string) {
        this.alternatives = Charset.supportedEncodings.get(canonicalName);
    }

    /**
     * Tells whether the named charset is supported.
     *
     * @param  charsetName
     *         The name of the requested charset; may be either
     *         a canonical name or an alias
     *
     * @returns True if, and only if, support for the named charset
     *          is available in the current Java virtual machine
     */
    public static isSupported(charsetName: string): boolean {
        if (Charset.supportedEncodings.has(charsetName)) {
            return true;
        }

        for (const [_, aliases] of Charset.supportedEncodings) {
            if (aliases.has(charsetName)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns a charset object for the named charset. If the charset object
     * for the named charset is not available or {@code charsetName} is not a
     * legal charset name, then {@code fallback} is returned.
     *
     * @param  charsetName
     *         The name of the requested charset; may be either
     *         a canonical name or an alias
     *
     * @param  fallback
     *         fallback charset in case the charset object for the named
     *         charset is not available or {@code charsetName} is not a legal
     *         charset name. May be {@code null}
     *
     * @returns  A charset object for the named charset, or {@code fallback}
     *          in case the charset object for the named charset is not
     *          available or {@code charsetName} is not a legal charset name
     */
    public static forName(charsetName: string, fallback?: Charset): Charset | undefined {
        let name = Charset.supportedEncodings.has(charsetName) ? charsetName : undefined;

        if (!name) {
            // Name not directly found. Check the aliases.
            for (const [key, value] of Charset.supportedEncodings) {
                if (value.has(charsetName)) {
                    name = key;
                    break;
                }
            }
        } else {
            name = charsetName;
        }

        if (!name) {
            return fallback;
        }

        return new Charset(name);
    }

    /**
     * Constructs a sorted map from canonical charset names to charset objects.
     *
     * <p> The map returned by this method will have one entry for each charset
     * for which support is available in the current Java virtual machine.  If
     * two or more supported charsets have the same canonical name then the
     * resulting map will contain just one of them; which one it will contain
     * is not specified. </p>
     *
     * <p> The invocation of this method, and the subsequent use of the
     * resulting map, may cause time-consuming disk or network I/O operations
     * to occur.  This method is provided for applications that need to
     * enumerate all of the available charsets, for example to allow user
     * charset selection.  This method is not used by the {@link #forName
     * forName} method, which instead employs an efficient incremental lookup
     * algorithm.
     *
     * <p> This method may return different results at different times if new
     * charset providers are dynamically made available to the current Java
     * virtual machine.  In the absence of such changes, the charsets returned
     * by this method are exactly those that can be retrieved via the {@link
     * #forName forName} method.  </p>
     *
     * @returns An immutable, case-insensitive map from canonical charset names
     *         to charset objects
     */
    public static availableCharsets(): Map<string, Charset> {
        throw new NotImplementedError();
    }

    /**
     * Returns this charset's canonical name.
     *
     * @returns  The canonical name of this charset
     */
    public name(): string {
        return this.canonicalName;
    }

    /**
     * Returns a set containing this charset's aliases.
     *
     * @returns  An immutable set of this charset's aliases
     */
    public aliases(): Set<string> {
        return this.alternatives;
    }

    /**
     * Returns this charset's human-readable name for the default locale.
     *
     * <p> The default implementation of this method simply returns this
     * charset's canonical name.  Concrete subclasses of this class may
     * override this method in order to provide a localized display name. </p>
     *
     * @param locale tbd
     *
     * @returns  The display name of this charset in the default locale
     */
    public displayName(locale?: Locale): string {
        throw new NotImplementedError();
    }

    /**
     * Tells whether or not this charset is registered in the <a
     * href="http://www.iana.org/assignments/character-sets">IANA Charset
     * Registry</a>.
     *
     * @returns  True if, and only if, this charset is known by its
     *          implementor to be registered with the IANA
     */
    public isRegistered(): boolean {
        return true;
    }

    /**
     * Tells whether or not this charset supports encoding.
     *
     * <p> Nearly all charsets support encoding.  The primary exceptions are
     * special-purpose <i>auto-detect</i> charsets whose decoders can determine
     * which of several possible encoding schemes is in use by examining the
     * input byte sequence.  Such charsets do not support encoding because
     * there is no way to determine which encoding should be used on output.
     * Implementations of such charsets should override this method to return
     * {@code false}. </p>
     *
     * @returns True if, and only if, this charset supports encoding
     */
    public canEncode(): boolean {
        return true;
    }

    /**
     * Convenience method that decodes bytes in this charset into Unicode
     * characters.
     *
     * <p> An invocation of this method upon a charset {@code cs} returns the
     * same result as the expression
     *
     * <pre>
     *     cs.newDecoder()
     *       .onMalformedInput(CodingErrorAction.REPLACE)
     *       .onUnmappableCharacter(CodingErrorAction.REPLACE)
     *       .decode(bb); </pre>
     *
     * except that it is potentially more efficient because it can cache
     * decoders between successive invocations.
     *
     * <p> This method always replaces malformed-input and unmappable-character
     * sequences with this charset's default replacement byte array.  In order
     * to detect such sequences, use the {@link
     * CharsetDecoder#decode(java.nio.ByteBuffer)} method directly.  </p>
     *
     * @param  bb  The byte buffer to be decoded
     *
     * @returns  A char buffer containing the decoded characters
     */
    public decode(bb: ByteBuffer): CharBuffer {
        throw new NotImplementedError();
    }

    /**
     * Convenience method that encodes Unicode characters into bytes in this
     * charset.
     *
     * <p> An invocation of this method upon a charset {@code cs} returns the
     * same result as the expression
     *
     * <pre>
     *     cs.newEncoder()
     *       .onMalformedInput(CodingErrorAction.REPLACE)
     *       .onUnmappableCharacter(CodingErrorAction.REPLACE)
     *       .encode(bb); </pre>
     *
     * except that it is potentially more efficient because it can cache
     * encoders between successive invocations.
     *
     * <p> This method always replaces malformed-input and unmappable-character
     * sequences with this charset's default replacement string.  In order to
     * detect such sequences, use the {@link
     * CharsetEncoder#encode(java.nio.CharBuffer)} method directly.  </p>
     *
     * @param  cb  The char buffer to be encoded
     *
     * @returns  A byte buffer containing the encoded characters
     */
    public encode(cb: CharBuffer): ByteBuffer;
    /**
     * Convenience method that encodes a string into bytes in this charset.
     *
     * <p> An invocation of this method upon a charset {@code cs} returns the
     * same result as the expression
     *
     * <pre>
     *     cs.encode(CharBuffer.wrap(s)); </pre>
     *
     * @param  str  The string to be encoded
     *
     * @returns  A byte buffer containing the encoded characters
     */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public encode(str: string): ByteBuffer;
    public encode(cbOrStr: CharBuffer | string): ByteBuffer {
        throw new NotImplementedError();
    }

    /**
     * Compares this charset to another.
     *
     * <p> Charsets are ordered by their canonical names, without regard to
     * case. </p>
     *
     * @param  that
     *         The charset to which this charset is to be compared
     *
     * @returns A negative integer, zero, or a positive integer as this charset
     *         is less than, equal to, or greater than the specified charset
     */
    public compareTo(that: Charset): number {
        throw new NotImplementedError();
    }

    /**
     * Computes a hash code for this charset.
     *
     * @returns  An integer hash code
     */
    public hashCode(): number {
        throw new NotImplementedError();
    }

    /**
     * Tells whether or not this object is equal to another.
     *
     * <p> Two charsets are equal if, and only if, they have the same canonical
     * names.  A charset is never equal to any other type of object.  </p>
     *
     * @param ob tbd
     *
     * @returns  True if, and only if, this charset is equal to the
     *          given object
     */
    public equals(ob: unknown): boolean {
        throw new NotImplementedError();
    }

    /**
     * Returns a string describing this charset.
     *
     * @returns  A string describing this charset
     */
    public toString(): string {
        throw new NotImplementedError();
    }

    /**
     * Tells whether or not this charset contains the given charset.
     *
     * <p> A charset <i>C</i> is said to <i>contain</i> a charset <i>D</i> if,
     * and only if, every character representable in <i>D</i> is also
     * representable in <i>C</i>.  If this relationship holds then it is
     * guaranteed that every string that can be encoded in <i>D</i> can also be
     * encoded in <i>C</i> without performing any replacements.
     *
     * <p> That <i>C</i> contains <i>D</i> does not imply that each character
     * representable in <i>C</i> by a particular byte sequence is represented
     * in <i>D</i> by the same byte sequence, although sometimes this is the
     * case.
     *
     * <p> Every charset contains itself.
     *
     * <p> This method computes an approximation of the containment relation:
     * If it returns {@code true} then the given charset is known to be
     * contained by this charset; if it returns {@code false}, however, then
     * it is not necessarily the case that the given charset is not contained
     * in this charset.
     *
     * @param   cs
     *          The given charset
     *
     * @returns  True if the given charset is contained in this charset
     */
    public contains(cs: Charset): boolean {
        return false;
    }

    /**
     * Constructs a new decoder for this charset.
     *
     * @returns  A new decoder for this charset
     */
    //public abstract newDecoder(): CharsetDecoder;

    /**
     * Constructs a new encoder for this charset.
     *
     * @returns  A new encoder for this charset
     *
     * @throws  UnsupportedOperationException
     *          If this charset does not support encoding
     */
    //public abstract newEncoder(): CharsetEncoder;

    static {
        // @ts-expect-error
        Charset.defaultCharset = new Charset("utf-8");
    }

}
