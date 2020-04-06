import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useLocation } from "react-router-dom";
import queryString from 'query-string';

import './index.sass';
import { getAll, getClient } from "../../actions/personActions";
import { updateModal } from "../../actions/modalActions";
import PersonForm from "../../components/PersonForm";
import DataTable4 from '../../components/DataTable4';
import Columns from '../../interfaces/StatusAccountColumns';
import { getStatusAccount } from "../../actions/webServiceActions";
import { Grid } from "@material-ui/core";
import { setForcedLogin } from "../../actions/loginActions";

const columns: Columns[] = [
  {
    id: "fact_num",
    label: "Nro", minWidth: 20,
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "fec_emis",
    label: "Emision", minWidth: 20,
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "descrip",
    label: "Description", minWidth: 20,
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "tipo",
    label: "Tipo", minWidth: 20,
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "total_fac",
    label: "Debe", minWidth: 20,
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "saldo",
    label: "Haber", minWidth: 20,
    component: (value: any) => <span>{value.value}</span>,
  },
  {
    id: "acumulado",
    label: "Acumulado", minWidth: 20,
    component: (value: any) => <span>{value.value}</span>,
  },
];

export default function StatusAccount() {
  const dispatch = useDispatch();
  const { statusAccountList, setStatusAccountLoading } = useSelector((state: any) => state.webServiceReducer);
  const { client } = useSelector((state: any) => state.personReducer);
  const { user } = useSelector((state: any) => state.loginReducer);
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      const values = queryString.parse(location.search);
      if (!_.isEmpty(values) && values.socio && values.token) {
        await dispatch(setForcedLogin(values.socio, values.token));
        dispatch(getStatusAccount());
      } else {
        dispatch(getStatusAccount());
      }
    }
    fetchData();
  }, [dispatch]);

  //replace(/[0-9]/g, "X")
  // var str = "1234123412341234";
  // var res = `${str.substring(0, 12).replace(/[0-9]/g, "x")}${str.substring(12, 16)}`;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>Estado de Cuenta</Grid>
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
      <Grid item xs={12}>
        <DataTable4
          rows={statusAccountList.data}
          columns={columns}
          loading={setStatusAccountLoading}
          aditionalColumn={statusAccountList.total}
          aditionalColumnLabel="Total"
        /></Grid>
    </Grid>
  );
}
