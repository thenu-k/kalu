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
class Kalu {
    createElement(type, props, ...children) {
        return {
            type,
            props: Object.assign(Object.assign({}, props), { children: children.map(child => // This uses rest meaning that it'll return an array. Suppose ...children is empty, then the function won't be called and you'll get []
                 typeof child === 'object'
                    ? child
                    : this.createTextElement(child)) })
        };
    }
    createTextElement(text) {
        return {
            type: 'TEXT',
            props: {
                nodeValue: text,
                children: []
            }
        };
    }
}
const kalu = new Kalu;
console.log(JSON.stringify(kalu.createElement('section', { id: 'top' }, kalu.createElement('div', { id: 'hello' }), kalu.createElement('p', null, 'This is some text'))));
