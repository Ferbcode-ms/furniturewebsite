import { ObjectId } from "mongodb";

export function toObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}
