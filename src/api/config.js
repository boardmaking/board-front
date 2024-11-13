const SERVER_HOST = import.meta.env.VITE_API_SERVER_HOST

export const API_SERVER_HOST = `${SERVER_HOST}:8081`

export const USER = `${API_SERVER_HOST}/users`

export const BOARD = `${API_SERVER_HOST}/boards`

export const COMMENT = `${API_SERVER_HOST}/comment`

export const IMAGE = `${API_SERVER_HOST}/images`
