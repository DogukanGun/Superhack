"use client"
import TypeForm, { TradeType } from "@/components/forms/TradeTypeform";
import { useRouter } from "next/navigation";

const navigationLinks = {
    'sell_for_cash':'/trade/sell/cash',
    'sell_for_coin':'/trade/sell/coin',
    'buy_with_coin':'/trade/buy/coin',
    'buy_with_cash':'/trade/buy/cash'
}

const Trade = () => {

    const router = useRouter()

    const onTypeSelect = (type:TradeType) => {
        router.push(navigationLinks[type])
    }

    return <>
        <TypeForm onTypeClick={onTypeSelect}/>
    </>
}

export default Trade;