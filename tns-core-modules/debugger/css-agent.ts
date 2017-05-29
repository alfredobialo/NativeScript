/*
    On element select in the inspector the following are requested:
        - Inline styles -> CSSStyle
        - Attributes styles -> CSSStyle (Appears as 'Stacklayout[Attributes style]` - unsure of its purpose) irrelevant?
        - Style matches -> RuleMatch[]
        - Inherited styles -> InheritedStyleEntry[]
        - Pseudo Element matches -> PseudoElementMatches[]
        - Computed Styles for node -> CSSComputedStyleProperty[]
        - Element Fonts -> PlatformFontUsage
*/

export class CSSProperty {
    name: string
    value: string
    disabled: boolean // strikes out the disabled property 
}

export class ShorthandEntry { // seems irrelevant - feel free to leave empty for now
    name: string
    value: string
}

export class CSSStyle {
    cssProperties: CSSProperty[]
    shorthandEntries: ShorthandEntry[] // doesn't seem to display anywhere
    cssText?: string
}

export class Value {
    text: string
}

export class SelectorList { // e.g. [".btn", "Button", "Label"]
    selectors: Value[]
    text: string // doesn't seem to display anywhere
}

export class CSSRule {
    selectorList: SelectorList
    origin: string // a constant - "regular"
    style: CSSStyle
    styleSheetId?: string // associated stylesheet
}

export class RuleMatch {
    rule: CSSRule
    matchingSelectors: number[] // index-based - the index of the selector that the node currently inspected matches
}

export class InheritedStyleEntry {
    matchedCSSRules: RuleMatch[]
    inlineStyle?: CSSStyle
}

export class CSSComputedStyleProperty {
    name: string
    value: string
}

export class PlatformFontUsage {
    familyName: string
    glyphCount: number // number of characters in text of element
    isCustomFont: boolean
}

export class CSSStyleSheetHeader {
    styleSheetId: string // a unique identifier - file name/path should do
    frameId: string // constant
    sourceUrl: string
    origin: string // constant
    title: string // the same as the id?
    disabled: boolean // false - if the css has been invalidated/disabled
    isInLine: boolean // false
    startLine: number // constant - 1
    startColumn: number // constant - 1
}

export class PseudoElementMatches {
    pseudoType: string // e.g. last-child
    matches: RuleMatch[]
}