class Assembler {
    static assemble(program, operationSet, success, error) {
        if (operationSet === undefined)
            operationSet = OperationSet.getDefaultSet();
        console.log(operationSet);

        let temporaryOutput = [];

        let lines = program.split("\n");
        let chain = [];
        let labels = [];

        let position = 0;

        for (let lineNumber in lines) {
            let line = lines[lineNumber];

            //Filter out comments
            if (line.indexOf(";") !== -1) {
                line = line.replace(line.substring(line.indexOf(";")), "");
            }

            if (line === "")
                continue;

            let chunks = line.split(" ");

            //Label
            if (AssemblerRegexes["label"].test(lines[lineNumber])) {
                labels.push(new Label(lines[lineNumber].substring(0, lines[lineNumber].indexOf(":")), position));
                continue;
            }

            //Operation
            let argumentList = [];
            for (let i = 1; i < chunks.length; i++) {
                console.log(chunks[i]);
                if (AssemblerRegexes["number"].test(chunks[i])) {
                    argumentList.push(new Argument("number", parseInt(chunks[i].substr(2), 16)));
                }
                else if (AssemblerRegexes["address"].test(chunks[i])) {
                    argumentList.push(new Argument("address", parseInt(chunks[i].substr(1), 16)));
                } else if (AssemblerRegexes["labelArgument"].test(chunks[i])) {
                    argumentList.push(new Argument("label", chunks[i]));
                }
            }

            console.log(chunks[0], argumentList, AssemblerRegexes);

            let operation = operationSet.getOperation(chunks[0], argumentList);
            if (operation !== undefined) {
                operation.setArguments(argumentList);
                chain.push(operation);
                position++;
            } else {
                error("Unknown operation: " + chunks[0]);
            }
        }

        for (let i in chain) {
            let operation = chain[i];

            temporaryOutput.push(operation.id);

            for (let j in operation.argumentList) {
                let argument = operation.argumentList[j];

                switch(argument.type) {
                    case "number":
                        temporaryOutput.push(argument.data);
                        continue;
                    case "address":
                        let address = argument.data;
                        temporaryOutput.push(address >> 8);
                        temporaryOutput.push(address & 0xFF);
                        continue;
                    case "label":
                        let labelName = argument.data;
                        let found = false;
                        for (let k = 0; k < labels.length; k++) {
                            if (labels[k].name === labelName) {
                                temporaryOutput.push(labels[k].position >> 8);
                                temporaryOutput.push(labels[k].position & 0xFF);
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            error("Unknown label: " + labelName);
                        }
                        break;
                }
            }
        }

        console.log(temporaryOutput);

        success(new Uint8Array(temporaryOutput));
    }

    static assembleToProgram(program, settings, metadata, operationSet) {
        if (settings === undefined)
            settings = {};
        if (metadata === undefined)
            metadata = {};

        return new Program(this.assemble(program, operationSet), settings, metadata);
    }

    static disassemble(rom, operationSet) {
        if (operationSet === undefined)
            operationSet = OperationSet.getDefaultSet();
    }
}

const AssemblerRegexes = {
    "number": /#\$[0-9A-F]{2}/i,
    "address": /\$[0-9A-F]{4}/i,
    "label": /(\w|\d)+:/i,
    "labelArgument": /(\w|\d)+/i
};