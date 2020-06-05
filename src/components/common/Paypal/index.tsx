import React, { FunctionComponent } from 'react';
import { PayPalButton } from "react-paypal-button-v2";
import { Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
// import { setOrder  } from '../../../actions/webServiceActions';
import { updateModal } from '../../../actions/modalActions';
import snackBarUpdate from '../../../actions/snackBarActions';

interface ComponentProps {
    description: any;
    customId: any;
    amount: any;
    amountDetail: any;
    client: string;
    handleOrder: Function;
}

const Paypal: FunctionComponent<ComponentProps> = ({  description, customId, amount, amountDetail, client, handleOrder }) => {
    const dispatch = useDispatch();
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}><strong>Descripcion:</strong> {description}</Grid>
                    <Grid item xs={12}><strong>Monto:</strong> {amountDetail} USD</Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <PayPalButton
                    createOrder={(data: any, actions: any) => {
                        return actions.order.create({
                            purchase_units: [{
                                description,
                                custom_id: customId,
                                amount: {
                                    currency_code: "USD",
                                    value: amount
                                }
                            }],
                        });
                    }}
                    onApprove={(data: any, actions: any) => {
                        // Capture the funds from the transaction
                        dispatch(updateModal({
                            payload: {
                                isLoader: true,
                            }
                        }));
                        return actions.order.capture().then((details: any) => {
                            // Show a success message to your buyer
                            // alert("Transaction completed by " + details.payer.name.given_name);
                            // OPTIONAL: Call your server to save the transaction
                            handleOrder(data.orderID);
                        });
                    }}
                    options={{
                        clientId: client
                    }}
                    catchError={(data: any) => {
                        console.log('catchError ', data);
                        dispatch(updateModal({
                            payload: {
                                isLoader: false,
                            }
                        }));
                        dispatch(snackBarUpdate({
                            payload: {
                              message: `Su Pago no pudo ser procesado <br> Mensaje de Error de Paypal: ${data}`,
                              status: true,
                              type: "error",
                            },
                          }))
                    }}
                    onError={(data: any) => {
                        dispatch(updateModal({
                            payload: {
                                isLoader: false,
                            }
                        }));
                        dispatch(snackBarUpdate({
                            payload: {
                              message: `Su Pago no pudo ser procesado <br> Mensaje de Error de Paypal: ${data}`,
                              status: true,
                              type: "error",
                            },
                          }))
                    }}
                />
            </Grid>
        </Grid>
    );
}

export default Paypal;