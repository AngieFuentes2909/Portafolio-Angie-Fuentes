/**
 * Fintech AI - Interactive Script (jQuery)
 * Manejo de componentes dinámicos de interfaz
 */

$(document).ready(function() {

    /* ==========================================================================
       1. CONTROLLER DEL SELECTOR DE PRECIOS (MENSUAL / ANUAL)
       ========================================================================== */
    const $pricingToggle = $('#pricing-toggle');
    const $monthlyLabel = $('.label-monthly');
    const $yearlyLabel = $('.label-yearly');
    
    $pricingToggle.on('click', function() {
        const $btn = $(this);
        $btn.toggleClass('yearly-active');
        
        const isYearly = $btn.hasClass('yearly-active');
        
        // Alternar clases activas en los textos labels
        if (isYearly) {
            $monthlyLabel.removeClass('active');
            $yearlyLabel.addClass('active');
        } else {
            $yearlyLabel.removeClass('active');
            $monthlyLabel.addClass('active');
        }
        
        // Actualizar valores de precios con micro-animaciones
        $('.price-val').each(function() {
            const $price = $(this);
            const monthlyVal = $price.attr('data-monthly');
            const yearlyVal = $price.attr('data-yearly');
            const targetVal = isYearly ? yearlyVal : monthlyVal;
            
            // Animación de desvanecimiento rápida al cambiar de valor
            $price.fadeOut(150, function() {
                $price.text(targetVal).fadeIn(150);
            });
        });
        
        // Actualizar periodo
        $('.price-period').each(function() {
            const $period = $(this);
            $period.fadeOut(150, function() {
                $period.text(isYearly ? '/combo' : '/unidad').fadeIn(150);
            });
        });
    });

    /* ==========================================================================
       2. CARRUSEL / SLIDER DE TESTIMONIOS
       ========================================================================== */
    const $slides = $('.testimonial-slide');
    const $dots = $('.slider-dots .dot');
    let currentSlide = 0;
    const slideCount = $slides.length;
    let isAnimating = false;
    
    function showSlide(index, direction) {
        if (isAnimating || index === currentSlide) return;
        isAnimating = true;
        
        const $currentSlide = $slides.eq(currentSlide);
        const $nextSlide = $slides.eq(index);
        
        // Cambiar estado activo de los indicadores (dots)
        $dots.removeClass('active');
        $dots.eq(index).addClass('active');
        
        // Aplicar clases de salida a la diapositiva actual
        if (direction === 'next') {
            $currentSlide.addClass('slide-out-left');
        } else {
            // Desplazar en sentido inverso
            $currentSlide.css('transform', 'translateX(40px)');
        }
        
        $currentSlide.css({ opacity: 0 });
        
        setTimeout(function() {
            $slides.removeClass('active slide-out-left').css('transform', '');
            
            $nextSlide.css('transform', direction === 'next' ? 'translateX(40px)' : 'translateX(-40px)');
            $nextSlide.addClass('active');
            
            // Forzar reflow del navegador para aplicar el reset de posición antes de transicionar
            $nextSlide[0].offsetHeight;
            
            $nextSlide.css({ opacity: 1, transform: 'translateX(0)' });
            
            currentSlide = index;
            isAnimating = false;
        }, 400);
    }
    
    // Controles de flechas
    $('#slider-next').on('click', function() {
        const nextIndex = (currentSlide + 1) % slideCount;
        showSlide(nextIndex, 'next');
    });
    
    $('#slider-prev').on('click', function() {
        const prevIndex = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(prevIndex, 'prev');
    });
    
    // Controles de puntos (dots)
    $dots.on('click', function() {
        const targetIndex = parseInt($(this).attr('data-slide'));
        if (targetIndex > currentSlide) {
            showSlide(targetIndex, 'next');
        } else if (targetIndex < currentSlide) {
            showSlide(targetIndex, 'prev');
        }
    });

    /* ==========================================================================
       3. ACORDEÓN INTERACTIVO DE PREGUNTAS FRECUENTES (FAQ)
       ========================================================================== */
    $('.faq-trigger').on('click', function() {
        const $trigger = $(this);
        const $item = $trigger.closest('.faq-item');
        const $content = $item.find('.faq-content');
        
        // Si el elemento clickeado ya está abierto, cerrarlo
        if ($item.hasClass('open')) {
            $content.slideUp(300);
            $item.removeClass('open');
        } else {
            // Cerrar otros elementos FAQ abiertos
            $('.faq-item.open').each(function() {
                const $openedItem = $(this);
                $openedItem.find('.faq-content').slideUp(300);
                $openedItem.removeClass('open');
            });
            
            // Abrir el elemento clickeado
            $content.slideDown(300);
            $item.addClass('open');
        }
    });

    /* ==========================================================================
       4. MODAL DIALOG (PRUEBA GRATUITA) & VALIDACIÓN DE FORMULARIO
       ========================================================================== */
    const $modal = $('#trial-modal');
    
    // Abrir Modal
    $('.open-modal-btn').on('click', function() {
        $modal.addClass('show');
        $body.css('overflow', 'hidden'); // Bloquear scroll del body
    });
    
    // Cerrar Modal
    function closeModal() {
        $modal.removeClass('show');
        $body.css('overflow', ''); // Restaurar scroll del body
        // Limpiar formulario y errores al cerrar
        $('#saas-trial-form')[0].reset();
        $('.modal-input').removeClass('invalid');
        $('.modal-error').hide();
        $('#m-status-success').hide();
    }
    
    $('#close-modal').on('click', closeModal);
    
    // Cerrar al hacer click fuera del contenedor del modal (en el fondo translúcido)
    $modal.on('click', function(event) {
        if ($(event.target).is('#trial-modal')) {
            closeModal();
        }
    });
    
    // Cerrar con la tecla Escape
    $(document).on('keydown', function(event) {
        if (event.key === 'Escape' && $modal.hasClass('show')) {
            closeModal();
        }
    });
    
    // VALIDACIÓN DEL FORMULARIO DEL MODAL (jQuery)
    const $trialForm = $('#saas-trial-form');
    
    // Auxiliar validar correos
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Validación interactiva individual al salir o escribir en los inputs
    $('.modal-input').on('blur input', function() {
        const $input = $(this);
        const id = $input.attr('id');
        const value = $input.val().trim();
        let isValid = true;
        
        if (id === 'modal-name') {
            isValid = value.length >= 3;
            $('#m-name-error').toggle(!isValid);
        } else if (id === 'modal-email') {
            isValid = isValidEmail(value);
            $('#m-email-error').toggle(!isValid);
        }
        
        $input.toggleClass('invalid', !isValid);
    });
    
    $('#modal-terms').on('change', function() {
        const isChecked = $(this).is(':checked');
        $('#m-terms-error').toggle(!isChecked);
    });

    // Envío del formulario del modal
    $trialForm.on('submit', function(event) {
        event.preventDefault();
        
        let isFormValid = true;
        
        // Validar nombre
        const nameVal = $('#modal-name').val().trim();
        if (nameVal.length < 3) {
            $('#modal-name').addClass('invalid');
            $('#m-name-error').show();
            isFormValid = false;
        } else {
            $('#modal-name').removeClass('invalid');
            $('#m-name-error').hide();
        }
        
        // Validar correo
        const emailVal = $('#modal-email').val().trim();
        if (!isValidEmail(emailVal)) {
            $('#modal-email').addClass('invalid');
            $('#m-email-error').show();
            isFormValid = false;
        } else {
            $('#modal-email').removeClass('invalid');
            $('#m-email-error').hide();
        }
        
        // Validar términos
        const termsChecked = $('#modal-terms').is(':checked');
        if (!termsChecked) {
            $('#m-terms-error').show();
            isFormValid = false;
        } else {
            $('#m-terms-error').hide();
        }
        
        const $successAlert = $('#m-status-success');
        const $submitBtn = $('#modal-submit-btn');
        
        if (isFormValid) {
            // Bloquear botón y simular envío
            $submitBtn.prop('disabled', true).text('Reservando...');
            
            setTimeout(function() {
                $submitBtn.prop('disabled', false).text('Confirmar Reserva de Mesa');
                $successAlert.slideDown(200);
                
                // Limpiar formulario
                $trialForm[0].reset();
                
                // Redirigir o cerrar modal tras 3 segundos
                setTimeout(function() {
                    closeModal();
                }, 3000);
                
            }, 1500);
        }
    });

});
