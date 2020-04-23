import React, { useEffect, FunctionComponent, useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux'
import parseHtml from 'react-html-parser';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import CustomTextField from "../FormElements/CustomTextField";
import { getParticipant, updateParticipant } from "../../actions/tournamentActions";
import { Grid } from "@material-ui/core";
import CustomEditor from "../Editor";

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)"
  }
})(MuiExpansionPanelSummary);

const useStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
    textAlign: 'center'
},
buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -9,
    marginLeft: -9
},
submit: {
    margin: theme.spacing(3, 0, 2),
    width: '30%'
},
  select: {
    padding: '10px 0px 10px 0px',
    width: ' 100%',
    backgroundColor: 'transparent',
    border: 0,
    borderBottom: '1px solid grey',
    fontSize: '16px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
}));

type FormData = {
  user_notes: string;
};

type ComponentProps = {
  id?: number;
};

const TournamentUserCommentForm: FunctionComponent<ComponentProps> = ({ id }) => {
  const [comments, setComments] = useState();
  const [expanded, setExpanded] = React.useState<string | false>("");
  const [userNotes, setUserNotes] = useState();
  const classes = useStyles();
  const {
    handleSubmit,
    register,
    errors,
    reset,
    setValue,
    getValues
  } = useForm<FormData>();
  const loading = useSelector((state: any) => state.tournamentReducer.loading);
  const dispatch = useDispatch();
  const { user_notes } = getValues();

  const handleExpandedPanel = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    async function fetch() {
      if (id) {
        const res: any = await dispatch(getParticipant(id));
        const { user_notes, comments } = res;
        setUserNotes(user_notes)
        setComments(comments)
      }
    }
    fetch();
  }, [id, dispatch, setValue]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleForm = (form: object) => {
      dispatch(updateParticipant({ id, comments }));
  };

  const handleChangeEditor = (value: any) => {
    setComments(value);
  }

  return (
    <Container component="main">
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
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
                  Notas del Participante
                            </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>{parseHtml(userNotes)}</Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>

            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <strong>Comentario</strong>
            </Grid>
            <Grid item xs={12}>
              <CustomEditor onChange={handleChangeEditor} content={comments} />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.wrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  className={classes.submit}
                >
                  {id ? "Actualizar" : "Crear"}
                </Button>
                {loading && (
                  <CircularProgress size={24} className={classes.buttonProgress} />
                )}
              </div>
            </Grid>
          </Grid>
        </form>
    </Container>
  );
}

export default TournamentUserCommentForm;
