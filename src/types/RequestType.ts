import { Request } from "express"

export type ExtendRequest = Request & {
    username?: string
}