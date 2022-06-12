/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { stdErrorDescriptor, stdInDescriptor, stdOutDescriptor } from ".";

export class FileDescriptor {
    public static get err(): FileDescriptor {
        return stdErrorDescriptor;
    }

    public static get out(): FileDescriptor {
        return stdOutDescriptor;
    }

    public static get in(): FileDescriptor {
        return stdInDescriptor;
    }

    public sync(): void {
        // Do nothing here.
    }

    public valid(): boolean {
        return false;
    }
}
