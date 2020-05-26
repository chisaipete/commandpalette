<template>
    <v-row>
        <v-col class="px-0">
            <v-card-text contenteditable
             class="editme"
             v-text="command"
             @blur="onEdit"
             @keydown.enter="endEdit"></v-card-text>
        </v-col>
        <v-col class="px-0">
            <v-btn icon type="button"
                v-clipboard:copy="command"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError">
            <v-icon>mdi-clipboard-arrow-right</v-icon>
        </v-btn>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'ClickCommand',
        data: function() {
            return {
                command: '!r '
            }
        },
        methods: {
            onEdit: function(e) {
                var src = e.target.innerText;
                this.command = src;
            },
            endEdit: function() {
                this.$el.querySelector('.editme').blur()
            },
            onCopy: function(e) {
                this.$toasted.success('Copied: ' + e.text);
            },
            onError: function(e) {
                this.$toasted.error('Failed to copy Command! ' + e.text);
            }
        }
    }
</script>

<style>
</style>