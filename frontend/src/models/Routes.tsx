import { RouteComponentProps } from "@reach/router";
import { FC, ReactNode } from "react";

export interface Routes {
    name: string
    path: string
    icon?: ReactNode
    component: FC<RouteComponentProps>
    subroutes?: Array<this>
    isProtected?: boolean
    isSiderMenu?: boolean | undefined
    verify?: () => boolean
}