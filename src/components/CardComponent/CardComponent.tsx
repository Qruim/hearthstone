import { Card, CardActionArea, CardContent, CardMedia, Grid, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import HTMLReactParser from "html-react-parser";
import Draggable from "react-draggable";
import { ForwardedRef, forwardRef } from "react";

interface CardComponentProps {
    item: HSCard;
    ref: ForwardedRef<HTMLDivElement>;
}
const CardComponent = forwardRef<HTMLDivElement, CardComponentProps>((props, ref) => {
    const { item } = { ...props };

    return (
        <div ref={ref}>
            <Card>
                <Tooltip describeChild title={item.text ? HTMLReactParser(`<p>${item.text}</p>`) : ""}>
                    <CardActionArea>
                        <h3 className="card_name">{item.name} </h3>
                        <div className="card_tier">
                            <span className="card_tier">
                                {[...Array(item.techLevel)].map((e, i) => (
                                    <span className="card_tier_star" key={i}>
                                        <StarIcon />
                                    </span>
                                ))}
                            </span>
                        </div>
                        <div className="card_image">
                            <CardMedia component="img" src={`https://art.hearthstonejson.com/v1/256x/${item.id}.webp`} alt={item.id} />
                        </div>
                        <CardContent>
                            <div className="card_stats">
                                <div className="card_attach">{item.attack}</div>
                                <div className="card_health">{item.health}</div>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Tooltip>
            </Card>
        </div>
    );
});

export default CardComponent;
