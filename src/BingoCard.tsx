import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import "./BingoCard.css";
import { SxProps, Theme } from '@mui/system';
export interface BingoOpts {
    key: string;
    player: string;
    location: string;
    completed: boolean;
    highlight?: boolean
    sx?: SxProps<Theme>;
}
function BingoCard(props: BingoOpts) {
    const clazz = props.completed ? 'bingo-completed' : 'bingo';
    return (
        <Card sx={props.sx} raised={!props.completed} className={clazz}>
           {/* <CardHeader title={opts.player}></CardHeader> */}
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <span className={"bingo-player" + (props.highlight ? " highlight" : "")}>{props.player}</span>
                <span className="bingo-location">{props.location}</span>
            </CardContent>
        </Card>
    );
}

export default BingoCard;