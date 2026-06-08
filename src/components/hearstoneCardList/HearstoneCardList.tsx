import HTMLReactParser from "html-react-parser";
import { ForwardedRef, forwardRef, JSX, useEffect, useRef, useState } from "react";
import { useGoldAppDispatch, useGoldAppSelector } from "../../app/hooks";
import { decrement, decrementByAmount, selectCount } from "../../store/currency/sliceGold";
import { Button, ButtonGroup, Container, Grid } from "@mui/material";
import { DraggableCore } from "react-draggable";
import Draggable from "react-draggable";
import CardComponent from "../CardComponent/CardComponent";

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

function useRefreshTavern(currentPool: HSCard[] | undefined, currentTier: number): JSX.Element[] | JSX.Element {
    const nodeRef = useRef<HTMLDivElement | null>(null);

    if (currentPool === undefined) {
        return <div>ERROR</div>;
    }
    const hsCardList = filter_cards_tier(currentPool, currentTier);
    const cardsIdxList = Array.from({ length: TAVERN_SIZE[currentTier - 1] }, () => {
        return Math.floor(Math.random() * hsCardList.length);
    });

    const returnList = cardsIdxList.map((item, index) => {
        return (
            <Draggable nodeRef={nodeRef}>
                <CardComponent item={hsCardList[item]} ref={nodeRef} />
            </Draggable>
        );
    });
    return returnList;
}

function HearstoneCardList() {
    const [hsCards, setHsCards] = useState<HSCard[]>();
    const [tavern, setTavern] = useState<JSX.Element[] | JSX.Element>(<div>Loading...</div>);
    const [tier, setTier] = useState<number>(1);

    const [playerPool, setPlayerPool] = useState<JSX.Element[]>();

    const gold = useGoldAppSelector(selectCount);
    const dispatchGold = useGoldAppDispatch();

    function handleTierUpgrade() {
        if (gold < TAVERN_UPGRADE_COSE[tier - 1]) {
            return;
        }

        setTier(tier + 1);
        dispatchGold(decrementByAmount(TAVERN_UPGRADE_COSE[tier - 1]));
    }
    // function useRefreshTavernClick() {
    //     if (gold < 1) return;

    //     dispatchGold(decrement());
    //     setTavern(useRefreshTavern(hsCards, tier));
    // }

    useEffect(() => {
        /* clearance for dependence  */
        let cencel = false;

        const useFetch = async () => {
            try {
                if (cencel) return;
                const cards = await FetchCards();

                setHsCards(cards);
                setTavern(useRefreshTavern(cards, tier));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        useFetch();
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
            <ButtonGroup variant="contained" aria-label="Basic button group" className="my-6">
                <Button type="button" onClick={() => console.log("foo")}>
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
                {playerPool}
            </Grid>
        </Container>
    );
}

export default HearstoneCardList;
