import { describe, expect, it } from "vitest";
import { parseServerEnv } from "./env";

const valid = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
  SUPABASE_SERVICE_ROLE_KEY: "service",
  IGDB_CLIENT_ID: "id",
  IGDB_CLIENT_SECRET: "secret",
};

describe("parseServerEnv", () => {
  it("accepts a complete environment", () => {
    expect(parseServerEnv(valid)).toEqual(valid);
  });

  it("names the missing variables without leaking values", () => {
    const partial: Partial<typeof valid> = { ...valid };
    delete partial.IGDB_CLIENT_SECRET;
    expect(() => parseServerEnv(partial)).toThrow(/IGDB_CLIENT_SECRET/);
    expect(() => parseServerEnv(partial)).not.toThrow(/service/);
  });
});
