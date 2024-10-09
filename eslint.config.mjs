/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import eslint from "@eslint/js";
import tslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";

export default tslint.config(
    eslint.configs.recommended,
    ...tslint.configs.strictTypeChecked,
    ...tslint.configs.stylisticTypeChecked,
    {
        plugins: {
            "@stylistic": stylistic
        },
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                projectService: {
                    allowDefaultProject: ["*.js", "*.mjs", "*.ts"],
                },
                tsconfigRootDir: import.meta.dirname,
                project: [
                    "./tsconfig.json",
                    "./tests/tsconfig.json"
                ],
                allowDefaultProject: [
                    "./tests"
                ]
            },
        },
        ignores: ["src/generated/*"],
        rules: {
            "no-fallthrough": [
                "warn",
                {
                    "commentPattern": "\\[falls?-through\\]"
                }
            ],
            "max-len": [
                "error",
                {
                    "ignoreRegExpLiterals": false,
                    "ignoreStrings": false,
                    "code": 120
                }
            ],
            "@stylistic/padding-line-between-statements": [
                "error",
                {
                    "blankLine": "always",
                    "prev": "*",
                    "next": "return"
                }
            ],
            "@stylistic/quotes": [
                "error",
                "double",
                {
                    "avoidEscape": true,
                    "allowTemplateLiterals": true
                }
            ],
            "@stylistic/indent": [
                "error",
                4,
                {
                    "ignoreComments": true,
                    "SwitchCase": 1,
                    "MemberExpression": 1
                }
            ],
            "@stylistic/semi": [
                "error",
                "always"
            ],
            "@stylistic/no-multiple-empty-lines": ["error", { "max": 1 }],
            "@stylistic/no-multi-spaces": "error",
            "@stylistic/lines-around-comment": [
                "error",
                {
                    "afterBlockComment": false,
                    "afterLineComment": false,
                }
            ],
            "lines-between-class-members": "off", // Should be on, but handles overload signatures incorrectly.

            "@typescript-eslint/adjacent-overload-signatures": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unnecessary-type-parameters": "off",
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/member-delimiter-style": "off",
            "@typescript-eslint/member-ordering": [
                "error",
                {
                    // No ordering for getters and setters here, as that conflicts currently with the rule
                    // adjacent-overload-signatures.

                    "default": [
                        // Index signature

                        "signature",
                        // Fields

                        "public-static-field",
                        "protected-static-field",
                        "private-static-field",
                        "public-instance-field",
                        "protected-instance-field",
                        "private-instance-field",
                        "public-abstract-field",
                        "protected-abstract-field",
                        "public-field",
                        "protected-field",
                        "private-field",
                        "static-field",
                        "instance-field",
                        "abstract-field",
                        "decorated-field",
                        "field",
                        // Constructors

                        "public-constructor",
                        "protected-constructor",
                        "private-constructor",
                        "constructor",
                        // Methods

                        "public-static-method",
                        "protected-static-method",
                        "private-static-method",
                        "public-method",
                        "protected-method",
                        "private-method",
                        "public-abstract-method",
                        "protected-abstract-method"
                    ]
                }
            ],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    "args": "none",
                    "ignoreRestSiblings": true,
                    "varsIgnorePattern": "^_",
                    "argsIgnorePattern": "^_"
                }
            ],
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/restrict-plus-operands": "off", // TODO: re-enable this rule
            "@typescript-eslint/no-unnecessary-condition": ["error", { "allowConstantLoopConditions": true }],
            "@typescript-eslint/no-extraneous-class": "off",
            "@typescript-eslint/array-type": ["error", { "default": "array-simple" }],
            "@typescript-eslint/prefer-return-this-type": "off",
            "@typescript-eslint/no-invalid-void-type": "off",
        },
    },
);
