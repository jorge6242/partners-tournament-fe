import React, { FunctionComponent, createElement, useState } from "react";
import { makeStyles, withStyles,   Theme, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import { TablePagination } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from "@material-ui/icons/Delete";
import Switch from "@material-ui/core/Switch";
import { green } from "@material-ui/core/colors";

const GreenSwitch = withStyles({
  switchBase: {
    color: '#e74c3c',
    "&$checked": {
      color: '#27ae60'
    },
    "&$checked + $track": {
      backgroundColor: green[500]
    }
  },
  checked: {},
  track: {}
})(Switch);

const useStyles = makeStyles( (theme: Theme) => createStyles(
  {
    root: {
      overflowX: "auto",
      [theme.breakpoints.down('xs')]: {
        minWidth: window.innerWidth - 20,
        width: window.innerWidth  - 20,
      },
    },
    container: {
      maxHeight: 440
    },
    progress: {
      display: "flex",
      justifyContent: "left",
      padding: 10
    },
    tableCellHeader: {
      '&:first-child': {
        paddingLeft: 10
      },
      '&:last-child': {
        paddingRight: 10
      }
    },
  }
));

interface DataTableProps {
  rows: any;
  pagination?: any;
  columns: any;
  isDelete?: boolean;
  handleEdit?: Function;
  handleView?: Function;
  handleDelete?: any;
  loading?: boolean;
  onChangePage?: any;
  onChangePerPage?: any;
  fontSize?: string;
  handleSubRowComponent?: Function;
  renderSubRow?: any;
  aditionalColumn?: string;
  aditionalColumnLabel?: string;
  handleSwitch?: Function;
  isInscription?: boolean;
}

const DataTable4: FunctionComponent<DataTableProps> = ({
  rows = [],
  pagination,
  columns,
  isDelete = true,
  handleEdit,
  handleView,
  handleDelete,
  loading,
  onChangePage,
  onChangePerPage,
  handleSubRowComponent,
  renderSubRow,
  fontSize = '12px',
  aditionalColumn,
  aditionalColumnLabel,
  handleSwitch,
  isInscription = false,
}) => {
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState(0);
  const handlePage = (event: unknown, newPage: number) => {
    const page = pagination.currentPage === 1 ? 2 : newPage;
    onChangePage(page);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChangePerPage(pagination.currentPage, event.target.value);
  };

  const handleSelect = (id: number) => {
    if (id === selectedRow) {
      setSelectedRow(0);
    } else {
      setSelectedRow(id);
    }
  }

  const handleConditionSwitch = (row: any) => {
    if(row.status === "0") return false;
    if(row.status === "1") return true;
    if(row.status === "-1") return false;
  }

  const renderLabelColors = (row: any) => {
    if(isInscription) {
      if(row.status === "0") return 'blue';
      if(row.status === "-1") return '#27ae60';
    }
    return '#27ae60';
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small" style={{ minWidth: "340px" }}>
          <TableHead>
            <TableRow>
              {columns.map((column: any) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  className={classes.tableCellHeader}
                  style={{
                    minWidth: column.minWidth, fontSize
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {handleView && <TableCell style={{ minWidth: 5 }}></TableCell>}
              {handleEdit && <TableCell style={{ minWidth: 5 }}></TableCell>}
              {handleDelete && <TableCell style={{ minWidth: 5 }}></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow className={classes.progress}>
                <TableCell colSpan={columns.length}><CircularProgress color="primary" /></TableCell>
              </TableRow>
            ) : (
                rows.map((row: any) => {
                  return (
                    <React.Fragment>
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1} key={row.id}
                        onClick={() => handleSelect(row.share_movements && row.share_movements.length ? row.id : 0)}
                      >
                        {columns.map((column: any) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              className={classes.tableCellHeader}
                              style={{ fontSize, minWidth: column.minWidth }}
                              onClick={() => handleSubRowComponent ? handleSubRowComponent() : {}}
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : createElement(column.component, { value })}
                            </TableCell>
                          );
                        })}
                        {handleSwitch && (
                          <TableCell style={{ minWidth: 5, fontSize }}>
                            <GreenSwitch
                              checked={handleConditionSwitch(row)}
                              onChange={() => handleSwitch(row.id, row.status)}
                            />
                          </TableCell>
                        )}
                        <TableCell align="right" style={{ minWidth: 5 }}>
                          {handleView && (
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="primary"
                              onClick={() => handleView(row.id)}
                            >
                              <VisibilityIcon fontSize="inherit" />
                            </IconButton>
                          )}
                          {handleEdit && (
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(row.id)}
                            >
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                          )}
                          {handleDelete && (
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="secondary"
                              onClick={() => handleDelete(row.id)}
                            >
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                      {row.share_movements && row.share_movements.length > 0 && renderSubRow && selectedRow === row.id &&
                        <TableRow><TableCell colSpan={10}>{renderSubRow(row.share_movements)}</TableCell></TableRow>
                      }
                    </React.Fragment>
                  );
                })
              )}
            {aditionalColumn && (
              <TableRow>
                <TableCell
                  className={classes.tableCellHeader}
                  align="right"
                  style={{
                    minWidth: fontSize
                  }}
                  colSpan={columns.length}
                >
                  {aditionalColumnLabel}: {aditionalColumn}
                </TableCell>
              </TableRow>
            )
            }
          </TableBody>
        </Table>
      </TableContainer>
      {
        pagination && (
          <TablePagination
            labelRowsPerPage="Filas"
            rowsPerPageOptions={[5, 10, 20, 30, 40]}
            component="div"
            count={pagination.total}
            rowsPerPage={pagination.perPage}
            page={pagination.prevPageUrl === null ? 0 : pagination.currentPage}
            onChangePage={handlePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )
      }
    </Paper>
  );
};

export default DataTable4;
