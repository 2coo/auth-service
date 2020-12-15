import { Fragment, useEffect } from "react";
import { AuthConsumer, useAuthContext } from "../../store/auth/context";
import { useAxios } from "../../utils/api";
import { Backdrop, CircularProgress } from "@material-ui/core"
import FullRedirect from "../full-redirect/FullRedirect"

const PrivateRoute = (props: any) => {
    let { as: Comp, ...otherProps } = props;
    const { state, dispatch } = useAuthContext()
    const [{ data: userProfile, loading, error }, fetch] = useAxios({
        url: "/oauth2/userinfo",
        withCredentials: true
    }, { manual: true })

    useEffect(() => {
        if (!state.authenticated && !error && !userProfile) {
            fetch()
        }
        return () => { }
    }, [state.authenticated, fetch, error, userProfile])
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
    }, [userProfile, error, dispatch])

    let decisionComp = (<Backdrop open={loading}>
        <CircularProgress color="inherit" />
    </Backdrop>)

    if (error?.request.status === 401) decisionComp = <FullRedirect url={`/oauth2/authorize`} />

    return <AuthConsumer>
        {auth =>
            <Fragment>
                {
                    userProfile?.success || auth.state.authenticated ?
                        (<Comp {...otherProps} />)
                        :
                        (decisionComp)
                }
            </Fragment>
        }
    </AuthConsumer >
};

export default PrivateRoute;