import { elements } from './ui.js';
import { populateUsersDropdown, getTaskDoc, updateTask, addTask } from './firestore.js';
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import * as driveModule from './drive.js';

    const { taskDetailsReadonly, taskModalFooter } = elements;
    const formInputs = [
        document.getElementById('task-title'), document.getElementById('task-description'),
        document.getElementById('task-expert'), document.getElementById('task-producer'),
        document.getElementById('task-due-date'), document.getElementById('task-file')
    ];
    const taskFileLinkElement = document.getElementById('task-file-link');
    const taskFileInput = document.getElementById('task-file');
    
    console.log('Habilitando campos del formulario de forma agresiva...');
    taskDetailsReadonly.classList.add('hidden');
    taskModalFooter.innerHTML = '';
    formInputs.forEach(input => {
        if(input) {
            input.parentElement.style.display = 'block';
            input.disabled = false;
            input.removeAttribute('disabled');
            console.log(`Campo ${input.id} habilitado. Propiedad input.disabled es:`, input.disabled);
        } else {
            console.error('Un campo del formulario no fue encontrado en el DOM.');
        }
    });
    taskFileLinkElement.classList.add('hidden'); // Hide link by default

    if (taskId) {
        elements.taskModalTitle.textContent = 'Detalles de la Tarea';
        const taskDoc = await getTaskDoc(db, taskId);

        if (taskDoc.exists()) {
            const task = taskDoc.data();
            document.getElementById('task-id').value = taskId;
            
            const canEdit = appState.currentUser.uid === task.creatorId || appState.currentUserPapers.includes('coordinador') || appState.currentUserRole === 'director';
            console.log('Puede editar?:', canEdit);

            if (!canEdit) {
                console.log('Modo de solo lectura.');
                formInputs.forEach(input => input.parentElement.style.display = 'none');
                taskDetailsReadonly.classList.remove('hidden');
                let fileLinkHtml = '';
                if (task.fileLink) {
                    fileLinkHtml = `<p><strong>Archivo Adjunto:</strong> <a href="${task.fileLink}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Ver archivo</a></p>`;
                }
                taskDetailsReadonly.innerHTML = `
                    <p><strong>Título:</strong> ${task.title}</p>
                    <p><strong>Descripción:</strong> ${task.description || 'N/A'}</p>
                    <p><strong>Experto:</strong> ${task.expertName || 'N/A'}</p>
                    <p><strong>Producción:</strong> ${task.producerName || 'N/A'}</p>
                    <p><strong>Fecha de Entrega:</strong> ${task.dueDate}</p>
                    ${fileLinkHtml}
                    <p><strong>Estado:</strong> <span class="status-badge status-${task.status}">${task.status}</span></p>`;
            } else {
                console.log('Modo de edición.');
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-description').value = task.description || '';
                document.getElementById('task-expert').value = task.expertId || '';
                document.getElementById('task-producer').value = task.producerId || '';
                document.getElementById('task-due-date').value = task.dueDate;
                if (task.fileLink) {
                    taskFileLinkElement.querySelector('a').href = task.fileLink;
                    taskFileLinkElement.classList.remove('hidden');
                    taskFileInput.parentElement.style.display = 'none'; // Hide file input if file already exists
                } else {
                    taskFileInput.parentElement.style.display = 'block';
                }
            }
            addWorkflowButtons(dependencies, task, taskId);
        }
    } else {
        console.log('Creando nueva tarea.');
        elements.taskModalTitle.textContent = 'Crear Nueva Tarea';
        document.getElementById('task-id').value = '';
        taskModalFooter.innerHTML = '<button type="submit" class="bg-hgio-green text-white font-bold py-2 px-5 rounded-lg">Guardar Tarea</button>';
        taskFileInput.parentElement.style.display = 'block'; // Ensure file input is visible for new tasks
    }
    elements.taskModal.classList.add('is-open');
}

function addWorkflowButtons(dependencies, task, taskId) {
    const { db, appState } = dependencies;
    const container = elements.taskModalFooter;
    container.innerHTML = '';

    const { currentUser, currentUserRole, currentUserPapers } = appState;

    if (currentUserPapers.includes('coordinador') || currentUserRole === 'director') {
        container.appendChild(createButton('submit', 'Guardar Cambios', 'bg-hgio-blue'));
    }

    switch (task.status) {
        case 'propuesta':
            if (currentUserRole === 'director') {
                container.appendChild(createButton('button', 'Validar Propuesta', 'bg-green-500', () => updateTask(db, taskId, { status: 'desarrollo' })));
                container.appendChild(createButton('button', 'Rechazar', 'bg-red-500', () => updateTask(db, taskId, { status: 'rechazado' })));
            }
            break;
        
        case 'desarrollo':
            if (currentUser.uid === task.expertId) {
                container.appendChild(createButton('button', 'Entregar Borrador', 'bg-hgio-blue', async () => {
                    if (!task.fileId) {
                        alert("Por favor, adjunta el borrador en Google Drive antes de entregarlo.");
                        return;
                    }
                    await updateTask(db, taskId, { status: 'validacion_post' });
                }));
            }
            break;

        case 'validacion_post':
            if (currentUserPapers.includes('revisor') || currentUserRole === 'director') {
                container.appendChild(createButton('button', 'Aprobar Borrador', 'bg-green-500', () => updateTask(db, taskId, { status: 'produccion' })));
                container.appendChild(createButton('button', 'Rechazar', 'bg-red-500', () => updateTask(db, taskId, { status: 'desarrollo' })));
            }
            break;
        
        case 'produccion':
            if (currentUser.uid === task.producerId) {
                 container.appendChild(createButton('button', 'Entregar Pieza Final', 'bg-hgio-blue', async () => {
                    if (!task.fileId) {
                        alert("Por favor, adjunta la pieza final en Google Drive antes de entregarla.");
                        return;
                    }
                    await updateTask(db, taskId, { status: 'aprobacion_diseno' });
                }));
            }
            break;

        case 'aprobacion_diseno':
            if (currentUserPapers.includes('revisor') || currentUserRole === 'director') {
                container.appendChild(createButton('button', 'Aprobar Diseño Final', 'bg-green-700', () => updateTask(db, taskId, { status: 'programado' })));
                container.appendChild(createButton('button', 'Rechazar', 'bg-red-500', () => updateTask(db, taskId, { status: 'produccion' })));
            }
            break;
        
        case 'programado':
            if (currentUser.uid === task.producerId) {
                 container.appendChild(createButton('button', 'Marcar como Publicado', 'bg-gray-500', () => updateTask(db, taskId, { status: 'publicado' })));
            }
            break;
    }
}

function createButton(type, text, className, onClick) {
    const button = document.createElement('button');
    button.type = type;
    button.textContent = text;
    button.className = `${className} text-white font-bold py-2 px-4 rounded-lg`;
    if (onClick) button.onclick = (e) => {
        e.preventDefault();
        onClick();
    };
    return button;
}

export function closeModal() {
    elements.taskModal.classList.remove('is-open');
}

export async function handleSubmit(dependencies, e) {
    console.log('handleSubmit function in tasks.js has been called!');
    e.preventDefault();
    const { db, appState } = dependencies;
    const taskId = document.getElementById('task-id').value;
    const expertSelect = document.getElementById('task-expert');
    const producerSelect = document.getElementById('task-producer');
    const taskFileInput = document.getElementById('task-file');
    const file = taskFileInput.files[0];
    
    let fileId = '';
    let fileLink = '';

    if (file) {
        try {
            const uploadedFile = await driveModule.uploadFileToDrive(file, file.name, file.type);
            fileId = uploadedFile.id;
            const fileLinks = await driveModule.getDriveFileLink(fileId);
            fileLink = fileLinks.webViewLink || fileLinks.webContentLink;
            alert("Archivo subido a Google Drive con éxito!");
        } catch (error) {
            console.error("Error al subir archivo a Google Drive:", error);
            alert("Error al subir archivo a Google Drive. Verifica la consola.");
            return; // Prevent task save if file upload fails
        }
    }

    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        expertId: expertSelect.value,
        expertName: expertSelect.selectedOptions[0].text,
        producerId: producerSelect.value,
        producerName: producerSelect.selectedOptions[0].text,
        dueDate: document.getElementById('task-due-date').value,
        updatedAt: serverTimestamp(),
        fileId: fileId, // Store file ID
        fileLink: fileLink // Store file link
    };

    if (taskId) {
        await updateTask(db, taskId, taskData);
    } else {
        taskData.creatorId = appState.currentUser.uid;
        taskData.creatorName = appState.currentUser.displayName;
        taskData.status = 'propuesta';
        taskData.createdAt = serverTimestamp();
        await addTask(db, taskData);
    }
    closeModal();
}

function addWorkflowButtons(dependencies, task, taskId) {
    const { db, appState } = dependencies;
    const container = elements.taskModalFooter;
    container.innerHTML = '';

    const { currentUser, currentUserRole, currentUserPapers } = appState;

    if (currentUserPapers.includes('coordinador') || currentUserRole === 'director') {
        container.appendChild(createButton('submit', 'Guardar Cambios', 'bg-hgio-blue'));
    }

    switch (task.status) {
        case 'propuesta':
            if (currentUserRole === 'director') {
                container.appendChild(createButton('button', 'Validar Propuesta', 'bg-green-500', () => updateTask(db, taskId, { status: 'desarrollo' })));
                container.appendChild(createButton('button', 'Rechazar', 'bg-red-500', () => updateTask(db, taskId, { status: 'rechazado' })));
            }
            break;
        
        case 'desarrollo':
            if (currentUser.uid === task.expertId) {
                container.appendChild(createButton('button', 'Entregar Borrador', 'bg-hgio-blue', () => {
                    alert("Funcionalidad de Google Drive no implementada. Cambiando estado.");
                    updateTask(db, taskId, { status: 'validacion_post' });
                }));
            }
            break;

        case 'validacion_post':
            if (currentUserPapers.includes('revisor') || currentUserRole === 'director') {
                container.appendChild(createButton('button', 'Aprobar Borrador', 'bg-green-500', () => updateTask(db, taskId, { status: 'produccion' })));
                container.appendChild(createButton('button', 'Rechazar', 'bg-red-500', () => updateTask(db, taskId, { status: 'desarrollo' })));
            }
            break;
        
        case 'produccion':
            if (currentUser.uid === task.producerId) {
                 container.appendChild(createButton('button', 'Entregar Pieza Final', 'bg-hgio-blue', () => {
                    alert("Funcionalidad de Google Drive no implementada. Cambiando estado.");
                    updateTask(db, taskId, { status: 'aprobacion_diseno' });
                }));
            }
            break;

        case 'aprobacion_diseno':
            if (currentUserPapers.includes('revisor') || currentUserRole === 'director') {
                container.appendChild(createButton('button', 'Aprobar Diseño Final', 'bg-green-700', () => updateTask(db, taskId, { status: 'programado' })));
                container.appendChild(createButton('button', 'Rechazar', 'bg-red-500', () => updateTask(db, taskId, { status: 'produccion' })));
            }
            break;
        
        case 'programado':
            if (currentUser.uid === task.producerId) {
                 container.appendChild(createButton('button', 'Marcar como Publicado', 'bg-gray-500', () => updateTask(db, taskId, { status: 'publicado' })));
            }
            break;
    }
}

function createButton(type, text, className, onClick) {
    const button = document.createElement('button');
    button.type = type;
    button.textContent = text;
    button.className = `${className} text-white font-bold py-2 px-4 rounded-lg`;
    if (onClick) button.onclick = (e) => {
        e.preventDefault();
        onClick();
    };
    return button;
}

export function closeModal() {
    elements.taskModal.classList.remove('is-open');
}

export async function handleSubmit(dependencies, e) {
    console.log('handleSubmit function in tasks.js has been called!');
    e.preventDefault();
    const { db, appState } = dependencies;
    const taskId = document.getElementById('task-id').value;
    const expertSelect = document.getElementById('task-expert');
    const producerSelect = document.getElementById('task-producer');
    
    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        expertId: expertSelect.value,
        expertName: expertSelect.selectedOptions[0].text,
        producerId: producerSelect.value,
        producerName: producerSelect.selectedOptions[0].text,
        dueDate: document.getElementById('task-due-date').value,
        updatedAt: serverTimestamp(),
    };

    if (taskId) {
        await updateTask(db, taskId, taskData);
    } else {
        taskData.creatorId = appState.currentUser.uid;
        taskData.creatorName = appState.currentUser.displayName;
        taskData.status = 'propuesta';
        taskData.createdAt = serverTimestamp();
        await addTask(db, taskData);
    }
    closeModal();
}