import { SquareClient, SquareEnvironment } from "square";

let squareClient: SquareClient | null = null;

/** Lazily-constructed Square client so builds don't fail before SQUARE_ACCESS_TOKEN is set. */
export function getSquareClient(): SquareClient {
  if (!process.env.SQUARE_ACCESS_TOKEN) {
    throw new Error(
      "SQUARE_ACCESS_TOKEN is not set. Add it to your environment before using checkout."
    );
  }
  if (!squareClient) {
    squareClient = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment:
        process.env.SQUARE_ENVIRONMENT === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    });
  }
  return squareClient;
}

export function getSquareLocationId(): string {
  if (!process.env.SQUARE_LOCATION_ID) {
    throw new Error(
      "SQUARE_LOCATION_ID is not set. Add it to your environment before using checkout."
    );
  }
  return process.env.SQUARE_LOCATION_ID;
}

/** Converts a dollar amount to the whole-cent bigint Square's Money type requires. */
export function toMoneyAmount(dollars: number): bigint {
  return BigInt(Math.round(dollars * 100));
}
