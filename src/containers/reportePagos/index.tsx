import React, { useEffect, useState } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, withStyles, Theme } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import moment from 'moment';

import { getAll } from "../../actions/reportePagosActions";
import { updateModal } from "../../actions/modalActions";
import LockerForm from "../../components/LockerForm";
import DataTable4 from '../../components/DataTable4'
import reportePagosColumns from '../../interfaces/reportePagosColumns';
import UnpaidInvoicesColumns from '../../interfaces/UnpaidInvoicesColumns';
import CustomSearch from '../../components/FormElements/CustomSearch';
import ReportePagosForm from "../../components/ReportePagoForm";
import { Grid } from "@material-ui/core";
import _ from 'lodash';

import { getReportedPayments, getUnpaidInvoices } from "../../actions/webServiceActions";
import { getClient } from "../../actions/personActions";

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: "rgba(0, 0, 0, .03)"
    }
})(MuiExpansionPanelSummary);

const columns: reportePagosColumns[] = [
    {
        id: "dFechaPago",
        label: "Fecha",
        minWidth: 10,
        component: (value: any) => <span>{moment(value.value).format("DD-MM-YYYY")}</span>
    },
    {
        id: "NroReferencia",
        label: "Referencia",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>
    },
    {
        id: "sDescripcion",
        label: "Descripcion",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>
    },
    {
        id: "Destino",
        label: "Cuenta",
        minWidth: 10,
        component: (value: any) => <span> {value.value} </span>
    },
    {
        id: "nMonto",
        label: "Monto",
        minWidth: 30,
        align: "right",
        component: (value: any) => <span>{value.value}</span>
    },
    {
        id: "status",
        label: "Status",
        minWidth: 30,
        align: "right",
        component: (value: any) => <span>Pendiente</span>
    },
];

const unpaidInvoicesColumns: UnpaidInvoicesColumns[] = [
    {
        id: "fact_num",
        label: "Nro",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>
    },
    {
        id: "fec_emis",
        label: "Emision",
        minWidth: 10,
        component: (value: any) => <span>{moment(value.value).format("DD-MM-YYYY")}</span>
    },
    {
        id: "fec_venc",
        label: "Vencimiento",
        minWidth: 10,
        component: (value: any) => <span>{moment(value.value).format("DD-MM-YYYY")}</span>
    },
    {
        id: "descrip",
        label: "Descripcion",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>
    },
    {
        id: "saldo",
        label: "Saldo",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>
    },
    {
        id: "acumulado",
        label: "Acumulado",
        minWidth: 10,
        component: (value: any) => <span>{value.value}</span>
    },
];

const useStyles = makeStyles((theme: Theme) => ({
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
    paymentFormContainer: {
        marginTop: '50px',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    },
}));

export default function ReportePagos() {
    const [expanded, setExpanded] = useState<string | false>("");
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        unpaidInvoices,
        reportedPayments,
        setUnpaidInvoicestLoading,
        setReportedPaymentsLoading
    } = useSelector((state: any) => state.webServiceReducer);

    const { client } = useSelector((state: any) => state.personReducer);

    const { user } = useSelector((state: any) => state.loginReducer);

    useEffect(() => {
        dispatch(getUnpaidInvoices());
        dispatch(getReportedPayments());
    }, [dispatch]);
    

    const handleExpandedPanel = (panel: string) => (
        event: React.ChangeEvent<{}>,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded ? panel : false);
    };

    console.log('client', client);
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                {
                    !_.isEmpty(client) && (
                        <div>
                            <div>{client.cli_des}</div>
                            <div>{client.co_cli}</div>
                        </div>
                    )
                }
            </Grid>
            <Grid item xs={12}>Facturas por Pagar</Grid>
            <Grid item xs={12}>
                <DataTable4
                    rows={unpaidInvoices.data}
                    columns={unpaidInvoicesColumns}
                    loading={setUnpaidInvoicestLoading}
                    aditionalColumn={unpaidInvoices.total}
                    aditionalColumnLabel="Total"
                />
            </Grid>
            <Grid item xs={12}>
                <ExpansionPanel
                    expanded={expanded === "panel"}
                    onChange={handleExpandedPanel("panel")}
                >
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel-content"
                        id="panel-header"
                    >
                        <Typography className={classes.heading}>
                            Pagos Reportados
                            </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <DataTable4
                            rows={reportedPayments}
                            columns={columns}
                            loading={setReportedPaymentsLoading}
                        />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Grid>
            <Grid item xs={6}>

                <ReportePagosForm />
            </Grid>
        </Grid>
    );
}
