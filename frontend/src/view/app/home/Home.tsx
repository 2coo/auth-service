import { Can, useAbility } from "../../../store/ability/context";
import { AuthConsumer } from "../../../store/auth/context";
const Home = (props: any) => {
    const ability = useAbility()
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
                    <p>CASL/Ability - My abilities</p>
                    <ul>
                        {
                            ability.rules.map((rule: any) =>
                                <li>
                                    [{rule.action.join(",")}]:[{rule.subject.join(",")}]
                                </li>
                            )
                        }
                    </ul>
                    <Can I="read" a="Test">
                        <p>You can read test, because you are seeing this text.</p>
                    </Can>
                </div>
            )
            }
        </AuthConsumer>
    )
}

export default Home
