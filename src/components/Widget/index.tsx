import React, { FunctionComponent } from "react";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import "./index.sass";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1)
      }
    },
    blue: {
      color: "#2980b9",
      backgroundColor: "#fff",
      width: theme.spacing(7),
      height: theme.spacing(7),
      padding: "0px"
    },
    icon: {
      fontSize: "50px"
    }
  })
);

type FormComponentProps = {
  title?: string;
  subTitle?: string;
  amount?: string;
  Icon: any;
  link?: any;
  internal?: boolean;
};

const Widgtet: FunctionComponent<FormComponentProps> = ({
  title,
  subTitle,
  amount,
  Icon,
  link,
  internal
}) => {
  const classes = useStyles();
  const history = useHistory();

  const renderLink = () => {
    if(internal) {
      return <div onClick={() => history.push(link)} style={{ cursor: 'pointer', color: "#2980b9" }} > Enlace </div>;
    }
    return <div></div>;
  }

  return (
    <Card className="widget-container__card">
      <div className="widget-container__widget">
        <div className="widget-container__avatar">
          <Avatar className={classes.blue}>
            <Icon className={classes.icon} />
          </Avatar>
        </div>
        <div className="widget-container__detail">
          <div className="widget-container__detail-title">{title}</div>
          {subTitle && (
            <div className="widget-container__detail-title">{subTitle}</div>
          )}
          {
            link ? renderLink()
              :
              <div className="widget-container__detail-amount">{amount}</div>
          }
        </div>
      </div>
    </Card>
  );
};

export default Widgtet;
