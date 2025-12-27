const items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const STORAGE_KEY = "todoItems";

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const tasks = saved ? JSON.parse(saved) : items;

  tasks.forEach((task) => {
    const element = createItem(task);
    listElement.append(element);
  });
}

function createItem(item) {
  const template = document.getElementById("to-do__item-template");
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);

  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(
    ".to-do__item-button_type_duplicate"
  );
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;

  deleteButton.addEventListener("click", () => {
    clone.remove();
    saveTasks(getTasksFromDOM());
  });

  duplicateButton.addEventListener("click", () => {
    const newElement = createItem(item);
    listElement.prepend(newElement);
    saveTasks(getTasksFromDOM());
  });

  editButton.addEventListener("click", () => {
    const originalText = textElement.textContent;

    textElement.contentEditable = "true";
    textElement.focus();

    function handleBlur() {
      const updatedText = textElement.textContent.trim();

      if (!updatedText) {
        textElement.textContent = originalText;
      }

      textElement.contentEditable = "false";
      textElement.removeEventListener("blur", handleBlur);

      saveTasks(getTasksFromDOM());
    }

    textElement.addEventListener("blur", handleBlur);
  });

  return clone;
}

function getTasksFromDOM() {
  return Array.from(listElement.querySelectorAll(".to-do__item-text")).map(
    (el) => el.textContent
  );
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

formElement.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const text = inputElement.value.trim();
  if (!text) return;

  const element = createItem(text);
  listElement.prepend(element);

  inputElement.value = "";
  saveTasks(getTasksFromDOM());
});

loadTasks();
