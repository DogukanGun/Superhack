"use client"
import { useParams } from "next/navigation";
import CashForm from "./components/CashForm";
import CoinForm from "./components/CoinForm";

const Sell = () => {

    const type = useParams()?.type

    return <>
        {type == 'cash' && <CashForm/>}
        {type == 'coin' && <CoinForm/>}
    </>
}   

export default Sell;