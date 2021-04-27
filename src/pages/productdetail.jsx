import React, { Component } from "react";
import Header from "../components/header";
import axios from "axios";
import { API_URL, currencyFormatter } from "./../helper";
import Loading from "../components/loading";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link } from "react-router-dom";
import Button from "../components/button";
import { connect } from "react-redux";
import { CartAction } from "../redux/actions/authActions";

class ProductDetail extends Component {
  state = {
    product: {},
    loading: true,
    qty: 1,
  };

  componentDidMount() {
    var idprod = this.props.match.params.idprod;
    var data = this.props.location.state;
    if (!data) {
      axios
        .get(`${API_URL}/product/${idprod}`)
        .then((res) => {
          this.setState({ product: res.data });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ product: data.product, loading: false });
    }
  }

  onQtyClick = (operator) => {
    if (operator === "tambah") {
      var hasil = this.state.qty + 1;
      if (hasil > this.state.product.qty) {
        alert("melebihi stock");
      } else {
        this.setState({ qty: this.state.qty + 1 });
      }
    } else {
      var hasil = this.state.qty - 1;
      if (hasil < 1) {
        alert("nggak boleh kurang dari 1");
      } else {
        this.setState({ qty: this.state.qty - 1 });
      }
    }
  };

  onAddToCartClick = () => {
    if (
      this.props.dataUser.role === "admin" ||
      this.props.dataUser.islogin === false
    ) {
      alert(" tidak boleh beli");
    } else {
      let idusers = this.props.dataUser.idusers;
      let idprod = this.state.product.idproducts;
      let qty = this.state.qty;
      let TokenAccess = localStorage.getItem("TA");
      console.log(TokenAccess);
      let data = {
        idusers,
        idprod,
        qty,
      };
      let options = {
        headers: {
          Authorization: "Bearer " + TokenAccess,
        },
      };
      axios
        .post(`${API_URL}/trans/cart`, data, options)
        .then((res) => {
          console.log(res.data);
          this.props.CartAction(res.data);
          alert("berhasil");
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data.message);
        });
      // let stok = this.state.product.stok;
      // axios
      //   .get(`${API_URL}/users/${id}`)
      //   .then((res) => {
      //     var cart = res.data.cart; //cart adalah array

      //     let findIdx = cart.findIndex((val) => val.id == idprod);
      //     if (findIdx < 0) {
      //       let data = {
      //         ...this.state.product,
      //         qty: this.state.qty,
      //       };
      //       // rekayasa array
      //       cart.push(data);
      //       // update data
      //       axios
      //         .patch(`${API_URL}/users/${id}`, { cart: cart }) // expektasi data yang dikrim harus object
      //         .then((res1) => {
      //           console.log(res1.data);
      //           this.props.CartAction(res1.data.cart);
      //           alert("cart berhasil");
      //         })
      //         .catch((err) => {
      //           console.log(err);
      //         });
      //     } else {
      //       let qtyakhir = cart[findIdx].qty + this.state.qty; //4 //2
      //       if (qtyakhir > stok) {
      //         // rekayasa array
      //         var qtyablebuy = stok - cart[findIdx].qty;
      //         alert(
      //           "barang dicart melebihi stok barang yang bisa dibeli hanya " +
      //             qtyablebuy
      //         );
      //       } else {
      //         cart[findIdx].qty = qtyakhir; //?cart adalah array karena di db.json itu array
      //         axios
      //           .patch(`${API_URL}/users/${id}`, { cart: cart }) // ?ekspektasi data yang dikrim harus object
      //           .then((res1) => {
      //             console.log(res1.data);
      //             this.props.CartAction(res1.data.cart);
      //             alert("cart berhasil");
      //           })
      //           .catch((err) => {
      //             console.log(err);
      //           });
      //       }
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    }
  };

  renderImage_detail = () => {
    const image_Detail = JSON.parse(this.state.product.image_detail);
    console.log(image_Detail);
    if (image_Detail) {
      return image_Detail.map((val, index) => {
        return (
          <img
            key={index}
            src={API_URL + val}
            alt="product"
            width="20%"
            className="mx-3"
            height="80px"
          />
        );
      });
    }
  };
  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <div>
        <Header />

        <div className="container">
          <div className="bg-transparent">
            <Breadcrumb className="mt-5 bg-transparent">
              <BreadcrumbItem>
                <Link to="/">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/products">Product</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{this.state.product.name}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="row mt-2">
            <div className="col-md-6 shadow">
              <img
                src={API_URL + this.state.product.image}
                alt="product"
                width="100%"
                height="400vh"
              />
              <div className="my-3">{this.renderImage_detail()}</div>
            </div>
            <div className="col-md-6">
              <div className=" display-4 my-2">{this.state.product.name}</div>
              <div className="my-2" style={{ fontSize: "30px" }}>
                {this.state.product.tahun}
              </div>
              <div className="my-2" style={{ fontSize: "30px" }}>
                {this.state.product.namacategory}
              </div>
              <div
                className="font-weight-bold my-2"
                style={{ fontSize: "35px" }}
              >
                {currencyFormatter(this.state.product.price * this.state.qty)}
              </div>
              <div className="d-flex">
                <Button
                  className="py-2 px-2 "
                  style={{ fontSize: 35, width: "50px" }}
                  onClick={() => this.onQtyClick("kurang")}
                >
                  -
                </Button>
                <div
                  className="w-25 d-flex justify-content-center align-items-center"
                  style={{ fontSize: 35 }}
                >
                  {this.state.qty}
                </div>
                <Button
                  className="py-2 px-2 "
                  style={{ fontSize: 35, width: "50px" }}
                  onClick={() => this.onQtyClick("tambah")}
                >
                  +
                </Button>
              </div>
              <div className="my-3">
                <Button className="w-50 py-2" onClick={this.onAddToCartClick}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};
export default connect(MaptstatetoProps, { CartAction })(ProductDetail);
