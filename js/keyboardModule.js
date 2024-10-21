function getKeySelector(keyCode) {
  return `.key.${keyCode}`;
}

const updateElementClass = (selector, className, action) => {
  const element = document.querySelector(selector);
  if (element) {
    element.classList[action](className);
  } else {
    console.error(`Element with selector "${selector}" not found.`);
  }
};

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

function handleMouseEvent(e) {
  const mouseSelector = `.key.Mouse${e.button}`;

  if (e.type === "mousedown") {
    updateElementClass(mouseSelector, "active", "add");
    updateElementClass(mouseSelector, "secondary-highlight", "add");
  } else if (e.type === "mouseup") {
    updateElementClass(mouseSelector, "secondary-highlight", "remove");
  }
}

function handleWindowBlur() {
  const allKeys = document.querySelectorAll(".key");
  allKeys.forEach((key) => {
    key.classList.remove("secondary-highlight");
  });
}

function handleWheel(e) {
  const scrollSelector = e.deltaY > 0 ? ".scrollDown" : ".scrollUp";
  updateElementClass(scrollSelector, "active", "add");
  updateElementClass(scrollSelector, "secondary-highlight", "add");
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
      const newPercentage = Math.min(0.95, 0.95 * (windowWidth / myWidth));
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

export { initKeyboardModule, handleResize };
