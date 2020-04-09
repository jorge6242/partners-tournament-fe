import React, { useEffect, FunctionComponent } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get } from "../../actions/groupActions";
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
  attach_file: string;
  balance: string;
  balancer_date: Date;
  is_suspended: number;
  is_active: number;
};

type ComponentProps = {
  id?: number;
};

const GroupForm: FunctionComponent<ComponentProps> = ({
  id
}) => {
  const classes = useStyles();
  const { handleSubmit, register, errors, reset, setValue } = useForm<
    FormData
  >();
  const { loading } = useSelector((state: any) => state.groupReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetch() {
      if (id) {
        const response: any = await dispatch(get(id));
        setValue("attach_file", response.attach_file);
        setValue("balance", response.balance);
        setValue("balancer_date", response.balancer_date);
        setValue("is_suspended", response.is_suspended);
        setValue("is_active", response.is_active);
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
          <CustomTextField
            placeholder="Balance"
            field="balance"
            required
            register={register}
            errorsField={errors.balance}
            errorsMessageField={
              errors.balance && errors.balance.message
            }
          />

          <CustomTextField
            placeholder="Fecha de Balance"
            field="balancer_date"
            required
            register={register}
            errorsField={errors.balancer_date}
            errorsMessageField={errors.balancer_date && errors.balancer_date.message}
            type="date"
          />

          <CustomSelect
            label="Suspendido"
            selectionMessage="Seleccione"
            field="is_suspended"
            register={register}
            errorsMessageField={
              errors.is_suspended && errors.is_suspended.message
            }
          >
            <option value={1}> SI </option>
            <option value={0}> NO </option>
          </CustomSelect>

          <CustomSelect
            label="Activo"
            selectionMessage="Seleccione"
            field="is_active"
            register={register}
            errorsMessageField={
              errors.is_active && errors.is_active.message
            }
          >
            <option value={1}> SI </option>
            <option value={0}> NO </option>
          </CustomSelect>

          <div className={classes.wrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.submit}
            >
              {id ? "Update" : "Create"}
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

export default GroupForm;
