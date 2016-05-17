import * as React from "react";
import * as Bacon from "baconjs";
import * as R from "ramda";
import {Todos} from "./todos.ts";
import {Filter} from "./filter.ts";


export class TodoFooter extends React.Component<any, any> {
  public render(): JSX.Element {
    const itemsLeft: number = R.filter(R.compose(R.not, Todos.isCompleted), this.props.items).length;
    const currentFilter: string = this.props.filter;

    return <footer id="footer">
      <span id="todo-count">
        <strong>{itemsLeft}</strong> {itemsLeft === 1 ? "item" : "items"} left
      </span>
      <ul id="filters">
        {this.filterBtn(currentFilter, { id: "all", name: "All" }) }
        {" "}
        {this.filterBtn(currentFilter, { id: "active", name: "Active" }) }
        {" "}
        {this.filterBtn(currentFilter, { id: "completed", name: "Completed" }) }
      </ul>

      {this.props.items.length - itemsLeft > 0 ?
        <button
          id="clear-completed"
          onClick={Todos.removeCompleted}>
          Clear completed
        </button>
        : ""
      }
    </footer>;
  }

  public filterBtn(currentFilter: string, {name, id}: { name: string, id: string }): JSX.Element {
    return <li>
      <a className={currentFilter === id ? "selected" : ""}
        onClick={R.partial(Filter.reset, id) }>
        {name}
      </a>
    </li>;
  }
}