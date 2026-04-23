// Waits until the HTML document is fully loaded before running JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const cartCountEl = document.getElementById("cartCount");

  // Store quantities per product-id
  const cart = {}; // e.g. { "seafood-soy-sauce": 2 }

  // Update Card Button to show total number of items
  const updateCartBadge = () => {
    const total = Object.values(cart).reduce((sum, n) => sum + n, 0);
    if (cartCountEl) cartCountEl.textContent = total;
  };

  // Replace "add to cart" button with a quantity stepper
  const renderStepper = (slotEl, productId, qty) => {
    if (!slotEl) return;
    slotEl.classList.add("cs-has-stepper");
    slotEl.innerHTML = `
      <div class="cs-qty-stepper" data-product-id="${productId}">
        <button type="button" class="cs-qty-btn cs-qty-minus" aria-label="Decrease quantity">−</button>
        <div class="cs-qty-num" aria-label="Quantity">${qty}</div>
        <button type="button" class="cs-qty-btn cs-qty-plus" aria-label="Increase quantity">+</button>
      </div>
    `;
  };

  // Bring back the "add to cart" button if quantity is 0
  const renderAddButton = (slotEl, productId) => {
    if (!slotEl) return;
    slotEl.classList.remove("cs-has-stepper");
    slotEl.innerHTML = `
      <button class="cs-buy" type="button" data-product-id="${productId}">
        Add to cart
      </button>
    `;
  };

  document.addEventListener("click", (e) => {
    const isCartControl =
      e.target.closest(".cs-buy") ||
      e.target.closest(".cs-qty-minus") ||
      e.target.closest(".cs-qty-plus");


    if (isCartControl) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 1) Add to cart clicked
    const addBtn = e.target.closest(".cs-buy");
    if (addBtn) {
      const productId = addBtn.dataset.productId;
      if (!productId) return;

      cart[productId] = (cart[productId] || 0) + 1;

      const slotEl = addBtn.closest(".cs-cart-slot");
      renderStepper(slotEl, productId, cart[productId]);

      updateCartBadge();
      return;
    }

    // 2) Plus clicked
    const plusBtn = e.target.closest(".cs-qty-plus");
    if (plusBtn) {
      const stepper = plusBtn.closest(".cs-qty-stepper");
      const productId = stepper?.dataset.productId;
      if (!productId) return;

      cart[productId] = (cart[productId] || 0) + 1;

      const numEl = stepper.querySelector(".cs-qty-num");
      if (numEl) numEl.textContent = cart[productId];

      updateCartBadge();
      return;
    }

    // 3) Minus clicked
    const minusBtn = e.target.closest(".cs-qty-minus");
    if (minusBtn) {
      const stepper = minusBtn.closest(".cs-qty-stepper");
      const productId = stepper?.dataset.productId;
      if (!productId) return;

      cart[productId] = (cart[productId] || 0) - 1;

      // go back to the same slot container
      const slotEl = stepper.closest(".cs-cart-slot");

      // if quantity reaches 0, remove item and restore the "add to cart" button
      if (cart[productId] <= 0) {
        delete cart[productId];
        renderAddButton(slotEl, productId);
      } else {
        const numEl = stepper.querySelector(".cs-qty-num");
        if (numEl) numEl.textContent = cart[productId];
      }

      updateCartBadge();
      return;
    }
  });

  // initialise cart badge on load
  updateCartBadge();
});

// Initialise fancybox for recipe popups
Fancybox.bind("[data-fancybox]", {
  dragToClose: true,
  closeButton: "top",
  animated: true,
});
