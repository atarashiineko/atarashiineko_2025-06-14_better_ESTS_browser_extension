// repository.js
import Dexie from "dexie";

export class IdentifierRepository {
  constructor() {
    this.db = new Dexie("IdentifierTrackerDB");
    this.db.version(1).stores({
      identifiers: "&identifier, firstSeenAt, occurrences",
    });
  }

  async addOrUpdate(identifier, pageURL, timestamp) {
    const existing = await this.db.identifiers.get(identifier);
    if (!existing) {
      return this.db.identifiers.add({
        identifier,
        firstSeenAt: timestamp,
        occurrences: [{ url: pageURL, timestamp }],
      });
    } else {
      const updatedOccurrences = existing.occurrences.concat({
        url: pageURL,
        timestamp,
      });
      return this.db.identifiers.put({
        identifier,
        firstSeenAt: existing.firstSeenAt,
        occurrences: updatedOccurrences,
      });
    }
  }

  async get(identifier) {
    return this.db.identifiers.get(identifier);
  }

  async getAll() {
    return this.db.identifiers.toArray();
  }

  async clearAll() {
    return this.db.identifiers.clear();
  }
}
