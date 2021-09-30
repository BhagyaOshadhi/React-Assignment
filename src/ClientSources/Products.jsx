import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "@hookstate/core";
import GridComponent from "./GridComponent";
import { Button, CircularProgress } from "@material-ui/core";

const ProductGrid = () => {
  const products = useState([]);
  const page = useState(0);
  const limit = useState(41);
  const basicURL = useState("http://localhost:3000/products");
  const loading = useState(true);
  const isFetching = useState(false);
  const nextProducts = useState([]);
  const sort = useState("");

  const handleScroll = (e) => {
    if (
      window.innerHeight + document.documentElement.scrollTop >
      document.documentElement.offsetHeight - 1
    )
      return;
    isFetching.set(true);
  };

  const getProducts = () => {
    setURL();
    if (!isFetching.get()) {
      axios
        .get(`${basicURL.get()}`)
        .then((response) => {
          let count = 1;
          const productsWithAd = response.data;
          productsWithAd.map((product, index) => {
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
        })
        .catch((error) => console.log(error));
    } else {
      products.merge(nextProducts.get());
      axios
        .get(`${basicURL.get()}`)
        .then((response) => {
          let count = 1;
          const productsWithAd = response.data;
          productsWithAd.map((product, index) => {
            if (index === 21 * count - 1) {
              count += 1;
              productsWithAd.splice(index, 0, {});
            }
          });
          nextProducts.set(productsWithAd);
          page.set(page.get() + 1);
        })
        .catch((error) => console.log(error));

      isFetching.set(false);
    }
  };
  const setURL = () => {
    let url = new URL(basicURL.get());
    url.searchParams.set("_sort", sort.get());
    url.searchParams.set("_page", page.get());
    url.searchParams.set("_limit", limit.get());
    basicURL.set(url.toString());
  };

  const sortList = (sortBy) => {
    sort.set(sortBy);
    page.set(0);
    limit.set(41);
    setURL();
  };

  useEffect(() => {
    getProducts();
  }, [basicURL.get()]);

  useEffect(() => {
    if (!isFetching.get()) return;
    getProducts();
  }, [isFetching.get()]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: "#EDE7F6" }}>
      {loading.get() ? (
        <div
          style={{
            alignContent: "center",
            alignItems: "center",
            marginLeft: "50%",
            height: "500px",
            marginTop: "10%",
          }}
        >
          <h1>Loading...</h1>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ padding: "10px" }}>
          <header style={{ position: "fixed", top: "0px" }}>
            <div style={{ marginBottom: "20px" }}>
              <Button
                variant="outlined"
                onClick={() => sortList("price")}
                style={{
                  marginRight: "15px",
                  background: "#7986CB",
                  padding: "10px",
                }}
              >
                sort by Price
              </Button>
              <Button
                variant="outlined"
                onClick={() => sortList("size")}
                style={{
                  marginRight: "15px",
                  background: "#7986CB",
                  padding: "10px",
                }}
              >
                sort by Size
              </Button>
              <Button
                variant="outlined"
                onClick={() => sortList("id")}
                style={{
                  marginRight: "15px",
                  background: "#7986CB",
                  padding: "10px",
                }}
              >
                sort by Id
              </Button>
            </div>
          </header>
          <body style={{ marginTop: "80px" }}>
            {products.get().length !== 0 ? (
              <GridComponent productList={products} />
            ) : null}
          </body>
        </div>
      )}
      {isFetching.get() && <p>Fetching more list items...</p>}
    </div>
  );
};
export default ProductGrid;
