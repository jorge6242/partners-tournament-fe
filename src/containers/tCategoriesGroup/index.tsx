import React, { useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, withStyles } from "@material-ui/core/styles";

import { getAll, remove, search } from "../../actions/tCategoriesGroupActions";
import { updateModal } from "../../actions/modalActions";
import TCategoriesGroupForm from "../../components/TCategoriesGroupForm";
import DataTable4 from '../../components/DataTable4'
import Columns from '../../interfaces/tCategoriesGroupColumns';
import CustomSearch from '../../components/FormElements/CustomSearch';

const useStyles = makeStyles(() => ({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: '18px',
  },
  searchContainer: {
    paddingBottom: '2%'
  }
}));

export default function TCategoriesGroup() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector((state: any) => state.tCategoriesGroupReducer);
  useEffect(() => {
    async function fetchData() {
      dispatch(getAll());
    }
    fetchData();
  }, [dispatch]);

  const renderAge = (id: any) => {
    const row = list.find((e: any) => e.id === id);
    if(row){
      return `${row.age_from} - ${row.age_to}`;
    }
    return '';
  }

  const renderHandicap = (id: any) => {
    const row = list.find((e: any) => e.id === id);
    if(row){
      return `${row.golf_handicap_from} - ${row.golf_handicap_to}`;
    }
    return '';
  }


  const columns: Columns[] = [
    { 
      id: "id", 
      label: "Id", 
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "category",
      label: "Categoria",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.description}</span>
    },
    {
      id: "description",
      label: "Description",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "id",
      label: "Edad",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{renderAge(value.value)}</span>
    },
    {
      id: "id",
      label: "Handicap",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{renderHandicap(value.value)}</span>
    },
      {
      id: "gender",
      label: "Sexo",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.description}</span>
    },
  ];

  const handleEdit = (id: number) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <TCategoriesGroupForm id={id} />
        }
      })
    );
  };

  const handleCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <TCategoriesGroupForm />
        }
      })
    );
  }

  const handleDelete = (id: number) => {
    dispatch(remove(id));
  };

  const handleSearch = (event: any) => {
    if (event.value.trim() === '') {
      dispatch(getAll())
    } else {
      dispatch(search(event.value))
    }
  }

  const handleChangePage = (newPage: number) => {
    const page = pagination.currentPage === 1 ? 2 : newPage;
    dispatch(getAll(page, pagination.perPage))
  };

  const handlePerPage = (page: number, perPage: number) => {
    dispatch(getAll(page, perPage))
  }

  return (
    <div>
      <div className={classes.headerContainer}>
        <div className={classes.headerTitle}>Grupos</div>
        <div onClick={() => handleCreate()}>
          <Fab size="small" color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </div>
      </div>
      <div className={classes.searchContainer}>
        <CustomSearch handleSearch={handleSearch} />
      </div>
      <div>
        <DataTable4
          rows={list}
          pagination={pagination}
          columns={columns}
          handleEdit={handleEdit}
          isDelete
          handleDelete={handleDelete}
          loading={loading}
          onChangePage={handleChangePage}
          onChangePerPage={handlePerPage}
        />
      </div>
    </div>
  );
}
