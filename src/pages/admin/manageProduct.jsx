import React, { Component } from "react";
import Header from "../../components/header";
import Button from "../../components/button";
import {
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  InputGroup,
  Button as ButtonStrap,
  Pagination,
  PaginationItem,
  CustomInput,
} from "reactstrap";
import axios from "axios";
import { API_URL, currencyFormatter } from "../../helper";
import { FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import Loading from "./../../components/loading";
import withReactContent from "sweetalert2-react-content";
import { connect } from "react-redux";
import NotFound from "../notfound";
const Myswal = withReactContent(Swal);
class ManageProduct extends Component {
  state = {
    products: [],
    AddData: {
      name: "",
      tahun: "",
      harga: "",
      deskripsi: "",
      categoryId: 0,
      qty: "",
    },
    addimage: null,
    addimage_detail: [null],
    categories: [],
    modalAdd: false,
    page: 1,
    totaldata: 0,
    limit: 5,
    isLoading: true,
    nameSearch: "",
  };

  componentDidMount() {
    axios
      .get(`${API_URL}/product/admin?pages=${this.state.page}&limit=5 `)
      .then((res) => {
        axios
          .get(`${API_URL}/product/category`)
          .then((res1) => {
            console.log(res1, "category");
            this.setState({
              products: res.data,
              categories: res1.data,
              totaldata: res.headers["x-total-count"],
              isLoading: false,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate(prevprops, prevstate) {
    if (this.state.page !== prevstate.page) {
      axios
        .get(`${API_URL}/product/admin?pages=${this.state.page}&limit=5 `)
        .then((res) => {
          this.setState({
            products: res.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  renderProducts = () => {
    if (this.state.products.length === 0) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            height: "63vh",
            width: "243%",
            backgroundColor: "lightgray",
          }}
        >
          <h1>Data Tidak Ditemukan</h1>
        </div>
      );
    }
    return this.state.products.map((val, index) => {
      let x = 5 * (this.state.page - 1);
      return (
        <tr key={val.id}>
          <td width="100px">{x + index + 1}</td>
          <td width="100px">{val.name}</td>
          <td width="200px">
            <img
              src={API_URL + val.image}
              alt={val.name}
              width="200px"
              height="150px"
            />
          </td>
          <td width="50px">{val.tahun}</td>
          <td width="150px">{currencyFormatter(val.price)}</td>
          <td width="120px">{val.namacategory}</td>
          <td width="120px">{val.qty}</td>
          <td>{val.description}</td>
          <td>
            <span className="mx-2 text-primary">
              <FaEdit />
            </span>
            <span
              onClick={() => this.OnDeleteClick(index)}
              className="mx-2 text-danger"
            >
              <FaTrash />
            </span>
          </td>
        </tr>
      );
    });
  };

  renderCategories = () => {
    return this.state.categories.map((val, index) => {
      return (
        <option value={val.id} key={index}>
          {val.name}
        </option>
      );
    });
  };

  renderPaging = () => {
    let { limit, totaldata, page } = this.state;
    let berapaPaging = Math.ceil(totaldata / limit);
    let paging = [];
    for (let i = 0; i < berapaPaging; i++) {
      if (i + 1 === page) {
        paging.push(
          <PaginationItem active>
            <button className="btn btn-primary">{i + 1}</button>
          </PaginationItem>
        );
      } else {
        paging.push(
          <PaginationItem onClick={() => this.setState({ page: i + 1 })}>
            <button className="btn btn-outline-primary">{i + 1}</button>
          </PaginationItem>
        );
      }
    }
    return paging;
  };
  renderInput = () => {
    return this.state.addimage_detail.map((val, index) => {
      if (index === this.state.addimage_detail.length - 1) {
        return (
          <div>
            {val ? (
              <img src={URL.createObjectURL(val)} alt="foto" height="200px" />
            ) : null}
            <InputGroup key={index}>
              <input
                className="my-1 form-control"
                type="file"
                onChange={(e) => this.onAddDetailFileChange(e, index)}
              />
              <button className="btn btn-success" onClick={this.onTambahFile}>
                +
              </button>
            </InputGroup>
          </div>
        );
      } else if (this.state.addimage_detail.length != 1) {
        return (
          <div>
            {val ? (
              <img src={URL.createObjectURL(val)} alt="foto" height="200px" />
            ) : null}
            <InputGroup key={index}>
              <input
                className="my-1 form-control"
                type="file"
                onChange={(e) => this.onAddDetailFileChange(e, index)}
              />
              <button
                className="btn btn-danger"
                onClick={() => this.onHapusFile(index)}
              >
                X
              </button>
            </InputGroup>
          </div>
        );
      }
    });
  };

  toggle = () => {
    this.setState({ modalAdd: !this.state.modalAdd });
  };

  onAddDataChange = (e) => {
    let AddDatamute = this.state.AddData;
    AddDatamute[e.target.name] = e.target.value;
    this.setState({ AddData: AddDatamute });
  };

  onAddFileChange = (e) => {
    console.log(e.target.files);
    if (e.target.files[0]) {
      this.setState({
        addimage: e.target.files[0],
      });
    } else {
      // let newAdddata = { ...this.state.AddData, image: null };
      this.setState({ addimage: null });
    }
  };

  onAddDataClick = () => {
    const { name, categoryId, deskripsi, harga, tahun } = this.state.AddData;
    const image = this.state.addimage;
    let image_detail = this.state.addimage_detail;
    let dataPost = this.state.AddData;
    if (name && categoryId && deskripsi && harga && tahun && image) {
      let formData = new FormData();
      formData.append("data", JSON.stringify(dataPost));
      formData.append("imagebg", image);
      image_detail = image_detail.filter((val) => val != null);
      image_detail.forEach((val) => {
        formData.append("imagedetail", val);
      });
      axios
        .post(`${API_URL}/product/admin`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          axios
            .get(`${API_URL}/product/admin?pages=${this.state.page}&limit=5 `)
            .then((res1) => {
              this.setState({
                products: res1.data,
                modalAdd: false,
                totaldata: res1.headers["x-total-count"],
                addimage: null,
                addimage_detail: [null],
                AddData: {
                  name: "",
                  tahun: "",
                  harga: "",
                  deskripsi: "",
                  categoryId: 0,
                },
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("harus diisi bro");
    }
  };

  OnDeleteClick = (index) => {
    let id = this.state.products[index].idproducts;
    let namaProd = this.state.products[index].name;
    Myswal.fire({
      title: `Are you sure wanna Delete ${namaProd} ?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/product/admin/${id}`)
          .then(() => {
            axios
              .get(`${API_URL}/product/admin?pages=${this.state.page}&limit=5 `)
              .then((res1) => {
                this.setState({
                  products: res1.data,
                  totaldata: res1.headers["x-total-count"],
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  onSearchChange = (e) => {
    this.setState({ nameSearch: e.target.value });
    axios
      .get(
        `${API_URL}/products?_expand=category&_page=1&_limit=5&name_like=${e.target.value}`
      )
      .then((res) => {
        this.setState({
          products: res.data,
          totaldata: res.headers["x-total-count"],
          page: 1,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onAddDetailFileChange = (e, index) => {
    console.log(e.target.files);
    let addfileDetail = this.state.addimage_detail;
    if (e.target.files[0]) {
      addfileDetail.splice(index, 1, e.target.files[0]);
    } else {
      addfileDetail.splice(index, 1, null);
    }
    this.setState({
      addimage_detail: addfileDetail,
    });
  };
  onTambahFile = () => {
    let initfile = this.state.addimage_detail;
    initfile.push(null);
    this.setState({ addimage_detail: initfile });
  };
  onHapusFile = (index) => {
    let initfile = this.state.addimage_detail;
    initfile.splice(index, 1);
    this.setState({ addimage_detail: initfile });
  };

  render() {
    if (this.props.dataUser.role !== "admin") {
      return <NotFound />;
    }
    if (this.state.isLoading) {
      return (
        <div>
          <Header />
          <Loading />
        </div>
      );
    }
    return (
      <div>
        <Header />
        <Modal
          size="xl"
          scrollable
          isOpen={this.state.modalAdd}
          toggle={this.toggle}
        >
          <ModalHeader className="warna" toggle={this.toggle}>
            Add Data
          </ModalHeader>
          <ModalBody>
            <input
              className="form-control my-1"
              type="text"
              name="name"
              value={this.state.AddData.name}
              placeholder="Nama Product"
              onChange={this.onAddDataChange}
            />
            {this.state.addimage ? (
              <img
                src={URL.createObjectURL(this.state.addimage)}
                alt="foto"
                height="200px"
              />
            ) : null}
            <CustomInput
              className="my-1"
              label={
                this.state.addimage ? this.state.addimage.filename : "no file"
              }
              type="file"
              onChange={this.onAddFileChange}
            />
            <input
              className="form-control my-1"
              type="number"
              name="tahun"
              placeholder="Tahun"
              value={this.state.AddData.tahun}
              onChange={this.onAddDataChange}
            />
            <input
              className="form-control my-1"
              type="number"
              name="qty"
              placeholder="qty"
              value={this.state.AddData.qty}
              onChange={this.onAddDataChange}
            />
            <InputGroup>
              <input
                className="form-control my-1"
                type="number"
                name="harga"
                placeholder="Harga dalam juta"
                value={this.state.AddData.harga}
                onChange={this.onAddDataChange}
              />
              <ButtonStrap color="light">Juta</ButtonStrap>
            </InputGroup>
            <select
              className="form-control my-1"
              name="categoryId"
              value={this.state.AddData.categoryId}
              onChange={this.onAddDataChange}
            >
              <option value="0" selected hidden>
                Pilih Category
              </option>
              {this.renderCategories()}
            </select>
            <div className="d-flex">{this.renderInput()}</div>
            <textarea
              className="form-control my-1"
              name="deskripsi"
              placeholder="deskripsi"
              value={this.state.AddData.deskripsi}
              cols="30"
              rows="10"
              onChange={this.onAddDataChange}
            ></textarea>
          </ModalBody>
          <ModalFooter>
            <Button className="px-4 py-2" onClick={this.onAddDataClick}>
              Add Data
            </Button>
          </ModalFooter>
        </Modal>

        <div className="mx-5 my-3">
          <Button
            className="px-4 py-2"
            onClick={() => this.setState({ modalAdd: true })}
          >
            Add Data
          </Button>
          <div className="my-2" style={{ width: "30%" }}>
            <input
              type="search"
              className="form-control"
              placeholder="nama products"
              value={this.state.nameSearch}
              onChange={this.onSearchChange}
            />
          </div>
          <Table className="mt-3 w-100" striped>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama Product</th>
                <th>Foto</th>
                <th>Thn</th>
                <th>Harga</th>
                <th>Category</th>
                <th>qty</th>
                <th>Deskripsi</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderProducts()}</tbody>
          </Table>
          <div className="d-flex justify-content-center">
            <Pagination>{this.renderPaging()}</Pagination>
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
export default connect(MaptstatetoProps)(ManageProduct);
