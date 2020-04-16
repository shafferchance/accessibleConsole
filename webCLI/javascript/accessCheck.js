/**
 *  <h1>Instantiate Checks</h1>
 *  Will run "unit tests" to ensure that that the page is accesssible. If <b>no</b> tests
 *  are passed in the rest operator than the <b>default</b> tests will be on the target.
 *  <br>
 *  <h3>Default Tests</h3>
 *  <div style="padding-left="40px">
 *          <ul>
 *              <li>Check for aria-label</li>
 *              <li>Check for aria-role</li>
 *              <li>Check for aria landmarks for easier navigation</li>
 *          </ul>
 *  </div>
 * 
 * @param {HTMLElement|Node|String} target To get target there are three ways: directly, CSS Selector, or ID. 
 * @param  {...function} Tests Send as many test as desired, if none are sent default tests will be ran.
 */
const instantiateChecks = (target, ...args) => {
    // Simply a type check that is utilized to ensure that an HTMLElement || Node is being used
    if (target.constructor !== HTMLElement &&
            target.constructor !== Node) {
        if (document.querySelector(target) !== null) {
            target = document.querySelector(target);
        } else if (document.getElementById(target) !== null) {
            target = document.getElementById(target);
        } else {
            throw SyntaxError("The target passed does not exist, please try again");
        }
    }

    const observer = new MutationObserver(mutation => {
        console.log(mutation);
    })

    let config = {childList: true};
    observer.observe(target, config);

    return observer; 
    /* 
        This is to allow the programmer to terminate the instance when they wish to 
        do so. May switch to IIFE and add method after, since the var will be 
        serialized within rather than returned for encapsulation. 
    */
}

export { instantiateChecks };