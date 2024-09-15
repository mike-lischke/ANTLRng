/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TokenTypeDecl } from "./TokenTypeDecl.js";
import { TokenListDecl } from "./TokenListDecl.js";
import { TokenDecl } from "./TokenDecl.js";
import { RuleContextListDecl } from "./RuleContextListDecl.js";
import { RuleContextDecl } from "./RuleContextDecl.js";
import { Decl } from "./Decl.js";
import { ContextGetterDecl } from "./ContextGetterDecl.js";
import { AttributeDecl } from "./AttributeDecl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";
import { DispatchMethod } from "../DispatchMethod.js";
import { ListenerDispatchMethod } from "../ListenerDispatchMethod.js";
import { ModelElement } from "../ModelElement.js";
import { OutputModelObject } from "../OutputModelObject.js";
import { VisitorDispatchMethod } from "../VisitorDispatchMethod.js";
import { Rule } from "../../../tool/Rule.js";
import { OrderedHashSet } from "antlr4ng";

/**
 * This object models the structure holding all of the parameters,
 *  return values, local variables, and labels associated with a rule.
 */
export class StructDecl extends Decl {
    public derivedFromName: string; // rule name or label name
    public provideCopyFrom: boolean;
    @ModelElement
    public attrs = new OrderedHashSet<Decl>();
    @ModelElement
    public getters = new OrderedHashSet<Decl>();
    @ModelElement
    public ctorAttrs: Collection<AttributeDecl>;
    @ModelElement
    public dispatchMethods: DispatchMethod[];
    @ModelElement
    public interfaces: OutputModelObject[];
    @ModelElement
    public extensionMembers: OutputModelObject[];
    // Used to generate method signatures in Go target interfaces
    @ModelElement
    public signatures = new OrderedHashSet<Decl>();

    // Track these separately; Go target needs to generate getters/setters
    // Do not make them templates; we only need the Decl object not the ST
    // built from it. Avoids adding args to StructDecl template
    public tokenDecls = new OrderedHashSet<Decl>();
    public tokenTypeDecls = new OrderedHashSet<Decl>();
    public tokenListDecls = new OrderedHashSet<Decl>();
    public ruleContextDecls = new OrderedHashSet<Decl>();
    public ruleContextListDecls = new OrderedHashSet<Decl>();
    public attributeDecls = new OrderedHashSet<Decl>();

    public constructor(factory: OutputModelFactory, r: Rule);

    protected constructor(factory: OutputModelFactory, r: Rule, name: string);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 2: {
                const [factory, r] = args as [OutputModelFactory, Rule];

                this(factory, r, null);

                break;
            }

            case 3: {
                const [factory, r, name] = args as [OutputModelFactory, Rule, string];

                super(factory, name === null ? factory.getGenerator().getTarget().getRuleFunctionContextStructName(r) : name);
                this.addDispatchMethods(r);
                this.derivedFromName = r.name;
                this.provideCopyFrom = r.hasAltSpecificContexts();

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public addDispatchMethods(r: Rule): void {
        this.dispatchMethods = new Array<DispatchMethod>();
        if (!r.hasAltSpecificContexts()) {
            // no enter/exit for this ruleContext if rule has labels
            if ($outer.factory.getGrammar().tool.gen_listener) {
                this.dispatchMethods.add(new ListenerDispatchMethod($outer.factory, true));
                this.dispatchMethods.add(new ListenerDispatchMethod($outer.factory, false));
            }
            if ($outer.factory.getGrammar().tool.gen_visitor) {
                this.dispatchMethods.add(new VisitorDispatchMethod($outer.factory));
            }
        }
    }

    public addDecl(d: Decl): void;

    public addDecl(a: java.security.KeyStore.Entry.Attribute): void;
    public addDecl(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const [d] = args as [Decl];

                d.ctx = this;

                if (d instanceof ContextGetterDecl) {
                    this.getters.add(d);
                    this.signatures.add((d).getSignatureDecl());
                } else {
                    this.attrs.add(d);
                }
                // add to specific "lists"
                if (d instanceof TokenTypeDecl) {
                    this.tokenTypeDecls.add(d);
                }
                else {
                    if (d instanceof TokenListDecl) {
                        this.tokenListDecls.add(d);
                    }
                    else {
                        if (d instanceof TokenDecl) {
                            this.tokenDecls.add(d);
                        }
                        else {
                            if (d instanceof RuleContextListDecl) {
                                this.ruleContextListDecls.add(d);
                            }
                            else {
                                if (d instanceof RuleContextDecl) {
                                    this.ruleContextDecls.add(d);
                                }
                                else {
                                    if (d instanceof AttributeDecl) {
                                        this.attributeDecls.add(d);
                                    }
                                }

                            }

                        }

                    }

                }

                break;
            }

            case 1: {
                const [a] = args as [java.security.KeyStore.Entry.Attribute];

                this.addDecl(new AttributeDecl($outer.factory, a));

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public addDecls(attrList: Collection<java.security.KeyStore.Entry.Attribute>): void {
        for (const a of attrList) {
            this.addDecl(a);
        }

    }

    public implementInterface(value: OutputModelObject): void {
        if (this.interfaces === null) {
            this.interfaces = new Array<OutputModelObject>();
        }

        this.interfaces.add(value);
    }

    public addExtensionMember(member: OutputModelObject): void {
        if (this.extensionMembers === null) {
            this.extensionMembers = new Array<OutputModelObject>();
        }

        this.extensionMembers.add(member);
    }

    public isEmpty(): boolean { return this.attrs.isEmpty(); }
}
