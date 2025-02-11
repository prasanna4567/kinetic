![Screenshot](https://user-images.githubusercontent.com/72819/188587709-94e25136-8a77-4d52-8774-ead032d7eaf4.png)


# Kinetic

Kinetic introduces a suite of opinionated admin tools that internal teams can use to manage and run their stores on Open Commerce.


## Run Locally

Clone the project

```bash
  git clone https://github.com/reactioncommerce/kinetic.git
```

Install pnpm

```bash
  npm install -g pnpm
```

Go to the project directory

```bash
  cd kinetic
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Environment Variables

To run this project, you will need to add API endpoint environment variable to your .env file. For example:

```bash
 VITE_API_URL=http://localhost:3000/graphql
```
## Running Tests

To run tests, run the following command

```bash
  pnpm run test
```

## Add Custom Plugins

Kinetic have a level of extensibility and allow users to add custom plugins as well as enable and disable built-in features.

### Steps to add a custom plugin:

- Create a new folder inside the [pages](./src/pages/) directory, this folder should contain all of your plugin implementations.
- Define a new `RouteObject` inside the [routes definition](./src/routes.tsx).
- To add your plugin to the application sidebar, provide a custom sidebar props for `AppLayout` component inside the routes object.

*Note: The `AppLayout` component is used to render the `Sidebar`, `AppBar`, and `PageLayout`. It all comes with a default value to render core features of Kinetic*

Example:

```javascript
// routes.tsx

{
  // ... routes object
  path: "/",
  element:
    <AppLayout
      sidebar={{
        plugins: [
          {
            text: "Plugins",
            key: "plugins",
            subItems: [
              {
                text: "Store Pickup",
                icon: <AbcOutlined fontSize = "small" />,
                to: "/pickup",
                key: "storePickup"
              }
            ]
          }
        ]
      }}
    />
}
```
- If you want to disable or custom a core feature in the sidebar, extends the `CORE_FEATURES` from the `Sidebar` component, modify it and apply to the `AppLayout`. For example, we want to hide the default Orders from the core features and provide our custom Orders page

```javascript
// routes.tsx

import { CORE_FEATURES, FEATURE_KEYS } from "@components/Sidebar";

{
  // ... routes object
  path: "/",
  element:
    <AppLayout
        sidebar={{
           coreFeatures: CORE_FEATURES.filter((sidebarItem) => sidebarItem.key !== FEATURE_KEYS.orders),
           plugins: [
            {
              text: "Plugins",
              key: "plugins",
              subItems: [
                {
                  text: "Custom Orders",
                  icon: <AbcOutlined fontSize = "small" />,
                  to: "/pickup",
                  key: "storePickup"
                }
              ]
            }
        ]
        }}
    />
}
```

## Developer Certificate of Origin
We use the [Developer Certificate of Origin (DCO)](https://developercertificate.org/) in lieu of a Contributor License Agreement for all contributions to Reaction Commerce open source projects. We request that contributors agree to the terms of the DCO and indicate that agreement by signing all commits made to Reaction Commerce projects by adding a line with your name and email address to every Git commit message contributed:
```
Signed-off-by: Jane Doe <jane.doe@example.com>
```

You can sign your commit automatically with Git by using `git commit -s` if you have your `user.name` and `user.email` set as part of your Git configuration.

We ask that you use your real name (please no anonymous contributions or pseudonyms). By signing your commit you are certifying that you have the right have the right to submit it under the open source license used by that particular Reaction Commerce project. You must use your real name (no pseudonyms or anonymous contributions are allowed.)

We use the [Probot DCO GitHub app](https://github.com/apps/dco) to check for DCO signoffs of every commit.

If you forget to sign your commits, the DCO bot will remind you and give you detailed instructions for how to amend your commits to add a signature.

## License
This Project is [Apache 2.0 Licensed](./LICENSE.md)
