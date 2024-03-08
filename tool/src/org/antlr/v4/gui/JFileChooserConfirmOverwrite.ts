/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





/**
 *
 * @author Sam Harwell
 */
export  class JFileChooserConfirmOverwrite extends JFileChooser {

	public  constructor() {
		setMultiSelectionEnabled(false);
	}

	@Override
public  approveSelection():  void {
		let  selectedFile = getSelectedFile();

		if (selectedFile.exists()) {
			let  answer = JOptionPane.showConfirmDialog(this,
													   "Overwrite existing file?",
													   "Overwrite?",
													   JOptionPane.YES_NO_OPTION);
			if (answer !== JOptionPane.YES_OPTION) {
				// do not call super.approveSelection
				return;
			}
		}

		super.approveSelection();
	}

}
