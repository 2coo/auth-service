import { unstable_createMuiStrictModeTheme as createMuiTheme , responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4a3c98",
    },
    secondary: { main: "#34b9c1" },
  },
});

export default responsiveFontSizes(theme);
