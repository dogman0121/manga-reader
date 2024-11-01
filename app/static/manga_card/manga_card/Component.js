class Component {
    eventsDict = {};

    init(element) {
        this.element = element;
        this.onInit();
        this.events(this.element);
    }

    render(){
        if (this.element)
            return this.element;

        let parsedElement = this.renderHTML(this.html());
        this.replaceComponents(this.findTextNodes(parsedElement));
        this.element = parsedElement;
        this.events(this.element);
        return this.element;
    }

    html(){} // Abstract function

    events(element){} // Abstract function

    onInit(){} // Abstract function

    renderHTML(html){
        let wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        return wrapper.children[0];
    }

    findTextNodes(element){
        let textNodes = [];
        let walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

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

    renderFromType(object){
        if (Array.isArray(object))
            return object.map((obj) => this.renderFromType(obj))

        switch (typeof object){
            case "function":
                let obj = new object();
                return this.renderFromType(obj);
            case "object":
                if (object.element)
                    return object.element;
                if (object.html)
                    return object.render();
                return document.createTextNode(object.toString());
            default:
                return document.createTextNode(object.toString());
        }
    }

    renderElement(text){ // Returns a rendered node
        let evaluated = eval(text);

        return this.renderFromType(evaluated);
    }

    replaceComponents(textNodes){
        for (let node of textNodes){
            let vars = this.splitTextNode(node)

            if (!vars || vars.length === 0)
                continue;

            let parsed;
            for(let tempVar of vars){
                parsed = this.parseTextNode(tempVar.data);

                let rendered = this.renderElement(parsed);
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
    }

    dispatchEvent(event) {
        if (!this.eventsDict[event.type])
            return null;

        for (let handler of this.eventsDict[event.type])
            handler(event);
    }
}