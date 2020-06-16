import React, { useEffect, FunctionComponent, useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";

import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get } from "../../actions/tCategoryActions";
import { getList } from "../../actions/tCategoryTypeActions";
import CustomSelect from "../FormElements/CustomSelect";
import { Grid } from "@material-ui/core";

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
    },
    pictureContainer: {
        maxWidth: 185
      },
      media: {
        height: 200
      }
}));

type FormData = {
    description: string;
    status: string;
    t_category_type_id: string;
    picture: string;
};

type ComponentProps = {
    id?: number;
};

const TCategoryForm: FunctionComponent<ComponentProps> = ({
    id
}) => {
    const [image, setImage] = useState({ preview: "", raw: "" });
    const [imageField, setImageField] = useState();
    const classes = useStyles();
    const { handleSubmit, register, errors, reset, setValue } = useForm<
        FormData
    >();
    const {
        tCategoryReducer: { loading },
        tCategoryTypeReducer: { listData: categoryTypeList },
    } = useSelector((state: any) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getList());
        async function fetch() {
            if (id) {
                const response: any = await dispatch(get(id));
                const { description, status, t_category_type_id, picture } = response;
                setValue("description", description);
                setValue("status", status);
                setValue("t_category_type_id", t_category_type_id);
                setValue("picture", picture);
                setImage({ ...image, preview: picture });
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

    const triggerClick = (input: any) => {
        if (input) {
            setImageField(input);
        }
    };

    const handleImage = () => {
        imageField.click();
        setImageField(imageField);
    };

    const loadImage = (e: any) => {
        const ObjecUrlImage = window.URL.createObjectURL(e.target.files[0]);
        setImage({
            preview: ObjecUrlImage,
            raw: e.target.files[0]
        });
        const reader: any = new FileReader();
        reader.onload = () => {
            setValue("picture", reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    return (
        <Container component="main">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Categoria
        </Typography>
                <form
                    className={classes.form}
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <Grid container spacing={3}>
                        <Grid xs={4}>
                            <Card className={classes.pictureContainer}>
                                <CardActionArea onClick={() => handleImage()}>
                                    <CardMedia className={classes.media} image={image.preview} />
                                </CardActionArea>
                            </Card>
                            <input
                                style={{ display: "none" }}
                                type="file"
                                id="load_image"
                                accept="image/*"
                                ref={triggerClick}
                                onChange={loadImage}
                            />
                            <input
                                style={{ display: "none" }}
                                name="picture"
                                ref={register}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <CustomTextField
                                        autoFocus
                                        placeholder="Description"
                                        field="description"
                                        required
                                        register={register}
                                        errorsField={errors.description}
                                        errorsMessageField={errors.description && errors.description.message}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomSelect
                                        label="Tipo Categoria"
                                        selectionMessage="Seleccione"
                                        field="t_category_type_id"
                                        required
                                        register={register}
                                        errorsMessageField={
                                            errors.t_category_type_id && errors.t_category_type_id.message
                                        }
                                    >
                                        {categoryTypeList.length > 0 && categoryTypeList.map((item: any) => (
                                            <option key={item.id} value={item.id}>
                                                {item.description}
                                            </option>
                                        ))}
                                    </CustomSelect>
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomSelect
                                        label="Status"
                                        selectionMessage="Seleccione"
                                        field="status"
                                        register={register}
                                        errorsMessageField={
                                            errors.status && errors.status.message
                                        }
                                        required
                                    >
                                        <option value={1}> Activo </option>
                                        <option value={0}> Inactivo </option>
                                    </CustomSelect>
                                </Grid>
                            </Grid>
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

export default TCategoryForm;
