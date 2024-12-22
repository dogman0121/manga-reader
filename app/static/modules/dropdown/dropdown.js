class Dropdown extends Component {
    constructor(anchor, content, position = "left-bottom") {
        super();

        this.content = content;
        this.anchor = anchor;
        this.position = position;
    }

    events(element) {
        document.body.addEventListener("click", this.onClick.bind(this));
    }

    onClick(event) {
        if (event.target.closest(".dropdown") || this.anchor.contains(event.target))
            return null;

        this.hide();
    }

    html() {
        return `
            <div class="dropdown">
                {{ this.content }}
            </div>
        `;
    }

    show() {
        if (!this.element)
            this.render();

        const anchorCords = this.anchor.getBoundingClientRect();
        document.body.append(this.element);


        let shiftX, shiftY;
        if (this.position)
            switch (this.position){
                case "left-top":
                    shiftX = anchorCords.right - this.element.offsetWidth;
                    shiftY = anchorCords.top - this.element.offsetHeight;
                    break;
                case "left-bottom":
                    shiftX = anchorCords.right - this.element.offsetWidth;
                    shiftY = shiftY = window.scrollY + anchorCords.bottom;
                    break;
                case "right-top":
                    shiftX = anchorCords.left;
                    shiftY = anchorCords.top - this.element.offsetHeight;
                    break;
                case "right-bottom":
                    shiftX = anchorCords.left;
                    shiftY = window.scrollY + anchorCords.bottom;
                    break;
                default:
                    if (anchorCords.left + this.element.offsetWidth > document.body.offsetWidth)
                        shiftX = anchorCords.right - this.element.offsetWidth;
                    else
                        shiftX = anchorCords.left;

                    if (window.scrollY + anchorCords.bottom + this.element.offsetHeight > document.body.offsetHeight)
                        shiftY = anchorCords.top - this.element.offsetHeight;
                    else
                        shiftY = window.scrollY + anchorCords.bottom;

            }

        this.element.style.transform = `translate3D(${shiftX}px, ${shiftY}px, 0)`;
    }

    hide() {
        this.element.remove();
    }
}