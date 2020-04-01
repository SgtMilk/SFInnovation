import React, { useState } from 'react';

import clsx from 'clsx';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
	AppBar,
	CssBaseline,
	Divider, Drawer, IconButton,
	List,
	Toolbar, Typography,
} from "@material-ui/core";

import StatusIndicator from "./components/StatusIndicator";
import DateTimeIndicator from "./components/DateTimeIndicator";

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ChartIcon from "@material-ui/icons/InsertChartOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import HelpIcon from "@material-ui/icons/HelpOutlined";
import PersonIcon from "@material-ui/icons/Person";

import { BrowserRouter as Router, Switch, Route, Link, } from 'react-router-dom';

import MonitorPage from "./pages/MonitorPage";
import GeneralSettingsPage from "./pages/GeneralSettingsPage";
import Error404Page from "./pages/Error404Page";
import PatientSettingsPage from './pages/PatientSettingsPage';

import AlarmDialog from "./components/AlarmDialog";

import HelpScreen from "./help/HelpScreen";

import { useBridge } from "./Bridge";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexGrow: 1,
	},
	link: {
		textDecoration: 'none',
		color: theme.palette.text.primary,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1,
		},
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
	left: {
		display: 'flex',
		flexGrow: 1,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	helpIcon: {
		marginLeft: theme.spacing(1),
	},
}));

function App() {
	const classes = useStyles();
	const theme = useTheme();

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [helpOpen, setHelpOpen] = useState(true);

	const bridge = useBridge();

	return (
		<Router>
			<div className={classes.root}>
				<HelpScreen {...{ helpOpen, setHelpOpen }} />
				<CssBaseline />
				<AlarmDialog />
				<AppBar
					position="fixed"
					className={clsx(classes.appBar, {
						[classes.appBarShift]: drawerOpen,
					})}
				>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={() => setDrawerOpen(true)}
							edge="start"
							className={clsx(classes.menuButton, {
								[classes.hide]: drawerOpen,
							})}
						>
							<MenuIcon />
						</IconButton>
						<div className={classes.left}>
							<Typography className={classes.title} variant="h4" noWrap>
								SFVentilator UI
          					</Typography>
							<IconButton
								className={classes.helpIcon}
								color="inherit"
								onClick={() => setHelpOpen(true)}
							><HelpIcon /></IconButton>
						</div>
						<StatusIndicator />
						<DateTimeIndicator />
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					className={clsx(classes.drawer, {
						[classes.drawerOpen]: drawerOpen,
						[classes.drawerClose]: !drawerOpen,
					})}
					classes={{
						paper: clsx({
							[classes.drawerOpen]: drawerOpen,
							[classes.drawerClose]: !drawerOpen,
						}),
					}}
				>
					<div className={classes.toolbar}>
						<IconButton onClick={() => setDrawerOpen(false)}>
							{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
						</IconButton>
					</div>
					<List>
						<Link to={'/settings'} className={classes.link}>
							<ListItem button>
								<ListItemIcon><SettingsIcon /></ListItemIcon>
								<ListItemText primary="General settings" />
							</ListItem>
						</Link>
						<Divider />
						<Link to={'/patient'} className={classes.link}>
							<ListItem button>
								<ListItemIcon><PersonIcon /></ListItemIcon>
								<ListItemText primary="Patient settings" />
							</ListItem>
						</Link>
						<Divider />
						<Link to={'/monitor'} className={classes.link}>
							<ListItem button>
								<ListItemIcon><ChartIcon /></ListItemIcon>
								<ListItemText primary="Monitor" />
							</ListItem>
						</Link>
					</List>
				</Drawer>
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<Switch>
						{['/', '/monitor'].map(
							(path, i) => <Route exact path={path} key={i} component={() => <MonitorPage
								bridge={bridge}
							/>} />
						)}
						<Route exact path='/patient' component={
							() => <PatientSettingsPage />
						} />
						<Route exact path='/settings' component={
							() => <GeneralSettingsPage />
						} />
						<Route component={Error404Page} />
					</Switch>
				</main>
			</div>
		</Router>
	);
}

export default App;