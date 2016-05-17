import * as React from "react";
import {Todos} from "./todos.ts";
import {TodoList} from "./todoList.tsx";
import {TodoFooter} from "./todoFooter.tsx";

export class TodoApp extends React.Component<any, { text: string }> {
    constructor() {
        super();
        this.state = { text: "" };
    }

    public render(): JSX.Element {
        return <div>
            <header id="header">
                <h1>todos</h1>
                <input
                    id="new-todo"
                    placeholder="What needs to be done?"
                    autoFocus={true}
                    value={this.state.text}
                    onChange={this.handleTextChange.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                    />
            </header>
            <TodoList items={this.props.items} />
            <TodoFooter items={this.props.items} filter={this.props.filter} />
        </div>;
    }

    public handleTextChange(e: any): void {
        this.setState({ text: e.target.value });
    }

    public handleKeyDown(e: any): void {
        if (e.which === 13 && this.state.text) {   // 13 == enter
            Todos.createItem(this.state.text);
            this.setState({ text: "" });
        }
    }
}