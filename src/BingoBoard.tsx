import { Box } from "@mui/system";
import BingoCard, { BingoOpts } from "./BingoCard";


export interface BingoBoardProps {
    size: number;
    data: BingoOpts[];
}

function BingoBoard(props: BingoBoardProps) {
    const rows = [];
    for(let i = 0; i < props.size; i++)
    {
        const row = [];
        for(let j = 0; j < props.size; j++)
        {
            const thing = props.data[i + j * props.size]
            row.push(
                <BingoCard 
                    sx={{
                        width: Math.floor(95 / props.size) + 'vw',
                        height: Math.floor(80 / props.size) + 'vh',
                        m: 1,
                        p: -2
                    }}
                    key={thing.key}
                    player={thing.player}
                    location={thing.location}
                    completed={thing.completed}
                    highlight={thing.highlight}
                ></BingoCard>
            )
        }
        rows.push(<Box key={i} flex="true" flexDirection="column">{row}</Box>);
    }

    // const pieces = thingies.map(thing => 
    // <BingoCard
    //     key={thing.key} 
    //     player={thing.player}
    //     location={thing.location}
    //     completed={thing.completed}
    // ></BingoCard>);

    return <Box display="flex" flexDirection="row" justifyContent="center" alignContent="stretch">{rows}</Box>;
}

export default BingoBoard;