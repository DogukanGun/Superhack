export {}
declare global{
    namespace NodeJS{
        interface ProcessEnv{
            NEXT_PUBLIC_WORLD_COIN_ID: `app_${string}`
            NEXT_PUBLIC_PROJECT_ID: string
        }
    }
}