/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SystemFontMetrics } from "./SystemFontMetrics.js";
import { HashMap } from "antlr4ng";

export class PostScriptDocument {
    public static readonly DEFAULT_FONT = "CourierNew";

    public static readonly POSTSCRIPT_FONT_NAMES: Map<string, string>;

    protected boundingBoxWidth: number;
    protected boundingBoxHeight: number;

    protected fontMetrics: SystemFontMetrics;
    protected fontName: string;
    protected fontSize = 12;
    protected lineWidth = 0.3;
    protected boundingBox: string;

    protected ps = new StringBuilder();
    protected closed = false;

    public constructor();

    public constructor(fontName: string, fontSize: number);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                this(PostScriptDocument.DEFAULT_FONT, 12);

                break;
            }

            case 2: {
                const [fontName, fontSize] = args as [string, number];

                this.header();
                this.setFont(fontName, fontSize);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public getPS(): string {
        this.close();

        return this.header() + this.ps.toString();
    }

    public boundingBox(w: number, h: number): void {
        this.boundingBoxWidth = w;
        this.boundingBoxHeight = h;
        this.boundingBox = string.format(Intl.Locale.US, "%%%%BoundingBox: %d %d %d %d\n", 0, 0,
            this.boundingBoxWidth, this.boundingBoxHeight);
    }

    public close(): void {
        if (this.closed) {
            return;
        }

        //		ps.append("showpage\n");
        this.ps.append("%%Trailer\n");
        this.closed = true;
    }

    public setFont(fontName: string, fontSize: number): void {
        this.fontMetrics = new SystemFontMetrics(fontName);
        this.fontName = this.fontMetrics.getFont().getPSName();
        this.fontSize = fontSize;

        let psname = PostScriptDocument.POSTSCRIPT_FONT_NAMES.get(this.fontName);
        if (psname === null) {
            psname = this.fontName;
        }

        this.ps.append(string.format(Intl.Locale.US, "/%s findfont %d scalefont setfont\n", psname, fontSize));
    }

    public lineWidth(w: number): void {
        this.lineWidth = w;
        this.ps.append(w).append(" setlinewidth\n");
    }

    public move(x: number, y: number): void {
        this.ps.append(string.format(Intl.Locale.US, "%1.3f %1.3f moveto\n", x, y));
    }

    public lineto(x: number, y: number): void {
        this.ps.append(string.format(Intl.Locale.US, "%1.3f %1.3f lineto\n", x, y));
    }

    public line(x1: number, y1: number, x2: number, y2: number): void {
        this.move(x1, y1);
        this.lineto(x2, y2);
    }

    public rect(x: number, y: number, width: number, height: number): void {
        this.line(x, y, x, y + height);
        this.line(x, y + height, x + width, y + height);
        this.line(x + width, y + height, x + width, y);
        this.line(x + width, y, x, y);
    }

    /** Make red box */
    public highlight(x: number, y: number, width: number, height: number): void {
        this.ps.append(string.format(Intl.Locale.US, "%1.3f %1.3f %1.3f %1.3f highlight\n", x, y, width, height));
    }

    public stroke(): void {
        this.ps.append("stroke\n");
    }

    //	public void rarrow(double x, double y) {
    //		ps.append(String.format(Locale.US, "%1.3f %1.3f rarrow\n", x,y));
    //	}
    //
    //	public void darrow(double x, double y) {
    //		ps.append(String.format(Locale.US, "%1.3f %1.3f darrow\n", x,y));
    //	}

    public text(s: string, x: number, y: number): void {
        const buf = new StringBuilder();
        // escape \, (, ): \\,  \(,  \)
        for (const c of s.toCharArray()) {
            switch (c) {
                case "\\":
                case "(":
                case ")": {
                    buf.append("\\");
                    buf.append(c);
                    break;
                }

                default: {
                    buf.append(c);
                    break;
                }

            }
        }
        s = buf.toString();
        this.move(x, y);
        this.ps.append(string.format(Intl.Locale.US, "(%s) show\n", s));
        this.stroke();
    }

    // courier new: wid/hei 7.611979	10.0625
    /** All chars are 600 thousands of an 'em' wide if courier */
    public getWidth(c: number): number;
    public getWidth(s: string): number;
    public getWidth(...args: unknown[]): number {
        switch (args.length) {
            case 1: {
                const [c] = args as [number];

                return this.fontMetrics.getWidth(c, this.fontSize);

                break;
            }

            case 1: {
                const [s] = args as [string];

                return this.fontMetrics.getWidth(s, this.fontSize);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public getLineHeight(): number { return this.fontMetrics.getLineHeight(this.fontSize); }

    public getFontSize(): number { return this.fontSize; }

    /** Compute the header separately because we need to wait for the bounding box */
    protected header(): StringBuilder {
        const b = new StringBuilder();
        b.append("%!PS-Adobe-3.0 EPSF-3.0\n");
        b.append(this.boundingBox).append("\n");
        b.append("0.3 setlinewidth\n");
        b.append("%% x y w h highlight\n" +
            "/highlight {\n" +
            "        4 dict begin\n" +
            "        /h exch def\n" +
            "        /w exch def\n" +
            "        /y exch def\n" +
            "        /x exch def\n" +
            "        gsave\n" +
            "        newpath\n" +
            "        x y moveto\n" +
            "        0 h rlineto     % up to left corner\n" +
            "        w 0 rlineto     % to upper right corner\n" +
            "        0 h neg rlineto % to lower right corner\n" +
            "        w neg 0 rlineto % back home to lower left corner\n" +
            "        closepath\n" +
            "        .95 .83 .82 setrgbcolor\n" +
            "        fill\n" +
            "        grestore\n" +
            "        end\n" +
            "} def\n");

        return b;
    }
    static {
        PostScriptDocument.POSTSCRIPT_FONT_NAMES = new HashMap<string, string>();
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.SANS_SERIF + ".plain", "ArialMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.SANS_SERIF + ".bold", "Arial-BoldMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.SANS_SERIF + ".italic", "Arial-ItalicMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.SANS_SERIF + ".bolditalic", "Arial-BoldItalicMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.SERIF + ".plain", "TimesNewRomanPSMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.SERIF + ".bold", "TimesNewRomanPS-BoldMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.SERIF + ".italic", "TimesNewRomanPS-ItalicMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.SERIF + ".bolditalic", "TimesNewRomanPS-BoldItalicMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.MONOSPACED + ".plain", "CourierNewPSMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.MONOSPACED + ".bold", "CourierNewPS-BoldMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.MONOSPACED + ".italic", "CourierNewPS-ItalicMT");
        PostScriptDocument.POSTSCRIPT_FONT_NAMES.put(Font.MONOSPACED + ".bolditalic", "CourierNewPS-BoldItalicMT");
    }
}
