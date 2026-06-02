/**
 * Conversor de Monedas - Lógica Dinámica (jQuery)
 */

$(document).ready(function() {

    // Tasas de cambio fijas para la simulación escolar (Base de conversión recíproca)
    const exchangeRates = {
        USD: { USD: 1.0,   EUR: 0.92,  COP: 4000.0, MXN: 17.50 },
        EUR: { USD: 1.09,  EUR: 1.0,   COP: 4350.0, MXN: 19.00 },
        COP: { USD: 0.00025, EUR: 0.00023, COP: 1.0,   MXN: 0.0044 },
        MXN: { USD: 0.057, EUR: 0.053, COP: 228.5,  MXN: 1.0 }
    };

    // Selectores jQuery
    const $form = $('#converter-form');
    const $amount = $('#amount');
    const $from = $('#from-currency');
    const $to = $('#to-currency');
    const $swapBtn = $('#btn-swap-currencies');
    const $resultContainer = $('#result-container');
    const $formulaText = $('#conversion-text-formula');
    const $resultText = $('#conversion-text-result');

    // Símbolos de monedas para la visualización formateada
    const currencySymbols = {
        USD: '$',
        EUR: '€',
        COP: '$',
        MXN: '$'
    };

    // Formateador numérico
    function formatCurrency(value, currency) {
        const decimals = currency === 'COP' ? 0 : 2;
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    }

    // Lógica de cálculo
    function calculateConversion() {
        const amountVal = parseFloat($amount.val());
        
        // Validación de entrada
        if (isNaN(amountVal) || amountVal <= 0) {
            $amount.addClass('invalid');
            $('#amount-error').show();
            $resultContainer.slideUp(200);
            return;
        } else {
            $amount.removeClass('invalid');
            $('#amount-error').hide();
        }

        const fromVal = $from.val();
        const toVal = $to.val();

        // Calcular
        const rate = exchangeRates[fromVal][toVal];
        const convertedValue = amountVal * rate;

        // Formatear textos
        const formattedAmount = formatCurrency(amountVal, fromVal);
        const formattedResult = formatCurrency(convertedValue, toVal);
        
        const formulaVal = `1 ${fromVal} = ${rate} ${toVal}`;

        // Mostrar con animación jQuery
        $formulaText.text(formulaVal);
        $resultText.text(formattedResult);
        
        if ($resultContainer.is(':hidden')) {
            $resultContainer.slideDown(300);
        }
    }

    // Evento Submit
    $form.on('submit', function(event) {
        event.preventDefault();
        calculateConversion();
    });

    // Evento Swap (Intercambio de monedas)
    $swapBtn.on('click', function() {
        const tempFrom = $from.val();
        const tempTo = $to.val();

        $from.val(tempTo);
        $to.val(tempFrom);

        // Si ya hay resultados visibles, recalcular inmediatamente
        if ($resultContainer.is(':visible')) {
            calculateConversion();
        }
    });

    // Limpiar alertas de error al escribir
    $amount.on('input', function() {
        const val = parseFloat($(this).val());
        if (!isNaN(val) && val > 0) {
            $amount.removeClass('invalid');
            $('#amount-error').hide();
        }
    });

    // Calcular conversión inicial
    calculateConversion();

});
