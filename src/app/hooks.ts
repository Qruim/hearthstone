import { useDispatch, useSelector } from "react-redux";
import type { GoldDispatch, GoldRootState } from "./store";

export const useGoldAppDispatch = useDispatch.withTypes<GoldDispatch>();
export const useGoldAppSelector = useSelector.withTypes<GoldRootState>();
