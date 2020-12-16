import { StringParam, useQueryParam } from "use-query-params"
import { AuthConsumer } from "../../../store/auth/context";
const Home = (props: any) => {
    return (
        <AuthConsumer>
            {auth => (
                <div>
                    <h3>
                        Welcome, {auth.state.user?.name}
                    </h3>
                    <p>Roles</p>
                    <ul>
                        {
                            auth.state.user?.roles?.map((role) =>
                                <li>
                                    {role}
                                </li>
                            )
                        }
                    </ul>
                </div>
            )
            }
        </AuthConsumer>
    )
}

export default Home
