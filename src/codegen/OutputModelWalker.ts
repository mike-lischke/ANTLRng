/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ST, STGroup, type IST } from "stringtemplate4ts";

import { Tool } from "../Tool.js";
import { ErrorType } from "../tool/ErrorType.js";
import { OutputModelObject } from "./model/OutputModelObject.js";

/**
 * Convert an output model tree to template hierarchy by walking
 *  the output model. Each output model object has a corresponding template
 *  of the same name.  An output model object can have nested objects.
 *  We identify those nested objects by the list of arguments in the template
 *  definition. For example, here is the definition of the parser template:
 *
 *  Parser(parser, scopes, funcs) ::= &lt;&lt;...&gt;&gt;
 *
 *  The first template argument is always the output model object from which
 *  this walker will create the template. Any other arguments identify
 *  the field names within the output model object of nested model objects.
 *  So, in this case, template Parser is saying that output model object
 *  Parser has two fields the walker should chase called a scopes and funcs.
 *
 *  This simple mechanism means we don't have to include code in every
 *  output model object that says how to create the corresponding template.
 */
export class OutputModelWalker {
    protected tool: Tool;
    protected templates: STGroup;

    public constructor(tool: Tool,
        templates: STGroup) {
        this.tool = tool;
        this.templates = templates;
    }

    public walk(omo: OutputModelObject, header: boolean): IST {
        // CREATE TEMPLATE FOR THIS OUTPUT OBJECT
        let templateName = omo.constructor.name;
        if (header) {
            templateName += "Header";
        }

        const st = this.templates.getInstanceOf(templateName);
        if (st === null) {
            this.tool.errMgr.toolError(ErrorType.CODE_GEN_TEMPLATES_INCOMPLETE, templateName);

            return new ST("[" + templateName + " invalid]");
        }

        /*
                if (!st.impl?.formalArguments) {
                    this.tool.errMgr.toolError(ErrorType.CODE_TEMPLATE_ARG_ISSUE, templateName, "<none>");
                    return st;
                }

                let formalArgs = st.impl.formalArguments;

                // PASS IN OUTPUT MODEL OBJECT TO TEMPLATE AS FIRST ARG
                let [modelArgName] = [...formalArgs.keys()];
                st.add(modelArgName, omo);

                // COMPUTE STs FOR EACH NESTED MODEL OBJECT MARKED WITH  AND MAKE ST ATTRIBUTE
                let usedFieldNames = new Set<string>();
                let fields = Object.getOwnPropertyNames(omo.constructor.prototype);
                for (let fi of fields) {
                    let annotation = fi.getAnnotation(ModelElement.class);
                    if (annotation === null) {
                        continue;
                    }

                    let fieldName = fi.getName();

                    if (!usedFieldNames.add(fieldName)) {
                        this.tool.errMgr.toolError(ErrorType.INTERNAL_ERROR, "Model object " + omo.getClass()
                        .getSimpleName() + " has multiple fields named '" + fieldName + "'");
                        continue;
                    }

                    // Just don't set  fields w/o formal arg in target ST
                    if (formalArgs.get(fieldName) === null) {
                        continue;
                    }

                    try {
                        let o = fi.get(omo);
                        if (o instanceof OutputModelObject) {  // SINGLE MODEL OBJECT?
                            let nestedOmo = o as OutputModelObject;
                            let nestedST = this.walk(nestedOmo, header);
                            st.add(fieldName, nestedST);
                        }
                        else {
                            if (o instanceof Collection || o instanceof OutputModelObject[]) {
                                // LIST OF MODEL OBJECTS?
                                if (o instanceof OutputModelObject[]) {
                                    o = Arrays.asList(o as OutputModelObject[]);
                                }
                                let nestedOmos = o as Array<unknown>;
                                for (let nestedOmo of nestedOmos) {
                                    if (nestedOmo === null) {
                                        continue;
                                    }

                                    let nestedST = this.walk(nestedOmo as OutputModelObject, header);
                                    st.add(fieldName, nestedST);
                                }
                            }
                            else {
                                if (o instanceof Map) {
                                    let nestedOmoMap = o as Map<unknown, unknown>;
                                    let m = new LinkedHashMap<Object, ST>();
                                    for (let entry of nestedOmoMap.entrySet()) {
                                        let nestedST = this.walk(entry.getValue() as OutputModelObject, header);
                                        m.put(entry.getKey(), nestedST);
                                    }
                                    st.add(fieldName, m);
                                }
                                else {
                                    if (o !== null) {
                                    }
                                }

                            }

                        }

                    } catch (iae) {
                        if (iae instanceof IllegalAccessException) {
                            this.tool.errMgr.toolError(ErrorType.CODE_TEMPLATE_ARG_ISSUE, templateName, fieldName);
                        } else {
                            throw iae;
                        }
                    }
                }*/

        return st;
    }

}
