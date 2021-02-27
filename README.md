This is an app made using sapper and the twitter api.

The app looks at a users tweets from the last week, saves them to a mongo database, and displays them using sapper/svelte.

The app saves the users tweets from the first time they were searched and does not each search to limit api calls and db storage, which are both free tier.
