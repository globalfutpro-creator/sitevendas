<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MegaShop - Os Melhores Produtos</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        :root {
            --primary: #6c63ff;
            --secondary: #ff6584;
            --dark: #2d2d2d;
            --light: #f5f5f5;
            --success: #4caf50;
            --card-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        /* ===== HEADER ===== */
        header {
            background: linear-gradient(135deg, var(--primary), #8b83ff);
            color: white;
            padding: 0 20px;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 0;
        }

        .logo {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
        }

        .logo span {
            color: var(--secondary);
        }

        nav ul {
            list-style: none;
            display: flex;
            gap: 25px;
        }

        nav ul li a {
            color: white;
            text-decoration: none;
            font-size: 15px;
            transition: color 0.3s;
        }

        nav ul li a:hover {
            color: var(--secondary);
        }

        .cart-btn {
            background: var(--secondary);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 15px;
            position: relative;
            transition: transform 0.2s, background 0.3s;
        }

        .cart-btn:hover {
            background: #e05573;
            transform: scale(1.05);
        }

        .cart-count {
            background: white;
            color: var(--primary);
            border-radius: 50%;
            padding: 2px 7px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 5px;
        }

        /* ===== BANNER ===== */
        .banner {
            background: linear-gradient(135deg, #2d2d2d, #4a4a4a);
            color: white;
            text-align: center;
            padding: 80px 20px;
        }

        .banner h1 {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .banner h1 span {
            color: var(--secondary);
        }

        .banner p {
            font-size: 18px;
            color: #ccc;
            margin-bottom: 30px;
        }

        .banner-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 30px;
            font-size: 18px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.3s;
            text-decoration: none;
            display: inline-block;
        }

        .banner-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(108, 99, 255, 0.4);
        }

        /* ===== CATEGORIAS ===== */
        .categories {
            background: var(--light);
            padding: 40px 20px;
        }

        .categories-content {
            max-width: 1200px;
            margin: 0 auto;
        }

        .section-title {
            font-size: 28px;
            color: var(--dark);
            margin-bottom: 25px;
            text-align: center;
        }

        .section-title span {
            color: var(--primary);
        }

        .cat-grid {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .cat-card {
            background: white;
            border-radius: 12px;
            padding: 20px 30px;
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.3s;
            box-shadow: var(--card-shadow);
            border: 2px solid transparent;
        }

        .cat-card:hover, .cat-card.active {
            transform: translateY(-5px);
            border-color: var(--primary);
            box-shadow: 0 8px 20px rgba(108,99,255,0.2);
        }

        .cat-card .icon {
            font-size: 35px;
            margin-bottom: 8px;
        }

        .cat-card p {
            font-size: 14px;
            color: var(--dark);
            font-weight: 600;
        }

        /* ===== PRODUTOS ===== */
        .products {
            padding: 60px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .filter-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            align-items: center;
            flex-wrap: wrap;
        }

        .filter-bar input {
            flex: 1;
            padding: 12px 20px;
            border: 2px solid #ddd;
            border-radius: 25px;
            font-size: 15px;
            outline: none;
            transition: border-color 0.3s;
        }

        .filter-bar input:focus {
            border-color: var(--primary);
        }

        .filter-bar select {
            padding: 12px 20px;
            border: 2px solid #ddd;
            border-radius: 25px;
            font-size: 15px;
            outline: none;
            cursor: pointer;
            background: white;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 25px;
        }

        .product-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: var(--card-shadow);
            transition: transform 0.3s, box-shadow 0.3s;
            position: relative;
        }

        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }

        .product-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            background: var(--secondary);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }

        .product-img {
            width: 100%;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 80px;
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
        }

        .product-info {
            padding: 20px;
        }

        .product-category {
            font-size: 12px;
            color: var(--primary);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .product-name {
            font-size: 18px;
            font-weight: bold;
            color: var(--dark);
            margin: 5px 0;
        }

        .product-desc {
            font-size: 13px;
            color: #888;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .product-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .product-price {
            font-size: 22px;
            font-weight: bold;
            color: var(--primary);
        }

        .product-price .old-price {
            font-size: 14px;
            color: #aaa;
            text-decoration: line-through;
            display: block;
            font-weight: normal;
        }

        .add-cart-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s, transform 0.2s;
        }

        .add-cart-btn:hover {
            background: #5a52e0;
            transform: scale(1.05);
        }

        .stars {
            color: #ffc107;
            font-size: 13px;
            margin-bottom: 10px;
        }

        /* ===== CARRINHO ===== */
        .cart-overlay {
            position: fixed;
            top: 0;
            right: -400px;
            width: 380px;
            height: 100%;
            background: white;
            box-shadow: -5px 0 20px rgba(0,0,0,0.2);
            z-index: 2000;
            transition: right 0.4s ease;
            display: flex;
            flex-direction: column;
        }

        .cart-overlay.open {
            right: 0;
        }

        .cart-header {
            background: var(--primary);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cart-header h3 {
            font-size: 20px;
        }

        .close-cart {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        }

        .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .cart-item {
            display: flex;
            gap: 15px;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }

        .cart-item-emoji {
            font-size: 40px;
        }

        .cart-item-info {
            flex: 1;
        }

        .cart-item-info h4 {
            font-size: 15px;
            color: var(--dark);
        }

        .cart-item-info p {
            color: var(--primary);
            font-weight: bold;
        }

        .cart-item-qty {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .qty-btn {
            background: var(--light);
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.2s;
        }

        .qty-btn:hover {
            background: var(--primary);
            color: white;
        }

        .remove-btn {
            background: none;
            border: none;
            color: var(--secondary);
            cursor: pointer;
            font-size: 18px;
        }

        .cart-footer {
            padding: 20px;
            border-top: 2px solid #eee;
        }

        .cart-total {
            font-size: 20px;
            font-weight: bold;
            color: var(--dark);
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
        }

        .checkout-btn {
            width: 100%;
            background: var(--success);
            color: white;
            border: none;
            padding: 15px;
            border-radius: 10px;
            font-size: 18px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .checkout-btn:hover {
            background: #388e3c;
        }

        .empty-cart {
            text-align: center;
            color: #aaa;
            padding: 40px 0;
        }

        .empty-cart p {
            font-size: 50px;
            margin-bottom: 10px;
        }

        /* ===== BACKDROP ===== */
        .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1500;
            display: none;
        }

        .backdrop.show {
            display: block;
        }

        /* ===== TOAST ===== */
        .toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: var(--success);
            color: white;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 16px;
            z-index: 3000;
            transition: transform 0.4s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .toast.show {
            transform: translateX(-50%) translateY(0);
        }

        /* ===== FOOTER ===== */
        footer {
            background: var(--dark);
            color: #ccc;
            text-align: center;
            padding: 40px 20px;
        }

        footer .footer-logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
        }

        footer .footer-logo span {
            color: var(--secondary);
        }

        footer p {
            font-size: 14px;
            margin-bottom: 5px;
        }

        footer .socials {
            font-size: 24px;
            margin: 15px 0;
            display: flex;
            justify-content: center;
            gap: 15px;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .banner h1 { font-size: 30px; }
            nav ul { display: none; }
            .cart-overlay { width: 100%; right: -100%; }
        }
    </style>
</head>
<body>

<!-- HEADER -->
<header>
    <div class="header-content">
        <div class="logo">Mega<span>Shop</span></div>
        <nav>
            <ul>
                <li><a href="#">Início</a></li>
                <li><a href="#">Produtos</a></li>
                <li><a href="#">Ofertas</a></li>
                <li><a href="#">Contato</a></li>
            </ul>
        </nav>
        <button class="cart-btn" onclick="toggleCart()">
            🛒 Carrinho <span class="cart-count" id="cartCount">0</span>
        </button>
    </div>
</header>

<!-- BANNER -->
<section class="banner">
    <h1>Bem-vindo ao <span>MegaShop</span>!</h1>
    <p>Produtos incríveis com os melhores preços do Brasil 🚀</p>
    <a href="#produtos" class="banner-btn">Ver Produtos</a>
</section>

<!-- CATEGORIAS -->
<section class="categories">
    <div class="categories-content">
        <h2 class="section-title">Explore por <span>Categorias</span></h2>
        <div class="cat-grid" id="catGrid">
            <div class="cat-card active" onclick="filterCategory('Todos', this)">
                <div class="icon">🏪</div>
                <p>Todos</p>
            </div>
            <div class="cat-card" onclick="filterCategory('Eletrônicos', this)">
                <div class="icon">📱</div>
                <p>Eletrônicos</p>
            </div>
            <div class="cat-card" onclick="filterCategory('Roupas', this)">
                <div class="icon">👕</div>
                <p>Roupas</p>
            </div>
            <div class="cat-card" onclick="filterCategory('Alimentos', this)">
                <div class="icon">🍕</div>
                <p>Alimentos</p>
            </div>
            <div class="cat-card" onclick="filterCategory('Esportes', this)">
                <div class="icon">⚽</div>
                <p>Esportes</p>
            </div>
            <div class="cat-card" onclick="filterCategory('Casa', this)">
                <div class="icon">🏠</div>
                <p>Casa</p>
            </div>
            <div class="cat-card" onclick="filterCategory('Brinquedos', this)">
                <div class="icon">🧸</div>
                <p>Brinquedos</p>
            </div>
        </div>
    </div>
</section>

<!-- PRODUTOS -->
<section class="products" id="produtos">
    <h2 class="section-title">Nossos <span>Produtos</span></h2>
    <div class="filter-bar">
        <input type="text" id="searchInput" placeholder="🔍 Buscar produto..." onkeyup="searchProducts()">
        <select id="sortSelect" onchange="sortProducts()">
            <option value="default">Ordenar por</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="name">Nome A-Z</option>
        </select>
    </div>
    <div class="products-grid" id="productsGrid"></div>
</section>

<!-- CARRINHO -->
<div class="backdrop" id="backdrop" onclick="toggleCart()"></div>
<div class="cart-overlay" id="cartOverlay">
    <div class="cart-header">
        <h3>🛒 Meu Carrinho</h3>
        <button class="close-cart" onclick="toggleCart()">✕</button>
    </div>
    <div class="cart-items" id="cartItems"></div>
    <div class="cart-footer">
        <div class="cart-total">
            <span>Total:</span>
            <span id="cartTotal">R$ 0,00</span>
        </div>
        <button class="checkout-btn" onclick="checkout()">✅ Finalizar Compra</button>
    </div>
</div>

<!-- TOAST -->
<div class="toast" id="toast"></div>

<!-- FOOTER -->
<footer>
    <div class="footer-logo">Mega<span>Shop</span></div>
    <div class="socials">
        <span>📘</span><span>📷</span><span>🐦</span><span>▶️</span>
    </div>
    <p>📍 Rua das Compras, 123 - São Paulo, SP</p>
    <p>📞 (11) 99999-9999 | ✉️ contato@megashop.com</p>
    <p style="margin-top:15px; font-size:12px;">© 2025 MegaShop. Todos os direitos reservados.</p>
</footer>

<script>
    // ===== PRODUTOS =====
    const allProducts = [
        { id: 1, name: "Smartphone Ultra X", category: "Eletrônicos", price: 1299.99, oldPrice: 1599.99, emoji: "📱", desc: "Câmera 108MP, 5G, bateria de longa duração.", stars: 5, badge: "Oferta" },
        { id: 2, name: "Notebook Pro 15", category: "Eletrônicos", price: 3499.00, oldPrice: 4200.00, emoji: "💻", desc: "Intel i7, 16GB RAM, SSD 512GB.", stars: 5, badge: "Top" },
        { id: 3, name: "Fone Bluetooth S3", category: "Eletrônicos", price: 199.90, oldPrice: 299.90, emoji: "🎧", desc: "Cancelamento de ruído, 40h de bateria.", stars: 4, badge: "Oferta" },
        { id: 4, name: "Smart TV 55\"", category: "Eletrônicos", price: 2199.00, oldPrice: 2800.00, emoji: "📺", desc: "4K UHD, HDR, Wi-Fi integrado.", stars: 5, badge: null },
        { id: 5, name: "Câmera DSLR Pro", category: "Eletrônicos", price: 4500.00, oldPrice: 5200.00, emoji: "📷", desc: "24MP, vídeo 4K, lente 18-55mm inclusa.", stars: 5, badge: "Top" },
        { id: 6, name: "Camiseta Estilosa", category: "Roupas", price: 79.90, oldPrice: 120.00, emoji: "👕", desc: "100% algodão, diversas cores disponíveis.", stars: 4, badge: null },
        { id: 7, name: "Jaqueta Jeans Premium", category: "Roupas", price: 249.90, oldPrice: 350.00, emoji: "🧥", desc: "Jeans de alta qualidade, corte slim.", stars: 4, badge: "Oferta" },
        { id: 8, name: "Tênis Runner Pro", category: "Roupas", price: 349.90, oldPrice: 499.90, emoji: "👟", desc: "Amortecimento extra, ideal para corrida.", stars: 5, badge: "Top" },
        { id: 9, name: "Boné Streetwear", category: "Roupas", price: 59.90, oldPrice: 89.90, emoji: "🧢", desc: "Ajustável, tecido respirável.", stars: 3, badge: null },
        { id: 10, name: "Pizza Congelada Gourmet", category: "Alimentos", price: 35.90, oldPrice: 45.90, emoji: "🍕", desc: "Sabores variados, massa artesanal.", stars: 4, badge: null },
        { id: 11, name: "Chocolate Belga Premium", category: "Alimentos", price: 28.50, oldPrice: 38.00, emoji: "🍫", desc: "70% cacau, caixa com 12 unidades.", stars: 5, badge: "Top" },
        { id: 12, name: "Cesta de Frutas Orgânicas", category: "Alimentos", price: 89.90, oldPrice: 110.00, emoji: "🍎", desc: "Frutas selecionadas, entrega semanal.", stars: 4, badge: "Oferta" },
        { id: 13, name: "Bola de Futebol Oficial", category: "Esportes", price: 149.90, oldPrice: 200.00, emoji: "⚽", desc: "Tamanho 5, certificação FIFA.", stars: 5, badge: null },
        { id: 14, name: "Halteres 10kg", category: "Esportes", price: 89.90, oldPrice: 130.00, emoji: "🏋️", desc: "Par de halteres emborrachados.", stars: 4, badge: "Oferta" },
        { id: 15, name: "Bicicleta Mountain Bike", category: "Esportes", price: 1899.00, oldPrice: 2500.00, emoji: "🚲", desc: "Aro 29, 21 marchas, freio disco.", stars: 5, badge: "Top" },
        { id: 16, name: "Sofá 3 Lugares Confort", category: "Casa", price: 1599.00, oldPrice: 2200.00, emoji: "🛋️", desc: "Tecido suede, estrutura em madeira maciça.", stars: 4, badge: "Oferta" },
        { id: 17, name: "Luminária LED Moderna", category: "Casa", price: 189.90, oldPrice: 250.00, emoji: "💡", desc: "Bivolt, 3 tons de luz, ajustável.", stars: 4, badge: null },
        { id: 18, name: "Panela Inox Premium", category: "Casa", price: 129.90, oldPrice: 180.00, emoji: "🍳", desc: "Fundo triplo, compatível com indução.", stars: 5, badge: "Top" },
        { id: 19, name: "LEGO Space Adventure", category: "Brinquedos", price: 299.90, oldPrice: 399.90, emoji: "🧱", desc: "450 peças, recomendado 8+ anos.", stars: 5, badge: "Top" },
        { id: 20, name: "Boneca Fashion Deluxe", category: "Brinquedos", price: 79.90, oldPrice: 110.00, emoji: "🪆", desc: "Acompanha 10 acessórios, 30cm.", stars: 4, badge: null },
        { id: 21, name: "Carrinho de Controle Turbo", category: "Brinquedos", price: 149.90, oldPrice: 200.00, emoji: "🚗", desc: "Alcance 30m, bateria recarregável.", stars: 5, badge: "Oferta" },
        { id: 22, name: "Relógio Smartwatch Elite", category: "Eletrônicos", price: 899.90, oldPrice: 1200.00, emoji: "⌚", desc: "GPS, monitor cardíaco, à prova d'água.", stars: 5, badge: "Top" },
        { id: 23, name: "Mochila Aventura 40L", category: "Esportes", price: 199.90, oldPrice: 280.00, emoji: "🎒", desc: "Impermeável, ergonômica, com suporte laptop.", stars: 4, badge: null },
        { id: 24, name: "Kit Churrasco Premium", category: "Casa", price: 259.90, oldPrice: 350.00, emoji: "🍖", desc: "8 peças em aço inox com maleta.", stars: 5, badge: "Oferta" },
    ];

    let cart = [];
    let filteredProducts = [...allProducts];
    let currentCategory = 'Todos';

    // ===== RENDERIZAR PRODUTOS =====
    function renderProducts(products) {
        const grid = document.getElementById('productsGrid');
        if (products.length === 0) {
            grid.innerHTML = '<div style="text-align:center;color:#aaa;font-size:18px;grid-column:1/-1;padding:40px">😕 Nenhum produto encontrado.</div>';
            return;
        }
        grid.innerHTML = products.map(p => `
            <div class="product-card">
                ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
                <div class="product-img">${p.emoji}</div>
                <div class="product-info">
                    <div class="product-category">${p.category}</div>
                    <div class="product-name">${p.name}</div>
                    <div class="stars">${'⭐'.repeat(p.stars)}</div>
                    <div class="product-desc">${p.desc}</div>
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="old-price">R$ ${p.oldPrice.toFixed(2).replace('.', ',')}</span>
                            R$ ${p.price.toFixed(2).replace('.', ',')}
                        </div>
                        <button class="add-cart-btn" onclick="addToCart(${p.id})">+ Comprar</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ===== FILTRAR POR CATEGORIA =====
    function filterCategory(category, el) {
        currentCategory = category;
        document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        applyFilters();
    }

    // ===== BUSCAR =====
    function searchProducts() {
        applyFilters();
    }

    // ===== ORDENAR =====
    function sortProducts() {
        applyFilters();
    }

    function applyFilters() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const sort = document.getElementById('sortSelect').value;

        let result = allProducts.filter(p => {
            const matchCat = currentCategory === 'Todos' || p.category === currentCategory;
            const matchSearch = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
            return matchCat && matchSearch;
        });

        if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
        else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
        else if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));

        renderProducts(result);
    }

    // ===== CARRINHO =====
    function addToCart(productId) {
        const product = allProducts.find(p => p.id === productId);
        const existing = cart.find(i => i.id === productId);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        updateCart();
        showToast(`✅ "${product.name}" adicionado ao carrinho!`);
    }

    function removeFromCart(
