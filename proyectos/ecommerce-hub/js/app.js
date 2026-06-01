/**
 * Ferretería Ferremar - Catálogo Interactivo & Carrito de Pedidos (jQuery)
 */

$(document).ready(function() {

    /* ==========================================================================
       1. CATÁLOGO DE PRODUCTOS DE FERRETERÍA (EN MEMORIA)
       ========================================================================== */
    const products = [
        {
            id: 1,
            name: "Taladro Percutor Profesional 650W",
            category: "herramientas",
            price: 89,
            oldPrice: null,
            rating: 4.8,
            reviews: 145,
            icon: "fa-screwdriver-wrench",
            tag: "2 Años de Garantía"
        },
        {
            id: 2,
            name: "Rollo Cable de Cobre #12 (100m)",
            category: "electricidad",
            price: 59,
            oldPrice: 79,
            rating: 4.7,
            reviews: 98,
            icon: "fa-bolt-lightning",
            tag: "Certificado RETIE"
        },
        {
            id: 3,
            name: "Bolsa de Cemento Estructural 50kg",
            category: "construccion",
            price: 15,
            oldPrice: null,
            rating: 4.5,
            reviews: 212,
            icon: "fa-cubes",
            tag: "Alta Resistencia"
        },
        {
            id: 4,
            name: "Tubo de Presión PVC 1/2 (6 metros)",
            category: "plomeria",
            price: 9,
            oldPrice: 12,
            rating: 4.9,
            reviews: 320,
            icon: "fa-lines-leaning",
            tag: "RDE 21 Calidad"
        },
        {
            id: 5,
            name: "Reflector LED Exterior Smart 100W",
            category: "electricidad",
            price: 29,
            oldPrice: 39,
            rating: 4.6,
            reviews: 78,
            icon: "fa-lightbulb",
            tag: "IP66 Impermeable"
        },
        {
            id: 6,
            name: "Juego de Llaves Inglesas (6 pzas)",
            category: "herramientas",
            price: 45,
            oldPrice: null,
            rating: 4.3,
            reviews: 165,
            icon: "fa-wrench",
            tag: "Acero Cromo Vanadio"
        },
        {
            id: 7,
            name: "Interruptor Inteligente Wifi 3 Teclas",
            category: "electricidad",
            price: 19,
            oldPrice: null,
            rating: 4.4,
            reviews: 87,
            icon: "fa-network-wired",
            tag: "Smart Home"
        },
        {
            id: 8,
            name: "Grifería Mezcladora para Lavamanos",
            category: "plomeria",
            price: 79,
            oldPrice: 99,
            rating: 4.7,
            reviews: 114,
            icon: "fa-faucet",
            tag: "Ahorro de Agua"
        }
    ];

    /* ==========================================================================
       2. ESTADO DE LA APLICACIÓN (CARRITO DE COMPRAS)
       ========================================================================== */
    let cart = [];

    // Selectores jQuery
    const $catalog = $('#products-catalog');
    const $search = $('#product-search');
    const $priceSlider = $('#price-slider');
    const $sliderVal = $('#slider-price-val');
    const $sortSelect = $('#sort-order');
    const $resultsCount = $('#results-count');
    const $noResults = $('#no-results-message');
    const $btnReset = $('#btn-reset-filters');
    
    const $cartDrawer = $('#cart-drawer-backdrop');
    const $cartToggle = $('#cart-toggle');
    const $closeCart = $('#close-cart');
    const $cartItemsWrapper = $('#cart-items-wrapper');
    const $cartEmptyState = $('#cart-empty-state');
    const $cartSummaryFooter = $('#cart-summary-footer');
    const $cartCounter = $('#cart-counter');
    const $cartTotalQty = $('#cart-total-qty');
    const $cartSubtotal = $('#cart-subtotal');
    const $cartTotal = $('#cart-total');
    
    const $checkoutBtn = $('#checkout-btn');
    const $checkoutModal = $('#checkout-modal');
    const $successCloseBtn = $('#success-close-btn');

    /* ==========================================================================
       3. FUNCIONES DE RENDERIZADO DEL CATÁLOGO
       ========================================================================== */
    function renderCatalog() {
        const searchQuery = $search.val().toLowerCase().trim();
        const activeCategory = $('.category-item.active').data('category');
        const maxPrice = parseInt($priceSlider.val());
        const sortOrder = $sortSelect.val();

        // 1. Filtrar Productos
        let filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery);
            const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
            const matchesPrice = product.price <= maxPrice;
            
            return matchesSearch && matchesCategory && matchesPrice;
        });

        // 2. Ordenar Productos
        if (sortOrder === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        // 3. Limpiar catálogo actual
        $catalog.empty();

        // 4. Mostrar u ocultar mensaje de "Sin Resultados"
        if (filteredProducts.length === 0) {
            $noResults.show();
            $resultsCount.text("Mostrando 0 materiales");
        } else {
            $noResults.hide();
            $resultsCount.text(`Mostrando ${filteredProducts.length} materiales`);

            // 5. Renderizar tarjetas de productos
            filteredProducts.forEach(product => {
                const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
                
                let ratingStars = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= Math.floor(product.rating)) {
                        ratingStars += '<i class="fa-solid fa-star"></i>';
                    } else if (i - 0.5 === product.rating) {
                        ratingStars += '<i class="fa-solid fa-star-half-stroke"></i>';
                    } else {
                        ratingStars += '<i class="fa-regular fa-star"></i>';
                    }
                }

                const cardHtml = `
                    <article class="product-card">
                        <div class="card-img-container">
                            ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                            <i class="fa-solid ${product.icon} card-visual-icon"></i>
                        </div>
                        <div class="card-body">
                            <span class="card-category">${product.category}</span>
                            <h3 class="card-title">${product.name}</h3>
                            <div class="card-rating">
                                ${ratingStars}
                                <span>(${product.reviews})</span>
                            </div>
                            <div class="card-price-row">
                                <span class="card-price">$${product.price}</span>
                                ${product.oldPrice ? `<span class="card-old-price">$${product.oldPrice}</span>` : ''}
                            </div>
                            <button class="btn btn-primary btn-add-cart" data-id="${product.id}">
                                <i class="fa-solid fa-cart-plus"></i> Añadir a Pedido
                            </button>
                        </div>
                    </article>
                `;
                
                $catalog.append(cardHtml);
            });
        }
    }

    /* ==========================================================================
       4. CONTROL DE FILTROS EN TIEMPO REAL
       ========================================================================== */
    $search.on('input', renderCatalog);

    $('.category-item').on('click', function() {
        $('.category-item').removeClass('active');
        $(this).addClass('active');
        renderCatalog();
    });

    $priceSlider.on('input', function() {
        const val = $(this).val();
        $sliderVal.text(`$${val}`);
        renderCatalog();
    });

    $sortSelect.on('change', renderCatalog);

    $btnReset.on('click', function() {
        $search.val('');
        $('.category-item').removeClass('active');
        $('.category-item[data-category="all"]').addClass('active');
        $priceSlider.val(300);
        $sliderVal.text('$300');
        $sortSelect.val('default');
        renderCatalog();
    });

    /* ==========================================================================
       5. INTERACTIVIDAD DEL MINI-CARRITO (jQuery Drawer)
       ========================================================================== */
    $cartToggle.on('click', function() {
        $cartDrawer.addClass('show');
        $('body').css('overflow', 'hidden');
    });

    function closeCartDrawer() {
        $cartDrawer.removeClass('show');
        $('body').css('overflow', '');
    }

    $closeCart.on('click', closeCartDrawer);
    $('#btn-start-shopping').on('click', closeCartDrawer);

    $cartDrawer.on('click', function(event) {
        if ($(event.target).is('#cart-drawer-backdrop')) {
            closeCartDrawer();
        }
    });

    /* ==========================================================================
       6. LÓGICA Y EVENTOS DEL CARRITO DE COMPRAS
       ========================================================================== */
    $(document).on('click', '.btn-add-cart', function() {
        const prodId = parseInt($(this).data('id'));
        const product = products.find(p => p.id === prodId);
        
        if (product) {
            const existingItem = cart.find(item => item.product.id === prodId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ product: product, quantity: 1 });
            }
            
            updateCart();
            
            $cartDrawer.addClass('show');
            $('body').css('overflow', 'hidden');
            
            $cartCounter.addClass('animated-bounce');
            setTimeout(() => {
                $cartCounter.removeClass('animated-bounce');
            }, 300);
        }
    });

    $(document).on('click', '.remove-item-btn', function() {
        const prodId = parseInt($(this).data('id'));
        cart = cart.filter(item => item.product.id !== prodId);
        updateCart();
    });

    $(document).on('click', '.qty-btn.plus', function() {
        const prodId = parseInt($(this).data('id'));
        const item = cart.find(i => i.product.id === prodId);
        if (item) {
            item.quantity += 1;
            updateCart();
        }
    });

    $(document).on('click', '.qty-btn.minus', function() {
        const prodId = parseInt($(this).data('id'));
        const item = cart.find(i => i.product.id === prodId);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            updateCart();
        }
    });

    function updateCart() {
        let totalItems = 0;
        let subtotal = 0;
        
        $cartItemsWrapper.empty();
        
        if (cart.length === 0) {
            $cartEmptyState.show();
            $cartSummaryFooter.hide();
            $cartCounter.text(0);
            $cartTotalQty.text(0);
        } else {
            $cartEmptyState.hide();
            $cartSummaryFooter.show();
            
            cart.forEach(item => {
                totalItems += item.quantity;
                subtotal += (item.product.price * item.quantity);
                
                const itemHtml = `
                    <div class="cart-item">
                        <div class="cart-item-img">
                            <i class="fa-solid ${item.product.icon}"></i>
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.product.name}</h4>
                            <span class="cart-item-price">$${item.product.price}</span>
                        </div>
                        <div class="cart-item-actions">
                            <div class="qty-controls">
                                <button class="qty-btn minus" data-id="${item.product.id}"><i class="fa-solid fa-minus"></i></button>
                                <span class="qty-val">${item.quantity}</span>
                                <button class="qty-btn plus" data-id="${item.product.id}"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <button class="remove-item-btn" data-id="${item.product.id}">
                                <i class="fa-regular fa-trash-can"></i> Quitar
                            </button>
                        </div>
                    </div>
                `;
                
                $cartItemsWrapper.append(itemHtml);
            });
            
            $cartCounter.text(totalItems);
            $cartTotalQty.text(totalItems);
            
            const formattedTotal = `$${subtotal.toFixed(2)}`;
            $cartSubtotal.text(formattedTotal);
            $cartTotal.text(formattedTotal);
        }
    }

    /* ==========================================================================
       7. CHECKOUT Y DIÁLOGO MODAL
       ========================================================================== */
    $checkoutBtn.on('click', function() {
        closeCartDrawer();
        $checkoutBtn.prop('disabled', true).html('Procesando... <i class="fa-solid fa-spinner fa-spin"></i>');
        
        setTimeout(function() {
            $checkoutBtn.prop('disabled', false).html('Confirmar Cotización <i class="fa-solid fa-chevron-right"></i>');
            cart = [];
            updateCart();
            $checkoutModal.addClass('show');
        }, 1500);
    });

    $successCloseBtn.on('click', function() {
        $checkoutModal.removeClass('show');
    });

    $checkoutModal.on('click', function(event) {
        if ($(event.target).is('#checkout-modal')) {
            $checkoutModal.removeClass('show');
        }
    });

    /* ==========================================================================
       8. INICIALIZAR
       ========================================================================== */
    renderCatalog();
    updateCart();
    
});
