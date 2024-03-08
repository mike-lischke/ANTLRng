/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { BasicFontMetrics } from "./BasicFontMetrics.js";



/**
 *
 * @author Sam Harwell
 */
export  class SystemFontMetrics extends BasicFontMetrics {
	protected readonly  font:  Font;

	public  constructor(fontName: string) {
		let  img = new  BufferedImage(40, 40, BufferedImage.TYPE_4BYTE_ABGR);
		let  graphics = GraphicsEnvironment.getLocalGraphicsEnvironment().createGraphics(img);
		let  fontRenderContext = graphics.getFontRenderContext();
		this.font = new  Font(fontName, Font.PLAIN, 1000);
		let  maxHeight = 0;
		for (let  i = 0; i < 255; i++) {
			let  layout = new  TextLayout(Character.toString(Number(i)), this.font, fontRenderContext);
			maxHeight = Math.max(maxHeight, layout.getBounds().getHeight());
			super.widths[i] = Number(layout.getAdvance());
		}

		super.maxCharHeight = Number(Math.round(maxHeight));
	}

	public  getFont():  Font {
		return this.font;
	}
}
