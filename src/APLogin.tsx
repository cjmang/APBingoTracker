import { Box, Button, Snackbar, TextField, ToggleButton } from "@mui/material";
import React from "react";
import { Client, Item } from "archipelago.js";

export interface APLoginProps {
    slotDataCB: (data: BingoSlotData) => void;
    itemsReceived: (items: Item[]) => void;
    locationsChecked: (num: number, all: boolean) => void;
}

export interface BingoSlotData {
    boardLocations: string[];
    boardSize: number;
    requiredBingoCount: number;
}


function APLogin(props: APLoginProps) {
    const urlParams = new URLSearchParams(window.location.search);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [host, setHost] = React.useState(urlParams.get('host') || "archipelago.gg")
    const [port, setPort] = React.useState<string>(urlParams.get("port") || '');
    const [slotName, setSlotName] = React.useState<string>(urlParams.get("slotName") || '');
    const [snackOpen, setSnackOpen] = React.useState<boolean>(false);
    const [snackMessage, setSnackMessage] = React.useState<string>('');
    const [autoLoggedIn, setAutoLoggedIn] = React.useState<boolean>(false);
    const disabled = React.useMemo<boolean>(
        () => !(host && port && slotName),
        [host, port, slotName]
    );
    const buttonColor = React.useMemo<"standard" | "secondary">(
        () => disabled ? "standard" : "secondary",
        [disabled]
    );
    const client = new Client();
    client.options.autoFetchDataPackage = true;
    client.items.on("itemsReceived", props.itemsReceived)
    client.room.on("locationsChecked", e => props.locationsChecked(e.length, false));

    client.messages.on("disconnected", () => {
        setLoggedIn(false);
        setSnackMessage("Disconnected from the Archipelago Server");
        setSnackOpen(true);
    });
    
    const login = () => {
        if(!loggedIn) {
            setLoggedIn(true);
            setSnackMessage("Connecting to the Archipelago Server");
            setSnackOpen(true);
            const url = host.startsWith("wss://") || host.startsWith("ws://") ? `${host}:${port}` : `wss://${host}:${port}`;
            client.login(url, slotName!, "APBingo", {
                tags: ["Tracker"]
            }).then(jr => {
                props.slotDataCB(jr as any);
                props.itemsReceived(client.items.received)
                setSnackMessage("Successfully Connected");
                setSnackOpen(true);
                // props.bingosCompleted(toBingosCompleted(client.room.checkedLocations), true);
            }, (reason) => {
                setLoggedIn(false);
                setSnackMessage(reason.message);
                setSnackOpen(true);
            })
        }
    };

    const loginClick = () => {
        if(!loggedIn) {
            login();
        } else {
            client.socket.disconnect();
            setLoggedIn(false);
            setSnackMessage("Disconnected from the Archipelago Server");
            setSnackOpen(true);
            props.locationsChecked(0, true);
        }
    };

    const autoLogin = urlParams.get("autoLogin");
    if(autoLogin === "true" && !autoLoggedIn) {
        setAutoLoggedIn(true)
        login();
    }

    const copyConvenienceLink = () => {
        const url = new URL(window.location.pathname, window.location.origin);
        const params = new URLSearchParams({
            host: host,
            port: port,
            slotName: slotName,
            autoLogin: loggedIn.toString(),
        });
        navigator.clipboard.writeText(url.toString() + '?' + params.toString());
        setSnackMessage("Link Copied");
        setSnackOpen(true);
    };

    return (
        <Box display="inline-block" component="form">
            <Snackbar 
                open={snackOpen}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                autoHideDuration={3000}
                onClose={e => setSnackOpen(false)}
                message={snackMessage}
            ></Snackbar>
            <TextField 
                id="host" 
                label="Host" 
                required 
                disabled={loggedIn}
                value={host}
                onChange={e => setHost(e.target.value)}
                variant="outlined"></TextField>
            <TextField 
                id="port" 
                label="Port" 
                required 
                disabled={loggedIn}
                value={port} 
                onChange={e => setPort(e.target.value)}
                variant="outlined"></TextField>
            <TextField 
                id="slot_name" 
                label="Slot Name" 
                required 
                disabled={loggedIn}
                value={slotName} 
                onChange={e => setSlotName(e.target.value)}
                variant="outlined"></TextField>
            <ToggleButton 
                color={buttonColor}
                value={loggedIn}
                disabled={disabled}
                onClick={loginClick}
            >
                {loggedIn ? "Disconnect" : "Connect"}
            </ToggleButton>
            <Button id="copy_link" disabled={disabled} onClick={copyConvenienceLink}>CopyLink</Button>
        </Box>
    );
}

export default APLogin;