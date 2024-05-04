/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

/**
 * Font metrics.  The only way to generate accurate images
 *  in any format that contain text is to know the font metrics.
 *  Specifically, we need to know the width of every character and the
 *  maximum height (since we want all characters to fit within same line height).
 *  I used ttf2tfm to dump the font metrics from Mac TrueType fonts and
 *  then converted that to a Java class for use in a PostScript generator
 *  for trees. Commands:
 *
 * <pre>
 *	 $ ttf2tfm /Library/Fonts/Arial\ Black.ttf &gt; metrics
 * </pre>
 *
 * 	Then run metrics into python code after stripping header/footer:
 *
 * <pre>
 *	 #
 *	 # Process lines from ttf2tfm that look like this:
 *	 # Glyph  Code   Glyph Name                Width  llx    lly      urx    ury
 *	 # ------------------------------------------------------------------------
 *	 #     3  00020  space                       333  0,     0 --     0,     0
 *	 #
 *	 lines = open("metrics").read().split('\n')
 *	 print "public class FontName {"
 *	 print "    {"
 *	 maxh = 0;
 *	 for line in lines[4:]: # skip header 0..3
 *			 all = line.split(' ')
 *			 words = [x for x in all if len(x)&gt;0]
 *			 ascii = int(words[1], 16)
 *			 height = int(words[8])
 *			 if height&gt;maxh: maxh = height
 *			 if ascii&gt;=128: break
 *			 print "        widths[%d] = %s; // %s" % (ascii, words[3], words[2])
 *
 *	 print "        maxCharHeight = "+str(maxh)+";"
 *	 print "    }"
 *	 print "}"
 * </pre>
 *
 *	Units are 1000th of an 'em'.
 */
export abstract  class BasicFontMetrics {
    public static readonly  MAX_CHAR = "\u00FF";
    protected  maxCharHeight:  number;
    protected  widths = new  Int32Array(BasicFontMetrics.MAX_CHAR+1);

    public  getWidth(s: string, fontSize: number):  number;

    public  getWidth(c: number, fontSize: number):  number;
    public getWidth(...args: unknown[]):  number {
        switch (args.length) {
            case 2: {
                const [s, fontSize] = args as [string, number];

                let  w = 0;
                for (const c of s.toCharArray()) {
                    w += this.getWidth(c, fontSize);
                }

                return w;

                break;
            }

            case 2: {
                const [c, fontSize] = args as [number, number];

                if ( c > BasicFontMetrics.MAX_CHAR || this.widths[c]===0 ) {
                    return this.widths.m/1000.0;
                }

 // return width('m')
                return this.widths[c]/1000.0 * fontSize;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public  getLineHeight(fontSize: number):  number {
        return this.maxCharHeight / 1000.0 * fontSize;
    }
}
