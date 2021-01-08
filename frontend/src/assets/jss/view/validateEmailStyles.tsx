import { makeStyles } from "@material-ui/core";

const validateEmailStyles = makeStyles((theme) => ({
    Card: {
        borderRadius: 6,
        boxShadow: '0 25px 75px rgba(16,30,54,.25)',
        width: "100%",
        padding: theme.spacing(4, 8),
        maxWidth: 450,
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 4),
        },
        [theme.breakpoints.up('xl')]: {
            marginBottom: theme.spacing(8)
        }
    },
    SendMailIcon: {
        fontSize: "30px"
    },
    MailImg: {
        width: '100%',
        maxWidth: 50,
    },
    H2: {
        fontSize: 38,
        fontWeight: 400,
        [theme.breakpoints.down('sm')]: {
            fontSize: 30,
        }
    },
    H3: {
        fontWeight: 200,
        fontSize: 28,
        [theme.breakpoints.down('sm')]: {
            fontSize: 22,
        }
    },
    boxWrapper: {
        width: '100%',
        marginTop: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2),
        }
    },
    CodeConfirmationLabel: {
        marginTop: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2),
        }
    },
    CodeInputWrapper: {
        padding: theme.spacing(2, 0),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 0)
        }
    },
    CodeInput: {
        "& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
            WebkitAppearance: 'none',
            margin: 0,
        },
        "& input[type = number]": {
            MozAppearance: 'textfield',
        }
    },
    button: {
        width: "100%"
    }
}))

export default validateEmailStyles