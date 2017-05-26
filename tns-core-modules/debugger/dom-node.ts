import { getSetProperties } from "../ui/core/properties";
import { ViewBase } from "../ui/core/view";

const propertyBlacklist = [
    "effectivePaddingLeft",
    "effectivePaddingBottom",
    "effectivePaddingRight",
    "effectivePaddingTop"
]

export interface Inspector {
    childNodeInserted(parentId: number, lastId: number, nodeStr: string);
    childNodeRemoved(parentId: number, nodeId: number);
    documentUpdated();
}

let inspector: Inspector;

function getInspector(): Inspector {
    if (!inspector) {
        inspector = (<any>global).__inspector;
    }

    return inspector;
}

export const ELEMENT_NODE_TYPE = 1;
export const ROOT_NODE_TYPE = 9;
export class DOMNode {
    nodeId;
    nodeType;
    nodeName;
    localName;
    nodeValue = '';
    attributes: string[] = [];

    constructor(private view: ViewBase) {
        this.nodeType = view.typeName === "Frame" ? ROOT_NODE_TYPE : ELEMENT_NODE_TYPE;
        this.nodeId = view._domId;
        this.nodeName = view.typeName;
        this.localName = this.nodeName;

        this.getAttributes(view, this.attributes);
    }

    get children(): DOMNode[] {
        const res = [];
        this.view.eachChild((child) => {
            child.ensureDomNode();
            res.push(child.domNode);
            return true;
        });

        return res;
    }

    public print() {
        return {
            nodeId: this.nodeId,
            nodeType: this.nodeType,
            nodeName: this.nodeName,
            localName: this.localName,
            nodeValue: this.nodeValue,
            children: this.children.map(c => c.print()),
            attributes: this.attributes
        };
    };

    public toJSON() {
        return JSON.stringify(this.print());
    }

    public getAttributes(view, attrs) {
        const props = getSetProperties(view).filter(pair => {
            const name = pair[0];
            const value = pair[1];

            if (name[0] === "_") {
                return false;
            }

            if (value !== null && typeof value === "object") {
                return false;
            }

            if (propertyBlacklist.indexOf(name) >= 0) {
                return false;
            }

            return true;
        });

        props.forEach(pair => attrs.push(pair[0], pair[1] + ""));
    }


    onChildAdded(view: ViewBase, atIndex?: number): void {
        const ins = getInspector();
        if (ins) {
            let previousChild: ViewBase;
            this.view.eachChild((child) => {
                if (child === view) {
                    return false;
                }
                
                previousChild = child;

                return true;
            });

            view.ensureDomNode();
            ins.childNodeInserted(this.nodeId, !!previousChild ? previousChild._domId : 0, view.domNode.toJSON());
        }
    }

    onChildRemoved(view: ViewBase): void {
        const ins = getInspector();
        if (ins) {
            ins.childNodeRemoved(this.nodeId, view.domNode.nodeId);
        }
    }
}
