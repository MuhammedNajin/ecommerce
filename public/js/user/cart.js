


function addToDb(productid, vIndex) {

 
    // Get the selected size value
    var selectedSize = document.querySelector('input[name="size"]:checked');
     
    const qunt = document.getElementById('quantity').value;
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
                  console.log('ok done')
                 
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



const addToCart = (productid,) =>  {

    const index = document.getElementById('productName').getAttribute('data-index')
    console.log(productid, index)
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