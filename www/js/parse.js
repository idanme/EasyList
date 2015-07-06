/**
 * Created by oslander on 05/07/2015.
 */

var PARSE_APP = "d4eaDwYlkds7SajkbBzoedmbOnCS5SzY8ioZ8FQV";
var PARSE_JS = "YZnk7gzaQfcAlzLrc4UmTJHEyGXsbEq0wXi984DC";

Parse.initialize(PARSE_APP, PARSE_JS);

function Product(categoryName, productName, productQuantity, productImage, productChecked) {
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
                    listContent[categoryName].products.push(new Product(categoryName, productName, productQuantity, productImage, productChecked));
                    //listContent[0].products.push(new Product(categoryName, productName, productQuantity, productImage, productChecked));
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



