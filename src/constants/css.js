export const COLORS = {
  WHITE: getComputedStyle(document.documentElement).getPropertyValue(
    "--white"),
  WHITE_PURE: getComputedStyle(document.documentElement).getPropertyValue(
    "--white-pure"),

  GRAY_LIGHT: getComputedStyle(document.documentElement).getPropertyValue(
    "--gray-light"),
  GRAY_MEDIUM: getComputedStyle(document.documentElement).getPropertyValue(
    "--gray-medium"),
  GRAY_DARK: getComputedStyle(document.documentElement).getPropertyValue(
    "--gray-dark"),

  BLACK: getComputedStyle(document.documentElement).getPropertyValue(
    "--black"),
  BLACK_PURE: getComputedStyle(document.documentElement).getPropertyValue(
    "--black-pure"),

  RED_DARK: getComputedStyle(document.documentElement).getPropertyValue(
    "--red-dark"),
  RED_LIGHT: getComputedStyle(document.documentElement).getPropertyValue(
    "--red-light"),

  YELLOW_DARK: getComputedStyle(document.documentElement).getPropertyValue(
    "--yellow-dark"),

  GREEN_DARK: getComputedStyle(document.documentElement).getPropertyValue(
    "--green-dark")
}

export const SHADOWS = {
  MENU: getComputedStyle(document.documentElement).getPropertyValue(
    "--shadow-menu"),
  NONE: getComputedStyle(document.documentElement).getPropertyValue(
    "--shadow-none")
}

export const SCALE = {
  DEFAULT: 1,
  EXPAND: 1.01
}

export const LAYERS = {
  BASIC: 1,
  OVERLAY: 2,
  MENU_AND_BUTTON: 2,
  BUTTON_IN_MENU: 3,
  BUTTON_OVER_MENU: 6,
  SEARCHBAR: 6,
  NAVBAR: 7,
  BACKDROP: 11
}

export const LENGTHS = {
  UNIT_LENGTH: parseInt(getComputedStyle(document.documentElement).getPropertyValue(
    "--unit-length").match(/\d+/)[0]),
  PARTITION_M: parseInt(getComputedStyle(document.documentElement).getPropertyValue(
    "--partition-m").match(/\d+/)[0]),
  TEXT_MARGIN: "var(--margin-text)",
  GAP_ICON: "var(--gap-icon)",
  TRACK_SIZE: 4
}

export const ALIGNMENT = {
  LEFT: "start",
  CENTER: "center"
}

export const LISTENER = {
  RESIZE: "resize",
  SCROLL: "scroll",
  CLICK: "click",
  MOUSE_UP: "mouseup",
  MOUSE_LEAVE: "mouseleave",
  MOUSE_MOVE: "mousemove"
}

export const DIRECTION = {
  RTL: "rtl"
}

export const EASE = {
  NORMAL: [0.8, 0, 0.5, 1],
  LINEAR: "linear",
  EASE_OUT: [0.5, 0.5, 0.5, 1]
}

export const DURATION = {
  NORMAL: 0.25,
  SLOW: 0.5,
  FAST: 0.15
}