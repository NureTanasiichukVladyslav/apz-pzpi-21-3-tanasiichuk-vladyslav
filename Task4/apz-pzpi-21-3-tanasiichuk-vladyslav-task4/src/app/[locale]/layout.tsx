import { Header, ToastProvider, TranslationsProvider } from "@/components";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container, Stack } from "@mui/material";
import initTranslations from "../i18n";

// @ts-ignore
export default async function RootLayout({ children, params: { locale } }) {
  const { resources } = await initTranslations(locale);

  return (
    <html lang="en">
      <body>
        <TranslationsProvider locale={locale} resources={resources}>
          <ToastProvider>
            <Container maxWidth="xl">
              <Header />
              <Stack
                width="100%"
                alignItems="center"
                justifyContent="center"
                py={10}
              >
                {children}
              </Stack>
            </Container>
          </ToastProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
