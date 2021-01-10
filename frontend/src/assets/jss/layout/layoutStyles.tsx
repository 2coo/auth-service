import { makeStyles } from "@material-ui/core";

const layoutStyles = makeStyles((theme) => ({
  trigger: {
    fontSize: 18,
    lineHeight: "64px",
    padding: "0 24px",
    cursor: "pointer",
    transition: "color 0.3s",
    color: "#666",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  logo: {
    height: 32,
    background: "rgba(255, 255, 255, 0.3)",
    margin: 16,
  },
  sider: {
    overflow: "auto",
    height: "100vh",
    left: 0,
  },
  header: {
    padding: 0,
    boxShadow: "4px 4px 40px 0 rgba(0,0,0,.05)",
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    height: 72,
    zIndex: 9,
    alignItems: "center",
    backgroundColor: "#fff",
    "&.fixed": {
      position: "fixed",
      top: 0,
      right: 0,
      width: "calc(100% - 256px)",
      zIndex: 29,
      transition: "width 0.2s",
      "&.collapsed": {
        width: "calc(100% - 80px)",
      },
    },
    "& .ant-menu": {
      borderBottom: "none",
      height: 72,
      lineHeight: "72px",
      "& .ant-menu-submenu": {
        top: 0,
        marginTop: 0,
      },
      "& .ant-menu-submenu-title": {
        height: 72,
      },
    },
  },
  primaryLayout: {
    background: "#f1f2f5",
  },
  rightContainer: {
    display: "flex",
    alignItems: "center",
  },
  notificationPopover: {
    "@global": {
      "ant-popover-inner-content": {
        padding: 0,
      },
      "ant-popover-arrow": {
        display: "none",
      },
      "ant-list-item-content": {
        flex: 0,
        marginLeft: 16,
      },
    },
  },
  notification: {
    padding: "24px 0",
    width: 320,
  },
  notificationItem: {
    transition: "all 0.3s",
    padding: "12px 24px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "@hover-color",
    },
  },
  clearButton: {
    textAlign: "center",
    height: 48,
    lineHeight: 48,
    cursor: "pointer",
  },
  iconFont: {
    color: "#b2b0c7",
    fontSize: 24,
  },
  iconButton: {
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f9f9fc",
      "& $iconFont": {
        color: theme.palette.primary.main,
      },
    },
  },
  button: {},
}));

export default layoutStyles;
