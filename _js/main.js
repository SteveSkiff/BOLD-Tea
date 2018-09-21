console.log("JS file loaded.");


$(document).ready(function() {

	// Cart General Setup

	$('.navcart-bag-itemnum').html(0);
	if(localStorage.getItem('cart')!== null) {
		var cartItems = JSON.parse(localStorage.getItem('cart'));
		// console.log("These are the cart items:" + JSON.stringify(cartItems));
		var itemNum = cartItems.products;
		// console.log("Number of items in cart is: " + itemNum.length);
		$('.navcart-bag-itemnum').html(itemNum.length);
		renderCartWithItems(cartItems);
		renderOrderTotal(cartItems);
		renderFinalCart(cartItems);
	} else if (!localStorage.getItem('cart')) {
		var cart = {};
		cart.products = [];
		localStorage.setItem('cart', JSON.stringify(cart));
	};

	if(window.location.pathname == '/orderreceipt.html') {
		setTimeout(function () {
		localStorage.clear();
		$('.navcart-bag-itemnum').html(itemNum.length);
		}, 3000);
	}


	// Cart Quantity Update Event Listener

	$('.cart-qty').change(function(event) {
		// console.log('Changing value of item in cart.');
		var result = cartItems.products.find( obj => {
			return obj.id == $(this).parents('.teaItem').attr('id');
		})

		result.qty = $(this).val();
		cart = JSON.stringify(cartItems);
		localStorage.setItem('cart', cart);
		$(this).parent().next('.cart-subtotal').text(result.qty * result.price);

		var totalPrice = 0;

		for (var i in cartItems.products) {
			var row = cartItems.products[i];
			totalPrice += (row.price * row.qty);
		}
		$(".carttotals-total").text("$"+totalPrice+" + tax & shipping");

		var emptyCart = "<div class='emptycart'><h2 class='emptycart-title'>Oh no!</h2><p class='emptycart-desc'>It looks like your cart is empty. Please add something to your cart to continue!</p></div>";
		if (totalPrice == 0) {
			$("table").remove();
			$(".navcart-bag-itemnum").html('0');
			$(".cart").append(emptyCart);
			$(".cart-labels").hide();
			$(".carttotals").hide();
			$(".divider").hide();
			$(".btns").hide();
			localStorage.clear();
		};

		// console.log(`Item ID ${result.id}'s value now changed to ${result.qty}.`);
		// console.log(`Current input value: ${$(this).val()}.`);
		// console.log(`Item ID: ${result.id} with a new value of ${result.qty}.`);
	});

})


// Add-to-Cart Event

$('.js_addtocart').on('click', function() {
	
	var item = $(this).parent();
	console.log('Item found:' + item);

	var qty = $(item).find('input[type=text]').val();
	console.log('Quantity determined: ' + qty);

	if(isNaN(qty) === true) {
		alert('Please define a quantity between 1 and 99.');
		return;
	}
	var product = {};
	product.id = $(item).attr('data-id');
	product.name = $(item).attr('data-name');
	product.price =  $(item).attr('data-price');
	product.qty = qty;
	console.log(product);

	addToCart(product);

	$(this).html('ADDED!');
	setTimeout( () => {
		$(this).fadeOut(10);
		$(this).html('ADD TO CART');
		$(this).fadeIn(500);
	}, 2000);
});


// Add-to-Cart Function

function addToCart(product) {
	if(localStorage && localStorage.getItem('cart')) {
		var cart = JSON.parse(localStorage.getItem('cart'));
		console.log("Cart is comprised of:" + JSON.stringify(cart));

		var wasAdded = false;

		for (var i in cart.products) {
			if (cart.products[i].id == product.id) {
				cart.products[i].qty = parseInt(cart.products[i].qty) + parseInt(product.qty);
				wasAdded = true;
			}
		}

		if (!wasAdded) {
			cart.products.push(product);
		}

		localStorage.setItem('cart', JSON.stringify(cart));
		console.log("Cart now has these items: " + localStorage.getItem('cart'))

		var cartItems = JSON.parse(localStorage.getItem('cart'));
		console.log("These are the cart items:" + JSON.stringify(cartItems));
		var itemNum = cartItems.products;
		console.log("Number of items in cart is: " + itemNum.length);
		$('.navcart-bag-itemnum').html(itemNum.length);

		localStorage.setItem('itemNum', itemNum);
	}
}


// Cart Render to Page

function renderCartWithItems(cartItems) {
	console.log("Building Cart Page")

	var theHTML = "<table>";

	var totalPrice = 0;

	for (var i in cartItems.products) {
		var row = cartItems.products[i]; // get the current item

		theHTML += "<tr class='teaItem' id="+ row.id +"><td>BOLD</br> "+ row.name+ " tea</td><td><input class='cart-qty' type='number' value='"+row.qty+"' min='0' max='99'></td><td class='cart-subtotal'>"+(row.price * row.qty)+"</td></tr>"


		// Creating a HTML node via jQuery
		//var tr = $("<div></div>").text(row.name);
		//$("h2").append(tr)
		totalPrice += (row.price * row.qty)
	}

	theHTML += "</table>";
	var emptyCart = "<div class='emptycart'><h2 class='emptycart-title'>Oh no!</h2><p class='emptycart-desc'>It looks like your cart is empty. Please add something to your cart to continue!</p></div>"

	if (totalPrice == 0) {
		$(".cart").append(emptyCart);
		$(".cart-labels").hide();
		$(".carttotals").hide();
		$(".btns").hide();
	} else {
		$(".cart").append(theHTML);
	}
	

	totalPrice = Math.round(totalPrice * 100) / 100 // round to 2 decimals
	// TO DO - add trailing zero if last cents digit is 0 (aka 1.90 - turns into 1.9)
	$(".carttotals-total").text("$"+totalPrice+" + tax & shipping");
}

// Render Finalized Cart 

function renderFinalCart(cartItems) {
	console.log("Building Final Cart Confirmation")

	var theHTML = "<table>";

	for (var i in cartItems.products) {
		var row = cartItems.products[i]; // get the current item

		theHTML += "<tr class='teaItem' id="+ row.id +"><td>BOLD</br> "+ row.name+ " tea</td><td>"+row.qty+"</td><td class='cart-subtotal'>"+(row.price * row.qty)+"</td></tr>"

	}

	theHTML += "</table>";
	$(".cart-final").append(theHTML);
}

// Cart Grand Total Render to Page

function renderOrderTotal(cartItems) {
	var totalPrice = 0;

	for(var i in cartItems.products) {
		var row = cartItems.products[i];
		totalPrice += (row.price * row.qty);
	}

	var tax = Math.round(0.09 * totalPrice * 100) / 100;
	var finalPrice = Math.round(totalPrice * 100) / 100 + Math.round(tax * 100) / 100 + 15;

	var orderHTML = '<table><tr><td><span class="bold">ITEMS TOTAL</span></br><span>'+ totalPrice + '</span></td></tr><tr><td><span class="bold">SHIPPING:</span></br><span>$15</span></td></tr><tr><td><span class="bold">TAX:</span></br><span> ' + tax + ' = </span></td></tr><tr><td><span class="bold_big"> $' + Math.round(finalPrice * 100) / 100 + '</span></td></tr></table>'

	$('.ordertotals-details').append(orderHTML);
}



