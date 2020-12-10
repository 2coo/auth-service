import Avatar from "@material-ui/core/Avatar";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Alert from "@material-ui/lab/Alert";
import { Fragment } from "react";
import Copyright from "../../components/copyright/Copyright";
import { useAxios } from "../../utils/api";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const ResetPassword = (props: any) => {
    const classes = useStyles();
    const [{ loading, error }, fetch] = useAxios({
        url: '/oauth2/register/get/fields',
        method: "POST"
    }, {
        manual: true
    })
    const handleSubmit = () => {
        fetch()
    }
    return (
        <Fragment>
            <Backdrop open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Reset Password
                        </Typography>
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        {error ? <Fragment>
                            <Alert severity="error">
                                {error.response?.data.error} <br />
                            </Alert>
                            <Box mt={3}>
                                <Grid container justify="center">
                                    Already have login and password?&nbsp;
                                        <Link href="/oauth2/authorize" variant="body2">
                                        Sign in
                                        </Link>
                                </Grid>
                            </Box>
                        </Fragment> : (<Fragment>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Reset password
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link href="/oauth2/authorize" variant="body2">
                                        Already have login and password? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Fragment>)}

                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        </Fragment>
    );
};

export default ResetPassword;
