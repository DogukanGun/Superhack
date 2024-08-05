import Hero from "@/components/hero/Hero";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col items-center">
        <div className="flex max-w-xl flex-col items-center pb-0 pt-8 text-center sm:pb-16 lg:pb-32 lg:pt-32">
          <p className="mb-4 font-semibold text-indigo-500 md:mb-6 md:text-lg xl:text-xl">Very proud to introduce</p>

          <h1 className="mb-8 text-4xl font-bold text-black sm:text-5xl md:mb-12 md:text-6xl">Revolutionary way to trade in web3</h1>

          <p className="mb-8 leading-relaxed text-gray-500 md:mb-12 xl:text-lg">You can trade your coin for another coin like traditional but without middleman or trade your coin for cash.</p>

          <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link href="/trade" className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Start now</Link>

            <Link href="#" className="inline-block rounded-lg border bg-white px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base">Take tour</Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y">
        <Hero />
      </div>
    </main>
  );
}
