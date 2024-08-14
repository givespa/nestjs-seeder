import { Injectable } from "@nestjs/common";
import { Seeder } from "./seeder.interface";

@Injectable()
export class SeederService {
  constructor(private readonly seeders: Seeder[]) {}

  async run(): Promise<any> {
    if (this.shouldRollback()) return this.drop();
    if (this.shouldRefresh()) await this.drop();
    return this.seed();
  }

  async seed(): Promise<any> {
    // Don't use `Promise.all` during insertion.
    // `Promise.all` will run all promises in parallel which is not what we want.
    for (const seeder of this.seeders) {
      await seeder.seed();
      console.log(`${seeder.constructor.name} completed`);
    }
  }

  async drop(): Promise<any> {
    return Promise.all(this.seeders.map((s) => s.drop()));
  }

  shouldRefresh(): boolean {
    const argv = process.argv;Ï
    return argv.includes("-r") || argv.includes("--refresh");
  }

  shouldRollback(): boolean {
      const rollbackArgs = new Set(["-d", "--rollback"]);
      return process.argv.some(arg => rollbackArgs.has(arg));
  }
}
