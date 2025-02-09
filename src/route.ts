/**
 * Eventline
 * Copyright James Campbell 2017
 */

import { executeAction } from './execute-action'
import { matches } from './matchers'

/**
 * This class represents a route for which
 * an event can be routed to.
 * 
 * A route defines a step of actions to perform as well as
 * what kind of events those actions should be performed for.
 * 
 * @export
 * @class Route
 */
export class Route {

    /**
     * The pattern used to filter out the events
     * used to trigger this route.
     * 
     * @type {*}
     * @memberof Route
     */
    public pattern: any

    // /**
    //  * This subject is used internally to trigger
    //  * the execution of the actions when a relevante
    //  * event is recieved.
    //  * 
    //  * @type {Rx.Subject<any>}
    //  * @memberof Route
    //  */
    // private subject: Rx.Subject<any> = new Rx.Subject<any>()

    /**
     * Tbe internal array of actions to perform for this
     * route.
     * 
     * @private
     * @type {Array<any>}
     * @memberof Route
     */
    private actions: Array<any> = []

    /**
     * Creates an instance of Route.
     * 
     * @param {*} pattern 
     * @memberof Route
     */
    constructor(pattern: any) {
        this.pattern = pattern
    }

    /**
     * Registers an action to be performed for this route.
     * 
     * This method returns an instance of the route so that
     * more actions can be declared via chaining.
     * 
     * Each action will be performed in the order that it is
     * declared.
     * 
     * @param {(any) => any} action 
     * @returns 
     * @memberof Route
     */
    then(action: (event: any) => any) {
        this.actions.push(action)
    }

    /**
     * This method determines if the pattern for
     * the route matches a given event using the
     * built-in matchers.
     * 
     * @param {any} event 
     * @returns 
     * @memberof Route
     */
    matches(event) {
        var matchingFunctor = matches(this.pattern)
        return matchingFunctor(event)
    }

    /**
     * This method triggers the actions for this route
     * to be executed by passing them the event one by one.
     * 
     * @param {any} event
     * @returns Promise 
     * @memberof Route
     */
    handle(event) {
        return this.actions.reduce((promise, action, index, actions) => {
            return promise.then(currentEvent => {
                return executeAction(action, currentEvent)
            })
        }, Promise.resolve(event))
    }
}
