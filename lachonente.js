
let currentUser = null;
let order = [];
let total = 0;

const menuItems = [
    { id: "1", name: "Hambúrguer", price: 12.50 },
    { id: "2", name: "Cachorro Quente", price: 8.00 },
    { id: "3", name: "Batata Frita", price: 5.00 },
    { id: "4", name: "Refrigerante", price: 4.00 },
    { id: "5", name: "Suco Natural", price: 6.00 },
];

const users = JSON.parse(localStorage.getItem("users")) || {};

document.addEventListener("DOMContentLoaded", () => {
    displayMenu();
});

function toggleForm() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
}

function displayMenu() {
    const menuContainer = document.getElementById("menu-items");
    menuItems.forEach(item => {
        const menuItemDiv = document.createElement("div");
        menuItemDiv.classList.add("menu-item");
        menuItemDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>R$ ${item.price.toFixed(2)}</p>
            <button onclick="addToOrder(${item.id})">Adicionar ao pedido</button>
        `;
        menuContainer.appendChild(menuItemDiv);
    });
}

function addToOrder(itemId) {
    const item = menuItems.find(item => item.id == itemId);
    order.push(item);
    total += item.price;
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderSummary = document.getElementById("order-summary");
    orderSummary.innerHTML = "";
    order.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `${item.name} - R$ ${item.price.toFixed(2)}`;
        orderSummary.appendChild(itemDiv);
    });
    document.getElementById("total-price").textContent = total.toFixed(2);
}

function finalizeOrder() {
    document.getElementById("menu-section").style.display = "none";
    document.getElementById("order-section").style.display = "block";
}

function pay() {
    const paymentMethod = document.getElementById("payment-method").value;
    if (paymentMethod === "saldo") {
        if (currentUser.balance >= total) {
            currentUser.balance -= total;
            alert(`Pagamento de R$ ${total.toFixed(2)} realizado com sucesso com saldo em conta!`);
        } else {
            alert("Saldo insuficiente.");
        }
    } else if (paymentMethod === "credit-card") {
        alert(`Pagamento de R$ ${total.toFixed(2)} realizado com sucesso no cartão de crédito!`);
    } else if (paymentMethod === "cash") {
        const cashReceived = parseFloat(prompt("Digite o valor em dinheiro recebido:"));
        if (cashReceived >= total) {
            const change = cashReceived - total;
            alert(`Pagamento realizado com sucesso! Troco: R$ ${change.toFixed(2)}`);
        } else {
            alert("Valor insuficiente.");
        }
    } else {
        alert("Forma de pagamento inválida.");
    }
    localStorage.setItem("users", JSON.stringify(users));
}

document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (users[username] && users[username].password === password) {
        currentUser = users[username];
        alert("Login bem-sucedido!");
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("menu-section").style.display = "block";
    } else {
        alert("Usuário ou senha incorretos.");
    }
});

document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newUsername = document.getElementById("new-username").value;
    const newPassword = document.getElementById("new-password").value;
    if (users[newUsername]) {
        alert("Usuário já existe.");
    } else {
        users[newUsername] = { password: newPassword, balance: 0, orders: [] };
        localStorage.setItem("
