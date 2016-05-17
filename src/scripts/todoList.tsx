import * as React from "react";
import * as R from "ramda";
import {Todos} from "./todos.ts";
import {TodoItem} from "./todoItem.tsx";

export class TodoList extends React.Component<any, any> {
    public render(): JSX.Element {
        const allCompleted: boolean = R.all(Todos.isCompleted, this.props.items);

        return <section id="main">
            <input
                id="toggle-all"
                type="checkbox"
                checked={allCompleted}
                onChange={(e: any) => Todos.setAllCompleted(e.target.checked) }
                />
            <ul id="todo-list">
                {R.map((it: any) => it.display ? <TodoItem key={it.id} item={it} /> : "", this.props.items) }
            </ul>
        </section>;
    }
}