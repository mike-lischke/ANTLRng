/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class GraphicsSupport {
    /**
     [The "BSD license"]
     Copyright (c) 2011 Cay Horstmann
     All rights reserved.

     Redistribution and use in source and binary forms, with or without
     modification, are permitted provided that the following conditions
     are met:

     1. Redistributions of source code must retain the above copyright
     notice, this list of conditions and the following disclaimer.
     2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.
     3. The name of the author may not be used to endorse or promote products
     derived from this software without specific prior written permission.

     THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
     IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
     OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
     IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
     INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
     NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
     DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
     THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */
    public static saveImage(/* final */  comp: JComponent, fileName: string): void {
        if (fileName.endsWith(".ps") || fileName.endsWith(".eps")) {
            const flavor = DocFlavor.SERVICE_FORMATTED.PRINTABLE;
            const mimeType = "application/postscript";
            const factories =
                StreamPrintServiceFactory.lookupStreamPrintServiceFactories(flavor, mimeType);
            System.out.println(Arrays.toString(factories));
            if (factories.length > 0) {
                const out = new FileOutputStream(fileName);
                const service = factories[0].getPrintService(out);
                const doc = new SimpleDoc(new class extends Printable {

                    public print(g: Graphics, pf: PageFormat, page: number): number {
                        if (page >= 1) {
                            return Printable.NO_SUCH_PAGE;
                        }

                        else {
                            const g2 = g as Graphics2D;
                            g2.translate((pf.getWidth() - pf.getImageableWidth()) / 2,
                                (pf.getHeight() - pf.getImageableHeight()) / 2);
                            if (comp.getWidth() > pf.getImageableWidth() ||
                                comp.getHeight() > pf.getImageableHeight()) {
                                const sf1 = pf.getImageableWidth() / (comp.getWidth() + 1);
                                const sf2 = pf.getImageableHeight() / (comp.getHeight() + 1);
                                const s = Math.min(sf1, sf2);
                                g2.scale(s, s);
                            }

                            comp.paint(g);

                            return Printable.PAGE_EXISTS;
                        }
                    }
                }(), flavor, null);
                const job = service.createPrintJob();
                const attributes = new HashPrintRequestAttributeSet();
                job.print(doc, attributes);
                out.close();
            }
        }
        else {
            // parrt: works with [image/jpeg, image/png, image/x-png, image/vnd.wap.wbmp, image/bmp, image/gif]
            const rect = comp.getBounds();
            const image = new BufferedImage(rect.width, rect.height,
                BufferedImage.TYPE_INT_RGB);
            const g = image.getGraphics() as Graphics2D;
            g.setColor(Color.WHITE);
            g.fill(rect);
            //			g.setColor(Color.BLACK);
            comp.paint(g);
            const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
            const result = ImageIO.write(image, extension, new File(fileName));
            if (!result) {
                System.err.println("Now imager for " + extension);
            }
            g.dispose();
        }
    }
}
