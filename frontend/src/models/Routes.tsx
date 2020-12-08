import { RouteComponentProps } from "@reach/router";
import { FC } from "react";

export interface Routes {
    label: string
    path: string
    component: FC<RouteComponentProps>
    subroutes?: Array<this>
    isProtected?: boolean
    verify?: () => boolean
}