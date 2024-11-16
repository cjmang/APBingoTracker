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
  const [itemSet, setItemSet] = React.useReducer<(a:Set<number>,b: Set<number>) => Set<number>, Set<number>>((state: Set<number>, action: Set<number>) => {
    if(action != null) {
      state.forEach(s => {action.add(s);});
      return action;
    }
    return state;
  },new Set<number>(), (arg: Set<number>) => arg);
  const bingosNeeded = React.useMemo(
    () => slotData?.requiredBingoCount || 1,
    [slotData]
  );

  React.useEffect(() => {
    const tempSet = new Set<number>();
    if(!slotData)
    {
      return;
    }
    for (const item of itemsReceived) {
      const name = item.name;
      const row = (name.charCodeAt(0) - 65) * slotData.boardSize;
      tempSet.add(row + Number.parseInt(name.slice(1)) - 1);
    }
    setItemSet(tempSet);
  }, [itemsReceived, slotData])

  const boardSetup = React.useMemo(() => {
    if (slotData == null) {
      return [];
    }
    const result: BingoOpts[] = [];
    let i = 0;
    for (const datum of slotData.boardLocations) {
      const matches = datum.match(boardLocationRE);
      if (matches) {
        result.push({
          key: datum,
          location: matches[1],
          player: matches[2],
          completed: itemSet.has(i),
          highlight: !!search && matches[2].toLowerCase().includes(search),
        });
      }
      i++;
    }
    return result;
  }, [slotData, search, itemSet]);

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
