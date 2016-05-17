import * as React from "react";
import * as ReactDOM from "react-dom";
import {Todos} from "./todos.ts";

export class TodoItem extends React.Component<any, any> {
    public render(): JSX.Element {
        const item: any = this.props.item;

        return <li className={item.states.join(" ") }>
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    onChange={(e: any) => Todos.setCompleted(item.id, e.target.checked) }
                    checked={Todos.isCompleted(item) }
                    />
                <label onDoubleClick={this.startEditing}>
                    {item.title}
                </label>
                <button className="destroy" onClick={() => Todos.removeItem(item.id) }/>
            </div>
            <input
                ref="editField"
                className="edit"
                value={item.title}
                onBlur={this.stopEditing}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                />
        </li>;
    }

    public startEditing(): void {
        const node: any = ReactDOM.findDOMNode(this.refs["editField"]);
        const item: any = this.props.item;

        Todos.setEditing(item.id, true);
        node.focus();
        node.setSelectionRange(0, node.value.length);
    }

    public stopEditing(): void {
        const item: any = this.props.item;
        if (item.title) {
            Todos.setEditing(item.id, false);
        } else {
            Todos.removeItem(item.id);
        }
    }

    public handleKeyDown(e: KeyboardEvent): void {
        if (e.which === 13) {
            this.stopEditing();
        }
    }

    public handleChange(e: IHTMLElementEvent<HTMLInputElement>): void {
        Todos.setTitle(this.props.item.id, e.target.value);
    }
}

interface IHTMLElementEvent<T extends HTMLElement> extends Event {
    target: T;
}
