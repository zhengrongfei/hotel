import React, { useEffect, useRef, useState } from "react";
import { Element } from "react-scroll";
import { motion } from "framer-motion";
import classes from "./ScrollBox.module.css";

import { EASE, DURATION, LAYERS, LENGTHS, LISTENER } from "../../constants/css";
import classNames from "classnames";

const MIN_THUMB_SIZE = 20; // 20px minimum

function ScrollBox({
                     vertical = true,       // vertical scrollbar
                     enableInteract = true, // enable drag and click
                     length,                        // the changing height or width of the scrollbox
                     className,                     // styling the scrollbox
                     viewportClassName,             // styling the scrollbox's viewport
                     style,                         // styling the scrollbox
                     viewportStyle,                 // styling the scrollbox's viewport
                     id,                            // ID indicates react-scroll being used
                     layer = LAYERS.MENU_AND_BUTTON,
                     children
                   }) {
  //// references
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  //// styles
  const trackStyle = vertical ? { top: 0, width: 4 } : { left: 0, height: 4 }

  //// states
  const [viewport, setViewport] = useState(null);
  const [hide, setHide] = useState(false);
  const [initialScrollPosition, setInitialScrollPosition] = useState(0);
  const [initialScrollDistance, setInitialScrollDistance] = useState(0);
  const [thumbSize, setThumbSize] = useState(MIN_THUMB_SIZE);
  const [dragging, setDragging] = useState(false);

  //// helper functions
  const resizeThumb = (element) => {
    const currentThumbSize = Math.max(
      20,
      vertical
        ? (length || element.clientHeight) / (element.scrollHeight || 1) * (length || element.clientHeight)
        : (length || element.clientWidth) / (element.scrollWidth || 1) * (length || element.clientHeight)
    )
    // console.log(currentThumbSize, element.scrollHeight, element)
    setHide(currentThumbSize === (vertical
        ? trackRef.current.clientHeight
        : trackRef.current.clientWidth
    ))
    setThumbSize(currentThumbSize);
  }

  //// handlers
  function trackClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    if (vertical) viewport.scrollTo({
      behavior: "smooth",
      top: Math.floor((
          e.clientY - e.target.getBoundingClientRect().top -
          (thumbSize / 2)) // middle of the thumb
        / trackRef.current.clientHeight // ratio of click position compared to track
        * viewport.scrollHeight)
    });
    else viewport.scrollTo({
      left: Math.floor((
          e.clientX - e.target.getBoundingClientRect().left -
          (thumbSize / 2)) // middle of the thumb
        / trackRef.current.clientWidth // ratio of click position compared to track
        * viewport.scrollWidth),
      behavior: "smooth",
    });
  }
  function thumbGrabHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    if (vertical) {
      setInitialScrollPosition(e.clientY);
      setInitialScrollDistance(viewport.scrollTop);
    } else {
      setInitialScrollPosition(e.clientX);
      setInitialScrollDistance(viewport.scrollLeft);
    }
  }
  function thumbMoveHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    if (dragging)
      if (vertical) viewport.scrollTop = Math.min(
        viewport.scrollHeight - viewport.offsetHeight,
        (e.clientY - initialScrollPosition) * (viewport.offsetHeight / thumbSize) + initialScrollDistance
      );
      else viewport.scrollLeft = Math.min(
        viewport.scrollWidth - viewport.offsetWidth,
        (e.clientX - initialScrollPosition) * (viewport.offsetWidth / thumbSize) + initialScrollDistance
      );
  }
  function thumbReleaseHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }
  function scrollHandler(e) {
    if (e.target) {
      resizeThumb(e.target)
      if (vertical) thumbRef.current.style.top = `${
        Math.min(
          trackRef.current.clientHeight - thumbSize,
          (e.target.scrollTop / e.target.scrollHeight) * trackRef.current.clientHeight,
        )
      }px`;
      else thumbRef.current.style.left = `${
        Math.min(
          trackRef.current.clientWidth - thumbSize,
          (e.target.scrollLeft / e.target.scrollWidth) * trackRef.current.clientWidth,
        )
      }px`;
    }
  }

  //// effects
  useEffect(() => {
    if (!enableInteract) return;
    // listen for mouse events in the window
    window.addEventListener(LISTENER.MOUSE_MOVE, thumbMoveHandler);
    window.addEventListener(LISTENER.MOUSE_UP, thumbReleaseHandler);
    window.addEventListener(LISTENER.MOUSE_LEAVE, thumbReleaseHandler);
    return () => {
      window.removeEventListener(LISTENER.MOUSE_MOVE, thumbMoveHandler);
      window.removeEventListener(LISTENER.MOUSE_UP, thumbReleaseHandler);
      window.removeEventListener(LISTENER.MOUSE_LEAVE, thumbReleaseHandler);
    };
  }, [thumbReleaseHandler, thumbMoveHandler]);
  useEffect(() => {
    const viewportElement = id
      ? document.getElementById(id)
      : viewportRef.current;
    const contentElement = contentRef.current;
    if (trackRef.current && viewportElement) {
      setViewport(viewportElement);
      resizeThumb(viewportElement);
      const observer = new ResizeObserver(() => resizeThumb(viewportElement));
      observer.observe(viewportElement);
      observer.observe(contentElement);
      viewportElement.addEventListener(LISTENER.SCROLL, scrollHandler);
      return () => {
        observer.unobserve(viewportElement);
        observer.unobserve(contentElement);
        viewportElement.removeEventListener(LISTENER.SCROLL, scrollHandler);
      };
    }
  }, [length]);

  const child =
    <div ref={contentRef}
         style={{ overflow: "visible" }}
         className={viewportClassName}>{children}
    </div>;

  return (
    <div className={classNames(classes.container, className)} style={style}>
      {id
        ? <Element className={classNames(classes.content, viewportClassName)}
                   id={id}
                   style={viewportStyle}>
          {child}
        </Element>
        : <div className={classNames(classes.content, viewportClassName)}
               ref={viewportRef}
               style={viewportStyle}>
          {child}
        </div>
      }
      <motion.div className={classes.track}
                  ref={trackRef}
                  style={{
                    cursor: enableInteract && (dragging ? "grabbing" : "pointer"),
                    zIndex: layer,
                    ...trackStyle
                  }}
                  initial={false}
                  animate={vertical
                    ? { width: hide ? 0 : LENGTHS.TRACK_SIZE }
                    : { height: hide ? 0 : LENGTHS.TRACK_SIZE }
                  }
                  transition={{ duration: DURATION.NORMAL, ease: EASE.NORMAL }}
                  onClick={enableInteract ? trackClickHandler : null}>
        <motion.span className={classes.thumb}
                     ref={thumbRef}
                     initial={false}
                     animate={vertical
                       ? { height: thumbSize, width: LENGTHS.TRACK_SIZE }
                       : { height: LENGTHS.TRACK_SIZE, width: thumbSize }
                     }
                     transition={{ duration: DURATION.FAST, ease: "easeInOut" }}
                     style={{ cursor: enableInteract && (dragging ? "grabbing" : "grab") }}
                     onMouseDown={enableInteract ? thumbGrabHandler : null} />
      </motion.div>
    </div>
  );
}

export default ScrollBox