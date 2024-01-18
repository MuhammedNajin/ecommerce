
var INITIAL_COUNT = 0;

function addToDb(productid, vIndex) {
  const data = {
    productId: productid,
    index: vIndex
  }
    $.ajax({
        type: "POST",
        url: '/add-cart',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: (response) => {
            if(response.added) {
              console.log('ok done')
              // const no =  document.getElementById('count');
              // no.innerHTML = INITIAL_COUNT++;
            }
        }
    });
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