/**
 * Returns the CSS selector for a given key code.
 * @param {string} keyCode - The code of the key.
 * @returns {string} The CSS selector for the key.
 */
function getKeySelector(keyCode) {
  return `.key.${keyCode}`;
}

/**
 * Updates the class of a DOM element based on the given selector.
 * @param {string} selector - The CSS selector of the element to update.
 * @param {string} className - The class name to add or remove.
 * @param {string} action - The action to perform ("add" or "remove").
 */
const updateElementClass = (selector, className, action) => {
  const element = document.querySelector(selector);
  if (element) {
    element.classList[action](className);
  } else {
    console.error(`Element with selector "${selector}" not found.`);
  }
};

/**
 * Handles a key event (down or up) and updates the keyboard layout accordingly.
 * @param {KeyboardEvent} e - The key event to handle.
 */
function handleKeyEvent(e) {
  const keySelector = getKeySelector(e.code);

  if (e.type === "keydown") {
    e.preventDefault();
    updateElementClass(keySelector, "active", "add");
    updateElementClass(keySelector, "secondary-highlight", "add");
    console.log(`Key pressed: ${e.key}`);
  } else if (e.type === "keyup") {
    updateElementClass(keySelector, "secondary-highlight", "remove");
  }
}

/**
 * Handles a mouse event (down or up) and updates the keyboard layout accordingly.
 * @param {MouseEvent} e - The mouse event to handle.
 */
function handleMouseEvent(e) {
  const mouseSelector = `.key.Mouse${e.button}`;

  if (e.type === "mousedown") {
    updateElementClass(mouseSelector, "active", "add");
    updateElementClass(mouseSelector, "secondary-highlight", "add");
  } else if (e.type === "mouseup") {
    updateElementClass(mouseSelector, "secondary-highlight", "remove");
  }
}

/**
 * Handles the window blur event and removes the secondary highlight class from all keys.
 */
function handleWindowBlur() {
  const allKeys = document.querySelectorAll(".key");
  allKeys.forEach((key) => {
    key.classList.remove("secondary-highlight");
  });
}

/**
 * Handles the mouse wheel event and adds or removes the active class from the
 * up or down arrow key accordingly.
 * @param {WheelEvent} e - The wheel event to handle.
 */
function handleWheel(e) {
  const scrollSelector = e.deltaY > 0 ? ".scrollDown" : ".scrollUp";
  updateElementClass(scrollSelector, "active", "add");
  updateElementClass(scrollSelector, "secondary-highlight", "add");
  setTimeout(() => {
    updateElementClass(scrollSelector, "secondary-highlight", "remove");
  }, 200);
}

/**
 * Handles the window resize event and resizes the keyboard layout accordingly.
 */
function handleResize() {
  try {
    const keyboardWrapper = document.getElementById("kbContainer");
    const keyboardBody = document.getElementById("kbLayout");

    if (!keyboardWrapper || !keyboardBody) {
      console.warn("Keyboard elements not found.");
      return;
    }

    const myWidth = keyboardBody.clientWidth;
    const windowWidth = document.documentElement.clientWidth;

    if (isNaN(myWidth) || isNaN(windowWidth) || windowWidth === 0) {
      console.error("Invalid dimensions.");
      return;
    }

    const myPercentage = myWidth / windowWidth;
    if (myPercentage > 1) {
      const newPercentage = Math.min(0.95, 0.95 * (windowWidth / myWidth));
      scaleKeyboard(keyboardWrapper, newPercentage);
    } else {
      scaleKeyboard(keyboardWrapper, 1);
    }
  } catch (error) {
    console.error("Error handling resize:", error);
  }
}

/**
 * Scales the given element according to the given percentage.
 * @param {HTMLElement} element - The element to scale.
 * @param {number} percentage - The percentage to scale the element.
 */
function scaleKeyboard(element, percentage) {
  element.style.transform = `scale(${percentage})`;
}

/**
 * Creates a throttled version of the given function.
 * @param {function} func - The function to throttle.
 * @param {number} limit - The time in milliseconds to wait between calls.
 */
function throttle(func, limit) {
  let inThrottle;
  return function () {
    if (!inThrottle) {
      func();
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Initializes the keyboard module by setting up event listeners.
 */
function initKeyboardModule() {
  document.addEventListener("keydown", handleKeyEvent);
  document.addEventListener("keyup", handleKeyEvent);
  window.addEventListener("blur", handleWindowBlur);
  document.addEventListener("mousedown", handleMouseEvent);
  document.addEventListener("mouseup", handleMouseEvent);
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("resize", throttle(handleResize, 30));

  handleResize();
}

export { initKeyboardModule };
