import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import _ from 'lodash';
import { useForm } from "react-hook-form";

import { getList as getTCategoryList } from '../../actions/tCategoryActions';
import { getList as getTournamentList } from '../../actions/tournamentActions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import CustomSelect from '../../components/FormElements/CustomSelect';
import Upload from '../../components/FormElements/Upload';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
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
            width: 150
        },
        stepContainer: {
            marginBottom: 50,
        },
        familyTitle: {
            fontSize: "14px",
        },
        cardContent: {
            textAlign: 'center',
            padding: 0,
            "&:last-child": {
                paddingBottom: 0
            }
        },
        activeCard: {
            boxShadow: "0px 0px 20px 0px #3F51B5"
        },
        rootTournamentCard: {
            width: 150
        },
        actionButtons: {
            textAlign: 'right',
        },
        form: {
            width: "100%", // Fix IE 11 issue.
            marginTop: theme.spacing(1)
        },
    }),
);

type FormData = {
    t_payment_methods_id: number;
    t_categories_groups_id: number;
};

export default function NewTournament() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedTournament, setSelectedTournament] = useState<any>(null);
    const [selectedPayment, setSelectedPayment] = useState<any>("");
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const steps = getSteps();
    const dispatch = useDispatch();

    const { handleSubmit, register, errors, reset, getValues, setValue, watch } = useForm<
        FormData
    >();

    const {
        tCategoryReducer: { listData: tCategoryList },
        tournamentReducer: { listData: tournamentList },
        loginReducer: { user },
    } = useSelector((state: any) => state);

    useEffect(() => {
        dispatch(getTCategoryList());
        dispatch(getTournamentList());
    }, [])

    const handleForm = (form: object) => {
        console.log('form ', form);
        // if (id) {
        //   dispatch(update({ id, ...form }));
        // } else {
        //   dispatch(create(form));
        // }
    };

    const handleSelectCategory = (row: any) => {
        setSelectedCategory(row);
    }

    const handleSelectTournament = (row: any) => {
        setSelectedTournament(row);
    }

    const renderTournaments = () => {
        return (
            <Grid container spacing={3} style={{ marginTop: 30 }}>
                <Grid item xs={12}>Torneos Activos</Grid>
                {
                    tournamentList.map((element: any, i: number) => {
                        const active = selectedTournament && selectedTournament.id === element.id ? classes.activeCard : "";
                        return (
                            <Grid item xs={2} key={i}>
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
                                            <Typography color="textPrimary" className={classes.familyTitle}>
                                                {element.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        )
    }

    function SelectCategory() {
        const { name, last_name, phone_number, email } = user;
        return (
            <Grid container spacing={3}>
                <Grid item xs={6}><strong>Nombre:</strong> {name}</Grid>
                <Grid item xs={6}><strong>Apellido:</strong>{last_name}</Grid>
                <Grid item xs={6}><strong>Telefono:</strong>{phone_number}</Grid>
                <Grid item xs={6}><strong>Correo:</strong>{email}</Grid>
                <Grid item xs={12}>Seleccione una categoria adecuada</Grid>
                <Grid container spacing={3}>
                    {
                        tCategoryList.map((element: any, i: number) => {
                            const active = selectedCategory && selectedCategory.id === element.id ? classes.activeCard : "";
                            return (
                                <Grid item xs={2} key={i}>
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
                                                <Typography color="textPrimary" className={classes.familyTitle}>
                                                    {element.description}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                    {!_.isEmpty(selectedCategory) && tournamentList.length > 0 && renderTournaments()}
                </Grid>
            </Grid>
        )
    }

    const getParticipants = (type: any) => {
        if (type === "1") return 'Socios/Familiares';
        if (type === "2") return 'Invitados';
        return 'Ambos';
    }

    const handlePayment = (event: any) => {
        setSelectedPayment(event.target.value);
    }

    function TournamentDetails() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}><strong>Categoria:</strong> {selectedCategory.description}</Grid>
                <Grid item xs={12}><strong>Nombre del Torneo:</strong> {selectedTournament.description}</Grid>
                <Grid item xs={6}><strong>Fecha:</strong> {moment(selectedTournament.date_register_from).format("DD-MM-YY")}</Grid>
                <Grid item xs={6}><strong>Fin Registro:</strong> {moment(selectedTournament.date_register_to).format("DD-MM-YY")}</Grid>
                <Grid item xs={12}><strong>Tipo de Reglas:</strong> {selectedTournament.rules.description}</Grid>
                <Grid item xs={12}><strong>Tipo de Participantes:</strong> {getParticipants(selectedTournament.participant_type)}</Grid>
                <Grid item xs={2}><strong>Monto:</strong> {selectedTournament.currency.description} {selectedTournament.amount}</Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}><strong>Metodo de Pago</strong></Grid>
                <Grid item xs={3}>
                    <div className="custom-select-container">
                        <select
                            name="relation"
                            onChange={handlePayment}
                            style={{ fontSize: "13px" }}
                            value={selectedPayment}
                        >
                            <option value="pers">Seleccione</option>
                            {selectedTournament.payments.map((item: any, i: number) => (
                                <option value={item.id}>{item.share_number}</option>
                            ))}
                        </select>
                    </div>
                </Grid>
                <Grid item xs={12}>Comprobante de inscripcion
                    <Upload field="attach_file"
                        label="Archivo"
                        register={register}
                        setValue={setValue} /></Grid>

                <Grid item xs={3}>
                    <CustomSelect
                        selectionMessage="Seleccione Grupo"
                        field="t_categories_groups_id"
                        required
                        register={register}
                        errorsMessageField={
                            errors.t_categories_groups_id && errors.t_categories_groups_id.message
                        }
                    >
                        {selectedTournament.groups.map((item: any) => (
                            <option key={item.id} value={item.id}>
                                {item.description}
                            </option>
                        ))}
                    </CustomSelect>
                </Grid>
                <Grid item xs={12}>
                    <strong>Tus detalles personales</strong>
                </Grid>
                <Grid item xs={12}>
                    <strong>Descripcion:</strong> {selectedTournament.descripcion_details}
                </Grid>


            </Grid>
        )
    }

    function getSteps() {
        return ['Seleccione Torneo', 'Registro de Torneo', 'Confirmacion'];
    }

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <SelectCategory />;
            case 1:
                return <TournamentDetails />;
            case 2:
                return 'Confirmacion';
            default:
                return 'Unknown step';
        }
    }

    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div className={classes.root}>
            <form
                className={classes.form}
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >
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
                <div >
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={handleReset} className={classes.button}>
                                Reset
                            </Button>
                        </div>
                    ) : (
                            <div>
                                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                <div className={classes.actionButtons}>
                                    <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                        Regresar
                                </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                                    </Button>
                                </div>
                            </div>
                        )}
                </div>
            </form>
        </div>
    );
}
