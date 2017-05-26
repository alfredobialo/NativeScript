import * as observable from "tns-core-modules/data/observable";
import * as frame from "tns-core-modules/ui/frame";
import { Label } from "tns-core-modules/ui/label";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { DOMNode, ROOT_NODE_TYPE } from "tns-core-modules/debugger/dom-node";

export function itemTap(args: observable.EventData) {
    frame.topmost().navigate({
        moduleName: "gallery-app/" + args.object.get("tag"),
    });
}

export function print() {
    const node = new DOMNode(frame.topmost());
    console.dir(node.print());
}

let i = 0;
export function add(args) {
    const container = args.object.page.getViewById("container");
    const lbl = new Label();
    lbl.text = "label " + i++;
    container.addChild(lbl);
}

export function remove(args) {
    const container = <StackLayout>args.object.page.getViewById("container");
    const lbl = container.getChildAt(container.getChildrenCount() - 1);
    container.removeChild(lbl);
}

export function navigate() {
    frame.topmost().navigate("main-page");
}