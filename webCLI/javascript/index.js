import { instantiateChecks } from './accessCheck.js';

window.addEventListener("load", () => {;
    const mutations = instantiateChecks("content-space");
    const consoleInputContainer = document.querySelector(".console-input-area");
    const consoleInput = document.querySelector(".console-input");
    const consoleCursor = document.querySelector(".console-cursor");
    const consoleMain = document.querySelector(".console-main");

    // Will run the command passed in
    consoleInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            const cmdIdx = document.createElement("div");
            let val = consoleInput.value.split(" ");
            let cmd = val[0];
            val.shift();
            cmdIdx.classList.add(`cmd-${findCmdIdx()}`);
            cmdIdx.setAttribute("aria-label", `Command ${findCmdIdx()}`);
            cmdIdx.innerHTML = consoleInput.value;
            consoleInput.value = "";
            if (cmd in commands) {
                commands[cmd](e, ...val);
            }
            consoleMain.insertBefore(cmdIdx, consoleInputContainer);
            cmdIdx.scrollIntoView();
        }
    });

    // Removes animation made with CSS
    consoleInput.addEventListener("blur", _ => {
        consoleCursor.classList.remove("blink");
    });

    // Runs animations made with CSS
    consoleInputContainer.addEventListener("click", _ => {
        consoleInputContainer.children[1].focus();
        consoleCursor.classList.add("blink");
    });

    // Why re-write this so much :/
    function findCmdIdx() {
        return consoleMain.children.length - 1 <= 0 ? 1 : 
                consoleMain.children.length - 1;
    }

    /**
     * Will load any HTML template and import it into the console.
     * This will take place utilizing a promise and may lead to 
     * some behaviors people will call wierd.
     * 
     * @param {String} path The current location of the fil on the server
     */
    function parseHTML(path) {
        fetch(path).then(data => {
            return data.text();
        }).then(results => {
            const parser = new DOMParser();
            let doc = parser.parseFromString(results, "text/html");
            return doc.body.childNodes;
        }).then(eles => {
            const containEle = document.createElement("div");
            containEle.append(...eles);
            consoleMain.insertBefore(
                containEle,
                consoleInputContainer); 
            consoleInputContainer.scrollIntoView();
        }).catch(err => console.error(err));
    }

    /**
     * Will contain all the commands to allow invoking without a
     * switch case, which personally I think a hash map of functions
     * rather than a conditional chain is more performant and much
     * more readable.
     */
    const commands = {
        clear: () => {
            // TODO: Implementation that is better than deleting...
            // Proposition one is to place padding and remove per
            // enter hit
        },
        create: (_, ...args) => {
            if (args[0] === "h" || args[0] === "-h" || args[0] === "--h") {
                parseHTML("html/create-help.html");
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
    ]
});


