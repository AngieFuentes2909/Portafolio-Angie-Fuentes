/**
 * Portafolio Hub - Main Interactive Scripts (jQuery)
 * Especializado en maquetación interactiva y animaciones fluidas
 */

$(document).ready(function() {
    
    /* ==========================================================================
       1. VARIABLES GLOBALES
       ========================================================================== */
    const $body = $('body');
    const $window = $(window);
    const $header = $('#site-header');
    const $menuToggle = $('#menu-toggle-btn');
    const $mainNav = $('#main-navigation');
    const $navLinks = $('.nav-link');
    const $themeToggle = $('#theme-toggle-btn');
    const $filterBtns = $('.filter-btn');
    const $projectCards = $('.project-card');
    const $contactForm = $('#portfolio-contact-form');
    
    /* ==========================================================================
       2. TEMA DE COLOR (CLARO / OSCURO) CON LOCALSTORAGE
       ========================================================================== */
    // Forzar el tema oscuro por defecto y eliminar la alternancia
    $body.removeClass('light-theme').addClass('dark-theme');

    /* ==========================================================================
       3. RESPONSIVE MENU (MOBILE DRAWER)
       ========================================================================== */
    $menuToggle.on('click', function() {
        $mainNav.toggleClass('open');
        
        // Animación del icono del menú hamburguesa / cerrar
        const $icon = $(this).find('i');
        if ($mainNav.hasClass('open')) {
            $icon.removeClass('fa-bars').addClass('fa-xmark');
        } else {
            $icon.removeClass('fa-xmark').addClass('fa-bars');
        }
    });

    // Cerrar el menú móvil cuando se hace click en un enlace
    $navLinks.on('click', function() {
        if ($mainNav.hasClass('open')) {
            $mainNav.removeClass('open');
            $menuToggle.find('i').removeClass('fa-xmark').addClass('fa-bars');
        }
    });

    // Cerrar el menú móvil si se hace click fuera de él
    $(document).on('click', function(event) {
        if (!$(event.target).closest('#main-navigation').length && 
            !$(event.target).closest('#menu-toggle-btn').length && 
            $mainNav.hasClass('open')) {
            $mainNav.removeClass('open');
            $menuToggle.find('i').removeClass('fa-xmark').addClass('fa-bars');
        }
    });

    /* ==========================================================================
       4. SCROLL EVENTS: NAV ACTIVO Y EFECTO HEADER
       ========================================================================== */
    function handleScroll() {
        const scrollPos = $window.scrollTop();
        
        // A. Efecto de encogimiento / sombreado del Header al hacer scroll
        if (scrollPos > 50) {
            $header.css({
                height: '70px',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: 'rgba(11, 15, 25, 0.9)'
            });
        } else {
            $header.css({
                height: 'var(--header-height)',
                boxShadow: 'none',
                backgroundColor: 'var(--bg-glass)'
            });
        }
        
        // B. Actualizar enlace de navegación activo según posición del scroll
        $('section').each(function() {
            const $section = $(this);
            const top = $section.offset().top - 120;
            const bottom = top + $section.outerHeight();
            
            if (scrollPos >= top && scrollPos <= bottom) {
                const id = $section.attr('id');
                $navLinks.removeClass('active');
                $(`a[href="#${id}"]`).addClass('active');
            }
        });
    }
    
    $window.on('scroll', handleScroll);
    handleScroll(); // Ejecutar al inicio

    /* ==========================================================================
       5. FILTRADO DINÁMICO DE PROYECTOS (jQuery)
       ========================================================================== */
    $filterBtns.on('click', function() {
        const $btn = $(this);
        const filterValue = $btn.data('filter');
        
        // Cambiar clase activa en los botones
        $filterBtns.removeClass('active');
        $btn.addClass('active');
        
        // Filtrar tarjetas de proyectos con efectos jQuery
        if (filterValue === 'all') {
            $projectCards.each(function() {
                const $card = $(this);
                $card.fadeIn(400).css('transform', 'scale(1)');
            });
        } else {
            $projectCards.each(function() {
                const $card = $(this);
                const categories = $card.attr('data-category').split(' ');
                
                if (categories.includes(filterValue)) {
                    $card.fadeIn(400).css('transform', 'scale(1)');
                } else {
                    $card.fadeOut(200).css('transform', 'scale(0.95)');
                }
            });
        }
    });

    /* ==========================================================================
       6. FORM VALIDATION & AJAX SIMULATION (jQuery)
       ========================================================================== */
    
    // Función auxiliar para validar correos
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Validación interactiva individual on-blur / on-input
    $('.form-control').on('blur input', function() {
        const $input = $(this);
        const name = $input.attr('name');
        const value = $input.val().trim();
        let isValid = true;
        
        if (name === 'name') {
            isValid = value.length >= 3;
            $('#name-error').toggle(!isValid);
        } else if (name === 'email') {
            isValid = isValidEmail(value);
            $('#email-error').toggle(!isValid);
        } else if (name === 'subject') {
            isValid = value.length > 0;
            $('#subject-error').toggle(!isValid);
        } else if (name === 'message') {
            isValid = value.length >= 10;
            $('#message-error').toggle(!isValid);
        }
        
        $input.toggleClass('invalid', !isValid);
    });

    // Envío del Formulario
    $contactForm.on('submit', function(event) {
        event.preventDefault();
        
        let isFormValid = true;
        
        // Validar todos los inputs antes del submit
        $contactForm.find('.form-control').each(function() {
            const $input = $(this);
            const name = $input.attr('name');
            const value = $input.val().trim();
            let isInputValid = true;
            
            if (name === 'name') {
                isInputValid = value.length >= 3;
                $('#name-error').toggle(!isInputValid);
            } else if (name === 'email') {
                isInputValid = isValidEmail(value);
                $('#email-error').toggle(!isInputValid);
            } else if (name === 'subject') {
                isInputValid = value.length > 0;
                $('#subject-error').toggle(!isInputValid);
            } else if (name === 'message') {
                isInputValid = value.length >= 10;
                $('#message-error').toggle(!isInputValid);
            }
            
            $input.toggleClass('invalid', !isInputValid);
            
            if (!isInputValid) {
                isFormValid = false;
            }
        });
        
        const $successAlert = $('#form-status-success');
        const $errorAlert = $('#form-status-error');
        const $submitBtn = $('#form-submit-btn');
        
        if (isFormValid) {
            // Ocultar alertas anteriores
            $errorAlert.slideUp(200);
            
            // Cambiar estado del botón a cargando
            $submitBtn.prop('disabled', true).html('Enviando... <i class="fa-solid fa-spinner fa-spin btn-icon"></i>');
            
            // Simular petición AJAX
            setTimeout(function() {
                // Restaurar botón
                $submitBtn.prop('disabled', false).html('Enviar Mensaje <i class="fa-solid fa-paper-plane btn-icon"></i>');
                
                // Mostrar éxito
                $successAlert.slideDown(300);
                
                // Resetear campos del formulario
                $contactForm[0].reset();
                $('.form-control').removeClass('invalid');
                
                // Ocultar alerta de éxito tras 5 segundos
                setTimeout(function() {
                    $successAlert.slideUp(300);
                }, 5000);
                
            }, 1500);
            
        } else {
            // Mostrar error general
            $successAlert.slideUp(200);
            $errorAlert.slideDown(300);
            
            // Auto ocultar alerta de error tras 5 segundos
            setTimeout(function() {
                $errorAlert.slideUp(300);
            }, 5000);
        }
    });
    
});
