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
    props: object|null
}

type KaluChildren = KaluNode | string

const createElement = (type:string, props:object|null, ...children:KaluChildren[]) => {
    return {
        type,
        props: {
            ...props,                        // Suppose the initial prop was given as {A:a, B:b}. This spread syntax will spread those values to give THIS prop a value like {A:a, B:b, children: [...]}
            children: children.map(child=>  // This uses rest meaning that it'll return an array. Suppose ...children is empty, then the function won't be called and you'll get []
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

let Kalu = {
    createElement
}
console.log(JSON.stringify(Kalu.createElement(
    'section', {id: 'top'}, Kalu.createElement('div', {id: 'hello'}), Kalu.createElement('p', null, 'This is some text')
)))


/* 
    render Function. 
    At the very simplest level, it should take an html node and add our current nodes to its children.
*/