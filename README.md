# Next 15 Project template

> by Phenomenon.Studio

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


Table of contents:
- [Next 15 Project template](#next-15-project-template)
  - [📦 Stack](#-stack)
  - [🚀 Quick start](#-quick-start)
  - [🤖 Commands](#-commands)
  - [🧶 Structure](#-structure)
    - [API requests](#api-requests)
      - [API queryClient options](#api-queryclient-options)
    - [Contexts](#contexts)
    - [Stores](#stores)
    - [Hooks](#hooks)
      - [API hooks](#api-hooks)
      - [Query hooks](#query-hooks)
        - [Query Keys](#query-keys)
      - [Mutation hooks](#mutation-hooks)
    - [Utility functions](#utility-functions)
    - [Constants](#constants)
      - [Schemas](#schemas)
    - [Types](#types)
    - [Styles](#styles)
    - [Components](#components)
      - [Anatomy](#anatomy)
    - [Modules](#modules)
      - [Submodules](#submodules)
  - [✳️ Icons Usage](#️-icons-usage)
---

## 📦 Stack

-   [Next.js](https://nextjs.org/docs) - React Framework
-   [React.js](https://reactjs.org) - UI library
-   [Typescript](https://www.typescriptlang.org) - Static type checker
-   [CLSX](https://github.com/lukeed/clsx) - classnames utility
-   [Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/overview) - Asynchronous state management
-   [Axios](https://axios-http.com/docs/intro) - HTTP client
-   [Zod](https://zod.dev/) - Schema validation
-   [React Hook Form](https://react-hook-form.com/) - Form management
-   [Eslint](https://eslint.org/) - Code linter
-   [Prettier](https://prettier.io/) - Code formatter
-   [Husky](https://typicode.github.io/husky/) - commands execution handler on git events

## 🚀 Quick start

1. Install [Node.js](https://nodejs.org);
    > Require [Node.js](https://nodejs.org) v18 or >=v20 (hydrogen as minimum)
2. Install the NPM dependencies by running `npm ci`;
3. You should create `.env.local` and add variables. You can look in [.env.local.example](./.env.local.example) file;
4. Update project metadata:
   1. Title ([/app/layout.tsx](./app/layout.tsx) metadata constant)
   2. Description ([/app/layout.tsx](./app/layout.tsx) metadata constant)
   3. Favicons 
      1. `.ico` - add `favicon.icon` file in the `/app` folder
      2. `.svg` - add `icon.svg` file in the `/app` folder
      3. `.png` - add `apple-icon.png` file in the `/app` folder
          > Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons


## 🤖 Commands

-   Run the local dev server at `localhost:3000`:
    ```
    npm run dev
    ```
-   Build your production site to `./.next/`:
    ```
    npm run build
    ```
-   Preview your build locally, before deploying at `localhost:3000` !(should be free, no replacement to the closest port):
    ```
    npm run start
    ```
-   Check your CSS for errors and warnings:
    ```
    npm run lint:stylelint
    ```
-   Check your code formatting:
    ```
    npm run lint:prettier
    ```
-   Fix your code formatting:
    ```
    npm run lint:prettier:fix
    ```
-   Check your code all together:
    ```
    npm run lint
    ```
-   Install husky:
    ```bash
    npm run prepare
    ```

## 🧶 Structure

### API requests

API requests are created globally in the root of the project to be used inside API hooks. API request are not directly called in project, only in hooks.

API requests should be located inside `src/api` folder.

API requests are performed with some library like `ky`, `axios` etc. Based on the library, `src/api` folder should contain the appropriate file `@ky.ts` or `@axios.ts`. This file should contain all instances for all origins.

Example:
```ts
// @axios.ts

export const http = axios.create(...);
export const httpPrivate = axios.create(...);
```

API requests should:
- be separated to files based on its scope. 
  - Example: users requests -> `users.ts`; forms requests -> `forms.ts`

#### API queryClient options

When Tanstack Query is used, queryClient entity is created once on project start, and is used within all the application. By setting it in global api folder, we will be able to use it wherever needed in the app.

The query client configuration file should be located at `src/tanstackQuery/@queryClient.ts` and include configuration as follows as bare minimum:
```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
        mutations: {
            retry: 1,
        },
    },
});
```

This configuration should be passed to `<QueryClientProvider />` in `src/main.tsx` file.

>NOTE: This configuration as allowed to be used wherever using `useQueryClient` hook is not allowed:
>- routes loaders
>- functions may include api logic (setting query data etc.)

### Contexts

Contexts are optional for the root of the project and components among all the project.

No matter, where the contexts will appear, they should:
- Have separate `contexts` folder inside the folder where the hooks will be used
  - Global contexts will be used in all the project, should be located at `src/contexts` folder. NOTE: Any component is allowed to call such contexts.
  - If context will be used inside single component exclusively, you should create `contexts` folder inside the component folder. Example: `src/components/ArticleCard/contexts`. NOTE: such contexts are not allowed to be used outside of the component scope where the hooks folder were created. If such case appears, then you should move the hook(s) into global hooks folder. The child components (`src/components/ArticleCard/components/*`) only are allowed to use the context inside

Each context should:
- Be created inside the `contexts` folder
- Have pascal case name, ending with `<contextName>Context` (example: `AuthContext.tsx`)
- NOTE: The context file name should match the context name inside the file

``` ts
// src/contexts/AuthContext.tsx

const AuthContext = createContext(...);
```

### Stores

Stores are optional for the root of the project. Current rules are applied for `zustand` stores

Stores are allowed to use in all the project.

Stores should:
- Have separate root `src/stores` folder

Each store should:
- Have camel case name, ending with `<storeName>Store` (example: `authStore.tsx`)
- NOTE: The store file name should match the store hook name name inside the file
  - `<storeName>Store.ts` -> `use<StoreName>Store.ts`

``` ts
// src/stores/authStore.ts

export const useAuthStore = create(...)
```

### Hooks

Hooks are optional for the root of the project and components among all the project.

No matter, where the hooks will appear, they should:
- Have separate `hooks` folder inside the folder where the hooks will be used
  - Global hooks will be used in all the project, should be located at `src/hooks` folder
  - If hook will be used inside single component exclusively, you should create `hooks` folder inside the component folder. Example: `src/components/ArticleCard/hooks`. NOTE: such hooks are not allowed to be used outside of the component scope where the hooks folder were created. If such case appears, then you should move the hook(s) into global hooks folder

Each hook should:
- Be created inside the `hooks` folder
- Have camel case name, starting with `use` (example: `useHavePermissions.ts`)
- NOTE: The hook file name should match the hook name inside the file

``` ts
// src/hooks/useHavePermissions.ts

export const useHavePermissions = () => {...}
```

#### API hooks

Because of using Tanstack query, and its hooks mechanic, following the TkDodo's recommendations, all API requests should be inside custom hooks that call `useQuery` and `useMutation` hooks. API requests were described in the relevant section above.

API hooks should be located inside `src/tanstackQuery` folder.

API hooks should:
- be named for the api file. `src/api/users.ts` -> `src/tanstackQuery/users.ts`
- contain all hooks for every function declared in the api requests file

Single API hook should:
- be named for the api request function. `<requestName>` -> `use<RequestName>`
  - Example: `submitForm` -> `useSubmitForm`

#### Query hooks

Query hooks can have the parameters to be passed like pagination, search params etc. These parameters should be passed into hooks as arguments. Recommended to pass the arguments as list of arguments, not as the object.

Query keys should be defined as described in [`Query keys`](#query-keys) section.

Example:
```ts
export const useGetBooks = (search: string) => {
    return useQuery({
        queryKey: BOOKS_QUERY_KEYS.listWithParams({ search })
        // ...
    })
}

export const useGetBooksByAuthorName = (authorName: string, search: string) => {
    return useQuery({
        queryKey: BOOKS_QUERY_KEYS.itemByAuthor(authorName, { search })
        // ...
    })
}
```

##### Query Keys

It is also recommended to manage query keys in appropriate way to use them inside project.

First things first, you should create the constant that includes queryKeys:
```ts
// src/tanstackQuery/books.ts

export const BOOKS_QUERY_KEYS = {
    all: ['books'] as const,
    list() {
        return [...BOOKS_QUERY_KEYS.all, 'list'] as const
    },
    listWithParams(params: { search: string }) {
        return [...BOOKS_QUERY_KEYS.list(), params] as const
    }
    // ...
}
```

>NOTE: Query keys contacts are allowed to be used in all the project to make invalidations and prefetched possible on a lot of events occur by user activities.

And apply this in:
- Query hooks:
  ```ts
  export const useGetBooks = (search: string) => {
    return useQuery({
        queryKey: BOOKS_QUERY_KEYS.listWithParams({ search })
        // ...
    })
  }
  ```
- Query options:
  ```ts
  export const getBooksQueryOptions = (search: string) => {
    return queryOption({
        queryKey: BOOKS_QUERY_KEYS.listWithParams({ search })
        // ...
    });
  }

  export const useGetBooks = (search: string) => {
    return getBooksQueryOptions(search);
  }
  ```
- Query invalidations:
  ```ts
  import { BOOKS_QUERY_KEYS } from '@/tanstackQuery/books';

  queryClient.invalidateQueries({
    queryKey: BOOKS_QUERY_KEYS.list()
  })
  ```
- Query prefetches:
  ```ts
  import { BOOKS_QUERY_KEYS } from '@/tanstackQuery/books';

  queryClient.prefetchQuery({
     queryKey: BOOKS_QUERY_KEYS.list()
  })

  // or

  queryClient.getQueryData({
     queryKey: BOOKS_QUERY_KEYS.list()
  })
  ```

#### Mutation hooks

Mutation hooks from `useMutation` return the callable function as result, so no need to pass the arguments into hook call. But everything can happen to pass initial arguments into hook body directly for query client logic or whatever.

```ts
// src/tanstackQuery/books.ts

export const addBookToFavorites = (bookId: string) => {...}

// src/tanstackQuery/books.ts

import { addBookToFavorites } from '@/tanstackQuery/books';

export const useAddBookToFavorites = () => {
    return useMutation({
        mutationFn: addBookToFavorites
        // ...
    })
}

// somewhere
import { useAddBookToFavorites } from '@/tanstackQuery/books';

// ...

const { mutate: addBookToFavorites } = useAddBookToFavorites();

// ...

addBookToFavorites(bookId, {...})

```

### Utility functions

Utility functions are optional for the root of the project and components among all the project.

No matter, where the utils will appear, they should:
- Have separate `utils` folder inside the folder where the utils will be used
  - Global utils will be used in all the project, should be located at `src/utils` folder
  - If util will be used inside single component exclusively, you should create `utils` folder inside the component folder. Example: `src/components/ArticleCard/utils`. NOTE: such utils are not allowed to be used outside of the component scope where the utils folder were created. If such case appears, then you should move the util(s) into global utils folder

Each util should:
- Be created inside the `utils` folder
- Have camel case name (example: `getHasPermissions.ts`)
- NOTE: The util file name should match the util name inside the file
- (Optional): Unit tests can be written for the util
  - `<utilName>.ts` -> `<utilName>.test.ts`

``` ts
//getHasPermissions.ts

export const getHasPermissions = () => {...}
```

### Constants

Constants are optional for the root of the project and components among all the project.

There are 2 types of constants to use:
- Regular constants (`constants.ts`)
- Schemas constants (`schemas/` folder)

The rules described below are applied for both of them.
The only difference is:
- `constants.ts` - for regular constants like time tokens, regexps etc.
- `schemas/` folder - for `zod` schemas will be used in other schemas in all the project

No matter, where the constants will appear, they should:
- Have separate `constants.ts` file inside the folder where the constants will be created
  - Global constants will be used in all the project, should be located at `src/constants.ts` file
  - If constants will be used inside single component exclusively, you should create `constants.ts` file inside the component folder. Example: `src/components/ArticleCard/constants.ts`.
   >NOTE: such constants are not allowed to be used outside of the component scope where the constants file were created. If such case appears, then you should move the constants(s) into global constants file

#### Schemas

Schemas should:
- Have separate `schemas` folder inside the folder where the schemas will be used
  - Global schemas will be used in all the project, should be located at `src/schemas/` folder
  - If schemas will be used inside single component exclusively, you should create `schemas/` folder inside the component folder. Example: `src/components/ArticleCard/schemas/`.
- Each schema should have camel case name with ending `<schemaName>Schema.ts`.
- Each schema should have its inferred type

Few more thing should be applied to schemas:
```ts
import { z } from 'zod';
// ...

export const signUpSchema = z.object({...});
export type SignUpSchema = z.infer<typeof signUpSchema>;
```

### Types

Types are optional for the root of the project and components among all the project.

The root project types should include:
- Generic global types
- Global primitive types for several components

The components types should include:
- Component props
- Components props partitions

### Styles

Styles are optional for the root of the project and components among all the project.

The global styles are located inside `src/styles` folder
This folder should include:
- `index.css` - root project styles (incl. imports of other root style files described below)
- `reset.css` - predefined browsers styles reset file
- `variables.css` - (optional) global variables file. This file can be created if there are a lot of variables to create and manage them easily. In case of ~25 variables they can still be maintained in `index.css`.
- `fonts.css` - (optional) global fonts to be implemented through `@font-face` directive.

### Components
Components should be located at:
- `src/ui`
  - basic primitive components (Example: buttons, typography, wrappers etc.)
  - do not have complex logic (complex hooks, contexts)
  - can NOT use `src/components` components inside
- `src/components`
  - complex components use `src/ui` components inside as building blocks
  - Can have any types of hooks, contexts inside


#### Anatomy

The component should:
- Have separate folder
- Have pascal case name (example: `Button` or `ArticleCard`)
- Have default export of the component itself

The component folder should contain:
- `index.tsx` - the component JSX, entry points of component
- `styles.module.css` - the styles of component file (optional)

> NOTE: If component has to haves hooks/utils/constants/contexts, take a look at relevant chapters above.

### Modules

Modules are core blocks are used for routing. Router entries render modules only. It is not allowed to pass the components from `src/components` or `src/ui`.

Modules are located at `src/modules` folder.

Modules represent pages we should display within router. Modules hierarchy may also represent the routes subrouting.

Every module should:
- be named for the route it represent:
  - `http://localhost:3000/about` -> `src/modules/About`
- have the same architecture as `src/components` or `src/ui` as described above
- have no props
- module name should match the module component name:
  ```ts
  // src/modules/About/index.tsx

  export const About: React.FC = () => {...}
  ```

Modules are allowed:
- to use `src/components` and/or `src/ui` components inside
- to have own hooks
- to have own constants/schemas/styles
- to have own sub-modules and/or sub-components (`src/modules/About/components/...`)
- to use its sub-modules inside if it is not a sub-route

#### Submodules

Submodules are the modules inside the some module (`src/modules/About/components/...`).

Submodules may have everything regular modules can have and do, but they can be used in two ways:
- as sub-component for the rot module
  - but it is already not allowed to be used as sub-route
- as sub-route:
  - `src/modules/About/components/Settings` -> `http://localhost:3000/about/settings`


## ✳️ Icons Usage

1. Collect all icons as separate files with `.svg` extension and kebab-case naming. BUT the size of the icon should be added to the end of file name, starting with `_` underscore

Example:
```md
src
├── icons
│   ├── arrow-left_16.svg
│   ├── search_20.svg
│   └── arrow-right-circle_24.svg
```

2. Update all dynamic color elements of each icon to be filled/stroked with `currentColor` value. it will inherit the CSS `color` rule applied to the icon ot its parent
3. Import the icon as regular JSX component:
   ```tsx
   import CloseCircleFill16Icon from '@/icons/close-circle-fill_16.svg';

   // ...
   return (
    // ...
    <CloseCircleFill16Icon className={s.icon} />
   );
   ```
