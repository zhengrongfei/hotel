import { scroller } from "react-scroll";
import { ID, NAME } from "../constants/identifiers";

export function debounce(func, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(_ => {
      timer = null;
      func.apply(this, args);
    }, ms);
  };
}

export function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export function scrollToElement(name, id, vertical = true, duration = 300) {
  scroller.scrollTo(name, {
    duration: duration,
    smooth: true,
    containerId: id,
    horizontal: !vertical
  });
}

const pow = Math.pow;
// easing function that makes the scroll decelerate over time
const easeOutQuart = (x) => 1 - pow(1 - x, 4);

// animate function
function animateScroll({ targetPosition, initialPosition, duration }) {
  let start;
  let position;
  let animationFrame;

  const requestAnimationFrame = window.requestAnimationFrame;
  const cancelAnimationFrame = window.cancelAnimationFrame;

  // maximum amount of pixels we can scroll
  const maxAvailableScroll =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const amountOfPixelsToScroll = initialPosition - targetPosition;

  function step(timestamp) {
    if (start === undefined) start = timestamp;
    const elapsed = timestamp - start;
    // this just gives us a number between 0 (start) and 1 (end)
    const relativeProgress = elapsed / duration;
    // ease out that number
    const easedProgress = easeOutQuart(relativeProgress);
    // calculate new position for every thick of the requesAnimationFrame
    position = initialPosition - amountOfPixelsToScroll * Math.min(easedProgress, 1);
    // set the scrollbar position
    window.scrollTo(0, position);
    // Stop when max scroll is reached
    if (
      initialPosition !== maxAvailableScroll &&
      window.scrollY === maxAvailableScroll
    ) {
      cancelAnimationFrame(animationFrame);
      return;
    }
    // repeat until the end is reached
    if (elapsed < duration) animationFrame = requestAnimationFrame(step);
  }

  animationFrame = requestAnimationFrame(step);
}

const getElementPosition = (element) => element.offsetTop;

// export const scrollTo = ({ id, ref = null, duration = 3000 }) => {
//   // the position of the scroll bar before the user clicks the button
//   const initialPosition = window.scrollY;
//
//   // decide what type of reference that is
//   // if neither ref nor id is provided, set element to null
//   const element = ref ? ref.current : id ? document.getElementById(id) : null;
//
//   if (!element) {
//     // log error if the reference passed is invalid
//     console.error("Invalid element, are you sure you've provided element id or react ref?");
//     return;
//   }
//   animateScroll({
//     targetPosition: element.offsetTop,
//     initialPosition,
//     duration
//   });
// };