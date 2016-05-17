import * as Bacon from "baconjs";
import * as R from "ramda";
import {Dispatcher} from "./dispatcher.ts";

const d: Dispatcher = new Dispatcher();

export namespace Todos {
    "use strict";

    export interface ITodoItem {
        id: number;
        states: any[];
        title: string;
    }

    export function toItemsProperty(
        initialItems: ITodoItem[],
        filterS: Bacon.Property<string, string>): Bacon.Property<any, ITodoItem> {
        const itemsS: Bacon.Property<any, any> = Bacon.update(
            initialItems,
            [d.stream("remove")], removeItem,
            [d.stream("create")], createItem,
            [d.stream("addState")], addItemState,
            [d.stream("removeState")], removeItemState,
            [d.stream("removeCompleted")], removeCompleteItems,
            [d.stream("updateTitle")], updateItemTitle
        );

        function createItem(items: ITodoItem[], newItemTitle: string): ITodoItem[] {
            return items.concat([{ id: Date.now(), states: [], title: newItemTitle }]);
        }

        function removeItem(items: ITodoItem[], itemIdToRemove: number): ITodoItem[] {
            return R.reject((it: ITodoItem) => { return it.id === itemIdToRemove; }, items);
        }

        function removeCompleteItems(items: ITodoItem[]): ITodoItem[] {
            return R.reject(isItemCompleted, items);
        }

        function addItemState(items: ITodoItem[], {itemId, state}: any): any[] {
            return R.map(updateItem(itemId, (it: ITodoItem) => R.merge(it, { states: R.union(it.states, [state]) })), items)
        }

        function removeItemState(items: ITodoItem[], {itemId, state}: any): any[] {
            return R.map(updateItem(itemId, (it: ITodoItem) =>
                R.merge(it, { states: R.reject(R.eq(state), it.states) })), items);
        }

        function updateItemTitle(items: ITodoItem[], {itemId, title}: any): any[] {
            return R.map(updateItem(itemId, (it: ITodoItem) => R.merge(it, { title })), items);
        }

        function withDisplayStatus([items, filter]: any[]): ITodoItem {
            function setDisplay(it: ITodoItem): ITodoItem {
                const display: boolean = filter === "completed" ?
                    isItemCompleted(it) : filter === "active" ? !isItemCompleted(it) : true;
                return R.merge(it, { display });
            }
            return R.map(setDisplay, items);
        }
        return Bacon.combineAsArray([itemsS, filterS]).map(withDisplayStatus);
    }

    export const isCompleted: (item: ITodoItem) => boolean = isItemCompleted;

    export const isEdited: (item: ITodoItem) => boolean = isItemEdited;

    export function createItem(title: string): void {
        d.push("create", title);
    }

    export function removeItem(itemId: number): void {
        d.push("remove", itemId);
    }

    export function removeCompleted(): void {
        d.push("removeCompleted", undefined);
    }

    export function setTitle(itemId: number, title: string): void {
        d.push("updateTitle", { itemId, title });
    }

    export function setCompleted(itemId: number, completed: boolean): void {
        d.push(completed ? "addState" : "removeState", { itemId, state: "completed" })
    }

    export function setAllCompleted(completed: boolean): void {
        d.push(completed ? "addState" : "removeState", { itemId: "all", state: "completed" });
    }

    export function setEditing(itemId: number, editing: boolean): void {
        d.push(editing ? "addState" : "removeState", { itemId, state: "editing" });
    }

    function isItemCompleted(item: ITodoItem): boolean {
        return R.contains("completed", item.states);
    }

    function isItemEdited(item: ITodoItem): boolean {
        return R.contains("editing", item.states);
    }

    function updateItem(itemId: number | string, fn: (it: ITodoItem) => ITodoItem): any {
        return (it: ITodoItem) => itemId === "all" || it.id === itemId ? fn(it) : it;
    }

}

