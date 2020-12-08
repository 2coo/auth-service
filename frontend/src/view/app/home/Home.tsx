import { StringParam, useQueryParam } from "use-query-params"
import { useAuthContext } from "../../../store/auth/context";
import { useAxios } from "../../../utils/api";

const Home = (props: any) => {
    const { dispatch } = useAuthContext()
    const [{ data: userProfile, loading, error },] = useAxios("/oauth2/userinfo")
    // dispatch({
    //     type: "ADD_AUTH",
    //     payload: {

    //     }
    // })
    const [search, setSearch] = useQueryParam('search', StringParam);

    return (
        <div>
            Home
            <p>{search}</p>
            <input onChange={(e) => setSearch(e.target.value)} />
        </div>
    )
}

export default Home
