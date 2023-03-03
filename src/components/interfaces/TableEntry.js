import classes from "./TableEntry.module.css";


function TableEntry(props) {
  return (
    <tr className={classes.row}>
      {props.data.map((data) => (
        <td className={classes.data}>
          {data}
        </td>
      ))}
    </tr>
  )
}

export default Table;