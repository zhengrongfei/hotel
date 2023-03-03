// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { render } from "react-dom";
// import Scroll, { Element, scroller } from "react-scroll";
//
// var Link = Scroll.Link;
// // var Element = Scroll.Element;
// var Events = Scroll.Events;
// var scroll = Scroll.animateScroll;
// var scrollSpy = Scroll.scrollSpy;
//
// // var scroller = Scroll.scroller;
//
//
// function Playground({
//                       children,
//                       className,
//                       ...props
//                     }) {
//   return (
//     // <div>
//     //   <nav className="navbar navbar-default navbar-fixed-top">
//     //     <div className="container-fluid">
//     //       <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
//     //         <ul className="nav navbar-nav">
//     //           <li><input onKeyDown={() => scroll.scrollMore(500)} />
//     //             <a onClick={() => scroll.scrollTo(100)}>Scroll To 100!</a>
//     //           </li>
//     //         </ul>
//     //       </div>
//     //     </div>
//     //   </nav>
//     //
//     //   <Element name="test1" className="element">
//     //     test 1
//     //   </Element>
//     //
//     //   <Element name="test2" className="element">
//     //     test 2
//     //   </Element>
//     //
//     //   <Element name="test3" className="element">
//     //     test 3
//     //   </Element>
//     //
//     //   <Element name="test4" className="element">
//     //     test 4
//     //   </Element>
//     //
//     //   <Element name="test5" className="element">
//     //     test 5
//     //   </Element>
//     //
//     //   <div id="anchor" className="element">
//     //     test 6 (anchor)
//     //   </div>
//     //
//     //   <Link activeClass="active" to="firstInsideContainer"
//     //         horizontal={true}
//     //         spy={true} smooth={true} duration={250}
//     //         containerId="containerElement" style={{ display: "inline-block", margin: "20px" }}>
//     //     Go to first element inside container
//     //   </Link>
//     //
//     //   <Link activeClass="active" to="secondInsideContainer"
//     //         horizontal={true}
//     //         spy={true} smooth={true} duration={250}
//     //         containerId="containerElement" style={{ display: "inline-block", margin: "20px" }}>
//     //     Go to second element inside container
//     //   </Link>
//     //
//     //   <button onClick={() => {
//     //     scroller.scrollTo("secondInsideContainer", {
//     //       duration: 1500,
//     //       smooth: true,
//     //       containerId: "containerElement",
//     //       horizontal: true
//     //     })
//     //   }}>
//     //     button
//     //   </button>
//     //
//     //   <div>
//     //     <Element name="test7"
//     //              className="element" id="containerElement" style={{
//     //       position: "relative",
//     //       width: "200px",
//     //       display: "flex",
//     //       overflowX: "auto",
//     //       marginBottom: "100px"
//     //     }}>
//     //       test 7 (duration and container)
//     //
//     //       <Element name="firstInsideContainer" style={{
//     //         marginRight: "200px",
//     //         whiteSpace: "nowrap"
//     //       }}>
//     //         first element inside container
//     //       </Element>
//     //
//     //       <Element name="secondInsideContainer" style={{
//     //         marginRight: "200px",
//     //         whiteSpace: "nowrap"
//     //       }}>
//     //         second element inside container
//     //       </Element>
//     //     </Element>
//     //   </div>
//     //
//     //
//     //   <Element id="same" className="element">
//     //     Two links point to this
//     //   </Element>
//     //
//     //   <a onClick={scroll.scrollToTop}>To the top!</a>
//     //
//     // </div>
//   );
// }
//
// export default Playground;

import React, { useEffect, useRef, useState } from "react";
import classes from "./playground.module.css";
import { LISTENER } from "../constants/css";
import classNames from "classnames";

const MIN_THUMB_SIZE = 20; // 20px minimum

const Playground = ({
                      children,
                      className,
                      vertical = true,
                      layer = 2
                    }) => {
  //// references
  const contentRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  //// states
  const [initialScrollPosition, setInitialScrollPosition] = useState();
  const [initialScrollDistance, setInitialScrollDistance] = useState(0);
  const [thumbSize, setThumbSize] = useState(MIN_THUMB_SIZE);
  const [dragging, setDragging] = useState(false);

  //// handlers
  function trackClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    const clickPosition = vertical
      ? e.clientY
      : e.clientX;
    const tractPosition = vertical
      ? e.target.getBoundingClientRect().top
      : e.target.getBoundingClientRect().left;
    const clickRatio = (
      clickPosition -
      tractPosition -
      (thumbSize / 2) // middle of the thumb
    ) / trackRef.current.clientHeight;
    contentRef.current.scrollTo({
      top: Math.floor(clickRatio * contentRef.current.scrollHeight),
      behavior: "smooth",
    });
  }

  function scrollHandler() {
    if (vertical)
      thumbRef.current.style.top = `${
        Math.min(
          trackRef.current.clientHeight - thumbSize,
          (contentRef.current.scrollTop / contentRef.current.scrollHeight) * trackRef.current.clientHeight,
        )
      }px`;
    else
      thumbRef.current.style.left = `${
        Math.min(
          trackRef.current.clientWidth - thumbSize,
          (contentRef.current.scrollLeft / contentRef.current.scrollWidth) * trackRef.current.clientWidth,
        )
      }px`;
  }

  function thumbGrabHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    if (vertical) {
      setInitialScrollPosition(e.clientY);
      setInitialScrollDistance(contentRef.current.scrollTop);
    } else {
      setInitialScrollPosition(e.clientX);
      setInitialScrollDistance(contentRef.current.scrollLeft);
    }
    setDragging(true);
  }

  function thumbReleaseHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    if (dragging) setDragging(false);
  }

  function thumbMoveHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    if (dragging) {
      const contentSize = vertical ? contentRef.current.offsetHeight : contentRef.current.offsetWidth;

      contentRef.current.scrollTop = Math.min(
        (vertical ? contentRef.current.scrollHeight : contentRef.current.scrollWidth) - contentSize,
        (e.clientY - initialScrollPosition) * (contentSize / thumbSize) + initialScrollDistance
      );
    }
  }

  //// effects
  useEffect(() => {
    // initial settings for the track and thumb
    if (contentRef.current && trackRef.current) {
      const content = contentRef.current;
      const observer = new ResizeObserver(
        () => setThumbSize(
          Math.max(
            20,
            content.clientHeight / content.scrollHeight * trackRef.current.clientHeight
          )));

      console.log(content);

      observer.observe(content);
      content.addEventListener(LISTENER.SCROLL, scrollHandler);
      return () => {
        observer.unobserve(content);
        content.removeEventListener(LISTENER.SCROLL, scrollHandler);
      };
    }
  }, []);
  useEffect(() => {
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

  return (
    <div className={classes.container}>
      {React.cloneElement(children, {
        ref: contentRef,
        className: classNames(classes.content, children.className)
      })}
      <div className={classes.track}
           ref={trackRef}
           onClick={trackClickHandler}
           style={{ cursor: dragging && "grabbing" }}>
        <div className={classes.thumb}
             ref={thumbRef}
             onMouseDown={thumbGrabHandler}
             style={{
               height: `${thumbSize}px`,
               cursor: dragging ? "grabbing" : "grab",
             }} />
      </div>
    </div>
  );
};

export default Playground;
