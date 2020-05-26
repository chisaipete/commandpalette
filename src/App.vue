<template>
    <div id="app">
        <v-app>
            <v-app-bar app dense>
                <v-toolbar-title>Command Palette</v-toolbar-title>
                <v-btn icon href="https://github.com/chisaipete/commandpalette" target="_blank">
                    <v-icon>mdi-github-circle</v-icon>
                </v-btn>
                <v-btn icon href="https://twitter.com/chisaipete" target="_blank">
                    <v-icon>mdi-twitter</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-file-input small-chips dense prepend-icon="" accept=".json" id="loadFile"></v-file-input>
                <v-btn icon v-on:click="loadCommands">
                    <v-icon>mdi-open-in-app</v-icon>
                </v-btn>
                <v-btn icon v-on:click="saveCommands">
                    <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-btn icon v-on:click="clearCommands">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon v-on:click="addCommandGroup">
                    <v-icon>mdi-plus-box-multiple</v-icon>
                </v-btn>
            </v-app-bar>
            <v-content>
                <v-container fluid grid-list-md>
                    <v-layout row wrap>
                        <v-flex xs12 sm6 md4 lg3 xl2 v-for="(commandGroup, gIndex) in groups" :key="gIndex">
                            <v-card elevation="6">
                                <v-card-title contenteditable class="groupEdit justify-center" v-text="commandGroup.name" v-on:blur="onEditGroup($event, gIndex)" v-on:keydown.enter="endEditGroup"></v-card-title>
<!--                                <v-row class="" v-for="(command, cIndex) in commandGroup.commands" :key="cIndex">-->
<!--                                        <v-col>-->
<!--                                            <div contenteditable class="commandEdit ml-3 align-center" v-text="command.text" v-on:blur="onEditCommand($event, gIndex, cIndex)" v-on:keydown.enter="endEditCommand"></div>-->
<!--                                        </v-col>-->
<!--                                        <div class="px-3">-->
<!--                                            <v-btn icon v-clipboard:copy="command.text" v-clipboard:success="onCopy" v-clipboard:error="onError">-->
<!--                                                <v-icon>mdi-clipboard-arrow-right</v-icon>-->
<!--                                            </v-btn>-->
<!--                                            <v-btn icon v-on:click="removeCommand(gIndex, cIndex)">-->
<!--                                                <v-icon>mdi-delete</v-icon>-->
<!--                                            </v-btn>-->
<!--                                        </div>-->
<!--                                </v-row>-->
                                <table dense style="width: 100%">
                                    <tr v-for="(command, cIndex) in commandGroup.commands" :key="cIndex">
                                        <td>
                                            <div contenteditable class="commandEdit ml-3 align-center" v-text="command.text" v-on:blur="onEditCommand($event, gIndex, cIndex)" v-on:keydown.enter="endEditCommand"></div>
                                        </td>
                                        <td>
                                            <v-btn icon v-clipboard:copy="command.text" v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                <v-icon>mdi-clipboard-arrow-right</v-icon>
                                            </v-btn>
                                        </td>
                                        <td>
                                            <v-btn icon v-on:click="removeCommand(gIndex, cIndex)">
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </td>
                                    </tr>
                                </table>
                                <v-card-actions class="justify-center">
                                    <v-btn icon v-on:click="shiftCommandGroup(gIndex, true)">
                                        <v-icon>mdi-arrow-left-bold-circle-outline</v-icon>
                                    </v-btn>
                                    <v-btn icon v-on:click="removeCommandGroup(gIndex)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                    <v-btn icon v-on:click="addCommand(gIndex)">
                                        <v-icon>mdi-plus-box</v-icon>
                                    </v-btn>
                                    <v-btn icon v-on:click="shiftCommandGroup(gIndex, false)">
                                        <v-icon>mdi-arrow-right-bold-circle-outline</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>

<script>

export default {
    name: 'App',
    components: {},
    data: function() {
        return {
            groups: [],
        };
    },
    methods: {
        addCommandGroup() {
            this.groups.push({ name: 'Group', commands: [], x:0, y:0, w:2, h:3, minW:2, minH:2});
        },
        removeCommandGroup(gIndex) {
            //TODO: add confirmation
            this.groups.splice(gIndex, 1);
        },
        shiftCommandGroup(gIndex, shiftBackward) {
            if (gIndex === this.groups.length - 1) {
                // wrap back to front
                this.groups.unshift(this.groups.pop());
            } else if (shiftBackward && gIndex === 0) {
                // wrap front to back
                this.groups.push(this.groups.shift());
            } else {
                // standard neighbor swap
                if (shiftBackward) {
                    this.groups.splice(gIndex - 1, 2, this.groups[gIndex], this.groups[gIndex - 1]);
                } else {
                    this.groups.splice(gIndex, 2, this.groups[gIndex + 1], this.groups[gIndex]);
                }
            }
            this.$forceUpdate();
        },
        addCommand(gIndex) {
            this.groups[gIndex].commands.push({text: '!r'});
        },
        onEditGroup: function(event, gIndex) {
            this.groups[gIndex].name = event.target.innerText;
        },
        endEditGroup: function() {
            this.$el.querySelector('.groupEdit').blur();
        },
        onEditCommand: function(event, gIndex, cIndex) {
            this.groups[gIndex].commands[cIndex].text = event.target.innerText;
        },
        endEditCommand: function() {
            this.$el.querySelector('.commandEdit').blur();
        },
        removeCommand: function(gIndex, cIndex) {
            this.groups[gIndex].commands.splice(cIndex, 1);
        },
        onCopy: function(event) {
            this.$toast.success('Copied: ' + event.text);
        },
        onError: function(event) {
            this.$toast.error('Failed to copy Command! ' + event.text, {icon:'mdi-alert-circle'});

        },
        loadCommands() {
            // https://stackoverflow.com/questions/59155812/vue-upload-local-json-file
            const files = document.getElementById('loadFile').files;
            if (files.length <= 0) { return false; }
            const fileReader = new FileReader();
            fileReader.onload = event => {
                this.groups = JSON.parse(event.target.result);
            }
            fileReader.readAsText(files.item(0));
            this.$toast.info('Loading commands from: ' + files.item(0).name);
        },
        saveCommands() {
            // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
            const dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.groups));
            let downloadAnchorElement = document.getElementById('downloadAnchorElement');
            downloadAnchorElement.setAttribute('href', dataString);
            downloadAnchorElement.setAttribute('download', 'commands.json');
            downloadAnchorElement.click()
            this.$toast.info('Downloading command file.');
        },
        clearCommands() {
            //TODO: add confirmation
            this.groups = [];
        }
    }
}
</script>

<style>
</style>
