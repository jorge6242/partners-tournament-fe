import React, { useEffect, useState, FunctionComponent } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";

import TransferList from "../TransferList";
import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get } from "../../actions/userActions";
import { getAll as getAllRoles } from "../../actions/roleActions";
import { getList as getGroupList } from "../../actions/groupActions";
import CustomSelect from "../FormElements/CustomSelect";

const useStyles = makeStyles(theme => ({
  rootUserForm: {
    width: "100%"
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
    textAlign: 'center',
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
    padding: "10px 0px 10px 0px",
    width: " 100%",
    backgroundColor: "transparent",
    border: 0,
    borderBottom: "1px solid grey",
    fontSize: "16px"
  }
}));

type FormData = {
  name: string;
  last_name: string;
  doc_id: string;
  birth_date: string;
  phone_number: string;
  address: string;
  username: string;
  email: string;
  password: string;
  group_id: string;
  isPartner: string;
  handicap: number;
  handicapFVG: number;
  gender_id: string;
  people_id: string;
};

type FormComponentProps = {
  id?: number;
};

const UserForm: FunctionComponent<FormComponentProps> = ({ id }) => {
  const classes = useStyles();
  const [selectedData, setSelectedData] = useState<any>([]);
  const { handleSubmit, register, errors, reset, setValue } = useForm<
    FormData
  >();

  const {
    userReducer: { loading },
    roleReducer: { list },
    groupReducer: { listData: groupList },
  } = useSelector((state: any) => state);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllRoles());
    dispatch(getGroupList());
    async function fetch() {
      if (id) {
        const response: any = await dispatch(get(id));
        const {
          name,
          last_name,
          doc_id,
          birth_date,
          phone_number,
          address,
          username,
          email,
          password,
          group_id,
          isPartner,
          handicap,
          handicapFVG,
          gender_id,
          people_id,
          roles
        } = response;
        setValue("name", name);
        setValue("last_name", last_name);
        setValue("doc_id", doc_id);
        setValue("birth_date", birth_date);
        setValue("phone_number", phone_number);
        setValue("address", address);
        setValue("username", username);
        setValue("email", email);
        setValue("group_id", group_id);
        setValue("isPartner", isPartner);
        setValue("handicap", handicap);
        setValue("handicapFVG", handicapFVG);
        setValue("gender_id", gender_id);;
        if (roles.length > 0) {
          const list = roles.map((element: any) => element.id);
          setValue("roles", JSON.stringify(list));
          setSelectedData(roles);
        } else {
          setSelectedData([]);
        }
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
    if (id) {
      dispatch(update({ id, ...form }));
    } else {
      dispatch(create({ ...form, password: '123456' }));
    }
  };

  const onPermissionsChange = (event: any) => {
    setValue("roles", JSON.stringify(event));
  };

  return (
    <Container component="main" className={classes.rootUserForm}>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Usuario
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <CustomTextField
                    placeholder="Nombre"
                    field="name"
                    required
                    register={register}
                    errorsField={errors.name}
                    errorsMessageField={errors.name && errors.name.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    placeholder="Apellido"
                    field="last_name"
                    required
                    register={register}
                    errorsField={errors.last_name}
                    errorsMessageField={errors.last_name && errors.last_name.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    placeholder="ID Documento"
                    field="doc_id"
                    required
                    register={register}
                    errorsField={errors.doc_id}
                    errorsMessageField={errors.doc_id && errors.doc_id.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    placeholder="Nacimiento"
                    field="birth_date"
                    required
                    register={register}
                    errorsField={errors.birth_date}
                    errorsMessageField={errors.birth_date && errors.birth_date.message}
                    type="date"
                  />
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    placeholder="Numero"
                    field="phone_number"
                    required
                    register={register}
                    errorsField={errors.phone_number}
                    errorsMessageField={errors.phone_number && errors.phone_number.message}
                    inputType="number"
                  />
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    placeholder="Direccion"
                    field="address"
                    required
                    register={register}
                    errorsField={errors.address}
                    errorsMessageField={errors.address && errors.address.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    placeholder="Usuario"
                    field="username"
                    required
                    register={register}
                    errorsField={errors.username}
                    errorsMessageField={errors.username && errors.username.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    placeholder="Correo"
                    field="email"
                    required
                    register={register}
                    errorsField={errors.email}
                    errorsMessageField={errors.email && errors.email.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <CustomSelect
                    label="Grupo"
                    selectionMessage="Seleccione"
                    field="group_id"
                    required
                    register={register}
                    errorsMessageField={
                      errors.group_id && errors.group_id.message
                    }
                  >
                    {groupList.length > 0 && groupList.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.balance}
                      </option>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={3}>
                  <CustomSelect
                    label="Tipo"
                    selectionMessage="Seleccione"
                    field="isPartner"
                    register={register}
                    errorsMessageField={
                      errors.isPartner && errors.isPartner.message
                    }
                  >
                    <option value={1}> Socio </option>
                    <option value={2}> Familiar </option>
                    <option value={3}> Invitado </option>
                  </CustomSelect>
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    placeholder="Handicap"
                    field="handicap"
                    required
                    register={register}
                    errorsField={errors.handicap}
                    errorsMessageField={errors.handicap && errors.handicap.message}
                    inputType="number"
                  />
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    placeholder="Handicap FGV"
                    field="handicapFVG"
                    required
                    register={register}
                    errorsField={errors.handicapFVG}
                    errorsMessageField={errors.handicapFVG && errors.handicapFVG.message}
                    inputType="number"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Grid item xs={12}>
                {list.length > 0 && (
                  <TransferList
                    data={list}
                    selectedData={selectedData}
                    leftTitle="Roles"
                    onSelectedList={onPermissionsChange}
                  />
                )}
              </Grid>
              <input
                style={{ display: "none" }}
                name="roles"
                ref={register}
              />
            </Grid>
          </Grid>

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
        </form>
      </div>
    </Container>
  );
};

export default UserForm;
