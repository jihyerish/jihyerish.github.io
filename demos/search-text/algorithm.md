The getComputedStyle(elt, pseudoElt) method must run these steps:

1. Let doc be elt’s node document.
2. Let obj be elt.
3. If pseudoElt is provided, is not the empty string, and starts with a colon, then:
    = 1. Parse pseudoElt as a <pseudo-element-selector>, and let type be the result. =
    1. Parse pseudoElt as a <pseudo-compound-selector>, and let type be the result.
    2. If type is failure, or is an ::slotted() or ::part() pseudo-element, let obj be null.
    3. Otherwise let obj be the given pseudo-element of elt.
    NOTE: CSS2 pseudo-elements should match both the double and single-colon versions. That is, both :before and ::before should match above.

4. Let decls be an empty list of CSS declarations.
5. If obj is not null, and elt is connected, part of the flat tree, and its shadow-including root has a browsing context which either doesn’t have a browsing context container, or whose browsing context container is being rendered, set decls to a list of all longhand properties that are supported CSS properties, in lexicographical order, with the value being the resolved value computed for obj using the style rules associated with doc. Additionally, append to decls all the custom properties whose computed value for obj is not the guaranteed-invalid value.

6. Return a live CSSStyleProperties object with the following properties:
computed flag
    Set.
readonly flag
    Set.
declarations
    decls.
parent CSS rule
    Null.
owner node
    obj.

The getComputedStyle() method exposes information from CSS style sheets with the origin-clean flag unset.