import React, { useEffect, useContext } from "react";
import { WhaleContext } from "../Context/WhaleContext";
import ControlPanel from "../../Conponents/EtherScan/ControlPanel";
import TopBar from "../../Conponents/EtherScan/TopBar";

const Dashboard2 = () => {
  const { whale, setWhale } = useContext(WhaleContext);
  const checkBalance = async (event) => {
    event.preventDefault();
    console.log("foo");
    const endpoint = "whalehunter/balance";
    try {
      let response = await fetch(`/${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        setWhale(jsonResponse);
      }
    } catch (e) {
      console.log("check whale balance error is ", e);
    }
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Dashboard v2</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Dashboard v2</li>
              </ol>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {/* Info boxes */}
          <TopBar></TopBar>
          {/* Main row */}
          <div className="row">
            {/* Left col */}
            <div className="col-md-8">
              {/* MAP & BOX PANE */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">US-Visitors Report</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="remove"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
                {/* /.card-header */}
                <ControlPanel
                  handleScan={checkBalance}
                  whale={whale}
                ></ControlPanel>
                {/* /.card-body */}
              </div>
              {/* /.card */}
              {/* TABLE: LATEST ORDERS */}
              <div className="card">
                <div className="card-header border-transparent">
                  <h3 className="card-title">Latest Orders</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="remove"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
                {/* /.card-header */}
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table m-0">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Item</th>
                          <th>Status</th>
                          <th>Popularity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <a href="pages/examples/invoice.html">OR9842</a>
                          </td>
                          <td>Call of Duty IV</td>
                          <td>
                            <span className="badge badge-success">Shipped</span>
                          </td>
                          <td>
                            <div
                              className="sparkbar"
                              data-color="#00a65a"
                              data-height={20}
                            >
                              90,80,90,-70,61,-83,63
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <a href="pages/examples/invoice.html">OR1848</a>
                          </td>
                          <td>Samsung Smart TV</td>
                          <td>
                            <span className="badge badge-warning">Pending</span>
                          </td>
                          <td>
                            <div
                              className="sparkbar"
                              data-color="#f39c12"
                              data-height={20}
                            >
                              90,80,-90,70,61,-83,68
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <a href="pages/examples/invoice.html">OR7429</a>
                          </td>
                          <td>iPhone 6 Plus</td>
                          <td>
                            <span className="badge badge-danger">
                              Delivered
                            </span>
                          </td>
                          <td>
                            <div
                              className="sparkbar"
                              data-color="#f56954"
                              data-height={20}
                            >
                              90,-80,90,70,-61,83,63
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <a href="pages/examples/invoice.html">OR7429</a>
                          </td>
                          <td>Samsung Smart TV</td>
                          <td>
                            <span className="badge badge-info">Processing</span>
                          </td>
                          <td>
                            <div
                              className="sparkbar"
                              data-color="#00c0ef"
                              data-height={20}
                            >
                              90,80,-90,70,-61,83,63
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <a href="pages/examples/invoice.html">OR1848</a>
                          </td>
                          <td>Samsung Smart TV</td>
                          <td>
                            <span className="badge badge-warning">Pending</span>
                          </td>
                          <td>
                            <div
                              className="sparkbar"
                              data-color="#f39c12"
                              data-height={20}
                            >
                              90,80,-90,70,61,-83,68
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <a href="pages/examples/invoice.html">OR7429</a>
                          </td>
                          <td>iPhone 6 Plus</td>
                          <td>
                            <span className="badge badge-danger">
                              Delivered
                            </span>
                          </td>
                          <td>
                            <div
                              className="sparkbar"
                              data-color="#f56954"
                              data-height={20}
                            >
                              90,-80,90,70,-61,83,63
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <a href="pages/examples/invoice.html">OR9842</a>
                          </td>
                          <td>Call of Duty IV</td>
                          <td>
                            <span className="badge badge-success">Shipped</span>
                          </td>
                          <td>
                            <div
                              className="sparkbar"
                              data-color="#00a65a"
                              data-height={20}
                            >
                              90,80,90,-70,61,-83,63
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* /.table-responsive */}
                </div>
                {/* /.card-body */}
                <div className="card-footer clearfix">
                  <a href="/" className="btn btn-sm btn-info float-left">
                    Place New Order
                  </a>
                  <a href="/" className="btn btn-sm btn-secondary float-right">
                    View All Orders
                  </a>
                </div>
                {/* /.card-footer */}
              </div>
              {/* /.card */}
            </div>
            {/* /.col */}
            <div className="col-md-4">
              {/* Info Boxes Style 2 */}
              <div className="info-box mb-3 bg-warning">
                <span className="info-box-icon">
                  <i className="fas fa-tag" />
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Inventory</span>
                  <span className="info-box-number">5,200</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
              <div className="info-box mb-3 bg-success">
                <span className="info-box-icon">
                  <i className="far fa-heart" />
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Mentions</span>
                  <span className="info-box-number">92,050</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
              <div className="info-box mb-3 bg-danger">
                <span className="info-box-icon">
                  <i className="fas fa-cloud-download-alt" />
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Downloads</span>
                  <span className="info-box-number">114,381</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
              <div className="info-box mb-3 bg-info">
                <span className="info-box-icon">
                  <i className="far fa-comment" />
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Direct Messages</span>
                  <span className="info-box-number">163,921</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* PRODUCT LIST */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recently Added Products</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="remove"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
                {/* /.card-header */}
                <div className="card-body p-0">
                  <ul className="products-list product-list-in-card pl-2 pr-2">
                    <li className="item">
                      <div className="product-img">
                        <img
                          src="dist/img/default-150x150.png"
                          alt="Product"
                          className="img-size-50"
                        />
                      </div>
                      <div className="product-info">
                        <a href="/" className="product-title">
                          Samsung TV
                          <span className="badge badge-warning float-right">
                            $1800
                          </span>
                        </a>
                        <span className="product-description">
                          Samsung 32" 1080p 60Hz LED Smart HDTV.
                        </span>
                      </div>
                    </li>
                    {/* /.item */}
                    <li className="item">
                      <div className="product-img">
                        <img
                          src="dist/img/default-150x150.png"
                          alt="Product"
                          className="img-size-50"
                        />
                      </div>
                      <div className="product-info">
                        <a href="/" className="product-title">
                          Bicycle
                          <span className="badge badge-info float-right">
                            $700
                          </span>
                        </a>
                        <span className="product-description">
                          26" Mongoose Dolomite Men's 7-speed, Navy Blue.
                        </span>
                      </div>
                    </li>
                    {/* /.item */}
                    <li className="item">
                      <div className="product-img">
                        <img
                          src="dist/img/default-150x150.png"
                          alt="Product"
                          className="img-size-50"
                        />
                      </div>
                      <div className="product-info">
                        <a href="/" className="product-title">
                          Xbox One{" "}
                          <span className="badge badge-danger float-right">
                            $350
                          </span>
                        </a>
                        <span className="product-description">
                          Xbox One Console Bundle with Halo Master Chief
                          Collection.
                        </span>
                      </div>
                    </li>
                    {/* /.item */}
                    <li className="item">
                      <div className="product-img">
                        <img
                          src="dist/img/default-150x150.png"
                          alt="Product"
                          className="img-size-50"
                        />
                      </div>
                      <div className="product-info">
                        <a href="/" className="product-title">
                          PlayStation 4
                          <span className="badge badge-success float-right">
                            $399
                          </span>
                        </a>
                        <span className="product-description">
                          PlayStation 4 500GB Console (PS4)
                        </span>
                      </div>
                    </li>
                    {/* /.item */}
                  </ul>
                </div>
                {/* /.card-body */}
                <div className="card-footer text-center">
                  <a href="/" className="uppercase">
                    View All Products
                  </a>
                </div>
                {/* /.card-footer */}
              </div>
              {/* /.card */}
            </div>
            {/* /.col */}
          </div>
          /.row
        </div>
        {/*/. container-fluid */}
      </section>
      {/* /.content */}
    </div>
  );
};

export default Dashboard2;
