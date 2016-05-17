import * as Bacon from "baconjs";
import {Dispatcher} from "./dispatcher.ts";

export namespace Filter {
    const d: Dispatcher = new Dispatcher();

    export function toProperty(initialFilter: string): Bacon.Property<string, string> {
        return d.stream("reset").scan(
            initialFilter, (_: string, newFilter: string) => {
                return newFilter;
            }
        );
    }

    export function reset(newFilter: string): void {
        window.location.hash = newFilter;
        d.push("reset", newFilter);
    }
}
