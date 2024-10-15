function getNotes() {
	return JSON.parse(localStorage.getItem('notes')) || []
}

function saveNotes(notes) {
	localStorage.setItem('notes', JSON.stringify(notes))
}

// Функция для автоматического изменения высоты textarea
function autoResizeTextarea(textarea) {
	textarea.style.height = 'auto' // Сбрасываем высоту
	textarea.style.height = textarea.scrollHeight + 'px' // Устанавливаем высоту в зависимости от содержимого
}

function displayNotes() {
	const notesList = document.getElementById('notes-list')
	notesList.innerHTML = ''

	const notes = getNotes()

	notes.forEach((note, index) => {
		const noteElement = document.createElement('div')
		noteElement.classList.add('note')

		noteElement.innerHTML = `
            <div class="notes">
                <input type="text" class="note-title" value="${note.title}" disabled>
                <textarea class="note-description" rows='1' cols='50' disabled>${note.description}</textarea>
                <div class="note-date">${note.date}</div>
            </div>
            <div class="note-actions">
                <button id="edit-btn-${index}">Изменить</button>
                <button onclick="deleteNote(${index})">Удалить</button>
            </div>
        `

		notesList.appendChild(noteElement)

		const descriptionInput = noteElement.querySelector('.note-description')
		autoResizeTextarea(descriptionInput) // Устанавливаем начальную высоту для textarea

		document
			.getElementById(`edit-btn-${index}`)
			.addEventListener('click', function () {
				editNoteMode(index)
			})
	})
}

function editNoteMode(index) {
	const notes = getNotes()
	const noteElement = document.getElementsByClassName('note')[index]

	const titleInput = noteElement.querySelector('.note-title')
	const descriptionInput = noteElement.querySelector('.note-description')
	const editButton = noteElement.querySelector(`#edit-btn-${index}`)

	// Toggle edit mode on button click
	if (titleInput.disabled) {
		titleInput.disabled = false
		descriptionInput.disabled = false
		editButton.textContent = 'Сохранить'

		// Добавляем слушатель для автоматического изменения высоты textarea
		descriptionInput.addEventListener('input', function () {
			autoResizeTextarea(this)
		})
	} else {
		// Save note changes
		notes[index].title = titleInput.value
		notes[index].description = descriptionInput.value
		notes[index].date = new Date().toLocaleDateString()

		saveNotes(notes)

		titleInput.disabled = true
		descriptionInput.disabled = true
		editButton.textContent = 'Изменить'
	}
}

document.getElementById('note-form').addEventListener('submit', function (e) {
	e.preventDefault()

	const title = document.getElementById('title').value
	const description = document.getElementById('description').value
	const date = new Date().toLocaleDateString()

	const notes = getNotes()

	notes.unshift({ title, description, date })

	saveNotes(notes)
	displayNotes()

	// Сброс формы и высоты textarea
	document.getElementById('note-form').reset()
	autoResizeTextarea(document.getElementById('description'))
})

function deleteNote(index) {
	const notes = getNotes()
	notes.splice(index, 1)
	saveNotes(notes)
	displayNotes()
}

document.addEventListener('DOMContentLoaded', displayNotes)
