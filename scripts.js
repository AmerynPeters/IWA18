// import data.js'
import { createOrderData } from "./data.js";
import { updateDragging } from "./data.js";
import { state } from "./data.js";

// import view.js
import { createOrderHtml } from "./view.js";
import { html } from "./view.js";
import { updateDraggingHtml } from "./view.js";
import { moveToColumn } from "./view.js";

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event
 */
// drag element:
const handleDragOver = (event) => {
    /**
     * preventDefault makes sure that if the event doesn't get handled/used, no default actions should be taken.
     * this prevents the browser’s default drag and drop features from interfering with your custom drag and drop logic.
     */
    event.preventDefault();
    /**
     * composedPath method of the Event interface (an event which takes place in the DOM) returns the event's path which is an array
     * of the objects on which listeners will be invoked.
     */
    const path = event.path || event.composedPath();
    let column = null;

    for (const element of path) {
        const { area } = element.dataset;
        if (area) {
            column = area;
            break;
        }
    }

    if (!column) return;
    updateDragging({ over: column });
    updateDraggingHtml({ over: column });
};
//drag element to next coloumn:
const handleDragStart = (event) => {
    draggedItem = event.target.closest(".order"); // getting the closest ancestor of the event target (the element that was clicked) that matches the selector “.order”. This will be the item that the user is trying to drag.
    draggingElement = state.dragging.over; // tracks which element is currently being dragged over.
    id = draggedItem.dataset.id;
};
// drop element in the coloumn
const handleDragEnd = (event) => {
    event.preventDefault();
    const moveTo = state.dragging.over;
    moveToColumn(id, moveTo);
    updateDraggingHtml({ over: null });
};
// click on help button- info will display and close event
const handleHelpToggle = (event) => {
    if (!html.help.overlay.open) {
        html.help.overlay.showModal();
    } else {
        html.help.overlay.close();
    }
    html.help.cancel.addEventListener("click", () => {
        html.help.overlay.close();
    });
};
// add element
const handleAddToggle = (event) => {
    if (!html.add.overlay.open) {
        html.add.overlay.showModal();
    } else {
        html.add.overlay.close();
    }
    html.add.cancel.addEventListener("click", () => {
        html.add.overlay.close();
    });
    html.add.form.reset();
};
// add element
const handleAddSubmit = (event) => {
    event.preventDefault();
    const order = {
        id: null,
        title: document.querySelector("[data-add-title]").value,
        table: document.querySelector("[data-add-table]").value,
        column: document.querySelector('[data-column="ordered"]'),
        created: null,
    };
    document
        .querySelector('[data-column="ordered"]')
        .appendChild(createOrderHtml(createOrderData(order)));
    html.add.overlay.close();
    html.add.form.reset();
};
// edit element
const handleEditToggle = (event) => {
    if (!html.edit.overlay.open) {
        html.edit.overlay.showModal();
    } else {
        html.edit.overlay.close();
    }
    html.edit.cancel.addEventListener("click", html.help.overlay.close());
    if (event.target.dataset.id) {
        const editOrderTitle = document.querySelector("[data-edit-title]");
        editOrderTitle.value = event.target.children[0].textContent;
        const editOrderTable = document.querySelector("[data-edit-table]");
        editOrderTable.selectedIndex =
            event.target.children[1].children[0].children[1].textContent - 1;
        const editOrderId = document.querySelector("[data-edit-id]");
        editOrderId.setAttribute("data-edit-id", event.target.dataset.id);
    }
};
// update element order
const handleEditSubmit = (event) => {
    event.preventDefault();
    const activeElementId = document.querySelector("[data-edit-id]");
    const actualId = activeElementId.getAttribute("data-edit-id");
    const activeElementSelector = document.querySelector("[data-edit-column]");
    const actualColumn = activeElementSelector.value;
    moveToColumn(actualId, actualColumn);
    const orderId = document.querySelector(`[data-id="${actualId}"]`);
    orderId.children[0].textContent =
        document.querySelector("[data-edit-title]").value;
    orderId.children[1].children[0].children[1].textContent =
        document.querySelector("[data-edit-table]").value;
    html.edit.overlay.close();
};
// delete order
const handleDelete = (event) => {
    const activeElementId = document.querySelector("[data-edit-id]");
    const actualId = activeElementId.getAttribute("data-edit-id");
    const orderId = document.querySelector(`[data-id="${actualId}"]`);
    orderId.remove();
    html.edit.overlay.close();
};
// event listeners to connect the fxns to html so that they run
html.add.cancel.addEventListener("click", handleAddToggle);
html.other.add.addEventListener("click", handleAddToggle);
html.add.form.addEventListener("submit", handleAddSubmit);

html.other.grid.addEventListener("click", handleEditToggle);
html.edit.cancel.addEventListener("click", handleEditToggle);
html.edit.form.addEventListener("submit", handleEditSubmit);
html.edit.delete.addEventListener("click", handleDelete);

html.help.cancel.addEventListener("click", handleHelpToggle);
html.other.help.addEventListener("click", handleHelpToggle);

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener("dragstart", handleDragStart);
    htmlColumn.addEventListener("dragend", handleDragEnd);
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener("dragover", handleDragOver);
}
