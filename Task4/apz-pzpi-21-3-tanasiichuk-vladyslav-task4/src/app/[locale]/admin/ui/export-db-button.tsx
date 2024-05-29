"use client";
import { fetchClient } from "@/utils/fetch";
import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export function ExportDatabaseButton() {
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState("");

  const handleExport = async () => {
    try {
      const response = await fetch("admin/export-data/sql");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "backup.sql";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMessage(t("errorMessage"));
    }
  };

  return (
    <>
      <Button onClick={handleExport}>{t("export")}</Button>
      {errorMessage && (
        <Typography variant="body2" color="error">
          {errorMessage}
        </Typography>
      )}
    </>
  );
}
