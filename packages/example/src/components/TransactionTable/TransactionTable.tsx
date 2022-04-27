import React from "react";
import {Paper, Table, TableContainer, TableCell,
    TableRow, TableHead, TableBody} from '@material-ui/core/';
import {MessageStatus} from "@pontem/aptosnap-types";

export interface TransactionTableProps {
    txs: MessageStatus[];
}

function shortly(value: string | undefined) {
    if(value) {
        return value.slice(0, 6) + '...' + value.slice(-6)
    }
}

export const TransactionTable = (props: TransactionTableProps) => {
    return (
        <TableContainer className="transtaction-table" component={Paper}>
            <Table
            aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Hash</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Sender</TableCell>
                    <TableCell align="center">Destination</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Gas Limit</TableCell>
                    <TableCell align="center">Gas Price</TableCell>
                    <TableCell align="center">Gas Used</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {props.txs.map(tx => (
                    <TableRow key={tx.cid}>
                    <TableCell  align="left" component="th" scope="row">
                        {tx.cid}
                    </TableCell>
                    <TableCell  align="center" component="th" scope="row">
                        {tx.status}
                    </TableCell>
                    <TableCell align="center">{shortly(tx.message.sender)}</TableCell>
                    <TableCell align="center">{shortly(tx.transaction?.payload?.arguments[0])}</TableCell>
                    <TableCell align="center">{tx.transaction?.payload?.arguments[1]}</TableCell>
                    <TableCell align="center">{tx.message.gasLimit}</TableCell>
                    <TableCell align="center">{tx.message.gasPrice} XUS</TableCell>
                    <TableCell align="center">{tx.transaction?.gas_used}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
