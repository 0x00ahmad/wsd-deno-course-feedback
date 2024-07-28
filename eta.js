import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";

export const eta = new Eta({ views: `${Deno.cwd()}/templates` });
