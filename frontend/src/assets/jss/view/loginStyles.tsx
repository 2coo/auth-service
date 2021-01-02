import { makeStyles } from "@material-ui/core";
import Background from "../../img/LoginAsset1.png"

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
  leftPanel: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    backgroundImage: `url(${Background})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
    paddingBottom: 64
  },
  loginFormForgot: {
    float: "right"
  }
}));
export default loginStyles;
