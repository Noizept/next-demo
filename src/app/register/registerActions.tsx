"use server";
import postgres from "../../databases/postgres";
import { registerSchema } from "./registerValitors";

export async function register(formData: FormData) {
  const data = registerSchema.parse(formData);
  // ...
}
