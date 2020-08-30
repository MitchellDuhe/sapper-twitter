import { writable } from 'svelte/store';

const data = []

export const userTweetData = writable(data)