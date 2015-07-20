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

        this.selectedProduct;
        this.inEditMode = false;

        getList($scope);

        this.addProduct = function (productCategory, productName, productQuantity) {
            productQuantity = parseInt(productQuantity);

            if (listContent.hasOwnProperty(productCategory) === true) //if a category is already created
            {
                this.addNewProductToExistingCategory(productCategory, productName, productQuantity);
            }
            else {
                this.addNewProductToNewCategory(productCategory, productName, productQuantity);
            }

            $("#addProductPopup").popup("close");
            $("#" + productCategory).listview();

        };

        this.addNewProductToNewCategory = function (productCategory, productName, productQuantity) {
            listContent[productCategory] = {
                categoryName: productCategory,
                products: []
            };
            var productImage = "./images/Product_basket.png";
            var newProduct = new Product(null, productCategory, productName, productQuantity, productImage, false);
            addNewProductToParse(newProduct);
        };

        this.addNewProductToExistingCategory = function (productCategory, productName, productQuantity) {
            var products = listContent[productCategory].products;
            var indexOfProductName = findProduct(products, productName);
            if (indexOfProductName !== -1) //if a product is already in the list
            {
                //TODO fix this with Parse - Update the quantity in parse
                products[indexOfProductName].quantity += productQuantity;
            }
            else {
                var productImage = "./images/Product_basket.png";
                var newProduct = new Product(null, productCategory, productName, productQuantity, productImage, false);
                addNewProductToParse(newProduct);
            }
        };

        this.itemClicked = function (product) {
            if (this.inEditMode === false) {
                var elementClickedClassName = $(event.target).attr("class");
                if (elementClickedClassName === "productImage") {
                    $(".popphoto").attr("src", product.productImage._url);
                    $(".popphoto").attr("alt", product.productName);
                    $("#productImagePopUp").popup('open');
                }
                else {
                    updateProductInParse(product);
                }
            }

        };

        this.updateSelectedProduct = function (product) {
            this.selectedProduct = product;
        };

        this.removeSelectedProduct = function () {
            var categoryName = this.selectedProduct.categoryName;
            if (this.listContent.hasOwnProperty(categoryName) === true)
            {
                deleteProductFromParse(this.selectedProduct);
            }
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
        };

        this.saveList = function () {
            this.updateProductsQuantity();
        };

//TODO make work with Parse
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
        };
    }
);


function findProduct(array, productToRemove) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].objectId === productToRemove.objectId) {
            return i;
        }
    }
    return -1;
}

function removeProductFromList(listContent, productToRemove) {
    var categoryName = productToRemove.categoryName;
    var productsList = listContent[categoryName].products;
    var productIndex = findProduct(productsList, productToRemove);
    if (productIndex != -1) {
        productsList.splice(productIndex, 1);
        deleteCategoryFromListIfEmpty(listContent, categoryName);
    }

}

function deleteCategoryFromListIfEmpty(listContent, categoryName) {
    if (listContent[categoryName].products.length === 0) {
        delete listContent[categoryName];
    }
}