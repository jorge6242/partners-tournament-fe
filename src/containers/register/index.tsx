import React from "react";
import { Grid } from "@material-ui/core";

import RegisterForm from '../../components/RegisterForm';

export default function Register() {
  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <RegisterForm />
      </Grid>
    </Grid>
  );
}
