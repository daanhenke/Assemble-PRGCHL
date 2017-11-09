class Operation {
    constructor(id, abbreviation, description, argumentList) {
        this.id = id;
        this.abbreviation = abbreviation;
        this.description = description;

        if (argumentList === undefined)
            argumentList = [];
        this.argumentList = argumentList;
    }

    setArguments(argumentList) {
        this.argumentList = argumentList;
    }
}