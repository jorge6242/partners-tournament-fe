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
import { Chip, Grid, Button } from "@material-ui/core";
import CustomSelect from "../../components/FormElements/CustomSelect";
import { useForm } from "react-hook-form";
import CustomTextField from "../../components/FormElements/CustomTextField";

const useStyles = makeStyles(theme => ({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: '18px',
  },
  searchContainer: {
    paddingBottom: '2%'
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
}));

type FormData = {
  booking_type: number;
  description: string;
};

export default function Tournament() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector((state: any) => state.tournamentReducer);

  const { handleSubmit, register, errors, reset, setValue, getValues } = useForm<FormData>();

  useEffect(() => {
    async function fetchData() {
      dispatch(getAll());
    }
    fetchData();
  }, [dispatch]);

  const renderDate = (id: any) => {
    const row = list.find((e: any) => e.id === id);
    if (row) {
      return <div>{moment(row.date_from).format("YYYY-MM-DD hh:mm:ss A")} <br /> {moment(row.date_to).format("YYYY-MM-DD hh:mm:ss A")} </div>
    }
    return '';
  }

  const renderRegisterDate = (id: any) => {
    const row = list.find((e: any) => e.id === id);
    if (row) {
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
      align: "left",
      component: (value: any) => <span>{value.value && value.value.description}</span>
    },
    {
      id: "description",
      label: "Description",
      minWidth: 10,
      align: "left",
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "id",
      label: "Fecha",
      minWidth: 10,
      align: "left",
      component: (value: any) => <span>{renderDate(value.value)}</span>
    },
    {
      id: "id",
      label: "Registro",
      minWidth: 10,
      align: "left",
      component: (value: any) => <span>{renderRegisterDate(value.value)}</span>
    },
    {
      id: "participant_type",
      label: "Tipo",
      minWidth: 10,
      align: "left",
      component: (value: any) => {
        let participant = "";
        if (value.value === "1") participant = "Socios/Familiares";
        if (value.value === "2") participant = "Invitados";
        if (value.value === "3") participant = "Ambos";
        return <span>{participant}</span>
      }
    },
    {
      id: "currency",
      label: "Moneda",
      minWidth: 10,
      align: "left",
      component: (value: any) => <span>{value.value && value.value.description}</span>
    },
    {
      id: "amount",
      label: "Monto",
      minWidth: 10,
      align: "left",
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "status",
      label: "Status",
      minWidth: 10,
      align: "left",
      component: (value: any) => <span>{value.value === "1" ? 'Activo' : 'Inactivo'}</span>
    },
    {
      id: "booking_type",
      label: "Modalidad",
      minWidth: 10,
      align: "left",
      component: (value: any) => {
        let status = '';
        let backgroundColor = '';
        if (value.value === "1") {
          status = "Evento";
          backgroundColor = '#2ecc71';
        }
        if (value.value === "2") {
          status = "Sorteo";
          backgroundColor = '#2980b9';
        }
        return (
          <Chip
            label={status}
            style={{
              backgroundColor,
              color: "white",
              fontWeight: "bold",
              fontSize: "10px"
            }}
            size="small"
          />
        )
      }
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

  const handleSearch = () => {
    const form = getValues();
      dispatch(search(form));
  }

  const handleChangePage = (newPage: number) => {
    const page = pagination.currentPage === 1 ? 2 : newPage;
    dispatch(getAll(page, pagination.perPage))
  };

  const handlePerPage = (page: number, perPage: number) => {
    dispatch(getAll(page, perPage))
  }

  const handleForm = () => { }

  return (
    <Grid container spacing={3}>
      <form
        className={classes.form}
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        <Grid item xs={12}>
          <Grid container spacing={3} >
            <Grid item xs={6} className={classes.headerTitle} >Eventos</Grid>
            <Grid item xs={6} onClick={() => handleCreate()} style={{ textAlign: 'right' }} >
              <Fab size="small" color="primary" aria-label="add">
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <CustomSelect
                label="Modalidad"
                selectionMessage="Seleccione"
                field="booking_type"
                register={register}
                errorsMessageField={
                  errors.booking_type && errors.booking_type.message
                }
              >
                <option value={1}> Evento </option>
                <option value={2}> Sorteo </option>
              </CustomSelect>
            </Grid>
            <Grid item xs={4}>
              <CustomTextField
                placeholder="Description"
                field="description"
                register={register}
                errorsField={errors.description}
                errorsMessageField={
                  errors.description && errors.description.message
                }
              />
            </Grid>
            <Grid item xs={4} style={{ paddingTop: '3%' }}>
              <Button
                type="button"
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleSearch()}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ marginTop: 20 }}>
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
        </Grid>
      </form>

    </Grid>
  );
}
