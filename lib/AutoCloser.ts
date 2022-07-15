/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { AutoCloseable } from "./java/io/AutoCloseable";

export class AutoCloser {
    private list: AutoCloseable[] = [];

    public add(closeable: AutoCloseable): void {
        this.list.push(closeable);
    }

    public close(): void {
        this.list.forEach((entry) => {
            try {
                entry.close();
            } catch {
                // Ignore.
            }
        });
    }
}
