import React from "react";
import "./App.css";
import BingoBoard from "./BingoBoard";
import {
  Box,
  CircularProgress,
  createTheme,
  CssBaseline,
  LinearProgress,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { BingoOpts } from "./BingoCard";
import APLogin, { BingoSlotData } from "./APLogin";
import { Item } from "archipelago.js";

const darkTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
  },
});

const thingies: BingoOpts[][] = [];

for (let i = 0; i < 5; i++) {
  thingies.push([]);
}

for (let i = 0; i < 25; i++) {
  thingies[i % 5].push({
    key: "foo" + i,
    player: "foo",
    location: "bar" + i,
    completed: i % 2 === 0,
  });
}

// First group is location, second group is player
const boardLocationRE = /(.*?)\s*\(([^()]*)\)[^()]*?$/;

function App() {
  // const [apData, setAPData] = React.useState({host: "archipelago.gg"})
  const [slotData, setSlotData] = React.useState<BingoSlotData>();
  const [search, setSearch] = React.useState<string>("");
  const [itemsReceived, setItemsReceived] = React.useState<Item[]>([]);
  const [bingosCompleted, setBingosCompleted] = React.useState<number>(0);
  const bingosNeeded = React.useMemo(
    () => slotData?.requiredBingoCount || 1,
    [slotData]
  );
  const boardSetup = React.useMemo(() => {
    if (slotData == null) {
      return [];
    }
    const itemSet = new Set<string>();
    for (const item of itemsReceived) {
      itemSet.add(item.locationName);
    }
    const result: BingoOpts[] = [];
    for (const datum of slotData.boardLocations) {
      const matches = datum.match(boardLocationRE);
      // console.log(matches);
      if (matches) {
        result.push({
          key: datum,
          location: matches[1],
          player: matches[2],
          completed: itemSet.has(matches[1]),
          highlight: !!search && matches[2].toLowerCase().includes(search),
        });
      }
    }
    return result;
  }, [slotData, search, itemsReceived]);
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          sx={{
            m: 2,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              color="secondary"
              variant="determinate"
              value={(bingosCompleted / bingosNeeded) * 100}
            ></LinearProgress>
          </Box>
          <Box display="flex" sx={{m:1}} justifyContent="space-between">
            <Box display="flex" flexWrap="nowrap">
              <TextField
                id="search"
                label="Player Search"
                value={search}
                // sx={{m:2}}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              ></TextField>
            </Box>
            <APLogin
              slotDataCB={setSlotData}
              itemsReceived={setItemsReceived}
              bingosCompleted={(num: number, all: boolean) => {
                console.log(num, all);
                console.log(bingosCompleted);
                setBingosCompleted(all ? num : num + bingosCompleted);
              }}
            />
          </Box>
        </Box>
        {slotData != null ? (
          <BingoBoard size={slotData?.boardSize} data={boardSetup}></BingoBoard>
        ) : null}
      </ThemeProvider>
    </div>
  );
}

export default App;
