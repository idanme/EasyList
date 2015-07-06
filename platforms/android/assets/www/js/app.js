/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.mobile.buttonMarkup.hoverDelay = 0;

var categories = [
    {
        name : "Dairy",
        products : []
    }
];

//var categories = [
//    {
//        name: "Dairy",
//        products: [
//            {name: "Milk", quantity: 3, image: "./images/Product_basket.png", checked: false},
//            {
//                name: "Choco",
//                quantity: 1,
//                image: "http://www.milk-man.co.il/Images/products/choco_shakit.jpg",
//                checked: true
//            },
//            {name: "Cottage", quantity: 4, image: "http://img.mako.co.il/2013/03/11/332221.jpg", checked: true}]
//    },
//    {
//        name: "Meat",
//        products: [
//            {name: "Chicken", quantity: 3, image: "./images/Product_basket.png", checked: false},
//            {name: "Hamburger", quantity: 1, image: "./images/Product_basket.png", checked: true},
//            {name: "Shnitzel", quantity: 3, image: "./images/Product_basket.png", checked: false}
//        ]
//    }
//];

    var app = angular.module('SmartShoppingList', []);

    app.controller('ShoppingListController', function ($scope) {
            this.categories = categories;
            //this.products = products;


            this.selectedProduct = {
                name: '',
                categoryName: ''
            };

            this.inEditMode = false;

            getList($scope);

            //TODO fix this with Parse
            this.addProduct = function (productCategory, productName, productQuantity) {
                productQuantity = parseInt(productQuantity);

                var indexOfCategory = findValue(categories, productCategory);

                if (indexOfCategory !== -1) //if a category is alredy created
                {
                    var indexOfProductName = findValue(categories[indexOfCategory].products, productName);
                    if (indexOfProductName !== -1) //if a product is alredy in the list
                    {
                        categories[indexOfCategory].products[indexOfProductName].quantity += productQuantity;
                    }
                    else {
                        categories[indexOfCategory].products.push({
                            name: productName,
                            quantity: productQuantity,
                            image: "./images/Product_basket.png",
                            checked: false
                        });
                    }
                }
                else {
                    categories.push({
                        name: productCategory,
                        products: [{
                            name: productName,
                            quantity: productQuantity,
                            image: "./images/Product_basket.png",
                            checked: false
                        }]
                    });
                }

                $("#addProductPopup").popup("close");
                $("#" + productCategory).listview();

            };

            this.getTheme = function (product) {
                if (this.inEditMode === true)
                    return 'g';
                else {
                    if (product.productChecked === true)
                        return 'f';
                    else
                        return 'b';
                }
            };

            this.getIcon = function (product) {
                if (this.inEditMode === true)
                    return 'delete';
                else {
                    if (product.productChecked === true)
                        return 'check';
                    else
                        return 'gear';
                }
            }

            this.itemClicked = function (product) {
                if (this.inEditMode === false) {
                    var elementClickedClassName = $(event.target).attr("class");
                    if (elementClickedClassName === "productImage") {
                        $(".popphoto").attr("src", product.productImage._url);
                        $(".popphoto").attr("alt", product.productName);
                        $("#productImagePopUp").popup('open');
                    }
                    else {
                        product.productChecked = !product.productChecked;
                    }
                }

            };

            this.updateSelectedProduct = function (productName, productCategory) {
                this.selectedProduct.name = productName;
                this.selectedProduct.categoryName = productCategory;
            };

            this.removeSelectedProduct = function () {
                var categoriesList = this.categories;
                for (var categoryIndex in categoriesList) {
                    var categoryName = categories[categoryIndex].name;
                    var selectedProductCategoryName = this.selectedProduct.categoryName;

                    if (categoryName === selectedProductCategoryName) {
                        var productsList = categories[categoryIndex].products;
                        var selectedProductName = this.selectedProduct.procutName;
                        removeItemFromList(productsList, selectedProductName);
                        deleteCategoryFromListIfEmpty(categoriesList, categoryIndex);
                    }
                }
            };

            this.takePhoto = function (selectedProduct) {
                console.log("Take Photo!");
                var popover = new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
                var cameraOptions = {
                    quality: 100,
                    destinationType: Camera.DestinationType.DATA_URL,
                    allowEdit: true,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 500,
                    targetHeight: 500,
                    popoverOptions: popover,
                    saveToPhotoAlbum: true
                };

                window.navigator.camera.getPicture(function (imageURI) {
                    var categoryIndex = findValue(categories, selectedProduct.categoryName);
                    var productIndex = findValue(categories[categoryIndex].products, selectedProduct.name);
                    categories[categoryIndex].products[productIndex].productImage._url = "data:image/jpeg;base64," + imageURI;
                    $("#" + selectedProduct.categoryName + " ." + selectedProduct.name + " .productImage").attr("src", categories[categoryIndex].products[productIndex].productImage._url);

                }, function (err) {
                }, cameraOptions);
            };

            this.changePhoto = function (selectedProduct) {
                console.log("Change Photo!");
                var popover = new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
                var cameraOptions = {
                    quality: 100,
                    destinationType: Camera.DestinationType.DATA_URL,
                    allowEdit: true,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 500,
                    targetHeight: 500,
                    popoverOptions: popover,
                    saveToPhotoAlbum: true
                };

                window.navigator.camera.getPicture(function (imageURI) {
                    var categoryIndex = findValue(categories, selectedProduct.categoryName);
                    var productIndex = findValue(categories[categoryIndex].products, selectedProduct.name);
                    categories[categoryIndex].products[productIndex].productImage._url = "data:image/jpeg;base64," + imageURI;
                    $("#" + selectedProduct.categoryName + " ." + selectedProduct.name + " .productImage").attr("src", categories[categoryIndex].products[productIndex].productImage._url);

                }, function (err) {
                }, cameraOptions);
            };

            this.editList = function () {
                console.log("sdfsdf");
                this.addQuantityEditing();
            };

            this.executeEditOrSaveFunction = function () {
                if (this.inEditMode === true)
                    this.saveList();
                else
                    this.editList();
                this.inEditMode = !this.inEditMode;
            }

            this.saveList = function () {
                this.updateProductsQuantity();
            };

            this.updateProductsQuantity = function () {
                for (var categoryIndex in categories) {
                    for (var productIndex in categories[categoryIndex].products) {
                        var productName = categories[categoryIndex].products[productIndex].productName;
                        var elementId = "quantity" + productName;
                        if (categories[categoryIndex].products[productIndex].productChecked === false) {
                            categories[categoryIndex].products[productIndex].productQuantity = $("#quantity" + productName + " input").val();
                        }
                    }
                }
            };

            this.addQuantityEditing = function () {
                for (var categoryIndex in categories) {
                    for (var productIndex in categories[categoryIndex].products) {
                        console.log(categories[categoryIndex].products[productIndex].productName);
                        console.log(categories[categoryIndex].products[productIndex].productChecked);
                        if (categories[categoryIndex].products[productIndex].productChecked === false) {
                            var elementId = "quantity" + categories[categoryIndex].products[productIndex].productName;
                            var productQuantity = categories[categoryIndex].products[productIndex].productQuantity;
                            dpUI.numberPicker("#" + elementId, {
                                min: 0,
                                max: 100,
                                step: 1,
                                format: "",
                                formatter: function (x) {
                                    return x;
                                }
                            }, productQuantity);
                        }
                    }
                }
            }
        }
    );



function findValue(array, nameWeAreLookingFor) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].name === nameWeAreLookingFor) {
            return i;
        }
    }
    return -1;
}

function removeItemFromList(list, item) {
    var productIndex = findValue(list, item);
    if (productIndex != -1) {
        list.splice(productIndex, 1);
    }
}

function deleteCategoryFromListIfEmpty(categoriesList, categoryIndex) {
    if (categoriesList[categoryIndex].products.length === 0) {
        categoriesList.splice(categoryIndex, 1);
    }
}