/**
 * NOC TicketFlow - Tablero de Control de Incidencias HFC (jQuery)
 */

$(document).ready(function() {

    /* ==========================================================================
       1. CONFIGURACIÓN DE TAREAS INICIALES (MOCK DATA - INCIDENCIAS NOC)
       ========================================================================== */
    const sampleTasks = [
        {
            id: 101,
            title: "Alarma Crítica de Motogenerador PAN-14",
            desc: "Se reporta caída de voltaje y nivel bajo de combustible en celda móvil en Ciudad de Panamá. Requiere envío urgente de soporte técnico local.",
            priority: "high",
            date: "2026-06-02",
            status: "todo"
        },
        {
            id: 102,
            title: "Monitoreo de Ruido en Nodo HFC Liberty PR",
            desc: "Incidencia de primer nivel relacionada con altos niveles de ruido en el canal de retorno del nodo HFC en Liberty Puerto Rico. Afecta a 150 usuarios.",
            priority: "medium",
            date: "2026-06-03",
            status: "progress"
        },
        {
            id: 103,
            title: "Optimización de Script Python para Alarmas NOC",
            desc: "Revisar y mejorar el rendimiento de la consulta SQL y el script en Python encargado de automatizar el reporte consolidado de incidencias diarias.",
            priority: "low",
            date: "2026-06-05",
            status: "review"
        },
        {
            id: 104,
            title: "Documentación de Incidentes Críticos Turno Noche",
            desc: "Registro final, consulta y escalamiento de fallas masivas de energía presentadas en la red HFC internacional. Estado: Resuelto satisfactoriamente.",
            priority: "medium",
            date: "2026-05-30",
            status: "done"
        }
    ];

    /* ==========================================================================
       2. CARGAR / PERSISTIR TAREAS CON LOCALSTORAGE
       ========================================================================== */
    let tasks = [];
    
    try {
        const stored = localStorage.getItem('kanban_tasks');
        if (stored) {
            tasks = JSON.parse(stored);
        } else {
            tasks = [...sampleTasks];
            localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
        }
    } catch (e) {
        tasks = [...sampleTasks];
    }

    const columns = ['todo', 'progress', 'review', 'done'];

    // Selectores jQuery
    const $modal = $('#task-modal');
    const $form = $('#task-form');
    const $btnNewTask = $('#btn-new-task');
    const $closeModal = $('#close-modal');
    
    const $titleField = $('#task-title');
    const $descField = $('#task-desc');
    const $priorityField = $('#task-priority');
    const $dateField = $('#task-date');
    const $idField = $('#task-id-field');
    const $modalTitleText = $('#modal-title-text');

    /* ==========================================================================
       3. FUNCIONES DE RENDERIZADO DEL TABLERO KANBAN
       ========================================================================== */
    function renderBoard() {
        $('.cards-container').empty();
        let counts = { todo: 0, progress: 0, review: 0, done: 0 };

        tasks.forEach(task => {
            counts[task.status]++;

            const colIndex = columns.indexOf(task.status);
            const isFirstColumn = colIndex === 0;
            const isLastColumn = colIndex === columns.length - 1;

            const cardHtml = `
                <div class="task-card priority-${task.priority}-border" data-id="${task.id}" id="task-card-${task.id}">
                    <div class="card-header-row">
                        <span class="card-priority-tag ${task.priority}">${task.priority === 'low' ? 'baja' : task.priority === 'medium' ? 'media' : 'alta'}</span>
                        <div class="card-actions-wrapper">
                            <button class="card-btn btn-edit" data-id="${task.id}"><i class="fa-solid fa-pen"></i></button>
                            <button class="card-btn btn-delete" data-id="${task.id}"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                    </div>
                    
                    <h4 class="card-title">${task.title}</h4>
                    <p class="card-description">${task.desc}</p>
                    
                    <div class="card-footer-row">
                        <span class="card-date"><i class="fa-regular fa-calendar"></i> ${formatDate(task.date)}</span>
                        
                        <div class="card-nav-controls">
                            <button class="card-nav-btn btn-prev" data-id="${task.id}" ${isFirstColumn ? 'disabled' : ''} aria-label="Mover a columna anterior">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>
                            <button class="card-nav-btn btn-next" data-id="${task.id}" ${isLastColumn ? 'disabled' : ''} aria-label="Mover a columna siguiente">
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            $(`#container-${task.status}`).append(cardHtml);
        });

        columns.forEach(col => {
            $(`#badge-${col}`).text(counts[col]);
        });
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'Sin SLA';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    }

    function saveAndRender() {
        localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
        renderBoard();
    }

    /* ==========================================================================
       4. LÓGICA DE MOVIMIENTO DE TARJETAS (CONTROLES CLICK-TO-MOVE)
       ========================================================================== */
    $(document).on('click', '.btn-next', function() {
        const taskId = parseInt($(this).data('id'));
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            const currentIndex = columns.indexOf(task.status);
            if (currentIndex < columns.length - 1) {
                $(`#task-card-${taskId}`).fadeOut(200, function() {
                    task.status = columns[currentIndex + 1];
                    saveAndRender();
                    $(`#task-card-${taskId}`).hide().fadeIn(250);
                });
            }
        }
    });

    $(document).on('click', '.btn-prev', function() {
        const taskId = parseInt($(this).data('id'));
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            const currentIndex = columns.indexOf(task.status);
            if (currentIndex > 0) {
                $(`#task-card-${taskId}`).fadeOut(200, function() {
                    task.status = columns[currentIndex - 1];
                    saveAndRender();
                    $(`#task-card-${taskId}`).hide().fadeIn(250);
                });
            }
        }
    });

    /* ==========================================================================
       5. EDICIÓN Y ELIMINACIÓN DE TARJETAS
       ========================================================================== */
    $(document).on('click', '.btn-delete', function() {
        const taskId = parseInt($(this).data('id'));
        $(`#task-card-${taskId}`).slideUp(250, function() {
            tasks = tasks.filter(t => t.id !== taskId);
            saveAndRender();
        });
    });

    $(document).on('click', '.btn-edit', function() {
        const taskId = parseInt($(this).data('id'));
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            $idField.val(task.id);
            $titleField.val(task.title);
            $descField.val(task.desc);
            $priorityField.val(task.priority);
            $dateField.val(task.date);
            
            $modalTitleText.text("Editar Incidencia");
            $modal.addClass('show');
            $('body').css('overflow', 'hidden');
        }
    });

    /* ==========================================================================
       6. DIÁLOGO MODAL (AGREGAR / EDITAR) & VALIDACIÓN DE FORMULARIO
       ========================================================================== */
    $btnNewTask.on('click', function() {
        $idField.val('');
        $form[0].reset();
        
        const today = new Date().toISOString().split('T')[0];
        $dateField.val(today);
        
        $modalTitleText.text("Registrar Incidencia NOC");
        $('.form-control').removeClass('invalid');
        $('.form-error').hide();
        
        $modal.addClass('show');
        $('body').css('overflow', 'hidden');
    });

    function closeModalWindow() {
        $modal.removeClass('show');
        $('body').css('overflow', '');
    }

    $closeModal.on('click', closeModalWindow);

    $modal.on('click', function(event) {
        if ($(event.target).is('#task-modal')) {
            closeModalWindow();
        }
    });

    $(document).on('keydown', function(event) {
        if (event.key === 'Escape' && $modal.hasClass('show')) {
            closeModalWindow();
        }
    });

    $('.form-control').on('blur input', function() {
        const $input = $(this);
        const id = $input.attr('id');
        const value = $input.val().trim();
        let isValid = true;
        
        if (id === 'task-title') {
            isValid = value.length > 0;
            $('#title-error').toggle(!isValid);
        } else if (id === 'task-desc') {
            isValid = value.length >= 5;
            $('#desc-error').toggle(!isValid);
        } else if (id === 'task-date') {
            isValid = value.length > 0;
            $('#date-error').toggle(!isValid);
        }
        
        $input.toggleClass('invalid', !isValid);
    });

    $form.on('submit', function(event) {
        event.preventDefault();
        let isFormValid = true;
        
        const titleVal = $titleField.val().trim();
        if (titleVal.length === 0) {
            $titleField.addClass('invalid');
            $('#title-error').show();
            isFormValid = false;
        } else {
            $titleField.removeClass('invalid');
            $('#title-error').hide();
        }
        
        const descVal = $descField.val().trim();
        if (descVal.length < 5) {
            $descField.addClass('invalid');
            $('#desc-error').show();
            isFormValid = false;
        } else {
            $descField.removeClass('invalid');
            $('#desc-error').hide();
        }
        
        const dateVal = $dateField.val();
        if (!dateVal) {
            $dateField.addClass('invalid');
            $('#date-error').show();
            isFormValid = false;
        } else {
            $dateField.removeClass('invalid');
            $('#date-error').hide();
        }

        if (isFormValid) {
            const taskId = $idField.val();
            
            if (taskId) {
                const task = tasks.find(t => t.id === parseInt(taskId));
                if (task) {
                    task.title = titleVal;
                    task.desc = descVal;
                    task.priority = $priorityField.val();
                    task.date = dateVal;
                }
            } else {
                const newTask = {
                    id: Date.now(),
                    title: titleVal,
                    desc: descVal,
                    priority: $priorityField.val(),
                    date: dateVal,
                    status: 'todo'
                };
                tasks.push(newTask);
            }
            
            saveAndRender();
            closeModalWindow();
        }
    });

    /* ==========================================================================
       7. INICIALIZACIÓN
       ========================================================================== */
    // Limpiar localStorage anterior si contenía mock data financiera
    try {
        const stored = localStorage.getItem('kanban_tasks');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.length > 0 && parsed[0].title === "Maquetar Layout General") {
                localStorage.removeItem('kanban_tasks');
                tasks = [...sampleTasks];
                localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
            }
        }
    } catch(e) {}

    renderBoard();

});
