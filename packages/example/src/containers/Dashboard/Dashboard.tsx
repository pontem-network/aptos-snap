import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    Box, Card, CardContent, CardHeader,
    Container, Grid, Hidden, InputLabel, MenuItem, Select, Typography,
} from '@material-ui/core/';
import {MetaMaskConnector} from "../MetaMaskConnector/MetaMaskConnector";
import {MetaMaskContext} from "../../context/metamask";
import {Account} from "../../components/Account/Account";
import {FilecoinSnapApi, MessageStatus} from "@pontem/aptosnap-types";
import {TransactionTable} from "../../components/TransactionTable/TransactionTable";
import {SignMessage} from "../../components/SignMessage/SignMessage";
import {Transfer} from "../../components/Transfer/Transfer";
import Footer from "../../Footer";

export const Dashboard = () => {

    const [state] = useContext(MetaMaskContext);

    const [balance, setBalance] = useState("");
    const [address, setAddress] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [messages, setMessages] = useState<MessageStatus[]>([]);
    const [networks, setNetworks] =  useState<"aptos">("aptos")

    const [balanceChange, setBalanceChange] = useState<boolean>(false);

    const [network, setNetwork] = useState<"aptos" >("aptos");

    const [api, setApi] = useState<FilecoinSnapApi|null>(null);

    const handleNetworkChange = async (event: React.ChangeEvent<{value: any}>) => {
        const selectedNetwork = event.target.value as "aptos";
        if (selectedNetwork === network) return;
        if (api) {
            try {
                await api.configure({network: selectedNetwork});
                setNetworks(selectedNetwork)
                setNetwork(selectedNetwork);
                setMessages(await api.getMessages());
            } catch(e) {
                console.error("Unable to change network", e)
            }
        }
    };

    const handleNewMessage = useCallback(async () => {
        if (api) {
            setMessages(await api.getMessages());
        }
    }, [api, setMessages]);

    useEffect(() => {
        (async () => {
            if (state.filecoinSnap.isInstalled && state.filecoinSnap.snap) {
                const filecoinApi = await state.filecoinSnap.snap.getFilecoinSnapApi();
                setApi(filecoinApi);
            }
        })();
    }, [state.filecoinSnap.isInstalled, state.filecoinSnap.snap]);

    useEffect(() => {
        (async () => {
            if (api) {
                setAddress(await api.getAddress());
                setPublicKey(await api.getPublicKey());
                setBalance(await api.getBalance());
                setMessages(await api.getMessages());
            }
        })();
    }, [api, network]);

    useEffect( () => {
        // periodically check balance
        const interval = setInterval(async () => {
            if (api) {
                const newBalance = await api.getBalance();
                if (newBalance !== balance) {
                    setBalanceChange(true);
                    setBalance(newBalance);
                } else {
                    setBalanceChange(false)
                }

                const uncompleted = await api.updateMessagesStatus();
                console.log('have uncompleted', uncompleted);
                if(uncompleted.length) {
                    setMessages(await api.getMessages())
                }
            }
        }, 1000); // every 1 seconds ~ 1 epoch
        return () => clearInterval(interval);
    }, [api, balance, setBalance, setBalanceChange]);

    return (
        <Container maxWidth="lg">
            <Grid direction="column" alignItems="center" justify="center" container spacing={3}>
                <Box m="2rem" style={{textAlign: "center"}}>
                    <Typography variant="h2">
                        Aptos Demo
                    </Typography>
                    <Typography style={{color: "gray", fontStyle: "italic"}} variant="h6">
                        Aptosnap enables Aptos network inside Metamask.
                    </Typography>
                </Box>
                <Hidden xsUp={state.filecoinSnap.isInstalled}>
                    <MetaMaskConnector/>
                </Hidden>
                <Hidden xsUp={!state.filecoinSnap.isInstalled}>
                    <Box m="1rem" alignSelf="baseline">
                        <InputLabel>Network</InputLabel>
                        <Select
                            onChange={handleNetworkChange}
                            value={networks}
                        >
                            <MenuItem value={"aptos"}>Aptos</MenuItem>
                        </Select>
                    </Box>
                    <Grid container spacing={3} alignItems="stretch">
                        <Grid item md={6} xs={12}>
                            <Account
                                address={address}
                                balance={balance + " XUS"}
                                publicKey={publicKey}
                                api={api}
                                balanceChange={balanceChange}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Transfer api={api} network={network} onNewMessageCallback={handleNewMessage} />
                        </Grid>
                    </Grid>
                    <Box m="1rem"/>
                    <Grid container spacing={3} alignItems={"stretch"}>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader title="Account transactions"/>
                                <CardContent>
                                    <TransactionTable txs={messages}/>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Hidden>
            </Grid>
        </Container>
    );
};
