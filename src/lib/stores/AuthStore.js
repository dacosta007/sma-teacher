import { writable } from "svelte/store";

export const AuthStore = writable({ isLoggedIn: false, userId: "", user: {} })