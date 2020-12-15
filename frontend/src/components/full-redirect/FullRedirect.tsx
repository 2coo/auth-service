import { Fragment, useEffect, useRef, useState } from "react"
import queryString from "querystring"

const FullRedirect = ({ url }: { url: string }) => {
    const formEl = useRef<HTMLFormElement | undefined | null>()
    const [queryParams,] = useState(
        url.indexOf("?") > -1 ? queryString.parse(url.substr(url.indexOf("?") + 1, url.length)) : {}
    )
    const path = url.indexOf("?") > -1 ? url.split("?")[0] : url
    useEffect(() => {
        formEl.current?.submit()
        return () => { }
    }, [])
    return (
        <Fragment>
            <form ref={(el) => formEl.current = el} action={path} method="get">
                {Object.keys(queryParams).map((param) => <input type="hidden" key={param} name={param} value={queryParams[param]} />)}
            </form>
        </Fragment>
    )
}

export default FullRedirect