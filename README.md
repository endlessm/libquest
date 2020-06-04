# Libquest

A D-Bus service that can run Hack quests written in [Inkle's
Ink](https://www.inklestudios.com/ink/) scripting language.

## Coding Style

    eslint .

## Compile Ink file (temp)

    # Needs https://github.com/manuq/inklecate-flatpak
    com.inklestudios.inklecate data/quests/p5-quest.ink

## Build and install

    ./build-flatpak.sh

## Run in persistent mode

Is useful to keep the server alive for debugging purposes. For that,
you can pass the following environment variable:

    flatpak run --env=HACK_LIBQUEST_PERSIST=1 com.hack_computer.Libquest

## Testing from D-Bus

List available quests:

    gdbus call --session --dest com.hack_computer.Libquest \
    --object-path /com/hack_computer/Libquest \
    --method com.hack_computer.Libquest.listAvailableQuests

Load a quest:

    gdbus call --session --dest com.hack_computer.Libquest \
    --object-path /com/hack_computer/Libquest \
    --method com.hack_computer.Libquest.loadQuest 'p5-quest'

Continue the story, to get lines of dialogue and choices:

    gdbus call --session --dest com.hack_computer.Libquest \
    --object-path /com/hack_computer/Libquest/quest/p5_quest \
    --method com.hack_computer.Libquest.Quest.continueStory

Choose:

    gdbus call --session --dest com.hack_computer.Libquest \
    --object-path /com/hack_computer/Libquest/quest/p5_quest \
    --method com.hack_computer.Libquest.Quest.choose 0

Repeat. Check if the quest has ended:

    gdbus call --session --dest com.hack_computer.Libquest \
    --object-path /com/hack_computer/Libquest/quest/p5_quest \
    --method com.hack_computer.Libquest.Quest.hasEnded

## Building inkjs

Inkjs ships a standalone build, but is not suitable for importing it
directly from GJS. So we need to rebuild it with custom settings.

- Clone the repository from https://github.com/y-lohse/inkjs
- Setup the project: `yarn install`
- Edit `rollup.config.js` to:
  - Change format: `const format = 'es';`
  - Remove these plugins & settings: `uglify`, `terser`, `sourcemaps`
- Rebuild with: `yarn build`
- Copy `dist/ink.js` to this module.
