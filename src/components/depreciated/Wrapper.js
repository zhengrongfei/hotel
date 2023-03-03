import classes from "./Wrapper.module.css"

/*
  <Wrapper>

  Properties:
    width [value]: the width of the wrapper
    vertical [boolean]: whether children elements will be vertically aligned

  Usage: aligning all the inner elements

 */

function Wrapper({
                   children,
                   width = null,
                   vertical = false,
                 }) {
  return (
    <div className={classes.wrapper}
         style={{
           width: width,
           flexDirection: vertical ? "column" : "row"
         }}>
      {children}
    </div>
  )
}

export default Wrapper;