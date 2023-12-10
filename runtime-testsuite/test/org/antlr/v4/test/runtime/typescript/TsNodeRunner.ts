/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";
import { RuntimeTestUtils } from "../RuntimeTestUtils";
import { RuntimeRunner } from "../RuntimeRunner";
import { RunOptions } from "../RunOptions";
import { FileUtils } from "../FileUtils";
import { CompiledState } from "../states/CompiledState";
import { GeneratedState } from "../states/GeneratedState";

export class TsNodeRunner extends RuntimeRunner {

    /* TypeScript runtime is the same as JavaScript runtime */
    private static readonly NORMALIZED_JAVASCRIPT_RUNTIME_PATH = this.getRuntimePath("JavaScript").replace("\\", "/");
    private static readonly NPM_EXEC = "npm" + (RuntimeTestUtils.isWindows() ? ".cmd" : "");

    public override getLanguage(): string {
        return "TypeScript";
    }

    public override getExtension(): string {
        return "ts";
    }

    public override getBaseListenerSuffix(): string | null { return null; }

    public override getBaseVisitorSuffix(): string | null { return null; }

    public override getRuntimeToolName(): java.lang.String {
        return "npx" + (RuntimeTestUtils.isWindows() ? ".cmd" : "");
    }

    protected override initRuntime(runOptions: RunOptions): void {
        this.npmInstallTsNodeAndWebpack();
        this.npmLinkRuntime();
    }

    protected override getExecFileName(): java.lang.String { return this.getTestFileName() + ".ts"; }

    protected override getExtraRunArgs(): java.lang.String[] { return ["tsx"]; }

    protected override compile(runOptions: RunOptions, generatedState: GeneratedState): CompiledState {

        try {
            FileUtils.writeFile(this.getTempDirPath(), "package.json",
                RuntimeTestUtils.getTextFromResource("org/antlr/v4/test/runtime/helpers/package_ts.json"));

            FileUtils.writeFile(this.getTempDirPath(), "tsconfig.json",
                RuntimeTestUtils.getTextFromResource("org/antlr/v4/test/runtime/helpers/tsconfig.json"));

            this.npmInstall();

            this.npmLinkAntlr4();

            return new CompiledState(generatedState, null);

        } catch (e) {
            if (e instanceof java.lang.Exception) {
                return new CompiledState(generatedState, e);
            } else {
                throw e;
            }
        }

    }

    private npmInstallTsNodeAndWebpack(): void {
        //
    }

    private npmLinkRuntime(): void {
        //
    }

    private npmInstall(): void {
        java.util.concurrent.Flow.Processor.run([TsNodeRunner.NPM_EXEC, "--silent", "install"], this.getTempDirPath());
    }

    private npmLinkAntlr4(): void {
        java.util.concurrent.Flow.Processor.run([TsNodeRunner.NPM_EXEC, "--silent", "link", "antlr4"],
            this.getTempDirPath());
    }

}
