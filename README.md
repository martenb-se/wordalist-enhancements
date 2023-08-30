# Wordalist Enhancements

A userscript with enhancements for the study tool [Wordalist (wordalist.com)](https://wordalist.com/).

[![license][license-image]][license-url]
[![Wordalist Enhancements on GreasyFork][greasyfork-image]][greasyfork-url]

[license-image]: https://img.shields.io/github/license/pionxzh/chatgpt-exporter?color=red

[license-url]: ./LICENSE

[greasyfork-image]: https://img.shields.io/static/v1?label=%20&message=GreasyFork&style=flat&labelColor=7B0000&color=960000&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=

[greasyfork-url]: https://greasyfork.org/en/scripts/471259-wle-wordalist-enhancements

## Table of contents

* [Wordalist Enhancements](#wordalist-enhancements)
  * [Features](#features)
    * [Creating custom sections selections](#creating-custom-sections-selections)
    * [Practice and manage custom sections selections](#practice-and-manage-custom-sections-selections)
    * [Load all pages of an exercise's section](#load-all-pages-of-an-exercises-section)
    * [Desktop vs. mobile view](#desktop-vs-mobile-view)
  * [Install](#install)
    * [Prerequisites](#prerequisites)
      * [Tampermonkey](#tampermonkey)
    * [Userscript](#userscript)
  * [Configuration](#configuration)
    * [Configure Firebase synchronization](#configure-firebase-synchronization)
  * [Development](#development)
    * [Notes](#notes)
    * [Setup](#setup)
      * [Prerequisites](#prerequisites-1)
        * [NVM](#nvm)
        * [Node](#node)
        * [PNPM](#pnpm)
      * [Project setup](#project-setup)
    * [Suggested improvements](#suggested-improvements)

## Features

### Creating custom sections selections

When the option to create custom sections selections is enabled, it is possible to go to an exercise page
(for example, [Academic Vocabulary](https://wordalist.com/exercise/107)) and select sections to be included in a
named sections selection.

<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_choose_01.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_choose_01_mini.png" 
      alt="A screenshot showing sections being selected">
    <div style="text-align: justify;">Sections 2a to 2d from the Academic Vocabulary exercise being selected.</div>
  </a>
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_choose_02.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_choose_02_mini.png" 
      alt="A screenshot showing a popup to save a custom sections selection with the name 'Exercise 2a to 2d'">
    <div style="text-align: justify;">Saving sections 2a to 2d from Academic Vocabulary as a new custom sections selection.</div>
  </a>
</div>

### Practice and manage custom sections selections

When the option to create custom sections selections is enabled, the **WLE Selections** menu shows the custom sections
selections that have been created, allowing for them to be practiced in a single session utilizing the
"intelligent artificial learning coach" that is Wordalist.

<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_start_practice_01.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_start_practice_01_mini.png" 
      alt="A screenshot showing the link to a custom selections exercise and what location it addresses.">
    <div style="text-align: justify;">Custom sections selections are practiced by clicking the name of the selection in the <b>WLE Selections</b> menu.</div>
  </a>
</div>

When practicing custom sections selections, **Wordalist Enhancements** will keep track of simple statistics to help
decide what should be practiced next. If the **data synchronization** mentioned further down below is enabled,
statistics will be combined between any devices that have set up synchronization.

The **WLE Selections** menu further allows for reordering, modifying or deleting of exercises and custom selections.
Furthermore, custom sections selections can be exported later to be imported elsewhere, to share with a friend.

<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_saved_01.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_saved_01_mini.png" 
      alt="A screenshot showing saved custom sections selections.">
    <div style="text-align: justify;">Saved custom selections available in the <b>WLE Selections</b> menu categorized under their exercise (<i>Academic Vocabulary</i>).</div>
  </a>
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_saved_02.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_saved_02_mini.png" 
      alt="A screenshot showing which sections are included in a specific custom sections selection.">
    <div style="text-align: justify;">Clicking the middle action button allows for inspection and management of sections included within a custom sections selection.</div>
  </a>
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_export_01.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_export_01_mini.png" 
      alt="A screenshot showing custom sections selections being exported to the clipboard.">
    <div style="text-align: justify;">Under "export exercises" in the <b>WLE Selections</b> menu, clicking the text area copies the custom sections selections to the clipboard.</div>
  </a>
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_import_01.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_selections_import_01_mini.png" 
      alt="A screenshot...">
    <div style="text-align: justify;">Under "import exercises" in the <b>WLE Selections</b> menu, custom sections selections may be imported by pasting text previously exported.</div>
  </a>
</div>

### Load all pages of an exercise's section

When the option to load all pages is enabled, exploring the section of an exercise
(for example [Exercise 02a in Academic Vocabulary](https://wordalist.com/exercise/107/section/428)) becomes simpler.
With a click of a button, all questions are loaded onto the current page making it easy to find what you
are looking for.

<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_load_pages_01.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_load_pages_01_mini.png" 
      alt="A screenshot showing the button to load all questions for a section.">
    <div style="text-align: justify;">Clicking the "show all questions" button loads all questions from the section onto the current page.</div>
  </a>
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_load_pages_02.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/wle_load_pages_02_mini.png" 
      alt="A screenshot showing that all questions have been loaded for a section.">
    <div style="text-align: justify;">After all questions have been loaded on the current page, it is easy to scroll through the different pages of questions which are neatly separated.</div>
  </a>
</div>

### Desktop vs. mobile view

[Wordalist](https://wordalist.com/) is adapted to a mobile and desktop environment, so this plugin is as well.
When using **Wordalist Enhancements** on a larger screen, all functionality will be added to the ordinary menus.
When a smaller screen is used, the added functionality will be accessible without opening the ordinary menu.

<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/desktop_mobile_01.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/desktop_mobile_01_mini.png" 
      alt="A screenshot showing the icons used for managing Wordalist Enhancements on a smaller screen">
    <div style="text-align: justify;">On a smaller screen, the functionality added by <b>Wordalist Enhancements</b> is accessible via the purple icons.</div>
  </a>
  <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/desktop_mobile_02.png">
    <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/desktop_mobile_02_mini.png" 
      alt="A screenshot showing the icons being minimized after the user has scrolled down on a page">
    <div style="text-align: justify;">When scrolling down, the icons are minimized to not be in the way of the user's experience on Wordalist.</div>
  </a>
</div>

## Install

### Prerequisites

#### Tampermonkey

Tampermonkey is the recommended _userscript manager_([?](https://en.wikipedia.org/wiki/Userscript_manager)) for
the **Wordalist Enhancements** userscript.

- [Tampermonkey for Chrome][chrome-tampermonkey-link]
- [Tampermonkey for Firefox][firefox-tampermonkey-link]
- [Tampermonkey for Edge][edge-tampermonkey-link]

[chrome-tampermonkey-link]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo

[firefox-tampermonkey-link]: https://addons.mozilla.org/firefox/addon/tampermonkey

[edge-tampermonkey-link]: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd

### Userscript

- [Install from Greasyfork][install-greasyfork-url]
- [Install from GitHub][firefox-tampermonkey-link]

[install-greasyfork-url]: https://greasyfork.org/en/scripts/471259-wle-wordalist-enhancements

[install-github-url]: https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/packages/userscript/dist/chatgpt.user.js

## Configuration

1. Click the **WLE Settings** in the bottom menu.

   <div style="display: flex; flex-wrap: wrap; gap: 20px;">
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/usage_configure_01.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/usage_configure_01_mini.png" 
         alt="A screenshot showing the WLE Settings menu item added to the ordinary Wordalist menu">
       <div style="text-align: justify;">The <b>WLE Settings</b> menu item is added to the bottom menu,</div>
     </a>
   </div>
2. Activate the desired functionality.

   <div style="display: flex; flex-wrap: wrap; gap: 20px;">
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/usage_configure_02.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/usage_configure_02_mini.png" 
         alt="A screenshot showing the functionalities that may be activated in the WLE Settings menu.">
       <div style="text-align: justify;">In the <b>WLE Settings</b> menu it is possible to activate various functionalities.</div>
     </a>
   </div>

### Configure Firebase synchronization

At the time it is only possible to synchronize using Firebase.

1. Create a new project* or go to an already existing one: https://console.firebase.google.com/
   > *Giving it a general name like "All my userscript needs", it may be reused for other projects. If creating a new
   > one solely for **Wordalist Enhancements** there's no need to enable statistics at the second step.
2. Create a new Realtime Database, select an appropriate Realtime Database location that is close to your location and
   choose "Start in test mode".

   <div style="display: flex; flex-wrap: wrap; gap: 20px;">
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_01.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_01_mini.png" 
         alt="A screenshot showing the 'Realtime Database' menu item in the main menu on Firebase">
       <div style="text-align: justify;">Firebase realtime database is accessible via the main menu when in a project.</div>
     </a>
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_02.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_02_mini.png" 
         alt="A screenshot showing the button to create a realtime database for a Firebase project.">
       <div style="text-align: justify;">When no realtime database has been created, there is a button to create one.</div>
     </a>
   </div>

3. Go to the rules for the Realtime Database, modify the rules so that writing and reading is enabled.
   Publish the changes.

   <div style="display: flex; flex-wrap: wrap; gap: 20px;">
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_03.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_03_mini.png" 
         alt="A screenshot showing where the database rules are and the settings that are necessary for Wordalist Enhancements sync">
       <div style="text-align: justify;">Both read and write rules for the realtime database must be set to "true" for Wordalist Enhancements synchronization to work.</div>
     </a>
   </div>

   > The warning message that says "Your security rules are defined as public, so anyone can steal, modify, or
   > delete data in your database" is correct if you on the next step share your configuration with anyone else.
   > If you only keep your configuration to yourself, it will only be able to be modified by you.
4. Create a new Web App*, select **npm** and click the "Continue to console" button.

   <div style="display: flex; flex-wrap: wrap; gap: 20px;">
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_04.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_04_mini.png" 
         alt="A screenshot showing which icon is used to create a new Firebase web app.">
       <div style="text-align: justify;">On the project home page it is possible to create a new web app by clicking the leftmost white icon.</div>
     </a>
   </div>

   > *Maybe name it "Wordalist Enhancements". There's no need to enable Firebase Hosting.
5. Go to the settings of your newly created app, scroll down and select the "Config" option for
   "SDK setup and configuration". Then copy the whole config.

   <div style="display: flex; flex-wrap: wrap; gap: 20px;">
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_05.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_05_mini.png" 
         alt="A screenshot showing how to open the menu for Firebase apps.">
       <div style="text-align: justify;">App management is available via the "1 app" button on the project page.</div>
     </a>
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_06.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_06_mini.png" 
         alt="A screenshot showing where the settings button for a Firebase app is.">
       <div style="text-align: justify;">Next to a Firebase app is the button for the application's settings.</div>
     </a>
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_07.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_setup_07_mini.png" 
         alt="A screenshot showing the Firebase configuration available via the Firebase app settings.">
       <div style="text-align: justify;">The Firebase configuration is available in the app settings under the "Config" option. It may be copied with the click of a button.</div>
     </a>
   </div>

6. Go to Wordalist and open the **WLE Settings**. Activate Firebase synchronization and paste the copied contents in
   the text box for the Firebase configuration. Click "Save", if successful, a notification will say that the
   settings were saved. If the configuration is not copied correctly or if the permissions mentioned in step 4 are not
   correct, an error message will be displayed.

   <div style="display: flex; flex-wrap: wrap; gap: 20px;">
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_sync_01.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_sync_01_mini.png" 
         alt="A screenshot showing the WLE Sync menu when no values have been synchronized.">
       <div style="text-align: justify;">Information that is not synchronized will show up in red text in the <b>WLE Sync</b> menu. Clicking the green upload button next to a local value sends the value to Firebase, and clicking the blue button downloads a value from Firebase.</div>
     </a>
     <a style="width: 300px" href="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_sync_02.png">
       <img src="https://github.com/martenb-se/wordalist-enhancements/blob/e750b7983ee9b7c1a6a13a73a63c5213a43a9a8b/resources/images/firebase_sync_02_mini.png" 
         alt="A screenshot showing the WLE Sync menu when the selected language has been synchronized with Firebase.">
       <div style="text-align: justify;">When a value is uploaded to Firebase it shows up in the menu and the buttons have now been inactivated as there is no value to synchronize.</div>
     </a>
   </div>

*Note: This is not an optimal method of synchronizing a single user's data. But it is free, real-time and simple to
set up. Instead of using one database for all users of **Wordalist Enhancements** where it would require the user to
register with my application to use the extension, where I can see all data that is saved by all users, this solution
will let the users of **Wordalist Enhancements** stay in charge of their own data.*

## Development

### Notes

During development much inspiration has been taken from
[chatgpt-exporter (https://github.com/pionxzh/chatgpt-exporter/)](https://github.com/pionxzh/chatgpt-exporter/),
and the following has been imported from that project:

- `packages/userscript/src/imported/pionxzh/util/storage.ts`
  ([link to imported local file](https://github.com/martenb-se/wordalist-enhancements/blob/main/packages/userscript/src/imported/pionxzh/util/storage.ts),
  [link to original remote file](https://github.com/pionxzh/chatgpt-exporter/blob/f6be988a4a1fbb13992f1b9ab5dc8626206afe06/packages/userscript/src/utils/storage.ts)).
  > Contains the ScriptStorage utility class. This class provides a unified interface to interact with different
  > storage options, such as Greasemonkey storage (GMStorage), Web Storage (LocalStorage), and MemoryStorage. It
  > supports fallback behavior, attempting to use Greasemonkey storage first, then falling back to Web Storage if
  > available, and finally using MemoryStorage as the last fallback option.

### Setup

#### Prerequisites

##### NVM

[NVM](https://github.com/nvm-sh/nvm#about) makes it easy to manage Node.
Installation is simple when using their script:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

##### Node

At least version 18 as it was used in development.
Installation of Node v18.17.0 using NVM:

```bash
nvm install v18.17.0
```

##### PNPM

[PNPM](https://pnpm.io/) is used for package management.
Install PNPM:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### Project setup

1. Clone the repo
   ```bash
   git clone git@github.com:martenb-se/wordalist-enhancements.git
   ```
2. Install the project
   ```bash
   pnpm install
   ```
3. Start the development server
   ```bash
   pnpm dev
   ```
4. Click "Install" on the popup to install the development userscript that is updated whenever changes are made.

### Suggested improvements

- Custom selections sorting on small screens
  > Touch and drag does not work well when there's a scroll bar involved.
  > It could be solved by having buttons for sorting up and down.
- Export individual custom selections
  > Right now it's only possible to export all selections at once.
- Generalize parts of subcomponents for CustomSelectionsStorageDialogue
  > Subcomponents include similar logic and should be generalized.
- Use reducer for various states in main
  > Too many useState, it is perhaps better to use reducers instead.
- Translate Wordalist
  > This addon could be used to allow for translations of the original Wordalist pages.
