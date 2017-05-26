import { assert, assertEqual, assertFalse, assertTrue, assertThrows } from "../TKUnit";
import { DOMNode } from "tns-core-modules/debugger/dom-node";
import { Button } from "tns-core-modules/ui/button";

function assertAttribute(domNode: DOMNode, name: string, value: any) {
    const propIdx = domNode.attributes.indexOf(name);
    assert(propIdx >= 0, `Attribute ${name} not found`);
    assertEqual(domNode.attributes[propIdx + 1], value);
}

export function test_custom_attribute_is_reported_in_dom_node() {
    const btn = new Button();
    btn["test_prop"] = "test_value";
    btn.ensureDomNode();
    const domNode = btn.domNode;
    assertAttribute(domNode, "test_prop", "test_value");
}

export function test_custom__falsy_attribute_is_reported_in_dom_node() {
    const btn = new Button();
    btn["test_prop_null"] = null;
    btn["test_prop_0"] = 0;
    btn["test_prop_undefined"] = undefined;
    btn["test_prop_empty_string"] = "";

    btn.ensureDomNode();
    const domNode = btn.domNode;
    assertAttribute(domNode, "test_prop_null", null);
    assertAttribute(domNode, "test_prop_0", 0);
    assertAttribute(domNode, "test_prop_undefined", undefined);
    assertAttribute(domNode, "test_prop_empty_string", "");
}

export function test_property_is_reported_in_dom_node() {
    const btn = new Button();
    btn.text = "test_value";
    btn.ensureDomNode();
    const domNode = btn.domNode;
    assertAttribute(domNode, "text", "test_value");
}




function test_falsy_property_is_reported_in_dom_node() {
    //TODO: Enable this test when attribute change detection is implemented

    const btn = new Button();
    btn.text = null;
    btn.ensureDomNode();
    const domNode = btn.domNode;
    assertAttribute(domNode, "text", null);

    btn.text = undefined;
    assertAttribute(domNode, "text", undefined);
}

