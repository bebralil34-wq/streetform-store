const defaultProducts=[
{id:'sf-001',name:'Runner 01 / Graphite',category:'sneakers',price:12900,color:'Graphite',tone:'dark',tag:'NEW'},
{id:'sf-002',name:'Court Low / Cream',category:'sneakers',price:11400,color:'Cream / Lime',tone:'lime',tag:'BESTSELLER'},
{id:'sf-003',name:'Heavyweight Hoodie',category:'apparel',price:8900,color:'Washed black',tone:'dark'},
{id:'sf-004',name:'Utility Cap / Orange',category:'accessories',price:3900,color:'Burnt orange',tone:'orange'},
{id:'sf-005',name:'Wide Denim 02',category:'apparel',price:9700,color:'Raw indigo',tone:'dark'},
{id:'sf-006',name:'Trail 02 / Bone',category:'sneakers',price:13900,color:'Bone / Black',tone:'orange',tag:'DROP 04'},
{id:'sf-007',name:'Logo Tee / Acid',category:'apparel',price:4500,color:'Acid green',tone:'lime'},
{id:'sf-008',name:'Crossbody Pack',category:'accessories',price:5900,color:'Black nylon',tone:'dark'}
];
let products=JSON.parse(localStorage.getItem('streetform-products')||'null')||defaultProducts;
let cart=JSON.parse(localStorage.getItem('streetform-cart')||'[]');
let activeCategory='all';let query='';
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const save=()=>{localStorage.setItem('streetform-products',JSON.stringify(products));localStorage.setItem('streetform-cart',JSON.stringify(cart));};
const grid=document.querySelector('#productGrid');
function productArt(p){return p.image?`<img src="${p.image}" alt="${p.name}" loading="lazy">`:`<div class="product-art">SF</div>`}
function renderProducts(){const filtered=products.filter(p=>(activeCategory==='all'||p.category===activeCategory||(activeCategory==='sale'&&p.price<6000))&&(!query||`${p.name} ${p.color} ${p.category}`.toLowerCase().includes(query.toLowerCase())));grid.innerHTML=filtered.map(p=>`<article class="product-card"><div class="product-image" data-tone="${p.tone||'dark'}">${p.tag?`<span class="product-tag">${p.tag}</span>`:''}${productArt(p)}</div><div class="product-info"><div><p class="product-name">${p.name}</p><small class="product-meta">${p.color}</small></div><span class="product-price">${money(p.price)}</span></div><button class="product-add" data-add="${p.id}">Добавить в bag +</button></article>`).join('');document.querySelector('#emptyState').hidden=filtered.length>0;}
function renderCart(){const count=cart.reduce((s,i)=>s+i.qty,0);document.querySelector('#cartCount').textContent=count;document.querySelector('#cartItemsLabel').textContent=`${count} ${count===1?'item':'items'}`;document.querySelector('#cartTotal').textContent=money(cart.reduce((s,i)=>s+i.price*i.qty,0));document.querySelector('#cartItems').innerHTML=cart.length?cart.map(i=>`<div class="cart-row"><div class="cart-thumb">SF</div><div><p>${i.name}</p><small>${money(i.price)}</small></div><div class="qty"><button data-qty="${i.id}" data-delta="-1">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-delta="1">+</button></div></div>`).join(''):'<p class="empty-state">Твоя bag пока пустая.</p>';}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...p,qty:1});save();renderCart();openCart();}
function openCart(){document.querySelector('#cartDrawer').classList.add('open');document.querySelector('#overlay').classList.add('open')}
function closeCart(){document.querySelector('#cartDrawer').classList.remove('open');document.querySelector('#overlay').classList.remove('open')}
function renderAdmin(){document.querySelector('#adminList').innerHTML=products.map(p=>`<div class="admin-row"><div>${p.name}<br><small>${p.category} · ${p.color}</small></div><input type="number" min="0" value="${p.price}" data-price="${p.id}"/><button class="delete-product" data-delete="${p.id}">Удалить</button></div>`).join('')}
document.querySelector('#categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;document.querySelectorAll('.filter-button').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeCategory=b.dataset.category;renderProducts()});
grid.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)addToCart(b.dataset.add)});
document.querySelector('#cartItems').addEventListener('click',e=>{const b=e.target.closest('[data-qty]');if(!b)return;const i=cart.find(x=>x.id===b.dataset.qty);i.qty+=Number(b.dataset.delta);if(i.qty<1)cart=cart.filter(x=>x.id!==i.id);save();renderCart()});
document.querySelector('#cartOpen').onclick=openCart;document.querySelector('#cartClose').onclick=closeCart;document.querySelector('#overlay').onclick=closeCart;
document.querySelector('#searchToggle').onclick=()=>{document.querySelector('#searchBar').classList.toggle('open');document.querySelector('#searchInput').focus()};document.querySelector('#searchInput').oninput=e=>{query=e.target.value;renderProducts()};
document.querySelector('#menuToggle').onclick=()=>document.querySelector('.main-nav').classList.toggle('open');
document.querySelector('#checkoutButton').onclick=()=>alert('Для приёма заказов подключи Telegram-бота или платёжную систему. Сейчас это демо-оформление.');
document.querySelector('#newsletterForm').onsubmit=e=>{e.preventDefault();document.querySelector('#newsletterMessage').textContent='Готово — проверяй почту для подтверждения.';e.target.reset()};
const dialog=document.querySelector('#adminDialog');document.querySelector('#adminOpen').onclick=()=>{renderAdmin();dialog.showModal()};
document.querySelector('#adminForm').onsubmit=e=>{e.preventDefault();const name=document.querySelector('#adminName').value.trim();const price=Number(document.querySelector('#adminPrice').value);if(!name||!price)return;products.unshift({id:'sf-'+Date.now(),name,price,category:document.querySelector('#adminCategory').value,color:document.querySelector('#adminColor').value||'New color',tone:'lime'});save();renderProducts();renderAdmin();e.target.reset()};
document.querySelector('#adminList').addEventListener('change',e=>{if(!e.target.dataset.price)return;const p=products.find(x=>x.id===e.target.dataset.price);p.price=Number(e.target.value);save();renderProducts();renderAdmin()});document.querySelector('#adminList').addEventListener('click',e=>{const b=e.target.closest('[data-delete]');if(!b)return;products=products.filter(x=>x.id!==b.dataset.delete);cart=cart.filter(x=>x.id!==b.dataset.delete);save();renderProducts();renderCart();renderAdmin()});document.querySelector('#adminReset').onclick=()=>{products=[...defaultProducts];save();renderProducts();renderAdmin()};
renderProducts();renderCart();
