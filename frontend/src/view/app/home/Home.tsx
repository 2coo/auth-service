import { StringParam, useQueryParam } from "use-query-params"
const Home = (props: any) => {
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
