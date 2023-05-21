"use strict";
/*
    When I use react and I create a JSX element, it's just a syntax sugar for React.createElement.
    In this project, I'll be creating a Kalu.createElement function but I don't know if I'll create
    my own syntactic sugar for it.
    When you install react, the actual react file is just the babel that transpiles the JSX into React.createElement.
    It's react-dom that actually renders the element.

    A site that I came across advices me to learn the following:
    - createElement Function
    - render Function
    - Concurrent Mode
    - Fibers (I've a layman's understanding of what this is at the moment)
    - Render and Commit Phases
    - Reconciliation
    - Functional Components
    - Hooks
*/
const createElement = (type, props, ...children) => {
    return {
        type,
        props: Object.assign(Object.assign({}, props), { children: children.map(child => // This uses rest meaning that it'll return an array. Suppose ...children is empty, then the function won't be called and you'll get []
             typeof child === 'object'
                ? child
                : createTextElement(child)) })
    };
};
const createTextElement = (text) => {
    // Note that when creating a text node, it will be nested inside the original parent node. So a p->Hello! tag will come out as p->text->Hello!
    return {
        type: 'TEXT',
        props: {
            nodeValue: text,
            children: []
        }
    };
};
/*
    render Function.
    At the very simplest level, it should take an html node and add our current nodes to its children.
    The render function will be recursive as you'll see in the next few lines.
    We'll first provide the top-parent level node and it'll:
    a) create a domElement to the specs of this node
    b) creates a child node recursively
    If the child node is a text node (this also means that the parent node only contained text - unorthodox but it's how it works)
    then a text node will be created.
*/
const render = (currentNode, currentContainer) => {
    var _a;
    const domElement = (currentNode.type === 'TEXT' && currentNode.props.nodeValue)
        ? document.createTextNode(currentNode.props.nodeValue)
        : document.createElement(currentNode.type);
    (_a = currentNode.props.children) === null || _a === void 0 ? void 0 : _a.map((childNode) => render(childNode, domElement));
    currentContainer.appendChild(domElement);
};
const Kalu = {
    createElement, render
};
const newElement = Kalu.createElement('h1', {}, Kalu.createElement('p', {}, 'Hello'));
const mainContainer = document.querySelector('body');
if (mainContainer) {
    Kalu.render(newElement, mainContainer);
}
