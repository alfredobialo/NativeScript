import { assert, assertEqual, assertFalse, assertTrue, assertThrows } from "../TKUnit";
import { DOMNode, Inspector } from "tns-core-modules/debugger/dom-node";
import { Button } from "tns-core-modules/ui/button";
import { Label } from "tns-core-modules/ui/label";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";

let originalInspectorGlobal;
let currentInspector : Inspector = { 
    childNodeInserted(parentId: number, lastId: number, nodeStr: string) : void {
    },
    childNodeRemoved(parentId: number, nodeId: number): void {
    },
    documentUpdated(): void {
    }
};

export function setUp(): void {
    originalInspectorGlobal = global.__inspector;
    global.__inspector = currentInspector;
}

export function tearDown(): void {
    global.__inspector = originalInspectorGlobal;
}

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
    assertAttribute(domNode, "test_prop_null", null + "");
    assertAttribute(domNode, "test_prop_0", 0 + "");
    assertAttribute(domNode, "test_prop_undefined", undefined + "");
    assertAttribute(domNode, "test_prop_empty_string", "");
}

export function test_property_is_reported_in_dom_node() {
    const btn = new Button();
    btn.text = "test_value";
    btn.ensureDomNode();
    const domNode = btn.domNode;
    assertAttribute(domNode, "text", "test_value");
}

export function test_childNodeInserted_in_dom_node() {
    let childNodeInsertedCalled = false;
    let actualParentId = 0;
    let expectedParentId = 0;

    currentInspector.childNodeInserted = (parentId, lastNodeId, node) => {
        childNodeInsertedCalled = true;
        actualParentId = parentId;
    }
    
    const stack = new StackLayout();
    stack.ensureDomNode();
    expectedParentId = stack._domId;

    const btn1 = new Button();
    btn1.text = "button1";
    stack.addChild(btn1);

    assert(childNodeInsertedCalled, "global.__inspector.childNodeInserted not called.");
    assertEqual(actualParentId, expectedParentId);
}

export function test_childNodeInserted_at_index_in_dom_node() {
    let expectedLastId = 0;
    let actualLastId = 0;
    currentInspector.childNodeInserted = (parentId, lastNodeId, node) => {
        actualLastId = lastNodeId;
    }
    
    const stack = new StackLayout();
    stack.ensureDomNode();

    // child index 0
    const btn1 = new Button();
    btn1.text = "button1";
    stack.addChild(btn1);
    expectedLastId = btn1._domId;

    // child index 1
    const btn2 = new Button();
    btn2.text = "button2";
    stack.addChild(btn2);
    
    // child index 2
    const btn3 = new Button();
    btn3.text = "button3";
    stack.addChild(btn3);

    const lbl = new Label();
    lbl.text = "label me this";
    stack.insertChild(lbl, 1);

    assertEqual(actualLastId, expectedLastId, "Child inserted at index 1's previous sibling does not match.");
}

export function test_childNodeRemoved_in_dom_node() {
    let childNodeRemovedCalled = false;
    let actualRemovedNodeId = 0;
    let expectedRemovedNodeId = 0;

    currentInspector.childNodeRemoved = (parentId, nodeId) => {
        childNodeRemovedCalled = true;
        actualRemovedNodeId = nodeId;
    }
    
    const stack = new StackLayout();
    stack.ensureDomNode();

    const btn1 = new Button();
    btn1.text = "button1";
    expectedRemovedNodeId = btn1._domId;
    stack.addChild(btn1);

    const btn2 = new Button();
    btn2.text = "button2";
    stack.addChild(btn2);

    stack.removeChild(btn1);

    assert(childNodeRemovedCalled, "global.__inspector.childNodeRemoved not called.");
    assertEqual(actualRemovedNodeId, expectedRemovedNodeId);
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
