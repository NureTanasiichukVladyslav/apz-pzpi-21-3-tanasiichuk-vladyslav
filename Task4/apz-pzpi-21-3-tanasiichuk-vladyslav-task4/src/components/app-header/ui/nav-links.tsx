"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import { Button, Container, Link, Stack } from "@mui/material";
import { fetchClient } from "@/utils/fetch";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { LanguageChanger } from "./language-changer";
import { NotificationsMenu } from "./notifications-menu";
import { NotificationDto } from "@/types";

interface Props {
  user?: { id: number; login: string };
  notifications?: NotificationDto[];
}

export const NavLinks = ({ user, notifications }: Props) => {
  const router = useRouter();

  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await router.push("/sign-in");
      await fetchClient.post("auth/logout");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Link href="/" underline="none">
          <Typography variant="h6" fontWeight="700" color="text.secondary">
            {t("home")}
          </Typography>
        </Link>
        <Stack direction="row" alignItems="center" gap={4}>
          {user ? (
            <>
              <Link href="/animals/create" underline="hover">
                <Typography fontWeight="400">{t("addAnimal")}</Typography>
              </Link>
              <Link href="/animal-species/create" underline="hover">
                <Typography fontWeight="400">
                  {t("addAnimalSpecies")}
                </Typography>
              </Link>
              <Link href="/animal-species" underline="hover">
                <Typography fontWeight="400">{t("animalSpecies")}</Typography>
              </Link>
              <NotificationsMenu notifications={notifications} />
              <Button onClick={handleLogout}>
                <Typography fontWeight="400" textTransform="none">
                  {t("logOut")}
                </Typography>
              </Button>
            </>
          ) : (
            <Link href="/sign-in" underline="none">
              <Typography fontWeight="400">{t("logIn")}</Typography>
            </Link>
          )}
          <LanguageChanger />
        </Stack>
      </Stack>
    </Container>
  );
};
