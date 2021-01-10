import { makeStyles } from "@material-ui/core";

const newPasswordStyles = makeStyles((theme) => ({
    form: {
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4, 3),
        },
        maxWidth: 480,
        width: "90%"
    },
    title: {
        color: `${theme.palette.primary.main} !important`,
        fontSize: 32,
        fontWeight: 800,
        lineHeight: '46px',
        marginBottom: theme.spacing(3)
    },
    button: {
        width: "100%"
    },
}))

export default newPasswordStyles