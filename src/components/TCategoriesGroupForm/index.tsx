import React, { useEffect, FunctionComponent } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get } from "../../actions/tCategoriesGroupActions";
import { Grid } from "@material-ui/core";
import RangeAge from "../FormElements/RangeAge";
import CustomSelect from "../FormElements/CustomSelect";

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
  description: string;
  age_from: string;
  age_to: string;
  golf_handicap_from: string;
  golf_handicap_to: string;
  gender_id: string;
  category_id: string;
};

type TCategoriesGroupFormProps = {
  id?: number;
};

const TCategoriesGroupForm: FunctionComponent<TCategoriesGroupFormProps> = ({
  id
}) => {
  const classes = useStyles();
  const { handleSubmit, register, errors, reset, setValue, watch } = useForm<
    FormData
  >();

  const {
    tCategoriesGroupReducer: { loading },
    genderReducer: { list: genderList },
    tCategoryReducer: { listData: categoryList },
  } = useSelector((state: any) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      if (id) {
        const response: any = await dispatch(get(id));
        const { description, age_from, age_to, golf_handicap_from, golf_handicap_to, gender_id, category_id } = response;
        setValue("description", description);
        setValue("age_from", age_from);
        setValue("age_to", age_to);
        setValue("golf_handicap_from", golf_handicap_from);
        setValue("golf_handicap_to", golf_handicap_to);
        setValue("gender_id", gender_id);
        setValue("category_id", category_id);
      }
    }
    fetch();
  }, [id, dispatch, setValue]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleForm = (form: FormData) => {
    console.log('form ', form);
    if (id) {
      dispatch(update({ id, ...form }));
    } else {
      dispatch(create(form));
    }
  };

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Grupo
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                placeholder="Description"
                field="description"
                required
                register={register}
                errorsField={errors.description}
                errorsMessageField={
                  errors.description && errors.description.message
                }
              />
            </Grid>
            <Grid item xs={6}>
              <RangeAge
                label="Edad"
                startField="age_from"
                endField="age_to"
                required
                register={register}
                watch={watch}
                startMsgErr={errors.age_from && errors.age_from.message}
                endMsgErr={errors.age_to && errors.age_to.message}
              />
            </Grid>
            <Grid item xs={6}>
              <RangeAge
                label="Handicap"
                startField="golf_handicap_from"
                endField="golf_handicap_to"
                required
                register={register}
                watch={watch}
                startMsgErr={errors.golf_handicap_from && errors.golf_handicap_from.message}
                endMsgErr={errors.golf_handicap_to && errors.golf_handicap_to.message}
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
              <CustomSelect
                label="Categoria"
                field="category_id"
                required
                register={register}
                errorsMessageField={errors.category_id && errors.category_id.message}
                selectionMessage="Seleccione"

              >
                {categoryList.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.description}
                  </option>
                ))}
              </CustomSelect>
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
      </div>
    </Container >
  );
};

export default TCategoriesGroupForm;
