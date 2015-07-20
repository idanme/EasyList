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
                    console.log("Success");
                }
            },
            error: function (error) {
                console.log(error);
            }

        }
    );
}

var addNewProductToParse = function (productToAdd) {
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
            console.log('New Product created with objectId: ' + product.id);
        },
        error: function(product, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
}

var updateProductInParse = function (productToUpdate) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    ListContent = Parse.Object.extend("ListContent");
    var query = new Parse.Query(ListContent);
    query.equalTo("objectId", productToUpdate.objectId);
    query.first({
        success: function(product) {
            productToUpdate.productChecked = !productToUpdate.productChecked;
            product.set("productChecked", productToUpdate.productChecked);
            product.save();
            console.log('Product with objectId ' + product.id + ' updated successfully.');
        },
        error: function(product, error) {
            console.log('Failed to update object, with error code: ' + error.message);
        }
    });
}

var deleteProductInParse = function (productToDelete) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    ListContent = Parse.Object.extend("ListContent");
    var query = new Parse.Query(ListContent);
    query.equalTo("objectId", productToDelete.objectId);
    query.first.destroy({
        success: function(product) {
            productToUpdate.productChecked = !productToUpdate.productChecked;
            product.set("productChecked", productToUpdate.productChecked);
            product.save();
            console.log('Product with objectId ' + product.id + ' deleted successfully.');
        },
        error: function(product, error) {
            console.log('Failed to delete object, with error code: ' + error.message);
        }
    });
}





