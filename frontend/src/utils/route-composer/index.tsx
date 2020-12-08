import ProtectedRouter from "../../components/protected-router/ProtectedRouter";
import { Routes } from "../../models/Routes";

const composeRoutes = (routes: Array<Routes>) => {
    const allRoutes = routes.map((route, index) => {
        let Route = route.component;
        if (route.isProtected) {
            Route = ProtectedRouter
        }
        if (route?.subroutes && route.subroutes.length > 0) {
            const withSubRoutes = <Route {...{ as: route.isProtected ? route.component : "" }} path={route.path} key={index} >
                {composeRoutes(route!.subroutes)
                }
            </Route >
            return withSubRoutes;
        }

        return route.verify === undefined || (route.verify && route.verify()) ? <Route path={route.path} key={index} /> : null;
    })
    return allRoutes.flat();
};

export default composeRoutes