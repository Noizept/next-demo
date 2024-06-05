import React from "react";
import SuperButton from "./SuperButton";
import { getTranslations, getLocale } from "next-intl/server";

import postgres from "@/databases/postgres";

export default async function Dick() {
  const users = await postgres.user.findMany();
  const t = await getTranslations({
    locale: await getLocale(),
    namespace: "Index",
  });

  return (
    <div>
      {users.length}
      dick
      <SuperButton title={t("title")} message={t("message")} />
    </div>
  );
}
