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
import PrintIcon from "@material-ui/icons/Print";

import { getList as getTCategoryList } from '../../actions/tCategoryActions';
import { getInscriptionsReport as getAll, remove, search, updateParticipant, getList as getTournamentList, getByCategory, getInscripcionsReportPDF } from "../../actions/tournamentActions";
import { updateModal } from "../../actions/modalActions";
import LockerForm from "../../components/LockerForm";
import DataTable4 from '../../components/DataTable4'
import Columns from '../../interfaces/InscriptionColumns';
import CustomSearch from '../../components/FormElements/CustomSearch';
import TournamentUserCommentForm from '../../components/TournamentUserCommentForm';
import { Grid } from "@material-ui/core";
import moment from "moment";
import snackBarUpdate from "../../actions/snackBarActions";

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

export default function TournamentReport() {
  const [selectedCategory, setSelectedCategory] = useState<any>(0);
  const [selectedTournament, setSelectedTournament] = useState<any>(0);
  const [selectedStatus, setSelectedStatus] = useState<any>("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    tournamentReducer: {
      inscriptionsReport: list,
      getInscriptionsLoading: loading,
      pagination,
      tournamentsByCategory
    },
    tCategoryReducer: { listData: tCategoryList },
  } = useSelector((state: any) => state);

  const columns: Columns[] = [
    {
      id: "register_date",
      label: "Fecha",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{moment(value.value).format("DD-MM-YYYY h:mm:ss")}</span>
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
      label: "Apellido",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value.last_name}</span>
    },
    {
      id: "user",
      label: "Telefono",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value.phone_number}</span>
    },
    {
      id: "user",
      label: "Correo",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value.email}</span>
    },
    {
      id: "date_confirmed",
      label: "Confirmado",
      minWidth: 10,
      align: "center",
      component: (value: any) => <span>{value.value ? moment(value.value).format("DD-MM-YYYY h:mm:ss") : '-'}</span>
    },
    {
      id: "date_verified",
      label: "Verificado",
      minWidth: 10,
      align: "center",
      component: (value: any) => <span>{value.value ? moment(value.value).format("DD-MM-YYYY h:mm:ss") : '-'}</span>
    },
    {
      id: "locator",
      label: "Localizador",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span><strong>{value.value}</strong></span>
    },
    {
      id: "payment",
      label: "Forma de Pago",
      minWidth: 20,
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
      id: "nro_comprobante",
      label: "Paypal Recibo",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value}</span>
    },
    {
      id: "fec_pago",
      label: "Paypal Fecha",
      minWidth: 10,
      align: "right",
    component: (value: any) => <span>{moment(value.value).format("DD-MM-YYYY")} <br /> {moment(value.value).format("h:mm:ss A")}</span>
    },
    // {
    //   id: "id",
    //   label: "Comentario",
    //   minWidth: 10,
    //   align: "center",
    //   component: (value: any) => {
    //     const comment = getStatusComment(value.value);
    //     const userNotes = getStatusUserNote(value.value);
    //     return (
    //       <IconButton
    //         aria-label="file"
    //         size="small"
    //         color="primary"
    //         onClick={() => handleComment(value.value)}
    //       >
    //         <FeedbackIcon style={{ color: userNotes ? '#2980b9' : '#2c3e50' }} fontSize="inherit" />
    //         <MessageIcon style={{ color: comment ? '#2980b9' : '#2c3e50' }} fontSize="inherit" />
    //       </IconButton>
    //     )
    //   }
    // },
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
  ];

  useEffect(() => {
    async function fetchData() {
      dispatch(getTCategoryList());
      dispatch(getTournamentList());
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

  const handleSwitchStatus = async (id: number, relationStatus: string) => {
    const status = relationStatus === "1" ? 0 : 1;
    const data = {
      id,
      status
    };
    await dispatch(updateParticipant(data));
  };

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
      status: selectedStatus,
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

  const handleReport = () => {
    const query = {
      category: selectedCategory,
      tournament: selectedTournament,
      status: selectedStatus,
    }
    if (selectedCategory > 0 && selectedTournament > 0) {
      dispatch(getInscripcionsReportPDF(query));
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>Reporte de Inscripcion de Eventos</Grid>
      <Grid item xs={6} style={{ textAlign: 'right' }}>
        <Fab size="small" type="button" color="primary" aria-label="report" onClick={() => handleReport()}>
          <PrintIcon />
        </Fab>
      </Grid>
      <Grid item xs={2}>
        <div className="custom-select-container">
          <select
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
            <div className="custom-select-container">
              <select
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
      <Grid item xs={2}>
        <div className="custom-select-container">
          <select
            name="relation"
            onChange={handleStatus}
            style={{ fontSize: "13px" }}
          >
            <option value="">Seleccione Status</option>
            <option value={0}>Pendiente</option>
            <option value={1}>Verificado</option>
            <option value={-1}>Rechazado</option>
          </select>
        </div>
      </Grid>
      <Grid item xs={2}>
        <Button
          type="button"
          size="small"
          color="primary"
          variant="contained"
          className={classes.margin}
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
