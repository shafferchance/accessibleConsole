document.addEventListener("load", () => {
        const consoleInputContainer = document.querySelector(".console-input-area");
        const consoleInput = document.querySelector(".console-input");
        const consoleCursor = document.querySelector(".console-cursor");
        const consoleMain = document.querySelector(".console-main");

        consoleInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            const cmd = document.createElement("div");
            let idx = consoleMain.children.length - 2;
            cmd.classList.add(`cmd-${idx}`);
            cmd.innerHTML = consoleInput.value;
            consoleInput.value = "";
            consoleMain.insertBefore(cmd, consoleInputContainer);
        }
        });

        consoleInput.addEventListener("blur", e => {
        consoleCursor.classList.remove("blink");
        });

        consoleInputContainer.addEventListener("click", e => {
        consoleInputContainer.children[1].focus();
        consoleCursor.classList.add("blink");
        });


    const handleCommand = input => {
        switch(input) {
        case input === "clear":
            
        }
    }
});