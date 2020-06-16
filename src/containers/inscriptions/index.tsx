import React, { useEffect, useState } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import MessageIcon from '@material-ui/icons/Message';
import FeedbackIcon from '@material-ui/icons/Feedback';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Chip from "@material-ui/core/Chip";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

import { getList as getTCategoryList } from '../../actions/tCategoryActions';
import { getInscriptions as getAll, remove, search, updateParticipant, getList as getTournamentList, getByCategory } from "../../actions/tournamentActions";
import { updateModal } from "../../actions/modalActions";
import LockerForm from "../../components/LockerForm";
import DataTable4 from '../../components/DataTable4'
import Columns from '../../interfaces/InscriptionColumns';
import CustomSearch from '../../components/FormElements/CustomSearch';
import TournamentUserCommentForm from '../../components/TournamentUserCommentForm';
import { Grid } from "@material-ui/core";
import snackBarUpdate from "../../actions/snackBarActions";
import logo from './paypal-paid.jpeg';
import moment from "moment";
import MultipleSwitch from "../../components/common/MultipleSwitch";

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
  select: {
    padding: "28px 0px 10px 0px",
    width: " 100%",
    backgroundColor: "transparent",
    border: 0,
    borderBottom: "1px solid grey",
    fontSize: "16px",
    "&:focus": {
      outline: 0
    }
  },
}));

export default function Inscriptions() {
  const [selectedCategory, setSelectedCategory] = useState<any>(0);
  const [selectedTournament, setSelectedTournament] = useState<any>(0);
  const [selectedStatus, setSelectedStatus] = useState<any>("");
  const [selectedSearch, setSelectedSearch] = useState<any>("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    tournamentReducer: {
      inscriptions: list,
      getInscriptionsLoading: loading,
      pagination,
      listData: tournamentList,
      tournamentsByCategory
    },
    tCategoryReducer: { listData: tCategoryList },
  } = useSelector((state: any) => state);

  const getStatusComment = (row: any) => {
    const value = list.find((e: any) => e.id == row);
    return value.comments;
  }

  const getStatusUserNote = (row: any) => {
    const value = list.find((e: any) => e.id == row);
    return value.user_notes;
  }

  const handleComment = (row: any) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <TournamentUserCommentForm id={row} />
        }
      })
    );
  }

  const renderPaypalDetails = (row: any) => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ fontWeight: 'bold' }} >Detalles de Pago Paypal</Grid>
        <Grid item xs={12}>Nro de Comprobante: {row.nro_comprobante} </Grid>
        <Grid item xs={12}>Fecha de Pago: {moment(row.fec_pago).format('YYYY-MM-DD hh:mm:ss A')} </Grid>
      </Grid>
    )
  }

  const handlePaypal = (row: any) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: renderPaypalDetails(row)
        }
      })
    );
  }

  const renderPaypal = (id: any) => {
    const inscription = list.find((e: any) => e.id == id);
    if (inscription && inscription.nro_comprobante !== null && inscription.fec_pago !== null && inscription.canal_pago === "paypal") {
      return <div onClick={() => handlePaypal(inscription)}><img src={logo} alt="example image" style={{ cursor: 'pointer' }} width="35" height="25" /></div>
    }
    return <div></div>

  }

  const renderInscriptionStatus = (id: any) => {
    const inscription = list.find((e: any) => e.id == id);
    if (inscription) {
      return inscription;
    }
    return <div></div>
  }

  const handleSwitchStatus = async (currentStatus: string, row: any) => {
    const { currentPage, perPage } = pagination;
    let status = '';
    if (currentStatus !== '2') {
      status = currentStatus;
      const data = {
        id: row.id,
        status
      };
      const query = {
        category: selectedCategory,
        tournament: selectedTournament,
        term: selectedSearch,
        status: selectedStatus
      }
      await dispatch(updateParticipant(data, false, {currentPage, perPage, query}));
    }
  };

  const columns: Columns[] = [
    {
      id: "id",
      label: "Id",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "user",
      label: "Rif/CI",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.doc_id}</span>
    },
    {
      id: "user",
      label: "Nombre",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.name}</span>
    },
    {
      id: "user",
      label: "Apellido",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.last_name}</span>
    },
    {
      id: "user",
      label: "Correo",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.email}</span>
    },
    {
      id: "user",
      label: "Telefono",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.phone_number}</span>
    },
    {
      id: "payment",
      label: "Forma de Pago",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.description}</span>
    },
    {
      id: "tournament",
      label: "Monto",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value && value.value.amount}</span>
    },
    {
      id: "attach_file",
      label: "Comprobante",
      minWidth: 1,
      align: "center",
      component: (value: any) => {
        if(value.value) {
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
        return  <div />
      }
    },
    {
      id: "id",
      label: "Comentario",
      minWidth: 10,
      align: "center",
      component: (value: any) => {
        const comment = getStatusComment(value.value);
        const userNotes = getStatusUserNote(value.value);
        return (
          <IconButton
            aria-label="file"
            size="small"
            color="primary"
            onClick={() => handleComment(value.value)}
          >
            <FeedbackIcon style={{ color: userNotes ? '#2980b9' : '#2c3e50' }} fontSize="inherit" />
            <MessageIcon style={{ color: comment ? '#2980b9' : '#2c3e50' }} fontSize="inherit" />
          </IconButton>
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
      id: "id",
      label: "Paypal",
      minWidth: 10,
      align: "right",
      component: (value: any) => renderPaypal(value.value),
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
      component: (value: any) => {
        const inscription = renderInscriptionStatus(value.value);
        const pattern = [
          { status: "1", color: "#2ecc71", toolTip: 'Aceptado'  },
          { status: "0", color: "#2980b9", toolTip: 'Pendiente'  },
          { status: "-1", color: "#e74c3c", toolTip: 'Rechazado'  },
        ]
        return <MultipleSwitch pattern={pattern} selected={inscription} handleClick={handleSwitchStatus} />
      },
    },
  ];

  useEffect(() => {
    async function fetchData() {
      dispatch(getTCategoryList());
      dispatch(getTournamentList());
      // dispatch(getAll());
    }
    fetchData();
  }, [dispatch]);

  const handleChangePage = (newPage: number) => {
    const page = pagination.currentPage === 1 ? 2 : newPage;
    dispatch(getAll(page, pagination.perPage))
  };

  const handlePerPage = (page: number, perPage: number) => {
    dispatch(getAll(page, perPage));
  }

  const handleCategory = (event: any) => {
    setSelectedCategory(0);
    setSelectedTournament(0);
    dispatch(getByCategory(event.target.value))
    setSelectedCategory(event.target.value);
  }

  const handleTournament = (event: any) => {
    setSelectedTournament(event.target.value);
  }

  const handleStatus = (event: any) => {
    setSelectedStatus(event.target.value);
  }

  const handleSearch = () => {
    const { currentPage, perPage } = pagination;
    const query = {
      category: selectedCategory,
      tournament: selectedTournament,
      term: selectedSearch,
      status: selectedStatus
    }
    if (selectedCategory > 0 && selectedTournament > 0) {
      dispatch(getAll(currentPage, perPage, query));
    } else {
      dispatch(snackBarUpdate({
        payload: {
          message: 'Seleccionar Categoria y Evento',
          status: true,
          type: "error"
        }
      }))
    }

  }

  const setInputSearch = (e: any) => setSelectedSearch(e.target.value);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>Inscripciones de Eventos</Grid>
      <Grid item xs={2}>
        <TextField
          margin="dense"
          name="term"
          label="Buscar"
          type="term"
          id="term"
          size="small"
          onChange={setInputSearch}
        />
      </Grid>
      <Grid item xs={2}>
        <div>
          <select
            className={classes.select}
            name="status"
            onChange={handleStatus}
            style={{ fontSize: "13px" }}
          >
            <option value="">Selecione Status</option>
            <option value={0}>Pendiente</option>
            <option value={1}>Aceptado</option>
            <option value={-1}>Rezhazado</option>
          </select>
        </div>
      </Grid>
      <Grid item xs={2}>
        <div>
          <select
            className={classes.select}
            name="relation"
            onChange={handleCategory}
            style={{ fontSize: "13px" }}
          >
            <option value={0}>Seleccione Categoria</option>
            {tCategoryList.map((item: any, i: number) => (
              <option value={item.id}>{item.description}</option>
            ))}
          </select>
        </div>
      </Grid>
      {
        tournamentsByCategory.length > 0 && (
          <Grid item xs={2}>
            <div>
              <select
                className={classes.select}
                name="relation"
                onChange={handleTournament}
                style={{ fontSize: "13px" }}
              >
                <option value={0}>Seleccione Evento</option>
                {tournamentsByCategory.map((item: any, i: number) => (
                  <option value={item.id}>{item.description}</option>
                ))}
              </select>
            </div>
          </Grid>
        )
      }
      <Grid item xs={3} style={{ marginTop: 20 }}>
        <Button
          size="small"
          color="primary"
          variant="contained"
          className={classes.margin}
          disabled={loading}
          onClick={() => handleSearch()}
        >
          Buscar
        </Button>
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
