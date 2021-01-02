import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    googleButton: {
        width: 184,
        height: 42,
        backgroundColor: '#4285f4',
        borderRadius: 2,
        cursor: "pointer",
        boxShadow: '0 3px 4px 0 rgba(0,0,0,.25)',
        "&:hover": {
            boxShadow: '0 0 6px #4285f4',
        },
        "&:active": {
            background: '#1669F2',
        }
    },
    googleIconWrapper: {
        position: 'absolute',
        marginTop: 1,
        marginLeft: 1,
        width: 40,
        height: 40,
        borderRadius: 2,
        backgroundColor: '#fff',
    },
    googleIcon: {
        position: 'absolute',
        marginTop: 11,
        marginLeft: 11,
        width: 18,
        height: 18,
    },
    btnText: {
        float: 'right',
        margin: '11px 11px 0 0',
        color: '#fff',
        fontSize: 14,
        letterSpacing: 0.2,
        fontFamily: 'Roboto',
    }
}))
const GoogleButton = () => {
    const classes = useStyles()
    return (
        <div className={classes.googleButton}>
            <div className={classes.googleIconWrapper}>
                <img className={classes.googleIcon} alt="google" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
            </div>
            <p className={classes.btnText}><b>Sign in with Google</b></p>
        </div>
    )
}

export default GoogleButton
