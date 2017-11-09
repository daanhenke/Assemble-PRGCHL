class Program {
    constructor(rom, settings, metadata) {
        this.rom = rom;
        this.settings = settings;
        this.metadata = metadata;
    }

    static fromByteArray(array) {
        //TODO: REMOVE THIS THIS IS SUPER TEMPORARY
        return new Program(array, {}, {});
    }

    toByteArray() {
        //TODO: REMOVE THIS THIS IS SUPER TEMPORARY
        return this.rom;
    }

    static fromBase64(string) {
        let characters = atob(string);
        let temporaryArray = [];

        for (let i in characters) {
            temporaryArray.push(characters.charCodeAt(i));
        }

        return Program.fromByteArray(new Uint8Array(temporaryArray));
    }

    toBase64() {
        let byteArray = this.toByteArray();
        let temporaryString = "";

        for(let i in byteArray) {
            temporaryString += String.fromCharCode(byteArray[i]);
        }

        return btoa(temporaryString)
    }
}