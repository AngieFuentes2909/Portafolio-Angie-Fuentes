/**
 * Calculadora de IMC - Lógica Interactiva (jQuery)
 */

$(document).ready(function() {

    // Selectores jQuery
    const $heightSlider = $('#height-slider');
    const $weightSlider = $('#weight-slider');
    const $heightVal = $('#height-val');
    const $weightVal = $('#weight-val');
    const $imcNumber = $('#imc-number');
    const $statusTitle = $('#imc-status-title');
    const $statusDesc = $('#imc-status-desc');
    const $pointer = $('#scale-pointer-arrow');
    const $circle = $('.imc-circle-display');

    // Función de cálculo y actualización
    function calculateIMC() {
        const heightCm = parseInt($heightSlider.val());
        const weightKg = parseInt($weightSlider.val());

        // Actualizar textos de valores de sliders
        $heightVal.text(heightCm);
        $weightVal.text(weightKg);

        // Fórmula IMC: Peso (kg) / (Estatura (m) * Estatura (m))
        const heightM = heightCm / 100;
        const imc = weightKg / (heightM * heightM);

        // Formatear a 1 decimal
        const formattedImc = imc.toFixed(1);
        $imcNumber.text(formattedImc);

        // Determinar categoría y posición de puntero en la escala
        let statusTitle = "";
        let statusDesc = "";
        let themeColor = "";
        let pointerPosition = ""; // Porcentaje de ancho

        if (imc < 18.5) {
            statusTitle = "Bajo Peso";
            statusDesc = "Tienes un peso por debajo del rango saludable. Es recomendable alimentarse balanceadamente.";
            themeColor = "var(--color-underweight)";
            pointerPosition = "12.5%";
        } else if (imc >= 18.5 && imc < 25.0) {
            statusTitle = "Peso Normal";
            statusDesc = "¡Excelente! Tienes un peso corporal saludable y equilibrado. Sigue cuidándote.";
            themeColor = "var(--color-normal)";
            pointerPosition = "37.5%";
        } else if (imc >= 25.0 && imc < 30.0) {
            statusTitle = "Sobrepeso";
            statusDesc = "Estás ligeramente por encima del peso recomendado. Buena alimentación y ejercicio te ayudarán.";
            themeColor = "var(--color-overweight)";
            pointerPosition = "62.5%";
        } else {
            statusTitle = "Obesidad";
            statusDesc = "Tu peso se encuentra en rango de obesidad. Te aconsejamos asesorarte con un profesional de la salud.";
            themeColor = "var(--color-obese)";
            pointerPosition = "87.5%";
        }

        // Aplicar cambios con jQuery
        $statusTitle.text(statusTitle).css('color', themeColor);
        $statusDesc.text(statusDesc);
        $circle.css('border-color', themeColor).css('box-shadow', `0 0 20px ${themeColor}40`);
        
        // Mover el puntero con animación CSS controlada por jQuery
        $pointer.css('left', pointerPosition);
    }

    // Escuchar eventos input en tiempo real en los sliders
    $heightSlider.on('input', calculateIMC);
    $weightSlider.on('input', calculateIMC);

    // Calcular al inicio
    calculateIMC();

});
