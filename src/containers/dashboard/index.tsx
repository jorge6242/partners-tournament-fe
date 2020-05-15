import React, { useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DashboardIcon from '@material-ui/icons/Dashboard';
import PaymentIcon from '@material-ui/icons/Payment';
import SettingsIcon from '@material-ui/icons/Settings';
import LockIcon from '@material-ui/icons/Lock';
import PeopleIcon from '@material-ui/icons/People';
// import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
// import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
// import ListAltIcon from '@material-ui/icons/ListAlt';
// import LockIcon from '@material-ui/icons/Lock';
// import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
// import PeopleIcon from '@material-ui/icons/People';
// import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak';
// import BuildIcon from '@material-ui/icons/Build';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from '@material-ui/core/Collapse'
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { useHistory, useLocation } from "react-router-dom";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconExpandLess from '@material-ui/icons/ExpandLess'
import IconExpandMore from '@material-ui/icons/ExpandMore'
import IconLibraryBooks from '@material-ui/icons/LibraryBooks';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
// import Collapse from '@material-ui/core/Collapse'
import _ from 'lodash';
import CommentIcon from '@material-ui/icons/Comment';
import queryString from "query-string";
import { Grid } from "@material-ui/core";

import { logout, setForcedLogin, checkLogin, setupInterceptors } from "../../actions/loginActions";
import AccessControlForm from "../../components/AccessControlForm";
import { updateModal } from "../../actions/modalActions";
import { getAll as getStatusPersonAll } from "../../actions/statusPersonActions";
import { getAll as getMaritalStatusAll } from "../../actions/maritalStatusActions";
import { getAll as getGenderAll } from "../../actions/genderActions";
import { getAll as getCountries } from "../../actions/countryActions";
import { getAll as getRelationTypes } from "../../actions/relationTypeActions";
import { getAll as getPaymentMethods } from "../../actions/paymentMethodActions";
import { getAll as getSports } from "../../actions/sportActions";
import { getList as getLockerLocationList } from "../../actions/lockerLocationsActions";
import { getList as getMenuList, getWidgetList } from "../../actions/menuActions";
import { getList as getParameterList } from "../../actions/parameterActions";
import { getList as getCategoryList } from "../../actions/tCategoryActions";
import { getList as getCurrencyList } from "../../actions/currencyActions";
import { getList as getRuleTypeList } from "../../actions/tRuleCategoryActions";
import { getList as getPaymentMethodList } from "../../actions/tPaymentMethodActions";
import { getList as getCategoriesGroupList } from "../../actions/tCategoriesGroupActions";
import Loader from "../../components/common/Loader";
import { getClient } from "../../actions/personActions";
import { getBalance } from "../../actions/webServiceActions";
import icons from "../../helpers/collectionIcons";
import Helper from '../../helpers/utilities';
import Logo from '../../components/Logo'

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%"
    },
    menuContainer: {
      fontSize: '10px',
    },
    profileButton: {
      background: 'white'
    }
  })
);

interface ResponsiveDrawerProps {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  children?: any;
  container?: Element;
}

export default function Dashboard(props: ResponsiveDrawerProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { container, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [subMenuItem, setSubMenuItem] = React.useState(null);
  const [subMenuItem2, setSubMenuItem2] = React.useState(null);
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    menuReducer: { listData: menuList },
    loginReducer: { user, loading },
    parameterReducer: { listData: parameterList },
  } = useSelector((state: any) => state);

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);


  useEffect(() => {
    history.listen((location, action) => {
      if (!_.isEmpty(menuList) && menuList.items.length > 0) {
        const route = location.pathname === '/dashboard' ? '/dashboard/main' : location.pathname;
        const isValid = menuList.items.find((e: any) => e.route === route);
        if (!isValid) {
          window.location.href = "/#/dashboard/main";
        }
      }
    });
  }, [menuList])



  useEffect(() => {

    const checkLoginPromise = new Promise(function(resolve, reject) {
      resolve(dispatch(checkLogin()));
    });

    checkLoginPromise.then(function() {
      if(location.pathname !== '/') {
        dispatch(setupInterceptors());
      }
      dispatch(getMenuList(location.pathname));
      dispatch(getGenderAll());
      dispatch(getCountries());
      dispatch(getParameterList());
      dispatch(getCategoryList());
      dispatch(getCurrencyList());
      dispatch(getRuleTypeList());
      dispatch(getPaymentMethodList());
      dispatch(getCategoriesGroupList());
    });
  }, [dispatch]);



  useEffect(() => {
    if (location.pathname === '/dashboard') {
      history.push('/dashboard/main');
    }
  }, [history, location]);

  function handleClick(value: number) {
    switch (value) {
      case 1:
        setOpen1(!open1)
        break;
      case 2:
        setOpen2(!open2)
        break;
      case 3:
        setOpen3(!open3)
        break;
      case 4:
        setOpen4(!open4)
        break;
      case 5:
        setOpen5(!open5)
        break;
      default:
        break;
    }
  }

  function setSubMenu(currentItem: any) {
    if (subMenuItem == currentItem) {
      setSubMenuItem(null);
    } else {
      setSubMenuItem(currentItem);
    }
  }

  function setSecondSubMenu(currentItem: any) {
    if (subMenuItem2 == currentItem) {
      setSubMenuItem2(null);
    } else {
      setSubMenuItem2(currentItem);
    }
  }

  const renderThirdMenu = (Icon: React.ReactType, title: string, route: string) => (
    <ListItem button onClick={() => handeClick(route)}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  )

  const renderSecondMenu = (CustomIcon: React.ReactType, title: string, route: string, menu: any, item: any) => {
    const findChildrens: any = menu.filter((e: any) => e.parent == item.id);
    let Icon = SettingsIcon;
    if(item.icons) {
      let currenMenutIcon = icons.find((e: any) => e.slug === item.icons.slug);
      if(currenMenutIcon) {
        Icon = currenMenutIcon.name;
      }
    }
    return (
      <React.Fragment>
        <ListItem button onClick={() => findChildrens.length > 0 ? setSecondSubMenu(item.id) : handeClick(item.route ? item.route : '')}>
          <ListItemIcon >
          <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={item.name} />
          {findChildrens.length > 0 && (
            item.id === subMenuItem2 ? <IconExpandLess /> : <IconExpandMore />
          )
          }
        </ListItem>
        {findChildrens.length > 0 && (
          <Collapse in={item.id === subMenuItem2 ? true : false} timeout="auto" unmountOnExit>
            <List dense>
              {findChildrens.map((e: any) => renderThirdMenu(DoubleArrowIcon, e.name, ""))}
            </List>
          </Collapse>
        )

        }
      </React.Fragment>
    )
  }


  function build(menu: any) {
    return menu.map((item: any, i: number) => {
      if (item.parent === "0") {
        const findChildrens: any = menu.filter((e: any) => e.parent == item.id);
        let Icon = SettingsIcon;
        if(item.icons) {
          let currenMenutIcon = icons.find((e: any) => e.slug === item.icons.slug);
          if(currenMenutIcon) {
            Icon = currenMenutIcon.name;
          }
        }
        return (
          <React.Fragment>
            <ListItem button onClick={() => findChildrens.length > 0 ? setSubMenu(item.id) : handeClick(item.route ? item.route : '')}>
              <ListItemIcon >
                <Icon />
              </ListItemIcon>
              <ListItemText primary={item.name} />
              {findChildrens.length > 0 && (
                item.id === subMenuItem ? <IconExpandLess /> : <IconExpandMore />
              )
              }
            </ListItem>
            {findChildrens.length > 0 && (
              <Collapse in={item.id === subMenuItem ? true : false} timeout="auto" unmountOnExit>
                <List dense>
                  {findChildrens.map((e: any) => renderSecondMenu(DoubleArrowIcon, e.name, "", menu, e))}
                </List>
              </Collapse>
            )

            }
          </React.Fragment>
        )
      }
    })
  }

  function buildMenu(menu: any) {
    return build(menu);
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handeClick = (path: string) => {
    history.push(path);
    setAnchorEl(null);
  };

  const handleLogout = () => dispatch(logout());

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (Icon: React.ReactType, title: string, route: string) => (
    <ListItem button>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText
        primary={title}
        onClick={() => handeClick(route)}
      />
    </ListItem>
  )

  const renderFirstMenu = (Icon: React.ReactType, title: string, route: string) => (
    <MenuItem>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText
        primary={title}
        onClick={() => handeClick(route)}
      />
    </MenuItem>
  )

  const getRole = (role: string) => !_.isEmpty(user) ? user.roles.find((e: any) => e.slug === role) : '';

  const drawer = () => {
    if (loading) {
      return <Loader />;
    }
    return (
      <div>
        <Logo />
        {/* <div className={classes.toolbar} /> */}
        <Divider />
        <List dense >
          {!_.isEmpty(menuList) && buildMenu(menuList.items)}
           {/* {renderFirstMenu(SettingsIcon, "Categoria", "/dashboard/category")}
           {renderFirstMenu(SettingsIcon, "Tipo Categoria", "/dashboard/category-type")}
           {renderFirstMenu(SettingsIcon, "Torneo", "/dashboard/tournament")}
           {renderFirstMenu(SettingsIcon, "Inscripcion de Torneo", "/dashboard/tournament-new")}
           {renderFirstMenu(SettingsIcon, "Inscripciones de Torneos", "/dashboard/inscriptions")}
           {renderFirstMenu(SettingsIcon, "Reporte Inscripcion de Torneos", "/dashboard/tournament-report")}
           {renderFirstMenu(SettingsIcon, "Grupos", "/dashboard/group")}
          <ListItem button onClick={() => handleClick(3)}>
          <ListItemIcon >
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Seguridad" />
          {open3 ? <IconExpandLess /> : <IconExpandMore />}
        </ListItem>

        <Collapse in={open3} timeout="auto" unmountOnExit>
          <List dense>
            {renderFirstMenu(PeopleIcon, "Usuarios", "/dashboard/user")}
            {renderFirstMenu(PeopleIcon, "Roles", "/dashboard/role")}
            {renderFirstMenu(LockIcon, "Permisos", "/dashboard/permission")}
            {renderFirstMenu(DoubleArrowIcon, "Widget", "/dashboard/widget")}
            {renderFirstMenu(DoubleArrowIcon, "Menu", "/dashboard/menu")}
            {renderFirstMenu(DoubleArrowIcon, "Menu Item", "/dashboard/menu-item")}
          </List>
        </Collapse> */}
        {/* {!_.isEmpty(user) && getRole('admin') && (
              <React.Fragment>
                {renderFirstMenu(DashboardIcon, "Inicio", "/dashboard/main")}
                {renderFirstMenu(CommentIcon, "Notas", "")}
                {renderFirstMenu(AccountCircleIcon, "Actualizacion de datos", "/dashboard/actualizacion-datos")}
                {renderFirstMenu(PaymentIcon, "Reporte de Pagos", "/dashboard/reporte-pagos")}
                {renderFirstMenu(PaymentIcon, "Estado de Cuenta", "/dashboard/status-account")}
                {renderFirstMenu(AssignmentLateIcon, "Facturas por Pagar", "/dashboard/facturas-por-pagar")}
              </React.Fragment>
            )
          }
          {
            !_.isEmpty(user) && getRole('promotor') && (
              <React.Fragment>
                {renderFirstMenu(DashboardIcon, "Inicio", "/dashboard/main")}
                {renderFirstMenu(AccountCircleIcon, "Socios", "/dashboard/partner")}
              </React.Fragment>
            )
          } */}
        </List>
      </div>
    )
  };
  const nameRole: any = !_.isEmpty(user) ? _.first(user.roles) : '';
  const client =Helper.getParameter(parameterList, 'CLIENT_NAME')
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.header}>
          <Typography variant="h6" noWrap>
              <Grid container spacing={1}>
                <Grid item xs={12}>Portal de Torneos</Grid>
              </Grid>
                  <Grid item xs={12} style={{ fontSize: 14, fontStyle: 'italic' }}>{client.value}</Grid>
            </Typography>
            <Typography variant="h6" noWrap>
              <div>
                <Button
                  startIcon={<AccountCircleIcon />}
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  className={classes.profileButton}
                >
                  Usuario: {!loading && user.username}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                 <MenuItem>Usuario: {!loading && user.username}</MenuItem>
                  <MenuItem>Role: {!loading && nameRole.name}</MenuItem>
                  <MenuItem onClick={() => handleLogout()}>Logout</MenuItem> 
                </Menu>
              </div>
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer()}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer()}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children && children}
      </main>
    </div>
  );
}
