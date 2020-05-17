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
      id: "status",
      label: "Status",
      minWidth: 10,
      align: "center",
      component: (value: any) => {
        let status = '';
        let backgroundColor = '';
        if(value.value === "0") {
          status = "Pendiente";
          backgroundColor = '#2980b9';
        }
        if(value.value === "1") {
          status = "Aceptado";
          backgroundColor = '#2ecc71';
        }
        if(value.value === "-1") {
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
      dispatch(getAll());
    }
    fetchData();
  }, [dispatch]);

  const handleEdit = (id: number) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <LockerForm id={id} />
        }
      })
    );
  };

  const handleCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <LockerForm />
        }
      })
    );
  }

  const handleDelete = (id: number) => {
    dispatch(remove(id));
  };

  const handleChangePage = (newPage: number) => {
    const page = pagination.currentPage === 1 ? 2 : newPage;
    dispatch(getAll(page, pagination.perPage))
  };

  const handlePerPage = (page: number, perPage: number) => {
    dispatch(getAll(page, perPage));
  }

  const handleSwitchStatus = async (id: number, relationStatus: string) => {
    let status = '';
    if(relationStatus === '0') {
      status = '1';
    } else {
      status = relationStatus === "1" ? '-1' : '1';
    }
    
    
    const data = {
      id,
      status
    };
    await dispatch(updateParticipant(data));
  };

  const handleCategory =(event: any) => {
    setSelectedCategory(0);
    setSelectedTournament(0);
    dispatch(getByCategory(event.target.value))
    setSelectedCategory(event.target.value);
  }

  const handleTournament = (event: any) => {
    setSelectedTournament(event.target.value);
  }

  const handleSearch = () => {
    const { currentPage, perPage } = pagination;
    const query = {
      category: selectedCategory,
      tournament: selectedTournament,
      term: selectedSearch
    }
    if(selectedCategory > 0 && selectedTournament > 0){
      dispatch(getAll(currentPage, perPage, query ));
    } else {
      dispatch(snackBarUpdate({
        payload: {
          message: 'Seleccionar Categoria y Torneo',
          status: true,
          type: "error"
        }
      }))
    }
    
  }

  const setInputSearch = (e: any) => setSelectedSearch(e.target.value);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>Inscripciones de Torneos</Grid>
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
                <option value={0}>Seleccione Torneo</option>
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
          handleSwitch={handleSwitchStatus}
          isInscription
        />
      </Grid>
    </Grid>
  );
}
