import { Fragment, useEffect, useRef } from "react"

const FullRedirect = ({ url }: { url: string }) => {
    const formEl = useRef<HTMLFormElement | undefined | null>()
    useEffect(() => {
        formEl.current?.submit()
        return () => {}
    }, [])
    return (
        <Fragment>
            <form ref={(el) => formEl.current = el} action={url} method="get" />
        </Fragment>
    )
}

export default FullRedirect