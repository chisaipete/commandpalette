<template>
    <v-card>
        <v-card-title contenteditable="">Group
<!--            <v-btn icon v-on:click="removeGroup">-->
<!--                <v-icon>mdi-close-box</v-icon>-->
<!--            </v-btn>-->
        </v-card-title>
        <v-container>
                <ClickCommand v-for="index in count" :key="index"/>
                <v-divider></v-divider>
                <v-btn icon v-on:click="addCommand">
                    <v-icon>mdi-plus-box</v-icon>
                </v-btn>
        </v-container>
    </v-card>
</template>

<script>
import ClickCommand from "@/components/ClickCommand"

export default {
    name: 'CommandGroup',
    components: {ClickCommand},
    data: function() {
        return {
            count: 1
        };
    },
    methods: {
        addCommand() {
            this.count += 1;
        }
    }
}
</script>

<style>
</style>