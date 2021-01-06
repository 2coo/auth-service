import { makeStyles } from "@material-ui/core";

const registerStyles = makeStyles((theme) => ({
    form: {
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4, 3),
        },
        maxWidth: 480,
        width: "90%"
    },
    title: {
        color: `${theme.palette.primary.main} !important`
    },
    button: {
        width: "100%"
    },
    inputIcon: {
        color: theme.palette.primary.main
    }
}))


export default registerStyles