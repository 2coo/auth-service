import { useEffect } from "react"
import FullRedirect from "../../components/full-redirect/FullRedirect"
import { AuthConsumer, useAuthContext } from "../../store/auth/context"

const Signout = () => {
    const { dispatch } = useAuthContext()
    useEffect(() => {
        dispatch({
            type: "REMOVE_AUTH"
        })
    }, [dispatch])
    return (
        <div>
            Logging out ...
            <AuthConsumer>
                {auth =>
                    !auth.state.authenticated ? <FullRedirect url="/" /> : null
                }
            </AuthConsumer>
        </div>
    )
}

export default Signout
