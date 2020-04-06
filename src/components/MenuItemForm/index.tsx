import React, { useEffect, FunctionComponent } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get, getList } from "../../actions/menuItemActions";
import { Grid } from "@material-ui/core";
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
    name: string;
    slug: string;
    description: string;
    parent: number;
    order: string;
    route: string;
    menu_id: string;
};

type ComponentProps = {
    id?: number;
};

const MenuItemForm: FunctionComponent<ComponentProps> = ({
    id
}) => {
    const classes = useStyles();
    const { handleSubmit, register, errors, reset, setValue } = useForm<
        FormData
    >();
    const {
        menuItemReducer: { loading, setParentsLoading, listData: parents },
    } = useSelector((state: any) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getList());
        async function fetch() {
            if (id) {
                const response: any = await dispatch(get(id));
                const { name, slug, description, route, menu_id, parent } = response;
                setValue("name", name);
                setValue("slug", slug);
                setValue("description", description);
                setValue("route", route);
                setValue("parent", parent);
                setValue("menu_id", menu_id);
            }
        }
        fetch();
    }, [id, dispatch, setValue]);

    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    const handleForm = (form: any) => {
        const body = {
            ...form,
            name: form.description
        }
        if (id) {
            dispatch(update({ id, ...body }));
        } else {
            dispatch(create(body));
        }
    };

    return (
        <Container component="main">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Menu Item
        </Typography>
                <form
                    className={classes.form}
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <CustomTextField
                                placeholder="Nombre"
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
                            <CustomTextField
                                placeholder="Clave"
                                field="slug"
                                required
                                register={register}
                                errorsField={errors.slug}
                                errorsMessageField={
                                    errors.slug && errors.slug.message
                                }
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <CustomTextField
                                placeholder="Orden"
                                field="order"
                                required
                                register={register}
                                errorsField={errors.order}
                                errorsMessageField={
                                    errors.order && errors.order.message
                                }
                                inputType="number"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <CustomTextField
                                placeholder="Ruta"
                                field="route"
                                required
                                register={register}
                                errorsField={errors.route}
                                errorsMessageField={
                                    errors.route && errors.route.message
                                }
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <CustomSelect
                                label="Menu Padre"
                                selectionMessage="Seleccione"
                                field="parent"
                                register={register}
                                errorsMessageField={
                                    errors.parent && errors.parent.message
                                }
                                loading={setParentsLoading}
                                optionValueSelected={0}
                            >
                                {parents.length > 0 && parents.map((item: any) => (
                                    <option key={item.id} value={item.id}>
                                        {item.description}
                                    </option>
                                ))}
                            </CustomSelect>
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

export default MenuItemForm;
