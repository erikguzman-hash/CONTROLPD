import { elements } from './ui.js';
import { populateUsersDropdown, getTaskDoc, updateTask, addTask } from './firestore.js';
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import * as driveModule from './drive.js';

export async function openModal(dependencies, taskId) {
    const { db, appState } = dependencies;
    await populateUsersDropdown(db, 'task-expert', 'experto');
    await populateUsersDropdown(db, 'task-producer', ['productor', 'publicador']);
    await populateUsersDropdown(db, 'task-revisor', 'revisor');
    await populateUsersDropdown(db, 'task-publicador', 'publicador');

    document.getElementById('task-fecha-publicacion').addEventListener('change', (e) => {
        const publicacionDate = new Date(e.target.value);
        if (!isNaN(publicacionDate.getTime())) {
            const programacionDate = new Date(publicacionDate);
            programacionDate.setDate(programacionDate.getDate() - 2);
            document.getElementById('task-fecha-programacion').value = programacionDate.toISOString().split('T')[0];

            const entregaPiezaDate = new Date(programacionDate);
            entregaPiezaDate.setDate(entregaPiezaDate.getDate() - 1);
            document.getElementById('task-fecha-entrega-pieza').value = entregaPiezaDate.toISOString().split('T')[0];

            const inicioCreacionDate = new Date(entregaPiezaDate);
            inicioCreacionDate.setDate(inicioCreacionDate.getDate() - 3);
            document.getElementById('task-fecha-inicio-creacion').value = inicioCreacionDate.toISOString().split('T')[0];

            const entregaTemaDate = new Date(inicioCreacionDate);
            entregaTemaDate.setDate(entregaTemaDate.getDate() - 2);
            document.getElementById('task-fecha-entrega-tema').value = entregaTemaDate.toISOString().split('T')[0];

            const revisionIdeaDate = new Date(entregaTemaDate);
            document.getElementById('task-fecha-revision-idea').value = revisionIdeaDate.toISOString().split('T')[0];
        }
    });

    const { taskDetailsReadonly, taskModalFooter } = elements;
    const formInputs = [
        document.getElementById('task-title'), document.getElementById('task-description'),
        document.getElementById('task-tema-macro'), document.getElementById('task-fecha-publicacion'),
        document.getElementById('task-fecha-entrega-tema'), document.getElementById('task-tema-semanal'),
        document.getElementById('task-tema-del-dia'), document.getElementById('task-tipo-post'),
        document.getElementById('task-expert'), document.getElementById('task-producer'),
        document.getElementById('task-revisor'), document.getElementById('task-fecha-revision-idea'),
        document.getElementById('task-fecha-revision-final'),
        document.getElementById('task-publicador'),
        document.getElementById('task-fecha-inicio-creacion'),
        document.getElementById('task-fecha-entrega-pieza'),
        document.getElementById('task-fecha-programacion'),
        document.getElementById('task-due-date'), document.getElementById('task-file')
    ];
    const taskFileLinkElement = document.getElementById('task-file-link');
    const taskFileInput = document.getElementById('task-file');
    
    taskDetailsReadonly.classList.add('hidden');
    taskModalFooter.innerHTML = '';
    formInputs.forEach(input => {
        if(input) {
            const parent = input.parentElement;
            if(parent) parent.style.display = 'block';
            input.disabled = false;
        } else {
            // console.error('Un campo del formulario no fue encontrado en el DOM.');
        }
    });
    taskFileLinkElement.classList.add('hidden'); // Hide link by default

    if (taskId) {
        elements.taskModalTitle.textContent = 'Detalles de la Tarea';
        const taskDoc = await getTaskDoc(db, taskId);

        if (taskDoc.exists()) {
            const task = taskDoc.data();
            document.getElementById('task-id').value = taskId;
            
            setFieldVisibility(appState, task);

            const canEdit = appState.currentUser.uid === task.creatorId || appState.currentUserPapers.includes('coordinador') || appState.currentUserRole === 'director' || appState.currentUserRole === 'administrador';

            if (!canEdit) {
                taskDetailsReadonly.classList.remove('hidden');
                let fileLinkHtml = '';
                if (task.fileLink) {
                    fileLinkHtml = `<p><strong>Archivo Adjunto:</strong> <a href="${task.fileLink}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Ver archivo</a></p>`;
                }
                taskDetailsReadonly.innerHTML = `
                    <p><strong>Título:</strong> ${task.title}</p>
                    <p><strong>Descripción:</strong> ${task.description || 'N/A'}</p>
                    <p><strong>Tema Macro:</strong> ${task.temaMacro || 'N/A'}</p>
                    <p><strong>Fecha publicación:</strong> ${task.fechaPublicacion || 'N/A'}</p>
                    <p><strong>Fecha de entrega de Tema:</strong> ${task.fechaEntregaTema || 'N/A'}</p>
                    <p><strong>Tema semanal:</strong> ${task.temaSemanal || 'N/A'}</p>
                    <p><strong>Tema del dia:</strong> ${task.temaDelDia || 'N/A'}</p>
                    <p><strong>Tipo de Post:</strong> ${task.tipoPost || 'N/A'}</p>
                    <p><strong>Experto:</strong> ${task.expertName || 'N/A'}</p>
                    <p><strong>Producción:</strong> ${task.producerName || 'N/A'}</p>
                    <p><strong>Revisor:</strong> ${task.revisorName || 'N/A'}</p>
                    <p><strong>Fecha de Revisión de Idea:</strong> ${task.fechaRevisionIdea || 'N/A'}</p>
                    <p><strong>Fecha de Revisión Final:</strong> ${task.fechaRevisionFinal || 'N/A'}</p>
                    <p><strong>Publicador:</strong> ${task.publicadorName || 'N/A'}</p>
                    <p><strong>Fecha de Inicio de Creación:</strong> ${task.fechaInicioCreacion || 'N/A'}</p>
                    <p><strong>Fecha de Entrega de Pieza:</strong> ${task.fechaEntregaPieza || 'N/A'}</p>
                    <p><strong>Fecha de Programación:</strong> ${task.fechaProgramacion || 'N/A'}</p>
                    <p><strong>Fecha Límite:</strong> ${task.dueDate}</p>
                    ${fileLinkHtml}
                    <p><strong>Estado:</strong> <span class="status-badge status-${task.status}">${task.status}</span></p>`;
            } else {
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-description').value = task.description || '';
                document.getElementById('task-tema-macro').value = task.temaMacro || '';
                document.getElementById('task-fecha-publicacion').value = task.fechaPublicacion || '';
                document.getElementById('task-fecha-entrega-tema').value = task.fechaEntregaTema || '';
                document.getElementById('task-tema-semanal').value = task.temaSemanal || '';
                document.getElementById('task-tema-del-dia').value = task.temaDelDia || '';
                document.getElementById('task-tipo-post').value = task.tipoPost || '';
                document.getElementById('task-expert').value = task.expertId || '';
                document.getElementById('task-producer').value = task.producerId || '';
                document.getElementById('task-revisor').value = task.revisorId || '';
                document.getElementById('task-fecha-revision-idea').value = task.fechaRevisionIdea || '';
                document.getElementById('task-fecha-revision-final').value = task.fechaRevisionFinal || '';
                document.getElementById('task-publicador').value = task.publicadorId || '';
                document.getElementById('task-fecha-inicio-creacion').value = task.fechaInicioCreacion || '';
                document.getElementById('task-fecha-entrega-pieza').value = task.fechaEntregaPieza || '';
                document.getElementById('task-fecha-programacion').value = task.fechaProgramacion || '';
                document.getElementById('task-due-date').value = task.dueDate;
                if (task.fileLink) {
                    taskFileLinkElement.querySelector('a').href = task.fileLink;
                    taskFileLinkElement.classList.remove('hidden');
                    taskFileInput.parentElement.style.display = 'none';
                } else {
                    taskFileInput.parentElement.style.display = 'block';
                }
            }
            addWorkflowButtons(dependencies, task, taskId);
        }
    } else {
        elements.taskModalTitle.textContent = 'Crear Nueva Tarea';
        document.getElementById('task-id').value = '';
        taskModalFooter.innerHTML = '<button type="submit" class="bg-hgio-green text-white font-bold py-2 px-5 rounded-lg">Guardar Tarea</button>';
        taskFileInput.parentElement.style.display = 'block';
    }
    elements.taskModal.classList.add('is-open');
}

function setFieldVisibility(appState, task) {
    const { currentUser, currentUserRole, currentUserPapers } = appState;

    const allFields = document.querySelectorAll('#task-form .grid > div');
    allFields.forEach(field => field.style.display = 'none');

    const tabs = document.querySelectorAll('.tab-btn-modal');
    const tabContainer = document.querySelector('.border-b.border-gray-200.px-6');
    tabs.forEach(t => t.style.display = 'none');
    if (tabContainer) tabContainer.style.display = 'none';


    if (currentUserPapers.includes('coordinador') || currentUserRole === 'director' || currentUserRole === 'administrador') {
        allFields.forEach(field => field.style.display = 'block');
        tabs.forEach(t => t.style.display = 'block');
        if (tabContainer) tabContainer.style.display = 'block';
        return;
    }

    if (task.expertId === currentUser.uid) {
        document.getElementById('task-tema-semanal').parentElement.style.display = 'block';
        document.getElementById('task-tema-del-dia').parentElement.style.display = 'block';
        document.getElementById('task-fecha-entrega-tema').parentElement.style.display = 'block';
    }
    if (task.revisorId === currentUser.uid) {
        document.getElementById('task-fecha-revision-idea').parentElement.style.display = 'block';
        document.getElementById('task-fecha-revision-final').parentElement.style.display = 'block';
    }
    if (task.producerId === currentUser.uid) {
        document.getElementById('task-fecha-inicio-creacion').parentElement.style.display = 'block';
        document.getElementById('task-fecha-entrega-pieza').parentElement.style.display = 'block';
        document.getElementById('task-file').parentElement.style.display = 'block';
    }
    if (task.publicadorId === currentUser.uid) {
        document.getElementById('task-fecha-programacion').parentElement.style.display = 'block';
    }
}

function addWorkflowButtons(dependencies, task, taskId) {
    const { db, appState } = dependencies;
    const container = elements.taskModalFooter;
    container.innerHTML = '';

    const { currentUser, currentUserRole, currentUserPapers } = appState;

    if (currentUserPapers.includes('coordinador') || currentUserRole === 'director' || currentUserRole === 'administrador') {
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
    const revisorSelect = document.getElementById('task-revisor');
    const publicadorSelect = document.getElementById('task-publicador');
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
        temaMacro: document.getElementById('task-tema-macro').value,
        fechaPublicacion: document.getElementById('task-fecha-publicacion').value,
        fechaEntregaTema: document.getElementById('task-fecha-entrega-tema').value,
        temaSemanal: document.getElementById('task-tema-semanal').value,
        temaDelDia: document.getElementById('task-tema-del-dia').value,
        tipoPost: document.getElementById('task-tipo-post').value,
        expertId: expertSelect.value,
        expertName: expertSelect.selectedOptions[0].text,
        producerId: producerSelect.value,
        producerName: producerSelect.selectedOptions[0].text,
        revisorId: revisorSelect.value,
        revisorName: revisorSelect.selectedOptions[0].text,
        fechaRevisionIdea: document.getElementById('task-fecha-revision-idea').value,
        fechaRevisionFinal: document.getElementById('task-fecha-revision-final').value,
        publicadorId: publicadorSelect.value,
        publicadorName: publicadorSelect.selectedOptions[0].text,
        fechaInicioCreacion: document.getElementById('task-fecha-inicio-creacion').value,
        fechaEntregaPieza: document.getElementById('task-fecha-entrega-pieza').value,
        fechaProgramacion: document.getElementById('task-fecha-programacion').value,
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