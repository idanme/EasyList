/**
 * Created by oslander on 05/07/2015.
 */

var PARSE_APP = "d4eaDwYlkds7SajkbBzoedmbOnCS5SzY8ioZ8FQV";
var PARSE_JS = "YZnk7gzaQfcAlzLrc4UmTJHEyGXsbEq0wXi984DC";

//(function() {
//    Parse.initialize(PARSE_APP, PARSE_JS);
//
//    window.fbAsyncInit = function () {
//        Parse.FacebookUtils.init({ // this line replaces FB.init({
//            appId: '1060741983939011', // Facebook App ID
//            status: true,  // check Facebook Login status
//            cookie: true,  // enable cookies to allow Parse to access the session
//            xfbml: true,  // initialize Facebook social plugins on the page
//            version: 'v2.4' // point to the latest Facebook Graph API version
//        });
//
//
//    };
//
//    (function (d, s, id) {
//        var js, fjs = d.getElementsByTagName(s)[0];
//        if (d.getElementById(id)) {
//            return;
//        }
//        js = d.createElement(s);
//        js.id = id;
//        js.src = "https://connect.facebook.net/en_US/sdk.js";
//        fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));
//})();


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
    var ListContent = Parse.Object.extend("ListContent");
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

var addNewProductToParse = function ($scope, newProduct) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    var ListContent = Parse.Object.extend("ListContent");
    var parseListContent = new ListContent();

    parseListContent.save({
        categoryName: newProduct.categoryName,
        productName: newProduct.productName,
        productQuantity: newProduct.productQuantity,
        productImage: newProduct.productImage,
        productChecked: newProduct.productChecked
    }, {
        success: function(productFromParse) {
            var productCategory = newProduct.categoryName;
            newProduct.objectId = productFromParse.id;
            listContent[productCategory].products.push(newProduct);
            $scope.$apply();
            console.log('New Product created with objectId: ' + productFromParse.id);
        },
        error: function(productFromParse, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
        }
    });
}

var toggleProductCheckedInParse = function ($scope, productToUpdate) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    var ListContent = Parse.Object.extend("ListContent");
    var query = new Parse.Query(ListContent);
    query.equalTo("objectId", productToUpdate.objectId);
    query.first({
        success: function(productFromParse) {
            // Get the new value of product checked
            var productChecked = !productToUpdate.productChecked;
            // Update the new product checked value in parse
            productFromParse.set("productChecked", productChecked);
            productFromParse.save().then(function() {
                    // Update the new product checked value in listContent
                    productToUpdate.productChecked = productChecked;
                    $scope.$apply();
                    console.log('Product with objectId ' + productFromParse.id + ' updated successfully.');
                }
            );
        },
        error: function(product, error) {
            console.log('Failed to update object, with error code: ' + error.message);
        }
    });
}

var updateProductQuantityInParse = function ($scope, productToUpdate, newProductQuantity) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    var ListContent = Parse.Object.extend("ListContent");
    var query = new Parse.Query(ListContent);
    query.equalTo("objectId", productToUpdate.objectId);
    query.first({
        success: function(productFromParse) {
            // Update the new quantity in parse
            productFromParse.set("productQuantity", newProductQuantity);
            productFromParse.save().then(function() {
                // Update the new quantity in the listContent
                productToUpdate.productQuantity = newProductQuantity;

                $scope.$apply();
                console.log('Product with objectId ' + productFromParse.id + ' quantity updated successfully.');
            });
        },
        error: function(product, error) {
            console.log('Failed to update object, with error code: ' + error.message);
        }
    });
}

var deleteProductFromParse = function ($scope, productToDelete) {
    Parse.initialize(PARSE_APP, PARSE_JS);
    var ListContent = Parse.Object.extend("ListContent");
    var query = new Parse.Query(ListContent);
    query.get(productToDelete.objectId, {
        success: function(product) {
            // Deleting the product from Parse
            product.destroy({}).then(function() {
                // Deleting the product from listContent
                removeProductFromList(listContent, productToDelete);

                $scope.$apply();
                console.log('Product with objectId ' + product.id + ' deleted successfully.');
            });
        },
        error: function(product, error) {
            console.log('Failed to delete object, with error code: ' + error.message);
        }
    });
}

var changeProductPhotoInParse = function($scope, productToUpdate, imageURI)
{
    Parse.initialize(PARSE_APP, PARSE_JS);

    var file = new Parse.File(productToUpdate.productName + ".jpg", {base64:imageURI});
    $scope.list.showLoadingWidget();
    file.save().then(function() {
        // The file has been saved to Parse.
        getProductFromParse(productToUpdate,function(productFromParse){
            productFromParse.set("productImage", file.url());
            productFromParse.save().then(function(){
                productToUpdate.productImage = file.url();
                $scope.$apply();
                $scope.list.hideLoadingWidget();
            });
        })
    }, function(error) {
        // The file either could not be read, or could not be saved to Parse.
        console.log("Error saving photo");
    });
}

var getProductFromParse = function (productToQuery, callBack)
{
    Parse.initialize(PARSE_APP, PARSE_JS);
    var ListContent = Parse.Object.extend("ListContent");
    var query = new Parse.Query(ListContent);
    query.equalTo("objectId", productToQuery.objectId);
    query.first({
        success: function(product) {
            callBack(product);
        },
        error: function(product, error) {
            console.log('Failed to update object, with error code: ' + error.message);
        }
    });
}
var kaki;
var facebookLogin = function ()
{
    facebookConnectPlugin.login(["user_about_me"],
        function(result){
            var expirationDate = new Date();
            expirationDate.setSeconds(result.authResponse["expiresIn"]);
            var facebookAuthData = {
                "id": result.authResponse["userID"],
                "access_token": result.authResponse["accessToken"],
                "expiration_date": expirationDate
            }
            console.log(facebookAuthData);
            loginToParse(facebookAuthData);
        },
        function () {
            alert ("error");
        }
    );
}

var loginToParse = function (facebookAuthData)
{
    Parse.initialize(PARSE_APP, PARSE_JS);
    Parse.FacebookUtils.logIn(facebookAuthData, {

        success: function(_user) {
            kaki = _user;
            console.log(_user);
            console.log("User is logged into Parse");
        },

        error: function(error1, error2){
            console.log("Unable to create/login to as Facebook user");
            console.log("  ERROR1 = "+JSON.stringify(error1));
            console.log("  ERROR2 = "+JSON.stringify(error2));
        }
    });
}

