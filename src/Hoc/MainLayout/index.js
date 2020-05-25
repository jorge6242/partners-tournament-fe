import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";

import { setupInterceptors } from "../../actions/loginActions";

export default function MainLayout(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setupInterceptors());
  }, [dispatch]);
  return <div> {props.children} </div>;
}
