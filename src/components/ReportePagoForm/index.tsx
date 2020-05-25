import React, { useEffect, FunctionComponent } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import CustomTextField from "../FormElements/CustomTextField";
import { create } from "../../actions/reportePagosActions";
import { getList as getBancoEmisorList } from "../../actions/bancoEmisorActions";
import { getList as getBancoReceptorList } from "../../actions/bancoReceptorActions";
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
        padding: '10px 0px 10px 0px',
        width: ' 100%',
        backgroundColor: 'transparent',
        border: 0,
        borderBottom: '1px solid grey',
        fontSize: '16px'
    }
}));

type FormData = {
    nMonto: string,
    NroReferencia: string,
    sDescripition: string,
    EstadoCuenta: string,
    status: string,
    dFechaProceso: string,
    Login: string,
    Archivos: string,
    codBancoOrigen: string,
    codCuentaDestino: string,
    NroReferencia2: string,
    dFechaRegistro: string,
    dFechaPago: string;
};

type FormComponentProps = {
    id?: number;
};

const ReportePagosForm: FunctionComponent<FormComponentProps> = ({ id }) => {
    const classes = useStyles();
    const {
        handleSubmit,
        register,
        errors,
        reset,
        getValues
    } = useForm<FormData>();
    const loading = useSelector((state: any) => state.genderReducer.loading);
    const dispatch = useDispatch();

    const { listData: bancoEmisorList } = useSelector(
        (state: any) => state.bancoEmisorReducer
    );

    const { listData: bancoReceptorList } = useSelector(
        (state: any) => state.bancoReceptorReducer
    );
    useEffect(() => {
        dispatch(getBancoEmisorList());
        dispatch(getBancoReceptorList());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    const handleForm = async (form: object) => {
        const body = {
            ...form,
            dFechaProceso: moment().format('YYYY-MM-DD'),
            DFechaRegistro: moment().format('YYYY-MM-DD'),
            EstadoCuenta: '',
            sDescripcion: 'Prueba',
            Login: '',
        }
        await dispatch(create(body));
        reset();
    };

    return (
        <Container component="main">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Reporte de Pagos
        </Typography>
                <form
                    className={classes.form}
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <CustomSelect
                        label="Banco Origen"
                        selectionMessage="Seleccione"
                        field="codBancoOrigen"
                        required
                        register={register}
                        errorsMessageField={
                            errors.codBancoOrigen &&
                            errors.codBancoOrigen.message
                        }
                    >
                        {bancoEmisorList.map((item: any) => (
                            <option key={item.cCodBanco} value={item.cCodBanco}>
                                {item.cNombreBanco}
                            </option>
                        ))}
                    </CustomSelect>
                    <CustomTextField
                        placeholder="Referencia"
                        field="NroReferencia"
                        required
                        register={register}
                        errorsField={errors.NroReferencia}
                        errorsMessageField={
                            errors.NroReferencia && errors.NroReferencia.message
                        }
                    />

                    <CustomTextField
                        placeholder="Fecha"
                        field="dFechaPago"
                        required
                        register={register}
                        errorsField={errors.dFechaPago}
                        errorsMessageField={
                            errors.dFechaPago && errors.dFechaPago.message
                        }
                        type="date"
                    />

                    <CustomSelect
                        label="Banco Destino"
                        selectionMessage="Seleccione"
                        field="codCuentaDestino"
                        required
                        register={register}
                        errorsMessageField={
                            errors.codCuentaDestino &&
                            errors.codCuentaDestino.message
                        }
                    >
                        {bancoReceptorList.map((item: any) => (
                            <option key={item.cCodCuenta} value={item.cCodCuenta}>
                                {`${item.cNombreBanco} - ${item.cNumCuenta.substring(12, 16)}`}
                            </option>
                        ))}
                    </CustomSelect>

                    <CustomTextField
                        placeholder="Monto"
                        field="nMonto"
                        required
                        register={register}
                        errorsField={errors.nMonto}
                        errorsMessageField={
                            errors.nMonto && errors.nMonto.message
                        }
                        inputType="number"
                    />
                    <div>Comprobante de Pago</div>
                    <Button
                        startIcon={<CloudUploadIcon />}
                        variant="contained"
                        color="primary"
                        size="small"
                        component="span"
                    >
                        Archivo
                    </Button>

                    <div className={classes.wrapper}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            className={classes.submit}
                        >
                            Enviar
                        </Button>
                        {loading && (
                            <CircularProgress size={24} className={classes.buttonProgress} />
                        )}
                    </div>
                </form>
            </div>
        </Container>
    );
}

export default ReportePagosForm;
