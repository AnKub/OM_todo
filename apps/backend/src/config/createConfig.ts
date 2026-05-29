export type AppConfig = {
  port: number
}

export function createConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3001),
  }
}