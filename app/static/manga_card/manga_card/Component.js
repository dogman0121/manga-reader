class Component {
    constructor() {
        this.events = {};
    }

    renderDOM(){
        if (this.element)
            return this.element;

        this.element = this.parseHTML(this.render());
        this.replaceComponents(this.findTextNodes(this.element));
        this.registerEvents(this.element);
        return this.element;
    }

    render(){} // Abstract function

    registerEvents(element){} // Abstract function

    parseHTML(html){
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

    parseTextNode(textNode){
        let r = /{{.*}}/g;
        let matches = textNode.data.match(r);

        if (!matches)
            return [];

        return matches.map((command) => {
            return command.substring(2, command.length - 2).trim();
        });
    }

    renderElement(text){ // Returns a rendered node
        let evaluated = eval(text);

        if (typeof evaluated === "function"){
            let cls = new evaluated();
            if (cls.render)
                return cls.renderDOM();
            else
                return document.createTextNode(cls.toString());
        }
        else if (typeof evaluated === "object"){
            if (evaluated.render)
                return evaluated.renderDOM();
            else
                return document.createTextNode(evaluated.toString());
        }
        else {
            return document.createTextNode(evaluated);
        }
    }

    replaceComponents(textNodes){
        for (let node of textNodes){
            let nodes = this.parseTextNode(node);

            if (!nodes || nodes.length === 0)
                continue;

            node.replaceWith(...nodes.map((component) => this.renderElement(component)));
        }
    }

    addEventListener(name, handler) {
        if (!this.events[name])
            this.events[name] = [];
        this.events[name].push(handler);
    }

    dispatchEvent(event) {
        for (let handler of this.events[event.type])
            handler(event);
    }
}