import React, { useEffect, FunctionComponent, useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import _ from 'lodash';

import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get } from "../../actions/tournamentActions";
import { getList as getCategoryList } from "../../actions/tCategoryActions";
import { getList as getCurrencyList } from "../../actions/currencyActions";
import { getList as getRuleTypeList } from "../../actions/tRuleCategoryActions";
import { getList as getPaymentMethodList } from "../../actions/tPaymentMethodActions";
import { getList as getCategoriesGroupList } from "../../actions/tCategoriesGroupActions";
import CustomSelect from "../FormElements/CustomSelect";
import { Grid } from "@material-ui/core";
import TransferList from "../TransferList";
import moment from "moment";

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
        width: '50%',
    },
    select: {
        padding: "10px 0px 10px 0px",
        width: " 100%",
        backgroundColor: "transparent",
        border: 0,
        borderBottom: "1px solid grey",
        fontSize: "16px"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    },
    dataContainer: {
        overflowX: 'scroll',
        height: 200
    }
}));

type FormData = {
    description: string;
    max_participants: string;
    description_price: string;
    template_welcome_mail: string;
    template_confirmation_mail: string;
    amount: number;
    participant_type: string;
    date_register_from: Date;
    date_register_to: Date;
    date_from: Date;
    date_to: Date;
    status: string;
    t_rule_type_id: string;
    currency_id: string;
    t_categories_id: number;
    t_category_type_id: number;
};

type ComponentProps = {
    id?: number;
};

interface SelectedItems {
    itemsToAdd: Array<string | number>;
    itemsToRemove: Array<string | number>;
}

const initialSelectedItems = {
    itemsToAdd: [],
    itemsToRemove: []
};

const initialGroupsSelectedItems = {
    itemsToAdd: [],
    itemsToRemove: []
};

const TournamentForm: FunctionComponent<ComponentProps> = ({
    id
}) => {
    const [selectedData, setSelectedData] = useState<any>([]);
    const [selectedGroupsData, setSelectedGroupsData] = useState<any>([]);
    const [selectedItems, setSelectedItems] = useState<SelectedItems>(
        initialSelectedItems
    );
    const [selectedCategoryGroupItems, setSelectedCategoryGroupItems] = useState<SelectedItems>(
        initialGroupsSelectedItems
    );
    const [expanded, setExpanded] = React.useState<string | false>("panel-register");
    const classes = useStyles();
    const { handleSubmit, register, errors, reset, setValue } = useForm<
        FormData
    >();
    const {
        tournamentReducer: { loading },
        tCategoryReducer: { listData: categoryList },
        tRuleTypeReducer: { listData: tRuleTypeList },
        currencyReducer: { listData: currencyList },
        tPaymentMethodReducer: { listData: paymentMethodList },
        tCategoriesGroupReducer: { listData: categoriesGroupList },
    } = useSelector((state: any) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        const selected = selectedItems;
        selected.itemsToAdd.length = 0;
        selected.itemsToRemove.length = 0;
        setSelectedItems(selected);
        const selectedGroups = selectedCategoryGroupItems;
        selected.itemsToAdd.length = 0;
        selected.itemsToRemove.length = 0;
        setSelectedCategoryGroupItems(selectedGroups);
        dispatch(getCategoryList());
        dispatch(getCurrencyList());
        dispatch(getRuleTypeList());
        dispatch(getPaymentMethodList());
        dispatch(getCategoriesGroupList());
        async function fetch() {
            if (id) {
                const response: any = await dispatch(get(id));
                const { 
                    description, 
                    max_participants,
                    description_price,
                    template_welcome_mail,
                    template_confirmation_mail,
                    amount,
                    participant_type,
                    date_register_from,
                    date_register_to,
                    date_from,
                    date_to,
                    status,
                    t_rule_type_id,
                    currency_id,
                    t_categories_id, 
                    t_category_type_id,
                    payments, 
                    groups  
                } = response;
                setValue("description", description);
                setValue("max_participants", max_participants);
                setValue("description_price", description_price);
                setValue("template_welcome_mail", template_welcome_mail);
                setValue("template_confirmation_mail", template_confirmation_mail);
                setValue("amount", amount);
                setValue("participant_type", participant_type);
                setValue("date_register_from", date_register_from);
                setValue("date_register_to", date_register_to);
                setValue("date_from", date_from);
                setValue("date_to", date_to);
                setValue("status", status);
                setValue("t_rule_type_id", t_rule_type_id);
                setValue("currency_id", currency_id);
                setValue("t_categories_id", t_categories_id);
                setValue("t_category_type_id", t_category_type_id);
                if (payments && payments.length > 0) {
                    setSelectedData(payments);
                    payments.forEach((element: any) => {
                        selectedItems.itemsToAdd.push(element);
                        setSelectedItems(selectedItems);
                    });
                }
                if (groups && groups.length > 0) {
                    setSelectedGroupsData(groups);
                    groups.forEach((element: any) => {
                        selectedCategoryGroupItems.itemsToAdd.push(element);
                        setSelectedItems(selectedCategoryGroupItems);
                    });
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

    const parseDate = (date: any) => moment(date).format('YYYY-MM-DD h:mm:ss');

    const handleForm = (form: any) => {
        const { date_register_from, date_register_to, date_from, date_to } = form;
        const body = {
            ...form,
            date_register_from: parseDate(date_register_from),
            date_register_to: parseDate(date_register_to),
            date_from: parseDate(date_from),
            date_to: parseDate(date_to),
            payments: selectedItems,
            groups: selectedCategoryGroupItems,
        }
        if (id) {
            dispatch(update({ id, ...body }));
        } else {
            dispatch(create(body));
        }
    };

    const handleExpandedPanel = (panel: string) => (
        event: React.ChangeEvent<{}>,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded ? panel : false);
    };

    const onPaymentMethodChange = (event: any, type: string, selected: any) => {
        let currentList = selectedItems;
        if (type === "add") {
            selected.forEach((element: any) => {
                const exist = currentList.itemsToAdd.find(
                    (e: any) => e.id === element.id
                );
                if (_.isEmpty(exist)) {
                    const exist = currentList.itemsToAdd.find(
                        (e: any) => e.id === element.id
                    );
                    if (!_.isEmpty(exist)) {
                        currentList.itemsToRemove.splice(currentList.itemsToRemove.findIndex((i: any) => i.id === element.id), 1);
                    }
                    currentList.itemsToAdd.push(element);
                }
            });
        }
        if (type === "remove") {
            selected.forEach((element: any) => {
                const exist = currentList.itemsToRemove.find(
                    (e: any) => e.id === element.id
                );
                if (_.isEmpty(exist)) {
                    const currentIndex = currentList.itemsToAdd.indexOf(element);
                    currentList.itemsToAdd.splice(currentIndex, 1);
                    currentList.itemsToRemove.push(element);
                }
            });
        }

        setSelectedItems(currentList);
    };

    const onCategoryGroupsChange = (event: any, type: string, selected: any) => {
        let currentList = selectedCategoryGroupItems;
        if (type === "add") {
            selected.forEach((element: any) => {
                const exist = currentList.itemsToAdd.find(
                    (e: any) => e.id === element.id
                );
                if (_.isEmpty(exist)) {
                    const exist = currentList.itemsToAdd.find(
                        (e: any) => e.id === element.id
                    );
                    if (!_.isEmpty(exist)) {
                        currentList.itemsToRemove.splice(currentList.itemsToRemove.findIndex((i: any) => i.id === element.id), 1);
                    }
                    currentList.itemsToAdd.push(element);
                }
            });
        }
        if (type === "remove") {
            selected.forEach((element: any) => {
                const exist = currentList.itemsToRemove.find(
                    (e: any) => e.id === element.id
                );
                if (_.isEmpty(exist)) {
                    const currentIndex = currentList.itemsToAdd.indexOf(element);
                    currentList.itemsToAdd.splice(currentIndex, 1);
                    currentList.itemsToRemove.push(element);
                }
            });
        }

        setSelectedCategoryGroupItems(currentList);
    };

    return (
        <Container component="main">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Torneo
        </Typography>
                <form
                    className={classes.form}
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            <ExpansionPanel
                                expanded={expanded === "panel-register"}
                                onChange={handleExpandedPanel("panel-register")}
                            >
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel-register-content"
                                    id="panel-register-header"
                                >
                                    <Typography className={classes.heading}>Datos</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container spacing={2} className={classes.dataContainer}>
                                        <Grid item xs={3}>

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
                                        <Grid item xs={3}>
                                            <CustomTextField
                                                placeholder="Maximo Participantes"
                                                field="max_participants"
                                                required
                                                register={register}
                                                errorsField={errors.max_participants}
                                                errorsMessageField={
                                                    errors.max_participants && errors.max_participants.message
                                                }
                                                type="number"
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomSelect
                                                label="Tipo Participantes"
                                                selectionMessage="Seleccione"
                                                field="participant_type"
                                                register={register}
                                                errorsMessageField={
                                                    errors.participant_type && errors.participant_type.message
                                                }
                                            >
                                                <option value={1}> Socios/Familiares </option>
                                                <option value={2}> Invidados </option>
                                                <option value={3}> Ambos </option>
                                            </CustomSelect>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomSelect
                                                label="Tipo Regla"
                                                selectionMessage="Seleccione"
                                                field="t_rule_type_id"
                                                required
                                                register={register}
                                                errorsMessageField={
                                                    errors.t_rule_type_id && errors.t_rule_type_id.message
                                                }
                                            >
                                                {tRuleTypeList.length > 0 && tRuleTypeList.map((item: any) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.description}
                                                    </option>
                                                ))}
                                            </CustomSelect>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomTextField
                                                placeholder="Descripcion Precio"
                                                field="description_price"
                                                required
                                                register={register}
                                                errorsField={errors.description_price}
                                                errorsMessageField={
                                                    errors.description_price && errors.description_price.message
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomSelect
                                                label="Categoria"
                                                selectionMessage="Seleccione"
                                                field="t_categories_id"
                                                required
                                                register={register}
                                                errorsMessageField={
                                                    errors.t_categories_id && errors.t_categories_id.message
                                                }
                                            >
                                                {categoryList.length > 0 && categoryList.map((item: any) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.description}
                                                    </option>
                                                ))}
                                            </CustomSelect>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomSelect
                                                label="Moneda"
                                                selectionMessage="Seleccione"
                                                field="currency_id"
                                                required
                                                register={register}
                                                errorsMessageField={
                                                    errors.currency_id && errors.currency_id.message
                                                }
                                            >
                                                {currencyList.length > 0 && currencyList.map((item: any) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.description}
                                                    </option>
                                                ))}
                                            </CustomSelect>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomTextField
                                                placeholder="Registro desde"
                                                field="date_register_from"
                                                required
                                                register={register}
                                                errorsField={errors.date_register_from}
                                                errorsMessageField={errors.date_register_from && errors.date_register_from.message}
                                                type="datetime-local"
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomTextField
                                                placeholder="Registro hasta"
                                                field="date_register_to"
                                                required
                                                register={register}
                                                errorsField={errors.date_register_to}
                                                errorsMessageField={errors.date_register_to && errors.date_register_to.message}
                                                type="datetime-local"
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomTextField
                                                placeholder="Fecha desde"
                                                field="date_from"
                                                required
                                                register={register}
                                                errorsField={errors.date_from}
                                                errorsMessageField={errors.date_from && errors.date_from.message}
                                                type="datetime-local"
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomTextField
                                                placeholder="Fecha hasta"
                                                field="date_to"
                                                required
                                                register={register}
                                                errorsField={errors.date_to}
                                                errorsMessageField={errors.date_to && errors.date_to.message}
                                                type="datetime-local"
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomSelect
                                                label="Status"
                                                selectionMessage="Seleccione"
                                                field="status"
                                                register={register}
                                                errorsMessageField={
                                                    errors.status && errors.status.message
                                                }
                                            >
                                                <option value={1}> Activo </option>
                                                <option value={0}> Inactivo </option>
                                            </CustomSelect>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <CustomSelect
                                                label="Status"
                                                selectionMessage="Seleccione"
                                                field="status"
                                                register={register}
                                                errorsMessageField={
                                                    errors.status && errors.status.message
                                                }
                                            >
                                                <option value={1}> Activo </option>
                                                <option value={0}> Inactivo </option>
                                            </CustomSelect>
                                        </Grid>
                                        <Grid xs={3}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>Plantilla Bienvenida</Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        startIcon={<CloudUploadIcon />}
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        component="span"
                                                    >
                                                        Archivo
                                            </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid xs={3}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>Plantilla de Confirmacion</Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        startIcon={<CloudUploadIcon />}
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        component="span"
                                                    >
                                                        Archivo
                                            </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                  
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            placeholder="Descripcion premiacion"
                                            field="description_price"
                                            required
                                            register={register}
                                            errorsField={errors.description_price}
                                            errorsMessageField={errors.description_price && errors.description_price.message}
                                            type="datetime-local"
                                            multiline
                                        />
                                    </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                    </Grid>

                    <Grid xs={12}>
                        <ExpansionPanel
                            expanded={expanded === "panel-guest"}
                            onChange={handleExpandedPanel("panel-guest")}
                        >
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel-guest-content"
                                id="panel-guest-header"
                            >
                                <Typography className={classes.heading}>Metodos de Pago</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        {paymentMethodList.length > 0 && (
                                            <TransferList
                                                data={paymentMethodList}
                                                selectedData={selectedData}
                                                leftTitle="Metodos de Pago"
                                                onSelectedList={onPaymentMethodChange}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>

                    <Grid xs={12}>
                        <ExpansionPanel
                            expanded={expanded === "panel-groups"}
                            onChange={handleExpandedPanel("panel-groups")}
                        >
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel-groups-content"
                                id="panel-groups-header"
                            >
                                <Typography className={classes.heading}>Grupos</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        {categoriesGroupList.length > 0 && (
                                            <TransferList
                                                data={categoriesGroupList}
                                                selectedData={selectedGroupsData}
                                                leftTitle="Grupos"
                                                onSelectedList={onCategoryGroupsChange}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
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
        </Container >
    );
};

export default TournamentForm;
