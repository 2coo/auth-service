import { unpackRules } from '@casl/ability/extra';
import { makeStyles } from "@material-ui/core";
import { Fragment, useEffect } from "react";
import { useAbility } from "../../store/ability/context";
import { AuthConsumer, useAuthContext } from "../../store/auth/context";
import { useAxios } from "../../utils/api";
import FullRedirect from "../full-redirect/FullRedirect";
import Loader from '../loader/Loader';

const useStyles = makeStyles((theme) => ({
    Backdrop: {
        zIndex: 1202
    }
}))

const ProtectedRoute = (props: any) => {
    let { as: Comp, ...otherProps } = props;
    const { state, dispatch } = useAuthContext()
    const ability = useAbility()
    const [{ data: userProfile, loading, error }, fetch] = useAxios({
        url: "/oauth2/userinfo",
        withCredentials: true
    }, { manual: true })

    const [{ data: userAbilities, loading: abilityLoading, error: abilityError }, fetchAbility] = useAxios({
        url: "/myabilities",
        withCredentials: true
    }, { manual: true })

    useEffect(() => {
        if (!state.authenticated && !error && !userProfile) {
            fetch()
        } else {
            fetchAbility()
        }
        return () => { }
    }, [state.authenticated, fetch, error, userProfile, fetchAbility])
    useEffect(() => {
        if (userProfile?.success === true) {
            fetchAbility()
            dispatch({
                type: "ADD_AUTH",
                payload: {
                    authenticated: true,
                    user: userProfile.data
                }
            })
        }
        return () => { }
    }, [userProfile, error, dispatch, fetchAbility])

    useEffect(() => {
        if (userAbilities?.success === true) {
            ability.update(unpackRules(userAbilities?.data?.rules))
        }
        return () => { }
    }, [userAbilities, ability])

    let decisionComp = <Fragment />

    // if (error || abilityError) decisionComp = <FullRedirect url={`/oauth2/authorize`} />
    return <AuthConsumer>
        {auth =>
            <Fragment>
                <Loader spinning={loading || abilityLoading} fullScreen={true} />
                {
                    userProfile?.success || auth.state.authenticated ?
                        (<Comp {...otherProps} />)
                        :
                        decisionComp
                }
            </Fragment>
        }
    </AuthConsumer >
};

export default ProtectedRoute;