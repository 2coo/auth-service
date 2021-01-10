import { makeStyles } from "@material-ui/core";

const simpleLayoutStyles = makeStyles((theme) => ({
    Layout: {
        backgroundColor: "white",
        flexDirection: 'column',
        minHeight: '100vh'
    },
    Header: {
        backgroundColor: "rgba(0, 21, 41, 0)",
        padding: 0,
        alignContent: 'stretch',
    },
    Logo: {

    },
    Content: {
        flexGrow: 1,
        display: "flex"
    },
    Company: {
        fontWeight: 600,
        color: "rgb(95 97 163)",
        fontSize: 16
    },
    Footer: {
        padding: theme.spacing(4, 0),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
    }
}))

export default simpleLayoutStyles