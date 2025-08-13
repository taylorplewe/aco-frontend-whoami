# aco-frontend-whoami
Get to know you activity for work, built with SolidJS.

Note this repo does not contain personal information about anyone. It gets the list of people from a JSON which is `gitignore`d.

The users JSON should be called `users.json`, live in the root directory, and have the structure:
```json
[
  {
    "id": "taylor_plewe",
    "name": "Taylor Plewe",
    "imageUrl": "https://tplewe.com/tupac.png"
  }
]
```

There is also a `gitignore`d file, `src/urls.ts` which should contain the following structure:
```ts
export default {
  INTRO: "/aco-frontend-whoami/dist",
  ENGINEER_SELECT: "/aco-frontend-whoami/dist/engineer-select",
  REVIEW: "/aco-frontend-whoami/dist/review",
  USER_RESULTS: "/aco-frontend-whoami/dist/user-results",
  RESULTS: "https://tplewe.com/aco-frontends-guess-who/dist/submit",
  SUBMIT: "/aco-frontend-whoami/dist/results",
};
```

### Building & running
Once you've cloned the repo, the two aforementioned `gitignore`d files are in place, you should be able to run
```sh
npm install
```
followed by
```sh
npm run dev
```
for a dev build, or
```sh
npm run build
```
for a production build.

I registered the domain [aco-frontends-guess-who.com](https://aco-frontends-guess-who.com) for this. Can't promise it will still be there when you read this. If it's not, try [tplewe.com/aco-frontends-guess-who](https://tplewe.com/aco-frontends-guess-who).
