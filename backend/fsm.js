/**
 * ///////////////////////////////////////
 * //////// Finite state machine /////////
 * ///////////////////////////////////////
 * @refer https://github.com/HQarroum/Fsm
 * @refer https://github.com/jakesgordon/javascript-state-machine
 * This module exposes the interface of
 * the finite state machine.
 */

 /**
 * Exporting the `Fsm` module appropriately given
 * the environment (AMD, Node.js and the browser).
 */
 (function(name, definition){
   if(typeof define === 'functon' && deine.amd){
     // Defining the module in an AMD fashion.
	    define(definition);
   } else if(module !== 'undefined' && module.exports){
     // Exporting the module for Node.js/io.js.
     module.exports = definition();
   } else { //browser|webworker
     var instance = definition();
     var global = this;
     var old = global[name];

     instance.noConflict = function(){
       global[name] = old;
       return instance;
     }

     // Exporting the module in the global
	   // namespace in a browser context.
     global[name] = instance;
   }
 })('Fsm', function(){
   /**
    * The state machine constructor.
    */
   var Fsm = function(){
     this.currentState = undefined;
   }

   /**
     * Transitions the state machine to the
     * given state.
     */
    Fsm.prototype.transitionTo = function(state){
      if(!state){
        throw new Error("Expect a valid state!")
      }

      if(this.currentState !== state){
        if(this.currentState && this.currentState.onExit){
          this.currentState.onExit();
        }
        this.currentState = state;
        if(this.currentState.onEntry){
          this.currentState.onEntry();
        }
      }
    }

    /**
     * Posts an event into the current state.
     */
    Fsm.prototype.postEvent = function(event){
      if(this.currentState && this.currentState.onEvent){
        this.currentState.onEvent(event);
      }
    }

    /**
     * Returns the current state.
     */
    Fsm.prototype.state = function () {
	    return this.currentState;
    }

    /**
     * Starts the state machine in the
     * given state.
     */
    Fsm.prototype.start = function (state) {
      if(!state){
        throw new Error("Expect a valid state!")
      }

      if(!this.currentState){
        this.transitionTo(state);
      } else {
        throw new Error('Fsm already started');
      }
    }

    /**
     * Definition of a state.
     */
     Fsm.State = function(options){
       if(!(options && options.fsm)){
         throw new Error('Unexpect arguments');
       }
       this.fsm   = options.fsm;
       this.name_  = options.name;
       this.onEntry = optins.onEntry;
       this.onEvent = options.onEvent;
       this.onExit  = options.onExit;
     }

     /**
     * Transitions the associated Fsm
     * to the given state.
     */
     Fsm.State.prototype.transitionTo = function(state){
       this.fsm.transitionTo(state);
     }

     /**
     * Returns the Fsm name.
     */
    Fsm.State.prototype.name = function () {
	     return this.name_;
    }

    return Fsm;
 });
