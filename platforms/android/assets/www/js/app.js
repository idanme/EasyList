/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.mobile.buttonMarkup.hoverDelay = 0;

var listContent = new Object();

var app = angular.module('SmartShoppingList', []);

app.controller('ShoppingListController', function ($scope) {
        this.listContent = listContent;

        //TODO change it to be the product Class
        this.selectedProduct = {
            name: '',
            categoryName: ''
        };
        this.inEditMode = false;

        getList($scope);

        //TODO fix this with Parse
        this.addProduct = function (productCategory, productName, productQuantity) {
            productQuantity = parseInt(productQuantity);

            if (listContent.hasOwnProperty(productCategory) === true) //if a category is alredy created
            {
                var products = listContent[productCategory].products;
                var indexOfProductName = findProduct(products, productName);
                if (indexOfProductName !== -1) //if a product is alredy in the list
                {
                    products[indexOfProductName].quantity += productQuantity;
                }
                else {
                    products.push(new Product(productCategory, productName, productQuantity, productImage, false));
                    //image: "./images/Product_basket.png",
                }
            }
            else {
                listContent.push({
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

//TODO make work with Parse
        this.removeSelectedProduct = function () {
            var categoriesList = this.listContent;
            for (var categoryIndex in categoriesList) {
                var categoryName = listContent[categoryIndex].name;
                var selectedProductCategoryName = this.selectedProduct.categoryName;

                if (categoryName === selectedProductCategoryName) {
                    var productsList = listContent[categoryIndex].products;
                    var selectedProductName = this.selectedProduct.procutName;
                    removeItemFromList(productsList, selectedProductName);
                    deleteCategoryFromListIfEmpty(categoriesList, categoryIndex);
                }
            }
        };

        this.takePhoto = function () {
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
                var productIndex = findProduct(listContent[selectedProduct.categoryName], selectedProduct.name);
                var products = listContent[selectedProduct.categoryName].products;
                products[productIndex].productImage._url = "data:image/jpeg;base64," + imageURI;
                $("#" + this.selectedProduct.categoryName + " ." + this.selectedProduct.name + " .productImage").attr("src", products[productIndex].productImage._url);

            }, function (err) {
            }, cameraOptions);
        };

        this.changePhoto = function () {
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
                var productIndex = findProduct(listContent[selectedProduct.categoryName], selectedProduct.name);
                var products = listContent[selectedProduct.categoryName].products;
                products[productIndex].productImage._url = "data:image/jpeg;base64," + imageURI;
                $("#" + this.selectedProduct.categoryName + " ." + this.selectedProduct.name + " .productImage").attr("src", products[productIndex].productImage._url);

            }, function (err) {
            }, cameraOptions);
        };

        this.editList = function () {
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
            for (var categoryName in listContent) {
                var products = listContent[categoryName].products;
                for (var productIndex in products) {
                    var productName = products[productIndex].productName;
                    //var elementId = "quantity" + productName;
                    if (products[productIndex].productChecked === false) {
                        products[productIndex].productQuantity = $("#quantity" + productName + " input").val();
                    }
                }
            }
        };

        this.addQuantityEditing = function () {
            for (var categoryName in listContent) {
                var products = listContent[categoryName].products;
                for (var productIndex in products) {
                    if (products[productIndex].productChecked === false) {
                        var elementId = "quantity" + products[productIndex].productName;
                        var productQuantity = products[productIndex].productQuantity;
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



function findProduct(array, nameWeAreLookingFor) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].productName === nameWeAreLookingFor) {
            return i;
        }
    }
    return -1;
}

//TODO fix with the new structure
function removeItemFromList(list, item) {
    var productIndex = findProduct(list, item);
    if (productIndex != -1) {
        list.splice(productIndex, 1);
    }
}

//TODO fix with the new structure
function deleteCategoryFromListIfEmpty(categoriesList, categoryIndex) {
    if (categoriesList[categoryIndex].products.length === 0) {
        categoriesList.splice(categoryIndex, 1);
    }
}