import { Header, ToastProvider } from "@/components";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container, Stack } from "@mui/material";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
}
