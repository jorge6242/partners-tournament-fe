import React, { useEffect, useState } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Chip from "@material-ui/core/Chip";
import Button from '@material-ui/core/Button';

import { getInscriptionsByParticipant as getAll } from "../../actions/tournamentActions";
import { updateModal } from "../../actions/modalActions";
import DataTable4 from '../../components/DataTable4'
import Columns from '../../interfaces/InscriptionColumns';
import TournamentUserCommentForm from '../../components/TournamentUserCommentForm';
import { Grid } from "@material-ui/core";
import moment from "moment";
import { useHistory } from "react-router-dom";

const columns: Columns[] = [
  {
    id: "id",
    label: "Id",
    minWidth: 10,
    component: (value: any) => <span>{value.value}</span>
  },
  {
    id: "register_date",
    label: "Fecha/Hora Inscripcion",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span>{value.value && moment(value.value).format('YYYY-MM-DD hh:mm:ss A')}</span>
  },
  {
    id: "tournament",
    label: "Categoria",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span>{value.value && value.value.category.description}</span>
  },
  {
    id: "tournament",
    label: "Torneo",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span>{value.value && value.value.description}</span>
  },
  {
    id: "user",
    label: "Rif/CI",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span>{value.value.doc_id}</span>
  },
  {
    id: "user",
    label: "Nombre",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span>{value.value.name}</span>
  },
  {
    id: "user",
    label: "Correo",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span>{value.value.email}</span>
  },
  {
    id: "user",
    label: "Telefono",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span>{value.value.phone_number}</span>
  },
  {
    id: "payment",
    label: "Forma de Pago",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span>{value.value.description}</span>
  },
  {
    id: "attach_file",
    label: "Comprobante",
    minWidth: 10,
    align: "center",
    component: (value: any) => {
      return (
        <a target="_blank" href={value.value} title="comprobante" >
          <IconButton
            aria-label="file"
            size="small"
            color="primary"
          >
            <SearchIcon fontSize="inherit" />
          </IconButton>
        </a>
      )
    }
  },
  {
    id: "date_confirmed",
    label: "Confirmado",
    minWidth: 10,
    align: "center",
    component: (value: any) => {
      return (
        <IconButton
          aria-label="file"
          size="small"
          color={value.value ? 'primary' : 'secondary'}
        >
          <CheckBoxIcon fontSize="inherit" />
        </IconButton>
      )
    }
  },
  {
    id: "locator",
    label: "Localizador",
    minWidth: 10,
    align: "right",
    component: (value: any) => <span><strong>{value.value}</strong></span>
  },
  {
    id: "status",
    label: "Status",
    minWidth: 10,
    align: "center",
    component: (value: any) => (
      <Chip
        label={value.value === "1" ? "Verificado" : "Pendiente"}
        style={{
          backgroundColor: value.value === "1" ? "#2ecc71" : "#e74c3c",
          color: "white",
          fontWeight: "bold",
          fontSize: "10px"
        }}
        size="small"
      />
    )
  },
];

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
  },
  margin: {

  },
}));

export default function ParticipantInscriptions() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    tournamentReducer: {
      inscriptions: list,
      getInscriptionsLoading: loading,
      pagination,
    },
  } = useSelector((state: any) => state);

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  const handleChangePage = (newPage: number) => {
    const page = pagination.currentPage === 1 ? 2 : newPage;
    dispatch(getAll(page, pagination.perPage))
  };

  const handlePerPage = (page: number, perPage: number) => {
    dispatch(getAll(page, perPage));
  }

  const handleInscription = () => {
    history.push('/dashboard/tournament-new');
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={{ marginBottom: 20 }}>
        <Grid container spacing={1}>
          <Grid item xs={6} style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left' }} >Mis Torneos</Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }} onClick={() => handleInscription()} >
            <Fab size="small" color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <DataTable4
          rows={list}
          pagination={pagination}
          columns={columns}
          loading={loading}
          onChangePage={handleChangePage}
          onChangePerPage={handlePerPage}
        />
      </Grid>
    </Grid>
  );
}
