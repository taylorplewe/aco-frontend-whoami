# aco-frontend-whoami
Get to know you activity for work, built with SolidJS.

Note this repo does not contain personal information about anyone. It gets the list of people from a JSON which is `gitignore`d.

The users JSON should be called `users.json` and have the structure
```json
[
  {
    "id": "string",
    "name": "string",
    "imageUrl": "string"
  }
]
```

There is also a `gitignore`d file, `src/urls.ts` which should contain the following structure:
```ts
export default {
  INTRO: string,
  ENGINEER_SELECT: string,
  REVIEW: string,
  USER_RESULTS: string,
  RESULTS: string,
  SUBMIT: string,
};
```

I registered the domain [aco-frontends-guess-who.com](https://aco-frontends-guess-who.com) for this. Can't promise it will still be there when you read this. If it's not, try [tplewe.com/aco-frontends-guess-who](https://tplewe.com/aco-frontends-guess-who).
