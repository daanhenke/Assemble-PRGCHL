"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Argument = function Argument(type, data) {
    _classCallCheck(this, Argument);

    this.type = type;
    this.data = data;
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assembler = function () {
    function Assembler() {
        _classCallCheck(this, Assembler);
    }

    _createClass(Assembler, null, [{
        key: "assemble",
        value: function assemble(program, operationSet, success, error) {
            if (operationSet === undefined) operationSet = OperationSet.getDefaultSet();
            console.log(operationSet);

            var temporaryOutput = [];

            var lines = program.split("\n");
            var chain = [];
            var labels = [];

            var position = 0;

            for (var lineNumber in lines) {
                var line = lines[lineNumber];

                //Filter out comments
                if (line.indexOf(";") !== -1) {
                    line = line.replace(line.substring(line.indexOf(";")), "");
                }

                if (line === "") continue;

                var chunks = line.split(" ");

                //Label
                if (AssemblerRegexes["label"].test(lines[lineNumber])) {
                    labels.push(new Label(lines[lineNumber].substring(0, lines[lineNumber].indexOf(":")), position));
                    continue;
                }

                //Operation
                var argumentList = [];
                for (var i = 1; i < chunks.length; i++) {
                    console.log(chunks[i]);
                    if (AssemblerRegexes["number"].test(chunks[i])) {
                        argumentList.push(new Argument("number", parseInt(chunks[i].substr(2), 16)));
                    } else if (AssemblerRegexes["address"].test(chunks[i])) {
                        argumentList.push(new Argument("address", parseInt(chunks[i].substr(1), 16)));
                    } else if (AssemblerRegexes["labelArgument"].test(chunks[i])) {
                        argumentList.push(new Argument("label", chunks[i]));
                    }
                }

                console.log(chunks[0], argumentList, AssemblerRegexes);

                var operation = operationSet.getOperation(chunks[0], argumentList);
                if (operation !== undefined) {
                    operation.setArguments(argumentList);
                    chain.push(operation);
                    position++;
                } else {
                    error("Unknown operation: " + chunks[0]);
                }
            }

            for (var _i in chain) {
                var _operation = chain[_i];

                temporaryOutput.push(_operation.id);

                for (var j in _operation.argumentList) {
                    var argument = _operation.argumentList[j];

                    switch (argument.type) {
                        case "number":
                            temporaryOutput.push(argument.data);
                            continue;
                        case "address":
                            var address = argument.data;
                            temporaryOutput.push(address >> 8);
                            temporaryOutput.push(address & 0xFF);
                            continue;
                        case "label":
                            var labelName = argument.data;
                            var found = false;
                            for (var k = 0; k < labels.length; k++) {
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
    }, {
        key: "assembleToProgram",
        value: function assembleToProgram(program, settings, metadata, operationSet) {
            if (settings === undefined) settings = {};
            if (metadata === undefined) metadata = {};

            return new Program(this.assemble(program, operationSet), settings, metadata);
        }
    }, {
        key: "disassemble",
        value: function disassemble(rom, operationSet) {
            if (operationSet === undefined) operationSet = OperationSet.getDefaultSet();
        }
    }]);

    return Assembler;
}();

var AssemblerRegexes = {
    "number": /#\$[0-9A-F]{2}/i,
    "address": /\$[0-9A-F]{4}/i,
    "label": /(\w|\d)+:/i,
    "labelArgument": /(\w|\d)+/i
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Environment = function Environment() {
    _classCallCheck(this, Environment);
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Interpreter = function Interpreter() {
    _classCallCheck(this, Interpreter);
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Label = function Label(name, position) {
    _classCallCheck(this, Label);

    this.name = name;
    this.position = position;
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Operation = function () {
    function Operation(id, abbreviation, description, argumentList) {
        _classCallCheck(this, Operation);

        this.id = id;
        this.abbreviation = abbreviation;
        this.description = description;

        if (argumentList === undefined) argumentList = [];
        this.argumentList = argumentList;
    }

    _createClass(Operation, [{
        key: "setArguments",
        value: function setArguments(argumentList) {
            this.argumentList = argumentList;
        }
    }]);

    return Operation;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OperationSet = function () {
    function OperationSet() {
        _classCallCheck(this, OperationSet);

        this.set = [];
    }

    _createClass(OperationSet, [{
        key: "addOperation",
        value: function addOperation(operation) {
            this.set[operation.id] = operation;
        }
    }, {
        key: "getOperation",
        value: function getOperation(abbreviation, argumentList) {
            for (var i in this.set) {
                if (this.set[i].abbreviation === abbreviation) {
                    var match = true;
                    for (var j = 0; j < argumentList.length; j++) {
                        if (this.set[i].argumentList[j] !== argumentList[j].type) match = false;
                    }
                    if (match) return this.set[i];
                }
            }
        }
    }], [{
        key: "getDefaultSet",
        value: function getDefaultSet() {
            var set = new OperationSet();
            set.addOperation(new Operation(0x00, "NOP", "No Operation"));
            set.addOperation(new Operation(0x10, "LDA", "Load value directly to accumulator", ["number"]));
            set.addOperation(new Operation(0x11, "LDA", "Load from RAM to accumulator", ["address"]));
            set.addOperation(new Operation(0x20, "JMP", "Jumps to given address", ["address"]));
            set.addOperation(new Operation(0x20, "JMP", "Jumps to given label", ["label"]));
            set.addOperation(new Operation(0xFF, "HLT", "Halts execution"));

            return set;
        }
    }]);

    return OperationSet;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Program = function () {
    function Program(rom, settings, metadata) {
        _classCallCheck(this, Program);

        this.rom = rom;
        this.settings = settings;
        this.metadata = metadata;
    }

    _createClass(Program, [{
        key: "toByteArray",
        value: function toByteArray() {
            //TODO: REMOVE THIS THIS IS SUPER TEMPORARY
            return this.rom;
        }
    }, {
        key: "toBase64",
        value: function toBase64() {
            var byteArray = this.toByteArray();
            var temporaryString = "";

            for (var i in byteArray) {
                temporaryString += String.fromCharCode(byteArray[i]);
            }

            return btoa(temporaryString);
        }
    }], [{
        key: "fromByteArray",
        value: function fromByteArray(array) {
            //TODO: REMOVE THIS THIS IS SUPER TEMPORARY
            return new Program(array, {}, {});
        }
    }, {
        key: "fromBase64",
        value: function fromBase64(string) {
            var characters = atob(string);
            var temporaryArray = [];

            for (var i in characters) {
                temporaryArray.push(characters.charCodeAt(i));
            }

            return Program.fromByteArray(new Uint8Array(temporaryArray));
        }
    }]);

    return Program;
}();
"use strict";

function arrayCompare(a, b) {
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

//# sourceMappingURL=prgchl.js.map