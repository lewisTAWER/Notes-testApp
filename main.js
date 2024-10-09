// Функция для получения заметок из LocalStorage
function getNotes() {
	return JSON.parse(localStorage.getItem('notes')) || []
}

// Функция для сохранения заметок в LocalStorage
function saveNotes(notes) {
	localStorage.setItem('notes', JSON.stringify(notes))
}

// Функция для отображения заметок на странице
function displayNotes() {
	const notesList = document.getElementById('notes-list')
	notesList.innerHTML = '' // Очищаем контейнер для заметок

	const notes = getNotes()

	notes.forEach((note, index) => {
		const noteElement = document.createElement('div')
		noteElement.classList.add('note')

		noteElement.innerHTML = `
            <div class="notes">
               <input type="text" class="note-title" value="${note.title}" disabled>
               <textarea class="note-description" rows='1' disabled>${note.description}</textarea>
               <div class="note-date">${note.date}</div>
            </div>
            <div class="note-actions">
                <button id="edit-btn-${index}">Изменить</button>
                <button onclick="deleteNote(${index})">Удалить</button>
            </div>
        `

		notesList.appendChild(noteElement)

		// Обработка нажатия на кнопку "Изменить"
		document
			.getElementById(`edit-btn-${index}`)
			.addEventListener('click', function () {
				editNoteMode(index)
			})
	})
}

// Функция для активации режима редактирования
function editNoteMode(index) {
	const notes = getNotes()
	const noteElement = document.getElementsByClassName('note')[index]

	// Поля ввода для редактирования
	const titleInput = noteElement.querySelector('.note-title')
	const descriptionInput = noteElement.querySelector('.note-description')
	const editButton = noteElement.querySelector(`#edit-btn-${index}`)

	// Переводим инпуты в активное состояние (разрешаем редактировать)
	titleInput.disabled = false
	descriptionInput.disabled = false

	// Меняем текст кнопки на "Сохранить"
	editButton.textContent = 'Сохранить'

	// Обработчик для сохранения изменений
	editButton.onclick = function () {
		// Сохраняем новые значения в заметку
		notes[index].title = titleInput.value
		notes[index].description = descriptionInput.value
		notes[index].date = new Date().toLocaleDateString() // Обновляем дату

		// Сохраняем обновленные заметки в LocalStorage
		saveNotes(notes)

		// Возвращаем поля в неактивное состояние
		titleInput.disabled = true
		descriptionInput.disabled = true

		// Меняем текст кнопки обратно на "Изменить"
		editButton.textContent = 'Изменить'

		// Восстанавливаем изначальное событие для кнопки
		editButton.onclick = function () {
			editNoteMode(index)
		}
	}
}

// Функция для добавления новой заметки
document.getElementById('note-form').addEventListener('submit', function (e) {
	e.preventDefault()

	const title = document.getElementById('title').value
	const description = document.getElementById('description').value
	const date = new Date().toLocaleDateString()

	const notes = getNotes()

	// Добавляем новую заметку в начало массива
	notes.unshift({ title, description, date })

	// Сохраняем заметки
	saveNotes(notes)

	// Обновляем отображение заметок
	displayNotes()

	// Очищаем форму
	document.getElementById('note-form').reset()
})

// Функция для удаления заметки
function deleteNote(index) {
	const notes = getNotes()
	notes.splice(index, 1) // Удаляем заметку по индексу
	saveNotes(notes) // Сохраняем обновленный массив
	displayNotes() // Обновляем список заметок на странице
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', displayNotes)
