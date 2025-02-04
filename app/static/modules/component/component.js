class Render {
    static renderObject(object){
        if (Array.isArray(object))
            return object.map((obj) => this.renderObject(obj))

        if (object instanceof State){
            const x = this.renderObject(object.value);
            object.bindElement(x);
            return x;
        }

        switch (typeof object){
            case "function":
                let obj = new object();
                return this.renderObject(obj);
            case "object":
                if (object.element)
                    return object.element;
                if (object.html)
                    return object.render();
                return object;
            case "string":
                return document.createTextNode(object.toString());
            default:
                return object;
        }
    }
}

class Component {
    eventsDict = {};

    constructor(html) {
        if (!html)
            return;

        let parsedElement = this.renderHTML(html);
        if (!parsedElement){
            parsedElement = document.createTextNode(html);
            this.replaceComponents([parsedElement]);
        }
        else {
            this.replaceComponents(this.findTextNodes(parsedElement));
        }

        this.element = parsedElement;

        this._propagateEvents();
    }


    init(element) {
        this.element = element;
        this.onInit();
        this.events(this.element);
        this.onRender();
    }

    render(){
        if (this.element)
            return this.element;

        let parsedElement = this.renderHTML(this.html());
        if (!parsedElement){
            parsedElement = document.createTextNode(this.html());
            this.replaceComponents([parsedElement]);
        }
        else {
            this.replaceComponents(this.findTextNodes(parsedElement));
        }

        this.element = parsedElement;
        this._propagateEvents();
        this.events(this.element);
        this.onRender();
        return this.element;
    }

    html(){} // Abstract function

    events(element){} // Abstract function

    onInit(){} // Abstract function

    onRender(){}

    renderHTML(html){
        let wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        return wrapper.children[0];
    }

    findTextNodes(element){
        let textNodes = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

        while (walker.nextNode())
            textNodes.push(walker.currentNode);

        return textNodes;
    }

    splitTextNode(textNode){
        let r = /{{.*?}}/g;
        let vars = textNode.data.match(r);
        let text = textNode.data.split(r);
        let varsNode = []

        if (!vars)
            return [];

        let orderedList = [];
        for(let i=0; i < (vars.length + text.length); i++){
            if (i % 2 === 0 && text[i/2] !== "") {
                orderedList.push(document.createTextNode(text[i/2]));
            }
            if (i % 2 === 1) {
                let tempNode = document.createTextNode(vars[(i-1)/2]);
                orderedList.push(tempNode);
                varsNode.push(tempNode);
            }
        }

        textNode.replaceWith(...orderedList);

        return varsNode;
    }

    parseTextNode(varNode){
        return varNode.substring(2, varNode.length - 2).trim();
    }

    renderElement(text){ // Returns a rendered node
        return Render.renderObject(eval(text));
    }

    replaceComponents(textNodes){
        for (let node of textNodes){
            const vars = this.splitTextNode(node)

            if (!vars || vars.length === 0)
                continue;

            let parsed;
            for(let tempVar of vars){
                parsed = this.parseTextNode(tempVar.data);

                const rendered = this.renderElement(parsed);
                if (Array.isArray(rendered))
                    tempVar.replaceWith(...rendered);
                else
                    tempVar.replaceWith(rendered);
            }
        }
    }

    addEventListener(name, handler) {
        if (!this.eventsDict[name])
            this.eventsDict[name] = [];
        this.eventsDict[name].push(handler);

        if (this.element)
            this.element.addEventListener(name, this.dispatchEvent.bind(this));
    }

    dispatchEvent(event) {
        if (!this.eventsDict[event.type])
            return null;

        for (let handler of this.eventsDict[event.type])
            handler(event);
    }

    _propagateEvents(){
        for(let event of Object.keys(this.eventsDict)){
            this.element.addEventListener(event, this.dispatchEvent.bind(this));
        }
    }
}

class State {
    constructor(defaultValue){
        this.value = defaultValue;
    }

    set(value){
        this.value = value;
        const newElem = Render.renderObject(value);
        if (this.element){
            this.element.replaceWith(newElem);
            this.element = newElem;
        }
    }

    get(){
        return this.value;
    }

    bindElement(elem){
        this.element = elem;
    }
}