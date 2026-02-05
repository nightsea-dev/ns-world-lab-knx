import { ID } from "@ns-lab-knx/types";


export const _getById = (
    id: ID
) => document.getElementById(id) as HTMLElement | undefined
