/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Trees } from "./Trees.js";
import { TreeTextProvider } from "./TreeTextProvider.js";
import { TreeLayoutAdaptor } from "./TreeLayoutAdaptor.js";
import { JFileChooserConfirmOverwrite } from "./JFileChooserConfirmOverwrite.js";
import { GraphicsSupport } from "./GraphicsSupport.js";
import { ParserRuleContext, Utils, ErrorNode, Tree } from "antlr4ng";



export  class TreeViewer extends JComponent {
	public static readonly  LIGHT_RED = new  Color(244, 213, 211);

	public static DefaultTreeTextProvider =  class DefaultTreeTextProvider implements TreeTextProvider {
		private readonly  ruleNames:  Array<string>;

		public  constructor(ruleNames: Array<string>) {
			this.ruleNames = ruleNames;
		}

		@Override
public  getText(node: Tree):  string {
			return string.valueOf(Trees.getNodeText(node, this.ruleNames));
		}
	};


	public static VariableExtentProvide =  class VariableExtentProvide implements NodeExtentProvider<Tree> {
		protected  viewer: TreeViewer;
		public  constructor(viewer: TreeViewer) {
			this.viewer = viewer;
		}
		@Override
public  getWidth(tree: Tree):  number {
			let  fontMetrics = this.viewer.getFontMetrics(this.viewer.font);
			let  s = this.viewer.getText(tree);
			let  w = fontMetrics.stringWidth(s) + this.viewer.nodeWidthPadding*2;
			return w;
		}

		@Override
public  getHeight(tree: Tree):  number {
			let  fontMetrics = this.viewer.getFontMetrics(this.viewer.font);
			let  h = fontMetrics.getHeight() + this.viewer.nodeHeightPadding*2;
			let  s = this.viewer.getText(tree);
			let  lines = s.split("\n");
			return h * lines.length;
		}
	};


	public static TreeNodeWrapper =  class TreeNodeWrapper extends DefaultMutableTreeNode {

		protected readonly  viewer:  TreeViewer;

		protected constructor(tree: Tree, viewer: TreeViewer) {
			super(tree);
			this.viewer = viewer;
		}

		@Override
public  toString():  string {
			return this.viewer.getText( this.getUserObject() as Tree);
		}
	};


	public static EmptyIcon =  class EmptyIcon implements Icon {

		@Override
public  getIconWidth():  number {
			return 0;
		}

		@Override
public  getIconHeight():  number {
			return 0;
		}

		@Override
public  paintIcon(c: Component, g: Graphics, x: number, y: number):  void {
			/* Do nothing. */
		}
	};


	// ----------------------------------------------------------------------


    private static readonly  DIALOG_WIDTH_PREFS_KEY          = "dialog_width";
    private static readonly  DIALOG_HEIGHT_PREFS_KEY         = "dialog_height";
    private static readonly  DIALOG_X_PREFS_KEY              = "dialog_x";
    private static readonly  DIALOG_Y_PREFS_KEY              = "dialog_y";
    private static readonly  DIALOG_DIVIDER_LOC_PREFS_KEY    = "dialog_divider_location";
    private static readonly  DIALOG_VIEWER_SCALE_PREFS_KEY   = "dialog_viewer_scale";

	protected  treeTextProvider:  TreeTextProvider;
	protected  treeLayout:  TreeLayout<Tree>;
	protected  highlightedNodes:  java.util.List<Tree>;

	protected  fontName = "Helvetica"; //Font.SANS_SERIF;
	protected  fontStyle = Font.PLAIN;
	protected  fontSize = 11;
	protected  font = new  Font(this.fontName, this.fontStyle, this.fontSize);

	protected  gapBetweenLevels = 17;
	protected  gapBetweenNodes = 7;
	protected  nodeWidthPadding = 2;  // added to left/right
	protected  nodeHeightPadding = 0; // added above/below
	protected  arcSize = 0;           // make an arc in node outline?

	protected  scale = 1.0;

	protected  boxColor = null;     // set to a color to make it draw background

	protected  highlightedBoxColor = Color.lightGray;
	protected  borderColor = null;
	protected  textColor = Color.black;

	// ---------------- PAINT -----------------------------------------------

	private  useCurvedEdges = false;

	public  constructor(ruleNames: Array<string>, tree: Tree) {
		this.setRuleNames(ruleNames);
		if ( tree!==null ) {
			this.setTree(tree);
		}
		this.setFont(this.font);
	}

	protected static  showInDialog(/* final */  viewer: TreeViewer):  JFrame {
		 let  dialog = new  JFrame();
		dialog.setTitle("Parse Tree Inspector");

         let  prefs = Preferences.userNodeForPackage(TreeViewer.class);

		// Make new content panes
		 let  mainPane = new  JPanel(new  BorderLayout(5,5));
		 let  contentPane = new  JPanel(new  BorderLayout(0,0));
		contentPane.setBackground(Color.white);

		// Wrap viewer in scroll pane
		let  scrollPane = new  JScrollPane(viewer);
		// Make the scrollpane (containing the viewer) the center component
		contentPane.add(scrollPane, BorderLayout.CENTER);

		let  wrapper = new  JPanel(new  FlowLayout());

		// Add button to bottom
		let  bottomPanel = new  JPanel(new  BorderLayout(0,0));
		contentPane.add(bottomPanel, BorderLayout.SOUTH);

		let  ok = new  JButton("OK");
		ok.addActionListener(
			new  class extends ActionListener {
				@Override
public  actionPerformed(e: ActionEvent):  void {
                    dialog.dispatchEvent(new  WindowEvent(dialog, WindowEvent.WINDOW_CLOSING));
				}
			}()
		);
		wrapper.add(ok);

		// Add an export-to-png button right of the "OK" button
		let  png = new  JButton("Export as PNG");
		png.addActionListener(
			new  class extends ActionListener {
				@Override
public  actionPerformed(e: ActionEvent):  void {
					TreeViewer.generatePNGFile(viewer, dialog);
				}
			}()
		);
		wrapper.add(png);

		// Add an export-to-png button right of the "OK" button
		let  svg = new  JButton("Export as SVG");
		svg.addActionListener(
			new  class extends ActionListener {
			@Override
public  actionPerformed(e: ActionEvent):  void {
				TreeViewer.generateSVGFile(viewer, dialog);
			}
		}()
		);
		wrapper.add(svg);

		bottomPanel.add(wrapper, BorderLayout.SOUTH);

		// Add scale slider
        let  lastKnownViewerScale = prefs.getDouble(TreeViewer.DIALOG_VIEWER_SCALE_PREFS_KEY, viewer.getScale());
        viewer.setScale(lastKnownViewerScale);

		let  sliderValue = Number( ((lastKnownViewerScale - 1.0) * 1000));
		 let  scaleSlider = new  JSlider(JSlider.HORIZONTAL, -999, 1000, sliderValue);

		scaleSlider.addChangeListener(
			new  class extends ChangeListener {
				@Override
public  stateChanged(e: ChangeEvent):  void {
					let  v = scaleSlider.getValue();
					viewer.setScale(v / 1000.0 + 1.0);
				}
			}()
		);
		bottomPanel.add(scaleSlider, BorderLayout.CENTER);

		// Add a JTree representing the parser tree of the input.
		let  treePanel = new  JPanel(new  BorderLayout(5, 5));

		// An "empty" icon that will be used for the JTree's nodes.
		let  empty = new  TreeViewer.EmptyIcon();

		UIManager.put("Tree.closedIcon", empty);
		UIManager.put("Tree.openIcon", empty);
		UIManager.put("Tree.leafIcon", empty);

		let  parseTreeRoot = viewer.getTree().getRoot();
		let  nodeRoot = new  TreeViewer.TreeNodeWrapper(parseTreeRoot, viewer);
		TreeViewer.fillTree(nodeRoot, parseTreeRoot, viewer);
		 let  tree = new  JTree(nodeRoot);
		tree.getSelectionModel().setSelectionMode(TreeSelectionModel.SINGLE_TREE_SELECTION);

		tree.addTreeSelectionListener(new  class extends TreeSelectionListener {
			@Override
public  valueChanged(e: TreeSelectionEvent):  void {

				let  selectedTree =  e.getSource() as JTree;
				let  path = selectedTree.getSelectionPath();
				if (path!==null) {
					let  treeNode =  path.getLastPathComponent() as TreeViewer.TreeNodeWrapper;

					// Set the clicked AST.
					viewer.setTree( treeNode.getUserObject() as Tree);
				}
			}
		}());

		treePanel.add(new  JScrollPane(tree));

		// Create the pane for both the JTree and the AST
		 let  splitPane = new  JSplitPane(JSplitPane.HORIZONTAL_SPLIT,
				treePanel, contentPane);

		mainPane.add(splitPane, BorderLayout.CENTER);

		dialog.setContentPane(mainPane);

		// make viz
        let  exitListener = new  class extends WindowAdapter {
	        @Override
public  windowClosing(e: WindowEvent):  void {
                prefs.putInt(TreeViewer.DIALOG_WIDTH_PREFS_KEY, Number( dialog.getSize().getWidth()));
                prefs.putInt(TreeViewer.DIALOG_HEIGHT_PREFS_KEY, Number( dialog.getSize().getHeight()));
                prefs.putDouble(TreeViewer.DIALOG_X_PREFS_KEY, dialog.getLocationOnScreen().getX());
                prefs.putDouble(TreeViewer.DIALOG_Y_PREFS_KEY, dialog.getLocationOnScreen().getY());
                prefs.putInt(TreeViewer.DIALOG_DIVIDER_LOC_PREFS_KEY, splitPane.getDividerLocation());
                prefs.putDouble(TreeViewer.DIALOG_VIEWER_SCALE_PREFS_KEY, viewer.getScale());

                dialog.setVisible(false);
                dialog.dispose();
            }
        }();
        dialog.addWindowListener(exitListener);
		dialog.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);

        let  width = prefs.getInt(TreeViewer.DIALOG_WIDTH_PREFS_KEY, 600);
        let  height = prefs.getInt(TreeViewer.DIALOG_HEIGHT_PREFS_KEY, 500);
		dialog.setPreferredSize(new  Dimension(width, height));
		dialog.pack();

		// After pack(): set the divider at 1/3 (200/600) of the frame.
        let  dividerLocation = prefs.getInt(TreeViewer.DIALOG_DIVIDER_LOC_PREFS_KEY, 200);
		splitPane.setDividerLocation(dividerLocation);

        if (prefs.getDouble(TreeViewer.DIALOG_X_PREFS_KEY, -1) !== -1) {
            dialog.setLocation(
                    Number(prefs.getDouble(TreeViewer.DIALOG_X_PREFS_KEY, 100)),
                    Number(prefs.getDouble(TreeViewer.DIALOG_Y_PREFS_KEY, 100))
            );
        }
        else {
            dialog.setLocationRelativeTo(null);
        }

		dialog.setVisible(true);
		return dialog;
	}

	private static  line(x1: string, y1: string, x2: string, y2: string,
		style: string):  string {
		return string
			.format("<line x1=\"%s\" y1=\"%s\" x2=\"%s\" y2=\"%s\" style=\"%s\" />\n",
				x1, y1, x2, y2, style);
	}

	private static  rect(x: string, y: string, width: string, height: string,
		style: string, extraAttributes: string):  string {
		return string
			.format("<rect x=\"%s\" y=\"%s\" width=\"%s\" height=\"%s\" style=\"%s\" %s/>\n",
				x, y, width, height, style, extraAttributes);
	}

	private static  text(x: string, y: string, style: string, text: string):  string {
		return string.format(
			"<text x=\"%s\" y=\"%s\" style=\"%s\">\n%s\n</text>\n", x, y,
			style, text);
	}

	private static  generatePNGFile(viewer: TreeViewer, dialog: JFrame):  void {
		let  bi = new  BufferedImage(viewer.getSize().width,
											 viewer.getSize().height,
											 BufferedImage.TYPE_INT_ARGB);
		let  g = bi.createGraphics();
		viewer.paint(g);
		g.dispose();

		try {
			let  fileChooser = TreeViewer.getFileChooser(".png", "PNG files");

			let  returnValue = fileChooser.showSaveDialog(dialog);
			if (returnValue === JFileChooser.APPROVE_OPTION) {
				let  pngFile = fileChooser.getSelectedFile();
				ImageIO.write(bi, "png", pngFile);

				try {
					// Try to open the parent folder using the OS' native file manager.
					Desktop.getDesktop().open(pngFile.getParentFile());
				} catch (ex) {
if (ex instanceof Exception) {
					// We could not launch the file manager: just show a popup that we
					// succeeded in saving the PNG file.
					JOptionPane.showMessageDialog(dialog, "Saved PNG to: " +
												  pngFile.getAbsolutePath());
					ex.printStackTrace();
				} else {
	throw ex;
	}
}
			}
		} catch (ex) {
if (ex instanceof Exception) {
			JOptionPane.showMessageDialog(dialog,
										  "Could not export to PNG: " + ex.getMessage(),
										  "Error",
										  JOptionPane.ERROR_MESSAGE);
			ex.printStackTrace();
		} else {
	throw ex;
	}
}
	}

	private static  getFileChooser(/* final */  fileEnding: string,
												/* final */  description: string):  JFileChooser {
		let  suggestedFile = TreeViewer.generateNonExistingFile(fileEnding);
		let  fileChooser = new  JFileChooserConfirmOverwrite();
		fileChooser.setCurrentDirectory(suggestedFile.getParentFile());
		fileChooser.setSelectedFile(suggestedFile);
		let  filter = new  class implements java.io.FileFilter {

			@Override
public  accept(pathname: File):  boolean {
				if (pathname.isFile()) {
					return pathname.getName().toLowerCase().endsWith(fileEnding);
				}

				return true;
			}

			@Override
public  getDescription():  string {
				return description+" (*"+fileEnding+")";
			}
		}();
		fileChooser.addChoosableFileFilter(filter);
		fileChooser.setFileFilter(filter);
		return fileChooser;
	}

	private static  generateSVGFile(viewer: TreeViewer, dialog: JFrame):  void {

		try {
			let  fileChooser = TreeViewer.getFileChooser(".svg", "SVG files");

			let  returnValue = fileChooser.showSaveDialog(dialog);
			if (returnValue === JFileChooser.APPROVE_OPTION) {
				let  svgFile = fileChooser.getSelectedFile();
				// save the new svg file here!
				let  writer = new  BufferedWriter(new  FileWriter(svgFile));
				// HACK: multiplying with 1.1 should be replaced wit an accurate number
				writer.write("<svg width=\"" + viewer.getSize().getWidth() * 1.1 + "\" height=\"" + viewer.getSize().getHeight() * 1.1 + "\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">");
				viewer.paintSVG(writer);
				writer.write("</svg>");
				writer.flush();
				writer.close();
				try {
					// Try to open the parent folder using the OS' native file manager.
					Desktop.getDesktop().open(svgFile.getParentFile());
				} catch (ex) {
if (ex instanceof Exception) {
					// We could not launch the file manager: just show a popup that we
					// succeeded in saving the PNG file.
					JOptionPane.showMessageDialog(dialog, "Saved SVG to: "
						+ svgFile.getAbsolutePath());
					ex.printStackTrace();
				} else {
	throw ex;
	}
}
			}
		} catch (ex) {
if (ex instanceof Exception) {
			JOptionPane.showMessageDialog(dialog,
				"Could not export to SVG: " + ex.getMessage(),
				"Error",
				JOptionPane.ERROR_MESSAGE);
			ex.printStackTrace();
		} else {
	throw ex;
	}
}
	}

	private static  generateNonExistingFile(extension: string):  File {

		 let  parent = ".";
		 let  name = "antlr4_parse_tree";

		let  file = new  File(parent, name + extension);

		let  counter = 1;

		// Keep looping until we create a File that does not yet exist.
		while (file.exists()) {
			file = new  File(parent, name + "_" + counter + extension);
			counter++;
		}

		return file;
	}

	private static  fillTree(node: TreeViewer.TreeNodeWrapper, tree: Tree, viewer: TreeViewer):  void {

		if (tree === null) {
			return;
		}

		for (let  i = 0; i < tree.getChildCount(); i++) {

			let  childTree = tree.getChild(i);
			let  childNode = new  TreeViewer.TreeNodeWrapper(childTree, viewer);

			node.add(childNode);

			TreeViewer.fillTree(childNode, childTree, viewer);
		}
	}

	public  getUseCurvedEdges():  boolean {
		return this.useCurvedEdges;
	}

	public  setUseCurvedEdges(useCurvedEdges: boolean):  void {
		this.useCurvedEdges = useCurvedEdges;
	}

	public  text(g: Graphics, s: string, x: number, y: number):  void {
//		System.out.println("drawing '"+s+"' @ "+x+","+y);
		s = Utils.escapeWhitespace(s, true);
		g.drawString(s, x, y);
	}

	@Override
public  paint(g: Graphics):  void {
		super.paint(g);

		if ( this.treeLayout===null ) {
			return;
		}

		let  g2 = g as Graphics2D;
		// anti-alias the lines
		g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
      						RenderingHints.VALUE_ANTIALIAS_ON);

		// Anti-alias the text
		g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,
                         	RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

//		AffineTransform at = g2.getTransform();
//        g2.scale(
//            (double) this.getWidth() / 400,
//            (double) this.getHeight() / 400);
//
//		g2.setTransform(at);

		this.paintEdges(g, this.getTree().getRoot());

		// paint the boxes
		for (let Tree of this.treeLayout.getNodeBounds().keySet()) {
			this.paintBox(g, Tree);
		}
	}


	public  open():  Future<JFrame> {
		 let  viewer = this;
		viewer.setScale(1.5);
		let  callable = new  class extends Callable<JFrame> {
			protected  result: JFrame;

			@Override
public  call():  JFrame {
				SwingUtilities.invokeAndWait(new  class extends Runnable {
					@Override
public  run():  void {
						$outer.result = TreeViewer.showInDialog(viewer);
					}
				}());

				return this.result;
			}
		}();

		let  executor = Executors.newSingleThreadExecutor();

		try {
			return executor.submit(callable);
		}
		finally {
			executor.shutdown();
		}
	}

	public  save(fileName: string):  void {
		let  dialog = new  JFrame();
		let  contentPane = dialog.getContentPane();
		( contentPane as JComponent).setBorder(BorderFactory.createEmptyBorder(
				10, 10, 10, 10));
		contentPane.add(this);
		contentPane.setBackground(Color.white);
		dialog.pack();
		dialog.setLocationRelativeTo(null);
		dialog.dispose();
		GraphicsSupport.saveImage(this, fileName);
	}

	public  getTreeTextProvider():  TreeTextProvider {
		return this.treeTextProvider;
	}

	public  setTreeTextProvider(treeTextProvider: TreeTextProvider):  void {
		this.treeTextProvider = treeTextProvider;
	}

	public  setFontSize(sz: number):  void {
		this.fontSize = sz;
		this.font = new  Font(this.fontName, this.fontStyle, this.fontSize);
	}

	public  setFontName(name: string):  void {
		this.fontName = name;
		this.font = new  Font(this.fontName, this.fontStyle, this.fontSize);
	}

	/** Slow for big lists of highlighted nodes */
	public  addHighlightedNodes(nodes: Collection<Tree>):  void {
		this.highlightedNodes = new  Array<Tree>();
		this.highlightedNodes.addAll(nodes);
	}

	public  removeHighlightedNodes(nodes: Collection<Tree>):  void {
		if ( this.highlightedNodes!==null ) {
			// only remove exact objects defined by ==, not equals()
			for (let t of nodes) {
				let  i = this.getHighlightedNodeIndex(t);
				if ( i>=0 ) {
 this.highlightedNodes.remove(i);
}

			}
		}
	}

	@Override
public  getFont():  Font {
		return this.font;
	}

	@Override
public  setFont(font: Font):  void {
		this.font = font;
	}

	public  getArcSize():  number {
		return this.arcSize;
	}

	public  setArcSize(arcSize: number):  void {
		this.arcSize = arcSize;
	}

	public  getBoxColor():  Color {
		return this.boxColor;
	}

	public  setBoxColor(boxColor: Color):  void {
		this.boxColor = boxColor;
	}

	public  getHighlightedBoxColor():  Color {
		return this.highlightedBoxColor;
	}

	public  setHighlightedBoxColor(highlightedBoxColor: Color):  void {
		this.highlightedBoxColor = highlightedBoxColor;
	}

	public  getBorderColor():  Color {
		return this.borderColor;
	}

	public  setBorderColor(borderColor: Color):  void {
		this.borderColor = borderColor;
	}

	public  getTextColor():  Color {
		return this.textColor;
	}

	public  setTextColor(textColor: Color):  void {
		this.textColor = textColor;
	}

	public  setTree(root: Tree):  void {
		if ( root!==null ) {
			let  useIdentity = true; // compare node identity
			this.treeLayout =
				new  TreeLayout<Tree>(this.getTreeLayoutAdaptor(root),
									 new  TreeViewer.VariableExtentProvide(this),
									 new  DefaultConfiguration<Tree>(this.gapBetweenLevels,
																	this.gapBetweenNodes),
									 useIdentity);
			// Let the UI display this new AST.
			this.updatePreferredSize();
		}
		else {
			this.treeLayout = null;
			repaint();
		}
	}

	/** Get an adaptor for root that indicates how to walk ANTLR trees.
	 *  Override to change the adapter from the default of {@link TreeLayoutAdaptor}  */
	public  getTreeLayoutAdaptor(root: Tree):  TreeForTreeLayout<Tree> {
		return new  TreeLayoutAdaptor(root);
	}

	public  getScale():  number {
		return this.scale;
	}

	public  setScale(scale: number):  void {
		if(scale <= 0) {
			scale = 1;
		}
		this.scale = scale;
		this.updatePreferredSize();
	}

	public  setRuleNames(ruleNames: Array<string>):  void {
		this.setTreeTextProvider(new  TreeViewer.DefaultTreeTextProvider(ruleNames));
	}

	protected  paintEdges(g: Graphics, parent: Tree):  void {
		if (!this.getTree().isLeaf(parent)) {
            let  stroke = new  BasicStroke(1.0, BasicStroke.CAP_ROUND,
                    BasicStroke.JOIN_ROUND);
            (g as Graphics2D).setStroke(stroke);

			let  parentBounds = this.getBoundsOfNode(parent);
			let  x1 = parentBounds.getCenterX();
			let  y1 = parentBounds.getMaxY();
			for (let child of this.getTree().getChildren(parent)) {
				let  childBounds = this.getBoundsOfNode(child);
				let  x2 = childBounds.getCenterX();
				let  y2 = childBounds.getMinY();
				if (this.getUseCurvedEdges()) {
					let  c = new  CubicCurve2D.Double();
					let  ctrlx1 = x1;
					let  ctrly1 = (y1+y2)/2;
					let  ctrlx2 = x2;
					let  ctrly2 = y1;
					c.setCurve(x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2);
					( g as Graphics2D).draw(c);
				}
				else {
					g.drawLine(Number( x1), Number( y1),
							   Number( x2), Number( y2));
				}
				this.paintEdges(g, child);
			}
		}
	}

	protected  paintBox(g: Graphics, tree: Tree):  void {
		let  box = this.getBoundsOfNode(tree);
		// draw the box in the background
		let  ruleFailedAndMatchedNothing = false;
		if ( tree instanceof ParserRuleContext ) {
			let  ctx =  tree as ParserRuleContext;
			ruleFailedAndMatchedNothing = ctx.exception !== null &&
										  ctx.stop !== null && ctx.stop.getTokenIndex() < ctx.start.getTokenIndex();
		}
		if ( this.isHighlighted(tree) || this.boxColor!==null ||
			 tree instanceof ErrorNode ||
			 ruleFailedAndMatchedNothing)
		{
			if ( this.isHighlighted(tree) ) {
 g.setColor(this.highlightedBoxColor);
}

			else {
 if ( tree instanceof ErrorNode || ruleFailedAndMatchedNothing ) {
 g.setColor(TreeViewer.LIGHT_RED);
}

			else {
 g.setColor(this.boxColor);
}

}

			g.fillRoundRect(Number( box.x), Number( box.y), Number( box.width) - 1,
							Number( box.height) - 1, this.arcSize, this.arcSize);
		}
		if ( this.borderColor!==null ) {
            g.setColor(this.borderColor);
            g.drawRoundRect(Number( box.x), Number( box.y), Number( box.width) - 1,
                    Number( box.height) - 1, this.arcSize, this.arcSize);
        }

		// draw the text on top of the box (possibly multiple lines)
		g.setColor(this.textColor);
		let  s = this.getText(tree);
		let  lines = s.split("\n");
		let  m = getFontMetrics(this.font);
		let  x = Number( box.x) + this.arcSize / 2 + this.nodeWidthPadding;
		let  y = Number( box.y) + m.getAscent() + m.getLeading() + 1 + this.nodeHeightPadding;
		for (let  i = 0; i < lines.length; i++) {
			this.text(g, lines[i], x, y);
			y += m.getHeight();
		}
	}

	protected  generateEdges(writer: Writer, parent: Tree):  void {
		if (!this.getTree().isLeaf(parent)) {
			let  b1 = this.getBoundsOfNode(parent);
			let  x1 = b1.getCenterX();
			let  y1 = b1.getCenterY();

			for (let child of this.getTree().getChildren(parent)) {
				let  childBounds = this.getBoundsOfNode(child);
				let  x2 = childBounds.getCenterX();
				let  y2 = childBounds.getMinY();
				writer.write(TreeViewer.line(""+x1, ""+y1, ""+x2, ""+y2,
					"stroke:black; stroke-width:1px;"));
				this.generateEdges(writer, child);
			}
		}
	}

	protected  generateBox(writer: Writer, parent: Tree):  void {

		// draw the box in the background
		let  box = this.getBoundsOfNode(parent);
		writer.write(TreeViewer.rect(""+box.x, ""+box.y, ""+box.width, ""+box.height,
			"fill:orange; stroke:rgb(0,0,0);", "rx=\"1\""));

		// draw the text on top of the box (possibly multiple lines)
		let  line = this.getText(parent).replace("<","&lt;").replace(">","&gt;");
		let  fontSize = 10;
		let  x = Number( box.x) + 2;
		let  y = Number( box.y) + fontSize - 1;
		let  style = string.format("font-family:sans-serif;font-size:%dpx;",
			fontSize);
		writer.write(this.text(""+x, ""+y, style, line));
	}

	@Override
protected  getComponentGraphics(g: Graphics):  Graphics {
		let  g2d=g as Graphics2D;
		g2d.scale(this.scale, this.scale);
		return super.getComponentGraphics(g2d);
	}

	// ---------------------------------------------------

	protected  getBoundsOfNode(node: Tree):  Rectangle2D.Double {
		return this.treeLayout.getNodeBounds().get(node);
	}

	protected  getText(tree: Tree):  string {
		let  s = this.treeTextProvider.getText(tree);
		s = Utils.escapeWhitespace(s, true);
		return s;
	}

	protected  isHighlighted(node: Tree):  boolean {
		return this.getHighlightedNodeIndex(node) >= 0;
	}

	protected  getHighlightedNodeIndex(node: Tree):  number {
		if ( this.highlightedNodes===null ) {
 return -1;
}

		for (let  i = 0; i < this.highlightedNodes.size(); i++) {
			let  t = this.highlightedNodes.get(i);
			if ( t === node ) {
 return i;
}

		}
		return -1;
	}

	protected  getTree():  TreeForTreeLayout<Tree> {
		return this.treeLayout.getTree();
	}

	private  updatePreferredSize():  void {
		setPreferredSize(this.getScaledTreeSize());
		javax.net.ssl.SSLSession.invalidate();
		if (java.io.File.getParent() !== null) {
			java.io.File.getParent().validate();
		}
		repaint();
	}

	private  paintSVG(writer: Writer):  void {

		this.generateEdges(writer, this.getTree().getRoot());

		for (let tree of this.treeLayout.getNodeBounds().keySet()) {
			this.generateBox(writer, tree);
		}
	}

	private  getScaledTreeSize():  Dimension {
		let  scaledTreeSize =
			this.treeLayout.getBounds().getBounds().getSize();
		scaledTreeSize = new  Dimension(Number((scaledTreeSize.width*this.scale)),
									   Number((scaledTreeSize.height*this.scale)));
		return scaledTreeSize;
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TreeViewer {
	export type DefaultTreeTextProvider = InstanceType<typeof TreeViewer.DefaultTreeTextProvider>;
	export type VariableExtentProvide = InstanceType<typeof TreeViewer.VariableExtentProvide>;
	export type TreeNodeWrapper = InstanceType<typeof TreeViewer.TreeNodeWrapper>;
	export type EmptyIcon = InstanceType<typeof TreeViewer.EmptyIcon>;
}


