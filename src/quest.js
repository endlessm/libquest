/* exported Quest */

const {Story} = imports.ink;
const {GObject} = imports.gi;

var Quest = GObject.registerClass(class Quest extends GObject.Object {
    _init(props) {
        super._init(props);
    }

    setup(storyContent) {
        this.story = new Story(storyContent);
    }

    getDialogue() {
        const text = this.story.currentText;

        if (text.trim()) {
            return {
                text: text.trim(),
                tags: this.story.currentTags || [],
            };
        }
        return null;
    }

    continueStory() {
        let dialogue = [];

        while (this.story.canContinue) {
            this.story.Continue();
            const d = this.getDialogue();

            if (d)
                dialogue = [...dialogue, d];
        }

        let choices = [];

        this.story.currentChoices.forEach(c => {
            choices = [...choices, c];
        });
        return {dialogue, choices};
    }

    choose(choiceIndex) {
        this.story.ChooseChoiceIndex(choiceIndex);
    }

    get hasEnded() {
        return !this.story.canContinue && !this.story.currentChoices.length;
    }

    get globalTags() {
        return this.story.globalTags || [];
    }

    restart() {
        this.story.ResetState();
    }

    updateStoryVariable(name, newValue) {
        let convertedValue = newValue;

        // Ink stores booleans as 0 (false) / 1 (true). So we convert
        // boolean to int:
        if (typeof newValue === 'boolean')
            convertedValue = newValue ? 1 : 0;

        if (this.story.variablesState[name] !== convertedValue)
            this.story.variablesState[name] = newValue;
    }

    getStoryVariable(name) {
        return this.story.variablesState[name];
    }
});

