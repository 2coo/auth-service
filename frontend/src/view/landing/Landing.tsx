import { Link, Redirect } from "@reach/router"
const Landing = (props: any) => {
    return (
        <div>
            <p>Landing Page</p>
            <Link to="/app/">Go to dashboard</Link>
            <Redirect to="/login" noThrow />
        </div>
    )
}

export default Landing
