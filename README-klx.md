# Klx - Frontend take home test

The project has been set up with `node` version **22.16.0** and `npm` version **10.9.2**.

## Technical stack

-   `nx` (monorepo)
-   `rspack` (bundler)
-   `eslint`
-   `prettier`
-   `react`
-   `typescript`
-   `tailwinds`

## Libs

-   `mobx`
-   `react-rnd`
-   `@faker-js/faker`
-   `@emotion/react`

## First steps

-   Install dependencies : `npm install`
-   Start apps :
    -   board : `npm run serve:board`
    -   admin : `npm run serve:admin`

## App description

The current monorepo is composed of 2 apps : `board` and `admin` ; and 2 packages : `models` and `ui`.

### `board` app

-   This is a basic whiteboard app that displays a single type of object : ideas.
-   They can be moved and resized on the board.

### `admin` app

-   This is a basic app that displays a list of users in a table after being fetched.
-   There is also a button for showing and hiding a clock.

## Expectations

### Board : New object types

-   Update the whiteboard in order to handle 2 new object types : **images** and **iframes**.

An image object that can be added to the board with an input file.

An iframe object that can be added to the board with a button that shows a form asking for the iframe url.

Keep in mind that the board need to scalable : some other new board object types can be added or existing ones can updated in the future.

Feel free to update the apps and packages for a better project **architecture** and **state management** (global and/or local). You can also add unit tests if you feel like it.

-   A bug has also been spotted by our team : the resize of a board object is not always working, can you help us fix it?

-   Apps need to be operational for a live demo.

---

### Admin : Improvements

-   We're not very proud of how the `admin` app has been made, it seems to be **buggy** and have some **performance** issues.

Could you take a look and help use improve it ?
