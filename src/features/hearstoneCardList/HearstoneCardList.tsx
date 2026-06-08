import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import StarIcon from "@mui/icons-material/Star";
import Container from "@mui/material/Container";

import HTMLReactParser from "html-react-parser";
import { JSX, useEffect, useState } from "react";
import { useGoldAppDispatch, useGoldAppSelector } from "../../app/hooks";
import { decrement, decrementByAmount, selectCount } from "./hearstoneCardListSlice";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Button } from "@mui/material";

interface HSCard {
    uniqId: string;
    artist?: string;
    cardClass?: string;
    dbfId: number;
    health: number;
    attack: number;
    heroPowerDbfId: number;
    id: string;
    name: string;
    set: string;
    type: string;
    rece: string;
    races?: Array<string>;
    techLevel: number;
    text: string;
    cost: number;
}
const EXCLUDED_SUFFIXES = ["_G", "_Gt", "_Buddy", "t", "t1", "t2", "t3", "t4", "pt6", "pt5", "SKIN_A", "SKIN_B", "SKIN_C", "SKIN_D"];
const TAVERN_SIZE = [3, 4, 4, 5, 5, 6, 7, 7];
const TAVERN_UPGRADE_COSE = [5, 7, 8, 11, 11, 13];

async function FetchCards(): Promise<HSCard[]> {
    const response = await fetch("https://api.hearthstonejson.com/v1/latest/enUS/cards.json", {});

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return (await response.json()) as HSCard[];
}

function filter_cards_tier(hsCards: HSCard[], currentTier: number) {
    const HSCardsFilteredType = hsCards.filter(({ type, set, id }) => {
        if (type !== "MINION") return false;
        if (set !== "BATTLEGROUNDS") return false;

        return !EXCLUDED_SUFFIXES.some((suffix) => id.endsWith(suffix));
    });

    return HSCardsFilteredType.filter((item) => item?.techLevel <= currentTier);
}

function refresh_tavern(currentPool: HSCard[] | undefined, currentTier: number): JSX.Element[] | JSX.Element {
    if (currentPool === undefined) {
        return <div>ERROR</div>;
    }
    const hsCardList = filter_cards_tier(currentPool, currentTier);
    const cardsIdxList = Array.from({ length: TAVERN_SIZE[currentTier - 1] }, () => {
        return Math.floor(Math.random() * hsCardList.length);
    });

    const returnList = cardsIdxList.map((item, index) => {
        return (
            <Grid size={1.7} key={hsCardList[item].id + String(index)}>
                <Card>
                    <Tooltip describeChild title={hsCardList[item].text ? HTMLReactParser(`<p>${hsCardList[item].text}</p>`) : ""}>
                        <CardActionArea>
                            <h3 className="card_name">{hsCardList[item].name} </h3>
                            <div className="card_tier">
                                <span className="card_tier">
                                    {[...Array(hsCardList[item].techLevel)].map((e, i) => (
                                        <span className="card_tier_star" key={i}>
                                            <StarIcon />
                                        </span>
                                    ))}
                                </span>
                            </div>
                            <div className="card_image">
                                <CardMedia component="img" src={`https://art.hearthstonejson.com/v1/256x/${hsCardList[item].id}.webp`} alt={hsCardList[item].id} />
                            </div>
                            <CardContent>
                                <div className="card_stats">
                                    <div className="card_attach">{hsCardList[item].attack}</div>
                                    <div className="card_health">{hsCardList[item].health}</div>
                                </div>
                            </CardContent>
                        </CardActionArea>
                    </Tooltip>
                </Card>
            </Grid>
        );
    });
    return returnList;
}
function HearstoneCardList() {
    const [hsCards, setHsCards] = useState<HSCard[]>();
    const [tavern, setTavern] = useState<JSX.Element[] | JSX.Element>(<div>Loading...</div>);
    const [tier, setTier] = useState<number>(1);

    const gold = useGoldAppSelector(selectCount);
    const dispatchGold = useGoldAppDispatch();

    function handleTierUpgrade() {
        if (gold < TAVERN_UPGRADE_COSE[tier - 1]) {
            return;
        }

        setTier(tier + 1);
        dispatchGold(decrementByAmount(TAVERN_UPGRADE_COSE[tier - 1]));
    }
    function handleRefreshTavernClick() {
        if (gold < 1) return;

        dispatchGold(decrement());
        setTavern(refresh_tavern(hsCards, tier));
    }

    useEffect(() => {
        /* clearance for dependence  */
        let cencel = false;

        const fetchData = async () => {
            try {
                if (cencel) return;
                const cards = await FetchCards();
                setHsCards(cards);
                setTavern(refresh_tavern(cards, tier));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        return () => {
            cencel = true;
        };
    }, []);

    if (!tavern) return <p>Loading...</p>;
    return (
        <Container maxWidth="xl">
            <h2>Heartstone Card List</h2>
            <h3>
                Current Tier: {tier}
                {tier < 6 ? ` - Upgrade: ${TAVERN_UPGRADE_COSE[tier]}gold` : ""}
            </h3>
            <h3>Gold: {gold}</h3>
            <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button type="button" onClick={handleRefreshTavernClick}>
                    Refresh
                </Button>

                <Button type="button" onClick={handleTierUpgrade} disabled={tier === 6 ? true : false}>
                    Upgrade Tier
                </Button>
            </ButtonGroup>

            <Grid container spacing={2}>
                {tavern}
            </Grid>
            <Grid container spacing={2}>
                {/* change this to my hand */}
                {tavern}
            </Grid>
        </Container>
    );
}

export default HearstoneCardList;
