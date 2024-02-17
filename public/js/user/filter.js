
$(document).ready(function () {
    const sort = $('[name="sort"]');

    const data = {};

    sort.on('change', function () {
        const selectedValue = $(this).val();
        console.log(selectedValue, 'chane en')
        if (selectedValue) {
            data.sort = selectedValue;
        }
        searchFilterSort();
    });

    // cetagory 

    const cetagory = document.querySelectorAll('.cetagory');

    cetagory.forEach((el) => {
        console.log(el)
        el.addEventListener('click', (event) => {
            console.log('cet')
            data.cetagory = event.target.innerHTML;
            searchFilterSort();
        })
    })
    const brand = document.querySelectorAll('.brand');
    brand.forEach((el) => {
        console.log(el)
        el.addEventListener('click', (event) => {
            console.log('brand')
            data.brand = event.target.innerHTML;
            searchFilterSort();
        })
    })
    const price = document.querySelectorAll('.price');
    price.forEach((el) => {
        console.log(el)
        el.addEventListener('click', (event) => {
            console.log('price')
            data.price = event.target.innerHTML;
            searchFilterSort();
        })
    })

    const btn = document.getElementById('searchBtn');
    btn.addEventListener('click', () => {
        const searchData = document.getElementById('search-input').value;
        searchFilterSort(searchData);
    })

    // pagination function
    // const paginator = document.querySelectorAll('.paginator');
    // paginator.forEach((el) => {
    //    el.addEventListener('click', (event) => {
    //     console.log(event.target.innerHTML);
    //        data.page = event.target.innerHTML;
    //        searchFilterSort();
    //    })
    // })
   
    paginationContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('paginator')) {
            
           
            console.log(event.target.innerHTML, 'heeee');
            data.page = event.target.innerHTML;
            searchFilterSort();
        }
    });
 


    console.log('goot here')

    function searchFilterSort(searchData) {
        console.log('hiii')

        if (searchData) {
            data.search = searchData;
        }

        console.log(data, 'hello');
        $.ajax({
            type: "POST",
            url: "/search",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: (response) => {
                if (response.pass) {
                    const productContainer = document.getElementById("productContainer");
                    console.log(response.product)
                    productContainer.innerHTML = '';
                    response.product.forEach((el, i) => {

                        // Create the outer container div with class "col-lg-4 col-md-6 col-sm-6"
                        const outerContainer = document.createElement("div");
                        outerContainer.className = "col-lg-4 col-md-6 col-sm-6";

                        // Create the main product item div with class "product__item"
                        const productItemDiv = document.createElement("div");
                        productItemDiv.className = "product__item";

                        // Create the product image container div with class "product__item__pic set-bg"
                        const productImageContainerDiv = document.createElement("div");
                        productImageContainerDiv.className = "product__item__pic set-bg";

                        // Create the product image anchor element
                        const productImageAnchor = document.createElement("a");
                        productImageAnchor.href = `/productDetails?id=${el._id}&index=0`;

                        // Create the product image element
                        const productImage = document.createElement("img");
                        productImage.className = "product__item__pic set-bg";
                        productImage.style.width = "19rem";
                        productImage.src = `/img/productImage/sharp/${el.variant[0].images[0]}`;
                        productImage.alt = "";

                        // Append the product image element to the anchor element
                        productImageAnchor.appendChild(productImage);

                        // Create the product hover list element with class "product__hover"
                        const productHoverList = document.createElement("ul");
                        productHoverList.className = "product__hover";

                        // Create the list items for product hover actions
                        const productHoverItems = ["heart", "compare", "search"];

                        productHoverItems.forEach((item) => {
                            const listItem = document.createElement("li");
                            const anchor = document.createElement("a");
                            const img = document.createElement("img");
                            img.src = `img/icon/${item}.png`;
                            img.alt = "";
                            anchor.appendChild(img);
                            listItem.appendChild(anchor);
                            productHoverList.appendChild(listItem);
                        });

                        // Append the anchor and hover list to the image container
                        productImageContainerDiv.appendChild(productImageAnchor);
                        productImageContainerDiv.appendChild(productHoverList);

                        // Create the product text container div with class "product__item__text"
                        const productTextContainerDiv = document.createElement("div");
                        productTextContainerDiv.className = "product__item__text";

                        // Create and set content for various text elements
                        const productNameHeading = document.createElement("h6");
                        productNameHeading.textContent = el.name;

                        const addToCartLink = document.createElement("a");
                        addToCartLink.href = "#";
                        addToCartLink.className = "add-cart";
                        addToCartLink.textContent = "+ Add To Cart";

                        const ratingDiv = document.createElement("div");
                        ratingDiv.className = "rating";
                        for (let i = 0; i < 5; i++) {
                            const star = document.createElement("i");
                            star.className = "fa fa-star-o";
                            ratingDiv.appendChild(star);
                        }

                        const priceHeading = document.createElement("h5");
                        priceHeading.textContent = el.variant[0].offerPrice;

                        // Append text elements to the product text container
                        productTextContainerDiv.appendChild(productNameHeading);
                        productTextContainerDiv.appendChild(addToCartLink);
                        productTextContainerDiv.appendChild(ratingDiv);
                        productTextContainerDiv.appendChild(priceHeading);

                        // Create the product color select container div with class "product__color__select"
                        const colorSelectContainerDiv = document.createElement("div");
                        colorSelectContainerDiv.className = "product__color__select";

                        // Create and append radio input elements to the color select container
                        const radioColors = ["pc-4", "pc-5", "pc-6"];
                        radioColors.forEach((color) => {
                            const label = document.createElement("label");
                            label.htmlFor = color;
                            const input = document.createElement("input");
                            input.type = "radio";
                            input.id = color;
                            label.appendChild(input);
                            colorSelectContainerDiv.appendChild(label);
                        });

                        // Append all sub-containers to the main product item div
                        productItemDiv.appendChild(productImageContainerDiv);
                        productItemDiv.appendChild(productTextContainerDiv);
                        productItemDiv.appendChild(colorSelectContainerDiv);

                        // Append the main product item div to the outer container div
                        outerContainer.appendChild(productItemDiv);

                        productContainer.appendChild(outerContainer);

                    });
                }
              
                renderPagination(response.totalPage, response.page)
            }
        })
    }
});


    function renderPagination(pages, currentPage,) {
       console.log(pages, currentPage)
        const paginationContainer = document.getElementById('paginationContainer');
        paginationContainer.innerHTML = '';

        if (pages !== 0) {
            const ul = document.createElement('ul');
            ul.className = 'pagination';

        

            for (let i = 1; i <= pages; i++) {
                const pageButton = createPaginationButton(i, pages);
                ul.appendChild(pageButton);
            }

          

            paginationContainer.appendChild(ul);
        }
    }

    function createPaginationButton(text, totalPage) {
        const li = document.createElement('li');
        li.className = 'page-item';

        const button = document.createElement('button');
        button.className = 'btn btn-outline-dark paginator';
        button.type = 'button';
        button.textContent = text;
        button.dataset.totalPage = totalPage;

        li.appendChild(button);

        return li;
    }

    
