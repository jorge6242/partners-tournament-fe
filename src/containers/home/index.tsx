import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
// import CardMembershipIcon from "@material-ui/icons/CardMembership";
// import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
// import FaceIcon from "@material-ui/icons/Face";
// import PersonIcon from "@material-ui/icons/Person";
// import FunctionsIcon from "@material-ui/icons/Functions";
// import BlockIcon from "@material-ui/icons/Block";
// import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
// import CreditCardIcon from "@material-ui/icons/CreditCard";
// import CakeIcon from "@material-ui/icons/Cake";
import { useDispatch, useSelector } from "react-redux";

import Widgtet from "../../components/Widget";
// import Chart from "../../components/chart";
import { Paper } from "@material-ui/core";
// import {
//   getPartnerStatistics,
//   getFamilyStatistics,
//   getGuestStatistics,
//   getPersonsStatistics,
//   getPersonsExceptionStatistics,
//   getPersonsBirthdayStatistics
// } from "../../actions/personActions";
import Loader from "../../components/common/Loader";
import { getRecordStatistics } from "../../actions/recordActions";
import { getCardStatistics } from "../../actions/cardPersonActions";
import { getPartnerFamilyStatistics, getGuestStatistics as getGuestStatisticsGraph } from "../../actions/accessControlActions";
import { getBalance } from "../../actions/webServiceActions";
import { getWidgetList } from "../../actions/menuActions";

const useStyles = makeStyles({
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  widgetContainer: {
    marginBottom: "100px"
  }
});

export default function Home() {
  const classes = useStyles();
  const {
    webServiceReducer: {
      clientBalance,
    },
    menuReducer: {
      widgetList,
      setWidgetLoading
    }
  } = useSelector((state: any) => state);
  const dispatch = useDispatch();
  
  const validateWidget = (value: string) => {
    const isValid = widgetList.find((e: any) => e.slug === value);
    if(isValid) {
      return true
    }
    return false;
  }


  return (
    <div className="home-container">
      <Grid container spacing={3} className={classes.widgetContainer}>
        { validateWidget('PARTNEREVENTOS_inscripcion') &&
          <Grid item xs={3}>
          {setWidgetLoading ? (
            <Loader />
          ) : (
            <Paper>
              <Widgtet
                Icon={EventAvailableIcon}
                title="Inscribirse"
                amount={clientBalance.saldo}
                link="/dashboard/tournament-new"
                internal
              />
            </Paper>
          )}
        </Grid>
        }

{ validateWidget('PARTNEREVENTOS_mis-eventos') &&
          <Grid item xs={3}>
          {setWidgetLoading ? (
            <Loader />
          ) : (
            <Paper>
              <Widgtet
                Icon={GroupAddIcon}
                title="Mis Eventos"
                amount={clientBalance.saldo}
                link="/dashboard/participant-inscriptions"
                internal
              />
            </Paper>
          )}
        </Grid>
        }
      </Grid>
    </div>
  );
}
