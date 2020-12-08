import { Link } from "@reach/router"
const Landing = (props: any) => {
    return (
        <div>
            <p>Landing Page</p>
            <Link to="/app">Go to dashboard</Link>
        </div>
    )
}

export default Landing
