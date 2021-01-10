import { makeStyles } from "@material-ui/core";

const recoverPageStyles = makeStyles((theme) => ({
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
    svgImage: {
        maxWidth: 121
    },
    BigDescription: {
        fontSize: 26,
        color: '#343434',
        fontWeight: 500
    },
    SpacedText: {
        textAlign: 'center',
        color: '#343434',
        fontSize: 18
    }
}))

export default recoverPageStyles