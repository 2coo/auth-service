import { Redirect } from "@reach/router";
import { Fragment, useEffect, useState } from "react";
import { AuthConsumer, useAuthContext } from "../../store/auth/context";
import { useAxios } from "../../utils/api";
import { Backdrop, CircularProgress } from "@material-ui/core"

const PrivateRoute = (props: any) => {
    let { as: Comp, ...otherProps } = props;
    const { state, dispatch } = useAuthContext()
    const [{ data: userProfile, loading, error }, fetch] = useAxios({
        url: "/oauth2/userinfo",
        withCredentials: true
    }, { manual: true })

    useEffect(() => {
        if (!state.authenticated) {
            fetch()
        }
        return () => { }
    }, [state.authenticated, fetch])
    useEffect(() => {
        if (userProfile?.success === true) {
            dispatch({
                type: "ADD_AUTH",
                payload: {
                    authenticated: true,
                    user: userProfile.data
                }
            })
        }
        return () => { }
    }, [userProfile, dispatch])

    let decisionComp = (<Backdrop open={loading}>
        <CircularProgress color="inherit" />
    </Backdrop>)

    if (error) decisionComp = (<Redirect to="/oauth2/authorize" replace={true} noThrow={true} />)

    return <AuthConsumer>
        {auth =>
            <Fragment>
                {
                    userProfile?.success ?
                        (<Comp {...otherProps} />)
                        :
                        (decisionComp)
                }
            </Fragment>
        }
    </AuthConsumer >
};

export default PrivateRoute;