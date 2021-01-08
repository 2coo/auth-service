import { makeStyles } from "@material-ui/core";

const loginStyles = makeStyles((theme) => ({
  button: {
    width: "100%"
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
