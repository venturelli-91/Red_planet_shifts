import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	CssBaseline,
	GlobalStyles,
	ThemeProvider,
	createTheme,
} from "@mui/material";
import App from "./App";

const queryClient = new QueryClient();

const theme = createTheme({
	palette: {
		mode: "light",
		primary: { main: "#c0392b" },
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<GlobalStyles
					styles={{
						"html, body, #root": {
							minHeight: "100vh",
						},
						body: {
							backgroundImage: "url(/red-planet.webp)",
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundAttachment: "fixed",
							backgroundRepeat: "no-repeat",
						},
					}}
				/>
				<App />
			</ThemeProvider>
		</QueryClientProvider>
	</StrictMode>,
);
