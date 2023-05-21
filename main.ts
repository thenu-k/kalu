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


/*
    createElement function.
    When someone uses the React.createElement function, it actually creates 
    an object that looks like this:
    {
        type: 'div',
        props: {
            title: 'foo',
            children: // An array of children
        }
    }
    To do this, know the difference between the rest and spread syntax.
    Rest->
        fn (a, b, ...c){
            return c
        }
        fn('a', 'b', 'c', 'd', 'e') -> output = ['c', 'd', 'e']
    Spread->
        Std spread functionality
*/

interface KaluNode {
    type: string,
    props: KaluProps
}
interface KaluProps {
    nodeValue?: string,
    children?: never[] | KaluNode[],
    [key: string] : any
}
type KaluChildren = KaluNode | string


const createElement = (type:string, props:KaluProps, ...children:KaluChildren[]) => {
    return {
        type,
        props: {
            ...props,                        // Suppose the initial prop was given as {A:a, B:b}. This spread syntax will spread those values to give THIS prop a value like {A:a, B:b, children: [...]}
            children: children.map(child=>   // This uses rest meaning that it'll return an array. Suppose ...children is empty, then the function won't be called and you'll get []
                typeof child==='object'
                ?  child
                : createTextElement(child)
            )
        }
    }
}
const createTextElement = (text:string) => {
    return {
        type: 'TEXT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}


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

const render = (currentNode:KaluNode, currentContainer:HTMLElement|Text) => {
    const domElement = (currentNode.type==='TEXT'&&currentNode.props.nodeValue)
    ? document.createTextNode(currentNode.props.nodeValue)
    : document.createElement(currentNode.type)

    const checkIsProperty = (keyName:string) => {return keyName !=='children'}             //Add any prop properties (which aren't children) to the dom node
    Object.keys(currentNode.props)                                                         //This function returns an array of the KEYS from the key-value pairs of an object
    .filter(checkIsProperty)                                                               //Check if the current KEY is not 'children'
    .forEach(propertyName=> {
        if(domElement instanceof HTMLElement){                                             //Cannot assign a property to a text node
            domElement.setAttribute(propertyName, currentNode.props[propertyName])         //Online sources say to use domElement[key] = value but this does not work in typescript
        }                                                                                  //The problem is that the setAttribute function works different from the above one. I might need to look into this.
    })

    //Recursively create it's children
    currentNode.props.children?.map((childNode) => render(childNode, domElement))
    //Add the current node to the parent dom element
    currentContainer.appendChild(domElement)
}


/* 
    concurrency Logic.
    
*/

const Kalu = {
    createElement, render
}

const newElement = Kalu.createElement('h1', {ant: 5}, Kalu.createElement('p', {apple: 'apple'}, 'Hello'))
const mainContainer = document.querySelector('body')
if(mainContainer){
    Kalu.render(newElement, mainContainer)
}