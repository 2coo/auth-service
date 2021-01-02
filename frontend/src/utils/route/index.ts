import _ from "lodash";
import { Routes } from "../../models/Routes";

type routeNode = {
  parent: routeNode;
  siblings: Routes[] | undefined;
  org: Routes | undefined;
} | null;

export const getParent = (routes: Routes[], pathname: string) => {
  const parent = _.find(routes, {
    subroutes: [
      {
        path: pathname,
      },
    ],
  }) as Routes;
  return parent;
};

export const getFullPath = (
  routeNode: routeNode,
  path: string = ""
): string => {
  const changedPath = `${
    routeNode?.org?.path === "/" ? "" : routeNode?.org?.path
  }/${path}`;
  console.log(routeNode);
  console.log(changedPath);

  const currentRouteNode: routeNode = routeNode!.parent;
  if (!routeNode!.parent) {
    return changedPath;
  }
  return getFullPath(currentRouteNode, changedPath);
};

export const formatRoutes = (routes: Routes[]): Routes[] => {
  return routes.map((route) => {
    return {
      ...route,
      subroutes: route.subroutes
        ? formatRoutes(
            route.subroutes.map((child_route) => ({
              ...child_route,
              path: `${route.path === "/" ? "" : route.path}/${
                child_route.path === "/" ? "" : child_route.path
              }`,
            }))
          )
        : undefined,
    };
  });
};
