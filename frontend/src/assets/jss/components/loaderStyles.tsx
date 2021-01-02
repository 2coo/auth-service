import { makeStyles } from "@material-ui/core";

const loaderStyles = makeStyles((theme) => ({
    "@keyframes spinner": {
        "0%": {
            transform: 'rotate(0deg)',
        },
        "100%": {
            transform: 'rotate(360deg)',
        }
    },
    loader: {
        backgroundColor: '#fff',
        width: '100%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
        textAlign: 'center',
        "&.fullScreen": {
            position: 'fixed',
        },
        "& .wrapper": {
            width: 100,
            height: 100,
            display: 'inline-flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
        },

        "& .inner": {
            width: 40,
            height: 40,
            margin: '0 auto',
            textIndent: '-12345px',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            borderLeft: '1px solid rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            zIndex: 100001,
            "&": {
                animation: '$spinner 600ms infinite linear',
            }
        },
        "& .text": {
            width: 100,
            height: 20,
            textAlign: 'center',
            fontSize: 12,
            letterSpacing: 4,
            color: '#000',
        },
        "&.hidden": {
            zIndex: '-1',
            opacity: 0,
            transition: 'opacity 1s ease 0.5s, z-index 0.1s ease 1.5s',
        }
    },
}
));
export default loaderStyles;
