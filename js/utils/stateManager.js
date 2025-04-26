class State {
  constructor(stateName) {
    this.name = stateName;
  }

  async activate() {}
  async deactivate() {}
}

class StateManager {
  constructor() {
    this.currentState = null;
    this.AllStates = [new State("dogs")];
  }

  setNewState(name = "", activateMethod, deactivateMethod) {
    const newState = new State(name);
    newState.activate = activateMethod;
    newState.deactivate = deactivateMethod;
    this.AllStates.push(newState);
  }

  async switchState(name) {
    const nextState = this.__findState(name);
    if (!nextState) throw new Error(`state "${name}" not found.`);

    const currentState = this.__findState(this.currentState);
    if (currentState) {
      console.log({ nextState: nextState.name, currentState: currentState.name });
      await currentState.deactivate();
    }

    await nextState.activate();
    this.currentState = nextState.name;
  }

  __findState(name) {
    const state = this.AllStates.find((s) => s.name === name);
    return state;
  }
}

export default StateManager;
