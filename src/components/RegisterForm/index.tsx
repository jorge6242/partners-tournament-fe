import React, { useEffect, FunctionComponent } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get } from "../../actions/userActions";
import { getList as getGenderList } from '../../actions/genderActions';
import CustomSelect from "../FormElements/CustomSelect";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
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
    position: "relative"
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -9,
    marginLeft: -9
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  registerTitle: {
    textAlign: 'center',
  }
}));

// [name] [nvarchar](255) NULL,
// [last_name] [nvarchar](255) NULL,
// [doc_id] [nvarchar](255) NULL,
// [birth_date] [date] NULL,
// [phone_number]  varchar
// [email] [nvarchar](255) NULL,
// [group_id] [nvarchar](255) NULL,    (o numerica)
// [gender_id] [bigint] NULL,    CLAVE FORANEA 

type FormData = {
  username: string;
  name: string;
  last_name: string;
  doc_id: string;
  birth_date: string;
  phone_number: string;
  email: string;
  group_id: string;
  gender_id: string;
};

type ComponentProps = {
  id?: number;
};

const RegisterForm: FunctionComponent<ComponentProps> = ({
  id
}) => {
  const classes = useStyles();
  const { handleSubmit, register, errors, reset, setValue } = useForm<
    FormData
  >();
  const {
    userReducer: { loading },
    genderReducer: { listData: genderList }
  } = useSelector((state: any) => state);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenderList());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleForm = async (form: object) => {
    await dispatch(create({ ...form, isParticipant: true, password: null }));
    reset();
    setTimeout(() => {
      history.push('/');
    }, 5000);
  };

  const handleLogin = () => {
    history.push('/');
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <Grid container spacing={3}>
            <Grid xs={12} className={classes.registerTitle} >
              <Typography component="h1" variant="h5">
                Registro de Participante
        </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Usuario"
                field="username"
                required
                register={register}
                errorsField={errors.username}
                errorsMessageField={
                  errors.username && errors.username.message
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Nombre"
                field="name"
                required
                register={register}
                errorsField={errors.name}
                errorsMessageField={
                  errors.name && errors.name.message
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Apellido"
                field="last_name"
                required
                register={register}
                errorsField={errors.last_name}
                errorsMessageField={
                  errors.last_name && errors.last_name.message
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Ej: V10065168"
                label="Cedula"
                inputType="rif-ci"
                field="doc_id"
                required
                register={register}
                errorsField={errors.doc_id}
                errorsMessageField={
                  errors.doc_id && errors.doc_id.message
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Fecha de Nacimiento"
                field="birth_date"
                required
                register={register}
                errorsField={errors.birth_date}
                errorsMessageField={errors.birth_date && errors.birth_date.message}
                type="date"
              />
            </Grid>
            <Grid item xs={6}>
              <CustomSelect
                label="Sexo"
                field="gender_id"
                required
                register={register}
                errorsMessageField={errors.gender_id && errors.gender_id.message}
                selectionMessage="Seleccione"
              >
                {genderList.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.description}
                  </option>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={6}>
              <CustomTextField
                placeholder="Correo"
                field="email"
                required
                register={register}
                errorsField={errors.email}
                errorsMessageField={
                  errors.email && errors.email.message
                }
                inputType="email"
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Telefono"
                field="phone_number"
                register={register}
                required
                errorsField={errors.phone_number}
                errorsMessageField={
                  errors.phone_number && errors.phone_number.message
                }
                inputType="number"
              />
            </Grid>
            <Grid xs={6}>
              <div className={classes.wrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  className={classes.submit}
                >
                  Registrarse
            </Button>
                {loading && (
                  <CircularProgress size={24} className={classes.buttonProgress} />
                )}
              </div>
            </Grid>
            <Grid xs={6}>
              <div className={classes.wrapper}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  className={classes.submit}
                  onClick={() => handleLogin()}
                >
                  Regresar
            </Button>
              </div>
            </Grid>
          </Grid>

        </form>
      </div>
    </Container>
  );
};

export default RegisterForm;
