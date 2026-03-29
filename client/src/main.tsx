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
		mode: "dark",
		primary: { main: "#e8612c" },
		secondary: { main: "#c9873e" },
		background: {
			default: "transparent",
			paper: "rgba(18, 7, 3, 0.78)",
		},
		text: {
			primary: "#f2dece",
			secondary: "#a07858",
		},
		divider: "rgba(232, 97, 44, 0.15)",
	},
	typography: {
		fontFamily: '"Syne", "Helvetica", "Arial", sans-serif',
		h5: { fontWeight: 700, fontFamily: '"Orbitron", sans-serif' },
		h6: { fontWeight: 700, fontFamily: '"Orbitron", sans-serif' },
		subtitle1: { fontWeight: 600 },
	},
	shape: { borderRadius: 12 },
	breakpoints: {
		values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					background: "rgba(10, 4, 2, 0.88)",
					backdropFilter: "blur(14px)",
					boxShadow: "0 1px 0 rgba(232, 97, 44, 0.2)",
				},
			},
		},
		MuiCard: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				root: {
					backdropFilter: "blur(16px)",
					border: "1px solid rgba(232, 97, 44, 0.14)",
					transition: "box-shadow 0.2s, transform 0.2s",
					"&:hover": {
						boxShadow: "0 4px 24px rgba(232, 97, 44, 0.18)",
						transform: "translateY(-2px)",
					},
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					background: "rgba(18, 7, 3, 0.96)",
					backdropFilter: "blur(20px)",
					border: "1px solid rgba(232, 97, 44, 0.18)",
				},
			},
		},
		MuiChip: {
			styleOverrides: { root: { fontWeight: 600, fontSize: "0.72rem" } },
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 600,
					minHeight: 44 /* touch target ≥ 44px */,
					touchAction: "manipulation",
				},
			},
		},
		MuiDivider: {
			styleOverrides: { root: { borderColor: "rgba(232, 97, 44, 0.15)" } },
		},
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<GlobalStyles
					styles={{
						"html, body, #root": { minHeight: "100dvh" },
						body: {
							/* iOS Safari does not support fixed background-attachment.
							   Use a pseudo-element on html instead for the parallax bg. */
							backgroundImage: "none",
						},
						"html::before": {
							content: '""',
							position: "fixed",
							inset: 0,
							zIndex: -1,
							backgroundImage: "url(/red-planet.webp)",
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						},
						/* Remove 300ms tap delay on all interactive elements */
						"button, a, [role='button']": {
							touchAction: "manipulation",
						},
						/* Respect user's reduced-motion preference */
						"@media (prefers-reduced-motion: reduce)": {
							"*, *::before, *::after": {
								animationDuration: "0.01ms !important",
								animationIterationCount: "1 !important",
								transitionDuration: "0.01ms !important",
								scrollBehavior: "auto !important",
							},
						},
					}}
				/>
				<App />
			</ThemeProvider>
		</QueryClientProvider>
	</StrictMode>,
);
