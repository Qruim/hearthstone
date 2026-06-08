import { useDispatch, useSelector } from "react-redux";
import type { GoldDispatch, GoldRootState } from "../store/currency/storeGold";

export const useGoldAppDispatch = useDispatch.withTypes<GoldDispatch>();
export const useGoldAppSelector = useSelector.withTypes<GoldRootState>();
