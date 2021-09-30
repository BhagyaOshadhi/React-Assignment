import React from "react";
import { Grid, Card, Typography } from "@material-ui/core";
import { useState } from "@hookstate/core";

const GridComponent = ({ productList }) => {
  const products = useState(productList);
  const today = new Date();
  const randomNumbers = [];

  const relativeTime = (date) => {
    const addedDate = new Date(date);
    const today = new Date();
    const days =
      (today.getUTCFullYear() - addedDate.getUTCFullYear()) * 365 +
      (today.getDate() < addedDate.getDate()
        ? (today.getMonth() - 1 - addedDate.getMonth()) * 30 +
          (today.getDate() + 30 - addedDate.getDate())
        : (today.getMonth() - addedDate.getMonth()) * 30 +
          (today.getDate() - addedDate.getDate()));
    return (
      <h4 style={{ color: "#424242", marginBottom: "2px" }}>
        {days === 0
          ? `product added Today`
          : days >= 365
          ? Math.trunc(days / 365) === 1
            ? `${Math.trunc(days / 365)} year ago`
            : `${Math.trunc(days / 365)} years ago`
          : days <= 7
          ? days === 1
            ? `${days} day ago`
            : `${days} days ago`
          : `${addedDate.toString().substring(3, 16)}`}
      </h4>
    );
  };

  const generateRandomNumber = () => {
    const random = Math.floor(Math.random() * 1000);
    if (randomNumbers.includes(random)) {
      generateRandomNumber();
    } else {
      randomNumbers.push(random);
      return random;
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        {products.map((product, index) => {
          return (
            <>
              <Grid item md={3}>
                <Card
                  style={{
                    height: "200px",
                    padding: "15px",
                    textAlign: "center",
                    background: "white",
                    marginBottom: "8px",
                  }}
                >
                  {product !== undefined &&
                  product.face.get() !== undefined &&
                  product.face.get() &&
                  product.date.get() ? (
                    <>
                      <h1 style={{ fontSize: `${product.size.get()}px` }}>
                        {product.face.get()}
                      </h1>
                      <Typography style={{ color: "#BF360C" }}>{`Price : $ ${
                        product.price.get() / 100
                      }`}</Typography>
                      <p style={{ marginBottom: "2px !important" }}>
                        {relativeTime(product.date.get())}
                      </p>
                    </>
                  ) : (
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        alignContent: "center",
                      }}
                      class="ad"
                      src={`http://localhost:3000/ads/?r=${generateRandomNumber()}`}
                    />
                  )}
                </Card>
              </Grid>
            </>
          );
        })}
      </Grid>
    </>
  );
};
export default GridComponent;
