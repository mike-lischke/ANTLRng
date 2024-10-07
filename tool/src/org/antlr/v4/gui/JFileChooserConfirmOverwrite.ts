/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 *
 * @author Sam Harwell
 */
export class JFileChooserConfirmOverwrite extends JFileChooser {

    public constructor() {
        setMultiSelectionEnabled(false);
    }

    public approveSelection(): void {
        const selectedFile = getSelectedFile();

        if (selectedFile.exists()) {
            const answer = JOptionPane.showConfirmDialog(this,
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
