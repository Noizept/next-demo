"use client";
import React from "react";
import { useTranslations } from "next-intl";

type TranslateObject = {
  title: string;
  message: string;
};
export default function SuperButton({ title, message }: TranslateObject) {
  return (
    <div>
      {title} - {message}
    </div>
  );
}
