/**
 * Created by oslander on 05/07/2015.
 */

var PARSE_APP = "d4eaDwYlkds7SajkbBzoedmbOnCS5SzY8ioZ8FQV";
var PARSE_JS = "YZnk7gzaQfcAlzLrc4UmTJHEyGXsbEq0wXi984DC";

Parse.initialize(PARSE_APP, PARSE_JS);

function Product(objectId, categoryName, productName, productQuantity, productImage, productChecked) {
    this.objectId = objectId;
    this.categoryName = categoryName;
    this.productName = productName;
    this.productQuantity = productQuantity;
    this.productImage = productImage;
    this.productChecked = productChecked;
}

var getList = function ($scope) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    ListContent = Parse.Object.extend("ListContent");

    var query = new Parse.Query(ListContent);

    query.find(
        {
            success: function (results) {
                for (var i = 0, len = results.length; i < len; i++) {
                    var objectId = results[i].id;
                    var categoryName = results[i].get("categoryName");
                    var productName = results[i].get("productName");
                    var productQuantity = results[i].get("productQuantity");
                    var productImage = results[i].get("productImage");
                    var productChecked = results[i].get("productChecked");
                    if (listContent.hasOwnProperty(categoryName) === false)
                    {
                        listContent[categoryName] = {
                            categoryName: categoryName,
                            products: []
                        };
                    }
                    var newProduct = new Product(objectId, categoryName, productName, productQuantity, productImage, productChecked);
                    listContent[categoryName].products.push(newProduct);
                    $scope.$apply();
                    console.log("New Product added with objectId: " + objectId);
                }
            },
            error: function (error) {
                console.log(error);
            }

        }
    );
}

var addNewProductToParse = function ($scope, productToAdd) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    ListContent = Parse.Object.extend("ListContent");
    var parseListContent = new ListContent;

    parseListContent.save({
        categoryName: productToAdd.categoryName,
        productName: productToAdd.productName,
        productQuantity: productToAdd.productQuantity,
        //TODO: productImage must be FILE and not STRING
        //productImage: productToAdd.productImage,
        productChecked: productToAdd.productChecked
    }, {
        success: function(product) {
            var productCategory = productToAdd.categoryName;
            productToAdd.objectId = product.id;
            listContent[productCategory].products.push(productToAdd);
            $scope.$apply();
            console.log('New Product created with objectId: ' + product.id);
        },
        error: function(product, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
}

var toggleProductCheckedInParse = function ($scope, productToUpdate) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    ListContent = Parse.Object.extend("ListContent");
    var query = new Parse.Query(ListContent);
    query.equalTo("objectId", productToUpdate.objectId);
    query.first({
        success: function(product) {
            // Get the new value of product checked
            var productChecked = !productToUpdate.productChecked;
            // Update the new product checked value in parse
            product.set("productChecked", productChecked);
            product.save();
            // Update the new product checked value in listContent
            productToUpdate.productChecked = productChecked;

            $scope.$apply();
            console.log('Product with objectId ' + product.id + ' updated successfully.');
        },
        error: function(product, error) {
            console.log('Failed to update object, with error code: ' + error.message);
        }
    });
}

var updateProductQuantityInParse = function ($scope, productToUpdate, newProductQuantity) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    ListContent = Parse.Object.extend("ListContent");
    var query = new Parse.Query(ListContent);
    query.equalTo("objectId", productToUpdate.objectId);
    query.first({
        success: function(product) {
            // Update the new quantity in parse
            product.set("productQuantity", newProductQuantity);
            product.save();

            // Update the new quantity in the listContent
            productToUpdate.productQuantity = newProductQuantity;

            $scope.$apply();
            console.log('Product with objectId ' + product.id + ' quantity updated successfully.');
        },
        error: function(product, error) {
            console.log('Failed to update object, with error code: ' + error.message);
        }
    });
}

var deleteProductFromParse = function ($scope, productToDelete) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    ListContent = Parse.Object.extend("ListContent");
    var query = new Parse.Query(ListContent);
    query.get(productToDelete.objectId, {
        success: function(product) {
            // Deleting the product from Parse
            product.destroy({});

            // Deleting the product from listContent
            removeProductFromList(listContent, productToDelete);

            $scope.$apply();
            console.log('Product with objectId ' + product.id + ' deleted successfully.');
        },
        error: function(product, error) {
            console.log('Failed to delete object, with error code: ' + error.message);
        }
    });
}





