let cart = JSON.parse(localStorage.getItem("cart")) || [];


// -----------------------------
// CART COUNT
// -----------------------------

const cartLink = document.getElementById("cart-link");

function updateCartCount() {

    let totalItems = 0;

    cart.forEach(function(item) {
        totalItems += item.quantity;
    });

    if (cartLink) {
        cartLink.textContent = "Cart (" + totalItems + ")";
    }
}


// -----------------------------
// ADD TO CART
// -----------------------------

const cartButtons = document.querySelectorAll(".product-card button");

cartButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const productCard = button.closest(".product-card");

        const productName = productCard.dataset.name;
        const productPrice = Number(productCard.dataset.price);

        const existingProduct = cart.find(function(item) {
            return item.name === productName;
        });

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });

        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

        alert(productName + " added to cart!");

    });

});


// -----------------------------
// DISPLAY CART ITEMS
// -----------------------------

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");

if (cartItemsContainer && cartTotalElement) {

    let total = 0;

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <p>Your cart is empty.</p>
        `;

    } else {

        cart.forEach(function(item) {

            const itemTotal = item.price * item.quantity;

            total += itemTotal;

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `
    <div>
        <h3>${item.name}</h3>

        <p>Price: ₹${item.price.toLocaleString("en-IN")}</p>

        <div class="quantity-controls">

            <button class="quantity-btn" onclick="changeQuantity('${item.name}', -1)">
                −
            </button>

            <span>${item.quantity}</span>

            <button class="quantity-btn" onclick="changeQuantity('${item.name}', 1)">
                +
            </button>

            <button class="remove-btn" onclick="removeItem('${item.name}')">
                Remove
            </button>

        </div>
    </div>

    <h3>₹${itemTotal.toLocaleString("en-IN")}</h3>
`;

            cartItemsContainer.appendChild(cartItem);

        });

    }

    cartTotalElement.textContent = total.toLocaleString("en-IN");
}


// Update cart count
updateCartCount();

// Increase or decrease quantity

function changeQuantity(productName, change) {

    const product = cart.find(function(item) {
        return item.name === productName;
    });

    if (!product) {
        return;
    }

    product.quantity += change;

    if (product.quantity <= 0) {

        cart = cart.filter(function(item) {
            return item.name !== productName;
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();
}


// Remove product from cart

function removeItem(productName) {

    cart = cart.filter(function(item) {
        return item.name !== productName;
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();
}
function goToCheckout() {
    window.location.href = "checkout.html";
}
// -----------------------------
// CHECKOUT PAGE
// -----------------------------

const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");

if (checkoutItems && checkoutTotal) {

    let total = 0;

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>Your cart is empty.</p>
        `;

    } else {

        cart.forEach(function(item) {

            const itemTotal = item.price * item.quantity;

            total += itemTotal;

            const checkoutItem = document.createElement("div");

            checkoutItem.innerHTML = `
                <div class="checkout-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Quantity: ${item.quantity}</p>
                    </div>

                    <strong>
                        ₹${itemTotal.toLocaleString("en-IN")}
                    </strong>
                </div>
            `;

            checkoutItems.appendChild(checkoutItem);

        });
    }

    checkoutTotal.textContent =
        total.toLocaleString("en-IN");
}
// -----------------------------
// PLACE ORDER
// -----------------------------

const placeOrderButton = document.getElementById("place-order");

if (placeOrderButton) {

    placeOrderButton.addEventListener("click", function() {

        const name = document.getElementById("customer-name").value.trim();
        const email = document.getElementById("customer-email").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const address = document.getElementById("customer-address").value.trim();
        const payment = document.getElementById("payment-method").value;

        if (name === "" || email === "" || phone === "" || address === "" || payment === "") {

            alert("Please fill all customer details.");

            return;
        }

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }

        const orderId =
            "ORD" + Math.floor(100000 + Math.random() * 900000);

        alert(
            "🎉 Order Placed Successfully!\n\n" +
            "Order ID: " + orderId + "\n" +
            "Customer: " + name + "\n" +
            "Payment: " + payment
        );
        const orders = JSON.parse(localStorage.getItem("orders")) || [];

const newOrder = {
    orderId: orderId,
    customer: name,
    email: email,
    phone: phone,
    address: address,
    payment: payment,
    total: cart.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0),
    status: "Order Placed",
    date: new Date().toLocaleString()
};

orders.push(newOrder);

localStorage.setItem("orders", JSON.stringify(orders));

        // Clear cart after successful order
        localStorage.removeItem("cart");

        window.location.href = "index.html";

    });
}
// -----------------------------
// DISPLAY ORDERS
// -----------------------------

const ordersContainer = document.getElementById("orders-container");

if (ordersContainer) {

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length === 0) {

        ordersContainer.innerHTML = `
            <div class="no-orders">
                <h3>No Orders Found</h3>
                <p>You have not placed any orders yet.</p>
            </div>
        `;

    } else {

        ordersContainer.innerHTML = "";

        orders.forEach(function(order) {

            const orderCard = document.createElement("div");

            orderCard.className = "order-card";

            orderCard.innerHTML = `
                <div class="order-header">
                    <h3>Order ID: ${order.orderId}</h3>
                    <span>${order.status}</span>
                </div>

                <p><strong>Customer:</strong> ${order.customer}</p>

                <p><strong>Email:</strong> ${order.email}</p>

                <p><strong>Payment:</strong> ${order.payment}</p>

                <p><strong>Date:</strong> ${order.date}</p>

                <h3>
                    Total: ₹${order.total.toLocaleString("en-IN")}
                </h3>
            `;

            ordersContainer.appendChild(orderCard);

        });
    }
}
// -----------------------------
// ADMIN DASHBOARD
// -----------------------------

const totalOrdersElement = document.getElementById("total-orders");
const totalSalesElement = document.getElementById("total-sales");
const adminOrdersContainer = document.getElementById("admin-orders");

if (totalOrdersElement && totalSalesElement && adminOrdersContainer) {

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    totalOrdersElement.textContent = orders.length;

    let totalSales = 0;

    orders.forEach(function(order) {
        totalSales += Number(order.total);
    });

    totalSalesElement.textContent =
        "₹" + totalSales.toLocaleString("en-IN");

    if (orders.length === 0) {

        adminOrdersContainer.innerHTML = `
            <p>No orders available.</p>
        `;

    } else {

        adminOrdersContainer.innerHTML = "";

        orders.forEach(function(order) {

            const orderCard = document.createElement("div");

            orderCard.className = "order-card";

            orderCard.innerHTML = `
                <div class="order-header">
                    <h3>Order ID: ${order.orderId}</h3>
                    <select onchange="updateOrderStatus('${order.orderId}', this.value)">

    <option value="Order Placed"
        ${order.status === "Order Placed" ? "selected" : ""}>
        Order Placed
    </option>

    <option value="Processing"
        ${order.status === "Processing" ? "selected" : ""}>
        Processing
    </option>

    <option value="Shipped"
        ${order.status === "Shipped" ? "selected" : ""}>
        Shipped
    </option>

    <option value="Delivered"
        ${order.status === "Delivered" ? "selected" : ""}>
        Delivered
    </option>

</select>
                </div>

                <p><strong>Customer:</strong> ${order.customer}</p>

                <p><strong>Payment:</strong> ${order.payment}</p>

                <p><strong>Date:</strong> ${order.date}</p>

                <h3>
                    Total: ₹${Number(order.total).toLocaleString("en-IN")}
                </h3>
            `;

            adminOrdersContainer.appendChild(orderCard);

        });
    }
}
// -----------------------------
// LOGIN
// -----------------------------

const loginButton = document.getElementById("login-button");

if (loginButton) {

    loginButton.addEventListener("click", function() {

        const email =
            document.getElementById("login-email").value.trim();

        const password =
            document.getElementById("login-password").value.trim();

        const message =
            document.getElementById("login-message");

        if (email === "" || password === "") {

            message.textContent =
                "Please enter email and password.";

            return;
        }

        message.textContent = "Login successful!";
message.style.color = "green";

setTimeout(function() {
    window.location.href = "admin.html";
}, 1000);

    });
}
// -----------------------------
// UPDATE ORDER STATUS
// -----------------------------

function updateOrderStatus(orderId, newStatus) {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.forEach(function(order) {

        if (order.orderId === orderId) {
            order.status = newStatus;
        }

    });

    localStorage.setItem("orders", JSON.stringify(orders));

    location.reload();
}