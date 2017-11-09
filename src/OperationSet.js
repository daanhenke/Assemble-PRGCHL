class OperationSet {
    constructor() {
        this.set = [];
    }

    addOperation(operation) {
        this.set[operation.id] = operation;
    }

    getOperation(abbreviation, argumentList) {
        for (let i in this.set) {
            if (this.set[i].abbreviation === abbreviation) {
                let match = true;
                for (let j = 0; j < argumentList.length; j++) {
                    if (this.set[i].argumentList[j] !== argumentList[j].type)
                        match = false;
                }
                if (match)
                    return this.set[i];
            }
        }
    }

    static getDefaultSet() {
        let set = new OperationSet();
        set.addOperation(new Operation(0x00, "NOP", "No Operation"));
        set.addOperation(new Operation(0x10, "LDA", "Load value directly to accumulator", ["number"]));
        set.addOperation(new Operation(0x11, "LDA", "Load from RAM to accumulator", ["address"]));
        set.addOperation(new Operation(0x20, "JMP", "Jumps to given address", ["address"]));
        set.addOperation(new Operation(0x20, "JMP", "Jumps to given label", ["label"]));
        set.addOperation(new Operation(0xFF, "HLT", "Halts execution"));

        return set;
    }
}