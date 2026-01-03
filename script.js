let products = [
    {id: 1,name: "Laptop",price:50000,category: "Lab",stock: 15, description:"Apple Laptop"},
    {id:2,name: "Keyboard",price:500,category: "Lab",stock: 50, description:""},
    {id:3,name: "CPU",price:10000,category: "Hardware",stock:5,description: ""},
];
//table or card
let currentView = "table";
let searchTerm = "";
let currentPage = 1;
const pageSize = 5;
let editingId = null;

//DOM elements
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("search");
const toggleBtn = document.getElementById("toggleView");
const paginationDiv = document.getElementById("pagination");
const modal = document.getElementById("modal");
const form = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");
const cancelBtn = document.getElementById("cancelBtn");

//Render

function render() {
    //Filter by search
    let filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    //render products
    if(currentView === "table"){
        let html = `<table>
        <thead>
        <tr>
        <th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th>Action</th>
        </tr>
        </thead>
        <tbody>`;
        paginated.forEach(p => {
            html += `<tr>
            <td>${p.name}</td>
            <td>₹${p.price}</td>
            <td>${p.stock}</td>
            <td>${p.category}</td>
            <td><button onclick="editProduct(${p.id})">Edit</button></td>
            </tr>`;
        });
        html += `</tbody></table>`;
        productContainer.innerHTML = html;
    } 
    else{
        let html = `<div class="grid">`;
        paginated.forEach(p => {
            html += `<div class="card">
            <h3>${p.name}</h3>
            <p>Price: ₹${p.price}</p>
            <p>Category: ${p.category}</p>
            <p>Stock: ${p.stock}</p>
            <button onclick="editProduct(${p.id})">Edit</button>
            </div>`;
        });
        html += `</div>`;
        productContainer.innerHTML = html;
    }

    //render pagination
    let pagesHtml = "";
    for(let i = 1; i<=totalPages; i++){
        pagesHtml += `<button class="${currentPage===i?'active':''}" onclick="goPage(${i})">${i}</button>`;

    }
    paginationDiv.innerHTML = pagesHtml;

}

//Pagination
function goPage(page) {
    currentPage = page;
    render();
}

//Search with Debounce

let debounceTimer;
searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchTerm = searchInput.value;
        currentPage = 1;
        render();
    },500);
});

//Toggle View
toggleBtn.addEventListener("click", () => {
    currentView = currentView === "table" ? "card" : "table";
    toggleBtn.innerText = `Switch to ${currentView==='table'?'card':'table'} View`;
    render();

});

//Add / Edit
document.getElementById("addProductionBtn").addEventListener("click", () => {
    editingId = null;
    modalTitle.innerText = "Add Product";
    form.reset();
    modal.classList.remove("hidden");
});

function editProduct(id){
    editingId = id;
    const p = products.find(x => x.id === id);
    modalTitle.innerText = "Edit product";
    form.name.value = p.name;
    form.price.value = p.price;
    form.category.value = p.category;
    form.stock.value = p.stock;
    form.description.value = p.description;
    modal.classList.remove("hidden");
}

cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newData = {
        id: editingId || Date.now(),
        name: form.name.value,
        price: Number(form.price.value),
        category: form.category.value,
        stock: Number(form.stock.value),
        description: form.description.value
    };
    if(editingId){
        products = products.map(p => p.id===editingId ? newData : p);
    }
    else{
        products.push(newData);
    }
    modal.classList.add("hidden");
    render();
});

//initial render
render();

