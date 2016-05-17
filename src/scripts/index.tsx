import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Bacon from "baconjs";
import {Todos} from "./todos.ts";
import {Filter} from "./filter.ts";
import {TodoApp} from "./todoApp.tsx";

const filterP: Bacon.Property<string, string> = Filter.toProperty(window.location.hash.substring(1) || "all");
const itemsP: Bacon.Property<any, Todos.ITodoItem> = Todos.toItemsProperty([], filterP);

const appState: Bacon.Property<any, any> = Bacon.combineTemplate({
    filter: filterP,
    items: itemsP,
});

appState.onValue((state: {}) =>
    ReactDOM.render(
        // distディレクトリに、data.jsonを配置。
        <TodoApp {...state} />, document.getElementById("todoapp")
    )
);
