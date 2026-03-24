# Next 16 Project template

> by Phenomenon.Studio

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


Table of contents:
- [Next 16 Project template](#next-16-project-template)
  - [📦 Stack](#-stack)
  - [🚀 Quick start](#-quick-start)
  - [🤖 Commands](#-commands)
  - [🧶 Structure](#-structure)
    - [Core application structure](#core-application-structure)
    - [Services \& API layer](#services--api-layer)
    - [Application configuration \& utilities](#application-configuration--utilities)
    - [Global application files](#global-application-files)
      - [Build and output directories](#build-and-output-directories)
      - [Configuration files](#configuration-files)
      - [Linting and formatting configuration](#linting-and-formatting-configuration)
      - [Git and development configuration](#git-and-development-configuration)
      - [Editor and environment configurations](#editor-and-environment-configurations)
      - [Agents configuration](#agents-configuration)
      - [Query hooks](#query-hooks)
        - [Query Keys](#query-keys)
      - [Mutation hooks](#mutation-hooks)
    - [Contexts/providers](#contextsproviders)
    - [Stores](#stores)
    - [Hooks](#hooks)
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
>>>>>>> 29fe05584895d184f169bfbca0c628abd5877e7a
    - [Stores](#stores)
    - [Hooks](#hooks)
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
-   [Ky](https://github.com/sindresorhus/ky) - Modern HTTP client;
-   [Nuqs](https://nuqs.dev/) - URL state management;
-   [Zod](https://zod.dev/) - Schema validation
-   [ESLint](https://eslint.org), [Prettier](https://prettier.io), [StyleLint](https://stylelint.io), [Husky](https://typicode.github.io/husky) - Code quality and formatting;

## 🚀 Quick start

1. Install [Node.js](https://nodejs.org);
    > Require [Node.js](https://nodejs.org) >=v22 (Jod as minimum)
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
-   Run the local dev server at `localhost:3000` with scanning mode:
    ```
    npm run dev:scan
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

### Core application structure

-   `src/components` - contains shared components with business logic. These are reusable components that may include some business logic. Each component should consist of:
    -   `index.tsx` - the component file itself;
    -   `styles.module.css` - styles of component file. This file is optional, since we use TailwindCSS;
    -   `types.ts` - types of component file (optional);
    -   `hooks` - contains component hooks dir (optional). Should consist of:
        -   `use<hookName>.ts` - the hook file itself;
    -   `constants.ts` - constants of component file (optional);
    -   `utils` - utils dir of component file (optional). Should consist of:
        -   `<utilName>.ts` - the util file itself;
    -   `schemas` - schemas dir of component file (optional). Should consist of:
        -   `<schemaName>Schema.ts` - the schema file itself with inferred type;
    -   `regexps.ts` - regexps of component file (optional);
    -   `providers` - the providers dir of component file (optional). Should consist of:
        -   `<ProviderName>Provider.tsx` - the provider file itself;
    -   `components` - the components dir of components (optional). Should consist of like `src/components`;

-   `src/components/layouts` - contains layout components for different application layouts. Each layout component should:
    -   have same structure as `src/components` has;
    -   include `<Outlet />` as a child of component;

-   `src/components/ui` - contains basic UI components without business logic like button, input etc. Each component should consist of that files:
    -   `index.tsx` - the component file itself;
    -   `styles.module.css` - styles of component file. This file is optional, since we use TailwindCSS;
    -   `types.ts` - types of component file (optional);
    -   `hooks` - contains component hooks dir (optional). Should consist of:
        -   `use<hookName>.ts` - the hook file itself;
    -   `constants.ts` - constants of component file (optional);
    -   `schemas` - schemas dir of component file (optional). Should consist of:
        -   `<schemaName>Schema.ts` - the schema file itself with inferred type;
    -   `regexps.ts` - regexps of component file (optional);
    -   `utils` - utils dir of component file (optional). Should consist of:
        -   `<utilName>.ts` - the util file itself;

-   `src/modules` - contains independent features that have their own area of responsibility. These features can fetch data and have complete business logic. Each module should consist of:
    -   `index.tsx` - the component file itself;
    -   `styles.module.css` - styles of component file. This file is optional, since we use TailwindCSS;
    -   `types.ts` - types of component file (optional);
    -   `hooks` - contains component hooks dir (optional). Should consist of:
        -   `use<hookName>.ts` - the hook file itself;
    -   `constants.ts` - constants of component file (optional);
    -   `utils` - utils dir of component file (optional). Should consist of:
        -   `<utilName>.ts` - the util file itself;
    -   `schemas` - schemas dir of component file (optional). Should consist of:
        -   `<schemaName>Schema.ts` - the schema file itself with inferred type;
    -   `regexps.ts` - regexps of component file (optional);
    -   `providers` - the providers dir of component file (optional). Should consist of:
        -   `<ProviderName>Provider.tsx` - the provider file itself;
    -   `components` - the components dir of components (optional). Should consist of like `src/components`;

### Services & API layer  

-   `src/services` - contains service layer for API calls and external integrations:
    -   `<serviceName>/` - service directories organized by feature or domain;
        - `api.ts` - API service file;
        - `queries.ts` - file with queries and mutations hooks;
        - `queryKeys.ts` - file with queries and mutations keys;
        - `types.ts` - types of service file: request and response types;
  

### Application configuration & utilities

-   `src/lib` - contains core application utilities and configurations:
    -   `@http.ts` - HTTP client configuration and utilities;
    -   `@queryClient.ts` - Tanstack Query client configuration;
    -   `constants.ts` - global application constants;
    -   `schemas` - global validation schemas dir. Should consist of:
        -   `<schemaName>Schema.ts` - the schema file itself with inferred type;
    -   `regexps.ts` - global regular expressions;
    -   `types.ts` - global TypeScript type definitions;
    -   `utils/` - global utility functions directory:
        -   `<utilDirName>/` - directory for grouped utility functions (optional);
        -   `<utilName>.ts` - individual utility files;

### Global application files

-   `src/hooks` - contains global hooks directory:
    -   `use<hookName>.ts` - global hook files;
-   `src/providers` - global React providers:
    -   `<ProviderName>Provider.tsx` - global provider files;
-   `src/styles` - contains global style files:
    -   `index.css` - the main CSS file;
-   `public/` - can contain static files such as images, fonts, videos, documents, favicons, etc.;


#### Build and output directories

-   `dist/` - production build output directory (generated after `npm run build`);
-   `tmp/` - temporary files directory containing:
    -   `bundle-visualizer.html` - bundle size analysis report (generated after build with rollup-plugin-visualizer);


#### Configuration files

-   `index.html` - main HTML template file with meta tags, font loading, and root div element;
-   `next.config.ts` - Next.js configuration;
-   `tsconfig.json` - main TypeScript configuration;
-   `tsconfig.app.json` - TypeScript configuration for application code;
-   `tsconfig.node.json` - TypeScript configuration for Node.js;
-   `package.json` - project dependencies, scripts, and metadata;
-   `package-lock.json` - exact dependency versions lock file;
-   `skills-lock.json` - agents skills lock file;

#### Linting and formatting configuration

-   `eslint.config.js` - ESLint configuration for JavaScript/TypeScript linting;
-   `prettier.config.js` - Prettier configuration for code formatting;
-   `.prettierignore` - files and directories to ignore during Prettier formatting;
-   `.stylelintrc` - Stylelint configuration for CSS linting;

#### Git and development configuration

-   `.gitignore` - Git ignore rules specifying which files to exclude from version control;
-   `.gitattributes` - Git attributes configuration for line endings and file handling;
-   `.husky/` - Git hooks directory for pre-commit and commit-msg validation;
-   `commitlint.config.cjs` - commit message linting configuration;

#### Editor and environment configurations

-   `.editorconfig` - editor configuration for consistent coding styles;
-   `.npmrc` - NPM configuration settings;
-   `.env.local.example` - example environment variables file (template for `.env.local`);
-   `.env.local` - local environment variables (should be created manually, not committed to git);
  
#### Agents configuration
-   `.agents/` - agents directory. Should consist of:
    -   `skills/` - agents skills directory. Should consist of:
        -   `<skillName>/` - agent skill directory. Should consist of:
            -   `README.md` - agent skill README file;
            -   `skill.md` - agent skill file;
    -   `README.md` - agents README file;
-   `skills-lock.json` - agents skills lock file;

#### Query hooks

Query hooks can have the parameters to be passed like pagination, search params etc. These parameters should be passed into hooks as arguments. Recommended to pass the arguments as list of arguments, not as the object.

Query keys should be defined as described in [`Query keys`](#query-keys) section.

Example:
```ts
export const getBooksQueryOptions = (search: string) => {
    return queryOptions({
        queryKey: booksQueryKeys.listWithParams({ search })
        // ...
    })
}

export const getBooksByAuthorNameQueryOptions = (authorName: string, search: string) => {
    return queryOptions({
        queryKey: booksQueryKeys.itemByAuthor(authorName, { search })
        // ...
    })
}
```

##### Query Keys

It is also recommended to manage query keys in appropriate way to use them inside project.

First things first, you should create the constant that includes queryKeys:
```ts
// src/services/books/queryKeys.ts

export const booksQueryKeys = {
    all: ['books'] as const,
    list() {
        return [...booksQueryKeys.all, 'list'] as const
    },
    listWithParams(params: { search: string }) {
        return [...booksQueryKeys.list(), params] as const
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
        queryKey: booksQueryKeys.listWithParams({ search })
        // ...
    })
  }
  ```
- Query options:
  ```ts
  export const getBooksQueryOptions = (search: string) => {
    return queryOption({
        queryKey: booksQueryKeys.listWithParams({ search })
        // ...
    });
  }
  ```
- Query invalidations:
  ```ts
  import { booksQueryKeys } from '@/services/books/queryKeys';

  queryClient.invalidateQueries({
    queryKey: booksQueryKeys.list()
  })

  // or
  
  queryClient.invalidateQueries(getBooksQueryOptions())
  ```
- Query prefetches:
  ```ts
  import { booksQueryKeys } from '@/services/books/queryKeys';

  queryClient.prefetchQuery({
     queryKey: booksQueryKeys.list()
  })

  // or

  queryClient.getQueryData({
     queryKey: booksQueryKeys.list()
  })
  ```

#### Mutation hooks

Mutation hooks from `useMutation` return the callable function as result, so no need to pass the arguments into hook call. But everything can happen to pass initial arguments into hook body directly for query client logic or whatever.

```ts
// src/services/books/api.ts
export const addBookToFavorites = (bookId: string) => {...}
```

```ts
// src/services/books/queries.ts
import { addBookToFavorites } from './api';

export const addBookToFavoritesMutationOptions = () => {
    return mutationOptions({
        mutationFn: addBookToFavorites
        // ...
    })
}
```
```ts
// somewhere
import { useMutation } from '@tanstack/react-query';
import { addBookToFavoritesMutationOptions } from '@/services/books/queries';

// ...

const { mutate: addBookToFavorites } = useMutation(addBookToFavoritesMutationOptions());

// ...

addBookToFavorites(bookId, {...})
```

### Contexts/providers

Contexts are optional for the root of the project and components among all the project.

No matter, where the providers will appear, they should:
- Have separate `providers` folder inside the folder where the providers will be used
  - Global providers will be used in all the project, should be located at `src/providers` folder. NOTE: Any component is allowed to call such providers.
  - If provider will be used inside single component exclusively, you should create `providers` folder inside the component folder. Example: `src/components/ArticleCard/providers`. NOTE: such providers are not allowed to be used outside of the component scope where the providers folder were created. If such case appears, then you should move the provider(s) into global providers folder. The child components (`src/components/ArticleCard/components/*`) only are allowed to use the provider inside

Each provider should:
- Be created inside the `providers` folder
- Have pascal case name, ending with `<providerName>Provider.tsx` (example: `AuthProvider.tsx`)
- NOTE: The provider file name should match the provider name inside the file

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
