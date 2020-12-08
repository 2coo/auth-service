import { Redirect } from "@reach/router";
import { Fragment } from "react";
import { AuthConsumer } from "../../store/auth/context";

const PrivateRoute = (props: any) => {
    let { as: Comp, ...otherProps } = props;
    return <AuthConsumer>
        {auth =>
            <Fragment>
                {
                    auth.state.authenticated ?
                        (<Comp {...otherProps} />)
                        :
                        (<Redirect to="/oauth2/authorize" replace={true} noThrow={true} />)
                }
            </Fragment>
        }
    </AuthConsumer >
};

export default PrivateRoute;