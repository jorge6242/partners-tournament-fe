import React, { useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, withStyles } from "@material-ui/core/styles";

import { getAll, remove, search } from "../../actions/tournamentActions";
import { updateModal } from "../../actions/modalActions";
import TournamentForm from "../../components/TournamentForm";
import DataTable4 from '../../components/DataTable4'
import Columns from '../../interfaces/TournamentColumns';
import CustomSearch from '../../components/FormElements/CustomSearch';
import moment from "moment";
import Parse from 'react-html-parser';

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

export default function Tournament() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector((state: any) => state.tournamentReducer);
  useEffect(() => {
    async function fetchData() {
      dispatch(getAll());
    }
    fetchData();
  }, [dispatch]);

  const renderDate = (id: any) => {
    const row = list.find((e: any) => e.id === id);
    if(row){
    return <div>{moment(row.date_from).format("YYYY-MM-DD hh:mm:ss A")} <br /> {moment(row.date_to).format("YYYY-MM-DD hh:mm:ss A")} </div>
    }
    return '';
  }

  const renderRegisterDate = (id: any) => {
    const row = list.find((e: any) => e.id === id);
    if(row){
      return <div>{moment(row.date_register_from).format("YYYY-MM-DD hh:mm:ss A")} <br /> {moment(row.date_register_to).format("YYYY-MM-DD hh:mm:ss A")} </div>
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
      label: "Fecha",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{renderDate(value.value)}</span>
    },
    {
      id: "id",
      label: "Registro",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{renderRegisterDate(value.value)}</span>
    },
    {
      id: "participant_type",
      label: "Tipo",
      minWidth: 10,
      align: "right",
      component: (value: any) => {
        let participant = "";
        if(value.value === "1") participant = "Socios/Familiares";
        if(value.value === "2") participant = "Invitados";
        if(value.value === "3") participant = "Ambos";
        return <span>{participant}</span>
      }
    },
    {
      id: "currency",
      label: "Moneda",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.description}</span>
    },
    {
      id: "amount",
      label: "Monto",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "status",
      label: "Status",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value === "1" ? 'Activo' : 'Inactivo'}</span>
    },
  ];

  const handleEdit = (id: number) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <TournamentForm id={id} />,
          customSize: 'medium'
        }
      })
    );
  };

  const handleCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <TournamentForm />,
          customSize: 'medium'
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
        <div className={classes.headerTitle}>Eventos</div>
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
