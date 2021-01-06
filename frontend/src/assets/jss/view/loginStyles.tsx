import { makeStyles } from "@material-ui/core";

const loginStyles = makeStyles((theme) => ({
  wrapper: {
    height: "100vh",
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'stretch'
  },
  container: {
    flexGrow: 1
  },
  form: {
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(4, 3),
    },
    maxWidth: 480,
    width: "90%",
    "& .ant-input-affix-wrapper-lg": {
      color: theme.palette.primary.main
    }
  },
  leftPanel: {
    // backgroundColor: theme.palette.primary.main,
    // color: theme.palette.getContrastText(theme.palette.primary.main),
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
  },
  contentStyle: {
    height: '100vh',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    display: "flex"
  },
  innerSlide: {
    width: "70%",
    "& img": {
      width: "100%"
    }
  },
  button: {
    width: "100%"
  },
  footer: {
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  rightPanel: {
  },
  company: {
    fontSize: 26,
    fontWeight: 500,
    color: theme.palette.primary.main
  },
  inputIcon: {
    color: "inherit"
  },
  loginFormForgot: {
    float: "right"
  }
}));
export default loginStyles;
