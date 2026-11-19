import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function Cart() {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const {
    authUser,
    isCartLoading,
    getCartTotal,
    updateCartItemQuantity,
    removeCartItem,
    totalPrice,
    setTotalPrice,
    setSelectedItems,
    isTotalLoading,
  } = useContext(UserContext);

  const [selectedIds, setSelectedIds] = useState([]);
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false);

  // Select all items after the initial cart load.
  useEffect(() => {
    if (!authUser || isCartLoading) return;

    const existingIds = cartItems.map((item) =>
      String(item.sellerproduct_id)
    );

    setSelectedIds((prev) => {
      if (!hasInitializedSelection) return existingIds;

      return prev.filter((id) => existingIds.includes(id));
    });

    if (!hasInitializedSelection) {
      setHasInitializedSelection(true);
    }
  }, [authUser, isCartLoading, cartItems, hasInitializedSelection]);

  const selectedCartItems = cartItems.filter((item) =>
    selectedIds.includes(String(item.sellerproduct_id))
  );

  // Recalculate totals whenever selected products or quantities change.
  useEffect(() => {
    if (
      !authUser ||
      isCartLoading ||
      cartItems.length === 0 ||
      selectedCartItems.length === 0
    ) {
      setTotalPrice({
        subtotal: 0,
        discount: 0,
        deliveryCharge: 0,
        total: 0,
      });
      setSelectedItems([]);
      return;
    }

    getCartTotal(selectedCartItems);
  }, [
    authUser,
    isCartLoading,
    cartItems,
    selectedIds,
    getCartTotal,
    setTotalPrice,
    setSelectedItems,
  ]);

  const handleCheckboxChange = (id) => {
    const selectedId = String(id);

    setSelectedIds((prev) =>
      prev.includes(selectedId)
        ? prev.filter((itemId) => itemId !== selectedId)
        : [...prev, selectedId]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === cartItems.length
        ? []
        : cartItems.map((item) => String(item.sellerproduct_id))
    );
  };

  const handleIncrease = async (id) => {
    const item = cartItems.find(
      (x) => String(x.sellerproduct_id) === String(id)
    );

    if (item) {
      await updateCartItemQuantity(id, item.needed_quantity + 1);
    }
  };

  const handleDecrease = async (id) => {
    const item = cartItems.find(
      (x) => String(x.sellerproduct_id) === String(id)
    );

    if (item && item.needed_quantity > 1) {
      await updateCartItemQuantity(id, item.needed_quantity - 1);
    }
  };

  const handleRemove = async (id) => {
    const success = await removeCartItem(id);

    if (success) {
      setSelectedIds((prev) =>
        prev.filter((itemId) => itemId !== String(id))
      );
    }
  };

  const handleContinue = async () => {
    if (selectedCartItems.length === 0) {
      alert("Please select at least one product");
      return;
    }

    const result = await getCartTotal(selectedCartItems);

    if (result) {
      navigate("/payment");
    }
  };

  if (!authUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">
            Please log in to view your cart
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Check loading before checking whether the cart is empty.
  if (isCartLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <h2 className="text-2xl font-semibold">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>

      <div className="mb-4 flex items-center gap-3">
        <input
          type="checkbox"
          checked={
            cartItems.length > 0 &&
            selectedIds.length === cartItems.length
          }
          onChange={handleSelectAll}
        />
        <span className="font-medium">Select All</span>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const id = String(item.sellerproduct_id);
          const isSelected = selectedIds.includes(id);

          return (
            <div
              key={id}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleCheckboxChange(id)}
              />

              {item.product_image && (
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="h-24 w-24 rounded object-cover"
                />
              )}

              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {item.product_name}
                </h2>
                <p className="text-gray-600">
                  {item.product_brand}
                </p>
                <p className="text-gray-600">
                  {item.product_category}
                </p>
                <p className="mt-1 font-semibold">
                  ₹{item.price_per_unit}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => handleDecrease(id)}
                    disabled={item.needed_quantity <= 1}
                    className="h-8 w-8 rounded border disabled:opacity-50"
                  >
                    -
                  </button>

                  <span className="min-w-8 text-center">
                    {item.needed_quantity}
                  </span>

                  <button
                    onClick={() => handleIncrease(id)}
                    className="h-8 w-8 rounded border"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(id)}
                  className="mt-3 rounded border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

        <div className="mb-2 flex justify-between">
          <span>Selected Items</span>
          <span>{selectedCartItems.length}</span>
        </div>

        <div className="mb-2 flex justify-between">
          <span>Subtotal</span>
          <span>
            ₹{Number(totalPrice?.subtotal || 0).toFixed(2)}
          </span>
        </div>

        <div className="mb-2 flex justify-between">
          <span>Delivery Fee</span>
          <span>
            ₹{Number(totalPrice?.deliveryCharge || 0).toFixed(2)}
          </span>
        </div>

        <div className="mb-2 flex justify-between">
          <span>Discount</span>
          <span>
            ₹{Number(totalPrice?.discount || 0).toFixed(2)}
          </span>
        </div>

        <div className="mt-2 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>
            ₹{Number(totalPrice?.total || 0).toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleContinue}
          disabled={isTotalLoading || selectedCartItems.length === 0}
          className="mt-6 w-full rounded-lg bg-black px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isTotalLoading
            ? "Calculating..."
            : "Continue to Payment"}
        </button>
      </div>
    </div>
  );
}

export default Cart; 