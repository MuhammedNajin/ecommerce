


function addToDb(productid, vIndex,) {

 
    // Get the selected size value
    var selectedSize = document.querySelector('input[name="size"]:checked');
     let qunt
    const quanti = document.getElementById('quantity')
    if(quanti) {
      qunt = quanti.value;
    }
    console.log(qunt);
    // Check if a size is selected
    if (selectedSize) {
      console.log('Selected size:', selectedSize.value);
      const data = {
        productId: productid,
        index: vIndex,
        size: selectedSize.value,
        quantity: qunt,
      }
        $.ajax({
            type: "POST",
            url: '/add-cart',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: (response) => {
                if(response.added) {
                  console.log('hi')
                  showToast();   
                 
                } else if(response.already) {
                  const parentElement = document.getElementById('snackbar');
             const secondChild = parentElement.querySelector(':nth-child(2)');
             secondChild.innerText = 'Item is already in the cart';
             
             setTimeout(() => {
              const parentElement = document.getElementById('snackbar');
             const secondChild = parentElement.querySelector(':nth-child(2)');
             secondChild.innerText = 'Item successfully added to your cart!';
             }, 4000)
             showToast();

                } else if(response.user) {
                  window.location.href = '/'
                }
            }
        });
    } else {
      const size = document.getElementById('size');
      size.style.color = 'red';
      size.textContent = 'Please select size';
        
      setTimeout(() => {
        size.style.color = '';
        size.textContent = ''; 
      }, 6000)
      return;
    }
  

  
}



const addToCart = (productid, indexs = null) =>  {
    let index = '';
    if(indexs == null) {
      index = document.getElementById('productName').getAttribute('data-index')
      console.log(productid, index)
    } else {
      index = indexs;
    }
   
  try {
    
    
    $.ajax({
        type: "POST",
        url: '/checkSession',
        success: (response) => {
            
            if(response.session) {
              console.log(true, 'yaaaaaaaaaaaa')
                addToDb(productid, index);
            } else {
                const product = [productid, index];
                localStorage.setItem('product', product);
            }
        }
    })
  } catch (error) {
    console.log(error);
  }
   

}

function proccedTOCheckOut() {
  try {
      const session = document.getElementById('btn').getAttribute('data-session');
      console.log(session)
        window.location = '/check-out'
 
  } catch (error) {
    console.log(error)
  }
}

function addTOWishlist(productId,) {
  console.log('hello')
  const index = document.getElementById('productName').getAttribute('data-index');
  const data = {
     productId,
     index
  }
  $.ajax({
      type:'POST',
      url: '/wishlist',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: (response)=> {
           if(response.already) {
             console.log('already')
             console.log('hwllo')
             const parentElement = document.getElementById('snackbar');
             const secondChild = parentElement.querySelector(':nth-child(2)');
             secondChild.innerText = 'Item is already in the wishlist';
             
             setTimeout(() => {
              const parentElement = document.getElementById('snackbar');
             const secondChild = parentElement.querySelector(':nth-child(2)');
             secondChild.innerText = 'Item successfully added to your cart!';
             }, 4000)
            showToast();
           } else if(response.wishlist) {
            console.log('hwllo')
            const parentElement = document.getElementById('snackbar');
            const secondChild = parentElement.querySelector(':nth-child(2)');
            secondChild.innerText = 'Item successfully added to your wishlist!';
            showToast();

           }
      }

  })
}

function showToast() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function showToWish() {
  var x = document.getElementById("wishlist");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


function removeFromWishlist(productId, index) {
  console.log('remove')
   try {
    if(!productId && !index) {
      return;
    }
  
    const data = {
      productId,
      index
    }
  
    $.ajax({
      type: 'post',
      url: 'remove-wishlist',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: (response) => {
        if(response.success) {
          window.location.reload();
        }
      }
    });
   } catch (error) {
     console.log(error);
   }
}
