function getKeySelector(keyCode) {
  return `.key.${keyCode}`;
}

function updateElementClass(selector, className, action) {
  const element = document.querySelector(selector);
  if (element) {
    if (action === "add") {
      element.classList.add(className);
    } else if (action === "remove") {
      element.classList.remove(className);
    }
  } else {
    console.error(`Element with selector "${selector}" not found.`);
  }
}

function handleKeyDown(e) {
  e.preventDefault();
  const keySelector = getKeySelector(e.code);
  updateElementClass(keySelector, "active", "add");
  updateElementClass(keySelector, "secondary-highlight", "add");
  console.log(`Key pressed: ${e.key}`);
}

function handleKeyUp(e) {
  const keySelector = getKeySelector(e.code);
  updateElementClass(keySelector, "secondary-highlight", "remove");
}

// look into this
function handleWindowBlur() {
  const allKeys = document.querySelectorAll(".key");
  allKeys.forEach((key) => {
    key.classList.remove("secondary-highlight");
  });
}

function handleMouseDown(e) {
  const mouseSelector = `.key.Mouse${e.button}`;
  updateElementClass(mouseSelector, "active", "add");
  updateElementClass(mouseSelector, "secondary-highlight", "add");
}

function handleMouseUp(e) {
  const mouseSelector = `.key.Mouse${e.button}`;
  updateElementClass(mouseSelector, "secondary-highlight", "remove");
}

// figure out what I needed this for
function handleContextMenu(e) {
  e.preventDefault();
  const mouseSelector = `.key.Mouse${e.button}`;
  updateElementClass(mouseSelector, "secondary-highlight", "remove");
}

function handleWheel(e) {
  const scrollSelector = e.deltaY > 0 ? ".scrollDown" : ".scrollUp";

  updateElementClass(scrollSelector, "active", "add");

  updateElementClass(scrollSelector, "secondary-highlight", "add");

  // why did I need a timeout here
  setTimeout(() => {
    updateElementClass(scrollSelector, "secondary-highlight", "remove");
  }, 200);
}

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
      const newPercentage = Math.min(0.95, (windowWidth / myWidth) * 0.95);
      scaleKeyboard(keyboardWrapper, newPercentage);
    } else {
      scaleKeyboard(keyboardWrapper, 1);
    }
  } catch (error) {
    console.error("Error handling resize:", error);
  }
}

function scaleKeyboard(element, percentage) {
  element.style.transform = `scale(${percentage})`;
}

// what and why is debounce
function debounce(func, delay) {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
}

function initKeyboardModule() {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", handleWindowBlur);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("contextmenu", handleContextMenu);
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("resize", debounce(handleResize, 200));

  handleResize();
}

export { initKeyboardModule, handleResize };
