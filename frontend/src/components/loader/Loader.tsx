import clsx from "clsx"
import loaderStyles from "../../assets/jss/components/loaderStyles"

const Loader = ({ spinning = false, fullScreen }: {
    spinning: boolean,
    fullScreen: boolean
}) => {
    const classes = loaderStyles()
    return (
        <div
            className={clsx(classes.loader, {
                "hidden": !spinning,
                "fullScreen": fullScreen,
            })}
        >
            <div className="wrapper">
                <div className="inner" />
                <div className="text">LOADING</div>
            </div>
        </div>
    )
}

export default Loader
