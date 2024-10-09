// получение заметок из локала
function getNotes() {
	return JSON.parse(localStorage.getItem('notes')) || []
}

// замети в локал
function saveNotes(notes) {
	localStorage.setItem('notes', JSON.stringify(notes))
}

// отображение заметок
function displayNotes() {
	const notesList = document.getElementById('notes-list')
	notesList.innerHTML = ''

	const notes = getNotes()

	notes.forEach((note, index) => {
		const noteElement = document.createElement('div')
		noteElement.classList.add('note')

		noteElement.innerHTML = `
            <div class="notes">
               <div class="note-title">${note.title}</div>
               <div class="note-description">${note.description}</div>
               <div class="note-date">${note.date}</div>
            </div>
            <div class="note-actions">
                <button onclick="editNote(${index})">Изменить</button>
                <button onclick="deleteNote(${index})">Удалить</button>
            </div>
        `

		notesList.appendChild(noteElement)
	})
}

// + заметка
document.getElementById('note-form').addEventListener('submit', function (e) {
	e.preventDefault()

	const title = document.getElementById('title').value
	const description = document.getElementById('description').value
	const date = new Date().toLocaleDateString()

	const notes = getNotes()

	// новая заметка в начало
	notes.unshift({ title, description, date })

	saveNotes(notes)

	displayNotes()

	// - форма
	document.getElementById('note-form').reset()
})

// редактировать заметку
function editNote(index) {
	const notes = getNotes()

	const note = notes[index]
	document.getElementById('title').value = note.title
	document.getElementById('description').value = note.description

	document.getElementById('note-form').removeEventListener('submit', addNote)

	document
		.getElementById('note-form')
		.addEventListener('submit', function updateNote(e) {
			e.preventDefault()

			note.title = document.getElementById('title').value
			note.description = document.getElementById('description').value
			note.date = new Date().toLocaleDateString()

			notes[index] = note
			saveNotes(notes)
			displayNotes()

			document.getElementById('note-form').reset()
			document
				.getElementById('note-form')
				.removeEventListener('submit', updateNote)
			document.getElementById('note-form').addEventListener('submit', addNote)
		})
}

// - заметка
function deleteNote(index) {
	const notes = getNotes()
	notes.splice(index, 1)
	saveNotes(notes)
	displayNotes()
}

function addNote() {
	const title = document.getElementById('title').value
	const description = document.getElementById('description').value
	const date = new Date().toLocaleDateString()

	const notes = getNotes()

	notes.push({ title, description, date })
	saveNotes(notes)

	displayNotes()

	document.getElementById('note-form').reset()
}

document.addEventListener('DOMContentLoaded', displayNotes)
