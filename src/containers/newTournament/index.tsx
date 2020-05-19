import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import _ from "lodash";
import moment from "moment";
import { useForm } from "react-hook-form";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { green } from "@material-ui/core/colors";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Parser from "react-html-parser";

import { getList as getTCategoryList } from "../../actions/tCategoryActions";
import {
  getList as getTournamentList,
  createParticipant,
  getAvailableTournamentsByCategory,
  getAvailableTournament,
} from "../../actions/tournamentActions";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../components/FormElements/CustomSelect";
import Upload from "../../components/FormElements/Upload";
import snackBarUpdate from "../../actions/snackBarActions";
import CustomEditor from "../../components/Editor2";
import { useHistory } from "react-router-dom";

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
  },
})(MuiExpansionPanelSummary);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(4),
    },
    media: {
      height: 150,
      width: 150,
    },
    stepContainer: {
      marginBottom: 50,
    },
    familyTitle: {
      fontSize: "14px",
    },
    cardContent: {
      textAlign: "center",
      padding: 0,
      "&:last-child": {
        paddingBottom: 0,
      },
    },
    activeCard: {
      boxShadow: "0px 0px 20px 0px #3F51B5",
    },
    rootTournamentCard: {
      width: 150,
    },
    actionButtons: {
      textAlign: "right",
      padding: 10,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    stepperContainer: {},
    fieldContainer: {
      textAlign: "left",
    },
    itemField: {
      padding: "2px !important",
      wordBreak: "break-all",
      wordWrap: "break-word",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    detailsContainer: {
      border: "2px solid #2980b9",
      borderRadius: "10px",
      padding: 10,
    },
    participant: {
      padding: 10,
    },
  })
);

type FormData = {
  t_payment_methods_id: number;
  t_categories_groups_id: number;
};

export default function NewTournament() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>("");
  const [selectedGroup, setSelectedGroup] = useState<any>("");
  const [selectedFile, setSelectedFile] = useState<any>("");
  const [selectedNameFile, setSelectedNameFile] = useState<any>("");
  const [userContent, setUserContent] = useState<any>("");
  const [locator, setLocator] = useState<any>("");
  const steps = getSteps();
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    handleSubmit,
    register,
    errors,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<FormData>();

  const {
    tCategoryReducer: { listData: tCategoryList },
    tournamentReducer: {
      listData: tournamentList,
      tournamentsByCategory,
      setParticipantLoading,
    },
    loginReducer: { user },
  } = useSelector((state: any) => state);

  useEffect(() => {
    dispatch(getTCategoryList());
    dispatch(getTournamentList());
  }, []);

  const handleForm = (form: object) => {
    console.log("form ", form);
    // if (id) {
    //   dispatch(update({ id, ...form }));
    // } else {
    //   dispatch(create(form));
    // }
  };

  const handleSelectCategory = async (row: any) => {
    setSelectedTournament(null);
    await dispatch(getAvailableTournamentsByCategory(row.id));
    setSelectedCategory(row);
  };

  const handleSelectTournament = (row: any) => {
    setSelectedTournament(row);
  };

  const getParticipants = (type: any) => {
    if (type === "1") return "Socios/Familiares";
    if (type === "2") return "Invitados";
    return "Ambos";
  };

  const handlePayment = (event: any) => {
    setSelectedPayment(event.target.value);
  };

  function getSteps() {
    return ["Seleccione Torneo", "Registro de Torneo", "Confirmacion"];
  }

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <SelectCategory />;
      case 1:
        return <TournamentDetails />;
      case 2:
        return <Sumary />;
      case 3:
        return <Confirmation />;
      default:
        return "Unknown step";
    }
  }

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    let newSkipped = skipped;
    const currentStep = activeStep + 1;
    const isAvailable = selectedTournament ? await dispatch(getAvailableTournament(selectedTournament.id)) : false;

    if (activeStep === 0 && (!selectedCategory || !selectedTournament)) {
      dispatch(
        snackBarUpdate({
          payload: {
            message: "Seleccionar Categoria y Torneo",
            type: "error",
            status: true,
          },
        })
      );
    } else if (activeStep === 0 && !isAvailable) {
      dispatch(
        snackBarUpdate({
          payload: {
            message: "Torneo no se encuentra disponible",
            type: "error",
            status: true,
          },
        })
      );
    }
     else if (activeStep === 1 && selectedPayment === "") {
      dispatch(
        snackBarUpdate({
          payload: {
            message: "Seleccionar Metodo de Pago",
            type: "error",
            status: true,
          },
        })
      );
    } else if (currentStep === steps.length) {
      const data: any = {           
        t_payment_methods_id: selectedPayment,
        tournament_id: selectedTournament.id,
        user_id: user.id,
        attachFile: selectedFile,
        status: 0,
      };
      if (userContent !== "") {
        data.user_notes = userContent;
      }
      try {
        const res: any = await dispatch(createParticipant(data));
        setLocator(res.data.locator);
        history.push("/dashboard/participant-inscriptions");
      } catch (error) {
        return error;
      }
    } else {
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleExpandedPanel = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedTournament(null);
    setSelectedPayment("");
    setSelectedGroup("");
    setSelectedFile("");
    setSelectedNameFile("");
    setLocator("");
    setUserContent("");
    setActiveStep(0);
  };

  const handleUploadFile = (file: string, name: string) => {
    setSelectedFile(file);
    setSelectedNameFile(name);
  };

  const handleChangeEditor = (content: any) => {
    setUserContent(content);
  };

  const renderType = (list: Array<string | number>, id: any) => {
    const value: any = list.find((e: any) => e.id == id);
    if (value) return value.description;
    return "";
  };

  const renderTournaments = () => {
    return (
      <Grid container spacing={3} style={{ marginTop: 30 }}>
        <Grid item xs={12}>
          <strong>Torneos Activos</strong>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3} justify="flex-start">
            {tournamentsByCategory.length > 0 &&
              tournamentsByCategory.map((element: any, i: number) => {
                const active =
                  selectedTournament && selectedTournament.id === element.id
                    ? classes.activeCard
                    : "";
                return (
                  <Grid item xs={3} key={i}>
                    <Card
                      className={`${classes.rootTournamentCard} ${active}`}
                      onClick={() => handleSelectTournament(element)}
                    >
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={element.picture}
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography
                            color="textPrimary"
                            className={classes.familyTitle}
                          >
                            {element.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  function SelectCategory() {
    const { name, last_name, phone_number, email } = user;
    return (
      <Grid container spacing={3} justify="center">
        <Grid item xs={8} className={classes.detailsContainer}>
          <Grid
            container
            spacing={3}
            justify="center"
            className={classes.participant}
          >
            <Grid item xs={6} className={classes.itemField}>
              <strong>Nombre:</strong> {name}
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Apellido:</strong>
              {last_name}
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Telefono:</strong>
              {phone_number}
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Correo:</strong>
              {email}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <strong>Seleccione una categoria</strong>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3} justify="flex-start">
            {tCategoryList.map((element: any, i: number) => {
              const active =
                selectedCategory && selectedCategory.id === element.id
                  ? classes.activeCard
                  : "";
              return (
                <Grid item xs={3} key={i}>
                  <Card
                    className={`${classes.rootTournamentCard} ${active}`}
                    onClick={() => handleSelectCategory(element)}
                  >
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image={element.picture}
                      />
                      <CardContent className={classes.cardContent}>
                        <Typography
                          color="textPrimary"
                          className={classes.familyTitle}
                        >
                          {element.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
            {!_.isEmpty(selectedCategory) &&
              tournamentList.length > 0 &&
              renderTournaments()}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  function TournamentDetails() {
    return (
      <Grid container spacing={3} justify="center">
        <Grid item xs={10}>
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ marginBottom: 20 }}>
              <Grid container spacing={1} className={classes.detailsContainer}>
                <Grid item xs={12} className={classes.itemField}>
                  <strong>Tus detalles personales</strong>
                </Grid>
                <Grid item xs={6} className={classes.itemField}>
                  <strong>Nombre:</strong> {user.name} {user.last_name}
                </Grid>
                <Grid item xs={6} className={classes.itemField}>
                  <strong>Correo:</strong> {user.email}
                </Grid>
                <Grid item xs={6} className={classes.itemField}>
                  <strong>Correo:</strong> {user.email}
                </Grid>
                <Grid item xs={6} className={classes.itemField}>
                  <strong>Telefono:</strong> {user.phone_number}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.itemField}>
              <strong>Categoria:</strong> {selectedCategory.description}
            </Grid>
            <Grid item xs={12} className={classes.itemField}>
              <strong>Nombre del Torneo:</strong>
              {selectedTournament.description}
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.itemField}
              style={{ marginTop: 10 }}
            >
              <ExpansionPanel
                expanded={expanded === "panel1"}
                onChange={handleExpandedPanel("panel1")}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    Detalles del Torneo
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.itemField}>
                      {Parser(selectedTournament.description_details)}
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.itemField}
              style={{ marginBottom: 10 }}
            >
              <ExpansionPanel
                expanded={expanded === "panel2"}
                onChange={handleExpandedPanel("panel2")}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>
                    Detalles Premiacion
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.itemField}>
                      {Parser(selectedTournament.description_price)}
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Fecha:</strong>
              {moment(selectedTournament.date_from).format(
                "DD-MM-YY hh:mm:ss A"
              )}
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Hasta:</strong>
              {moment(selectedTournament.date_to).format(
                "DD-MM-YY hh:mm:ss A"
              )}
            </Grid>
            <Grid item xs={12} className={classes.itemField}>
              <strong>Fin Registro:</strong>
              {moment(selectedTournament.date_register_to).format(
                "DD-MM-YY hh:mm:ss A"
              )}
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Tipo de Reglas:</strong>
              {selectedTournament.rules.description}
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Tipo de Participantes:</strong>
              {getParticipants(selectedTournament.participant_type)}
            </Grid>
            <Grid item xs={12} className={classes.itemField}>
              <strong>Grupos:</strong>
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.itemField}
              style={{ textAlign: "left", marginBottom: 20 }}
            >
              {selectedTournament.groups.map((e: any) => (
                <div>{e.description}</div>
              ))}
            </Grid>
            <Grid item xs={3} className={classes.itemField}>
              <strong>Monto:</strong> {selectedTournament.currency.description}
              {selectedTournament.amount}
            </Grid>
            <Grid
              item
              xs={4}
              className={classes.itemField}
              style={{ textAlign: "right" }}
            >
              <strong>Metodo de Pago</strong>
            </Grid>
            <Grid item xs={3} className={classes.itemField}>
              <div className="custom-select-container">
                <select
                  name="relation"
                  onChange={handlePayment}
                  style={{ fontSize: "13px" }}
                  value={selectedPayment}
                >
                  <option value="">Seleccione</option>
                  {selectedTournament.payments.map((item: any, i: number) => (
                    <option value={item.id}>{item.description}</option>
                  ))}
                </select>
              </div>
            </Grid>
            <Grid item xs={12}>
              Comprobante de inscripcion
              <Upload
                field="attach_file"
                label="Archivo"
                register={register}
                setValue={handleUploadFile}
                noForm
                nameFile={selectedNameFile}
              />
            </Grid>
            <Grid item xs={12}>
              Notas del Participante
            </Grid>
            <Grid item xs={12}>
              <CustomEditor
                onChange={handleChangeEditor}
                content={userContent}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  function Sumary() {
    return (
      <Grid container spacing={3} justify="center">
        <Grid item xs={10}>
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ marginBottom: 20 }}>
              <Grid container spacing={1} className={classes.detailsContainer}>
                <Grid item xs={12} className={classes.itemField}>
                  <strong>Tus detalles personales</strong>
                </Grid>
                <Grid item xs={6} className={classes.itemField}>
                  <strong>Nombre:</strong> {user.name} {user.last_name}
                </Grid>
                <Grid item xs={6} className={classes.itemField}>
                  <strong>Correo:</strong> {user.email}
                </Grid>
                <Grid item xs={6} className={classes.itemField}>
                  <strong>Correo:</strong> {user.email}
                </Grid>
                <Grid item xs={6} className={classes.itemField}>
                  <strong>Telefono:</strong> {user.phone_number}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.itemField}>
              <strong>Categoria:</strong> {selectedCategory.description}
            </Grid>
            <Grid item xs={12} className={classes.itemField}>
              <strong>Nombre del Torneo:</strong>
              {selectedTournament.description}
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.itemField}
              style={{ marginTop: 10 }}
            >
              <ExpansionPanel
                expanded={expanded === "panel1"}
                onChange={handleExpandedPanel("panel1")}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    Detalles del Torneo
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.itemField}>
                      {Parser(selectedTournament.description_details)}
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.itemField}
              style={{ marginBottom: 10 }}
            >
              <ExpansionPanel
                expanded={expanded === "panel2"}
                onChange={handleExpandedPanel("panel2")}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>
                    Detalles Premiacion
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.itemField}>
                      {selectedTournament.description_price}
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Fecha:</strong>
              {moment(selectedTournament.date_from).format(
                "DD-MM-YY hh:mm:ss A"
              )}
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Hasta:</strong>
              {moment(selectedTournament.date_to).format(
                "DD-MM-YY hh:mm:ss A"
              )}
            </Grid>
            <Grid item xs={12} className={classes.itemField}>
              <strong>Fin Registro:</strong>
              {moment(selectedTournament.date_register_to).format(
                "DD-MM-YY hh:mm:ss A"
              )}
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Tipo de Reglas:</strong>
              {selectedTournament.rules.description}
            </Grid>
            <Grid item xs={6} className={classes.itemField}>
              <strong>Tipo de Participantes:</strong>
              {getParticipants(selectedTournament.participant_type)}
            </Grid>
            <Grid item xs={12} className={classes.itemField}>
              <strong>Grupos:</strong>
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.itemField}
              style={{ textAlign: "left", marginBottom: 20 }}
            >
              {selectedTournament.groups.map((e: any) => (
                <div>{e.description}</div>
              ))}
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.itemField}
              style={{ textAlign: "left" }}
            >
              <strong>Metodo de Pago: </strong>
              {renderType(selectedTournament.payments, selectedPayment)}
            </Grid>
            <Grid item xs={12} className={classes.itemField}>
              <strong>Monto:</strong> {selectedTournament.currency.description}
              {selectedTournament.amount}
            </Grid>
            <Grid item xs={12} className={classes.itemField}>
              <strong>
                Comprobante de inscripcion:
                {selectedNameFile !== "" ? selectedNameFile : "N/A"}
              </strong>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  function Confirmation() {
    return (
      <Grid container spacing={3} style={{ textAlign: "center" }}>
        <Grid item xs={12}>
          <CheckCircleIcon style={{ color: green[500], fontSize: 50 }} />
        </Grid>
        <Grid item xs={12}>
          <strong>Inscripcion Finalizada</strong>
        </Grid>
        <Grid item xs={12}>
          Localizador: <strong>{locator}</strong>
        </Grid>
      </Grid>
    );
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={3}
        justify="center"
        className={classes.stepperContainer}
      >
        <Grid
          item
          xs={12}
          style={{ textAlign: "center", fontSize: "17px", fontWeight: "bold" }}
        >
          Registro de Participante
        </Grid>
        <Grid item xs={8}>
          <Paper style={{ padding: "0 20px 0 20px" }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: { optional?: React.ReactNode } = {};
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <div>
              <div>
                <Typography className={classes.instructions}>
                  {getStepContent(activeStep)}
                </Typography>
                <div className={classes.actionButtons}>
                  {activeStep === 3 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleReset}
                      className={classes.button}
                    >
                      Registrarse en otro Torneo
                    </Button>
                  ) : (
                    <React.Fragment>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                      >
                        Regresar
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                        disabled={setParticipantLoading}
                      >
                        {activeStep === steps.length - 1
                          ? "Inscribirse"
                          : "Siguiente"}
                      </Button>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
