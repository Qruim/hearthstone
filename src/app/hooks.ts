import { useDispatch, useSelector } from "react-redux";
import type { GoldDispatch, GoldRootState } from "./storeGold";

export const useGoldAppDispatch = useDispatch.withTypes<GoldDispatch>();
export const useGoldAppSelector = useSelector.withTypes<GoldRootState>();
