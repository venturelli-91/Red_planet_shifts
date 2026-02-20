import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import {
	AppBar,
	Box,
	Container,
	Tab,
	Tabs,
	Toolbar,
	Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import ShiftsPage from "./pages/ShiftsPage";
import WorkplacesPage from "./pages/WorkplacesPage";
import WorkersPage from "./pages/WorkersPage";

const NAV = [
	{ label: "Shifts", path: "/shifts" },
	{ label: "Workplaces", path: "/workplaces" },
	{ label: "Workers", path: "/workers" },
];

function Nav() {
	const { pathname } = useLocation();
	const current = NAV.findIndex((n) => pathname.startsWith(n.path));

	return (
		<AppBar position="static">
			<Toolbar>
				<Typography
					variant="h6"
					sx={{ mr: 4, letterSpacing: "0.04em", color: "#e8612c" }}>
					Red Planet Staffing
				</Typography>
				<Tabs
					value={current === -1 ? 0 : current}
					textColor="inherit"
					indicatorColor="secondary">
					{NAV.map((n) => (
						<Tab
							key={n.path}
							label={n.label}
							component={Link}
							to={n.path}
						/>
					))}
				</Tabs>
			</Toolbar>
		</AppBar>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<Nav />
			<Container
				maxWidth="lg"
				sx={{ mt: 4, pb: 4 }}>
				<Box sx={{ p: 1 }}>
					<Routes>
						<Route
							path="/"
							element={
								<Navigate
									to="/shifts"
									replace
								/>
							}
						/>
						<Route
							path="/shifts"
							element={<ShiftsPage />}
						/>
						<Route
							path="/workplaces"
							element={<WorkplacesPage />}
						/>
						<Route
							path="/workers"
							element={<WorkersPage />}
						/>
					</Routes>
				</Box>
			</Container>
		</BrowserRouter>
	);
}
