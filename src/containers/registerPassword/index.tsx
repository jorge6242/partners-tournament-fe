import React from "react";
import { Grid } from "@material-ui/core";

import RegisterPasswordForm from '../../components/RegisterPasswordForm';

export default function RegisterPassword() {
  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <RegisterPasswordForm />
      </Grid>
    </Grid>
  );
}
