function genConsole () {
    const consoleRegion = document.createElement("div"); 
    consoleRegion.setAttribute("role", "region"); 
    consoleRegion.setAttribute("aria-label","Command Input");
    consoleRegion.classList.add("console-main");

    const inputArea = document.createElement("div");
    const inputContainer = document.createElement("div");
    const input = document.createElement("input");
    inputArea.classList.add("console-input-area");
    inputContainer.classList.add("console-cursor");
    input.setAttribute("aria-label", "Command Input");
    input.classList.add("console-input");

    consoleRegion.append(inputArea);
    inputArea.append(inputContainer);
    inputArea.append(input);

    return consoleRegion;
}

export default class ConsoleEle extends HTMLElement {
    constructor () {
        super();
        this.append(genConsole());
    }

    connectedCallback () {
        if (!this.isConnected) {
            return;
        }
        this.consoleInputContainer = this.querySelector(".console-input-area");
        this.consoleInput = this.querySelector(".console-input");
        this.consoleCursor = this.querySelector(".console-cursor");
        this.consoleMain = this.querySelector(".console-main");

        this.consoleInput.addEventListener("keypress", this.handleKeyPress);
        this.consoleInput.addEventListener("blur", this.handleBlur);
        this.consoleInputContainer.addEventListener("click", this.handleClick);
    }

    disconnectedCallback() {
        if (this.isConnected) {
            return;
        }

        this.consoleInput.removeEventListener("keypress", this.handleKeyPress);
        this.consoleInput.removeEventListener("blur", this.handleBlur);
        this.consoleInputContainer.removeEventListener("click", this.handleClick);
    }

    findCmdIdx () {
        return this.consoleMain.children.length - 1 <= 0 ? 1 :
                this.consoleMain.children.length - 1;
    }

    handleBlur = e => {
        this.consoleCursor.classList.remove();
    }

    handleClick = e => {
        this.consoleInputContainer.children[1].focus();
        this.consoleCursor.classList.add("blink");
    }

    handleKeyPress = e => {
        if (e.key === "Enter") {
            const cmdIdx = document.createElement("article");
            let val = this.consoleInput.value.split(" ");
            let cmd = val[0];
            val.shift();
            cmdIdx.classList.add(`cmd-${this.findCmdIdx()}`);
            cmdIdx.setAttribute("aria-label", `Command ${this.findCmdIdx()}`);
            cmdIdx.innerHTML = this.consoleInput.value;
            this.consoleInput.value = "";
            if (cmd in this.commands) {
                this.commands[cmd](e, ...val);
            }
            // TODO: Add accessible navigation of past commands
            this.consoleMain.insertBefore(cmdIdx, this.consoleInputContainer);
            cmdIdx.scrollIntoView();
        }
    }
    
    /**
     * Will contain all the commands to allow invoking without a
     * switch case, which personally I think a hash map of functions
     * rather than a conditional chain is more performant and much
     * more readable.
     */
    commands = {
        clear: () => {
            // TODO: Implementation that is better than deleting...
            // Proposition one is to place padding and remove per
            // enter hit
        },
        create: (_, ...args) => {
            if (args[0] === "h" || args[0] === "-h" || args[0] === "--h") {
                this.parseHTML("assets/app/js/accessibleConsole/webCLI/html/create-help.html");
                return;
            }
            
            if (!valid_tags.findIndex(arg[0].toLowerCase())) {
                throw SyntaxError("Invalid tag passed!");
            } 
            const tag = document.createElement(arg[0]);

            for (let i = 1; i < args.length; i++) {
                if (arg[i].match('--attr') || arg[i].match('-a' || arg[i].match('a'))) {
                    let attr = arg[i].split('=');
                    tag.setAttribute(attr[0], attr[1]);
                }

                if (arg[i].match("--class") || arg[i].match("-cl") || arg[i].match("c")) {
                    
                }

                // if (arg[i].match("--id"))
            }
        }
    }

    /**
     * Will load any HTML template and import it into the console.
     * This will take place utilizing a promise and may lead to 
     * some behaviors people will call wierd.
     * 
     * @param {String} path The current location of the fil on the server
     */
    parseHTML (path) {
        fetch(path).then(data => {
            return data.text();
        }).then(results => {
            const parser = new DOMParser();
            let doc = parser.parseFromString(results, "text/html");
            return doc.body.childNodes;
        }).then(eles => {
            const containEle = document.createElement("div");
            containEle.append(...eles);
            this.consoleMain.insertBefore(
                containEle,
                this.consoleInputContainer); 
            this.consoleInputContainer.scrollIntoView();
        }).catch(err => console.error(err));
    }
}

customElements.define('ele-console', ConsoleEle);

const valid_tags = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "math",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rb",
    "rp",
    "rt",
    "rtc",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "slot",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "svg",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr"
];