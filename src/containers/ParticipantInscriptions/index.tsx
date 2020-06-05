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

import { getInscriptionsByParticipant as getAll, updateParticipant, updateParticipantPayment } from "../../actions/tournamentActions";
import { updateModal } from "../../actions/modalActions";
import DataTable4 from '../../components/DataTable4'
import Columns from '../../interfaces/InscriptionColumns';
import TournamentUserCommentForm from '../../components/TournamentUserCommentForm';
import { Grid } from "@material-ui/core";
import moment from "moment";
import { useHistory } from "react-router-dom";
import logo from './paypal-paid.jpeg';
import Paypal from "../../components/common/Paypal";

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

  const handleOrder = (order: string, id: string) => {
    const data = {
      id,
      canal_pago: 'paypal',
      nro_comprobante: order,
      status: 1
    }
    dispatch(updateParticipantPayment(data))
  }

  const handlePayment = (row: any) => {
    const clientIdTest = 'Ab8frqGsF4rlmjIH9mS9kTdaGo2-vLh-v0PK5G1ZxeKBSTbAkygWF3eRCPYydHRtQBGlRJyLPDY4v5Aw';
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <Paypal
            description={row.tournament.description}
            customId={`${row.tournament.id}-${row.user.doc_id}`}
            amountDetail={row.tournament.amount}
            amount={row.tournament.amount}
            client={clientIdTest}
            handleOrder={(order: string) => handleOrder(order, row.id)}
          />,
        }
      })
    );
  }

  const renderPaypal = (id: any) => {
    const inscription = list.find((e: any) => e.id == id);
    console.log('inscription.tournament.paypal_id ', inscription.tournament.paypal_id);
    if(inscription.tournament.paypal_id === null || inscription.tournament.paypal_id === '' ) {
      return <div></div>
    }
    if (inscription && inscription.nro_comprobante === null && inscription.tournament && inscription.tournament.booking_type === "1" && inscription.tournament.amount > 0 && inscription.status === "0") {
      return <div onClick={() => handlePayment(inscription)}><img src={logo} alt="example image" style={{ cursor: 'pointer' }} width="35" height="25" /></div>
    }
    if (inscription && inscription.nro_comprobante === null && inscription.tournament && inscription.tournament.booking_type === "2" && inscription.tournament.amount > 0 && inscription.status === "2") {
      return <div onClick={() => handlePayment(inscription)}><img src={logo} alt="example image" style={{ cursor: 'pointer' }} width="35" height="25" /></div>
    }
    return <div></div>

  }

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
      component: (value: any) => <span>{value.value && moment(value.value).format('YYYY-MM-DD')} <br /> {moment(value.value).format('hh:mm:ss A')}</span>
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
      label: "Evento",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.description}</span>
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
      id: "tournament",
      label: "Modalidad",
      minWidth: 10,
      align: "left",
      component: (value: any) => {
        let status = '';
        let backgroundColor = '';
        if (value.value.booking_type === "1") {
          status = "Evento";
          backgroundColor = '#2ecc71';
        }
        if (value.value.booking_type === "2") {
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
    {
      id: "status",
      label: "Status",
      minWidth: 10,
      align: "center",
      component: (value: any) => {
        let status = '';
        let backgroundColor = '';
        if (value.value === "0") {
          status = "Pendiente";
          backgroundColor = '#2980b9';
        }
        if (value.value === "1") {
          status = "Aceptado";
          backgroundColor = '#2ecc71';
        }
        if (value.value === "2") {
          status = "Ganador";
          backgroundColor = '#2ecc71';
        }
        if (value.value === "-1") {
          status = "Rechazado";
          backgroundColor = '#e74c3c';
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
    {
      id: "id",
      label: "",
      minWidth: 10,
      align: "right",
      component: (value: any) => renderPaypal(value.value),
    },
  ];

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
      <Grid item xs={12} sm={12} md={12} style={{ marginBottom: 20 }}>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={6} md={6} style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left' }} >Mis Eventos</Grid>
          <Grid item xs={6} sm={6} md={6} style={{ textAlign: 'right' }} onClick={() => handleInscription()} >
            <Fab size="small" color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
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
