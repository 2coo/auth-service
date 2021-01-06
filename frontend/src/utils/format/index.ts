import queryString from "querystring";
import { cloneDeep, isEmpty } from "lodash";
export function arrayToTree(
  array: any[],
  id = "id",
  parentId = "pid",
  children = "children"
) {
  const result: any[] = [];
  const hash: { [any: string]: any } = {};
  const data = cloneDeep(array);

  data.forEach((item: any, index: number) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach((item) => {
    const hashParent = hash[item[parentId]];
    if (hashParent) {
      !hashParent[children] && (hashParent[children] = []);
      hashParent[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

export const formatQueryString = (queryParams: { [any: string]: any }) => {
  return !isEmpty(queryParams) ? `?${queryString.stringify(queryParams)}` : "";
};
