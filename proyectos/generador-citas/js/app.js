/**
 * Generador de Citas - Lógica Dinámica (jQuery)
 */

$(document).ready(function() {

    // Lista de citas célebres académicas, inspiradoras o de programación
    const quotes = [
        {
            text: "La mejor forma de predecir el futuro es creándolo.",
            author: "Peter Drucker"
        },
        {
            text: "No te preocupes si no funciona bien. Si todo funcionara bien, estarías despedido.",
            author: "Ley de Mosher"
        },
        {
            text: "El único modo de hacer un gran trabajo es amar lo que haces.",
            author: "Steve Jobs"
        },
        {
            text: "Los ordenadores son buenos siguiendo instrucciones, pero no leyendo tu mente.",
            author: "Donald Knuth"
        },
        {
            text: "La simplicidad es la máxima sofisticación.",
            author: "Leonardo da Vinci"
        },
        {
            text: "Hazlo simple, tan simple como sea posible, pero no más.",
            author: "Albert Einstein"
        },
        {
            text: "El software es una gran combinación entre arte y ciencia.",
            author: "Bill Gates"
        },
        {
            text: "Primero, resuelve el problema. Entonces, escribe el código.",
            author: "John Johnson"
        }
    ];

    // Selectores jQuery
    const $quoteBox = $('#quote-box');
    const $quoteText = $('#quote-text-content');
    const $quoteAuthor = $('#quote-author-content');
    const $newQuoteBtn = $('#btn-new-quote');
    const $copyQuoteBtn = $('#btn-copy-quote');
    const $copyToast = $('#copy-toast-message');

    let currentQuoteIndex = 0;

    // Función para obtener índice aleatorio sin repetir el actual
    function getRandomIndex() {
        let newIndex = Math.floor(Math.random() * quotes.length);
        while (newIndex === currentQuoteIndex) {
            newIndex = Math.floor(Math.random() * quotes.length);
        }
        return newIndex;
    }

    // Cambiar cita con efecto desvanecimiento jQuery
    function changeQuote() {
        const nextIndex = getRandomIndex();
        currentQuoteIndex = nextIndex;
        const nextQuote = quotes[nextIndex];

        // Efecto Fade Out y Fade In en la caja
        $quoteBox.fadeOut(300, function() {
            $quoteText.text(`"${nextQuote.text}"`);
            $quoteAuthor.text(`— ${nextQuote.author}`);
            $quoteBox.fadeIn(300);
        });
    }

    // Copiar cita al portapapeles
    function copyQuoteToClipboard() {
        const quoteString = `${$quoteText.text()} ${$quoteAuthor.text()}`;
        
        navigator.clipboard.writeText(quoteString).then(function() {
            // Mostrar Toast de confirmación con jQuery
            $copyToast.addClass('show');
            
            // Ocultar tras 2 segundos
            setTimeout(function() {
                $copyToast.removeClass('show');
            }, 2000);
        }).catch(function() {
            alert("No se pudo copiar el texto. Intenta seleccionarlo manualmente.");
        });
    }

    // Escuchadores de eventos
    $newQuoteBtn.on('click', changeQuote);
    $copyQuoteBtn.on('click', copyQuoteToClipboard);

    // Carga de la cita inicial aleatoria
    changeQuote();

});
