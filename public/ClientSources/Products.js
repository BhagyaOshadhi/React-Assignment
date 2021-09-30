import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "@hookstate/core";
import GridComponent from "./GridComponent";
import { Button, CircularProgress } from "@material-ui/core";

var ProductGrid = function ProductGrid() {
  var products = useState([]);
  var page = useState(0);
  var limit = useState(41);
  var basicURL = useState("http://localhost:3000/products");
  var loading = useState(true);
  var isFetching = useState(false);
  var nextProducts = useState([]);
  var sort = useState("");

  var handleScroll = function handleScroll(e) {
    if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 1) return;
    isFetching.set(true);
  };

  var getProducts = function getProducts() {
    setURL();
    if (!isFetching.get()) {
      axios.get("" + basicURL.get()).then(function (response) {
        var count = 1;
        var productsWithAd = response.data;
        productsWithAd.map(function (product, index) {
          if (index === 21 * count - 1) {
            count += 1;
            productsWithAd.splice(index, 0, {});
          }
        });
        products.set(productsWithAd.slice(0, 21));
        nextProducts.set(productsWithAd.slice(21));
        loading.set(false);
        limit.set(21);
        page.set(2);
      }).catch(function (error) {
        return console.log(error);
      });
    } else {
      products.merge(nextProducts.get());
      axios.get("" + basicURL.get()).then(function (response) {
        var count = 1;
        var productsWithAd = response.data;
        productsWithAd.map(function (product, index) {
          if (index === 21 * count - 1) {
            count += 1;
            productsWithAd.splice(index, 0, {});
          }
        });
        nextProducts.set(productsWithAd);
        page.set(page.get() + 1);
      }).catch(function (error) {
        return console.log(error);
      });

      isFetching.set(false);
    }
  };
  var setURL = function setURL() {
    var url = new URL(basicURL.get());
    url.searchParams.set("_sort", sort.get());
    url.searchParams.set("_page", page.get());
    url.searchParams.set("_limit", limit.get());
    basicURL.set(url.toString());
  };

  var sortList = function sortList(sortBy) {
    sort.set(sortBy);
    page.set(0);
    limit.set(41);
    setURL();
  };

  useEffect(function () {
    getProducts();
  }, [basicURL.get()]);

  useEffect(function () {
    if (!isFetching.get()) return;
    getProducts();
  }, [isFetching.get()]);

  useEffect(function () {
    window.addEventListener("scroll", handleScroll);
    return function () {
      return window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return React.createElement(
    "div",
    { style: { background: "#EDE7F6" } },
    loading.get() ? React.createElement(
      "div",
      {
        style: {
          alignContent: "center",
          alignItems: "center",
          marginLeft: "50%",
          height: "500px",
          marginTop: "10%"
        }
      },
      React.createElement(
        "h1",
        null,
        "Loading..."
      ),
      React.createElement(CircularProgress, null)
    ) : React.createElement(
      "div",
      { style: { padding: "10px" } },
      React.createElement(
        "header",
        { style: { position: "fixed", top: "0px" } },
        React.createElement(
          "div",
          { style: { marginBottom: "20px" } },
          React.createElement(
            Button,
            {
              variant: "outlined",
              onClick: function onClick() {
                return sortList("price");
              },
              style: {
                marginRight: "15px",
                background: "#7986CB",
                padding: "10px"
              }
            },
            "sort by Price"
          ),
          React.createElement(
            Button,
            {
              variant: "outlined",
              onClick: function onClick() {
                return sortList("size");
              },
              style: {
                marginRight: "15px",
                background: "#7986CB",
                padding: "10px"
              }
            },
            "sort by Size"
          ),
          React.createElement(
            Button,
            {
              variant: "outlined",
              onClick: function onClick() {
                return sortList("id");
              },
              style: {
                marginRight: "15px",
                background: "#7986CB",
                padding: "10px"
              }
            },
            "sort by Id"
          )
        )
      ),
      React.createElement(
        "body",
        { style: { marginTop: "80px" } },
        products.get().length !== 0 ? React.createElement(GridComponent, { productList: products }) : null
      )
    ),
    isFetching.get() && React.createElement(
      "p",
      null,
      "Fetching more list items..."
    )
  );
};
export default ProductGrid;