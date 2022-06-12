/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { FileDescriptorImpl } from "./FileDescriptorImpl";

export * from "./FileDescriptor";
export * from "./File";
export * from "./Console";
export * from "./PrintStream";
export * from "./IOException";
export * from "./FileNotFoundException";
export * from "./OutputStream";
export * from "./FileOutputStream";
export * from "./BufferedOutputStream";

// Have to create these here, to avoid circular imports.
export const stdErrorDescriptor = FileDescriptorImpl.fromStream(process.stderr);
export const stdOutDescriptor = FileDescriptorImpl.fromStream(process.stdout);
export const stdInDescriptor = FileDescriptorImpl.fromStream(process.stdin);
