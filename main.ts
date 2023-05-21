/*
    When I use react and I create a JSX element, it's just a syntax sugar for React.createElement.
    In this project, I think I'll be creating a Kalu.createElemenet function but I don't know if I'll create
    my own syntactic sugar for it.
    When you install react, the actual react file is the babel that transpiles the JSX into React.createElement.
    It's react-dom that actually renders the element.

    An site that I came across advices me to learn the following:
    - createElement Function
    - render Function
    - Concurrent Mode
    - Fibers (Layman's understanding of what this is at the moment)
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
*/
interface IProps{
    title: string,
    children: {
        type: string,
        props: IProps[] | string,
    }
}

class Kalu{
    createElement(type:string, props:IProps, ...children){
        hello
    }
}