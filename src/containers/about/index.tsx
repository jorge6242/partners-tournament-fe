import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import { getList } from '../../actions/parameterActions'
import Helper from '../../helpers/utilities';

export default function About(){
    const dispatch = useDispatch();
    const { 
        parameterReducer: { listData: parameterList } 
    } = useSelector((state: any) => state);

    useEffect(() => {
        dispatch(getList());
    },[dispatch])

    const renderParameter = (param: string) => {
        const parameter = Helper.getParameter(parameterList, param);
        return (<Grid item xs={12}>{parameter.description}: {parameter.value}</Grid>)
    }    

    return (
        <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12} style={{ marginBottom: 10 }}><strong>Portal de Torneos</strong></Grid>
            {renderParameter("DB_VERSION")}
            {renderParameter("FRONTEND_VERSION")}
            {renderParameter("BACKEND_VERSION")}
        </Grid>
    )
}