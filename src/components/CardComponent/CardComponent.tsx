import {
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Tooltip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import HTMLReactParser from "html-react-parser";

interface CardComponentProps {
	item: HSCard;
	key: any;
}

function CardComponent({ ...props }: CardComponentProps) {
	const { item, key } = { ...props };

	return (
		<Card {...props} key={key}>
			<Tooltip
				describeChild
				title={item.text ? HTMLReactParser(`<p>${item.text}</p>`) : ""}
			>
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
						<CardMedia
							component="img"
							className="pointer-events-none"
							src={`https://art.hearthstonejson.com/v1/256x/${item.id}.webp`}
							alt={item.id}
						/>
					</div>
					<div className="card_stats">
						<div className="card_attach">{item.attack}</div>
						<div className="card_health">{item.health}</div>
					</div>
				</CardActionArea>
			</Tooltip>
		</Card>
	);
}

export default CardComponent;

// const CardComponent = forwardRef<HTMLDivElement, CardComponentProps>(({ ...props }) => {
//     const [position, setPosition] = useState({ x: 0, y: 0 });
//     const nodeRef = useRef<HTMLDivElement>(null);

//     const resetPosition = () => setPosition({ x: 0, y: 0 });

//     const { item } = { ...props };

//     return (
//         <Card>
//             <Tooltip describeChild title={item.text ? HTMLReactParser(`<p>${item.text}</p>`) : ""}>
//                 <CardActionArea>
//                     <h3 className="card_name">{item.name} </h3>
//                     <div className="card_tier">
//                         <span className="card_tier">
//                             {[...Array(item.techLevel)].map((e, i) => (
//                                 <span className="card_tier_star" key={i}>
//                                     <StarIcon />
//                                 </span>
//                             ))}
//                         </span>
//                     </div>
//                     <div className="card_image">
//                         <CardMedia component="img" className="pointer-events-none" src={`https://art.hearthstonejson.com/v1/256x/${item.id}.webp`} alt={item.id} />
//                     </div>
//                     <CardContent>
//                         <div className="card_stats">
//                             <div className="card_attach">{item.attack}</div>
//                             <div className="card_health">{item.health}</div>
//                         </div>
//                     </CardContent>
//                 </CardActionArea>
//             </Tooltip>
//         </Card>
//     );
// });

// export default CardComponent;
