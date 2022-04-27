import React, {useCallback, useState} from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  Snackbar,
  TextField
} from '@material-ui/core/';
import {Alert} from "@material-ui/lab";
import {FilecoinSnapApi} from "@pontem/aptosnap-types";
import {attoFilToFil, filToAttoFil} from "../../services/utils";
import {addHexPrefix, isHexPrefixed} from "../../util";

interface ITransferProps {
  network: string,
  api: FilecoinSnapApi | null,
  onNewMessageCallback: any
}

type AlertSeverity = "success" | "warning" | "info" | "error";

export const Transfer: React.FC<ITransferProps> = ({network, api, onNewMessageCallback}) => {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [gasLimit, setGasLimit] = useState<string>("1000");
  const [gasPrice, setGasPrice] = useState<string>("1");

  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("success" as AlertSeverity);
  const [message, setMessage] = useState("");

  const handleRecipientChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(event.target.value);
  }, [setRecipient]);

  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  }, [setAmount]);

  const handleGasLimitChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setGasLimit(event.target.value);
  }, [setGasLimit]);

  const handleGasPriceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setGasPrice(event.target.value);
  }, [setGasPrice]);

  const showAlert = (severity: AlertSeverity, message: string) => {
    setSeverity(severity);
    setMessage(message);
    setAlert(true);
  };

  const onSubmit = useCallback(async () => {
    if (!amount || !recipient || !api) {
      return;
    }
    const payload = {
        type: "script_function_payload",
        function: "0x1::TestCoin::transfer",
        typeArguments: [],
        arguments: [
            addHexPrefix(recipient),
            amount.toString(),
        ]
    };

    const signedMessageResponse = await api.signMessage({
      gasPrice: gasPrice.toString(),
      gasLimit: gasLimit.toString(),
      payload,
    });

    console.log(signedMessageResponse);

    if (signedMessageResponse.error != null) {
      showAlert("error", "Error on signing message");
    } else if (signedMessageResponse.error == null && !signedMessageResponse.confirmed) {
      showAlert("info", "Signing message declined");
    } else {
      showAlert("info", `Message signature: ${signedMessageResponse.signedMessage.signature.signature}`);
      const txResult = await api.sendMessage(signedMessageResponse.signedMessage);
      showAlert("info", `Message sent with hash: ${txResult.cid}`);
    }

    // clear form
    setAmount("");
    setRecipient("");
    setGasLimit("1000");
    setGasPrice("1");
    // inform to refresh messages display
    onNewMessageCallback();
  }, [amount, recipient, api, gasLimit, gasPrice, onNewMessageCallback]);

  return (
    <Card>
      <CardContent>
        <CardHeader title="Transfer"/>
        <Grid container alignItems="center" justify="space-between">
          <Grid item xs={12}>
            <TextField
              onChange={handleRecipientChange} size="medium" fullWidth id="recipient" label="Recipient"
              variant="outlined" value={recipient}>
            </TextField>
            <Box m="0.5rem"/>
            <TextField
              InputProps={{startAdornment: <InputAdornment position="start">XUS</InputAdornment>}}
              onChange={handleAmountChange} size="medium" fullWidth id="amount" label="Amount" variant="outlined"
              value={amount}>
            </TextField>
            <Box m="0.5rem"/>
            <TextField
              onChange={handleGasLimitChange} size="medium" fullWidth id="gasLimit" label="Gas Limit" variant="outlined"
              value={gasLimit}>
            </TextField>
            <Box m="0.5rem"/>
            <TextField
              InputProps={{startAdornment: <InputAdornment position="start">XUS</InputAdornment>}}
              onChange={handleGasPriceChange} size="medium" fullWidth id="gasPrice" label="Gas Price"
              variant="outlined" value={gasPrice}>
            </TextField>
            <Box m="0.5rem"/>
          </Grid>
        </Grid>
        <Box m="0.5rem"/>
        <Grid container item xs={12} justify="flex-end">
          {/*<Button onClick={onAutoFillGas} color="secondary" variant="contained" size="large" style={{marginRight: 10}}>AUTO*/}
          {/*  FILL GAS</Button>*/}
          <Button onClick={onSubmit} color="secondary" variant="contained" size="large">SEND</Button>
        </Grid>
        <Snackbar
          open={alert}
          autoHideDuration={6000}
          onClose={() => setAlert(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}>
          <Alert severity={severity} onClose={() => setAlert(false)}>
            {`${message} `}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};
