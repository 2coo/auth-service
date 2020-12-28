import { useLocation } from "@reach/router"
import {
    Container,
    CssBaseline,
    Box,
    Link,
    Button,
    Typography,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    Backdrop,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Collapse
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import { useAxios } from '../../utils/api';
import { Fragment, useState } from 'react';
import InfoIcon from '@material-ui/icons/Info';

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    link: {
        color: "#4581e9",
        textDecoration: "none"
    },
    cardHeader: {
        padding: theme.spacing(4, 4, 1, 4)
    },
    cardContent: {
        padding: theme.spacing(2, 4)
    },
    cardAction: {
        padding: theme.spacing(1, 4, 4, 4)
    },
    description: {
        fontSize: 16
    },
    scopeDescription: {
        padding: theme.spacing(2, 3),
        background: 'rgb(226 226 226 / 30%)',
        borderRadius: 10,
    },
    AcceptButton: {
        marginLeft: 'auto !important',
    }
}));
const Dialog = (props: any) => {
    const classes = useStyles();
    const location = useLocation()
    const [{ data: transactionData, loading, error },] = useAxios({
        url: `/oauth2/authorize/dialog${location.search}`,
        method: 'POST'
    })
    const [selectedScope, setSelectedScope] = useState(null)
    return (
        <Container component="main" maxWidth="xs">
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <CssBaseline />
            <div className={classes.paper}>
                <Card>
                    {!loading && !error ?
                        <Fragment>
                            <CardHeader
                                title={<Typography variant="h5">
                                    <span className={classes.link}>
                                        {transactionData.application}
                                    </span> application wants to access your account <br />
                                    <Box mt={1}>
                                        <span className={classes.link}>
                                            {transactionData.email}
                                        </span>
                                    </Box>
                                </Typography>}
                                style={{ textAlign: 'center' }}
                                className={classes.cardHeader}
                            />
                            <CardContent className={classes.cardContent}>
                                <Typography className={classes.description} variant="subtitle2">
                                    This allow <span className={classes.link}>
                                        {transactionData.application}
                                    </span> to:
                                </Typography>
                                <List>
                                    {
                                        transactionData.scopes?.map((scope: any) => <Fragment key={scope.name}>
                                            <ListItem>
                                                {scope.icon ? <ListItemAvatar>
                                                    <img src={scope.icon} alt="Scope Icon" />
                                                </ListItemAvatar> : null}
                                                <ListItemText
                                                    primary={scope.name}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="expand" onClick={() => {
                                                        if (selectedScope === scope) {
                                                            setSelectedScope(null)
                                                        } else {
                                                            setSelectedScope(scope)
                                                        }
                                                    }}>
                                                        <InfoIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Collapse in={scope === selectedScope} timeout="auto" unmountOnExit>
                                                <Typography className={classes.scopeDescription}>
                                                    {scope.description}
                                                </Typography>
                                            </Collapse>
                                        </Fragment>)
                                    }
                                </List>
                            </CardContent>
                            <CardActions className={classes.cardAction}>
                                <form action={`/oauth2/authorize/decision${location.search}`} method="post">
                                    <input name="transaction_id" type="hidden" value={transactionData.transaction_id} />
                                    <input name="cancel" type="hidden" value="Deny" />
                                    <Button type="submit" autoFocus onClick={() => { }} color="primary">
                                        Decline
                                    </Button>
                                </form>
                                <form className={classes.AcceptButton} action={`/oauth2/authorize/decision${location.search}`} method="post">
                                    <input name="transaction_id" type="hidden" value={transactionData.transaction_id} />
                                    <Button type="submit" color="primary">
                                        Accept
                                    </Button>
                                </form>
                            </CardActions>
                        </Fragment>
                        :
                        error ? <Alert severity="error">
                            {
                                error.response?.data?.message || "Authorization failed!"
                            }
                        </Alert> : <Skeleton variant="rect" width={396} height={250} />
                    }
                </Card>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    )
}

export default Dialog
