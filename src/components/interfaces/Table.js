import classes from "./Table.module.css";
import { cloneElement } from "react";

/*
  <Table>

  Properties:
    headers: [...] a list of strings for displaying the different headers of the table
    content: [{}, ...] a list of objects for displaying each row of the table, exceptions are given by the formatter function
    entryActionGenerator: a function used to generate any component with the id of each entry
    formatter: a function pointer used to make exceptions during the printing of the table cells
 */

const defaultContent = {
  header: ["Header"],
  data: [{ id: 0, message: "No content is passed into the table." }],
  formatter: (key, value) => {
    return <td className={classes.row_data} key={key}> {value} </td>
  }
}

function Table({
                 title,
                 content = defaultContent,
                 entryActionGenerator,
                 tableAction
               }) {
  return (
    <div className={classes.table_wrapper}>{
      title ? <header className={classes.title}>
        {title}
      </header> : null
    }
      <table className={classes.table}>
        <tbody className={classes.table_body} key="table_body">
        {content.headers.length ?
          <tr className={classes.header} key="table_header">
            {content.headers.map((key) => (
              <th className={classes.header_data} key={key}>
                {key}
              </th>
            ))}
            {entryActionGenerator ?
              <th key="header_action" className={classes.header_action}
              /> : null
            }
          </tr> : null
        }
        {content.data.map((entry) => (
          <tr className={classes.row} key={entry.id}>
            {Object.entries(entry).map(([key, value]) =>
              content.formatter(key, value))
            }
            {entryActionGenerator ?
              <td key="entry_action" className={classes.row_action}>
                {entryActionGenerator(entry.id)}
              </td> : null
            }
          </tr>))}
        </tbody>
      </table>
      <div className={classes.table_action}>
        {tableAction}
      </div>
    </div>
  )
}

export default Table;