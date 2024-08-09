"use client"

import AttestationForm from "./AttestationForm"

type P = {
    onTypeClick:(type:TradeType)=>void
}

export type TradeType = 'sell_for_cash'|'sell_for_coin'|'buy_with_coin'|'buy_with_cash'

const TypeForm = (
    { onTypeClick }:P
) => {
    return (
        <><div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="mb-10 md:mb-16">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Do you want to ...</h2>

                    <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">Firstly please choose whatever you want to do</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <button onClick={() => onTypeClick('sell_for_coin')} className="group text-left relative flex h-80 items-end overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg">
                        <img src="https://images.unsplash.com/photo-1620243318482-fdd2affd7a38?auto=format&q=75&fit=crop&w=750" loading="lazy" alt="Photo by Fakurian Design" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

                        <div className="relative flex flex-col">
                            <span className="text-gray-300">Sell</span>
                            <span className="text-lg font-semibold text-white lg:text-xl">Sell Your Coin for Another Coin</span>
                        </div>
                    </button>

                    <button onClick={() => onTypeClick('sell_for_cash')} className="group text-left relative flex h-80 items-end overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg">
                        <img src="https://images.unsplash.com/photo-1620241608701-94ef138c7ec9?auto=format&q=75&fit=crop&w=750" loading="lazy" alt="Photo by Fakurian Design" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

                        <div className="relative flex flex-col">
                            <span className="text-gray-300">Sell</span>
                            <span className="text-lg font-semibold text-white lg:text-xl">Sell Your Coin for Cash</span>
                        </div>
                    </button>

                    <button onClick={() => onTypeClick('buy_with_coin')} className="group text-left relative flex h-80 items-end overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg">
                        <img src="https://images.unsplash.com/photo-1620243318482-fdd2affd7a38?auto=format&q=75&fit=crop&w=750" loading="lazy" alt="Photo by Fakurian Design" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

                        <div className="relative flex flex-col">
                            <span className="text-gray-300">Buy</span>
                            <span className="text-lg font-semibold text-white lg:text-xl">Buy A Coin with Another Coin</span>
                        </div>
                    </button>

                    <button onClick={() => onTypeClick('buy_with_cash')} className="group text-left relative flex h-80 items-end overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg">
                        <img src="https://images.unsplash.com/photo-1620241608701-94ef138c7ec9?auto=format&q=75&fit=crop&w=750" loading="lazy" alt="Photo by Fakurian Design" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

                        <div className="relative flex flex-col">
                            <span className="text-gray-300">Buy</span>
                            <span className="text-lg font-semibold text-white lg:text-xl">Buy A Coin with Cash</span>
                        </div>
                    </button>
                </div>
            </div>
        </div><AttestationForm /></>
    )
}

export default TypeForm;