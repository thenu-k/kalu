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
    ^^ NOT TRUE ANYMORE. I don't know how or why but the text element no longer appears in Text Nodes.
*/
const simpleRender = (currentNode, currentContainer) => {
    var _a;
    const domElement = (currentNode.type === 'TEXT' && currentNode.props.nodeValue)
        ? document.createTextNode(currentNode.props.nodeValue)
        : document.createElement(currentNode.type);
    const checkIsProperty = (keyName) => { return keyName !== 'children'; }; //Add any prop properties (which aren't children) to the dom node
    Object.keys(currentNode.props) //This function returns an array of the KEYS from the key-value pairs of an object
        .filter(checkIsProperty) //Check if the current KEY is not 'children'
        .forEach(propertyName => {
        if (domElement instanceof HTMLElement) { //Cannot assign a property to a text node
            domElement.setAttribute(propertyName, currentNode.props[propertyName]); //Online sources say to use domElement[key] = value but this does not work in typescript
        } //The problem is that the setAttribute function works different from the above one. I might need to look into this.
    });
    //Recursively create it's children
    (_a = currentNode.props.children) === null || _a === void 0 ? void 0 : _a.map((childNode) => simpleRender(childNode, domElement));
    //Add the current node to the parent dom element
    currentContainer.appendChild(domElement);
};
/*
    concurrency and fiber Logic.
    We will rewrite the render function taking the above into account.
    A fiber is just a javascript object and is almost exactly idential to a KaluNode as far as I can tell.
    Each KaluNode will be a fiber.
    The reason we're using concurrency/fibers here is that it might take a long time to render out the entire node tree.
    So we'll start will the TOP LEVEL NODE, then the FIRST CHILD, and then it's children if any, then the FIRST CHILD's siblings, then the ORIGINAL's
    siblings if any (iow, the FIRST CHILD's UNCLE).
    We'll be seperating these renders into units of work and we'll use a requestIdleCallback fn which will make sure that the next unit of work
    only runs when the main thread is free.
    In the following function, a unit of work is a fiber object.
*/
let nextUnitOfWork = null;
const workLoop = (deadLine) => {
    let shouldYield = false; //When the first run of this workLoop call begins, shouldYield should be false.
    while (nextUnitOfWork && !shouldYield) { //This loop keeps running until shouldYield becomes true
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadLine.timeRemaining() < 1; //shouldYield becomes true when the time remaining until the thread is required by the broswer is less than 1 (s or ms?)
    }
    requestIdleCallback(workLoop);
};
requestIdleCallback(workLoop);
const performUnitOfWork = (nextUnitOfWork) => {
    //TODO - this should return a fiber object
};
const Kalu = {
    createElement
};
const newElement = Kalu.createElement('h1', { ant: 5 }, Kalu.createElement('p', { apple: 'apple' }, 'Hello'));
const mainContainer = document.querySelector('body');
// if(mainContainer){
//     Kalu.simpleRender(newElement, mainContainer)
// }
