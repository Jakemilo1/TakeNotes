const util = require("util");
const fs = require("fs");
const { v1: uuidv1 } = require("uuid");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    read() {
        return readFileAsync("db/db.json", "utf8");
    }

    write(note) {
        return writeFileAsync("db/db.json", JSON.stringify(note));
    }

    addNote(note) {
        const { title, text } = note;

        if (!title || !text) {
            throw new Error("title and text cannot be blank");
        }

        const newNote = { title, text, id: uuidv1() };

        return this.getNotes()
            .then(notes => [...notes, newNote])
            .then(updatedNotes => this.write(updatedNotes))
            .then(() => newNote);
    }

    getNotes() {
        return this.read()
            .then(notes => JSON.parse(notes) || []);
    }

    removeNote(id) {
        return this.getNotes()
            .then(notes => notes.filter(note => note.id !== id))
            .then(keptNotes => this.write(keptNotes));
    }
}

module.exports = new Store();
